// contexts/app-context.tsx
'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
  useMemo,
} from 'react';

/**
 * Tipos auxiliares (no intrusivos; mantuve AnyObject como en tu versión original para compat)
 */
type AnyObject = Record<string, any>;

export interface Tecnico {
  id: number | string;
  nombre: string;
  cargo: string;
  especialidad?: string;
  telefono?: string;
  email?: string;
  activo: boolean;
}

export interface Area {
  id: string;
  nombre: string;
  descripcion?: string;
  responsable?: string;
  activa: boolean;
}

export interface Empresa {
  nombre: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  ruc?: string;
}

/**
 * Shape del contexto (extiende lo que ya tenías)
 */
type AppContextType = {
  equipos: AnyObject[];
  mantenimientos: AnyObject[];
  alertas: AnyObject[];
  ordenesTrabajo: AnyObject[];
  costos: AnyObject[];

  // NUEVO: áreas, técnicos y empresa (inicializados)
  areasEmpresa: Area[];
  tecnicos: Tecnico[];
  empresa: Empresa | null;

  // loading / error
  loading: boolean;
  error?: string | null;

  // Reload / fetch (existentes)
  reloadEquipos: () => Promise<void>;
  reloadMantenimientos: () => Promise<void>;
  reloadAlertas: () => Promise<void>;
  reloadOrdenesTrabajo: () => Promise<void>;
  reloadCostos: () => Promise<void>;

  // setters para compatibilidad (tu código original exportaba algunos setters)
  setEquipos: React.Dispatch<React.SetStateAction<AnyObject[]>>;
  setMantenimientos: React.Dispatch<React.SetStateAction<AnyObject[]>>;
  setAlertas: React.Dispatch<React.SetStateAction<AnyObject[]>>;
  setOrdenesTrabajo: React.Dispatch<React.SetStateAction<AnyObject[]>>;
  setCostos: React.Dispatch<React.SetStateAction<AnyObject[]>>;

  // NUEVAS funciones CRUD expuestas
  crearAreaEmpresa?: (area: Partial<Area>) => Promise<Area>;
  actualizarAreaEmpresa?: (id: string, data: Partial<Area>) => Promise<Area | null>;
  eliminarAreaEmpresa?: (id: string) => Promise<void>;

  crearTecnico?: (t: Tecnico) => Promise<Tecnico>;
  actualizarTecnico?: (id: number | string, t: Tecnico) => Promise<Tecnico | null>;
  eliminarTecnico?: (id: number | string) => Promise<void>;

  actualizarEmpresa?: (e: Partial<Empresa>) => Promise<Empresa>;
};

const DEFAULT_CTX: AppContextType = {
  equipos: [],
  mantenimientos: [],
  alertas: [],
  ordenesTrabajo: [],
  costos: [],

  areasEmpresa: [],
  tecnicos: [],
  empresa: null,

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

  crearAreaEmpresa: undefined,
  actualizarAreaEmpresa: undefined,
  eliminarAreaEmpresa: undefined,

  crearTecnico: undefined,
  actualizarTecnico: undefined,
  eliminarTecnico: undefined,

  actualizarEmpresa: undefined,
};

const AppContext = createContext<AppContextType>(DEFAULT_CTX);

