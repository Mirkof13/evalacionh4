// FARMABOL — Data store connected to the PostgreSQL + Express backend.
// Replaces the original localStorage implementation with API requests.

const TODAY = '2026-06-05';

let state = {
  usuarios: [],
  productos: [],
  ventas: []
};

let loaded = false;
let loading = false;
const listeners = new Set();

function emit() {
  listeners.forEach((l) => l());
}

const Store = {
  // Inicialización: realiza la carga asíncrona del estado del servidor
  init() {
    if (!loaded && !loading) {
      loading = true;
      fetch('/api/state')
        .then((r) => {
          if (!r.ok) throw new Error('Error al obtener el estado');
          return r.json();
        })
        .then((data) => {
          state = data;
          loaded = true;
          loading = false;
          emit(); // Notificar a los componentes React
        })
        .catch((err) => {
          console.error('Error al inicializar FARMABOL Store:', err);
          loading = false;
        });
    }
    return state;
  },

  get() {
    return state;
  },

  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },

  // Restablecer la base de datos PostgreSQL a los datos semilla iniciales
  async reset() {
    const res = await fetch('/api/reset', { method: 'POST' });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Error al restablecer la base de datos');
    }
    const stateData = await fetch('/api/state').then((r) => r.json());
    state = stateData;
    emit();
  },

  // ---- Productos CRUD (API Backend) ----
  async addProducto(p) {
    const res = await fetch('/api/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(p)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Error al crear producto');
    }
    // Recargar el estado
    const stateData = await fetch('/api/state').then((r) => r.json());
    state = stateData;
    emit();
  },

  async updateProducto(id, patch) {
    const res = await fetch(`/api/productos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Error al actualizar producto');
    }
    // Recargar el estado
    const stateData = await fetch('/api/state').then((r) => r.json());
    state = stateData;
    emit();
  },

  async deleteProducto(id) {
    const res = await fetch(`/api/productos/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Error al eliminar producto');
    }
    // Recargar el estado
    const stateData = await fetch('/api/state').then((r) => r.json());
    state = stateData;
    emit();
  },

  // ---- Ventas (API Backend) ----
  async registrarVenta(items, vendedor) {
    const res = await fetch('/api/ventas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, vendedor })
    });
    
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Error al registrar la venta');
    }
    
    const venta = await res.json();
    
    // Recargar el estado para reflejar el descuento de stock y la nueva venta
    const stateData = await fetch('/api/state').then((r) => r.json());
    state = stateData;
    emit();
    
    return venta;
  },

  // ---- Consultas Derivadas (Sincrónicas sobre el estado cacheado) ----
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
