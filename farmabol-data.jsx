// FARMABOL — Data store with localStorage persistence.
// Simulates the 3-table relational model: usuarios, productos, ventas (+ detalle_venta embedded).
// This is the "base de datos" of the prototype.

const STORE_KEY = 'farmabol_v1';
const TODAY = '2026-06-05';

// ---- Seed data (Bolivian pharmacy) ----
const seedUsuarios = [
  { id: 1, usuario: "admin", nombre: "Carlos Mendoza", rol: "ADMIN", sucursal: "Central La Paz", pass: "admin123" },
  { id: 2, usuario: "vendedor", nombre: "Ana Quispe", rol: "VENDEDOR", sucursal: "Sucursal Miraflores", pass: "venta123" },
];

const seedProductos = [
  { id: 1,  codigo: "PARA-500", nombre: "Paracetamol 500mg x10", precio: 8.50, stock: 142, laboratorio: "Inti", categoria: "Analgésico" },
  { id: 2,  codigo: "IBUP-400", nombre: "Ibuprofeno 400mg x10", precio: 12.00, stock: 88, laboratorio: "Bagó", categoria: "Antiinflamatorio" },
  { id: 3,  codigo: "AMOX-500", nombre: "Amoxicilina 500mg x12", precio: 35.00, stock: 4, laboratorio: "Vita", categoria: "Antibiótico" },
  { id: 4,  codigo: "OMEP-20",  nombre: "Omeprazol 20mg x14", precio: 28.50, stock: 56, laboratorio: "Inti", categoria: "Gastrointestinal" },
  { id: 5,  codigo: "LORA-10",  nombre: "Loratadina 10mg x10", precio: 15.00, stock: 3, laboratorio: "Bagó", categoria: "Antialérgico" },
  { id: 6,  codigo: "METF-850", nombre: "Metformina 850mg x30", precio: 42.00, stock: 67, laboratorio: "Vita", categoria: "Antidiabético" },
  { id: 7,  codigo: "ENAL-10",  nombre: "Enalapril 10mg x20", precio: 24.00, stock: 39, laboratorio: "Inti", categoria: "Antihipertensivo" },
  { id: 8,  codigo: "SALB-INH", nombre: "Salbutamol inhalador", precio: 58.00, stock: 22, laboratorio: "Bayer", categoria: "Respiratorio" },
  { id: 9,  codigo: "AMOX-SUS", nombre: "Amoxicilina susp. 250mg", precio: 32.50, stock: 2, laboratorio: "Vita", categoria: "Antibiótico" },
  { id: 10, codigo: "DICL-50",  nombre: "Diclofenaco 50mg x20", precio: 18.00, stock: 95, laboratorio: "Bagó", categoria: "Antiinflamatorio" },
  { id: 11, codigo: "VITC-1G",  nombre: "Vitamina C 1g efervesc.", precio: 22.00, stock: 110, laboratorio: "Bayer", categoria: "Suplemento" },
  { id: 12, codigo: "AZIT-500", nombre: "Azitromicina 500mg x3", precio: 45.00, stock: 1, laboratorio: "Inti", categoria: "Antibiótico" },
  { id: 13, codigo: "RANI-150", nombre: "Ranitidina 150mg x20", precio: 16.50, stock: 48, laboratorio: "Vita", categoria: "Gastrointestinal" },
  { id: 14, codigo: "PARA-JBE", nombre: "Paracetamol jarabe niños", precio: 19.00, stock: 73, laboratorio: "Inti", categoria: "Analgésico" },
  { id: 15, codigo: "LOSA-50",  nombre: "Losartán 50mg x30", precio: 38.00, stock: 31, laboratorio: "Bagó", categoria: "Antihipertensivo" },
];

