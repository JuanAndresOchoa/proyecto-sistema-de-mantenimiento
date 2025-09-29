'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

/**
 * AppContext: proveedor de datos de la app
 *
 * - Inicializa arrays como [] para evitar errores durante prerender.
 * - Provee funciones reloadX que intentan usar window.electronAPI.
 * - Esta versión NO hace imports dinámicos para evitar errores de webpack en build.
 */

/* -------------------------
   Tipos
   ------------------------- */
type AnyObject = Record<string, any>;

export type AppContextType = {
  // Datos principales
  equipos: AnyObject[];
  mantenimientos: AnyObject[];
  alertas: AnyObject[];
  ordenesTrabajo: AnyObject[];
  costos: AnyObject[];

  // Estado
  loading: boolean;
  error?: string | null;

  // Reload / fetch
  reloadEquipos: () => Promise<void>;
  reloadMantenimientos: () => Promise<void>;
  reloadAlertas: () => Promise<void>;
  reloadOrdenesTrabajo: () => Promise<void>;
  reloadCostos: () => Promise<void>;

  // Helper/otros (puedes agregar mutadores aquí si tu UI los requiere)
  setEquipos: React.Dispatch<React.SetStateAction<AnyObject[]>>;
  setMantenimientos: React.Dispatch<React.SetStateAction<AnyObject[]>>;
  setAlertas: React.Dispatch<React.SetStateAction<AnyObject[]>>;
  setOrdenesTrabajo: React.Dispatch<React.SetStateAction<AnyObject[]>>;
  setCostos: React.Dispatch<React.SetStateAction<AnyObject[]>>;
};

const DEFAULT_CTX: AppContextType = {
  equipos: [],
  mantenimientos: [],
  alertas: [],
  ordenesTrabajo: [],
  costos: [],

  loading: false,
  error: null,

  reloadEquipos: async () => {},
  reloadMantenimientos: async () => {},
  reloadAlertas: async () => {},
  reloadOrdenesTrabajo: async () => {},
  reloadCostos: async () => {},

  setEquipos: () => {},
  setMantenimientos: () => {},
  setAlertas: () => {},
  setOrdenesTrabajo: () => {},
  setCostos: () => {},
};

const AppContext = createContext<AppContextType>(DEFAULT_CTX);

/* -------------------------
   Helper: obtener "dbService"
   ------------------------- */
/**
 * Versión segura para build: solo intenta acceder a window.electronAPI.
 * NO hace import dinámico alguno para evitar que webpack intente resolver módulos
 * que solo existen en runtime de Electron.
 */
async function getDbService(): Promise<any | null> {
  try {
    if (typeof window !== 'undefined' && (window as any).electronAPI) {
      return (window as any).electronAPI;
    }
    return null;
  } catch (err) {
    console.warn('getDbService error', err);
    return null;
  }
}

/* -------------------------
   Provider
   ------------------------- */
