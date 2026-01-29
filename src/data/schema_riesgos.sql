-- ============================================================================
-- MÓDULO DE GESTIÓN DE RIESGOS - ESQUEMA DE BASE DE DATOS
-- ============================================================================

-- Tabla: Categorías de Riesgo
CREATE TABLE IF NOT EXISTS risk_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  color VARCHAR(20), -- hex color para UI
  icon VARCHAR(50), -- nombre del ícono
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: Criterios de Probabilidad (Universal para todas las categorías)
CREATE TABLE IF NOT EXISTS probability_criteria (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  level INTEGER NOT NULL UNIQUE, -- 1-5
  name VARCHAR(50) NOT NULL, -- 'REMOTA', 'BAJA', 'MEDIA', 'ALTA', 'MUY ALTA'
  description TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: Criterios de Consecuencia (Específicos por categoría)
CREATE TABLE IF NOT EXISTS consequence_criteria (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER NOT NULL,
  level INTEGER NOT NULL, -- 1-5
  name VARCHAR(50) NOT NULL, -- 'INSIGNIFICANTE', 'BAJA', 'MEDIA', 'ALTA', 'SIGNIFICATIVA'
  description TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES risk_categories(id) ON DELETE CASCADE,
  UNIQUE (category_id, level)
);

-- Tabla: Matriz de Riesgo (Factores de Conversión)
CREATE TABLE IF NOT EXISTS risk_matrix (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  inherent_risk INTEGER NOT NULL UNIQUE, -- 1-25 (probabilidad × consecuencia)
  conversion_factor INTEGER NOT NULL, -- 1-5
  level_name VARCHAR(50) NOT NULL, -- 'MUY BAJO', 'BAJO', 'MEDIO', 'ALTO', 'MUY ALTO'
  color VARCHAR(20), -- hex color para visualización
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: Criterios de Eficacia de Controles
CREATE TABLE IF NOT EXISTS control_effectiveness_criteria (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  level INTEGER NOT NULL UNIQUE, -- 1-5
  name VARCHAR(50) NOT NULL, -- 'MUY BAJA', 'BAJA', 'MEDIA', 'ALTA', 'MUY ALTA'
  description TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: Catálogo de Riesgos
CREATE TABLE IF NOT EXISTS risks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER NOT NULL,
  code VARCHAR(50) UNIQUE,
  type VARCHAR(100), -- Ej: 'IMAGEN', 'LEGALIDAD', 'BIOLÓGICO', etc.
  description TEXT NOT NULL,
  caused_by TEXT, -- Generado por / Causado por
  impact TEXT, -- Posible impacto / consecuencia
  related_activity VARCHAR(255), -- Actividad relacionada
  related_process VARCHAR(255), -- Proceso relacionado
  status VARCHAR(50) DEFAULT 'ACTIVE', -- 'ACTIVE', 'ARCHIVED'
  created_by INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES risk_categories(id) ON DELETE RESTRICT
);

-- Tabla: Evaluaciones de Riesgo
CREATE TABLE IF NOT EXISTS risk_assessments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  risk_id INTEGER NOT NULL,
  assessment_date DATE NOT NULL,
  assessed_by INTEGER,
  
  -- Análisis del Riesgo Inherente
  probability INTEGER NOT NULL, -- 1-5
  consequence INTEGER NOT NULL, -- 1-5
  inherent_risk INTEGER NOT NULL, -- probabilidad × consecuencia (1-25)
  conversion_factor INTEGER NOT NULL, -- 1-5
  inherent_risk_level VARCHAR(50), -- 'MUY BAJO', 'BAJO', 'MEDIO', 'ALTO', 'MUY ALTO'
  
  -- Riesgo Residual (después de controles)
  residual_risk_level VARCHAR(50), -- 'ACEPTABLE/NO PRIORITARIO/NO SIGNIFICATIVO', etc.
  
  -- Clasificación
  priority VARCHAR(50), -- 'PRIORITARIO', 'NO PRIORITARIO'
  significance VARCHAR(50), -- 'SIGNIFICATIVO', 'NO SIGNIFICATIVO'
  acceptability VARCHAR(50), -- 'ACEPTABLE', 'ALERTA', 'NO ACEPTABLE'
  
  -- Condiciones (para riesgos SST y Ambientales)
  condition_normal BOOLEAN DEFAULT FALSE,
  condition_abnormal BOOLEAN DEFAULT FALSE,
  condition_emergency BOOLEAN DEFAULT FALSE,
  condition_routine BOOLEAN DEFAULT FALSE,
  condition_non_routine BOOLEAN DEFAULT FALSE,
  
  -- Exposición (para riesgos SST)
  exposed_permanent INTEGER DEFAULT 0,
  exposed_temporary INTEGER DEFAULT 0,
  exposed_contractor INTEGER DEFAULT 0,
  exposed_visitor INTEGER DEFAULT 0,
  
  notes TEXT,
  status VARCHAR(50) DEFAULT 'ACTIVE',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (risk_id) REFERENCES risks(id) ON DELETE CASCADE
);

-- Tabla: Controles de Riesgo
CREATE TABLE IF NOT EXISTS risk_controls (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  assessment_id INTEGER NOT NULL,
  description TEXT NOT NULL,
  control_type VARCHAR(50), -- 'PREVENTIVO', 'CORRECTIVO', 'DETECTIVO'
  effectiveness INTEGER, -- 1-5 nivel de eficacia
  effectiveness_level VARCHAR(50), -- 'MUY BAJA', 'BAJA', 'MEDIA', 'ALTA', 'MUY ALTA'
  responsible VARCHAR(255),
  implementation_date DATE,
  review_date DATE,
  status VARCHAR(50) DEFAULT 'ACTIVE', -- 'ACTIVE', 'INACTIVE', 'PENDING'
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (assessment_id) REFERENCES risk_assessments(id) ON DELETE CASCADE
);

-- Tabla: Planes de Acción
CREATE TABLE IF NOT EXISTS action_plans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  assessment_id INTEGER NOT NULL,
  action_description TEXT NOT NULL,
  responsible VARCHAR(255),
  start_date DATE,
  target_date DATE,
  completion_date DATE,
  status VARCHAR(50) DEFAULT 'PENDING', -- 'PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'
  progress INTEGER DEFAULT 0, -- 0-100%
  budget DECIMAL(15,2),
  actual_cost DECIMAL(15,2),
  verification_method TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (assessment_id) REFERENCES risk_assessments(id) ON DELETE CASCADE
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_risks_category ON risks(category_id);
CREATE INDEX IF NOT EXISTS idx_risks_status ON risks(status);
CREATE INDEX IF NOT EXISTS idx_assessments_risk ON risk_assessments(risk_id);
CREATE INDEX IF NOT EXISTS idx_assessments_date ON risk_assessments(assessment_date);
CREATE INDEX IF NOT EXISTS idx_controls_assessment ON risk_controls(assessment_id);
CREATE INDEX IF NOT EXISTS idx_actions_assessment ON action_plans(assessment_id);
CREATE INDEX IF NOT EXISTS idx_actions_status ON action_plans(status);
CREATE INDEX IF NOT EXISTS idx_actions_target_date ON action_plans(target_date);

-- ============================================================================
-- DATOS INICIALES
-- ============================================================================

-- Insertar Criterios de Probabilidad (Universal)
INSERT INTO probability_criteria (level, name, description) VALUES
(1, 'REMOTA', 'El evento no ha ocurrido, pero puede suceder únicamente en casos extremos.'),
(2, 'BAJA', 'El evento puede suceder y ha ocurrido en organizaciones similares, por lo menos 1 vez al año.'),
(3, 'MEDIA', 'El evento puede suceder y ha ocurrido en la organización, por lo menos 1 vez al año.'),
(4, 'ALTA', 'El evento puede suceder con facilidad, por lo menos 1 vez al mes.'),
(5, 'MUY ALTA', 'El evento sucede frecuentemente, al menos 1 vez a la semana.');

-- Insertar Matriz de Riesgo (Factores de Conversión)
INSERT INTO risk_matrix (inherent_risk, conversion_factor, level_name, color) VALUES
-- MUY BAJO (1-4)
(1, 1, 'MUY BAJO', '#4CAF50'),
(2, 1, 'MUY BAJO', '#4CAF50'),
(3, 1, 'MUY BAJO', '#4CAF50'),
(4, 1, 'MUY BAJO', '#4CAF50'),
-- BAJO (5-8)
(5, 2, 'BAJO', '#8BC34A'),
(6, 2, 'BAJO', '#8BC34A'),
(7, 2, 'BAJO', '#8BC34A'),
(8, 2, 'BAJO', '#8BC34A'),
-- MEDIO (9-15)
(9, 3, 'MEDIO', '#FFC107'),
(10, 3, 'MEDIO', '#FFC107'),
(11, 3, 'MEDIO', '#FFC107'),
(12, 3, 'MEDIO', '#FFC107'),
(13, 3, 'MEDIO', '#FFC107'),
(14, 3, 'MEDIO', '#FFC107'),
(15, 3, 'MEDIO', '#FFC107'),
-- ALTO (16-20)
(16, 4, 'ALTO', '#FF9800'),
(17, 4, 'ALTO', '#FF9800'),
(18, 4, 'ALTO', '#FF9800'),
(19, 4, 'ALTO', '#FF9800'),
(20, 4, 'ALTO', '#FF9800'),
-- MUY ALTO (25)
(25, 5, 'MUY ALTO', '#F44336');

-- Insertar Criterios de Eficacia de Controles
INSERT INTO control_effectiveness_criteria (level, name, description) VALUES
(1, 'MUY ALTA', 'Hay pleno entendimiento del riesgo, existen y mantienen actualizados procedimientos y programas que se divulgan de manera permanente, no se registra materialización del riesgo, debido a la eficacia de los controles actuales.'),
(2, 'ALTA', 'Hay alto entendimiento del riesgo, existen y se mantienen actualizados procedimientos y programas que se divulgan al personal de manera regular, se ha materializado el riesgo por lo menos una (1) vez en el año.'),
(3, 'MEDIA', 'Hay conciencia del riesgo, existen procedimientos y programas, pero no se actualizan, ni se divulgan, se ha materializado el riesgo por lo menos una vez (1) en el año.'),
(4, 'BAJA', 'Hay algo de conciencia del riesgo, no hay procedimientos, ni programas formales, se ha materializado el riesgo por lo menos una (1) vez en el año.'),
(5, 'MUY BAJA', 'No hay ninguna conciencia del riesgo, no existen procedimientos, ni programas, se ha materializado el riesgo muchas veces en el año.');

-- Insertar Categorías de Riesgo
INSERT INTO risk_categories (code, name, description, color, icon) VALUES
('CALIDAD', 'Riesgos de Calidad', 'Riesgos que pueden afectar la calidad de productos, servicios y procesos de la organización.', '#2196F3', 'Award'),
('SST', 'Riesgos SST (Salud y Seguridad en el Trabajo)', 'Peligros y factores de riesgo que pueden afectar la salud y seguridad de los trabajadores.', '#FF5722', 'Shield'),
('AMBIENTAL', 'Riesgos Ambientales', 'Aspectos e impactos ambientales de las actividades de la organización.', '#4CAF50', 'Leaf'),
('CIBERSEGURIDAD', 'Riesgos de Ciberseguridad', 'Riesgos relacionados con la protección de activos de información y tecnología.', '#9C27B0', 'Lock'),
('FINANCIERO', 'Riesgos Financieros', 'Riesgos que pueden afectar la situación económica y sostenibilidad financiera.', '#FFB300', 'DollarSign'),
('SEGURIDAD_VIAL', 'Riesgos de Seguridad Vial', 'Riesgos asociados con el uso de vehículos y desplazamientos del personal.', '#F44336', 'Car');