/* -------------------------
   Helper: obtener "dbService" / electronAPI
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

  // NUEVO: áreas, técnicos y empresa (fuente de verdad centralizada aquí)
  const [areasEmpresa, setAreasEmpresa] = useState<Area[]>([]);
  const [tecnicos, setTecnicos] = useState<Tecnico[]>([]);
  const [empresa, setEmpresa] = useState<Empresa | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* -------------------------
     Reloads (seguro para SSR: solo usan getDbService() dentro de async)
     ------------------------- */
  const reloadEquipos = useCallback(async () => {
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
  }, []);

  const reloadMantenimientos = useCallback(async () => {
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
  }, []);

  const reloadAlertas = useCallback(async () => {
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
  }, []);

  const reloadOrdenesTrabajo = useCallback(async () => {
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
  }, []);

  const reloadCostos = useCallback(async () => {
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
  }, []);

  /* -------------------------
     NUEVO: CRUD Áreas (usando el mismo patrón seguro)
     ------------------------- */
  const crearAreaEmpresa = useCallback(async (payload: Partial<Area>): Promise<Area> => {
    const newArea: Area = {
      id: payload.id ?? `a_${Date.now()}`,
      nombre: payload.nombre ?? '',
      descripcion: payload.descripcion ?? '',
      responsable: payload.responsable ?? '',
      activa: payload.activa ?? true,
    };

    try {
      const svc = await getDbService();
      if (svc && typeof svc.createArea === 'function') {
        const saved = await svc.createArea(payload);
        setAreasEmpresa((prev) => (saved ? [...prev, saved] : [...prev, newArea]));
        return saved ?? newArea;
      } else {
        setAreasEmpresa((prev) => [...prev, newArea]);
        return newArea;
      }
    } catch (err) {
      console.error('crearAreaEmpresa error', err);
      setAreasEmpresa((prev) => [...prev, newArea]);
      return newArea;
    }
  }, []);

  const actualizarAreaEmpresa = useCallback(async (id: string, data: Partial<Area>): Promise<Area | null> => {
    try {
      const svc = await getDbService();
      if (svc && typeof svc.updateArea === 'function') {
        const saved = await svc.updateArea(id, data);
        if (saved) {
          setAreasEmpresa((prev) => prev.map((a) => (a.id === id ? saved : a)));
          return saved;
        }
      }
      let updated: Area | null = null;
      setAreasEmpresa((prev) =>
        prev.map((a) => {
          if (a.id === id) {
            updated = { ...a, ...data };
            return updated;
          }
          return a;
        })
      );
      return updated;
    } catch (err) {
      console.error('actualizarAreaEmpresa error', err);
      return null;
    }
  }, []);

  const eliminarAreaEmpresa = useCallback(async (id: string): Promise<void> => {
    try {
      const svc = await getDbService();
      if (svc && typeof svc.deleteArea === 'function') {
        await svc.deleteArea(id);
        setAreasEmpresa((prev) => prev.filter((a) => a.id !== id));
        return;
      }
      setAreasEmpresa((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error('eliminarAreaEmpresa error', err);
    }
  }, []);

  /* -------------------------
     NUEVO: CRUD Técnicos
     ------------------------- */
  const crearTecnico = useCallback(async (t: Tecnico): Promise<Tecnico> => {
    const tmp: Tecnico = { ...t, id: t.id ?? `t_${Date.now()}` };
    try {
      const svc = await getDbService();
      if (svc && typeof svc.createTechnician === 'function') {
        const saved = await svc.createTechnician(t);
        setTecnicos((prev) => (saved ? [...prev, saved] : [...prev, tmp]));
        return saved ?? tmp;
      } else {
        setTecnicos((prev) => [...prev, tmp]);
        return tmp;
      }
    } catch (err) {
      console.error('crearTecnico error', err);
      setTecnicos((prev) => [...prev, tmp]);
      return tmp;
    }
  }, []);

  const actualizarTecnico = useCallback(async (id: number | string, t: Tecnico): Promise<Tecnico | null> => {
    try {
      const svc = await getDbService();
      if (svc && typeof svc.updateTechnician === 'function') {
        const saved = await svc.updateTechnician(id, t);
        if (saved) {
          setTecnicos((prev) => prev.map((x) => (x.id === id ? saved : x)));
          return saved;
        }
      }
      let updated: Tecnico | null = null;
      setTecnicos((prev) =>
        prev.map((x) => {
          if (x.id === id) {
            updated = { ...x, ...t };
            return updated;
          }
          return x;
        })
      );
      return updated;
    } catch (err) {
      console.error('actualizarTecnico error', err);
      return null;
    }
  }, []);

  const eliminarTecnico = useCallback(async (id: number | string): Promise<void> => {
    try {
      const svc = await getDbService();
      if (svc && typeof svc.deleteTechnician === 'function') {
        await svc.deleteTechnician(id);
        setTecnicos((prev) => prev.filter((x) => x.id !== id));
        return;
      }
      setTecnicos((prev) => prev.filter((x) => x.id !== id));
    } catch (err) {
      console.error('eliminarTecnico error', err);
    }
  }, []);

  /* -------------------------
     NUEVO: Empresa (actualizar)
     ------------------------- */
  const actualizarEmpresa = useCallback(async (e: Partial<Empresa>): Promise<Empresa> => {
    try {
      const svc = await getDbService();
      if (svc && typeof svc.updateEmpresa === 'function') {
        const saved = await svc.updateEmpresa(e);
        setEmpresa(saved);
        return saved;
      }
      const updated = { ...(empresa || {}), ...(e || {}) } as Empresa;
      setEmpresa(updated);
      return updated;
    } catch (err) {
      console.error('actualizarEmpresa error', err);
      const updated = { ...(empresa || {}), ...(e || {}) } as Empresa;
      setEmpresa(updated);
      return updated;
    }
  }, [empresa]);

  /* -------------------------
     Inicialización: carga datos que existan en runtime (solo en cliente)
     ------------------------- */
  useEffect(() => {
    let mounted = true;
    const loadInitial = async () => {
      try {
        const svc = await getDbService();
        if (svc) {
          // intenta cargar colecciones si las funciones existen
          if (typeof svc.getAreas === 'function') {
            const a = await svc.getAreas();
            if (mounted && Array.isArray(a)) setAreasEmpresa(a);
          }
          if (typeof svc.getTechnicians === 'function') {
            const t = await svc.getTechnicians();
            if (mounted && Array.isArray(t)) setTecnicos(t);
          }
          if (typeof svc.getEmpresa === 'function') {
            const e = await svc.getEmpresa();
            if (mounted && e) setEmpresa(e);
          }
          // además intentamos cargar los recursos que tu app ya usaba
          if (typeof svc.getEquipos === 'function') {
            const eq = await svc.getEquipos();
            if (mounted && Array.isArray(eq)) setEquipos(eq);
          }
          if (typeof svc.getMantenimientos === 'function') {
            const m = await svc.getMantenimientos();
            if (mounted && Array.isArray(m)) setMantenimientos(m);
          }
          if (typeof svc.getAlertas === 'function') {
            const al = await svc.getAlertas();
            if (mounted && Array.isArray(al)) setAlertas(al);
          }
          if (typeof svc.getOrdenesTrabajo === 'function') {
            const ot = await svc.getOrdenesTrabajo();
            if (mounted && Array.isArray(ot)) setOrdenesTrabajo(ot);
          }
          if (typeof svc.getCostos === 'function') {
            const c = await svc.getCostos();
            if (mounted && Array.isArray(c)) setCostos(c);
          }
        }
      } catch (err) {
        console.warn('Initial load error', err);
      }
    };

    // Solo en cliente
    if (typeof window !== 'undefined') {
      loadInitial();
    }

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* -------------------------
     Efecto que recarga data periódicamente (igual que tu original)
     ------------------------- */
  useEffect(() => {
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
     Value y provider
     ------------------------- */
  const value = useMemo<AppContextType>(() => {
    return {
      equipos,
      mantenimientos,
      alertas,
      ordenesTrabajo,
      costos,

      areasEmpresa,
      tecnicos,
      empresa,

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

      crearAreaEmpresa,
      actualizarAreaEmpresa,
      eliminarAreaEmpresa,

      crearTecnico,
      actualizarTecnico,
      eliminarTecnico,

      actualizarEmpresa,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    equipos,
    mantenimientos,
    alertas,
    ordenesTrabajo,
    costos,
    areasEmpresa,
    tecnicos,
    empresa,
    loading,
    error,
    reloadEquipos,
    reloadMantenimientos,
    reloadAlertas,
    reloadOrdenesTrabajo,
    reloadCostos,
    crearAreaEmpresa,
    actualizarAreaEmpresa,
    eliminarAreaEmpresa,
    crearTecnico,
    actualizarTecnico,
    eliminarTecnico,
    actualizarEmpresa,
  ]);

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

export default AppProvider;
