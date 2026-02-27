-- Schema para Módulo de Auditoría Multi-Norma
-- Soporta: ISO 9001, ISO 14001, ISO 45001, Resolución 0312, ISO 27001, ISO 39001

-- =====================================================
-- NORMAS DE AUDITORÍA
-- =====================================================

CREATE TABLE IF NOT EXISTS audit_standards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    full_name TEXT NOT NULL,
    category TEXT,
    color TEXT DEFAULT '#3b82f6',
    description TEXT
);

-- =====================================================
-- ESTRUCTURA DE NORMAS
-- =====================================================

CREATE TABLE IF NOT EXISTS iso_chapters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    standard_id INTEGER NOT NULL DEFAULT 1,
    chapter_number TEXT NOT NULL,
    chapter_title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(standard_id, chapter_number),
    FOREIGN KEY (standard_id) REFERENCES audit_standards(id)
);

CREATE TABLE IF NOT EXISTS iso_requirements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chapter_id INTEGER NOT NULL,
    requirement_code TEXT NOT NULL,
    requirement_title TEXT NOT NULL,
    requirement_description TEXT,
    is_auditable INTEGER DEFAULT 1,
    weight REAL DEFAULT 0,
    profile TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(chapter_id, requirement_code),
    FOREIGN KEY (chapter_id) REFERENCES iso_chapters(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_requirements_chapter ON iso_requirements(chapter_id);

-- =====================================================
-- AUDITORÍAS
-- =====================================================

CREATE TABLE IF NOT EXISTS audit_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type_name TEXT NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE IF NOT EXISTS audits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    audit_code TEXT UNIQUE,
    standard_id INTEGER DEFAULT 1,
    audit_type_id INTEGER,
    audit_date DATE NOT NULL,
    planned_date DATE,
    auditor_name TEXT,
    auditor_id INTEGER,
    scope TEXT,
    objectives TEXT,
    company_profile TEXT,
    status TEXT DEFAULT 'PLANNED',
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (audit_type_id) REFERENCES audit_types(id),
    FOREIGN KEY (standard_id) REFERENCES audit_standards(id)
);

CREATE INDEX IF NOT EXISTS idx_audits_date ON audits(audit_date);
CREATE INDEX IF NOT EXISTS idx_audits_status ON audits(status);
CREATE INDEX IF NOT EXISTS idx_audits_standard ON audits(standard_id);

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

CREATE TABLE IF NOT EXISTS finding_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type_code TEXT NOT NULL UNIQUE,
    type_name TEXT NOT NULL,
    severity_level INTEGER,
    color TEXT,
    requires_action INTEGER DEFAULT 0
);

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
    UNIQUE(audit_id, requirement_id),
    FOREIGN KEY (audit_id) REFERENCES audits(id) ON DELETE CASCADE,
    FOREIGN KEY (requirement_id) REFERENCES iso_requirements(id),
    FOREIGN KEY (finding_type_id) REFERENCES finding_types(id)
);

CREATE INDEX IF NOT EXISTS idx_findings_audit ON audit_findings(audit_id);
CREATE INDEX IF NOT EXISTS idx_findings_type ON audit_findings(finding_type_id);

-- =====================================================
-- ACCIONES CORRECTIVAS
-- =====================================================

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

CREATE INDEX IF NOT EXISTS idx_actions_status ON corrective_actions(status);
CREATE INDEX IF NOT EXISTS idx_actions_target_date ON corrective_actions(target_date);

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
-- DATOS INICIALES: NORMAS
-- =====================================================

INSERT OR IGNORE INTO audit_standards (code, name, full_name, category, color, description) VALUES
('ISO9001', 'ISO 9001:2015', 'ISO 9001:2015 - Sistemas de Gestión de la Calidad', 'Calidad', '#3b82f6', 'Establece los requisitos para un sistema de gestión de la calidad orientado a la satisfacción del cliente y la mejora continua.'),
('ISO14001', 'ISO 14001:2015', 'ISO 14001:2015 - Sistemas de Gestión Ambiental', 'Medio Ambiente', '#10b981', 'Proporciona un marco para proteger el medio ambiente y responder a las condiciones ambientales cambiantes.'),
('ISO45001', 'ISO 45001:2018', 'ISO 45001:2018 - Sistemas de Gestión de SST', 'Seguridad y Salud en el Trabajo', '#f59e0b', 'Especifica los requisitos para un sistema de gestión de la seguridad y salud en el trabajo.'),
('RES0312', 'Res. 0312:2019', 'Resolución 0312:2019 - Estándares Mínimos SST Colombia', 'Seguridad y Salud en el Trabajo', '#ef4444', 'Define los estándares mínimos del Sistema de Gestión de SST para empleadores y contratantes en Colombia.'),
('ISO27001', 'ISO 27001:2022', 'ISO 27001:2022 - Sistemas de Gestión de Seguridad de la Información', 'Seguridad de la Información', '#8b5cf6', 'Establece los requisitos para un sistema de gestión de la seguridad de la información.'),
('ISO39001', 'ISO 39001:2012', 'ISO 39001:2012 - Sistemas de Gestión de la Seguridad Vial', 'Seguridad Vial', '#06b6d4', 'Especifica los requisitos de un sistema de gestión de la seguridad vial para reducir muertes y lesiones graves.');

