-- Creating database schema for industrial maintenance system

-- Tabla de equipos
CREATE TABLE IF NOT EXISTS equipos (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    tipo VARCHAR(100) NOT NULL, -- 'Motor', 'Bomba', 'Transformador', etc.
    marca VARCHAR(100),
    modelo VARCHAR(100),
    numero_serie VARCHAR(100),
    ubicacion VARCHAR(200) NOT NULL,
    fecha_instalacion DATE,
    potencia VARCHAR(50), -- ej: "5 HP", "220V", etc.
    voltaje VARCHAR(50),
    amperaje VARCHAR(50),
    estado VARCHAR(50) DEFAULT 'Operativo', -- 'Operativo', 'Mantenimiento', 'Fuera de Servicio'
    criticidad VARCHAR(20) DEFAULT 'Media', -- 'Alta', 'Media', 'Baja'
    notas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de tipos de mantenimiento
CREATE TABLE IF NOT EXISTS tipos_mantenimiento (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    frecuencia_dias INTEGER, -- cada cuántos días se debe realizar
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de mantenimientos programados
CREATE TABLE IF NOT EXISTS mantenimientos_programados (
    id SERIAL PRIMARY KEY,
    equipo_id INTEGER REFERENCES equipos(id) ON DELETE CASCADE,
    tipo_mantenimiento_id INTEGER REFERENCES tipos_mantenimiento(id),
    fecha_programada DATE NOT NULL,
    estado VARCHAR(50) DEFAULT 'Pendiente', -- 'Pendiente', 'En Proceso', 'Completado', 'Vencido'
    prioridad VARCHAR(20) DEFAULT 'Normal', -- 'Urgente', 'Alta', 'Normal', 'Baja'
    tecnico_asignado VARCHAR(100),
    notas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de registros de mantenimiento (trabajos realizados)
CREATE TABLE IF NOT EXISTS registros_mantenimiento (
    id SERIAL PRIMARY KEY,
    equipo_id INTEGER REFERENCES equipos(id) ON DELETE CASCADE,
    mantenimiento_programado_id INTEGER REFERENCES mantenimientos_programados(id),
    tipo_mantenimiento_id INTEGER REFERENCES tipos_mantenimiento(id),
    fecha_realizada TIMESTAMP NOT NULL,
    tecnico VARCHAR(100) NOT NULL,
    tiempo_empleado INTEGER, -- en minutos
    trabajo_realizado TEXT NOT NULL,
    observaciones TEXT,
    repuestos_utilizados TEXT,
    costo_repuestos DECIMAL(10,2),
    costo_mano_obra DECIMAL(10,2),
    estado_equipo_antes VARCHAR(50),
    estado_equipo_despues VARCHAR(50),
    proxima_fecha_mantenimiento DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de alertas y notificaciones
CREATE TABLE IF NOT EXISTS alertas (
    id SERIAL PRIMARY KEY,
    equipo_id INTEGER REFERENCES equipos(id) ON DELETE CASCADE,
    tipo VARCHAR(50) NOT NULL, -- 'Mantenimiento Vencido', 'Mantenimiento Próximo', 'Equipo Crítico'
    mensaje TEXT NOT NULL,
    nivel VARCHAR(20) DEFAULT 'Info', -- 'Crítico', 'Advertencia', 'Info'
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_vencimiento TIMESTAMP,
    estado VARCHAR(20) DEFAULT 'Activa', -- 'Activa', 'Leída', 'Resuelta'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_equipos_codigo ON equipos(codigo);
CREATE INDEX IF NOT EXISTS idx_equipos_tipo ON equipos(tipo);
CREATE INDEX IF NOT EXISTS idx_equipos_estado ON equipos(estado);
CREATE INDEX IF NOT EXISTS idx_mantenimientos_fecha ON mantenimientos_programados(fecha_programada);
CREATE INDEX IF NOT EXISTS idx_mantenimientos_estado ON mantenimientos_programados(estado);
CREATE INDEX IF NOT EXISTS idx_registros_fecha ON registros_mantenimiento(fecha_realizada);
CREATE INDEX IF NOT EXISTS idx_alertas_estado ON alertas(estado);
