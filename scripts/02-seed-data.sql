-- Inserting initial data for maintenance system

-- Insertar tipos de mantenimiento comunes
INSERT INTO tipos_mantenimiento (nombre, descripcion, frecuencia_dias) VALUES
('Mantenimiento Preventivo', 'Inspección y limpieza general del equipo', 30),
('Mantenimiento Correctivo', 'Reparación de fallas específicas', NULL),
('Lubricación', 'Aplicación de lubricantes en puntos críticos', 15),
('Inspección Eléctrica', 'Revisión de conexiones y componentes eléctricos', 90),
('Cambio de Filtros', 'Reemplazo de filtros de aire y aceite', 60),
('Calibración', 'Ajuste y calibración de instrumentos', 180),
('Limpieza Profunda', 'Limpieza completa del equipo', 45);

-- Insertar equipos de ejemplo
INSERT INTO equipos (codigo, nombre, tipo, marca, modelo, ubicacion, fecha_instalacion, potencia, voltaje, estado, criticidad, notas) VALUES
('MOT-001', 'Motor Principal Línea A', 'Motor', 'Siemens', 'IE3-1500', 'Planta Principal - Sector A', '2020-03-15', '15 HP', '440V', 'Operativo', 'Alta', 'Motor principal de la línea de producción A'),
('BOM-001', 'Bomba Centrífuga Agua', 'Bomba', 'Grundfos', 'CR-45', 'Sala de Bombas', '2019-08-22', '5 HP', '220V', 'Operativo', 'Alta', 'Bomba de suministro de agua principal'),
('MOT-002', 'Motor Ventilador Extracción', 'Motor', 'WEG', 'W22-1800', 'Área de Ventilación', '2021-01-10', '3 HP', '220V', 'Operativo', 'Media', 'Ventilador de extracción de aire'),
('TRA-001', 'Transformador Principal', 'Transformador', 'ABB', 'ONAN-500', 'Subestación Eléctrica', '2018-05-30', '500 KVA', '13.8KV/440V', 'Operativo', 'Alta', 'Transformador principal de la planta'),
('BOM-002', 'Bomba Aceite Hidráulico', 'Bomba', 'Rexroth', 'A10V-28', 'Taller Mecánico', '2020-11-18', '2 HP', '220V', 'Mantenimiento', 'Media', 'Bomba del sistema hidráulico');

-- Insertar mantenimientos programados
INSERT INTO mantenimientos_programados (equipo_id, tipo_mantenimiento_id, fecha_programada, estado, prioridad, tecnico_asignado, notas) VALUES
(1, 1, CURRENT_DATE + INTERVAL '5 days', 'Pendiente', 'Alta', 'Juan Pérez', 'Mantenimiento preventivo mensual'),
(2, 3, CURRENT_DATE + INTERVAL '2 days', 'Pendiente', 'Normal', 'Carlos López', 'Lubricación de rodamientos'),
(3, 1, CURRENT_DATE + INTERVAL '10 days', 'Pendiente', 'Normal', 'Ana García', 'Inspección general'),
(4, 4, CURRENT_DATE + INTERVAL '15 days', 'Pendiente', 'Alta', 'Miguel Torres', 'Revisión eléctrica trimestral'),
(5, 2, CURRENT_DATE, 'En Proceso', 'Urgente', 'Juan Pérez', 'Reparación de sello mecánico');

-- Insertar algunos registros de mantenimiento históricos
INSERT INTO registros_mantenimiento (equipo_id, tipo_mantenimiento_id, fecha_realizada, tecnico, tiempo_empleado, trabajo_realizado, observaciones, costo_repuestos, costo_mano_obra, estado_equipo_antes, estado_equipo_despues) VALUES
(1, 1, CURRENT_DATE - INTERVAL '30 days', 'Juan Pérez', 120, 'Limpieza general, revisión de conexiones eléctricas, lubricación de rodamientos', 'Equipo en buen estado general', 25.50, 80.00, 'Operativo', 'Operativo'),
(2, 3, CURRENT_DATE - INTERVAL '15 days', 'Carlos López', 45, 'Aplicación de grasa en rodamientos y cambio de aceite', 'Niveles de vibración normales', 15.00, 30.00, 'Operativo', 'Operativo'),
(3, 1, CURRENT_DATE - INTERVAL '25 days', 'Ana García', 90, 'Inspección visual, limpieza de filtros, verificación de amperaje', 'Consumo eléctrico dentro de parámetros', 12.00, 60.00, 'Operativo', 'Operativo');

-- Insertar alertas activas
INSERT INTO alertas (equipo_id, tipo, mensaje, nivel, fecha_vencimiento) VALUES
(5, 'Mantenimiento Vencido', 'La bomba BOM-002 tiene mantenimiento vencido desde hace 3 días', 'Crítico', CURRENT_DATE + INTERVAL '7 days'),
(1, 'Mantenimiento Próximo', 'El motor MOT-001 tiene mantenimiento programado en 5 días', 'Advertencia', CURRENT_DATE + INTERVAL '5 days'),
(4, 'Inspección Eléctrica', 'El transformador TRA-001 requiere inspección eléctrica próximamente', 'Info', CURRENT_DATE + INTERVAL '15 days');