-- =====================================================
-- ISO 9001:2015 — CAPÍTULOS Y REQUISITOS
-- =====================================================

INSERT OR IGNORE INTO iso_chapters (standard_id, chapter_number, chapter_title, description) VALUES
((SELECT id FROM audit_standards WHERE code='ISO9001'), '4', 'CONTEXTO DE LA ORGANIZACIÓN', 'Comprensión de la organización, partes interesadas, alcance del SGC y sus procesos'),
((SELECT id FROM audit_standards WHERE code='ISO9001'), '5', 'LIDERAZGO', 'Liderazgo y compromiso, política de calidad, roles y responsabilidades'),
((SELECT id FROM audit_standards WHERE code='ISO9001'), '6', 'PLANIFICACIÓN', 'Acciones para abordar riesgos y oportunidades, objetivos de calidad y planificación'),
((SELECT id FROM audit_standards WHERE code='ISO9001'), '7', 'SOPORTE', 'Recursos, competencia, toma de conciencia, comunicación e información documentada'),
((SELECT id FROM audit_standards WHERE code='ISO9001'), '8', 'OPERACIÓN', 'Planificación y control operacional, requisitos del producto/servicio, diseño, producción'),
((SELECT id FROM audit_standards WHERE code='ISO9001'), '9', 'EVALUACIÓN DEL DESEMPEÑO', 'Seguimiento, medición, análisis, evaluación, auditoría interna y revisión por la dirección'),
((SELECT id FROM audit_standards WHERE code='ISO9001'), '10', 'MEJORA', 'No conformidad y acción correctiva, mejora continua');

INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='4'), '4.1', 'Comprensión de la organización y de su contexto'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='4'), '4.2', 'Comprensión de las necesidades y expectativas de las partes interesadas'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='4'), '4.3', 'Determinación del alcance del sistema de gestión de la calidad'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='4'), '4.4', 'Sistema de gestión de la calidad y sus procesos');

INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='5'), '5.1', 'Liderazgo y compromiso'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='5'), '5.2', 'Política de la calidad'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='5'), '5.3', 'Roles, responsabilidades y autoridades en la organización');

INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='6'), '6.1', 'Acciones para abordar riesgos y oportunidades'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='6'), '6.2', 'Objetivos de la calidad y planificación para lograrlos'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='6'), '6.3', 'Planificación de los cambios');

INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='7'), '7.1', 'Recursos'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='7'), '7.2', 'Competencia'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='7'), '7.3', 'Toma de conciencia'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='7'), '7.4', 'Comunicación'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='7'), '7.5', 'Información documentada');

INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='8'), '8.1', 'Planificación y control operacional'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='8'), '8.2', 'Requisitos para los productos y servicios'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='8'), '8.3', 'Diseño y desarrollo de los productos y servicios'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='8'), '8.4', 'Control de los procesos, productos y servicios suministrados externamente'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='8'), '8.5', 'Producción y provisión del servicio'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='8'), '8.6', 'Liberación de los productos y servicios'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='8'), '8.7', 'Control de las salidas no conformes');

INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='9'), '9.1', 'Seguimiento, medición, análisis y evaluación'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='9'), '9.2', 'Auditoría interna'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='9'), '9.3', 'Revisión por la dirección');

INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='10'), '10.1', 'Generalidades'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='10'), '10.2', 'No conformidad y acción correctiva'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='10'), '10.3', 'Mejora continua');

-- =====================================================
-- ISO 14001:2015 — CAPÍTULOS Y REQUISITOS
-- =====================================================

INSERT OR IGNORE INTO iso_chapters (standard_id, chapter_number, chapter_title, description) VALUES
((SELECT id FROM audit_standards WHERE code='ISO14001'), '4', 'CONTEXTO DE LA ORGANIZACIÓN', 'Comprensión del contexto organizacional, partes interesadas y alcance del SGA'),
((SELECT id FROM audit_standards WHERE code='ISO14001'), '5', 'LIDERAZGO', 'Liderazgo, compromiso, política ambiental y roles organizacionales'),
((SELECT id FROM audit_standards WHERE code='ISO14001'), '6', 'PLANIFICACIÓN', 'Aspectos ambientales, obligaciones de cumplimiento, objetivos ambientales'),
((SELECT id FROM audit_standards WHERE code='ISO14001'), '7', 'APOYO', 'Recursos, competencia, toma de conciencia, comunicación e información documentada'),
((SELECT id FROM audit_standards WHERE code='ISO14001'), '8', 'OPERACIÓN', 'Planificación y control operacional, preparación y respuesta ante emergencias'),
((SELECT id FROM audit_standards WHERE code='ISO14001'), '9', 'EVALUACIÓN DEL DESEMPEÑO', 'Seguimiento, evaluación del cumplimiento, auditoría interna y revisión por la dirección'),
((SELECT id FROM audit_standards WHERE code='ISO14001'), '10', 'MEJORA', 'No conformidad, acción correctiva y mejora continua');

INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO14001') AND chapter_number='4'), '4.1', 'Comprensión de la organización y de su contexto'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO14001') AND chapter_number='4'), '4.2', 'Comprensión de las necesidades y expectativas de las partes interesadas'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO14001') AND chapter_number='4'), '4.3', 'Determinación del alcance del sistema de gestión ambiental'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO14001') AND chapter_number='4'), '4.4', 'Sistema de gestión ambiental');

INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO14001') AND chapter_number='5'), '5.1', 'Liderazgo y compromiso'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO14001') AND chapter_number='5'), '5.2', 'Política ambiental'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO14001') AND chapter_number='5'), '5.3', 'Roles, responsabilidades y autoridades en la organización');

INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO14001') AND chapter_number='6'), '6.1.1', 'Generalidades — Acciones para abordar riesgos y oportunidades'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO14001') AND chapter_number='6'), '6.1.2', 'Aspectos ambientales'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO14001') AND chapter_number='6'), '6.1.3', 'Obligaciones de cumplimiento'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO14001') AND chapter_number='6'), '6.1.4', 'Planificación de acciones'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO14001') AND chapter_number='6'), '6.2.1', 'Objetivos ambientales'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO14001') AND chapter_number='6'), '6.2.2', 'Planificación de acciones para lograr los objetivos ambientales');

INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO14001') AND chapter_number='7'), '7.1', 'Recursos'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO14001') AND chapter_number='7'), '7.2', 'Competencia'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO14001') AND chapter_number='7'), '7.3', 'Toma de conciencia'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO14001') AND chapter_number='7'), '7.4', 'Comunicación'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO14001') AND chapter_number='7'), '7.5', 'Información documentada');

INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO14001') AND chapter_number='8'), '8.1', 'Planificación y control operacional'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO14001') AND chapter_number='8'), '8.2', 'Preparación y respuesta ante emergencias');

INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO14001') AND chapter_number='9'), '9.1.1', 'Seguimiento, medición, análisis y evaluación — Generalidades'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO14001') AND chapter_number='9'), '9.1.2', 'Evaluación del cumplimiento'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO14001') AND chapter_number='9'), '9.2.1', 'Auditoría interna — Programa'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO14001') AND chapter_number='9'), '9.2.2', 'Auditoría interna — Realización'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO14001') AND chapter_number='9'), '9.3', 'Revisión por la dirección');

INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO14001') AND chapter_number='10'), '10.1', 'Generalidades'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO14001') AND chapter_number='10'), '10.2', 'No conformidad y acción correctiva'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO14001') AND chapter_number='10'), '10.3', 'Mejora continua');

-- =====================================================
-- ISO 45001:2018 — CAPÍTULOS Y REQUISITOS
-- =====================================================

INSERT OR IGNORE INTO iso_chapters (standard_id, chapter_number, chapter_title, description) VALUES
((SELECT id FROM audit_standards WHERE code='ISO45001'), '4', 'CONTEXTO DE LA ORGANIZACIÓN', 'Contexto, partes interesadas, alcance y sistema de gestión SST'),
((SELECT id FROM audit_standards WHERE code='ISO45001'), '5', 'LIDERAZGO Y PARTICIPACIÓN DE LOS TRABAJADORES', 'Liderazgo, política SST, roles, consulta y participación'),
((SELECT id FROM audit_standards WHERE code='ISO45001'), '6', 'PLANIFICACIÓN', 'Identificación de peligros, evaluación de riesgos, requisitos legales y objetivos SST'),
((SELECT id FROM audit_standards WHERE code='ISO45001'), '7', 'APOYO', 'Recursos, competencia, toma de conciencia, comunicación e información documentada'),
((SELECT id FROM audit_standards WHERE code='ISO45001'), '8', 'OPERACIÓN', 'Planificación operacional, gestión del cambio, contratación, adquisiciones y emergencias'),
((SELECT id FROM audit_standards WHERE code='ISO45001'), '9', 'EVALUACIÓN DEL DESEMPEÑO', 'Seguimiento, evaluación cumplimiento legal, auditoría interna y revisión por la dirección'),
((SELECT id FROM audit_standards WHERE code='ISO45001'), '10', 'MEJORA', 'Incidentes, no conformidades, acciones correctivas y mejora continua');

INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO45001') AND chapter_number='4'), '4.1', 'Comprensión de la organización y de su contexto'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO45001') AND chapter_number='4'), '4.2', 'Comprensión de las necesidades y expectativas de los trabajadores y otras partes interesadas'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO45001') AND chapter_number='4'), '4.3', 'Determinación del alcance del SGSST'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO45001') AND chapter_number='4'), '4.4', 'Sistema de gestión de la SST');

INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO45001') AND chapter_number='5'), '5.1', 'Liderazgo y compromiso'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO45001') AND chapter_number='5'), '5.2', 'Política de la SST'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO45001') AND chapter_number='5'), '5.3', 'Roles, responsabilidades y autoridades en la organización'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO45001') AND chapter_number='5'), '5.4', 'Consulta y participación de los trabajadores');

INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO45001') AND chapter_number='6'), '6.1.1', 'Identificación de peligros — Generalidades'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO45001') AND chapter_number='6'), '6.1.2', 'Identificación de peligros y evaluación de los riesgos y oportunidades'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO45001') AND chapter_number='6'), '6.1.3', 'Determinación de requisitos legales y otros requisitos'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO45001') AND chapter_number='6'), '6.1.4', 'Planificación de acciones'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO45001') AND chapter_number='6'), '6.2.1', 'Objetivos de la SST'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO45001') AND chapter_number='6'), '6.2.2', 'Planificación para lograr los objetivos de la SST');

INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO45001') AND chapter_number='7'), '7.1', 'Recursos'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO45001') AND chapter_number='7'), '7.2', 'Competencia'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO45001') AND chapter_number='7'), '7.3', 'Toma de conciencia'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO45001') AND chapter_number='7'), '7.4', 'Comunicación'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO45001') AND chapter_number='7'), '7.5', 'Información documentada');

INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO45001') AND chapter_number='8'), '8.1.1', 'Planificación y control operacional — Generalidades'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO45001') AND chapter_number='8'), '8.1.2', 'Eliminar peligros y reducir riesgos de la SST'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO45001') AND chapter_number='8'), '8.1.3', 'Gestión del cambio'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO45001') AND chapter_number='8'), '8.1.4', 'Contratación externa'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO45001') AND chapter_number='8'), '8.2', 'Preparación y respuesta ante emergencias');

INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO45001') AND chapter_number='9'), '9.1.1', 'Seguimiento, medición, análisis y evaluación del desempeño'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO45001') AND chapter_number='9'), '9.1.2', 'Evaluación del cumplimiento'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO45001') AND chapter_number='9'), '9.2.1', 'Auditoría interna — Programa'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO45001') AND chapter_number='9'), '9.2.2', 'Auditoría interna — Realización'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO45001') AND chapter_number='9'), '9.3', 'Revisión por la dirección');

INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO45001') AND chapter_number='10'), '10.1', 'Generalidades'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO45001') AND chapter_number='10'), '10.2', 'Incidentes, no conformidades y acciones correctivas'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO45001') AND chapter_number='10'), '10.3', 'Mejora continua');

-- =====================================================
-- RESOLUCIÓN 0312:2019 — FASES PHVA Y ESTÁNDARES
-- =====================================================

INSERT OR IGNORE INTO iso_chapters (standard_id, chapter_number, chapter_title, description) VALUES
((SELECT id FROM audit_standards WHERE code='RES0312'), 'I', 'PLANEAR — Gestión Integral del SG-SST', 'Recursos, capacitación y gestión integral del sistema. Puntaje máximo: 25 puntos'),
((SELECT id FROM audit_standards WHERE code='RES0312'), 'II', 'HACER — Gestión de la Salud, Peligros y Amenazas', 'Gestión de la salud, peligros y riesgos, y amenazas. Puntaje máximo: 60 puntos'),
((SELECT id FROM audit_standards WHERE code='RES0312'), 'III', 'VERIFICAR — Verificación del SG-SST', 'Verificación del sistema de gestión SST. Puntaje máximo: 5 puntos'),
((SELECT id FROM audit_standards WHERE code='RES0312'), 'IV', 'ACTUAR — Mejoramiento', 'Acciones preventivas y correctivas con base en los resultados. Puntaje máximo: 10 puntos');

-- PLANEAR: Recursos (10 pts)
INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title, weight, profile) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='I'), '1.1.1', 'Responsable del SG-SST', 0.5, '>50'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='I'), '1.1.2', 'Responsabilidades en el SG-SST', 0.5, '>50'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='I'), '1.1.3', 'Asignación de recursos para el SG-SST', 0.5, '>50'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='I'), '1.1.4', 'Afiliación al Sistema General de Seguridad Social Integral', 0.5, '>50'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='I'), '1.1.5', 'Identificación de trabajadores con contrato alternativo', 0.5, '>50'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='I'), '1.1.6', 'Conformación COPASST / Vigía', 0.5, '>50'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='I'), '1.1.7', 'Capacitación COPASST / Vigía', 0.5, '>50'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='I'), '1.1.8', 'Conformación Comité de Convivencia Laboral', 0.5, '>50');