export function AppProvider({ children }: { children: ReactNode }) {
  // Datos: inicializados como arrays para evitar errores en prerender
  const [equipos, setEquipos] = useState<AnyObject[]>([]);
  const [mantenimientos, setMantenimientos] = useState<AnyObject[]>([]);
  const [alertas, setAlertas] = useState<AnyObject[]>([]);
  const [ordenesTrabajo, setOrdenesTrabajo] = useState<AnyObject[]>([]);
  const [costos, setCostos] = useState<AnyObject[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* -------------------------
     Funciones reloadX — intentan obtener datos del servicio si existe
     ------------------------- */
  const reloadEquipos = async () => {
    try {
      setLoading(true);
      setError(null);
      const svc = await getDbService();
      let res: any = [];
      if (svc) {
        if (typeof svc.getEquipos === 'function') {
          res = await svc.getEquipos();
        } else if (typeof svc.getAllEquipos === 'function') {
          res = await svc.getAllEquipos();
        } else if (typeof svc.fetchEquipos === 'function') {
          res = await svc.fetchEquipos();
        }
      }
      setEquipos(Array.isArray(res) ? res : []);
    } catch (e: any) {
      console.error('reloadEquipos error', e);
      setError(String(e?.message ?? e));
      setEquipos([]);
    } finally {
      setLoading(false);
    }
  };

  const reloadMantenimientos = async () => {
    try {
      setLoading(true);
      setError(null);
      const svc = await getDbService();
      let res: any = [];
      if (svc) {
        if (typeof svc.getMantenimientos === 'function') {
          res = await svc.getMantenimientos();
        } else if (typeof svc.fetchMantenimientos === 'function') {
          res = await svc.fetchMantenimientos();
        }
      }
      setMantenimientos(Array.isArray(res) ? res : []);
    } catch (e: any) {
      console.error('reloadMantenimientos error', e);
      setError(String(e?.message ?? e));
      setMantenimientos([]);
    } finally {
      setLoading(false);
    }
  };

  const reloadAlertas = async () => {
    try {
      setLoading(true);
      setError(null);
      const svc = await getDbService();
      let res: any = [];
      if (svc) {
        if (typeof svc.getAlertas === 'function') {
          res = await svc.getAlertas();
        } else if (typeof svc.fetchAlertas === 'function') {
          res = await svc.fetchAlertas();
        }
      }
      setAlertas(Array.isArray(res) ? res : []);
    } catch (e: any) {
      console.error('reloadAlertas error', e);
      setError(String(e?.message ?? e));
      setAlertas([]);
    } finally {
      setLoading(false);
    }
  };

  const reloadOrdenesTrabajo = async () => {
    try {
      setLoading(true);
      setError(null);
      const svc = await getDbService();
      let res: any = [];
      if (svc) {
        if (typeof svc.getOrdenesTrabajo === 'function') {
          res = await svc.getOrdenesTrabajo();
        } else if (typeof svc.fetchOrdenes === 'function') {
          res = await svc.fetchOrdenes();
        }
      }
      setOrdenesTrabajo(Array.isArray(res) ? res : []);
    } catch (e: any) {
      console.error('reloadOrdenesTrabajo error', e);
      setError(String(e?.message ?? e));
      setOrdenesTrabajo([]);
    } finally {
      setLoading(false);
    }
  };

  const reloadCostos = async () => {
    try {
      setLoading(true);
      setError(null);
      const svc = await getDbService();
      let res: any = [];
      if (svc) {
        if (typeof svc.getCostos === 'function') {
          res = await svc.getCostos();
        } else if (typeof svc.fetchCostos === 'function') {
          res = await svc.fetchCostos();
        }
      }
      setCostos(Array.isArray(res) ? res : []);
    } catch (e: any) {
      console.error('reloadCostos error', e);
      setError(String(e?.message ?? e));
      setCostos([]);
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------
     Opcional: cargar datos al montar en cliente (no en prerender)
     Si prefieres evitar llamadas automáticas, coméntala.
     ------------------------- */
  useEffect(() => {
    // Solo en cliente
    if (typeof window === 'undefined') return;

    const t = setTimeout(() => {
      reloadEquipos();
      reloadMantenimientos();
      reloadAlertas();
      reloadOrdenesTrabajo();
      reloadCostos();
    }, 50);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* -------------------------
     value que se proporciona a la app
     ------------------------- */
  const value: AppContextType = {
    equipos,
    mantenimientos,
    alertas,
    ordenesTrabajo,
    costos,

    loading,
    error,

    reloadEquipos,
    reloadMantenimientos,
    reloadAlertas,
    reloadOrdenesTrabajo,
    reloadCostos,

    setEquipos,
    setMantenimientos,
    setAlertas,
    setOrdenesTrabajo,
    setCostos,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/* -------------------------
   Hook de consumo
   ------------------------- */
export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within AppProvider');
  }
  return ctx;
}
