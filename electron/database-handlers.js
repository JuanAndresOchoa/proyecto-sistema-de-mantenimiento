const { v4: uuidv4 } = require("crypto")

module.exports = (ipcMain, db) => {
  // Equipos
  ipcMain.handle("get-equipos", () => {
    try {
      const stmt = db.prepare("SELECT * FROM equipos ORDER BY nombre")
      return stmt.all()
    } catch (error) {
      console.error("Error al obtener equipos:", error)
      throw error
    }
  })

  ipcMain.handle("create-equipo", (event, equipo) => {
    try {
      const id = equipo.id || uuidv4()
      const stmt = db.prepare(`
        INSERT INTO equipos (id, nombre, tipo, ubicacion, estado, fechaInstalacion, proximoMantenimiento, horasOperacion, eficiencia)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)

      stmt.run(
        id,
        equipo.nombre,
        equipo.tipo,
        equipo.ubicacion,
        equipo.estado || "Operativo",
        equipo.fechaInstalacion,
        equipo.proximoMantenimiento,
        equipo.horasOperacion || 0,
        equipo.eficiencia || 100.0,
      )

      return { ...equipo, id }
    } catch (error) {
      console.error("Error al crear equipo:", error)
      throw error
    }
  })

  ipcMain.handle("update-equipo", (event, id, equipo) => {
    try {
      const stmt = db.prepare(`
        UPDATE equipos 
        SET nombre = ?, tipo = ?, ubicacion = ?, estado = ?, fechaInstalacion = ?, 
            proximoMantenimiento = ?, horasOperacion = ?, eficiencia = ?, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `)

      stmt.run(
        equipo.nombre,
        equipo.tipo,
        equipo.ubicacion,
        equipo.estado,
        equipo.fechaInstalacion,
        equipo.proximoMantenimiento,
        equipo.horasOperacion,
        equipo.eficiencia,
        id,
      )

      return { ...equipo, id }
    } catch (error) {
      console.error("Error al actualizar equipo:", error)
      throw error
    }
  })

  ipcMain.handle("delete-equipo", (event, id) => {
    try {
      const stmt = db.prepare("DELETE FROM equipos WHERE id = ?")
      stmt.run(id)
      return true
    } catch (error) {
      console.error("Error al eliminar equipo:", error)
      throw error
    }
  })

  // Mantenimientos
  ipcMain.handle("get-mantenimientos", () => {
    try {
      const stmt = db.prepare(`
        SELECT m.*, e.nombre as equipoNombre 
        FROM mantenimientos m 
        LEFT JOIN equipos e ON m.equipoId = e.id 
        ORDER BY m.fechaProgramada DESC
      `)
      return stmt.all()
    } catch (error) {
      console.error("Error al obtener mantenimientos:", error)
      throw error
    }
  })

  ipcMain.handle("create-mantenimiento", (event, mantenimiento) => {
    try {
      const id = mantenimiento.id || uuidv4()
      const stmt = db.prepare(`
        INSERT INTO mantenimientos (
          id, equipoId, tipo, descripcion, fechaProgramada, tecnico, prioridad, estado,
          observaciones, tiempoEstimado, materiales, herramientas, procedimientos, repuestos, frecuencia
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)

      stmt.run(
        id,
        mantenimiento.equipoId,
        mantenimiento.tipo,
        mantenimiento.descripcion,
        mantenimiento.fechaProgramada,
        mantenimiento.tecnico,
        mantenimiento.prioridad || "Media",
        mantenimiento.estado || "Programado",
        mantenimiento.observaciones,
        mantenimiento.tiempoEstimado,
        JSON.stringify(mantenimiento.materiales || []),
        JSON.stringify(mantenimiento.herramientas || []),
        JSON.stringify(mantenimiento.procedimientos || []),
        JSON.stringify(mantenimiento.repuestos || []),
        mantenimiento.frecuencia,
      )

      return { ...mantenimiento, id }
    } catch (error) {
      console.error("Error al crear mantenimiento:", error)
      throw error
    }
  })

  ipcMain.handle("update-mantenimiento", (event, id, mantenimiento) => {
    try {
      const stmt = db.prepare(`
        UPDATE mantenimientos 
        SET equipoId = ?, tipo = ?, descripcion = ?, fechaProgramada = ?, fechaCompletado = ?,
            tecnico = ?, prioridad = ?, estado = ?, observaciones = ?, tiempoEstimado = ?, tiempoReal = ?,
            materiales = ?, herramientas = ?, procedimientos = ?, repuestos = ?, frecuencia = ?,
            updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `)

      stmt.run(
        mantenimiento.equipoId,
        mantenimiento.tipo,
        mantenimiento.descripcion,
        mantenimiento.fechaProgramada,
        mantenimiento.fechaCompletado,
        mantenimiento.tecnico,
        mantenimiento.prioridad,
        mantenimiento.estado,
        mantenimiento.observaciones,
        mantenimiento.tiempoEstimado,
        mantenimiento.tiempoReal,
        JSON.stringify(mantenimiento.materiales || []),
        JSON.stringify(mantenimiento.herramientas || []),
        JSON.stringify(mantenimiento.procedimientos || []),
        JSON.stringify(mantenimiento.repuestos || []),
        mantenimiento.frecuencia,
        id,
      )

      return { ...mantenimiento, id }
    } catch (error) {
      console.error("Error al actualizar mantenimiento:", error)
      throw error
    }
  })

  ipcMain.handle("delete-mantenimiento", (event, id) => {
    try {
      const stmt = db.prepare("DELETE FROM mantenimientos WHERE id = ?")
      stmt.run(id)
      return true
    } catch (error) {
      console.error("Error al eliminar mantenimiento:", error)
      throw error
    }
  })

  // Costos
  ipcMain.handle("get-costos", () => {
    try {
      const stmt = db.prepare(`
        SELECT c.*, m.descripcion as mantenimientoDescripcion 
        FROM costos c 
        LEFT JOIN mantenimientos m ON c.mantenimientoId = m.id 
        ORDER BY c.fecha DESC
      `)
      return stmt.all()
    } catch (error) {
      console.error("Error al obtener costos:", error)
      throw error
    }
  })

  ipcMain.handle("create-costo", (event, costo) => {
    try {
      const id = costo.id || uuidv4()
      const stmt = db.prepare(`
        INSERT INTO costos (id, mantenimientoId, categoria, concepto, monto, proveedor, fecha, observaciones)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `)

      stmt.run(
        id,
        costo.mantenimientoId,
        costo.categoria,
        costo.concepto,
        costo.monto,
        costo.proveedor,
        costo.fecha,
        costo.observaciones,
      )

      return { ...costo, id }
    } catch (error) {
      console.error("Error al crear costo:", error)
      throw error
    }
  })

  ipcMain.handle("update-costo", (event, id, costo) => {
    try {
      const stmt = db.prepare(`
        UPDATE costos 
        SET mantenimientoId = ?, categoria = ?, concepto = ?, monto = ?, proveedor = ?, fecha = ?, observaciones = ?, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `)

      stmt.run(
        costo.mantenimientoId,
        costo.categoria,
        costo.concepto,
        costo.monto,
        costo.proveedor,
        costo.fecha,
        costo.observaciones,
        id,
      )

      return { ...costo, id }
    } catch (error) {
      console.error("Error al actualizar costo:", error)
      throw error
    }
  })

  ipcMain.handle("delete-costo", (event, id) => {
    try {
      const stmt = db.prepare("DELETE FROM costos WHERE id = ?")
      stmt.run(id)
      return true
    } catch (error) {
      console.error("Error al eliminar costo:", error)
      throw error
    }
  })

  // Órdenes de trabajo
  ipcMain.handle("get-ordenes-trabajo", () => {
    try {
      const stmt = db.prepare(`
        SELECT ot.*, e.nombre as equipoNombre 
        FROM ordenes_trabajo ot 
        LEFT JOIN equipos e ON ot.equipoId = e.id 
        ORDER BY ot.fechaCreacion DESC
      `)
      const ordenes = stmt.all()

      // Parsear campos JSON
      return ordenes.map((orden) => ({
        ...orden,
        materiales: orden.materiales ? JSON.parse(orden.materiales) : [],
        herramientas: orden.herramientas ? JSON.parse(orden.herramientas) : [],
        procedimientos: orden.procedimientos ? JSON.parse(orden.procedimientos) : [],
      }))
    } catch (error) {
      console.error("Error al obtener órdenes de trabajo:", error)
      throw error
    }
  })

  ipcMain.handle("create-orden-trabajo", (event, orden) => {
    try {
      const id = orden.id || uuidv4()

      // Generar número automático si no se proporciona
      let numero = orden.numero
      if (!numero) {
        const stmt = db.prepare("SELECT COUNT(*) as count FROM ordenes_trabajo")
        const result = stmt.get()
        numero = `OT-${String(result.count + 1).padStart(6, "0")}`
      }

      const stmt = db.prepare(`
        INSERT INTO ordenes_trabajo (
          id, numero, titulo, descripcion, equipoId, tipoTrabajo, prioridad, estado,
          solicitante, tecnicoAsignado, departamento, area, ubicacion, fechaCreacion,
          tiempoEstimado, costoEstimado, materiales, herramientas, procedimientos, observaciones
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)

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
        orden.tecnicoAsignado,
        orden.departamento,
        orden.area,
        orden.ubicacion,
        orden.fechaCreacion,
        orden.tiempoEstimado,
        orden.costoEstimado,
        JSON.stringify(orden.materiales || []),
        JSON.stringify(orden.herramientas || []),
        JSON.stringify(orden.procedimientos || []),
        orden.observaciones,
      )

      return { ...orden, id, numero }
    } catch (error) {
      console.error("Error al crear orden de trabajo:", error)
      throw error
    }
  })

  ipcMain.handle("update-orden-trabajo", (event, id, orden) => {
    try {
      const stmt = db.prepare(`
        UPDATE ordenes_trabajo 
        SET numero = ?, titulo = ?, descripcion = ?, equipoId = ?, tipoTrabajo = ?, prioridad = ?, estado = ?,
            solicitante = ?, tecnicoAsignado = ?, departamento = ?, area = ?, ubicacion = ?,
            fechaAsignacion = ?, fechaInicio = ?, fechaCompletado = ?, tiempoEstimado = ?, tiempoReal = ?,
            costoEstimado = ?, costoReal = ?, materiales = ?, herramientas = ?, procedimientos = ?,
            observaciones = ?, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `)

      stmt.run(
        orden.numero,
        orden.titulo,
        orden.descripcion,
        orden.equipoId,
        orden.tipoTrabajo,
        orden.prioridad,
        orden.estado,
        orden.solicitante,
        orden.tecnicoAsignado,
        orden.departamento,
        orden.area,
        orden.ubicacion,
        orden.fechaAsignacion,
        orden.fechaInicio,
        orden.fechaCompletado,
        orden.tiempoEstimado,
        orden.tiempoReal,
        orden.costoEstimado,
        orden.costoReal,
        JSON.stringify(orden.materiales || []),
        JSON.stringify(orden.herramientas || []),
        JSON.stringify(orden.procedimientos || []),
        orden.observaciones,
        id,
      )

      return { ...orden, id }
    } catch (error) {
      console.error("Error al actualizar orden de trabajo:", error)
      throw error
    }
  })

  ipcMain.handle("delete-orden-trabajo", (event, id) => {
    try {
      const stmt = db.prepare("DELETE FROM ordenes_trabajo WHERE id = ?")
      stmt.run(id)
      return true
    } catch (error) {
      console.error("Error al eliminar orden de trabajo:", error)
      throw error
    }
  })

  // Alertas
  ipcMain.handle("get-alertas", () => {
    try {
      const stmt = db.prepare(`
        SELECT a.*, e.nombre as equipoNombre 
        FROM alertas a 
        LEFT JOIN equipos e ON a.equipoId = e.id 
        ORDER BY a.fechaCreacion DESC
      `)
      return stmt.all()
    } catch (error) {
      console.error("Error al obtener alertas:", error)
      throw error
    }
  })

  ipcMain.handle("create-alerta", (event, alerta) => {
    try {
      const id = alerta.id || uuidv4()
      const stmt = db.prepare(`
        INSERT INTO alertas (id, tipo, titulo, descripcion, nivel, estado, equipoId, fechaCreacion)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `)

      stmt.run(
        id,
        alerta.tipo,
        alerta.titulo,
        alerta.descripcion,
        alerta.nivel || "Info",
        alerta.estado || "Activa",
        alerta.equipoId,
        alerta.fechaCreacion,
      )

      return { ...alerta, id }
    } catch (error) {
      console.error("Error al crear alerta:", error)
      throw error
    }
  })

  ipcMain.handle("update-alerta", (event, id, alerta) => {
    try {
      const stmt = db.prepare(`
        UPDATE alertas 
        SET tipo = ?, titulo = ?, descripcion = ?, nivel = ?, estado = ?, equipoId = ?,
            fechaLeida = ?, fechaResuelta = ?, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `)

      stmt.run(
        alerta.tipo,
        alerta.titulo,
        alerta.descripcion,
        alerta.nivel,
        alerta.estado,
        alerta.equipoId,
        alerta.fechaLeida,
        alerta.fechaResuelta,
        id,
      )

      return { ...alerta, id }
    } catch (error) {
      console.error("Error al actualizar alerta:", error)
      throw error
    }
  })

  ipcMain.handle("delete-alerta", (event, id) => {
    try {
      const stmt = db.prepare("DELETE FROM alertas WHERE id = ?")
      stmt.run(id)
      return true
    } catch (error) {
      console.error("Error al eliminar alerta:", error)
      throw error
    }
  })

  // Áreas de empresa
  ipcMain.handle("get-areas-empresa", () => {
    try {
      const stmt = db.prepare("SELECT * FROM areas_empresa ORDER BY nombre")
      return stmt.all()
    } catch (error) {
      console.error("Error al obtener áreas de empresa:", error)
      throw error
    }
  })

  ipcMain.handle("create-area-empresa", (event, area) => {
    try {
      const id = area.id || uuidv4()
      const stmt = db.prepare(`
        INSERT INTO areas_empresa (id, nombre, descripcion, responsable, activo)
        VALUES (?, ?, ?, ?, ?)
      `)

      stmt.run(id, area.nombre, area.descripcion, area.responsable, area.activo !== undefined ? area.activo : 1)

      return { ...area, id }
    } catch (error) {
      console.error("Error al crear área de empresa:", error)
      throw error
    }
  })

  ipcMain.handle("update-area-empresa", (event, id, area) => {
    try {
      const stmt = db.prepare(`
        UPDATE areas_empresa 
        SET nombre = ?, descripcion = ?, responsable = ?, activo = ?, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `)

      stmt.run(area.nombre, area.descripcion, area.responsable, area.activo, id)

      return { ...area, id }
    } catch (error) {
      console.error("Error al actualizar área de empresa:", error)
      throw error
    }
  })

  ipcMain.handle("delete-area-empresa", (event, id) => {
    try {
      const stmt = db.prepare("DELETE FROM areas_empresa WHERE id = ?")
      stmt.run(id)
      return true
    } catch (error) {
      console.error("Error al eliminar área de empresa:", error)
      throw error
    }
  })

  // Utilidades
  ipcMain.handle("generate-next-order-number", () => {
    try {
      const stmt = db.prepare("SELECT COUNT(*) as count FROM ordenes_trabajo")
      const result = stmt.get()
      return `OT-${String(result.count + 1).padStart(6, "0")}`
    } catch (error) {
      console.error("Error al generar número de orden:", error)
      throw error
    }
  })

  ipcMain.handle("get-statistics", () => {
    try {
      const stats = {}

      // Estadísticas de equipos
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
        .get()

      // Estadísticas de mantenimientos
      const mantenimientosStats = db
        .prepare(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN estado = 'Programado' THEN 1 ELSE 0 END) as programados,
          SUM(CASE WHEN estado = 'En Progreso' THEN 1 ELSE 0 END) as enProgreso,
          SUM(CASE WHEN estado = 'Completado' THEN 1 ELSE 0 END) as completados
        FROM mantenimientos
      `)
        .get()

      // Estadísticas de órdenes de trabajo
      const ordenesStats = db
        .prepare(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN estado = 'Abierta' THEN 1 ELSE 0 END) as abiertas,
          SUM(CASE WHEN estado = 'En Progreso' THEN 1 ELSE 0 END) as enProgreso,
          SUM(CASE WHEN estado = 'Completada' THEN 1 ELSE 0 END) as completadas
        FROM ordenes_trabajo
      `)
        .get()

      // Estadísticas de alertas
      const alertasStats = db
        .prepare(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN estado = 'Activa' THEN 1 ELSE 0 END) as activas,
          SUM(CASE WHEN nivel = 'Crítico' THEN 1 ELSE 0 END) as criticas
        FROM alertas
      `)
        .get()

      return {
        equipos: equiposStats,
        mantenimientos: mantenimientosStats,
        ordenes: ordenesStats,
        alertas: alertasStats,
      }
    } catch (error) {
      console.error("Error al obtener estadísticas:", error)
      throw error
    }
  })
}