-- PLANEAR: Capacitación en el SG-SST (6 pts)
INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title, weight, profile) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='I'), '1.2.1', 'Programa Capacitación SG-SST', 2.0, '>50'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='I'), '1.2.2', 'Inducción y Reinducción en SG-SST, actividades de Promoción y Prevención', 2.0, '>50'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='I'), '1.2.3', 'Responsables del SG-SST con curso de capacitación virtual de 50 horas', 2.0, '>50');

-- PLANEAR: Gestión de la Salud (9 pts)
INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title, weight, profile) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='I'), '1.3.1', 'Evaluación Médica Ocupacional — Programa', 1.0, '>50'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='I'), '1.3.2', 'Actividades de Promoción y Prevención en Salud', 1.0, '>50'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='I'), '1.3.3', 'Información al médico de los perfiles de cargo', 1.0, '>50'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='I'), '1.3.4', 'Realización de los exámenes médicos ocupacionales', 1.0, '>50'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='I'), '1.3.5', 'Custodia de Historias Clínicas', 1.0, '>50'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='I'), '1.3.6', 'Restricciones y recomendaciones médico laborales', 1.0, '>50'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='I'), '1.3.7', 'Estilos de vida y entornos saludables (programa Pausas Activas, etc.)', 1.0, '>50'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='I'), '1.3.8', 'Agua potable, servicios sanitarios y disposición de basuras', 1.0, '>50'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='I'), '1.3.9', 'Eliminación adecuada de residuos sólidos, líquidos o gaseosos', 1.0, '>50');

-- HACER: Gestión de la Salud (20 pts)
INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title, weight, profile) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='II'), '2.1.1', 'Política del SG-SST firmada, fecha y comunicada al COPASST', 1.0, '>50'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='II'), '2.1.2', 'Objetivos definidos, claros, medibles, cuantificables y documentados', 1.0, '>50'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='II'), '2.1.3', 'Evaluación e identificación de prioridades', 1.0, '>50'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='II'), '2.1.4', 'Plan Anual de Trabajo', 2.0, '>50'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='II'), '2.1.5', 'Archivo o retención documental del SG-SST', 2.0, '>50'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='II'), '2.1.6', 'Rendición de cuentas del SG-SST', 1.0, '>50'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='II'), '2.1.7', 'Normatividad nacional vigente aplicable en materia de SST', 2.0, '>50'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='II'), '2.1.8', 'Mecanismos de comunicación, auto reporte en SG-SST y SG-SST', 1.0, '>50'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='II'), '2.1.9', 'Identificación, evaluación, valoración de impactos ambientales', 1.0, '>50'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='II'), '2.1.10', 'Reporte de accidentes de trabajo y enfermedad laboral a EPS y ARL', 2.0, '>50'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='II'), '2.1.11', 'Investigación de accidentes, incidentes y enfermedad laboral', 2.0, '>50'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='II'), '2.1.12', 'Descripción sociodemográfica de los trabajadores y caracterización de sus condiciones de salud', 1.0, '>50'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='II'), '2.1.13', 'Actividades de medicina del trabajo y prevención y promoción en salud', 1.0, '>50'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='II'), '2.1.14', 'Evaluación médica ocupacional periódica', 1.0, '>50');

-- HACER: Gestión de Peligros y Riesgos (30 pts)
INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title, weight, profile) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='II'), '2.2.1', 'Metodología para la identificación, evaluación y valoración de peligros', 4.0, '>50'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='II'), '2.2.2', 'Identificación de peligros con participación de todos los niveles de la empresa', 4.0, '>50'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='II'), '2.2.3', 'Identificación y priorización de la naturaleza de los peligros', 3.0, '>50'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='II'), '2.2.4', 'Realización mediciones ambientales, biológicas y perfil sociodemográfico', 4.0, '>50'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='II'), '2.2.5', 'Se implementan las medidas de prevención y control de peligros', 2.5, '>50'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='II'), '2.2.6', 'Entrega de Elementos de Protección Persona EPP, se verifica con guía', 2.5, '>50'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='II'), '2.2.7', 'Plan de prevención, preparación y respuesta ante emergencias', 5.0, '>50'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='II'), '2.2.8', 'Brigada de prevención conformada, capacitada y dotada', 5.0, '>50');

-- HACER: Gestión de Amenazas (10 pts)
INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title, weight, profile) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='II'), '2.3.1', 'Se cuenta con el Plan de Prevención y Preparación ante emergencias', 5.0, '>50'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='II'), '2.3.2', 'Brigada de prevención conformada, capacitada y dotada', 5.0, '>50');

-- VERIFICAR (5 pts)
INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title, weight, profile) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='III'), '3.1.1', 'Revisión anual por la alta dirección, resultados y alcance', 1.25, '>50'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='III'), '3.1.2', 'Planificación auditorías con el COPASST', 1.25, '>50'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='III'), '3.1.3', 'Revisión anual con la alta dirección, resultados y alcance de la auditoria', 1.25, '>50'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='III'), '3.1.4', 'Planificación auditorías con el COPASST', 1.25, '>50');

