import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import pool, { initDatabase, query } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Servir archivos estáticos del frontend
app.use(express.static(__dirname));

// Ruta principal → cargar la interfaz de FARMABOL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'FARMABOL.html'));
});

// Inicializar la base de datos
try {
  await initDatabase();
  console.log('Base de datos inicializada correctamente.');
} catch (error) {
  console.error('No se pudo inicializar la base de datos:', error.message);
}

// ----------------------------------------------------------------
// 1. Autenticación (Login)
// ----------------------------------------------------------------
app.post('/api/auth/login', async (req, res) => {
  const { usuario, pass } = req.body;
  try {
    const result = await query(
      'SELECT id, usuario, nombre, rol, sucursal FROM usuarios WHERE usuario = $1 AND pass = $2',
      [usuario, pass]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos.' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor al intentar autenticar.', error: err.message });
  }
});

// ----------------------------------------------------------------
// 2. Obtener el estado completo (usuarios, productos, ventas)
// ----------------------------------------------------------------
app.get('/api/state', async (req, res) => {
  try {
    const usuariosRes = await query('SELECT id, usuario, nombre, rol, sucursal FROM usuarios');
    const productosRes = await query('SELECT id, codigo, nombre, precio, stock, laboratorio, categoria FROM productos ORDER BY id ASC');
    
    // Obtener ventas
    const ventasRes = await query('SELECT id, fecha, vendedor, total FROM ventas ORDER BY id DESC');
    const ventas = ventasRes.rows;

    // Para cada venta, obtener sus detalles de venta
    for (let i = 0; i < ventas.length; i++) {
      const v = ventas[i];
      const itemsRes = await query(
        'SELECT codigo, nombre, cantidad, precio FROM detalle_ventas WHERE venta_id = $1',
        [v.id]
      );
      v.items = itemsRes.rows.map(item => ({
        ...item,
        precio: parseFloat(item.precio),
        cantidad: parseInt(item.cantidad)
      }));
      v.total = parseFloat(v.total);
      
      // Formatear la fecha a YYYY-MM-DD HH:MM para coincidir con la UI
      const dt = new Date(v.fecha);
      const yyyy = dt.getFullYear();
      const mm = String(dt.getMonth() + 1).padStart(2, '0');
      const dd = String(dt.getDate()).padStart(2, '0');
      const hh = String(dt.getHours()).padStart(2, '0');
      const min = String(dt.getMinutes()).padStart(2, '0');
      v.fecha = `${yyyy}-${mm}-${dd} ${hh}:${min}`;
    }

    // Convertir tipos numéricos en productos
    const productos = productosRes.rows.map(p => ({
      ...p,
      precio: parseFloat(p.precio),
      stock: parseInt(p.stock)
    }));

    res.json({
      usuarios: usuariosRes.rows,
      productos,
      ventas
    });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener el estado.', error: err.message });
  }
});

// ----------------------------------------------------------------
// 3. Productos CRUD (ADMIN)
// ----------------------------------------------------------------
app.post('/api/productos', async (req, res) => {
  const { codigo, nombre, precio, stock, laboratorio, categoria } = req.body;
  try {
    const checkRes = await query('SELECT 1 FROM productos WHERE codigo = $1', [codigo]);
    if (checkRes.rows.length > 0) {
      return res.status(400).json({ message: `El código de producto '${codigo}' ya existe.` });
    }

    const insertRes = await query(
      'INSERT INTO productos (codigo, nombre, precio, stock, laboratorio, categoria) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [codigo.toUpperCase(), nombre, parseFloat(precio), parseInt(stock), laboratorio, categoria]
    );

    const prod = insertRes.rows[0];
    prod.precio = parseFloat(prod.precio);
    prod.stock = parseInt(prod.stock);

    res.status(201).json(prod);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear el producto.', error: err.message });
  }
});