// Some pre-existing sales for today + earlier so the dashboard isn't empty
const seedVentas = [
  { id: 1001, fecha: TODAY + " 08:42", vendedor: "Ana Quispe", items: [{ codigo: "PARA-500", nombre: "Paracetamol 500mg x10", cantidad: 3, precio: 8.50 }, { codigo: "VITC-1G", nombre: "Vitamina C 1g efervesc.", cantidad: 1, precio: 22.00 }], total: 47.50 },
  { id: 1002, fecha: TODAY + " 09:15", vendedor: "Ana Quispe", items: [{ codigo: "IBUP-400", nombre: "Ibuprofeno 400mg x10", cantidad: 2, precio: 12.00 }], total: 24.00 },
  { id: 1003, fecha: TODAY + " 10:03", vendedor: "Carlos Mendoza", items: [{ codigo: "OMEP-20", nombre: "Omeprazol 20mg x14", cantidad: 1, precio: 28.50 }, { codigo: "DICL-50", nombre: "Diclofenaco 50mg x20", cantidad: 1, precio: 18.00 }], total: 46.50 },
  { id: 1004, fecha: TODAY + " 11:28", vendedor: "Ana Quispe", items: [{ codigo: "METF-850", nombre: "Metformina 850mg x30", cantidad: 2, precio: 42.00 }], total: 84.00 },
  { id: 1005, fecha: "2026-06-04 16:50", vendedor: "Ana Quispe", items: [{ codigo: "SALB-INH", nombre: "Salbutamol inhalador", cantidad: 1, precio: 58.00 }], total: 58.00 },
];

function defaultState() {
  return {
    usuarios: JSON.parse(JSON.stringify(seedUsuarios)),
    productos: JSON.parse(JSON.stringify(seedProductos)),
    ventas: JSON.parse(JSON.stringify(seedVentas)),
    nextProductId: 16,
    nextVentaId: 1006,
  };
}

// ---- Store with pub/sub ----
const listeners = new Set();
let state = null;

function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return defaultState();
}
function persist() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}
}
function emit() { persist(); listeners.forEach((l) => l()); }

const Store = {
  init() { if (!state) state = load(); return state; },
  get() { return state; },
  subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },

  reset() { state = defaultState(); emit(); },

  // ---- Productos CRUD ----
  addProducto(p) {
    state.productos.push({ ...p, id: state.nextProductId++ });
    emit();
  },
  updateProducto(id, patch) {
    state.productos = state.productos.map((p) => p.id === id ? { ...p, ...patch } : p);
    emit();
  },
  deleteProducto(id) {
    state.productos = state.productos.filter((p) => p.id !== id);
    emit();
  },

  // ---- Ventas ----
  registrarVenta(items, vendedor) {
    // items: [{codigo, nombre, cantidad, precio}]
    const total = items.reduce((s, it) => s + it.cantidad * it.precio, 0);
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const venta = {
      id: state.nextVentaId++,
      fecha: `${TODAY} ${hh}:${mm}`,
      vendedor,
      items: JSON.parse(JSON.stringify(items)),
      total,
    };
    state.ventas.unshift(venta);
    // descontar stock automáticamente
    items.forEach((it) => {
      const prod = state.productos.find((p) => p.codigo === it.codigo);
      if (prod) prod.stock = Math.max(0, prod.stock - it.cantidad);
    });
    emit();
    return venta;
  },

  // ---- Derived / reports ----
  ventasHoy() {
    return state.ventas.filter((v) => v.fecha.startsWith(TODAY));
  },
  totalVentasHoy() {
    return this.ventasHoy().reduce((s, v) => s + v.total, 0);
  },
  stockBajo(umbral = 5) {
    return state.productos.filter((p) => p.stock < umbral).sort((a, b) => a.stock - b.stock);
  },
  valorInventario() {
    return state.productos.reduce((s, p) => s + p.precio * p.stock, 0);
  },
  unidadesVendidasHoy() {
    return this.ventasHoy().reduce((s, v) => s + v.items.reduce((a, it) => a + it.cantidad, 0), 0);
  },
};

window.FarmabolStore = Store;
window.FARMABOL_TODAY = TODAY;