-- ACTUAR (10 pts)
INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title, weight, profile) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='IV'), '4.1.1', 'Definición de acciones preventivas y correctivas con base en resultados del SG-SST', 2.5, '>50'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='IV'), '4.1.2', 'Acciones de mejora conforme a revisión de la alta dirección', 2.5, '>50'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='IV'), '4.1.3', 'Acciones de mejora con base en investigaciones de accidentes de trabajo y enfermedades laborales', 2.5, '>50'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='IV'), '4.1.4', 'Elaboración Plan de Mejora e implementación de medidas y acciones correctivas solicitadas por autoridades', 2.5, '>50');

-- =====================================================
-- ISO 27001:2022 — CONTROLES Y CLÁUSULAS
-- =====================================================

INSERT OR IGNORE INTO iso_chapters (standard_id, chapter_number, chapter_title, description) VALUES
((SELECT id FROM audit_standards WHERE code='ISO27001'), '4', 'CONTEXTO DE LA ORGANIZACIÓN', 'Comprensión del contexto, partes interesadas y alcance del SGSI'),
((SELECT id FROM audit_standards WHERE code='ISO27001'), '5', 'LIDERAZGO', 'Liderazgo, política de seguridad y roles organizacionales'),
((SELECT id FROM audit_standards WHERE code='ISO27001'), '6', 'PLANIFICACIÓN', 'Tratamiento de riesgos de seguridad de la información y objetivos'),
((SELECT id FROM audit_standards WHERE code='ISO27001'), '7', 'APOYO', 'Recursos, competencia, concienciación, comunicación e información documentada'),
((SELECT id FROM audit_standards WHERE code='ISO27001'), '8', 'OPERACIÓN', 'Planificación y control operacional, evaluación y tratamiento de riesgos'),
((SELECT id FROM audit_standards WHERE code='ISO27001'), '9', 'EVALUACIÓN DEL DESEMPEÑO', 'Seguimiento, medición, auditoría interna y revisión por la dirección'),
((SELECT id FROM audit_standards WHERE code='ISO27001'), '10', 'MEJORA', 'No conformidades, acciones correctivas y mejora continua'),
((SELECT id FROM audit_standards WHERE code='ISO27001'), 'A5', 'CONTROLES ORGANIZACIONALES', 'Controles organizacionales del Anexo A (A.5.1 — A.5.37)'),
((SELECT id FROM audit_standards WHERE code='ISO27001'), 'A6', 'CONTROLES DE PERSONAS', 'Controles de personas del Anexo A (A.6.1 — A.6.8)'),
((SELECT id FROM audit_standards WHERE code='ISO27001'), 'A7', 'CONTROLES FÍSICOS', 'Controles físicos del Anexo A (A.7.1 — A.7.14)'),
((SELECT id FROM audit_standards WHERE code='ISO27001'), 'A8', 'CONTROLES TECNOLÓGICOS', 'Controles tecnológicos del Anexo A (A.8.1 — A.8.34)');

INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='4'), '4.1', 'Comprensión de la organización y de su contexto'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='4'), '4.2', 'Comprensión de las necesidades y expectativas de las partes interesadas'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='4'), '4.3', 'Determinación del alcance del SGSI'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='4'), '4.4', 'Sistema de gestión de la seguridad de la información');

INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='5'), '5.1', 'Liderazgo y compromiso'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='5'), '5.2', 'Política de seguridad de la información'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='5'), '5.3', 'Roles, responsabilidades y autoridades en la organización');

INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='6'), '6.1.1', 'Acciones para tratar riesgos y oportunidades — Generalidades'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='6'), '6.1.2', 'Evaluación de los riesgos de seguridad de la información'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='6'), '6.1.3', 'Tratamiento de los riesgos de seguridad de la información'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='6'), '6.2', 'Objetivos de seguridad de la información y planes para lograrlos'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='6'), '6.3', 'Planificación de los cambios');

INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='7'), '7.1', 'Recursos'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='7'), '7.2', 'Competencia'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='7'), '7.3', 'Concienciación'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='7'), '7.4', 'Comunicación'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='7'), '7.5', 'Información documentada');

INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='8'), '8.1', 'Planificación y control operacional'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='8'), '8.2', 'Evaluación de los riesgos de seguridad de la información'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='8'), '8.3', 'Tratamiento de los riesgos de seguridad de la información');

INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='9'), '9.1', 'Seguimiento, medición, análisis y evaluación'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='9'), '9.2', 'Auditoría interna'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='9'), '9.3', 'Revisión por la dirección');

INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='10'), '10.1', 'Mejora continua'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='10'), '10.2', 'No conformidad y acción correctiva');

