-- Schema para Módulo de Auditoría ISO 9001:2015
-- Sistema de gestión de auditorías internas basado en la norma

-- =====================================================
-- ESTRUCTURA ISO 9001:2015
-- =====================================================

-- Capítulos de ISO 9001:2015 (4-10)
CREATE TABLE IF NOT EXISTS iso_chapters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chapter_number TEXT NOT NULL UNIQUE,
    chapter_title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Requisitos específicos de cada capítulo
CREATE TABLE IF NOT EXISTS iso_requirements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chapter_id INTEGER NOT NULL,
    requirement_code TEXT NOT NULL UNIQUE,
    requirement_title TEXT NOT NULL,
    requirement_description TEXT,
    is_auditable INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chapter_id) REFERENCES iso_chapters(id) ON DELETE CASCADE
);

CREATE INDEX idx_requirements_chapter ON iso_requirements(chapter_id);

-- =====================================================
-- AUDITORÍAS
-- =====================================================

-- Tipos de auditoría
CREATE TABLE IF NOT EXISTS audit_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type_name TEXT NOT NULL UNIQUE,
    description TEXT
);

-- Auditorías planificadas/realizadas
CREATE TABLE IF NOT EXISTS audits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    audit_code TEXT UNIQUE,
    audit_type_id INTEGER,
    audit_date DATE NOT NULL,
    planned_date DATE,
    auditor_name TEXT,
    auditor_id INTEGER,
    scope TEXT,
    objectives TEXT,
    status TEXT DEFAULT 'PLANNED',
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (audit_type_id) REFERENCES audit_types(id)
);

CREATE INDEX idx_audits_date ON audits(audit_date);
CREATE INDEX idx_audits_status ON audits(status);

-- Capítulos cubiertos en cada auditoría
CREATE TABLE IF NOT EXISTS audit_scope_chapters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    audit_id INTEGER NOT NULL,
    chapter_id INTEGER NOT NULL,
    FOREIGN KEY (audit_id) REFERENCES audits(id) ON DELETE CASCADE,
    FOREIGN KEY (chapter_id) REFERENCES iso_chapters(id) ON DELETE CASCADE
);

-- =====================================================
-- HALLAZGOS
-- =====================================================

-- Tipos de hallazgo
CREATE TABLE IF NOT EXISTS finding_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type_code TEXT NOT NULL UNIQUE,
    type_name TEXT NOT NULL,
    severity_level INTEGER,
    color TEXT,
    requires_action INTEGER DEFAULT 0
);

-- Hallazgos de auditoría
CREATE TABLE IF NOT EXISTS audit_findings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    audit_id INTEGER NOT NULL,
    requirement_id INTEGER NOT NULL,
    finding_type_id INTEGER NOT NULL,
    finding_description TEXT,
    evidence TEXT,
    observations TEXT,
    auditor_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (audit_id) REFERENCES audits(id) ON DELETE CASCADE,
    FOREIGN KEY (requirement_id) REFERENCES iso_requirements(id),
    FOREIGN KEY (finding_type_id) REFERENCES finding_types(id)
);

CREATE INDEX idx_findings_audit ON audit_findings(audit_id);
CREATE INDEX idx_findings_type ON audit_findings(finding_type_id);

-- =====================================================
-- ACCIONES CORRECTIVAS
-- =====================================================

-- Acciones correctivas para no conformidades
CREATE TABLE IF NOT EXISTS corrective_actions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    finding_id INTEGER NOT NULL,
    action_code TEXT UNIQUE,
    root_cause_analysis TEXT,
    corrective_action TEXT NOT NULL,
    responsible TEXT,
    responsible_id INTEGER,
    target_date DATE,
    completion_date DATE,
    status TEXT DEFAULT 'OPEN',
    progress INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (finding_id) REFERENCES audit_findings(id) ON DELETE CASCADE
);

CREATE INDEX idx_actions_status ON corrective_actions(status);
CREATE INDEX idx_actions_target_date ON corrective_actions(target_date);

-- Verificación de eficacia de acciones
CREATE TABLE IF NOT EXISTS action_verification (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action_id INTEGER NOT NULL,
    verification_date DATE,
    verified_by TEXT,
    verification_method TEXT,
    is_effective INTEGER,
    verification_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (action_id) REFERENCES corrective_actions(id) ON DELETE CASCADE
);

-- =====================================================
-- DATOS INICIALES
-- =====================================================

-- Insertar capítulos de ISO 9001:2015
INSERT OR IGNORE INTO iso_chapters (chapter_number, chapter_title, description) VALUES
('4', 'CONTEXTO DE LA ORGANIZACIÓN', 'Comprensión de la organización, partes interesadas, alcance del SGC y sus procesos'),
('5', 'LIDERAZGO', 'Liderazgo y compromiso, política de calidad, roles y responsabilidades'),
('6', 'PLANIFICACIÓN', 'Acciones para abordar riesgos y oportunidades, objetivos de calidad y planificación'),
('7', 'SOPORTE', 'Recursos, competencia, toma de conciencia, comunicación e información documentada'),
('8', 'OPERACIÓN', 'Planificación y control operacional, requisitos del producto/servicio, diseño, producción'),
('9', 'EVALUACIÓN DEL DESEMPEÑO', 'Seguimiento, medición, análisis, evaluación, auditoría interna y revisión por la dirección'),
('10', 'MEJORA', 'No conformidad y acción correctiva, mejora continua');

