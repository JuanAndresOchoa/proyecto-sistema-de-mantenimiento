// lib/database.ts
// Electron-only data access helpers.
// No imports, no dynamic imports — solo window.electronAPI — diseñado para empaquetado de escritorio.
// Devuelven siempre arrays (never undefined).

type AnyObj = Record<string, any>;

/**
 * Helper interno: intenta llamar a una función expuesta en window.electronAPI
 * Puedes exponer estas funciones desde preload.js usando contextBridge.exposeInMainWorld.
 *
 * - methodName: nombre de la función en electronAPI (ej: 'getMantenimientos')
 * - ipcChannelFallback: nombre del canal ipc.invoke si preload implementa invoke-style (ej: 'get-mantenimientos')
 */
async function callElectronMethod(
  methodName: string,
  ipcChannelFallback?: string
): Promise<AnyObj[]> {
  try {
    if (typeof window === 'undefined') {
      // Estamos en build/servidor: no intentar acceder a window
      return [];
    }

    const api = (window as any).electronAPI;
    if (!api) return [];

    // 1) Método expuesto directamente (recomendado)
    if (typeof api[methodName] === 'function') {
      try {
        const res = await api[methodName]();
        return Array.isArray(res) ? res : (res ? [res] : []);
      } catch (err) {
        console.error(`electronAPI.${methodName} threw:`, err);
        return [];
      }
    }

    // 2) Algunas preloads exponen un invoke genérico (por ejemplo api.invoke(channel))
    if (ipcChannelFallback && typeof api.invoke === 'function') {
      try {
        const res = await api.invoke(ipcChannelFallback);
        return Array.isArray(res) ? res : (res ? [res] : []);
      } catch (err) {
        console.error(`electronAPI.invoke(${ipcChannelFallback}) threw:`, err);
        return [];
      }
    }

    // 3) Si no hay nada que llamar, devolver array vacío
    return [];
  } catch (err) {
    console.error('callElectronMethod unexpected error', err);
    return [];
  }
}

/* ===========================
   Exported functions (public)
   =========================== */

/**
 * Devuelve la lista de mantenimientos.
 * Preload recommended name: window.electronAPI.getMantenimientos
 * IPC channel fallback: 'get-mantenimientos'
 */
export async function getMantenimientos(): Promise<AnyObj[]> {
  return callElectronMethod('getMantenimientos', 'get-mantenimientos');
}

/**
 * Devuelve la lista de alertas.
 * Preload recommended name: window.electronAPI.getAlertas
 * IPC channel fallback: 'get-alertas'
 */
export async function getAlertas(): Promise<AnyObj[]> {
  return callElectronMethod('getAlertas', 'get-alertas');
}

/**
 * Devuelve la lista de órdenes de trabajo.
 * Preload recommended name: window.electronAPI.getOrdenesTrabajo
 * IPC channel fallback: 'get-ordenes-trabajo'
 */
export async function getOrdenesTrabajo(): Promise<AnyObj[]> {
  return callElectronMethod('getOrdenesTrabajo', 'get-ordenes-trabajo');
}

/**
 * Devuelve la lista de costos.
 * Preload recommended name: window.electronAPI.getCostos
 * IPC channel fallback: 'get-costos'
 */
export async function getCostos(): Promise<AnyObj[]> {
  return callElectronMethod('getCostos', 'get-costos');
}

/* Export por defecto opcional */
export default {
  getMantenimientos,
  getAlertas,
  getOrdenesTrabajo,
  getCostos,
};