-- Controles Organizacionales A.5 (selección representativa)
INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A5'), 'A.5.1', 'Políticas para la seguridad de la información'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A5'), 'A.5.2', 'Roles y responsabilidades en seguridad de la información'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A5'), 'A.5.3', 'Segregación de funciones'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A5'), 'A.5.5', 'Contacto con autoridades'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A5'), 'A.5.7', 'Inteligencia sobre amenazas'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A5'), 'A.5.8', 'Seguridad de la información en la gestión de proyectos'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A5'), 'A.5.9', 'Inventario de activos de información'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A5'), 'A.5.10', 'Uso aceptable de los activos de información'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A5'), 'A.5.12', 'Clasificación de la información'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A5'), 'A.5.14', 'Transferencia de información'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A5'), 'A.5.15', 'Control de acceso'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A5'), 'A.5.17', 'Información de autenticación'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A5'), 'A.5.19', 'Seguridad de la información en las relaciones con proveedores'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A5'), 'A.5.23', 'Seguridad de la información para el uso de servicios en la nube'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A5'), 'A.5.24', 'Planificación y preparación de la gestión de incidentes de SI'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A5'), 'A.5.25', 'Evaluación y decisión sobre eventos de seguridad de la información'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A5'), 'A.5.26', 'Respuesta a incidentes de seguridad de la información'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A5'), 'A.5.29', 'Seguridad de la información durante la interrupción'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A5'), 'A.5.30', 'Preparación de las TIC para la continuidad del negocio'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A5'), 'A.5.36', 'Cumplimiento de políticas, normas y estándares de SI'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A5'), 'A.5.37', 'Procedimientos de operación documentados');

-- Controles de Personas A.6
INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A6'), 'A.6.1', 'Investigación de antecedentes'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A6'), 'A.6.2', 'Términos y condiciones de contratación'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A6'), 'A.6.3', 'Concienciación, educación y formación en SI'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A6'), 'A.6.4', 'Proceso disciplinario'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A6'), 'A.6.5', 'Responsabilidades después de la terminación o cambio de empleo'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A6'), 'A.6.6', 'Acuerdos de confidencialidad o no divulgación'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A6'), 'A.6.7', 'Trabajo remoto'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A6'), 'A.6.8', 'Reporte de eventos de seguridad de la información');

-- Controles Físicos A.7
INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A7'), 'A.7.1', 'Perímetros de seguridad física'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A7'), 'A.7.2', 'Entrada física'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A7'), 'A.7.3', 'Seguridad de oficinas, despachos e instalaciones'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A7'), 'A.7.4', 'Monitoreo de la seguridad física'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A7'), 'A.7.5', 'Protección contra amenazas físicas y ambientales'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A7'), 'A.7.6', 'Trabajo en áreas seguras'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A7'), 'A.7.7', 'Escritorio despejado y pantalla limpia'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A7'), 'A.7.8', 'Ubicación y protección de equipos'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A7'), 'A.7.9', 'Seguridad de los activos fuera de las instalaciones'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A7'), 'A.7.10', 'Medios de almacenamiento'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A7'), 'A.7.11', 'Servicios de suministro'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A7'), 'A.7.12', 'Seguridad del cableado'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A7'), 'A.7.13', 'Mantenimiento de equipos'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A7'), 'A.7.14', 'Eliminación o reutilización segura de equipos');

-- Controles Tecnológicos A.8 (selección representativa)
INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A8'), 'A.8.1', 'Dispositivos de punto final del usuario'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A8'), 'A.8.2', 'Derechos de acceso privilegiado'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A8'), 'A.8.3', 'Restricción de acceso a la información'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A8'), 'A.8.4', 'Acceso al código fuente'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A8'), 'A.8.5', 'Autenticación segura'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A8'), 'A.8.6', 'Gestión de la capacidad'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A8'), 'A.8.7', 'Protección contra malware'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A8'), 'A.8.8', 'Gestión de vulnerabilidades técnicas'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A8'), 'A.8.9', 'Gestión de la configuración'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A8'), 'A.8.10', 'Eliminación de información'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A8'), 'A.8.12', 'Prevención de fuga de datos'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A8'), 'A.8.15', 'Registro de eventos'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A8'), 'A.8.16', 'Actividades de monitoreo'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A8'), 'A.8.20', 'Seguridad de redes'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A8'), 'A.8.23', 'Filtrado web'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A8'), 'A.8.24', 'Uso de criptografía'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A8'), 'A.8.25', 'Ciclo de vida de desarrollo seguro'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A8'), 'A.8.28', 'Codificación segura'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A8'), 'A.8.32', 'Gestión de cambios'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A8'), 'A.8.33', 'Información de prueba'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO27001') AND chapter_number='A8'), 'A.8.34', 'Protección de los sistemas de información durante las pruebas de auditoría');

-- =====================================================
-- ISO 39001:2012 — SEGURIDAD VIAL
-- =====================================================