app.put('/api/productos/:id', async (req, res) => {
  const { id } = req.params;
  const { codigo, nombre, precio, stock, laboratorio, categoria } = req.body;
  try {
    const updateRes = await query(
      'UPDATE productos SET codigo = $1, nombre = $2, precio = $3, stock = $4, laboratorio = $5, categoria = $6 WHERE id = $7 RETURNING *',
      [codigo.toUpperCase(), nombre, parseFloat(precio), parseInt(stock), laboratorio, categoria, id]
    );

    if (updateRes.rows.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    const prod = updateRes.rows[0];
    prod.precio = parseFloat(prod.precio);
    prod.stock = parseInt(prod.stock);

    res.json(prod);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar el producto.', error: err.message });
  }
});

app.delete('/api/productos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deleteRes = await query('DELETE FROM productos WHERE id = $1 RETURNING *', [id]);
    if (deleteRes.rows.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }
    res.json({ message: 'Producto eliminado con éxito.', producto: deleteRes.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar el producto.', error: err.message });
  }
});

// ----------------------------------------------------------------
// 4. Registro de Ventas (Código Refactorizado / DESPUÉS de Refactorizar)
// ----------------------------------------------------------------
// [✓] MEJORA DE CALIDAD: Este endpoint utiliza transacciones atómicas (BEGIN/COMMIT/ROLLBACK)
// y SELECT FOR UPDATE para bloquear las filas durante la validación de stock.
// Si ocurre un error o el stock es insuficiente, la transacción se aborta por completo (ROLLBACK),
// manteniendo la consistencia de la base de datos sin deducciones de stock huérfanas.
app.post('/api/ventas', async (req, res) => {
  const { items, vendedor } = req.body;
  
  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'La venta debe contener al menos un producto.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    let totalVenta = 0;
    const itemsProcesados = [];

    // 1. Validar stock y bloquear filas para prevenir condiciones de carrera
    for (const it of items) {
      const prodRes = await client.query(
        'SELECT id, stock, nombre, precio FROM productos WHERE codigo = $1 FOR UPDATE',
        [it.codigo]
      );
      
      if (prodRes.rows.length === 0) {
        throw new Error(`El producto con código ${it.codigo} no existe.`);
      }

      const prod = prodRes.rows[0];

      if (parseInt(prod.stock) < it.cantidad) {
        throw new Error(`Stock insuficiente para ${prod.nombre}. Disponible: ${prod.stock}, Solicitado: ${it.cantidad}`);
      }

      const precioReal = parseFloat(prod.precio);
      totalVenta += it.cantidad * precioReal;

      itemsProcesados.push({
        id: prod.id,
        codigo: it.codigo,
        nombre: prod.nombre,
        cantidad: it.cantidad,
        precio: precioReal
      });
    }

    // 2. Insertar la cabecera de la venta
    const ventaRes = await client.query(
      'INSERT INTO ventas (vendedor, total) VALUES ($1, $2) RETURNING id',
      [vendedor, totalVenta]
    );
    const ventaId = ventaRes.rows[0].id;

    // 3. Descontar stock e insertar detalles
    for (const it of itemsProcesados) {
      await client.query(
        'UPDATE productos SET stock = stock - $1 WHERE id = $2',
        [it.cantidad, it.id]
      );

      await client.query(
        'INSERT INTO detalle_ventas (venta_id, producto_id, codigo, nombre, cantidad, precio) VALUES ($1, $2, $3, $4, $5, $6)',
        [ventaId, it.id, it.codigo, it.nombre, it.cantidad, it.precio]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({ id: ventaId, total: totalVenta });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(400).json({ message: err.message });
  } finally {
    client.release();
  }
});

// ----------------------------------------------------------------
// 5. Restablecer Base de Datos (Tweaks Reset)
// ----------------------------------------------------------------
app.post('/api/reset', async (req, res) => {
  try {
    // Eliminar las tablas existentes para forzar su recreación
    await query('DROP TABLE IF EXISTS detalle_ventas CASCADE');
    await query('DROP TABLE IF EXISTS ventas CASCADE');
    await query('DROP TABLE IF EXISTS productos CASCADE');
    await query('DROP TABLE IF EXISTS usuarios CASCADE');
    
    // Inicializar nuevamente
    await initDatabase();
    
    res.json({ message: 'Base de datos restablecida con éxito a los datos semilla.' });
  } catch (err) {
    res.status(500).json({ message: 'Error al restablecer la base de datos.', error: err.message });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor de FARMABOL corriendo en http://localhost:${PORT}`);
});
