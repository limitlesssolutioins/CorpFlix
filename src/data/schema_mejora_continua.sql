-- Schema para Módulo de Mejora Continua
-- Sistema de gestión de sugerencias Kaizen, proyectos de mejora y lecciones aprendidas

-- =====================================================
-- CATEGORÍAS Y ESTADOS
-- =====================================================

-- Categorías de sugerencias/proyectos
CREATE TABLE IF NOT EXISTS improvement_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_name TEXT NOT NULL UNIQUE,
    description TEXT,
    color TEXT
);

-- Estados de sugerencias
CREATE TABLE IF NOT EXISTS suggestion_status (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    status_code TEXT NOT NULL UNIQUE,
    status_name TEXT NOT NULL,
    color TEXT
);

-- =====================================================
-- SUGERENCIAS DE MEJORA (KAIZEN)
-- =====================================================

CREATE TABLE IF NOT EXISTS improvement_suggestions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    suggestion_code TEXT UNIQUE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category_id INTEGER,
    status_id INTEGER DEFAULT 1,
    submitted_by TEXT,
    submitted_by_id INTEGER,
    submitted_date DATE DEFAULT CURRENT_DATE,
    area_affected TEXT,
    current_situation TEXT,
    proposed_solution TEXT,
    expected_benefits TEXT,
    estimated_savings REAL DEFAULT 0,
    votes INTEGER DEFAULT 0,
    priority INTEGER DEFAULT 3,
    assigned_to TEXT,
    evaluation_notes TEXT,
    implementation_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES improvement_categories(id),
    FOREIGN KEY (status_id) REFERENCES suggestion_status(id)
);

CREATE INDEX idx_suggestions_status ON improvement_suggestions(status_id);
CREATE INDEX idx_suggestions_category ON improvement_suggestions(category_id);
CREATE INDEX idx_suggestions_date ON improvement_suggestions(submitted_date);

-- Comentarios en sugerencias
CREATE TABLE IF NOT EXISTS suggestion_comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    suggestion_id INTEGER NOT NULL,
    comment_text TEXT NOT NULL,
    commented_by TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (suggestion_id) REFERENCES improvement_suggestions(id) ON DELETE CASCADE
);

-- =====================================================
-- PROYECTOS DE MEJORA
-- =====================================================

CREATE TABLE IF NOT EXISTS improvement_projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_code TEXT UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    category_id INTEGER,
    suggestion_id INTEGER,
    objective_smart TEXT,
    scope TEXT,
    project_leader TEXT,
    team_members TEXT,
    start_date DATE,
    target_end_date DATE,
    actual_end_date DATE,
    current_phase TEXT DEFAULT 'PLAN',
    status TEXT DEFAULT 'ACTIVE',
    budget REAL DEFAULT 0,
    actual_cost REAL DEFAULT 0,
    expected_roi REAL DEFAULT 0,
    actual_roi REAL DEFAULT 0,
    progress INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES improvement_categories(id),
    FOREIGN KEY (suggestion_id) REFERENCES improvement_suggestions(id)
);

CREATE INDEX idx_projects_phase ON improvement_projects(current_phase);
CREATE INDEX idx_projects_status ON improvement_projects(status);

-- Fases PDCA del proyecto
CREATE TABLE IF NOT EXISTS project_phases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    phase_name TEXT NOT NULL,
    phase_description TEXT,
    start_date DATE,
    end_date DATE,
    status TEXT DEFAULT 'PENDING',
    deliverables TEXT,
    notes TEXT,
    FOREIGN KEY (project_id) REFERENCES improvement_projects(id) ON DELETE CASCADE
);

-- Milestones del proyecto
CREATE TABLE IF NOT EXISTS project_milestones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    milestone_title TEXT NOT NULL,
    target_date DATE,
    completion_date DATE,
    is_completed INTEGER DEFAULT 0,
    notes TEXT,
    FOREIGN KEY (project_id) REFERENCES improvement_projects(id) ON DELETE CASCADE
);

-- =====================================================
-- LECCIONES APRENDIDAS
-- =====================================================

CREATE TABLE IF NOT EXISTS lessons_learned (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lesson_code TEXT UNIQUE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    context TEXT,
    what_worked TEXT,
    what_didnt_work TEXT,
    recommendations TEXT,
    category_id INTEGER,
    project_id INTEGER,
    submitted_by TEXT,
    lesson_date DATE DEFAULT CURRENT_DATE,
    tags TEXT,
    is_public INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES improvement_categories(id),
    FOREIGN KEY (project_id) REFERENCES improvement_projects(id)
);

CREATE INDEX idx_lessons_date ON lessons_learned(lesson_date);
CREATE INDEX idx_lessons_category ON lessons_learned(category_id);

-- =====================================================
-- MÉTRICAS DE MEJORA
-- =====================================================

CREATE TABLE IF NOT EXISTS improvement_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    metric_name TEXT NOT NULL,
    metric_value REAL NOT NULL,
    metric_unit TEXT,
    measurement_date DATE DEFAULT CURRENT_DATE,
    project_id INTEGER,
    suggestion_id INTEGER,
    notes TEXT,
    FOREIGN KEY (project_id) REFERENCES improvement_projects(id),
    FOREIGN KEY (suggestion_id) REFERENCES improvement_suggestions(id)
);

-- =====================================================
-- DATOS INICIALES
-- =====================================================

-- Categorías predefinidas
INSERT OR IGNORE INTO improvement_categories (category_name, description, color) VALUES
('Calidad', 'Mejoras en procesos de calidad', '#3b82f6'),
('Productividad', 'Optimización de eficiencia operativa', '#10b981'),
('Seguridad', 'Mejoras en seguridad y salud ocupacional', '#ef4444'),
('Costos', 'Reducción de costos y optimización de recursos', '#f59e0b'),
('Medio Ambiente', 'Mejoras ambientales y sostenibilidad', '#22c55e'),
('Servicio al Cliente', 'Mejoras en atención y satisfacción del cliente', '#8b5cf6'),
('Tecnología', 'Innovación y mejoras tecnológicas', '#06b6d4'),
('Cultura', 'Mejoras en clima laboral y cultura organizacional', '#ec4899');

-- Estados de sugerencias
INSERT OR IGNORE INTO suggestion_status (status_code, status_name, color) VALUES
('NEW', 'Nueva', '#3b82f6'),
('UNDER_REVIEW', 'En Evaluación', '#f59e0b'),
('APPROVED', 'Aprobada', '#10b981'),
('IN_IMPLEMENTATION', 'En Implementación', '#8b5cf6'),
('IMPLEMENTED', 'Implementada', '#22c55e'),
('REJECTED', 'Rechazada', '#ef4444'),
('CONVERTED_TO_PROJECT', 'Convertida a Proyecto', '#06b6d4');