INSERT OR IGNORE INTO iso_chapters (standard_id, chapter_number, chapter_title, description) VALUES
((SELECT id FROM audit_standards WHERE code='ISO39001'), '4', 'CONTEXTO DE LA ORGANIZACIÓN', 'Contexto organizacional, partes interesadas y alcance del sistema de seguridad vial'),
((SELECT id FROM audit_standards WHERE code='ISO39001'), '5', 'LIDERAZGO', 'Liderazgo, política de seguridad vial y roles organizacionales'),
((SELECT id FROM audit_standards WHERE code='ISO39001'), '6', 'PLANIFICACIÓN', 'Factores de riesgo vial, objetivos de seguridad vial y planificación'),
((SELECT id FROM audit_standards WHERE code='ISO39001'), '7', 'APOYO', 'Recursos, competencia, conciencia, comunicación e información documentada'),
((SELECT id FROM audit_standards WHERE code='ISO39001'), '8', 'OPERACIÓN', 'Vehículos, conductores, velocidad, infraestructura vial y viajes'),
((SELECT id FROM audit_standards WHERE code='ISO39001'), '9', 'EVALUACIÓN DEL DESEMPEÑO', 'Seguimiento, medición, auditoría interna y revisión por la dirección'),
((SELECT id FROM audit_standards WHERE code='ISO39001'), '10', 'MEJORA', 'Incidentes viales, no conformidades, acciones correctivas y mejora continua');

INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO39001') AND chapter_number='4'), '4.1', 'Comprensión de la organización y de su contexto'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO39001') AND chapter_number='4'), '4.2', 'Comprensión de las necesidades y expectativas de las partes interesadas'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO39001') AND chapter_number='4'), '4.3', 'Determinación del alcance del SGSV'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO39001') AND chapter_number='4'), '4.4', 'Sistema de gestión de la seguridad vial'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO39001') AND chapter_number='4'), '4.5', 'Factores de resultado del sistema vial');

INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO39001') AND chapter_number='5'), '5.1', 'Liderazgo y compromiso'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO39001') AND chapter_number='5'), '5.2', 'Política de seguridad vial'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO39001') AND chapter_number='5'), '5.3', 'Roles, responsabilidades y autoridades en la organización');

INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO39001') AND chapter_number='6'), '6.1', 'Acciones para abordar riesgos y oportunidades viales'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO39001') AND chapter_number='6'), '6.2', 'Factores de riesgo vial — Identificación y evaluación'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO39001') AND chapter_number='6'), '6.3', 'Objetivos de seguridad vial y planificación para lograrlos');

INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO39001') AND chapter_number='7'), '7.1', 'Recursos'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO39001') AND chapter_number='7'), '7.2', 'Competencia'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO39001') AND chapter_number='7'), '7.3', 'Toma de conciencia'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO39001') AND chapter_number='7'), '7.4', 'Comunicación'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO39001') AND chapter_number='7'), '7.5', 'Información documentada');

INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO39001') AND chapter_number='8'), '8.1', 'Planificación y control operacional'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO39001') AND chapter_number='8'), '8.2', 'Gestión de vehículos — Mantenimiento y aptitud'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO39001') AND chapter_number='8'), '8.3', 'Gestión de conductores — Competencia y aptitud'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO39001') AND chapter_number='8'), '8.4', 'Control de velocidad y distancia'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO39001') AND chapter_number='8'), '8.5', 'Gestión de viajes y rutas'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO39001') AND chapter_number='8'), '8.6', 'Preparación y respuesta ante emergencias viales');

INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO39001') AND chapter_number='9'), '9.1', 'Seguimiento, medición, análisis y evaluación'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO39001') AND chapter_number='9'), '9.2', 'Auditoría interna'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO39001') AND chapter_number='9'), '9.3', 'Revisión por la dirección');

INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO39001') AND chapter_number='10'), '10.1', 'Generalidades'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO39001') AND chapter_number='10'), '10.2', 'Incidentes viales, no conformidades y acciones correctivas'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO39001') AND chapter_number='10'), '10.3', 'Mejora continua');

-- =====================================================
-- DATOS COMUNES
-- =====================================================

INSERT OR IGNORE INTO audit_types (type_name, description) VALUES
('INTERNA', 'Auditoría interna del sistema de gestión'),
('EXTERNA', 'Auditoría externa o de certificación'),
('SEGUIMIENTO', 'Auditoría de seguimiento a acciones correctivas'),
('PRODUCTO', 'Auditoría de producto'),
('PROCESO', 'Auditoría de proceso específico');

INSERT OR IGNORE INTO finding_types (type_code, type_name, severity_level, color, requires_action) VALUES
('C', 'CONFORMIDAD', 0, '#10b981', 0),
('O', 'OBSERVACIÓN', 1, '#f59e0b', 0),
('NC_MENOR', 'NO CONFORMIDAD MENOR', 2, '#f97316', 1),
('NC_MAYOR', 'NO CONFORMIDAD MAYOR', 3, '#ef4444', 1);