-- Insertar requisitos del Capítulo 4
INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title) VALUES
((SELECT id FROM iso_chapters WHERE chapter_number = '4'), '4.1', 'Comprensión de la organización y de su contexto'),
((SELECT id FROM iso_chapters WHERE chapter_number = '4'), '4.2', 'Comprensión de las necesidades y expectativas de las partes interesadas'),
((SELECT id FROM iso_chapters WHERE chapter_number = '4'), '4.3', 'Determinación del alcance del sistema de gestión de la calidad'),
((SELECT id FROM iso_chapters WHERE chapter_number = '4'), '4.4', 'Sistema de gestión de la calidad y sus procesos');

-- Insertar requisitos del Capítulo 5
INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title) VALUES
((SELECT id FROM iso_chapters WHERE chapter_number = '5'), '5.1', 'Liderazgo y compromiso'),
((SELECT id FROM iso_chapters WHERE chapter_number = '5'), '5.2', 'Política de la calidad'),
((SELECT id FROM iso_chapters WHERE chapter_number = '5'), '5.3', 'Roles, responsabilidades y autoridades en la organización');

-- Insertar requisitos del Capítulo 6
INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title) VALUES
((SELECT id FROM iso_chapters WHERE chapter_number = '6'), '6.1', 'Acciones para abordar riesgos y oportunidades'),
((SELECT id FROM iso_chapters WHERE chapter_number = '6'), '6.2', 'Objetivos de la calidad y planificación para lograrlos'),
((SELECT id FROM iso_chapters WHERE chapter_number = '6'), '6.3', 'Planificación de los cambios');

-- Insertar requisitos del Capítulo 7
INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title) VALUES
((SELECT id FROM iso_chapters WHERE chapter_number = '7'), '7.1', 'Recursos'),
((SELECT id FROM iso_chapters WHERE chapter_number = '7'), '7.2', 'Competencia'),
((SELECT id FROM iso_chapters WHERE chapter_number = '7'), '7.3', 'Toma de conciencia'),
((SELECT id FROM iso_chapters WHERE chapter_number = '7'), '7.4', 'Comunicación'),
((SELECT id FROM iso_chapters WHERE chapter_number = '7'), '7.5', 'Información documentada');

-- Insertar requisitos del Capítulo 8
INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title) VALUES
((SELECT id FROM iso_chapters WHERE chapter_number = '8'), '8.1', 'Planificación y control operacional'),
((SELECT id FROM iso_chapters WHERE chapter_number = '8'), '8.2', 'Requisitos para los productos y servicios'),
((SELECT id FROM iso_chapters WHERE chapter_number = '8'), '8.3', 'Diseño y desarrollo de los productos y servicios'),
((SELECT id FROM iso_chapters WHERE chapter_number = '8'), '8.4', 'Control de los procesos, productos y servicios suministrados externamente'),
((SELECT id FROM iso_chapters WHERE chapter_number = '8'), '8.5', 'Producción y provisión del servicio'),
((SELECT id FROM iso_chapters WHERE chapter_number = '8'), '8.6', 'Liberación de los productos y servicios'),
((SELECT id FROM iso_chapters WHERE chapter_number = '8'), '8.7', 'Control de las salidas no conformes');

-- Insertar requisitos del Capítulo 9
INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title) VALUES
((SELECT id FROM iso_chapters WHERE chapter_number = '9'), '9.1', 'Seguimiento, medición, análisis y evaluación'),
((SELECT id FROM iso_chapters WHERE chapter_number = '9'), '9.2', 'Auditoría interna'),
((SELECT id FROM iso_chapters WHERE chapter_number = '9'), '9.3', 'Revisión por la dirección');

-- Insertar requisitos del Capítulo 10
INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title) VALUES
((SELECT id FROM iso_chapters WHERE chapter_number = '10'), '10.1', 'Generalidades'),
((SELECT id FROM iso_chapters WHERE chapter_number = '10'), '10.2', 'No conformidad y acción correctiva'),
((SELECT id FROM iso_chapters WHERE chapter_number = '10'), '10.3', 'Mejora continua');

-- Insertar tipos de auditoría
INSERT OR IGNORE INTO audit_types (type_name, description) VALUES
('INTERNA', 'Auditoría interna del sistema de gestión'),
('EXTERNA', 'Auditoría externa o de certificaciónción'),
('SEGUIMIENTO', 'Auditoría de seguimiento a acciones correctivas'),
('PRODUCTO', 'Auditoría de producto'),
('PROCESO', 'Auditoría de proceso específico');

-- Insertar tipos de hallazgo
INSERT OR IGNORE INTO finding_types (type_code, type_name, severity_level, color, requires_action) VALUES
('C', 'CONFORMIDAD', 0, '#10b981', 0),
('O', 'OBSERVACIÓN', 1, '#f59e0b', 0),
('NC_MENOR', 'NO CONFORMIDAD MENOR', 2, '#f97316', 1),
('NC_MAYOR', 'NO CONFORMIDAD MAYOR', 3, '#ef4444', 1);
