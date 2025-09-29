// electron/database-handlers.js
const { randomUUID } = require("crypto");

module.exports = (ipcMain, db) => {
  // Helper para registrar el mismo handler con y sin prefijo "db-"
  function registerDual(channelBase, handler) {
    ipcMain.handle(channelBase, handler);
    ipcMain.handle(`db-${channelBase}`, handler);
  }

  // -------------------- EQUIPOS --------------------
  const getEquiposHandler = () => {
    try {
      const stmt = db.prepare("SELECT * FROM equipos ORDER BY nombre");
      return stmt.all();
    } catch (error) {
      console.error("Error al obtener equipos:", error);
      throw error;
    }
  };
  registerDual("get-equipos", getEquiposHandler);

  const createEquipoHandler = (event, equipo) => {
    try {
      const id = equipo.id || randomUUID();
      const stmt = db.prepare(`
        INSERT INTO equipos (id, nombre, tipo, ubicacion, estado, fechaInstalacion, proximoMantenimiento, horasOperacion, eficiencia)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        id,
        equipo.nombre,
        equipo.tipo,
        equipo.ubicacion,
        equipo.estado || "Operativo",
        equipo.fechaInstalacion ?? null,
        equipo.proximoMantenimiento ?? null,
        equipo.horasOperacion ?? 0,
        equipo.eficiencia ?? 100.0,
      );

      return { ...equipo, id };
    } catch (error) {
      console.error("Error al crear equipo:", error);
      throw error;
    }
  };
  registerDual("create-equipo", createEquipoHandler);

  const updateEquipoHandler = (event, id, equipo) => {
    try {
      const stmt = db.prepare(`
        UPDATE equipos 
        SET nombre = ?, tipo = ?, ubicacion = ?, estado = ?, fechaInstalacion = ?, 
            proximoMantenimiento = ?, horasOperacion = ?, eficiencia = ?, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `);

      stmt.run(
        equipo.nombre,
        equipo.tipo,
        equipo.ubicacion,
        equipo.estado,
        equipo.fechaInstalacion ?? null,
        equipo.proximoMantenimiento ?? null,
        equipo.horasOperacion ?? 0,
        equipo.eficiencia ?? 100.0,
        id,
      );

      return { ...equipo, id };
    } catch (error) {
      console.error("Error al actualizar equipo:", error);
      throw error;
    }
  };
  registerDual("update-equipo", updateEquipoHandler);

  const deleteEquipoHandler = (event, id) => {
    try {
      const stmt = db.prepare("DELETE FROM equipos WHERE id = ?");
      stmt.run(id);
      return true;
    } catch (error) {
      console.error("Error al eliminar equipo:", error);
      throw error;
    }
  };
  registerDual("delete-equipo", deleteEquipoHandler);

  // -------------------- MANTENIMIENTOS --------------------
  const getMantenimientosHandler = () => {
    try {
      const stmt = db.prepare(`
        SELECT m.*, e.nombre as equipoNombre 
        FROM mantenimientos m 
        LEFT JOIN equipos e ON m.equipoId = e.id 
        ORDER BY m.fechaProgramada DESC
      `);
      return stmt.all();
    } catch (error) {
      console.error("Error al obtener mantenimientos:", error);
      throw error;
    }
  };
  registerDual("get-mantenimientos", getMantenimientosHandler);

  const createMantenimientoHandler = (event, mantenimiento) => {
    try {
      const id = mantenimiento.id || randomUUID();
      const stmt = db.prepare(`
        INSERT INTO mantenimientos (
          id, equipoId, tipo, descripcion, fechaProgramada, tecnico, prioridad, estado,
          observaciones, tiempoEstimado, materiales, herramientas, procedimientos, repuestos, frecuencia
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        id,
        mantenimiento.equipoId,
        mantenimiento.tipo,
        mantenimiento.descripcion,
        mantenimiento.fechaProgramada,
        mantenimiento.tecnico,
        mantenimiento.prioridad || "Media",
        mantenimiento.estado || "Programado",
        mantenimiento.observaciones ?? null,
        mantenimiento.tiempoEstimado ?? null,
        JSON.stringify(mantenimiento.materiales || []),
        JSON.stringify(mantenimiento.herramientas || []),
        JSON.stringify(mantenimiento.procedimientos || []),
        JSON.stringify(mantenimiento.repuestos || []),
        mantenimiento.frecuencia ?? null,
      );

      return { ...mantenimiento, id };
    } catch (error) {
      console.error("Error al crear mantenimiento:", error);
      throw error;
    }
  };
  registerDual("create-mantenimiento", createMantenimientoHandler);

  const updateMantenimientoHandler = (event, id, mantenimiento) => {
    try {
      const stmt = db.prepare(`
        UPDATE mantenimientos 
        SET equipoId = ?, tipo = ?, descripcion = ?, fechaProgramada = ?, fechaCompletado = ?,
            tecnico = ?, prioridad = ?, estado = ?, observaciones = ?, tiempoEstimado = ?, tiempoReal = ?,
            materiales = ?, herramientas = ?, procedimientos = ?, repuestos = ?, frecuencia = ?,
            updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `);

      stmt.run(
        mantenimiento.equipoId,
        mantenimiento.tipo,
        mantenimiento.descripcion,
        mantenimiento.fechaProgramada ?? null,
        mantenimiento.fechaCompletado ?? null,
        mantenimiento.tecnico,
        mantenimiento.prioridad,
        mantenimiento.estado,
        mantenimiento.observaciones ?? null,
        mantenimiento.tiempoEstimado ?? null,
        mantenimiento.tiempoReal ?? null,
        JSON.stringify(mantenimiento.materiales || []),
        JSON.stringify(mantenimiento.herramientas || []),
        JSON.stringify(mantenimiento.procedimientos || []),
        JSON.stringify(mantenimiento.repuestos || []),
        mantenimiento.frecuencia ?? null,
        id,
      );

      return { ...mantenimiento, id };
    } catch (error) {
      console.error("Error al actualizar mantenimiento:", error);
      throw error;
    }
  };
  registerDual("update-mantenimiento", updateMantenimientoHandler);

  const deleteMantenimientoHandler = (event, id) => {
    try {
      const stmt = db.prepare("DELETE FROM mantenimientos WHERE id = ?");
      stmt.run(id);
      return true;
    } catch (error) {
      console.error("Error al eliminar mantenimiento:", error);
      throw error;
    }
  };
  registerDual("delete-mantenimiento", deleteMantenimientoHandler);

  // -------------------- COSTOS --------------------
  const getCostosHandler = () => {
    try {
      const stmt = db.prepare(`
        SELECT c.*, m.descripcion as mantenimientoDescripcion 
        FROM costos c 
        LEFT JOIN mantenimientos m ON c.mantenimientoId = m.id 
        ORDER BY c.fecha DESC
      `);
      return stmt.all();
    } catch (error) {
      console.error("Error al obtener costos:", error);
      throw error;
    }
  };
  registerDual("get-costos", getCostosHandler);

  const createCostoHandler = (event, costo) => {
    try {
      const id = costo.id || randomUUID();
      const stmt = db.prepare(`
        INSERT INTO costos (id, mantenimientoId, categoria, concepto, monto, proveedor, fecha, observaciones)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        id,
        costo.mantenimientoId,
        costo.categoria,
        costo.concepto,
        costo.monto,
        costo.proveedor ?? null,
        costo.fecha,
        costo.observaciones ?? null,
      );

      return { ...costo, id };
    } catch (error) {
      console.error("Error al crear costo:", error);
      throw error;
    }
  };
  registerDual("create-costo", createCostoHandler);

  const updateCostoHandler = (event, id, costo) => {
    try {
      const stmt = db.prepare(`
        UPDATE costos 
        SET mantenimientoId = ?, categoria = ?, concepto = ?, monto = ?, proveedor = ?, fecha = ?, observaciones = ?, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `);

      stmt.run(
        costo.mantenimientoId,
        costo.categoria,
        costo.concepto,
        costo.monto,
        costo.proveedor ?? null,
        costo.fecha,
        costo.observaciones ?? null,
        id,
      );

      return { ...costo, id };
    } catch (error) {
      console.error("Error al actualizar costo:", error);
      throw error;
    }
  };
  registerDual("update-costo", updateCostoHandler);

  const deleteCostoHandler = (event, id) => {
    try {
      const stmt = db.prepare("DELETE FROM costos WHERE id = ?");
      stmt.run(id);
      return true;
    } catch (error) {
      console.error("Error al eliminar costo:", error);
      throw error;
    }
  };
  registerDual("delete-costo", deleteCostoHandler);

  // -------------------- ÓRDENES DE TRABAJO --------------------
  const getOrdenesTrabajoHandler = () => {
    try {
      const stmt = db.prepare(`
        SELECT ot.*, e.nombre as equipoNombre 
        FROM ordenes_trabajo ot 
        LEFT JOIN equipos e ON ot.equipoId = e.id 
        ORDER BY ot.fechaCreacion DESC
      `);
      const ordenes = stmt.all();

      return ordenes.map((orden) => ({
        ...orden,
        materiales: orden.materiales ? JSON.parse(orden.materiales) : [],
        herramientas: orden.herramientas ? JSON.parse(orden.herramientas) : [],
        procedimientos: orden.procedimientos ? JSON.parse(orden.procedimientos) : [],
      }));
    } catch (error) {
      console.error("Error al obtener órdenes de trabajo:", error);
      throw error;
    }
  };
  registerDual("get-ordenes-trabajo", getOrdenesTrabajoHandler);

  const createOrdenTrabajoHandler = (event, orden) => {
    try {
      const id = orden.id || randomUUID();

      // Generar número automático si no se proporciona
      let numero = orden.numero;
      if (!numero) {
        const stmtCount = db.prepare("SELECT COUNT(*) as count FROM ordenes_trabajo");
        const result = stmtCount.get();
        numero = `OT-${String(result.count + 1).padStart(6, "0")}`;
      }

      const stmt = db.prepare(`
        INSERT INTO ordenes_trabajo (
          id, numero, titulo, descripcion, equipoId, tipoTrabajo, prioridad, estado,
          solicitante, tecnicoAsignado, departamento, area, ubicacion, fechaCreacion,
          tiempoEstimado, costoEstimado, materiales, herramientas, procedimientos, observaciones
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        id,
        numero,
        orden.titulo,
        orden.descripcion,
        orden.equipoId,
        orden.tipoTrabajo,
        orden.prioridad || "Media",
        orden.estado || "Abierta",
        orden.solicitante,
        orden.tecnicoAsignado ?? null,
        orden.departamento,
        orden.area,
        orden.ubicacion,
        orden.fechaCreacion,
        orden.tiempoEstimado ?? null,
        orden.costoEstimado ?? null,
        JSON.stringify(orden.materiales || []),
        JSON.stringify(orden.herramientas || []),
        JSON.stringify(orden.procedimientos || []),
        orden.observaciones ?? null,
      );

      return { ...orden, id, numero };
    } catch (error) {
      console.error("Error al crear orden de trabajo:", error);
      throw error;
    }
  };
  registerDual("create-orden-trabajo", createOrdenTrabajoHandler);

  const updateOrdenTrabajoHandler = (event, id, orden) => {
    try {
      const stmt = db.prepare(`
        UPDATE ordenes_trabajo 
        SET numero = ?, titulo = ?, descripcion = ?, equipoId = ?, tipoTrabajo = ?, prioridad = ?, estado = ?,
            solicitante = ?, tecnicoAsignado = ?, departamento = ?, area = ?, ubicacion = ?,
            fechaAsignacion = ?, fechaInicio = ?, fechaCompletado = ?, tiempoEstimado = ?, tiempoReal = ?,
            costoEstimado = ?, costoReal = ?, materiales = ?, herramientas = ?, procedimientos = ?,
            observaciones = ?, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `);

      stmt.run(
        orden.numero,
        orden.titulo,
        orden.descripcion,
        orden.equipoId,
        orden.tipoTrabajo,
        orden.prioridad,
        orden.estado,
        orden.solicitante,
        orden.tecnicoAsignado ?? null,
        orden.departamento,
        orden.area,
        orden.ubicacion,
        orden.fechaAsignacion ?? null,
        orden.fechaInicio ?? null,
        orden.fechaCompletado ?? null,
        orden.tiempoEstimado ?? null,
        orden.tiempoReal ?? null,
        orden.costoEstimado ?? null,
        orden.costoReal ?? null,
        JSON.stringify(orden.materiales || []),
        JSON.stringify(orden.herramientas || []),
        JSON.stringify(orden.procedimientos || []),
        orden.observaciones ?? null,
        id,
      );

      return { ...orden, id };
    } catch (error) {
      console.error("Error al actualizar orden de trabajo:", error);
      throw error;
    }
  };
  registerDual("update-orden-trabajo", updateOrdenTrabajoHandler);

  const deleteOrdenTrabajoHandler = (event, id) => {
    try {
      const stmt = db.prepare("DELETE FROM ordenes_trabajo WHERE id = ?");
      stmt.run(id);
      return true;
    } catch (error) {
      console.error("Error al eliminar orden de trabajo:", error);
      throw error;
    }
  };
  registerDual("delete-orden-trabajo", deleteOrdenTrabajoHandler);

  // -------------------- ALERTAS --------------------
  const getAlertasHandler = () => {
    try {
      const stmt = db.prepare(`
        SELECT a.*, e.nombre as equipoNombre 
        FROM alertas a 
        LEFT JOIN equipos e ON a.equipoId = e.id 
        ORDER BY a.fechaCreacion DESC
      `);
      return stmt.all();
    } catch (error) {
      console.error("Error al obtener alertas:", error);
      throw error;
    }
  };
  registerDual("get-alertas", getAlertasHandler);

  const createAlertaHandler = (event, alerta) => {
    try {
      const id = alerta.id || randomUUID();
      const stmt = db.prepare(`
        INSERT INTO alertas (id, tipo, titulo, descripcion, nivel, estado, equipoId, fechaCreacion)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        id,
        alerta.tipo,
        alerta.titulo,
        alerta.descripcion,
        alerta.nivel || "Info",
        alerta.estado || "Activa",
        alerta.equipoId ?? null,
        alerta.fechaCreacion ?? null,
      );

      return { ...alerta, id };
    } catch (error) {
      console.error("Error al crear alerta:", error);
      throw error;
    }
  };
  registerDual("create-alerta", createAlertaHandler);

  const updateAlertaHandler = (event, id, alerta) => {
    try {
      const stmt = db.prepare(`
        UPDATE alertas 
        SET tipo = ?, titulo = ?, descripcion = ?, nivel = ?, estado = ?, equipoId = ?,
            fechaLeida = ?, fechaResuelta = ?, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `);

      stmt.run(
        alerta.tipo,
        alerta.titulo,
        alerta.descripcion,
        alerta.nivel,
        alerta.estado,
        alerta.equipoId ?? null,
        alerta.fechaLeida ?? null,
        alerta.fechaResuelta ?? null,
        id,
      );

      return { ...alerta, id };
    } catch (error) {
      console.error("Error al actualizar alerta:", error);
      throw error;
    }
  };
  registerDual("update-alerta", updateAlertaHandler);

  const deleteAlertaHandler = (event, id) => {
    try {
      const stmt = db.prepare("DELETE FROM alertas WHERE id = ?");
      stmt.run(id);
      return true;
    } catch (error) {
      console.error("Error al eliminar alerta:", error);
      throw error;
    }
  };
  registerDual("delete-alerta", deleteAlertaHandler);

  // -------------------- ÁREAS DE EMPRESA --------------------
  const getAreasEmpresaHandler = () => {
    try {
      const stmt = db.prepare("SELECT * FROM areas_empresa ORDER BY nombre");
      return stmt.all();
    } catch (error) {
      console.error("Error al obtener áreas de empresa:", error);
      throw error;
    }
  };
  registerDual("get-areas-empresa", getAreasEmpresaHandler);

  const createAreaEmpresaHandler = (event, area) => {
    try {
      const id = area.id || randomUUID();
      const stmt = db.prepare(`
        INSERT INTO areas_empresa (id, nombre, descripcion, responsable, activo)
        VALUES (?, ?, ?, ?, ?)
      `);

      stmt.run(id, area.nombre, area.descripcion ?? null, area.responsable ?? null, area.activo !== undefined ? area.activo : 1);

      return { ...area, id };
    } catch (error) {
      console.error("Error al crear área de empresa:", error);
      throw error;
    }
  };
  registerDual("create-area-empresa", createAreaEmpresaHandler);

  const updateAreaEmpresaHandler = (event, id, area) => {
    try {
      const stmt = db.prepare(`
        UPDATE areas_empresa 
        SET nombre = ?, descripcion = ?, responsable = ?, activo = ?, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `);

      stmt.run(area.nombre, area.descripcion ?? null, area.responsable ?? null, area.activo ? 1 : 0, id);

      return { ...area, id };
    } catch (error) {
      console.error("Error al actualizar área de empresa:", error);
      throw error;
    }
  };
  registerDual("update-area-empresa", updateAreaEmpresaHandler);

  const deleteAreaEmpresaHandler = (event, id) => {
    try {
      const stmt = db.prepare("DELETE FROM areas_empresa WHERE id = ?");
      stmt.run(id);
      return true;
    } catch (error) {
      console.error("Error al eliminar área de empresa:", error);
      throw error;
    }
  };
  registerDual("delete-area-empresa", deleteAreaEmpresaHandler);

  // -------------------- TECNICOS (NUEVOS) --------------------
  const getTecnicosHandler = () => {
    try {
      const stmt = db.prepare("SELECT * FROM tecnicos ORDER BY nombre");
      return stmt.all();
    } catch (error) {
      console.error("Error al obtener tecnicos:", error);
      return [];
    }
  };
  registerDual("get-tecnicos", getTecnicosHandler);

  const createTecnicoHandler = (event, tecnico) => {
    try {
      const id = tecnico.id || randomUUID();
      const stmt = db.prepare(`
        INSERT INTO tecnicos (id, nombre, cargo, especialidad, telefono, email, activo)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        id,
        tecnico.nombre,
        tecnico.cargo,
        tecnico.especialidad ?? null,
        tecnico.telefono ?? null,
        tecnico.email ?? null,
        tecnico.activo ? 1 : 0
      );

      return { ...tecnico, id };
    } catch (error) {
      console.error("Error creando tecnico:", error);
      return { success: false, error: error.message };
    }
  };
  registerDual("create-tecnico", createTecnicoHandler);

  const updateTecnicoHandler = (event, id, changes) => {
    try {
      const fields = Object.keys(changes).map(k => `${k} = ?`).join(", ");
      const values = Object.values(changes).map(v => (typeof v === "boolean" ? (v ? 1 : 0) : v));
      const stmt = db.prepare(`UPDATE tecnicos SET ${fields}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`);
      stmt.run(...values, id);
      return { success: true };
    } catch (error) {
      console.error("Error actualizando tecnico:", error);
      return { success: false, error: error.message };
    }
  };
  registerDual("update-tecnico", updateTecnicoHandler);

  const deleteTecnicoHandler = (event, id) => {
    try {
      const stmt = db.prepare("DELETE FROM tecnicos WHERE id = ?");
      stmt.run(id);
      return { success: true };
    } catch (error) {
      console.error("Error eliminando tecnico:", error);
      return { success: false, error: error.message };
    }
  };
  registerDual("delete-tecnico", deleteTecnicoHandler);

  // -------------------- EMPRESA (NUEVO) --------------------
  const getEmpresaHandler = () => {
    try {
      const stmt = db.prepare("SELECT * FROM empresa WHERE id = ?");
      const row = stmt.get("empresa");
      return row || null;
    } catch (error) {
      console.error("Error getting empresa:", error);
      return null;
    }
  };
  registerDual("get-empresa", getEmpresaHandler);

  const upsertEmpresaHandler = (event, empresa) => {
    try {
      const stmt = db.prepare(`
        INSERT OR REPLACE INTO empresa (id, nombre, direccion, telefono, email, ruc, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `);
      stmt.run(
        "empresa",
        empresa.nombre ?? null,
        empresa.direccion ?? null,
        empresa.telefono ?? null,
        empresa.email ?? null,
        empresa.ruc ?? null
      );
      return { success: true };
    } catch (error) {
      console.error("Error upserting empresa:", error);
      return { success: false, error: error.message };
    }
  };
  // Registrar con ambos nombres: upsertEmpresa y db-upsert-empresa (compatibilidad)
  ipcMain.handle("upsert-empresa", upsertEmpresaHandler);
  ipcMain.handle("db-upsert-empresa", upsertEmpresaHandler);

  // -------------------- UTILIDADES --------------------
  const generateNextOrderNumberHandler = () => {
    try {
      const stmt = db.prepare("SELECT COUNT(*) as count FROM ordenes_trabajo");
      const result = stmt.get();
      return `OT-${String(result.count + 1).padStart(6, "0")}`;
    } catch (error) {
      console.error("Error al generar número de orden:", error);
      throw error;
    }
  };
  registerDual("generate-next-order-number", generateNextOrderNumberHandler);

  const getStatisticsHandler = () => {
    try {
      const equiposStats = db
        .prepare(`
          SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN estado = 'Operativo' THEN 1 ELSE 0 END) as operativos,
            SUM(CASE WHEN estado = 'Mantenimiento' THEN 1 ELSE 0 END) as enMantenimiento,
            SUM(CASE WHEN estado = 'Fuera de Servicio' THEN 1 ELSE 0 END) as fueraServicio,
            AVG(eficiencia) as eficienciaPromedio
          FROM equipos
        `)
        .get();

      const mantenimientosStats = db
        .prepare(`
          SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN estado = 'Programado' THEN 1 ELSE 0 END) as programados,
            SUM(CASE WHEN estado = 'En Progreso' THEN 1 ELSE 0 END) as enProgreso,
            SUM(CASE WHEN estado = 'Completado' THEN 1 ELSE 0 END) as completados
          FROM mantenimientos
        `)
        .get();

      const ordenesStats = db
        .prepare(`
          SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN estado = 'Abierta' THEN 1 ELSE 0 END) as abiertas,
            SUM(CASE WHEN estado = 'En Progreso' THEN 1 ELSE 0 END) as enProgreso,
            SUM(CASE WHEN estado = 'Completada' THEN 1 ELSE 0 END) as completadas
          FROM ordenes_trabajo
        `)
        .get();

      const alertasStats = db
        .prepare(`
          SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN estado = 'Activa' THEN 1 ELSE 0 END) as activas,
            SUM(CASE WHEN nivel = 'Crítico' THEN 1 ELSE 0 END) as criticas
          FROM alertas
        `)
        .get();

      return {
        equipos: equiposStats,
        mantenimientos: mantenimientosStats,
        ordenes: ordenesStats,
        alertas: alertasStats,
      };
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
      throw error;
    }
  };
  registerDual("get-statistics", getStatisticsHandler);
};
