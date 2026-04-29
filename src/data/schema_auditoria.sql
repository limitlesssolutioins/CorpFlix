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
    is_op INTEGER DEFAULT 0,
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
-- ISO 9001:2015 — SUB-REQUISITOS (3er nivel)
-- Los requisitos padre que tienen sub-items se marcan is_auditable=0
-- =====================================================

-- Marcar padres con sub-requisitos como no auditables individualmente
UPDATE iso_requirements SET is_auditable=0
WHERE chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001'))
AND requirement_code IN ('4.4','5.1','5.2','6.1','6.2','7.1','7.5','8.2','8.3','8.4','8.5','8.7','9.1','9.2','9.3','10.2');

-- Capítulo 4 — sub-requisitos
INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title, is_auditable) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='4'), '4.4.1', 'SGC — Establecer, implementar, mantener y mejorar procesos', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='4'), '4.4.2', 'SGC — Información documentada de procesos', 1);

-- Capítulo 5 — sub-requisitos
INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title, is_auditable) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='5'), '5.1.1', 'Liderazgo y compromiso para el SGC', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='5'), '5.1.2', 'Enfoque al cliente', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='5'), '5.2.1', 'Desarrollar la política de la calidad', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='5'), '5.2.2', 'Comunicar la política de la calidad', 1);

-- Capítulo 6 — sub-requisitos
INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title, is_auditable) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='6'), '6.1.1', 'Riesgos y oportunidades — Generalidades', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='6'), '6.1.2', 'Planificación de acciones ante riesgos y oportunidades', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='6'), '6.2.1', 'Objetivos de la calidad', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='6'), '6.2.2', 'Planificación para lograr los objetivos de la calidad', 1);

-- Capítulo 7 — sub-requisitos
INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title, is_auditable) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='7'), '7.1.1', 'Recursos — Generalidades', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='7'), '7.1.2', 'Personas', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='7'), '7.1.3', 'Infraestructura', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='7'), '7.1.4', 'Ambiente para la operación de los procesos', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='7'), '7.1.5', 'Recursos de seguimiento y medición', 0),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='7'), '7.1.5.1', 'Recursos de seguimiento y medición — Generalidades', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='7'), '7.1.5.2', 'Trazabilidad de las mediciones', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='7'), '7.1.6', 'Conocimientos de la organización', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='7'), '7.5.1', 'Información documentada — Generalidades', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='7'), '7.5.2', 'Creación y actualización de información documentada', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='7'), '7.5.3', 'Control de la información documentada', 0),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='7'), '7.5.3.1', 'Control de información documentada — Controles requeridos', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='7'), '7.5.3.2', 'Control de información documentada — Actividades de control', 1);

-- Capítulo 8 — sub-requisitos
INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title, is_auditable) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='8'), '8.2.1', 'Comunicación con el cliente', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='8'), '8.2.2', 'Determinación de los requisitos para los productos y servicios', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='8'), '8.2.3', 'Revisión de los requisitos para los productos y servicios', 0),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='8'), '8.2.3.1', 'Revisión de requisitos — Capacidad de cumplimiento', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='8'), '8.2.3.2', 'Revisión de requisitos — Información documentada', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='8'), '8.2.4', 'Cambios en los requisitos para los productos y servicios', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='8'), '8.3.1', 'Diseño y desarrollo — Generalidades', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='8'), '8.3.2', 'Planificación del diseño y desarrollo', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='8'), '8.3.3', 'Elementos de entrada del diseño y desarrollo', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='8'), '8.3.4', 'Controles del diseño y desarrollo', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='8'), '8.3.5', 'Elementos de salida del diseño y desarrollo', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='8'), '8.3.6', 'Cambios del diseño y desarrollo', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='8'), '8.4.1', 'Control de proveedores externos — Generalidades', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='8'), '8.4.2', 'Tipo y alcance del control de la provisión externa', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='8'), '8.4.3', 'Información para los proveedores externos', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='8'), '8.5.1', 'Control de la producción y de la prestación del servicio', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='8'), '8.5.2', 'Identificación y trazabilidad', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='8'), '8.5.3', 'Propiedad perteneciente a los clientes o proveedores externos', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='8'), '8.5.4', 'Preservación', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='8'), '8.5.5', 'Actividades posteriores a la entrega', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='8'), '8.5.6', 'Control de los cambios en la producción', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='8'), '8.7.1', 'Salidas no conformes — Identificación y control', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='8'), '8.7.2', 'Salidas no conformes — Información documentada', 1);

-- Capítulo 9 — sub-requisitos
INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title, is_auditable) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='9'), '9.1.1', 'Seguimiento, medición, análisis y evaluación — Generalidades', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='9'), '9.1.2', 'Satisfacción del cliente', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='9'), '9.1.3', 'Análisis y evaluación', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='9'), '9.2.1', 'Auditoría interna — Programa', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='9'), '9.2.2', 'Auditoría interna — Realización', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='9'), '9.3.1', 'Revisión por la dirección — Generalidades', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='9'), '9.3.2', 'Entradas de la revisión por la dirección', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='9'), '9.3.3', 'Salidas de la revisión por la dirección', 1);

-- Capítulo 10 — sub-requisitos
INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title, is_auditable) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='10'), '10.2.1', 'No conformidad y acción correctiva — Respuesta y tratamiento', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='ISO9001') AND chapter_number='10'), '10.2.2', 'No conformidad y acción correctiva — Información documentada', 1);

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
((SELECT id FROM audit_standards WHERE code='RES0312'), 'IV', 'ACTUAR — Mejoramiento', 'Acciones preventivas y correctivas con base en los resultados. Puntaje máximo: 10 puntos'),
((SELECT id FROM audit_standards WHERE code='RES0312'), 'V', 'AMENAZAS', 'Prevención, preparación y respuesta ante emergencias'),
((SELECT id FROM audit_standards WHERE code='RES0312'), 'VI', 'VERIFICACIÓN DEL SG-SST', 'Gestión de la mejora continua'),
((SELECT id FROM audit_standards WHERE code='RES0312'), 'VII', 'MEJORAMIENTO', 'Acciones preventivas y correctivas');

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
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='IV'), '4.1.4', 'Elaboración Plan de Mejora e implementación de medidas y acciones correctivas solicitadas por autoridades', 2.5, '>50'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='IV'), '4.2.1', 'Implementación de medidas de prevención y control de peligros/riesgos identificados', 2.5, '>50'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='IV'), '4.2.2', 'Verificación de aplicación de medidas de prevención y control por los trabajadores', 2.5, '>50'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='IV'), '4.2.3', 'Mantenimiento periódico de instalaciones, equipos, máquinas, herramientas', 2.5, '>50'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='IV'), '4.2.4', 'Entrega de Elementos de Protección Personal EPP y capacitación en uso', 2.5, '>50'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='IV'), '4.2.5', 'Realización de mediciones ambientales, cuando se requiera', 2.5, '>50'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='IV'), '4.2.6', 'Custodia de Historias Clínicas', 2.5, '>50');

-- V. AMENAZAS
INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title, weight, profile) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='V'), '5.1.1', 'Plan de Prevención, Preparación y Respuesta ante emergencias', 5.0, '>50'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='V'), '5.1.2', 'Brigada de prevención conformada, capacitada y dotada', 5.0, '>50');

-- VI. VERIFICACIÓN DEL SG-SST
INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title, weight, profile) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='VI'), '6.1.1', 'Indicadores de estructura, proceso y resultado del SG-SST', 1.25, '>50'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='VI'), '6.1.2', 'Auditoría anual con participación del COPASST', 1.25, '>50'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='VI'), '6.1.3', 'Revisión anual por la alta dirección, resultados y alcance de la auditoría', 1.25, '>50'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='VI'), '6.1.4', 'Planificación auditorías con el COPASST', 1.25, '>50');

-- VII. MEJORAMIENTO
INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title, weight, profile) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='VII'), '7.1.1', 'Definición de acciones preventivas y correctivas con base en resultados', 2.5, '>50'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='VII'), '7.1.2', 'Acciones de mejora conforme a revisión de la alta dirección', 2.5, '>50'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='VII'), '7.1.3', 'Acciones de mejora con base en investigaciones de accidentes de trabajo', 2.5, '>50'),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='RES0312') AND chapter_number='VII'), '7.1.4', 'Elaboración Plan de Mejora e implementación de medidas y acciones correctivas', 2.5, '>50');

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

-- =====================================================
-- EQUIPO AUDITOR Y PROGRAMA/PLAN
-- =====================================================

-- Directorio global de auditores
CREATE TABLE IF NOT EXISTS audit_auditors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT,
    role TEXT DEFAULT 'Auditor',
    area TEXT,
    phone TEXT,
    status TEXT DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Equipo asignado a cada auditoría (many-to-many)
CREATE TABLE IF NOT EXISTS audit_team (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    audit_id INTEGER NOT NULL,
    auditor_id INTEGER NOT NULL,
    role_in_audit TEXT DEFAULT 'Auditor',
    UNIQUE(audit_id, auditor_id),
    FOREIGN KEY (audit_id) REFERENCES audits(id) ON DELETE CASCADE,
    FOREIGN KEY (auditor_id) REFERENCES audit_auditors(id) ON DELETE CASCADE
);

-- Programa anual de auditorías (por estándar)
CREATE TABLE IF NOT EXISTS audit_programs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    standard_id INTEGER,
    year INTEGER NOT NULL,
    objectives TEXT,
    scope TEXT,
    criteria TEXT,
    resources TEXT,
    methodology TEXT,
    status TEXT DEFAULT 'DRAFT',
    approved_by TEXT,
    approved_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (standard_id) REFERENCES audit_standards(id)
);

-- Plan de auditoría (específico por auditoría)
CREATE TABLE IF NOT EXISTS audit_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    audit_id INTEGER NOT NULL UNIQUE,
    opening_meeting_datetime TEXT,
    closing_meeting_datetime TEXT,
    location TEXT,
    criteria TEXT,
    documents_to_review TEXT,
    confidentiality TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (audit_id) REFERENCES audits(id) ON DELETE CASCADE
);

-- Agenda de actividades del plan
CREATE TABLE IF NOT EXISTS audit_plan_activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    plan_id INTEGER NOT NULL,
    activity_date DATE,
    start_time TEXT,
    end_time TEXT,
    activity TEXT NOT NULL,
    process_area TEXT,
    auditor_ids TEXT,
    documents TEXT,
    sort_order INTEGER DEFAULT 0,
    FOREIGN KEY (plan_id) REFERENCES audit_plans(id) ON DELETE CASCADE
);



-- =====================================================
-- MINTRABAJO: Inspección General
-- =====================================================
INSERT OR IGNORE INTO audit_standards (code, name, full_name, category, color, description) VALUES
('MINTRABAJO', 'Inspección General MinTrabajo', 'Inspección General del Ministerio del Trabajo', 'Laboral', '#eab308', 'Lista de chequeo mínima exigida por el Ministerio del Trabajo para visitas de inspección general.');

INSERT OR IGNORE INTO iso_chapters (standard_id, chapter_number, chapter_title) VALUES
((SELECT id FROM audit_standards WHERE code='MINTRABAJO'), '1', 'IDENTIFICACION PERSONA VISITADA (NATURAL O JURIDICA -EMPRESA (ESTABLECIMIENTO, ORGANIZACIÓN, INSTITUCIÓN)'),
((SELECT id FROM audit_standards WHERE code='MINTRABAJO'), '2', 'DATOS DE QUIENES PARTICIPAN DE LA DILIGENCIA'),
((SELECT id FROM audit_standards WHERE code='MINTRABAJO'), '3', 'COMPOSICION DE PLANTA'),
((SELECT id FROM audit_standards WHERE code='MINTRABAJO'), '4', 'CARACTERIZACION SOBRE LA FORMA DE VINCULACION PARA TRABAJAR'),
((SELECT id FROM audit_standards WHERE code='MINTRABAJO'), '5', 'REMUNERACIONES DEL TRABAJADOR'),
((SELECT id FROM audit_standards WHERE code='MINTRABAJO'), '6', 'CONDICIONES LABORALES DE LOS TRABAJADORES A LA LUZ DE LAS NORMAS INDIVIDUALES'),
((SELECT id FROM audit_standards WHERE code='MINTRABAJO'), '7', 'INSPECCIÓN CON ENFOQUE DIFERENCIAL DE GENERO'),
((SELECT id FROM audit_standards WHERE code='MINTRABAJO'), '8', 'INSPECCIÓN EN NORMAS DE DERECHO COLECTIVO'),
((SELECT id FROM audit_standards WHERE code='MINTRABAJO'), '9', 'RIESGOS LABORALES');

INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title, requirement_description, is_auditable) VALUES
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='MINTRABAJO') AND chapter_number='1'), '1.1', 'DATOS BASICOS', 'Nombre o razón social de la persona (natural o jurídica visitada)\nTipo de Persona (natural/jurídica) JURIDICA\nEstado de la empresa visitada (si es persona jurídica)\nForma de Identificación de la Persona Visitada Número de Identificación Tributaria (NIT)\nNúmero documento de identificación\nDenominación de la persona (natural/jurídica) visitada Sociedad por Acciones Simplificada\nTamaño de la empresa\nZona geográfica\nDepartamento\nMunicipio\nEs un municipio PDET?\nNombre municipio PDET', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='MINTRABAJO') AND chapter_number='1'), '1.2', 'DATOS DE NOTIFICACION O CORRESPONDENCIA', 'Dirección de la visitada\nTeléfono o celular de contacto\nCorreo electrónico\nNombre/s y apellido/s representante\nNúmero documento de identificación', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='MINTRABAJO') AND chapter_number='1'), '1.3', 'DATOS ESPECIFICOS', 'Código CIIU (Actividad económica principal)\nCódigo CIIU (Actividad económica división) Lista desplegable\nCódigo CIIU (Actividad económica grupo) Lista desplegable\nCódigo CIIU (Actividad económica clase) Lista desplegable\nTiene sucursales a nivel nacional\nSectores críticos TLC Lista desplegable', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='MINTRABAJO') AND chapter_number='3'), '3.1', 'NUMERO TOTAL DE TRABAJADORES / AS', '', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='MINTRABAJO') AND chapter_number='3'), '3.2', 'TRABAJADORES/AS DESAGREGADOS POR GENERO', 'Número de mujeres trabajan en la empresa\nNúmero de hombres trabajan en la empresa\nNúmero de personas que se identifican con otro genero (no obligatorio -habeas data) 0', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='MINTRABAJO') AND chapter_number='3'), '3.3', 'TRABAJADORES/AS DESAGREGADOS POR NACIONALIDAD', 'Número de personas de nacionalidad colombiana que trabajan allí\nNúmero de personas de otras nacionalidades que trabajan allí 0\nDesagregue el número de personas de otras nacionalidades que trabajan allí 0', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='MINTRABAJO') AND chapter_number='3'), '3.4', 'TRABAJADORES/AS DESAGREGADOS POR RANGO DE EDAD', 'Número de Menores de 15 años\nNúmero de trabajadores/as de 15 a 17 años\nNúmero de trabajadores/as de 18 a 29 años\nNúmero de trabajadores/as de 30 a 56 años\nNúmero de trabajadores/as de mas de 57 años', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='MINTRABAJO') AND chapter_number='3'), '3.5', 'TRABAJADORES/AS DESAGREGADOS POR PERTENENCIA ETNICA', 'Indígena\nRaizal\nPalanquero\nComunidades Negras\nMulato\nAfrocolombiano', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='MINTRABAJO') AND chapter_number='3'), '3.6', 'CARACTERIZACION GENERAL DE TRABAJADORES/AS SUJETOS CON CONDICIONES RELEVANTES', 'Número de Adulto/s Mayor/es en situación prepensional (personas mayores a :54 años mujeres / 59 años hombres)\nNúmeros de personas en situación de Desplazado/a por violencia\nNúmero de personas en situación de discapacidad o condición de salud sustancial con incidencia laboral\nNúmero de madres cabeza de familia\nNúmero de mujer/es víctima/s de violencia de género\nNúmero de niñas, niños y adolescentes vinculados a los centros de trabajo', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='MINTRABAJO') AND chapter_number='3'), '3.7', 'CARACTERIZACIONES ESPECIFICAS DE ALGUNAS CONDICIONES RELEVANTES', '', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='MINTRABAJO') AND chapter_number='3'), '3.7.1', 'SITUACION MENORES DE 18 AÑOS VINCULADOS A LOS CENTROS DE TRABAJO', 'Numero de trabajadores/as menores de 18 años que trabajan en el centro de trabajo\nPor excepción: Laboran niños menores de 14 años en los centros de trabajó\nLos niños, niñas o adolescentes ejecutan trabajos autorizados por el Ministerio de Trabajo?\nNumero de horas laboradas por los menores de 18 años', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='MINTRABAJO') AND chapter_number='3'), '3.7.2', 'EN SITUACION DE MATERNIDAD O PATERNIDAD', 'Número de personas Gestantes\nNúmero de personas en licencia de maternidad\nNúmero de personas en licencia de paternidad\nNúmero de personas en estado de lactancia (Artículo 238 del CST -Ley 2306 de 2023)', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='MINTRABAJO') AND chapter_number='3'), '3.7.3', 'EN SITUACION DE DISCAPACIDAD O CONDICION DE SALUD SUSTANCIAL CON INCIDENCIA LABORAL', 'Número de personas en condición de discapacidad o con porcentaje de pérdida de capacidad laboral\nNúmero de personas con condiciones de salud que tienen comorbilidades relevantes\nNúmero de personas con restricciones laborales por recomendaciones medicas del tratante\nNúmero de personas con reubicación, reincorporados/as, en reconversión, o en readiestramiento del puesto de trabajo', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='MINTRABAJO') AND chapter_number='3'), '3.7.4', 'EN SITUACION PENSIONAL', 'Número de personas en condición de prepensión (menos de tres años para pensionarse (RPM) o con 7 2 0\nNúmero de personas que están pensionados/as 0 2 0', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='MINTRABAJO') AND chapter_number='4'), '4.1', 'TIPO DE VINCULACIÓN', 'Número de trabajadores/as con contratos laborales\nNúmero de contratistas vinculados por orden (OPS) o contrato de prestación de servicios\nNúmero de trabajadores en misión vinculados por una Empresa de Servicios Temporales\nNúmero de personas en condición de que trabajan en los centros de trabajo y que se encuentran vinculadas por empresas tercerizadas\nNúmero de aprendices SENA?\nNúmero de personal en pasantías o practicante', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='MINTRABAJO') AND chapter_number='4'), '4.2', 'TÉRMINO DE DURACION DE LOS CONTRATOS LABORALES', 'Número de contratos a término indefinido?\nNúmero de contratos a término Fijo?\nNúmero de contratos a término fijo inferior a un Año?\nNúmero de contratos a término fijo superior a un Año?\nNúmero de contratos a por obra o labor? 0\nNúmero de contratos a contratos temporal, ocasional o accidental ?\nNúmero de contratos de aprendizaje?\nNúmero de contratos verbales ?\nNúmero de contratos escritos?', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='MINTRABAJO') AND chapter_number='4'), '4.3', 'CLASIFICACION O NIVEL JERARQUICO DE LOS CARGOS LABORALES', 'Número de cargos gerenciales?\nNúmero de cargos Directivos?\nNúmero de cargos Administrativos?\nNúmero de cargos Operativos\nNúmero por otros cargos\nPARTE TERCERA: CUMPLIMIENTO DE NORMAS LABORALES DE NATURALEZA INDIVIDUAL Y DEL SISTEMA DE SEGURIDAD SOCIAL INTEGRAL', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='MINTRABAJO') AND chapter_number='5'), '5.1', 'EN RELACIÓN CON EL SALARIO', 'Fecha del ultimo pago de nómina\nEn que forma realiza los pagos\nReconoce pago de salario en especie?\nSe paga salario integral?\nTiene trabajadores/as con salario integral\nRealizan en la empresa descuentos de nomina\nLa remuneración de las mujeres trabajadoras es igual al de los hombres trabajadores que ejercen la misma labor\n¿Tienen escala o bandas salariales?\n¿Qué factores se tienen en cuenta para fijar los salarios para los distintos rangos salariales?', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='MINTRABAJO') AND chapter_number='5'), '5.2', 'AUXILIO DE TRANSPORTE', 'En la nomina se reconoce el pago del auxilio de Transporte conforme a la Ley?\nEl Auxilio de Transporte se incluye para liquidar prestaciones sociales?\n¿Presta el establecimiento servicio de ruta?\nLos trabajadores/as que están en teletrabajo se les reconoce el auxilio de transporte?', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='MINTRABAJO') AND chapter_number='5'), '5.3', 'EN RELACIÓN CON LAS PRESTACIONES SOCIALES', '', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='MINTRABAJO') AND chapter_number='5'), '5.3.1', 'PRIMA DE SERVICIOS', 'Liquida correctamente la Prima de Servicios?\nPaga oportunamente la prima de servicios?\nFecha último pago', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='MINTRABAJO') AND chapter_number='5'), '5.3.2', 'CESANTÍAS E INTERESES A LAS CESANTIAS', 'Consignó las cesantías a los Fondos autorizados por el trabajador?\nFecha de Consignación a los fondos\nPagó oportunamente los intereses de cesantías al trabajador ?', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='MINTRABAJO') AND chapter_number='5'), '5.3.3', 'CALZADO Y VESTIDO DE LABOR', 'Fecha de la última entrega de calzado y vestido de labor?\nEl empleador hace entregas completas del calzado y vestido de labor?\nCual es la periodicidad en meses en que el empleador entrega el calzado y vestido de labor', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='MINTRABAJO') AND chapter_number='5'), '5.4', 'VACACIONES', 'Concede vacaciones en los términos de art. 187 del C.S.T.?\nIncluye el sábado la Jornada Laboral?\nLleva registro de vacaciones?\nCompensa vacaciones durante la vigencia de los contratos?\nCompensa o indemniza vacaciones a la terminación de los contratos?\nEn la empresa se acumulan vacaciones para algunos/as trabajadores/as. (Deben respetarse los mínimos dias que se debe otorgar (6))\nExiste recurrencia en la acumulación de más de dos periodos de vacaciones?\nNúmero de personas presentan vacaciones acumuladas', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='MINTRABAJO') AND chapter_number='5'), '5.5', 'OBLIGACIONES DEL EMPLEADOR RESPECTO DEL SISTEMA DE SEGURIDAD SOCIAL INTEGRAL', '', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='MINTRABAJO') AND chapter_number='5'), '5.5.1', 'EN RELACIÓN CON LOS APORTES AL SISTEMA DE SEGURIDAD SOCIAL INTEGRAL', 'El empleador efectúa aportes son destinos a los sistemas de salud, pensión y riesgos laborales?\nEl empleador efectúa aportes parafiscales (con destino al Sena, ICBF y Caja de Compensación Familiar?\nEl empleador realiza el pago oportuno de los aportes al sistema de seguridad social integral?\nCuál es el valor de la nómina sobre la cual aporta?\nLa nómina sobre la cual se aporta corresponde a la real?\nFecha de la última nómina sobre la cual se efectuaron los aportes al Sistema', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='MINTRABAJO') AND chapter_number='5'), '5.5.2', 'Afiliación y aporte Empresa Prestadora de Salud (EPS)- SISTEMA GENERAL DE SEGURIDAD SOCIAL EN SALUD', 'Afilia al trabajador/a desde su vinculación?\nEl aporte se cotiza sobre el salario real devengado?', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='MINTRABAJO') AND chapter_number='5'), '5.5.3', 'Afiliación y aporte fondo de pensiones (EPS)- SISTEMA GENERAL DE PENSIONES', 'Afilia al trabajador/a desde su vinculación? Si\nEl aporte se cotiza sobre el salario real devengado?', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='MINTRABAJO') AND chapter_number='5'), '5.5.4', 'Afiliación y aporte a Administradora de Riesgos Laborales- SISTEMA GENERAL DE RIESGOS LABORALES', 'Nombre A.R.L. que está afiliada la Empresa\nFecha de Afiliación a la ARL\nUltima fecha de consignación de Aportes para la ARL\nNúmero de meses consignados\nLa nómina sobre la cual se aporta corresponde al pago real por concepto de salarios', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='MINTRABAJO') AND chapter_number='5'), '5.5.5', 'Afiliación y aporte a CAJA DE COMPENSACION FAMILIAR', 'Tiene afiliados sus trabajadores/as a una Caja de Compensación familiar\nNombre de la Caja de Compensación', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='MINTRABAJO') AND chapter_number='6'), '6.1', 'EN RELACIÓN CON LAS FORMAS DE ORGANIZACIÓN DEL TRABAJO', 'Trabajadores que asisten a los centros de trabajo del empleador\nTrabajadores que se encuentran en la modalidad de teletrabajo autónomo\nTrabajadores que se encuentran en la modalidad de teletrabajo suplementario\nTrabajadores que se encuentran en la modalidad de trabajo remoto', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='MINTRABAJO') AND chapter_number='6'), '6.2', 'LA JORNADA LABORAL', 'Primer tipo de horario o único que se encuentra adoptado\nSegundo tipo de horario (que se encuentra adoptado)\nTercer tipo de horario (que se encuentra adoptado)\nImplementa horarios y jornadas de trabajo flexible para trabajadores/as con cargas de cuidado?', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='MINTRABAJO') AND chapter_number='6'), '6.2.1', 'TRABAJO SUPLEMENTARIO', 'Número de trabajadores/ras que laboran horas extras\nNúmero de horas extras semanales laboradas:\nTienen autorización para laborar Horas Extras por parte del Ministerio del Trabajo?\nNumero y fecha de la resolución\nse encuentra vigente?\n¿Lleva registro diario de trabajo suplementario?\n¿Entrega el empleador al trabajador una relación de las horas extras laboradas con las especificaciones legales\nSe reconoce pago por recargo nocturno conforme a la Ley ?\nImplementó reducción horaria según ley 2101 de 2021?\n¿Explique Implementó reducción horaria según ley 2101 de 2021?\n¿Aplica Ley de desconexión laboral? (Ley 2191 de 2022)', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='MINTRABAJO') AND chapter_number='6'), '6.2.2', 'DESCANSOS REMUNERADOS', 'Se trabaja en dominical y/o festivo?\nEl trabajo dominical es Ocasional o permanente?\nConcede descanso dominical y/o festivos remunerados?\nLos liquida y paga con los recargos legales?', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='MINTRABAJO') AND chapter_number='6'), '6.3', 'REGLAMENTOS', 'De acuerdo con la Ley, la Empresa está obligada a adoptar Reglamento Interno de Trabajo\nFecha de expedición\nEl reglamento incluye un procedimiento para sancionar que garantiza el debido proceso?\nContiene la adenda de la Ley 1010 de 2006\nEl reglamento de trabajo está publicado esta publicado en todas las sedes de trabajo?\nSe dio término para observaciones\nEl reglamento incluye lo establecido por la Ley 2365 de 2024 (acoso sexual)\nPARTE CUARTA: CUMPLIMIENTO DE NORMAS SOBRE ENFOQUE DE GENERO', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='MINTRABAJO') AND chapter_number='7'), '7.1', 'PROGRAMAS Y SELLOS', 'Tiene trabajadores/as mayores de 57 años mujeres y/o mayores de 62 años hombres?\n¿Cuenta con el Certificado de Sello Amigable Adulto Mayor? (artículo 7 de la Ley 2040 del 2020)\n¿Cuenta con el sello EQUIPARES?\n¿Cuenta con sello “segundas oportunidades”? (Ley 2208 de 2022)\n¿Laboran mujeres víctimas de violencias de género?\n¿Se encuentra inscrito/a para recibir la deducción tributaria respectivo? (Ley 1257 de 2008 y Decreto 2733 de 2012)\nCuenta con el sello de igualdad de género?\nexiste documento por escrito del compromiso de igualdad de genero?\nexiste comité de igualdad de genero?\ndesarrolla capacidades de genero de alta gerencia y del personal?\nDesarrolla un diagnostico organizar de genero?\nAdopta una política y un plan de acción para la igualdad de genero?\ntoma acciones para la mejora continua y mantener el sello de igualdad de genero?', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='MINTRABAJO') AND chapter_number='7'), '7.2', 'INGRESO Y SELECCIÓN DE EMPLEO CON ENFOQUE DIFERENCIAL DE GENERO', '¿Con base en la normatividad legal vigente, el sexo o el género constituyen un requisito para acceder a ciertos cargos de la empresa (establecimiento, organización, Institución)?\n¿Solicitan a las personas oferentes llenar algún formulario de solicitud de empleo o similar?\n¿Los requisitos para acceder a ciertos cargos se aplican de manera igualitaria a la totalidad de las personas aspirantes?\n¿Tienen un formato de preguntas para las entrevistas? Verificar formato\n¿La empresa (establecimiento, organización, Institución), indaga sobre la orientación sexual o identidad de género de la persona postulante? (Si la respuesta es afirmativa ¿con qué fin?)\n¿En la entrevista se realizan preguntas en relación con la composición familiar, planificación familiar, la maternidad, hijos/as/es y en general sobre los planes de vida reproductivos?\n¿La empresa ordena la práctica de prueba de embarazo o pruebas serológicas como requisito para ingresar a laborar?', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='MINTRABAJO') AND chapter_number='7'), '7.3', 'PREVENCIÓN Y ATENCIÓN DE VIOLENCIAS DE GENERO EN EL AMBITO TERRITORIAL', '¿Cuenta con mecanismos como protocolos para identificar, prevenir y atender conductas de acoso laboral en el lugar de trabajo?\n¿Cuáles son los mecanismos para identificar, prevenir y atender conductas de acoso sexual laboral en el lugar de trabajo?\n¿Ha desarrollado campañas para erradicar todo acto de discriminación y violencia contra las mujeres o personas LGBTI en el establecimiento? ¿Cuáles?\n¿Cuenta con una política institucional contra las violencias de género en el trabajo incluidas el acoso sexual? ¿Cuál?\n¿En cuanto a los procesos disciplinarios por casos de acoso laboral o sexual, cuenta con los protocolos para su atención, su respectiva divulgación y se garantiza la confidencialidad de los casos reportados e\n¿Se hacen exigencias de uso de vestimenta, uniformes u otras características de presentación personal diferenciada para las mujeres?\n¿Cuántos procesos disciplinarios tiene o ha tenido en los últimos 5 años relacionados con acoso laboral donde la víctima sea una mujer o persona LGBTIQ+?\n¿Cuántos procesos disciplinarios tiene o ha tenido en los últimos 5 años relacionados con acoso sexual o violencia de género donde la víctima sea una mujer o persona LGBTIQ+?', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='MINTRABAJO') AND chapter_number='7'), '7.4', 'PROMOCIÓN Y DESARROLLO', '¿La empresa promueve estrategias para que las mujeres accedan a cargos altamente masculinizados y viceversa? ¿Cuáles?\n¿Existen mujeres en puestos de supervisión o puestos de toma de decisiones? ¿Cuáles puestos?\nNúmero de mujeres en estos puestos\nNúmero de hombres en estos puestos', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='MINTRABAJO') AND chapter_number='7'), '7.5', 'CAPACITACIÓN', '¿El área de Recursos Humanos incorpora en sus procesos de capacitación la perspectiva de género? Explicar\n¿Existe participación paritaria en los espacios de capacitación?\n¿En qué horario/jornadas se realizan los procesos de capacitación?\nAdelanta programas de recreación y/o capacitación de acuerdo con el Art. 21 Ley 50 de 1990 ¿Cuáles?\nHorarios de realización\nAdelanta programas integrales de bienestar ¿Cuáles?\nHorarios de realización\nAdelanta programas de formación ¿Cuáles?\nHorarios de realización', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='MINTRABAJO') AND chapter_number='7'), '7.6', 'CONCILIACIÓN DE LA VIDA PERSONAL Y LABORAL CON CORRESPONSABILIDAD', '¿El empleador/a respeta el fuero de maternidad y el fuero de paternidad? (esto se puede verificar con las personas trabajadoras de la empresa)\n¿Se otorgan a las trabajadoras que lo requieran los descansos remunerados para amamantar a su hijo/a, durante los primeros 2 años de edad?\n¿Cuentan las instalaciones con espacios físicos acondicionados y dignos para las mujeres trabajadoras en estado de embarazo y período de lactancia? (Verificar la sala de lactancia y demás instalaciones)\n¿El establecimiento permite y aprueba que la madre tome la licencia de maternidad flexible de medio tiempo (licencia parental compartida)? seleccionado y/o que comparte las últimas 6 semanas de su licencia con el padre del menor)(Ley 2114 DE MATERNIDAD COMPLETA de 2021)\n¿La empresa (establecimiento, organización, Institución) permite y aprueba licencias de paternidad de acuerdo con la norma? (Aportar solicitudes presentadas el último año)\nCuanto Tiempo (Diferenciar sí se aplican términos de una convención colectiva o los términos legales)\nEl empleador/a permite horarios flexibles para las madres cabeza de familia o cuidadoras de personas en situación de discapacidad', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='MINTRABAJO') AND chapter_number='7'), '7.7', 'COMUNICACIÓN NO SEXISTA Y LENGUAJE INCLUYENTE', '¿Incorpora en los manuales, procedimientos, formatos, instructivos y guías, lenguaje incluyente y no sexista, así como en todo tipo de comunicaciones?\nLas convocatorias para la selección de personal contienen lenguaje claro con descripción del cargo, sin distinción del sexo, en el que se visibilice el género femenino, masculino, no binario, personas con\n¿En las comunicaciones de la empresa (establecimiento, organización, institución) se utiliza un lenguaje neutral en cuanto al género, evitando el uso de términos que impliquen una referencia específica a un género, como, por ejemplo: "personal", "la auditoría", "la ciudadanía", "la persona"?\nHay uso de imágenes publicitarias libres de connotaciones o estereotipos sexistas\nSe tiene practicas al interior de la organización, dirigidas a evitar comentarios o bromas sexistas\nPARTE QUINTA: CUMPLIMIENTO DE NORMAS LABORALES DE NATURALEZA COLECTIVA', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='MINTRABAJO') AND chapter_number='8'), '8.1', 'AFILIACIÓN', '¿Existen organizaciones sindicales ?\nNúmero de trabajadores/as afiliados a las organizaciones sindicales\nNumero de trabajadores/ras NO sindicalizados', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='MINTRABAJO') AND chapter_number='8'), '8.2', 'CONVENCIÓN COLECTIVA', '¿Existe Convención Colectiva? (revisar soportes) No\nFecha de depósito de la última convención\nNúmero de trabajadores/as beneficiarios de convención colectiva:', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='MINTRABAJO') AND chapter_number='8'), '8.3', 'PACTO COLECTIVO', '¿Existe Pacto Colectivo?\nFecha de depósito del pacto colectivo\nFecha de inicio de la negociación del pacto colectivo\nFecha de culminación de la negociación del pacto colectivo\n¿Los pactos colectivos o planes de beneficios son superiores a la convención colectiva? (Realizar verificación)\nNúmero de trabajadores/as beneficiarios de pacto colectivo:', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='MINTRABAJO') AND chapter_number='8'), '8.4', 'LAUDO ARBITRAL', '¿Existe Laudo Arbitral ?\nFecha de Vigencia:\nNúmero de trabajadores/as beneficiarios de Laudo arbitral', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='MINTRABAJO') AND chapter_number='8'), '8.5', 'CONTRATO SINDICAL', '¿Existe contrato sindical?\nObjeto del contrato sindical\nNúmero de trabajadores vinculados por contrato sindical\nPARTE SEXTA: CUMPLIMIENTO DE NORMAS SOBRE RIESGOS LABORALES', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='MINTRABAJO') AND chapter_number='9'), '9.1', 'SEGURIDAD Y SALUD EN EL TRABAJO', 'El empleador realizó y registró la autoevaluación de los estándares mínimos, así como el plan de mejora del SG-SST en la página web del Ministerio del Trabajo. Especifique la fecha de reporte 27/03/2025(Verifique los resultados del reporte emitido). Resolución 0312 Art. 28 Parágrafo 2)\n¿Se cuenta con recursos financieros, (presupuesto), asignados para el desarrollo de actividades y entrega de elementos en lo relacionado con el SG-SST (el diseño, implementación, revisión evaluación y mejora de las medidas de prevención y control, para la gestión eficaz de los peligros). Decreto 1072 de 2015 Art. 2.2,4,6,8 numeral 4\nCuenta con informe (s) anual (es), sobre el avance del plan de mejoramiento conforme a la autoevaluación de los estándares mínimos, teniendo en cuenta las recomendaciones de la Administradora de Riesgos Laborales. Especifique la fecha del informe. (Verifique, recomendaciones dela ARL y el cronograma de implementación). Resolución 0312 de 2019 Art.28\nSe encuentra conformado, vigente, capacitado y operativo el COPASST o vigía de SST. (Ver actas de conformación, compromisos y ejecución en actas de reunión del último año). Fecha de conformación\nFecha de última reunión\nSe encuentra conformado, vigente, capacitado y operativo el Comité de Convivencia Laboral. (Ver actas de conformación, de reuniones del último año e informes de gestión en el marco de sus funciones). Resolución 652 de 2012 Art. 2,5 al 8,10,11 y Resolución 1356 de 2012\nFecha de conformación\nElabora y ejecuta el programa de capacitación en promoción y prevención, que incluye los peligros/riesgos prioritarios y las medidas de prevención y control, extensivo a todos los niveles de la organización (Verificar que el programa de capacitación esté dirigido a los peligros identificados en la matriz de Identificación de peligros, evaluación y valoración de riesgos). Decreto 1072 de 2015 Art. 2,2,4,6,8 numeral 9 párrafo 3; Art. 2,2,4,6,11\nElabora y ejecuta un plan de prevención, preparación y respuesta ante emergencias que identifique las amenazas, evalúe y analice la vulnerabilidad. (Verificar el plan, divulgación, planos, señalización, asignación de recursos) Decreto 1072 de 2015 Art. 2,2,4,6,25\nSe encuentra conformada, vigente, capacitada y operativa la brigada de emergencias. (ver evidencias de conformación, capacitación e informes del último año). Decreto 1072 de 2015 Art. 2,2,4,6,25 numeral 2,6,9, 11 al 13 Ley 1562 de 2012 Art. 11 numeral 1 literal d)\nSe encuentra el registro, la estadística, las investigaciones y lecciones aprendidas de los incidentes, accidentes de trabajo y enfermedades laborales diagnosticadas en el último año? (Verificar equipo investigador, tiempo inicio investigación, acciones definidas para evitar accidentes y enfermedades)\nSe encuentra el registro de los exámenes medico ocupacionales y seguimiento a los estados de salud de las personas trabajadoras del último año. (Verificar aleatoriamente protocolos de evaluación, concepto\nSe cuenta con la Identificación de Peligros, Evaluación y Valoración del Riesgo y definición de controles. (Verifique la matriz de IPEVR por lo menos 2 actividades de control del riesgo). Decreto 1072 de 2015 SI\nEn las instalaciones del centro de trabajo se cuenta con el número de servicios sanitarios diferenciados (separados por sexos) según la población y vestidores debidamente habilitados, suficientes (1 por cada\nCuenta las instalaciones con puestos de trabajo apropiados para las personas trabajadoras (administrativo, operativo), incluidas las mujeres trabajadoras en estado de embarazo. (Se debe revisar el estudio de puesto de trabajo avalado por la ARL).Decreto 1072 de 2015 Art. 2,2,1,5,9 numeral 3\nCuentan las instalaciones con espacios físicos acondicionados con las medidas adecuadas de higiene y elementos de preservación de la leche materna para las mujeres trabajadoras en período de\n¿Se tienen en cuenta las recomendaciones y/o restricciones médicas de las personas trabajadoras durante sus actividades, incluyendo restricciones medicas o los casos de mujeres en estado de embarazo? Verificar casos. Resolución 2346 de 2007 Art.4\nEstá incluido el programa de prevención y protección contra caída en alturas de conformidad con la Resolución 4272 de 2021, así como las medidas necesarias para la identificación, evaluación y control.\nEn caso de ocurrencia de accidente mortal se adelantó investigación por parte del empleador y del Comité de Seguridad y Salud en el Trabajo o el Vigía Ocupacional, según sea el caso, dentro de los  quince (15) días calendario siguientes a la ocurrencia de la muerte. Resolución 1401 de 2007\nSe realizan evaluaciones médicas de las que trata el Art. 5 Resolución 2346 de 2007, de acuerdo con el tipo, magnitud y frecuencia de exposición a cada factor de riesgo, así como al estado de salud del SI', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='MINTRABAJO') AND chapter_number='9'), '9.2', 'ELEMENTOS DE PROTECCIÓN PERSONAL', 'Se entregan los EPP a las personas trabajadoras de acuerdo con los peligros identificados, evaluación y valoración de los riesgos, para protegerlos contra posibles daños a su salud o su integridad física derivados de la exposición en el lugar de trabajo. Decreto 1072 de 2015 Art. 2,2,4,6,24 numeral 5; Art.2,2,4,6,12 numeral 8\nSe realiza capacitación sobre el uso adecuado de los EPP (dispositivos, accesorios y vestimentas) Decreto 1072 de 2015 Art. 2,2,4,6,24 numeral 5 parágrafo 1\nSe realiza reposición de los EPP oportunamente, conforme al desgaste y condiciones de uso de los mismos\nLa empresa (establecimiento, organización, Institución), ha evaluado si los elementos de protección personal se ajustan a las características de sexo y capacidades diversas de las personas trabajadoras personal se ajustan a las características de sexo y capacidades diversas de las personas trabajadoras', 1),
((SELECT id FROM iso_chapters WHERE standard_id=(SELECT id FROM audit_standards WHERE code='MINTRABAJO') AND chapter_number='9'), '9.3', 'SALUD MENTAL Y RIESGO PSICOSOCIAL', '¿La empresa ha incluido dentro de la matriz de identificación de peligros, evaluación y valoración de riesgos, el riesgo psicosocial, además de los que se presentan al interior de la organización, también los\nURGENTE\nSe implementan las guías, protocolos de intervención, prevención y actuación de los riesgos psicosociales conforme los resultados de la aplicación de la Batería de Riesgo Psicosocial? Resolución SI\n¿Se ha realizado la evaluación con la Batería de Riesgo Psicosocial con la periodicidad establecida de acuerdo al nivel de riesgo de la empresa? Resolución 2764 de 2022 Art. 3\n¿El empleador tiene establecidas y desarrolla acciones para atender la prestación de los primeros auxilios psicológicos? Resolución 2764 de 2022 Art. 7 numeral 2\nSe encuentra el registro de la identificación del riesgo psicosocial y de las acciones realizadas para la promoción, prevención, intervención y control, así como medidas preventivas del acoso laboral del último año. Resolución 2646 de 2008 Art. 12, 14, 16 y 17', 1);


-- =====================================================
-- VARIABLES DE REQUISITOS (CRITERIOS DE EVALUACIÓN)
-- Generado automáticamente desde los documentos base
-- =====================================================


-- Criterios para ISO9001

-- Criterios para requisito 4.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Las cuestiones externas e internas que son pertinentes para su propósito y que afectan a su capacidad para lograr los resultados previstos de su sistema de gestión de Calidad', 1
FROM iso_requirements 
WHERE requirement_code = '4.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 4.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Las partes interesadas que son pertinentes al sistema de gestión de calidad;', 1
FROM iso_requirements 
WHERE requirement_code = '4.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Los requisitos de estas partes interesadas que son pertientes para el sistema de gestión de la calidad.', 2
FROM iso_requirements 
WHERE requirement_code = '4.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe realizar el seguimiento y la revisión de la información sobre estas partes interesadas y sus requisitos pertinentes.', 3
FROM iso_requirements 
WHERE requirement_code = '4.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 4.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando se determina este alcance, la organización debe considerar:', 1
FROM iso_requirements 
WHERE requirement_code = '4.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Determinar los limites y la aplicabilidad del SGC para establecer su alcance', 2
FROM iso_requirements 
WHERE requirement_code = '4.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Las cuestiones externas e internas referidas en 4.1;', 3
FROM iso_requirements 
WHERE requirement_code = '4.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Los requisitos de las partes interesadas pertientes referidos en el apartado 4.2;', 4
FROM iso_requirements 
WHERE requirement_code = '4.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Los productios y servicios de la organización;', 5
FROM iso_requirements 
WHERE requirement_code = '4.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'El alcance debe estar disponible y mantenerse  como información documentada estableciendo:', 6
FROM iso_requirements 
WHERE requirement_code = '4.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Los tipos de productos y servicios cubiertos por el sistema de gestión de la calidad;', 7
FROM iso_requirements 
WHERE requirement_code = '4.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La justificación para cualquier requisito de esta norma internacional que la organización determine que no es aplicable para el alcance de su SGC.', 8
FROM iso_requirements 
WHERE requirement_code = '4.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 4.4.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar los procesos necesarios para el sistema de gestión de la calidad y su aplicación a través de la organización, y debe:', 1
FROM iso_requirements 
WHERE requirement_code = '4.4.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) determinar las entradas requeridas y las salidas esperados de estos procesos;', 2
FROM iso_requirements 
WHERE requirement_code = '4.4.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) determinar la secuencia e interacción de estos procesos;', 3
FROM iso_requirements 
WHERE requirement_code = '4.4.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) determinar y aplicar los criterios y los métodos (incluyendo el seguimiento, la medición y los indicadores del desempeño relacionados) necesarios para asegurarse la operación eficaz y el control de estos procesos;', 4
FROM iso_requirements 
WHERE requirement_code = '4.4.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'd) determinar los recursos necesarios para estos procesos y asegurarse de su disponibilidad;', 5
FROM iso_requirements 
WHERE requirement_code = '4.4.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'e) asignar las responsabilidades y autoridades para estos procesos;', 6
FROM iso_requirements 
WHERE requirement_code = '4.4.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'f) abordar los riesgos y oportunidades determinados de acuerdo con los requisitos del apartado 6.1;', 7
FROM iso_requirements 
WHERE requirement_code = '4.4.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'g) valorar estos procesos e implementar cualquier cambio necesario para asegurarse de que estos procesos logran los resultados previstos;', 8
FROM iso_requirements 
WHERE requirement_code = '4.4.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'h) mejorar los procesos y el sistema de gestión de la calidad.', 9
FROM iso_requirements 
WHERE requirement_code = '4.4.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 4.4.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) mantener información documentada para apoyar la operación de sus procesos;', 1
FROM iso_requirements 
WHERE requirement_code = '4.4.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) conservar la información documentada para tener la confianza de que los procesos se realizan según lo planificado.', 2
FROM iso_requirements 
WHERE requirement_code = '4.4.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '5 LIDERAZGO', 3
FROM iso_requirements 
WHERE requirement_code = '4.4.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 5.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe demostrar liderazgo y compromiso con respecto al Sistema de gestión de la Calidad:', 1
FROM iso_requirements 
WHERE requirement_code = '5.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) asumiendo la rendición de cuentas de la eficacia del sistema de gestión de la calidad;', 2
FROM iso_requirements 
WHERE requirement_code = '5.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) asegurando que se establezcan para el sistema de gestión de la calidad la política de la calidad y los objetivos de la calidad y que éstos sean compatibles con el contexto y la dirección estratégica de la organización;;', 3
FROM iso_requirements 
WHERE requirement_code = '5.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) asegurando la integración de los requisitos del sistema de gestión de la calidad en los procesos de negocio de la organización;', 4
FROM iso_requirements 
WHERE requirement_code = '5.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'd) promoviendo el uso del enfoque basado en procesos y el pensamiento basado en riesgos;', 5
FROM iso_requirements 
WHERE requirement_code = '5.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'e) asegurando que los recursos necesarios para el sistema de gestión de la calidad estén disponibles;', 6
FROM iso_requirements 
WHERE requirement_code = '5.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'f) comunicando la importancia de una gestión de la calidad eficaz y conforme con los requisitos del sistema de gestión de la calidad;', 7
FROM iso_requirements 
WHERE requirement_code = '5.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'g) asegurando que el sistema de gestión de la calidad logre los resultados previstos;', 8
FROM iso_requirements 
WHERE requirement_code = '5.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'h) comprometiendo, dirigiendo y apoyando a las personas, para contribuir a la eficacia del sistema de gestión de la calidad;', 9
FROM iso_requirements 
WHERE requirement_code = '5.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'i) promoviendo la mejora;', 10
FROM iso_requirements 
WHERE requirement_code = '5.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'j) apoyando otros roles pertinentes de la dirección, para demostrar su liderazgo aplicado a sus áreas de responsabilidad.', 11
FROM iso_requirements 
WHERE requirement_code = '5.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '5.1.2.Enfoque al cliente', 12
FROM iso_requirements 
WHERE requirement_code = '5.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe demostrar liderazgo y compromiso con respecto al enfoque al cliente asegurándose de que:', 13
FROM iso_requirements 
WHERE requirement_code = '5.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) se determinan, se comprenden y se cumplen de manera coherente los requisitos del cliente y los legales y reglamentarios aplicables;', 14
FROM iso_requirements 
WHERE requirement_code = '5.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) se determinan y se tratan los riesgos y oportunidades que pueden afectar a la conformidad de los productos y los servicios y a la capacidad de aumentar la satisfacción del cliente;', 15
FROM iso_requirements 
WHERE requirement_code = '5.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) se mantiene el enfoque en aumentar la satisfacción del cliente.', 16
FROM iso_requirements 
WHERE requirement_code = '5.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 5.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '5.2.1.Desarrollar la politica de la calidad
La alta dirección debe establecer, implementar y mantener una política de la calidad que:', 1
FROM iso_requirements 
WHERE requirement_code = '5.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) sea apropiada al propósito y al contexto de la organización y apoya su dirección estratégica;', 2
FROM iso_requirements 
WHERE requirement_code = '5.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) proporcione un marco de referencia para el establecimiento de los objetivos de la calidad', 3
FROM iso_requirements 
WHERE requirement_code = '5.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) incluya el compromiso de cumplir los requisitos aplicables;', 4
FROM iso_requirements 
WHERE requirement_code = '5.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'd) incluya el compromiso de mejora continua del sistema de gestión de la calidad.', 5
FROM iso_requirements 
WHERE requirement_code = '5.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 5.2.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) estar disponible y mantenerse como información documentada;', 1
FROM iso_requirements 
WHERE requirement_code = '5.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) comunicarse, entenderse y aplicarse dentro de la organización;', 2
FROM iso_requirements 
WHERE requirement_code = '5.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) estar disponible para las partes interesadas pertinentes, según corresponda.', 3
FROM iso_requirements 
WHERE requirement_code = '5.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 5.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe asegurarse de que las responsabilidades y autoridades para los roles pertinentes se asignen, se comuniquen y se entiendan dentro de la organización. 
La alta dirección debe asignar la responsabilidad y autoridad para:', 1
FROM iso_requirements 
WHERE requirement_code = '5.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) asegurarse de que el sistema de gestión de la calidad es conforme con los requisitos de esta Norma Internacional;', 2
FROM iso_requirements 
WHERE requirement_code = '5.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) asegurarse de que los procesos están dando las salidas previstas;', 3
FROM iso_requirements 
WHERE requirement_code = '5.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) informar a la alta dirección sobre el desempeño del sistema de gestión de la calidad y sobre las oportunidades de mejora (véase 10.1);', 4
FROM iso_requirements 
WHERE requirement_code = '5.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'd) asegurarse de que se promueva el enfoque al cliente a través de la organización;', 5
FROM iso_requirements 
WHERE requirement_code = '5.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'e) asegurarse de que la integridad del sistema de gestión de la calidad se mantiene cuando se planifican e implementan cambios en el sistema de gestión de la calidad', 6
FROM iso_requirements 
WHERE requirement_code = '5.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '6.PLANIFICACIÓN', 7
FROM iso_requirements 
WHERE requirement_code = '5.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 6.1.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al planificar el sistema de gestión de la calidad, la organización debe considerar las cuestiones referidas en el apartado 4.1 y los requisitos referidos en el apartado 4.2, y determinar los riesgos y oportunidades que es necesario abordar con el fin de:', 1
FROM iso_requirements 
WHERE requirement_code = '6.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) asegurar que el sistema de gestión de la calidad pueda lograr sus resultados previstos;', 2
FROM iso_requirements 
WHERE requirement_code = '6.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) aumentar los efectos deseables;', 3
FROM iso_requirements 
WHERE requirement_code = '6.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) prevenir o reducir efectos no deseados;', 4
FROM iso_requirements 
WHERE requirement_code = '6.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'd) lograr la mejora', 5
FROM iso_requirements 
WHERE requirement_code = '6.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 6.1.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) las acciones para abordar estos riesgos y oportunidades;', 1
FROM iso_requirements 
WHERE requirement_code = '6.1.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) La manera de:   
1) integrar e implementar las acciones en sus procesos del sistema de gestión de la calidad;', 2
FROM iso_requirements 
WHERE requirement_code = '6.1.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '2) evaluar la eficacia de estas acciones.', 3
FROM iso_requirements 
WHERE requirement_code = '6.1.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Las acciones tomadas para abordar los riesgos y oportunidades deben ser proporcionales al impacto potencial en la conformidad de los productos y los servicios', 4
FROM iso_requirements 
WHERE requirement_code = '6.1.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 6.2.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Los objetivos de la calidad deben:', 1
FROM iso_requirements 
WHERE requirement_code = '6.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) ser coherentes con la política de la calidad;', 2
FROM iso_requirements 
WHERE requirement_code = '6.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) ser medibles;', 3
FROM iso_requirements 
WHERE requirement_code = '6.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) tener en cuenta los requisitos aplicables;', 4
FROM iso_requirements 
WHERE requirement_code = '6.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'd) ser pertinentes para la conformidad de los productos y servicios y para el aumento de la satisfacción del cliente;', 5
FROM iso_requirements 
WHERE requirement_code = '6.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'e) ser objeto de seguimiento;', 6
FROM iso_requirements 
WHERE requirement_code = '6.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'f) comunicarse', 7
FROM iso_requirements 
WHERE requirement_code = '6.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'g) actualizarse, según corresponda.', 8
FROM iso_requirements 
WHERE requirement_code = '6.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe mantener información documentada sobre los objetivos de la calidad.', 9
FROM iso_requirements 
WHERE requirement_code = '6.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 6.2.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) qué se va a hacer;', 1
FROM iso_requirements 
WHERE requirement_code = '6.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) qué recursos se requerirán;', 2
FROM iso_requirements 
WHERE requirement_code = '6.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) quién será responsable;', 3
FROM iso_requirements 
WHERE requirement_code = '6.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'd) cuándo se finalizará;', 4
FROM iso_requirements 
WHERE requirement_code = '6.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'e) cómo se evaluarán los resultados.', 5
FROM iso_requirements 
WHERE requirement_code = '6.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 6.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando la organización determine la necesidad de cambios en el sistema de gestión de la calidad, estos cambios se deben llevar a cabo de manera planificada y sistemática (véase 4.4). 
La organización debe considerar:', 1
FROM iso_requirements 
WHERE requirement_code = '6.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) el propósito de los cambios y sus potenciales consecuencias;', 2
FROM iso_requirements 
WHERE requirement_code = '6.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) la integridad del sistema de gestión de la calidad;', 3
FROM iso_requirements 
WHERE requirement_code = '6.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) la disponibilidad de recursos;', 4
FROM iso_requirements 
WHERE requirement_code = '6.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'd) la asignación o reasignación de responsabilidades y autoridades.', 5
FROM iso_requirements 
WHERE requirement_code = '6.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '7.SOPORTE', 6
FROM iso_requirements 
WHERE requirement_code = '6.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 7.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar y proporcionar los recursos necesarios para el establecimiento, implementación, mantenimiento y mejora continua del sistema de gestión de la calidad.', 1
FROM iso_requirements 
WHERE requirement_code = '7.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe considerar:', 2
FROM iso_requirements 
WHERE requirement_code = '7.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) las capacidades y limitaciones de los recursos internos existentes;', 3
FROM iso_requirements 
WHERE requirement_code = '7.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) qué se necesita obtener de los proveedores externos.', 4
FROM iso_requirements 
WHERE requirement_code = '7.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 7.1.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar y proporcionar las personas necesarias para implementación eficaz de su sistema de gestión de la calidad y para la operación y control de sus procesos.', 1
FROM iso_requirements 
WHERE requirement_code = '7.1.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 7.1.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar, proporcionar y mantener la infraestructura necesaria para que la operación de sus procesos logre la conformidad de los productos y servicios.', 1
FROM iso_requirements 
WHERE requirement_code = '7.1.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '7.1.4. Ambiente para la operación de los procesos', 2
FROM iso_requirements 
WHERE requirement_code = '7.1.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar, proporcionar y mantener el ambiente necesario para la operación de sus procesos y para lograr la conformidad de los productos y servicios.', 3
FROM iso_requirements 
WHERE requirement_code = '7.1.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 7.1.5
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar y proporcionar los recursos necesarios para asegurarse de la validez y fiabilidad de los resultados cuando el seguimiento o la medición se utilizan para verificar la conformidad de los productos y servicios con los requisitos.', 1
FROM iso_requirements 
WHERE requirement_code = '7.1.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que los recursos proporcionados:', 2
FROM iso_requirements 
WHERE requirement_code = '7.1.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) son adecuados para el tipo específico de actividades de seguimiento y medición realizadas;', 3
FROM iso_requirements 
WHERE requirement_code = '7.1.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) se mantienen para asegurarse de la adecuación continua para su propósito.', 4
FROM iso_requirements 
WHERE requirement_code = '7.1.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe conservar la información documentada adecuada como evidencia de la adecuación para el propósito del seguimiento y medición de los recursos.', 5
FROM iso_requirements 
WHERE requirement_code = '7.1.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '7.1.5.2 Trazabilidad de las mediciones', 6
FROM iso_requirements 
WHERE requirement_code = '7.1.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando la trazabilidad de las mediciones sea un requisito, o es considerada por la organización como parte esencial de proporcionar confianza en la validez de los resultados de la medición, el equipo de medición debe:', 7
FROM iso_requirements 
WHERE requirement_code = '7.1.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) verificarse o calibrarse, o ambas, a intervalos especificados, o antes de su utilización, comparando con patrones de medición trazables a patrones de medición internacionales o nacionales; cuando no existan tales patrones, debe conservarse como información documentada la base utilizada para la calibración o la verificación;', 8
FROM iso_requirements 
WHERE requirement_code = '7.1.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) identificarse para determinar su estado;', 9
FROM iso_requirements 
WHERE requirement_code = '7.1.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) protegerse contra ajustes, daño o deterioro que pudieran invalidar el estado de calibración y los posteriores resultados de la medición.', 10
FROM iso_requirements 
WHERE requirement_code = '7.1.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar si la validez de los resultados de medición previos se ha visto afectada de manera adversa cuando el equipo de medición se considere no apto para su propósito previsto, y debe tomar las acciones adecuadas cuando sea necesario.', 11
FROM iso_requirements 
WHERE requirement_code = '7.1.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 7.1.6
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar los conocimientos necesarios para la operación de sus procesos y para lograr la conformidad de los productos y servicios.', 1
FROM iso_requirements 
WHERE requirement_code = '7.1.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Estos conocimientos deben mantenerse y ponerse a disposición en la extensión necesaria.', 2
FROM iso_requirements 
WHERE requirement_code = '7.1.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando se tratan las necesidades y tendencias cambiantes, la organización debe considerar sus conocimientos actuales y determinar cómo adquirir o acceder a los conocimientos adicionales necesarios y a las actualizaciones requeridas.', 3
FROM iso_requirements 
WHERE requirement_code = '7.1.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 7.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe:', 1
FROM iso_requirements 
WHERE requirement_code = '7.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) determinar la competencia necesaria de las personas que realizan, bajo su control, un trabajo que afecta al desempeño y eficacia del sistema de gestión de la calidad;', 2
FROM iso_requirements 
WHERE requirement_code = '7.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) asegurarse de que estas personas sean competentes, basándose en la educación, formación o experiencia adecuadas;', 3
FROM iso_requirements 
WHERE requirement_code = '7.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) cuando sea aplicable, tomar acciones para adquirir la competencia necesaria y evaluar la eficacia de las acciones tomadas;', 4
FROM iso_requirements 
WHERE requirement_code = '7.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'd) conservar la información documentada apropiada, como evidencia de la competencia.', 5
FROM iso_requirements 
WHERE requirement_code = '7.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 7.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que las personas pertinentes que realizan el trabajo bajo el control de la organización toman conciencia de:', 1
FROM iso_requirements 
WHERE requirement_code = '7.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) la política de la calidad;', 2
FROM iso_requirements 
WHERE requirement_code = '7.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) los objetivos de la calidad pertinentes;', 3
FROM iso_requirements 
WHERE requirement_code = '7.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) su contribución a la eficacia del sistema de gestión de la calidad, incluyendo los beneficios de una mejora del desempeño;', 4
FROM iso_requirements 
WHERE requirement_code = '7.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'd) las implicaciones de no cumplir los requisitos del sistema de gestión de la calidad.', 5
FROM iso_requirements 
WHERE requirement_code = '7.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 7.4
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar las comunicaciones internas y externas pertinentes al sistema de gestión de la calidad, que incluyan:', 1
FROM iso_requirements 
WHERE requirement_code = '7.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) qué comunicar;', 2
FROM iso_requirements 
WHERE requirement_code = '7.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) cuándo comunicar;', 3
FROM iso_requirements 
WHERE requirement_code = '7.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) a quién comunicar;', 4
FROM iso_requirements 
WHERE requirement_code = '7.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'd) cómo comunicar.', 5
FROM iso_requirements 
WHERE requirement_code = '7.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'e) quién comunica.', 6
FROM iso_requirements 
WHERE requirement_code = '7.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 7.5
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'El sistema de gestión de la calidad de la organización debe incluir:', 1
FROM iso_requirements 
WHERE requirement_code = '7.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) la información documentada requerida por esta Norma Internacional', 2
FROM iso_requirements 
WHERE requirement_code = '7.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) la información documentada que la organización ha determinado que es necesaria para la eficacia del sistema de gestión de la calidad.', 3
FROM iso_requirements 
WHERE requirement_code = '7.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 7.5.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando se crea y actualiza información documentada, la organización debe asegurarse de que lo siguiente sea apropiado', 1
FROM iso_requirements 
WHERE requirement_code = '7.5.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) la identificación y descripción (por ejemplo, título, fecha, autor o número de referencia);', 2
FROM iso_requirements 
WHERE requirement_code = '7.5.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) el formato (por ejemplo, idioma, versión del software, gráficos) y sus medios de soporte (por ejemplo, papel, electrónico);', 3
FROM iso_requirements 
WHERE requirement_code = '7.5.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) la revisión y aprobación con respecto a la idoneidad y adecuación.', 4
FROM iso_requirements 
WHERE requirement_code = '7.5.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 7.5.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '7.5.3.1 La información documentada requerida por el sistema de gestión de la calidad y por esta Norma Internacional se debe controlar para asegurarse de que:', 1
FROM iso_requirements 
WHERE requirement_code = '7.5.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) esté disponible y adecuada para su uso, dónde y cuándo se necesite;', 2
FROM iso_requirements 
WHERE requirement_code = '7.5.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) esté protegida adecuadamente (por ejemplo, contra pérdida de la confidencialidad, uso inadecuado, o pérdida de integridad).', 3
FROM iso_requirements 
WHERE requirement_code = '7.5.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '7.5.3.2 Para el control de la información documentada, la organización debe tratar las siguientes actividades, según corresponda:', 4
FROM iso_requirements 
WHERE requirement_code = '7.5.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) distribución, acceso, recuperación y uso;', 5
FROM iso_requirements 
WHERE requirement_code = '7.5.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) almacenamiento y preservación, incluida la preservación de la legibilidad;', 6
FROM iso_requirements 
WHERE requirement_code = '7.5.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) control de cambios (por ejemplo, control de versión);', 7
FROM iso_requirements 
WHERE requirement_code = '7.5.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'd) conservación y disposición.', 8
FROM iso_requirements 
WHERE requirement_code = '7.5.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La información documentada de origen externo, que la organización determina como necesaria para la planificación y operación del sistema de gestión de la calidad se debe identificar según sea adecuado y controlar.', 9
FROM iso_requirements 
WHERE requirement_code = '7.5.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La información documentada conservada como evidencia de la conformidad debe protegerse contra las modificaciones no intencionadas.', 10
FROM iso_requirements 
WHERE requirement_code = '7.5.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '8.OPERACIÓN', 11
FROM iso_requirements 
WHERE requirement_code = '7.5.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe planificar, implementar y controlar los procesos (véase 4.4) necesarios para cumplir los requisitos para la producción de productos y prestación de servicios, y para implementar las acciones determinadas en el capítulo 6, mediante:', 1
FROM iso_requirements 
WHERE requirement_code = '8.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) la determinación de los requisitos para los productos y servicios;', 2
FROM iso_requirements 
WHERE requirement_code = '8.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) el establecimiento de criterios para:
1) los procesos;
2) la aceptación de los productos y servicios;', 3
FROM iso_requirements 
WHERE requirement_code = '8.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) la determinación de los recursos necesarios para lograr la conformidad para los requisitos de los productos y servicios;', 4
FROM iso_requirements 
WHERE requirement_code = '8.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'd) la implementación del control de los procesos de acuerdo con los criterios;', 5
FROM iso_requirements 
WHERE requirement_code = '8.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'e) la determinación y almacenaje de la información documentada en la medida necesaria:
1) para confiar en que los procesos se han llevado a cabo según lo planificado;
2) para demostrar la conformidad de los productos y servicios con sus requisitos..', 6
FROM iso_requirements 
WHERE requirement_code = '8.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'El elemento de salida de esta planificación debe ser adecuado para las operaciones de la organización.', 7
FROM iso_requirements 
WHERE requirement_code = '8.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe controlar los cambios planificados y revisar las consecuencias de los cambios no previstos, tomando acciones para mitigar cualquier efecto adverso, cuando sea necesario.', 8
FROM iso_requirements 
WHERE requirement_code = '8.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que los procesos contratados externamente estén controlados (véase 8.4).', 9
FROM iso_requirements 
WHERE requirement_code = '8.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.2.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La comunicación con los clientes debe :', 1
FROM iso_requirements 
WHERE requirement_code = '8.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) proporcionar la información relativa a los productos y servicios;', 2
FROM iso_requirements 
WHERE requirement_code = '8.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) la atención de las consultas, los contratos o los pedidos, incluyendo los cambios;', 3
FROM iso_requirements 
WHERE requirement_code = '8.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) obtener la retroalimentación de los clientes relativa a los productos y servicios, incluyendo las quejas de los clientes;', 4
FROM iso_requirements 
WHERE requirement_code = '8.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'd) manipular o controlar las propiedades del cliente;', 5
FROM iso_requirements 
WHERE requirement_code = '8.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'e) establecer los requisitos específicos para las acciones de contingencia, cuando sea pertinente.', 6
FROM iso_requirements 
WHERE requirement_code = '8.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.2.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando determina los requisitos para los productos y servicios que se van a ofrecer a los clientes, la organización debe asegurarse de que:', 1
FROM iso_requirements 
WHERE requirement_code = '8.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) los requisitos para los productos y servicios se definen, incluyendo:
1) cualquier requisito legal y reglamentario aplicable;
2) aquellos considerados necesarios por la organización;', 2
FROM iso_requirements 
WHERE requirement_code = '8.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) la organización puede cumplir las reclamaciones de los productos y servicios que ofrece.', 3
FROM iso_requirements 
WHERE requirement_code = '8.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.2.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '8.2.3.1 La organización debe asegurarse de que tiene la capacidad de cumplir los requisitos para los productos y servicios que se van a ofrecer a los clientes.', 1
FROM iso_requirements 
WHERE requirement_code = '8.2.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe llevar a cabo una revisión antes de comprometerse a suministrar productos y servicios a un cliente, para incluir:', 2
FROM iso_requirements 
WHERE requirement_code = '8.2.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) los requisitos especificados por el cliente, incluyendo los requisitos para las actividades de entrega y las posteriores a la misma;', 3
FROM iso_requirements 
WHERE requirement_code = '8.2.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) los requisitos no establecidos por el cliente, pero necesarios para el uso especificado o para el uso previsto, cuando sea conocido;', 4
FROM iso_requirements 
WHERE requirement_code = '8.2.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) los requisitos especificados por la organización;', 5
FROM iso_requirements 
WHERE requirement_code = '8.2.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'd) los requisitos legales y reglamentarios adicionales aplicables a los productos y servicios;', 6
FROM iso_requirements 
WHERE requirement_code = '8.2.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'e) las diferencias existentes entre los requisitos de contrato o pedido y los expresados previamente.', 7
FROM iso_requirements 
WHERE requirement_code = '8.2.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que se resuelven las diferencias existentes entre los requisitos del contrato o pedido y los expresados previamente.', 8
FROM iso_requirements 
WHERE requirement_code = '8.2.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe confirmar los requisitos del cliente antes de la aceptación, cuando el cliente no proporcione una declaración documentada de sus requisitos.', 9
FROM iso_requirements 
WHERE requirement_code = '8.2.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '8.2.3.2 La organización debe conservar la información documentada, cuando sea aplicable:', 10
FROM iso_requirements 
WHERE requirement_code = '8.2.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) sobre los resultados de la revisión;', 11
FROM iso_requirements 
WHERE requirement_code = '8.2.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) sobre cualquier requisito nuevo para los productos y servicios.', 12
FROM iso_requirements 
WHERE requirement_code = '8.2.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.2.4
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que la información documentada pertinente sea modificada, y de que las personas correspondientes sean conscientes de los requisitos modificados, cuando se cambien los requisitos para los productos y servicios', 1
FROM iso_requirements 
WHERE requirement_code = '8.2.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.3.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe establecer, implementar y mantener un proceso de diseño y desarrollo que sea adecuado para asegurarse de la posterior producción de productos y prestación de servicios.', 1
FROM iso_requirements 
WHERE requirement_code = '8.3.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.3.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al determinar las etapas y controles para el diseño y desarrollo, la organización debe considerar:', 1
FROM iso_requirements 
WHERE requirement_code = '8.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) la naturaleza, duración y complejidad de las actividades de diseño y desarrollo;', 2
FROM iso_requirements 
WHERE requirement_code = '8.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) las etapas del proceso requeridas, incluyendo las revisiones del diseño y desarrollo aplicables;', 3
FROM iso_requirements 
WHERE requirement_code = '8.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) las actividades requeridas de verificación y validación del diseño y desarrollo;', 4
FROM iso_requirements 
WHERE requirement_code = '8.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'd) las responsabilidades y autoridades involucradas en el proceso de diseño y desarrollo;', 5
FROM iso_requirements 
WHERE requirement_code = '8.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'e) las necesidades de recursos internos y externos para el diseño y desarrollo de los productos y servicios;', 6
FROM iso_requirements 
WHERE requirement_code = '8.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'f) la necesidad de controlar las interfaces entre las personas implicadas en el proceso de diseño y desarrollo;', 7
FROM iso_requirements 
WHERE requirement_code = '8.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'g) la necesidad de la participación activa de los clientes y usuarios en el proceso de diseño y desarrollo;', 8
FROM iso_requirements 
WHERE requirement_code = '8.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'h) los requisitos para la posterior producción de productos y prestación de servicios;', 9
FROM iso_requirements 
WHERE requirement_code = '8.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'i) el nivel de control del proceso de diseño y desarrollo esperado por los clientes y otras partes interesadas pertinentes;', 10
FROM iso_requirements 
WHERE requirement_code = '8.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'j) la información documentada necesaria para demostrar que se han cumplido los requisitos del diseño y desarrollo.', 11
FROM iso_requirements 
WHERE requirement_code = '8.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.3.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar los requisitos esenciales para los tipos específicos de productos y servicios que se van a diseñar y desarrollar.
 La organización debe considerar:', 1
FROM iso_requirements 
WHERE requirement_code = '8.3.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) los requisitos funcionales y de desempeño;', 2
FROM iso_requirements 
WHERE requirement_code = '8.3.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) la información proveniente de actividades de diseño y desarrollo previas similares;', 3
FROM iso_requirements 
WHERE requirement_code = '8.3.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) los requisitos legales y reglamentarios;', 4
FROM iso_requirements 
WHERE requirement_code = '8.3.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'd) normas o códigos de prácticas que la organización se ha comprometido a implementar;', 5
FROM iso_requirements 
WHERE requirement_code = '8.3.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'e) las consecuencias potenciales del fracaso debido a la naturaleza de los productos y servicios;', 6
FROM iso_requirements 
WHERE requirement_code = '8.3.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Deben resolverse las entradas del diseño y desarrollo contradictorios.', 7
FROM iso_requirements 
WHERE requirement_code = '8.3.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe conservar la información documentada sobre las entradas del diseño y desarrollo.', 8
FROM iso_requirements 
WHERE requirement_code = '8.3.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.3.4
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe aplicar controles al proceso de diseño y desarrollo para asegurarse de que:', 1
FROM iso_requirements 
WHERE requirement_code = '8.3.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) los resultados a lograr están definidos;', 2
FROM iso_requirements 
WHERE requirement_code = '8.3.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) las revisiones se realizan para evaluar la capacidad de los resultados del diseño y desarrollo de cumplir los requisitos;', 3
FROM iso_requirements 
WHERE requirement_code = '8.3.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) se realizan actividades de verificación para asegurarse de que las salidas del diseño y desarrollo cumplen los requisitos de las entradas;', 4
FROM iso_requirements 
WHERE requirement_code = '8.3.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'd) se realizan actividades de validación para asegurarse de que los productos y servicios resultantes satisfacen los requisitos para su aplicación especificada o uso previsto;', 5
FROM iso_requirements 
WHERE requirement_code = '8.3.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'e) se toma cualquier acción necesaria sobre los problemas determinados durante las revisiones, o las actividades de verificación y validación;', 6
FROM iso_requirements 
WHERE requirement_code = '8.3.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'f) se conserva la información documentada de estas actividades.', 7
FROM iso_requirements 
WHERE requirement_code = '8.3.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.3.5
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que las salidas del diseño y desarrollo:', 1
FROM iso_requirements 
WHERE requirement_code = '8.3.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) cumplen los requisitos de las entradas;', 2
FROM iso_requirements 
WHERE requirement_code = '8.3.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) son adecuados para los procesos posteriores para la provisión de productos y servicios;', 3
FROM iso_requirements 
WHERE requirement_code = '8.3.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) incluyen o hacen referencia a los requisitos de seguimiento y medición, cuando sea adecuado, y a los criterios de aceptación;', 4
FROM iso_requirements 
WHERE requirement_code = '8.3.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'd) especifican las características de los productos y servicios que son esenciales para su propósito previsto y su uso seguro y correcto.', 5
FROM iso_requirements 
WHERE requirement_code = '8.3.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.3.6
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe identificar, revisar y controlar los cambios hechos durante el diseño y desarrollo de los productos y servicios o posteriormente, en la medida necesaria para asegurarse de que no haya un impacto adverso en la conformidad con los requisitos.
La organización debe conservar la información documentada sobre:', 1
FROM iso_requirements 
WHERE requirement_code = '8.3.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) los cambios del diseño y desarrollo;', 2
FROM iso_requirements 
WHERE requirement_code = '8.3.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) los resultados de las revisiones;', 3
FROM iso_requirements 
WHERE requirement_code = '8.3.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) la autorización de los cambios;', 4
FROM iso_requirements 
WHERE requirement_code = '8.3.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'd) las acciones tomadas para prevenir los impactos adversos.', 5
FROM iso_requirements 
WHERE requirement_code = '8.3.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.4.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que los procesos, productos y servicios suministrados externamente son conformes a los requisitos.', 1
FROM iso_requirements 
WHERE requirement_code = '8.4.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar los controles a aplicar a los procesos, productos y servicios suministrados externamente cuando:', 2
FROM iso_requirements 
WHERE requirement_code = '8.4.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) los productos y servicios de proveedores externos están destinados a incorporarse dentro de los propios productos y servicios de la organización;', 3
FROM iso_requirements 
WHERE requirement_code = '8.4.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) los productos y servicios son proporcionados directamente a los clientes por proveedores externos en nombre de la organización;', 4
FROM iso_requirements 
WHERE requirement_code = '8.4.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) un proceso, o una parte de un proceso, es proporcionado por un proveedor externo como resultado de una decisión de la organización.', 5
FROM iso_requirements 
WHERE requirement_code = '8.4.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar y aplicar criterios para la evaluación, la selección, el seguimiento del desempeño y la reevaluación de los proveedores externos, basándose en su capacidad para proporcionar procesos o productos y servicios de acuerdo con los requisitos.', 6
FROM iso_requirements 
WHERE requirement_code = '8.4.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe conservar la información documentada adecuada de estas actividades y de cualquier acción necesaria que surja de las evaluaciones.', 7
FROM iso_requirements 
WHERE requirement_code = '8.4.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.4.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de que los procesos, productos y servicios suministrados externamente no afectan de manera adversa a la capacidad de la organización de entregar productos y servicios conformes de manera coherente a sus clientes. La organización debe:', 1
FROM iso_requirements 
WHERE requirement_code = '8.4.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) asegurarse de que los procesos suministrados externamente permanecen dentro del control de su sistema de gestión de la calidad;', 2
FROM iso_requirements 
WHERE requirement_code = '8.4.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) definir los controles que pretende aplicar a un proveedor externo y los que pretende aplicar a las salidas resultantes;', 3
FROM iso_requirements 
WHERE requirement_code = '8.4.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) tener en consideración:
1) el impacto potencial de los procesos, productos y servicios suministrados externamente en la capacidad de la organización de cumplir regularmente los requisitos del cliente y los legales y reglamentarios aplicables;
2) la eficacia de los controles aplicados por el proveedor externo;', 4
FROM iso_requirements 
WHERE requirement_code = '8.4.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'd) determinar la verificación, u otras actividades, necesarias para asegurarse de que los procesos, productos y servicios suministrados externamente cumplen los requisitos.', 5
FROM iso_requirements 
WHERE requirement_code = '8.4.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.4.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe asegurarse de la adecuación de los requisitos antes de su comunicación al proveedor externo.', 1
FROM iso_requirements 
WHERE requirement_code = '8.4.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe comunicar a los proveedores externos sus requisitos para:', 2
FROM iso_requirements 
WHERE requirement_code = '8.4.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) los procesos, productos y servicios a proporcionar;', 3
FROM iso_requirements 
WHERE requirement_code = '8.4.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) la aprobación de:
1) productos y servicios;
2) métodos, procesos y equipo;
3) la liberación de productos y servicios;', 4
FROM iso_requirements 
WHERE requirement_code = '8.4.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) la competencia, incluyendo cualquier calificación de las personas requerida;', 5
FROM iso_requirements 
WHERE requirement_code = '8.4.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'd) las interacciones del proveedor externo con la organización;', 6
FROM iso_requirements 
WHERE requirement_code = '8.4.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'e) el control y el seguimiento del desempeño del proveedor externo a aplicar por la organización;', 7
FROM iso_requirements 
WHERE requirement_code = '8.4.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'f) las actividades de verificación o validación que la organización, o su cliente, pretenden llevar a cabo en las instalaciones del proveedor externo.', 8
FROM iso_requirements 
WHERE requirement_code = '8.4.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.5.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe implementar la producción y prestación del servicio bajo condiciones controladas.', 1
FROM iso_requirements 
WHERE requirement_code = '8.5.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Las condiciones controladas deben incluir, cuando sea aplicable:', 2
FROM iso_requirements 
WHERE requirement_code = '8.5.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) la disponibilidad de información documentada que defina:
1) las características de los productos a producir, los servicios a prestar, o las actividades a desempeñar;
2) los resultados a alcanzar;', 3
FROM iso_requirements 
WHERE requirement_code = '8.5.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) la disponibilidad y el uso de los recursos de seguimiento y medición adecuados;', 4
FROM iso_requirements 
WHERE requirement_code = '8.5.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) la implementación de actividades de seguimiento y medición en las etapas apropiadas para verificar que se cumplen los criterios para el control de los procesos o las salidas, y los criterios de aceptación para los productos y servicios;', 5
FROM iso_requirements 
WHERE requirement_code = '8.5.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'd) el uso de la infraestructura y el ambiente adecuados para la operación de los procesos;', 6
FROM iso_requirements 
WHERE requirement_code = '8.5.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'e) la designación de personas competentes, incluyendo cualquier calificación requerida;', 7
FROM iso_requirements 
WHERE requirement_code = '8.5.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'f) la validación y revalidación periódica de la capacidad para alcanzar los resultados planificados de los procesos de producción y de prestación del servicio, donde el elemento de salida resultante no pueda verificarse mediante actividades de seguimiento o medición posteriores;', 8
FROM iso_requirements 
WHERE requirement_code = '8.5.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'g) la implementación de acciones para prevenir los errores humanos;', 9
FROM iso_requirements 
WHERE requirement_code = '8.5.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'h) la implementación de actividades de liberación, entrega y posteriores a la entrega.', 10
FROM iso_requirements 
WHERE requirement_code = '8.5.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.5.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe utilizar los medios adecuados para identificar las salidas cuando sea necesario para asegurar la conformidad de los productos y servicios.', 1
FROM iso_requirements 
WHERE requirement_code = '8.5.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe identificar el estado de las salidas con respecto a los requisitos de seguimiento y medición a través de la producción y prestación del servicio.', 2
FROM iso_requirements 
WHERE requirement_code = '8.5.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe controlar la identificación única de las salidas cuando la trazabilidad sea un requisito, y', 3
FROM iso_requirements 
WHERE requirement_code = '8.5.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Se debe conservar la información documentada necesaria para permitir la trazabilidad.', 4
FROM iso_requirements 
WHERE requirement_code = '8.5.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.5.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe cuidar la propiedad perteneciente a los clientes o a proveedores externos mientras esté bajo el control de la organización o esté siendo utilizado por la misma', 1
FROM iso_requirements 
WHERE requirement_code = '8.5.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe identificar, verificar, proteger y salvaguardar la propiedad de los clientes o de los proveedores externos suministrada para su utilización o incorporación dentro de los productos y servicios.', 2
FROM iso_requirements 
WHERE requirement_code = '8.5.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cuando la propiedad de un cliente o de un proveedor externo se pierda, deteriore o que de algún otro modo se considere inadecuada para su uso, la organización debe informar de esto al cliente o proveedor externo y', 3
FROM iso_requirements 
WHERE requirement_code = '8.5.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'conservar la información documentada sobre lo que ha ocurrido..', 4
FROM iso_requirements 
WHERE requirement_code = '8.5.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.5.4
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe preservar las salidas durante la producción y prestación del servicio, en la medida necesaria para asegurarse de la conformidad con los requisitos.', 1
FROM iso_requirements 
WHERE requirement_code = '8.5.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.5.5
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe cumplir los requisitos para las actividades posteriores a la entrega asociadas con los productos y servicios.', 1
FROM iso_requirements 
WHERE requirement_code = '8.5.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Al determinar el alcance de las actividades posteriores a la entrega que se requieren, la organización debe considerar:', 2
FROM iso_requirements 
WHERE requirement_code = '8.5.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) los requisitos legales y reglamentarios;', 3
FROM iso_requirements 
WHERE requirement_code = '8.5.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) las potenciales consecuencias no deseadas asociadas con sus productos y servicios;', 4
FROM iso_requirements 
WHERE requirement_code = '8.5.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) la naturaleza, el uso y la vida prevista de sus productos y servicios;', 5
FROM iso_requirements 
WHERE requirement_code = '8.5.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'd) los requisitos del cliente;', 6
FROM iso_requirements 
WHERE requirement_code = '8.5.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'e) retroalimentación del cliente;', 7
FROM iso_requirements 
WHERE requirement_code = '8.5.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.5.6
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe revisar y controlar los cambios para la producción o la prestación del servicio, en la medida necesaria para asegurarse de la conformidad continua con los requisitos especificados.', 1
FROM iso_requirements 
WHERE requirement_code = '8.5.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe conservar información documentada que describa los resultados de la revisión de los cambios, las personas que autorizan el cambio y de cualquier acción necesaria que surja de la revisión.', 2
FROM iso_requirements 
WHERE requirement_code = '8.5.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.6
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe implementar las disposiciones planificadas, en las etapas adecuadas, para verificar que se cumplen los requisitos de los productos y servicios.', 1
FROM iso_requirements 
WHERE requirement_code = '8.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La liberación de los productos y servicios al cliente no debe llevarse a cabo hasta que se hayan completado satisfactoriamente las disposiciones planificadas, a menos que sea aprobado de otra manera por una autoridad pertinente y, cuando sea aplicable, por el cliente.', 2
FROM iso_requirements 
WHERE requirement_code = '8.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe conservar la información documentada sobre la liberación de los productos y servicios.', 3
FROM iso_requirements 
WHERE requirement_code = '8.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La información documentada debe incluir:
a) evidencia de la conformidad con los criterios de aceptación;
b) trazabilidad a las personas que han autorizado la liberación.', 4
FROM iso_requirements 
WHERE requirement_code = '8.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.7
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'PROMEDIO', 1
FROM iso_requirements 
WHERE requirement_code = '8.7' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '9 EVALUACIÓN DEL DESEMPEÑO', 2
FROM iso_requirements 
WHERE requirement_code = '8.7' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.7.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe tomar las acciones adecuadas basándose en la naturaleza de la no conformidad y en su efecto sobre la conformidad de los productos y servicios. Esto se debe aplicar también a los productos y servicios no conformes detectados después de la entrega de los productos, durante o después de la provisión de los servicios.', 1
FROM iso_requirements 
WHERE requirement_code = '8.7.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe tratar las salidas no conformes de una o más de las siguientes maneras:', 2
FROM iso_requirements 
WHERE requirement_code = '8.7.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) corrección;', 3
FROM iso_requirements 
WHERE requirement_code = '8.7.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) separación, contención, devolución o suspensión de la provisión de los productos y servicios;', 4
FROM iso_requirements 
WHERE requirement_code = '8.7.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) informar al cliente;', 5
FROM iso_requirements 
WHERE requirement_code = '8.7.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'd) obtener autorización para su aceptación bajo concesión.', 6
FROM iso_requirements 
WHERE requirement_code = '8.7.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Debe verificarse la conformidad con los requisitos cuando las salidas no conformes se corrigen.', 7
FROM iso_requirements 
WHERE requirement_code = '8.7.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 8.7.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) describa las acciones tomadas;', 1
FROM iso_requirements 
WHERE requirement_code = '8.7.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) describa las concesiones obtenidas;', 2
FROM iso_requirements 
WHERE requirement_code = '8.7.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'd) identifique la autoridad que ha decidido la acción con respecto a la no conformidad.', 3
FROM iso_requirements 
WHERE requirement_code = '8.7.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'NUMERAL', 4
FROM iso_requirements 
WHERE requirement_code = '8.7.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 9.1.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) a qué es necesario hacer seguimiento y qué es necesario medir;', 1
FROM iso_requirements 
WHERE requirement_code = '9.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) los métodos de seguimiento, medición, análisis y evaluación necesarios para asegurar resultados válidos;', 2
FROM iso_requirements 
WHERE requirement_code = '9.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) cuándo se deben llevar a cabo el seguimiento y la medición;', 3
FROM iso_requirements 
WHERE requirement_code = '9.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'd) cuándo se deben analizar y evaluar los resultados del seguimiento y la medición.', 4
FROM iso_requirements 
WHERE requirement_code = '9.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe evaluar el desempeño y la eficacia del sistema de gestión de la calidad.', 5
FROM iso_requirements 
WHERE requirement_code = '9.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe mantener la información documentada como evidencia de los resultados.', 6
FROM iso_requirements 
WHERE requirement_code = '9.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 9.1.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe realizar el seguimiento de las percepciones de los clientes del grado en que se cumplen sus necesidades y expectativas.', 1
FROM iso_requirements 
WHERE requirement_code = '9.1.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar los métodos para obtener, realizar el seguimiento y revisar esta información.', 2
FROM iso_requirements 
WHERE requirement_code = '9.1.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 9.1.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe analizar y evaluar los datos y la información apropiados originados por el seguimiento y la medición.', 1
FROM iso_requirements 
WHERE requirement_code = '9.1.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Los resultados del análisis deben utilizarse para evaluar:', 2
FROM iso_requirements 
WHERE requirement_code = '9.1.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) la conformidad de los productos y servicios;', 3
FROM iso_requirements 
WHERE requirement_code = '9.1.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) el grado de satisfacción del cliente;', 4
FROM iso_requirements 
WHERE requirement_code = '9.1.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) el desempeño y la eficacia del sistema de gestión de la calidad;', 5
FROM iso_requirements 
WHERE requirement_code = '9.1.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'd) si lo planificado se ha implementado de forma eficaz;', 6
FROM iso_requirements 
WHERE requirement_code = '9.1.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'e) la eficacia de las acciones tomadas para abordar los riesgos y oportunidades;', 7
FROM iso_requirements 
WHERE requirement_code = '9.1.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'f) el desempeño de los proveedores externos;', 8
FROM iso_requirements 
WHERE requirement_code = '9.1.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'g) la necesidad de mejoras en el sistema de gestión de la calidad.', 9
FROM iso_requirements 
WHERE requirement_code = '9.1.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 9.2.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) cumple:', 1
FROM iso_requirements 
WHERE requirement_code = '9.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '1) los requisitos propios de la organización para su sistema de gestión de la calidad;', 2
FROM iso_requirements 
WHERE requirement_code = '9.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '2) los requisitos de esta Norma Internacional;', 3
FROM iso_requirements 
WHERE requirement_code = '9.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) está implementado y mantenido eficazmente.', 4
FROM iso_requirements 
WHERE requirement_code = '9.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 9.2.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) planificar, establecer, implementar y mantener uno o varios programas de auditoría que incluyan la frecuencia, los métodos, las responsabilidades, los requisitos de planificación y la elaboración de informes, que deben tener en consideración la importancia de los procesos involucrados, los cambios que afecten a la organización y los resultados de las auditorías previas;', 1
FROM iso_requirements 
WHERE requirement_code = '9.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) para cada auditoría, definir los criterios de la auditoría y el alcance de cada auditoría;', 2
FROM iso_requirements 
WHERE requirement_code = '9.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) seleccionar los auditores y llevar a cabo auditorías para asegurarse de la objetividad y la imparcialidad del proceso de auditoría;', 3
FROM iso_requirements 
WHERE requirement_code = '9.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'd) asegurarse de que los resultados de las auditorías se informan a la dirección pertinente;', 4
FROM iso_requirements 
WHERE requirement_code = '9.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'e) realizar las correcciones y tomar las acciones correctivas adecuadas sin demora injustificada;', 5
FROM iso_requirements 
WHERE requirement_code = '9.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'f) conservar la información documentada como evidencia de la implementación del programa de auditoría y los resultados de la auditoría.', 6
FROM iso_requirements 
WHERE requirement_code = '9.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 9.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La alta dirección debe revisar el sistema de gestión de la calidad de la organización a intervalos planificados, para asegurarse de su idoneidad, adecuación, eficacia y alineación con la dirección estratégica de la organización continuas.', 1
FROM iso_requirements 
WHERE requirement_code = '9.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 9.3.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) el estado de las acciones desde revisiones por la dirección previas;', 1
FROM iso_requirements 
WHERE requirement_code = '9.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) los cambios en las cuestiones externas e internas que sean pertinentes al sistema de gestión de la calidad;', 2
FROM iso_requirements 
WHERE requirement_code = '9.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) la información sobre el desempeño y la eficacia del sistema de gestión de la calidad, incluidas las tendencias relativas a:', 3
FROM iso_requirements 
WHERE requirement_code = '9.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '1) satisfacción del cliente y la retroalimentación de las partes interesadas pertinentes;', 4
FROM iso_requirements 
WHERE requirement_code = '9.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '2) el grado en que se han cumplido los objetivos de la calidad;', 5
FROM iso_requirements 
WHERE requirement_code = '9.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '3) desempeño de los procesos y conformidad de los productos y servicios;', 6
FROM iso_requirements 
WHERE requirement_code = '9.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '4) no conformidades y acciones correctivas;', 7
FROM iso_requirements 
WHERE requirement_code = '9.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '5) resultados de seguimiento y medición;', 8
FROM iso_requirements 
WHERE requirement_code = '9.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '6) resultados de las auditorías;', 9
FROM iso_requirements 
WHERE requirement_code = '9.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '7) el desempeño de los proveedores externos;', 10
FROM iso_requirements 
WHERE requirement_code = '9.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'd) la adecuación de los recursos;', 11
FROM iso_requirements 
WHERE requirement_code = '9.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'e) la eficacia de las acciones tomadas para abordar los riesgos y las oportunidades (véase 6.1);', 12
FROM iso_requirements 
WHERE requirement_code = '9.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'f) oportunidades de mejora.', 13
FROM iso_requirements 
WHERE requirement_code = '9.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 9.3.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Las salidas de la revisión por la dirección deben incluir las decisiones y acciones relacionadas con:
a) las oportunidades de mejora;', 1
FROM iso_requirements 
WHERE requirement_code = '9.3.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) cualquier necesidad de cambio en el sistema de gestión de la calidad;', 2
FROM iso_requirements 
WHERE requirement_code = '9.3.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) las necesidades de recursos.', 3
FROM iso_requirements 
WHERE requirement_code = '9.3.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe conservar información documentada como evidencia de los resultados de las revisiones por la dirección.', 4
FROM iso_requirements 
WHERE requirement_code = '9.3.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '10. MEJORA', 5
FROM iso_requirements 
WHERE requirement_code = '9.3.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 10.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe determinar y seleccionar las oportunidades de mejora e implementar cualquier acción necesaria para cumplir los requisitos del cliente y aumentar la satisfacción del cliente.', 1
FROM iso_requirements 
WHERE requirement_code = '10.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Estas deben incluir:', 2
FROM iso_requirements 
WHERE requirement_code = '10.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) mejorar los productos y servicios para cumplir los requisitos, así como tratar las necesidades y expectativas futuras;', 3
FROM iso_requirements 
WHERE requirement_code = '10.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) corregir, prevenir o reducir los efectos indeseados;', 4
FROM iso_requirements 
WHERE requirement_code = '10.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) mejorar el desempeño y la eficacia del sistema de gestión de la calidad.', 5
FROM iso_requirements 
WHERE requirement_code = '10.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 10.2.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) reaccionar ante la no conformidad y, cuando sea aplicable:
    1) tomar acciones para controlarla y corregirla;
    2) hacer frente a las consecuencias;', 1
FROM iso_requirements 
WHERE requirement_code = '10.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) evaluar la necesidad de acciones para eliminar las causas de la no conformidad, con el fin de que no vuelva a ocurrir ni ocurra en otra parte, mediante:', 2
FROM iso_requirements 
WHERE requirement_code = '10.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '1) la revisión y el análisis de la no conformidad;', 3
FROM iso_requirements 
WHERE requirement_code = '10.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '2) la determinación de las causas de la no conformidad;', 4
FROM iso_requirements 
WHERE requirement_code = '10.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, '3) la determinación de si existen no conformidades similares, o que potencialmente podrían ocurrir;', 5
FROM iso_requirements 
WHERE requirement_code = '10.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'c) implementar cualquier acción necesaria;', 6
FROM iso_requirements 
WHERE requirement_code = '10.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'd) revisar la eficacia de cualquier acción correctiva tomada;', 7
FROM iso_requirements 
WHERE requirement_code = '10.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'e) si es necesario, actualizar los riesgos y oportunidades determinados durante la planificación;', 8
FROM iso_requirements 
WHERE requirement_code = '10.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'f) si es necesario, hacer cambios al sistema de gestión de la calidad.', 9
FROM iso_requirements 
WHERE requirement_code = '10.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Las acciones correctivas deben ser adecuadas a los efectos de las no conformidades encontradas.', 10
FROM iso_requirements 
WHERE requirement_code = '10.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 10.2.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'a) la naturaleza de las no conformidades y cualquier acción posterior tomada;', 1
FROM iso_requirements 
WHERE requirement_code = '10.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'b) los resultados de cualquier acción correctiva.', 2
FROM iso_requirements 
WHERE requirement_code = '10.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para requisito 10.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe mejorar continuamente la idoneidad, adecuación y eficacia del sistema de gestión de la calidad.', 1
FROM iso_requirements 
WHERE requirement_code = '10.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'La organización debe considerar los resultados del análisis y la evaluación, y las salidas de la revisión por la dirección, para determinar si hay necesidades u oportunidades que deben tratarse como parte de la mejora continua.', 2
FROM iso_requirements 
WHERE requirement_code = '10.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));

-- Criterios para RES0312

-- Criterios para requisito 1.1.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Designado.', 1
FROM iso_requirements 
WHERE requirement_code = '1.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Perfil acorde al nivel  de riesgo y tamaño de la empresa.', 2
FROM iso_requirements 
WHERE requirement_code = '1.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Soportes de títulos , diplomas , licencia en SST, curso virtual de 50 horas.', 3
FROM iso_requirements 
WHERE requirement_code = '1.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Asignación y comunicación de funciones, responsabilidades sobre el SG-SST.', 4
FROM iso_requirements 
WHERE requirement_code = '1.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Conoce sus responsabilidades en el SG-SST.', 5
FROM iso_requirements 
WHERE requirement_code = '1.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cumple con las funciones y responsabilidades  asignadas.', 6
FROM iso_requirements 
WHERE requirement_code = '1.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 1.1.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Responsabilidades en SST documentadas para todos los cargos.', 1
FROM iso_requirements 
WHERE requirement_code = '1.1.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Incluyen el cuidado de la salud, cumplimiento con directrices del SG-SST, informar sobre peligros - riesgos del  trabajo, participación en capacitaciones, otras.', 2
FROM iso_requirements 
WHERE requirement_code = '1.1.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Comunicadas  al personal.', 3
FROM iso_requirements 
WHERE requirement_code = '1.1.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Conocidas por el trabador.', 4
FROM iso_requirements 
WHERE requirement_code = '1.1.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cumplimiento por el trabajador.', 5
FROM iso_requirements 
WHERE requirement_code = '1.1.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 1.1.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Definición de recursos financieros,  técnicos, tecnológicos y de personal.', 1
FROM iso_requirements 
WHERE requirement_code = '1.1.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Pertinencia según prioridades de SST.', 2
FROM iso_requirements 
WHERE requirement_code = '1.1.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Disponibilidad.', 3
FROM iso_requirements 
WHERE requirement_code = '1.1.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Trazabilidad sobre su inversión o ejecución.', 4
FROM iso_requirements 
WHERE requirement_code = '1.1.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Recursos para que el responsable del sistema, Copasst, vigía, otros puedan cumplir sus funciones.', 5
FROM iso_requirements 
WHERE requirement_code = '1.1.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 1.1.4
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Afiliación al SGRL de todo el personal:
(Muestra del 10% trabajadores para entre 51 y 200 trabajadores)
(Muestra de 30 trabajadores para más de 200 trabajadores)
   * Sistema General de Salud (EPS). 
   * Sistema General de Riesgos Laborales (ARL). 
   * Sistema General de Pensiones (AFP).', 1
FROM iso_requirements 
WHERE requirement_code = '1.1.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Afiliaciones y aportes oportunos: 
      *Fecha de vinculación del trabajador. 
      *Fechas definidas por ley. 
      *Sobre el IBC y clase de riesgo propio de la actividad.', 2
FROM iso_requirements 
WHERE requirement_code = '1.1.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 1.1.5
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Identificación de actividades de alto riesgo (Decreto 2090 de 2003).', 1
FROM iso_requirements 
WHERE requirement_code = '1.1.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Identificación de  trabajadores dedicados a estas actividades.', 2
FROM iso_requirements 
WHERE requirement_code = '1.1.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Caracterización de la labor por cargos, funciones, tareas, jornadas, lugar ,otros.', 3
FROM iso_requirements 
WHERE requirement_code = '1.1.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Identificación de peligros,  valoración del riesgo y controles.', 4
FROM iso_requirements 
WHERE requirement_code = '1.1.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Implementación de controles: Evaluaciones médicas, mediciones higiénicas, otras.', 5
FROM iso_requirements 
WHERE requirement_code = '1.1.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Notificación a entidades competentes sobre estas actividades.', 6
FROM iso_requirements 
WHERE requirement_code = '1.1.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Pago de la cotización especial.', 7
FROM iso_requirements 
WHERE requirement_code = '1.1.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 1.1.6
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Constitución Copasst -  Designación del Vigía de SST.', 1
FROM iso_requirements 
WHERE requirement_code = '1.1.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Procesos de convocatoria, elección, conformación.', 2
FROM iso_requirements 
WHERE requirement_code = '1.1.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Vigencia.', 3
FROM iso_requirements 
WHERE requirement_code = '1.1.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Reuniones  mensuales y actas de reunión.', 4
FROM iso_requirements 
WHERE requirement_code = '1.1.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Seguimiento a compromisos.', 5
FROM iso_requirements 
WHERE requirement_code = '1.1.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Recursos y tiempo para actividades.', 6
FROM iso_requirements 
WHERE requirement_code = '1.1.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Conocimiento de los trabajadores sobre el Copasst /Vigía de SST  (representantes, miembros, funciones, otros).', 7
FROM iso_requirements 
WHERE requirement_code = '1.1.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 1.1.7
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Disponibilidad de curso virtual de 50 horas.', 1
FROM iso_requirements 
WHERE requirement_code = '1.1.7' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Soportes para principales y suplentes.', 2
FROM iso_requirements 
WHERE requirement_code = '1.1.7' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Aprobación del curso virtual.', 3
FROM iso_requirements 
WHERE requirement_code = '1.1.7' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Capacitación   sobre  deberes, responsabilidades y aspectos del SG-SST.', 4
FROM iso_requirements 
WHERE requirement_code = '1.1.7' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Conocimiento de los miembros sobre funciones y responsabilidades.', 5
FROM iso_requirements 
WHERE requirement_code = '1.1.7' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 1.1.8
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Constitución del Comité de convivencia laboral (Cocola).', 1
FROM iso_requirements 
WHERE requirement_code = '1.1.8' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Procesos de convocatoria, elección y conformación.', 2
FROM iso_requirements 
WHERE requirement_code = '1.1.8' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Vigencia del Comité.', 3
FROM iso_requirements 
WHERE requirement_code = '1.1.8' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Reunión al menos cada 3 meses.', 4
FROM iso_requirements 
WHERE requirement_code = '1.1.8' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Seguimiento a compromisos y  actas de reunión.', 5
FROM iso_requirements 
WHERE requirement_code = '1.1.8' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Recursos y tiempo para actividades.', 6
FROM iso_requirements 
WHERE requirement_code = '1.1.8' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Capacitación   a miembros sobre  deberes y responsabilidades.', 7
FROM iso_requirements 
WHERE requirement_code = '1.1.8' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Conocimiento de los trabajadores sobre el comité (representantes, miembros, funciones, otros)', 8
FROM iso_requirements 
WHERE requirement_code = '1.1.8' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 1.2.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Disponibilidad de un programa de capacitaciones en SST.', 1
FROM iso_requirements 
WHERE requirement_code = '1.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Requisitos de conocimiento y prácticas en SST para todos los trabajadores - contratistas.', 2
FROM iso_requirements 
WHERE requirement_code = '1.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Temas relacionados con  la identificación de  peligros, riesgos, emergencias, accidentes de trabajo, otros.', 3
FROM iso_requirements 
WHERE requirement_code = '1.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Revisión  y actualización del programa.', 4
FROM iso_requirements 
WHERE requirement_code = '1.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cumplimiento de cronograma y en la jornada laboral.', 5
FROM iso_requirements 
WHERE requirement_code = '1.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Idoneidad - conocimiento de los capacitadores.', 6
FROM iso_requirements 
WHERE requirement_code = '1.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Conocimiento de los trabajadores sobre las capacitaciones en SST recibidas.', 7
FROM iso_requirements 
WHERE requirement_code = '1.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Inducción y reinducción en SST.', 8
FROM iso_requirements 
WHERE requirement_code = '1.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Inducción en SST a todo el personal (trabajadores, contratistas).', 9
FROM iso_requirements 
WHERE requirement_code = '1.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Inducción antes de iniciar las labores con la empresa.', 10
FROM iso_requirements 
WHERE requirement_code = '1.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Reinducción en SST a todo el personal.', 11
FROM iso_requirements 
WHERE requirement_code = '1.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Temas  de la inducción y reinducción: Peligros, riesgos de sus actividades, tareas de alto riesgo, actividades rutinarias - no rutinarias, medidas de prevención, control, emergencias, otros.', 12
FROM iso_requirements 
WHERE requirement_code = '1.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 1.2.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Para el responsable del SG-SST', 1
FROM iso_requirements 
WHERE requirement_code = '1.2.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Curso virtual de 50 horas.', 2
FROM iso_requirements 
WHERE requirement_code = '1.2.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Aprobación del curso.', 3
FROM iso_requirements 
WHERE requirement_code = '1.2.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Expedición por una entidad autorizada ARL, SENA, caja de compensación, otros.', 4
FROM iso_requirements 
WHERE requirement_code = '1.2.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Vigencia ( 3 años ).', 5
FROM iso_requirements 
WHERE requirement_code = '1.2.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Renovación - reentrenamiento (20 Horas ) después de 3 años.', 6
FROM iso_requirements 
WHERE requirement_code = '1.2.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Conocimiento del responsable del SG-SST en temas asociados.', 7
FROM iso_requirements 
WHERE requirement_code = '1.2.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'GESTIÓN INTEGRAL DEL SISTEMA DE GESTIÓN DE LA SEGURIDAD Y SALUD EN EL TRABAJO', 8
FROM iso_requirements 
WHERE requirement_code = '1.2.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 2.1.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Documentada.', 1
FROM iso_requirements 
WHERE requirement_code = '2.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Alcance a todos los centros de trabajo y trabajadores.', 2
FROM iso_requirements 
WHERE requirement_code = '2.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Específica para la empresa.', 3
FROM iso_requirements 
WHERE requirement_code = '2.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Describe compromisos con la gestión de riesgos laborales, protección de los trabajadores, cumplimiento de la normatividad y mejora continua.', 4
FROM iso_requirements 
WHERE requirement_code = '2.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Revisión anual.', 5
FROM iso_requirements 
WHERE requirement_code = '2.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Actualizada , fechada y firmada  por el representante legal.', 6
FROM iso_requirements 
WHERE requirement_code = '2.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Comunicada y acceso para todos los trabajadores.', 7
FROM iso_requirements 
WHERE requirement_code = '2.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Conocimiento  de los trabajadores.', 8
FROM iso_requirements 
WHERE requirement_code = '2.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cumplimiento por parte de los trabajadores.', 9
FROM iso_requirements 
WHERE requirement_code = '2.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 2.2.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Documentados.', 1
FROM iso_requirements 
WHERE requirement_code = '2.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Atienden prioridades y directrices de la política de SST.', 2
FROM iso_requirements 
WHERE requirement_code = '2.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Son medibles, cuantificables y tienen metas para cumplimiento.', 3
FROM iso_requirements 
WHERE requirement_code = '2.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Seguimiento y medición  al menos anualmente.', 4
FROM iso_requirements 
WHERE requirement_code = '2.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Resultados  y planes de acción.', 5
FROM iso_requirements 
WHERE requirement_code = '2.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Conocimiento de los trabajadores.', 6
FROM iso_requirements 
WHERE requirement_code = '2.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 2.3.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Documentada.', 1
FROM iso_requirements 
WHERE requirement_code = '2.3.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Realizada por una persona con conociendo el SST / idónea.', 2
FROM iso_requirements 
WHERE requirement_code = '2.3.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Aspectos de ley que se  revisaron.', 3
FROM iso_requirements 
WHERE requirement_code = '2.3.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Análisis de resultados.', 4
FROM iso_requirements 
WHERE requirement_code = '2.3.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Determinación de prioridades en SST.', 5
FROM iso_requirements 
WHERE requirement_code = '2.3.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Determinación  de controles e implementación.', 6
FROM iso_requirements 
WHERE requirement_code = '2.3.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Planes de acción.', 7
FROM iso_requirements 
WHERE requirement_code = '2.3.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 2.4.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Disponible.', 1
FROM iso_requirements 
WHERE requirement_code = '2.4.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Relaciona objetivos , metas, actividades, responsables, cronograma y recursos.', 2
FROM iso_requirements 
WHERE requirement_code = '2.4.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Atiende prioridades en SST.', 3
FROM iso_requirements 
WHERE requirement_code = '2.4.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Ejecutado según lo programado.', 4
FROM iso_requirements 
WHERE requirement_code = '2.4.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Firmado por el empleador y responsable del SG-SST.', 5
FROM iso_requirements 
WHERE requirement_code = '2.4.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Actualizado.', 6
FROM iso_requirements 
WHERE requirement_code = '2.4.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 2.5.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Mecanismo de archivo y retención documental.', 1
FROM iso_requirements 
WHERE requirement_code = '2.5.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Control, legibilidad, identificación , accesibilidad  y protección  a daño.', 2
FROM iso_requirements 
WHERE requirement_code = '2.5.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Registros internos y externos.', 3
FROM iso_requirements 
WHERE requirement_code = '2.5.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Tiempo de conservación documental ( Para algunos de 20 años a partir del momento en que cese la relación laboral del trabajador con la empresa).', 4
FROM iso_requirements 
WHERE requirement_code = '2.5.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Confidencialidad de información.', 5
FROM iso_requirements 
WHERE requirement_code = '2.5.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Uso de versiones actualizadas y vigentes en los lugares de trabajo.', 6
FROM iso_requirements 
WHERE requirement_code = '2.5.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 2.6.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Mecanismo para rendición de cuentas sobre el desempeño del personal en SST.', 1
FROM iso_requirements 
WHERE requirement_code = '2.6.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Rendiciones de cuentas personal documentadas para todo el personal.', 2
FROM iso_requirements 
WHERE requirement_code = '2.6.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Frecuencia de realización al menos anual.', 3
FROM iso_requirements 
WHERE requirement_code = '2.6.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Conocimiento del personal sobre proceso de rendición.', 4
FROM iso_requirements 
WHERE requirement_code = '2.6.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Conocimiento del personal sobre resultados de rendición.', 5
FROM iso_requirements 
WHERE requirement_code = '2.6.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Seguimiento a compromisos resultado de la rendición de cuentas.', 6
FROM iso_requirements 
WHERE requirement_code = '2.6.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 2.7.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Disponibilidad de matriz legal actualizada.', 1
FROM iso_requirements 
WHERE requirement_code = '2.7.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Identificación de obligaciones  técnicas y legales aplicables en SST y SGRL.', 2
FROM iso_requirements 
WHERE requirement_code = '2.7.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cumplimiento de obligaciones.', 3
FROM iso_requirements 
WHERE requirement_code = '2.7.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Capacitación al personal  sobre obligaciones legales.', 4
FROM iso_requirements 
WHERE requirement_code = '2.7.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Conocimiento del personal sobre aspectos legales (Responsable del SG-SST, Copasst -Vigía en SST, trabajadores y empleadores)', 5
FROM iso_requirements 
WHERE requirement_code = '2.7.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 2.8.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Mecanismo para recibir y responder comunicaciones en SST.', 1
FROM iso_requirements 
WHERE requirement_code = '2.8.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Tratamiento de comunicaciones internas y externas.', 2
FROM iso_requirements 
WHERE requirement_code = '2.8.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Uso de los mecanismos de comunicación por parte de los trabajadores.', 3
FROM iso_requirements 
WHERE requirement_code = '2.8.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Tratamiento de los autorreporte de condiciones de SST.', 4
FROM iso_requirements 
WHERE requirement_code = '2.8.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Tratamiento a solicitudes, quejas, inquietudes de los trabajadores.', 5
FROM iso_requirements 
WHERE requirement_code = '2.8.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Seguimiento y planes de acción.', 6
FROM iso_requirements 
WHERE requirement_code = '2.8.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 2.9.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Procedimiento para adquirió de bienes y servicios.', 1
FROM iso_requirements 
WHERE requirement_code = '2.9.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Criterios de SST.', 2
FROM iso_requirements 
WHERE requirement_code = '2.9.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Proceso de selección  y compra  según criterios.', 3
FROM iso_requirements 
WHERE requirement_code = '2.9.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Procesos de evaluación al prestador del bien  o servicio.', 4
FROM iso_requirements 
WHERE requirement_code = '2.9.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Seguimiento y planes de acción.', 5
FROM iso_requirements 
WHERE requirement_code = '2.9.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 2.10.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Procedimiento para la selección de proveedores y contratistas.', 1
FROM iso_requirements 
WHERE requirement_code = '2.10.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Criterios de SST (Afiliación, normas de SST, responsabilidades, otras)', 2
FROM iso_requirements 
WHERE requirement_code = '2.10.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Proceso de selección de proveedores y contratistas.', 3
FROM iso_requirements 
WHERE requirement_code = '2.10.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Procesos de evaluación al desempeño de contratistas y proveedores .', 4
FROM iso_requirements 
WHERE requirement_code = '2.10.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Capacitación a proveedores y contratistas, sobre peligros, riesgos, ATEL,otros.', 5
FROM iso_requirements 
WHERE requirement_code = '2.10.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Conocimiento por parte de contratistas y proveedores de criterios de SST.', 6
FROM iso_requirements 
WHERE requirement_code = '2.10.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Seguimiento y planes de acción.', 7
FROM iso_requirements 
WHERE requirement_code = '2.10.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 2.11.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Procedimiento gestión del cambio.', 1
FROM iso_requirements 
WHERE requirement_code = '2.11.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Identificación de posibles cambios  internos / externos.', 2
FROM iso_requirements 
WHERE requirement_code = '2.11.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Análisis del cambio, nuevos peligros, riesgos, otros.', 3
FROM iso_requirements 
WHERE requirement_code = '2.11.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Identificación de medidas de prevención y control.', 4
FROM iso_requirements 
WHERE requirement_code = '2.11.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Implementación de medidas y seguimiento al cambio.', 5
FROM iso_requirements 
WHERE requirement_code = '2.11.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Capacitación al personal antes y después del cambio.', 6
FROM iso_requirements 
WHERE requirement_code = '2.11.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Conocimiento del personal sobre la gestión del cambio.', 7
FROM iso_requirements 
WHERE requirement_code = '2.11.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'GESTIÓN DE LA SALUD', 8
FROM iso_requirements 
WHERE requirement_code = '2.11.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 3.1.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Diagnóstico de condiciones de salud y perfil sociodemográfico.', 1
FROM iso_requirements 
WHERE requirement_code = '3.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Disponible.', 2
FROM iso_requirements 
WHERE requirement_code = '3.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Alcance y cobertura a todos los trabajadores.', 3
FROM iso_requirements 
WHERE requirement_code = '3.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Actualizado.', 4
FROM iso_requirements 
WHERE requirement_code = '3.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Conclusiones y recomendaciones definidas.', 5
FROM iso_requirements 
WHERE requirement_code = '3.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 3.1.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Análisis de recomendaciones del diagnóstico de salud.', 1
FROM iso_requirements 
WHERE requirement_code = '3.1.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Análisis de las estadísticas de salud (Incidentes, accidentes de trabajo, casos por enfermedad laboral y casos de origen común , otros)', 2
FROM iso_requirements 
WHERE requirement_code = '3.1.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Programas de vigilancia epidemiológica actualizados.', 3
FROM iso_requirements 
WHERE requirement_code = '3.1.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Actividades de promoción y prevención (P&P)', 4
FROM iso_requirements 
WHERE requirement_code = '3.1.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Capacitación al personal en P&P.', 5
FROM iso_requirements 
WHERE requirement_code = '3.1.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Apoyo de personal en el área de la salud, con licencia en SST.', 6
FROM iso_requirements 
WHERE requirement_code = '3.1.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 3.1.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Disponibilidad de perfiles de cargo. 
   * Alcance sobre todos los cargos. 
   * Descripción de  las tareas y riesgos laborales.', 1
FROM iso_requirements 
WHERE requirement_code = '3.1.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Comunicación de perfiles de cargo al personal de salud  encargado de las evaluaciones medicas ocupacionales.', 2
FROM iso_requirements 
WHERE requirement_code = '3.1.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Comunicación otra información como  resultados de indicadores epidemiológicos, estudios de higiene, otros.', 3
FROM iso_requirements 
WHERE requirement_code = '3.1.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 3.1.4
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Procedimiento evaluaciones médicas ocupacionales.', 1
FROM iso_requirements 
WHERE requirement_code = '3.1.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Profesiograma, detalle de exámenes médicos en función del cargo y periodicidad.', 2
FROM iso_requirements 
WHERE requirement_code = '3.1.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Evaluaciones medicas ocupacionales:
   * Ingreso  /  Periódicas  / Egreso o retiro / complementarias / post incapacidad / reintegro.', 3
FROM iso_requirements 
WHERE requirement_code = '3.1.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Certificado de aptitud ocupacional, detalle de concepto, restricciones , recomendaciones.', 4
FROM iso_requirements 
WHERE requirement_code = '3.1.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Competencia del profesional de salud  y licencia en SST.', 5
FROM iso_requirements 
WHERE requirement_code = '3.1.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Conocimiento del trabajador de resultado de evaluaciones medicas ocupacionales.', 6
FROM iso_requirements 
WHERE requirement_code = '3.1.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Seguimiento a recomendaciones y estado de salud', 7
FROM iso_requirements 
WHERE requirement_code = '3.1.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 3.1.5
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Mecanismo de confidencialidad  de historias clínicas', 1
FROM iso_requirements 
WHERE requirement_code = '3.1.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Mecanismo de confidencialidad de documentos relativos al estado de salud del trabajador', 2
FROM iso_requirements 
WHERE requirement_code = '3.1.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Acceso solo por personal médico especialista en SST o del trabajador.', 3
FROM iso_requirements 
WHERE requirement_code = '3.1.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Custodia por EPS, médico especialista.', 4
FROM iso_requirements 
WHERE requirement_code = '3.1.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Autorizaciones para acceso a historia clínica e información relacionada.', 5
FROM iso_requirements 
WHERE requirement_code = '3.1.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 3.1.6
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Análisis / consolidado de restricciones y recomendaciones médico/laborales de la EPS  ARL  del personal.', 1
FROM iso_requirements 
WHERE requirement_code = '3.1.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Comunicación al trabajador de restricciones / recomendaciones.', 2
FROM iso_requirements 
WHERE requirement_code = '3.1.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Acatamiento y  seguimiento  a restricciones y recomendaciones.', 3
FROM iso_requirements 
WHERE requirement_code = '3.1.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Adecuación de métodos de trabajo.', 4
FROM iso_requirements 
WHERE requirement_code = '3.1.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Adecuación de puestos de trabajo.', 5
FROM iso_requirements 
WHERE requirement_code = '3.1.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Seguimiento a casos que requieren calificación de origen laboral o por perdida de capacidad laboral.', 6
FROM iso_requirements 
WHERE requirement_code = '3.1.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 3.1.7
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Aplicación de herramientas como diagnósticos, encuestas, herramientas, análisis de diagnósticos de salud, otros.', 1
FROM iso_requirements 
WHERE requirement_code = '3.1.7' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Análisis de información sobre estilo de vida.', 2
FROM iso_requirements 
WHERE requirement_code = '3.1.7' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Programa de estilos de vida y entorno saludable.', 3
FROM iso_requirements 
WHERE requirement_code = '3.1.7' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Implementación de actividades.', 4
FROM iso_requirements 
WHERE requirement_code = '3.1.7' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Capacitación al personal sobre estilos de vida y entornos saludables.', 5
FROM iso_requirements 
WHERE requirement_code = '3.1.7' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Conocimiento del personal .', 6
FROM iso_requirements 
WHERE requirement_code = '3.1.7' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 3.1.8
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Suministro permanente de agua potable.', 1
FROM iso_requirements 
WHERE requirement_code = '3.1.8' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Verificación de condiciones o parámetros de calidad del agua potable.', 2
FROM iso_requirements 
WHERE requirement_code = '3.1.8' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Acceso y estado de servicios sanitarios, proporcional al número de trabajadores.', 3
FROM iso_requirements 
WHERE requirement_code = '3.1.8' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Dotación de elementos de higiene personal (Jabón, papel, toallas desechables, recipientes, otros)', 4
FROM iso_requirements 
WHERE requirement_code = '3.1.8' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Orden y aseo de las instalaciones.', 5
FROM iso_requirements 
WHERE requirement_code = '3.1.8' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Mantenimiento de tanques e instalaciones.', 6
FROM iso_requirements 
WHERE requirement_code = '3.1.8' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Capacitación al personal sobre normas sobre seguridad e higiene.', 7
FROM iso_requirements 
WHERE requirement_code = '3.1.8' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Conocimiento del personal sobre normas.', 8
FROM iso_requirements 
WHERE requirement_code = '3.1.8' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 3.1.9
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Procedimiento  para la clasificación  de residuos.', 1
FROM iso_requirements 
WHERE requirement_code = '3.1.9' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Manejo de todos los residuos, aprovechables / residuos de aparatos eléctricos y electrónicos / no aprovechables /  orgánicos/ residuos peligrosos.', 2
FROM iso_requirements 
WHERE requirement_code = '3.1.9' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Inventario de residuos.', 3
FROM iso_requirements 
WHERE requirement_code = '3.1.9' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Almacenamiento temporal.', 4
FROM iso_requirements 
WHERE requirement_code = '3.1.9' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Estados de áreas, recipientes, contenedores, sistemas de contención.', 5
FROM iso_requirements 
WHERE requirement_code = '3.1.9' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Suministro de elementos de protección personal para manejo.', 6
FROM iso_requirements 
WHERE requirement_code = '3.1.9' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Disposición final de residuos con empresa autorizada y sin poner en riesgo al personal.', 7
FROM iso_requirements 
WHERE requirement_code = '3.1.9' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Capacitación al personal sobre la clasificación y disposición de residuos.', 8
FROM iso_requirements 
WHERE requirement_code = '3.1.9' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Conocimiento del personal.', 9
FROM iso_requirements 
WHERE requirement_code = '3.1.9' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 3.2.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Reporte de todos los accidentes de trabajo (ARL y EPS o IPS)', 1
FROM iso_requirements 
WHERE requirement_code = '3.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Reporte de accidentes graves / mortales /enfermedades diagnosticadas (Dirección Territorial u oficinas especiales).', 2
FROM iso_requirements 
WHERE requirement_code = '3.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Notificación a autoridad competente dos (2) días hábiles siguientes al evento o recibo del diagnóstico de la enfermedad.', 3
FROM iso_requirements 
WHERE requirement_code = '3.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Comunicación de los eventos al personal', 4
FROM iso_requirements 
WHERE requirement_code = '3.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 3.2.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Procedimiento para la investigación de los de incidentes, accidentes y enfermedades laborales.', 1
FROM iso_requirements 
WHERE requirement_code = '3.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Conformación del equipo investigador.', 2
FROM iso_requirements 
WHERE requirement_code = '3.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Capacitación al equipo investigador.', 3
FROM iso_requirements 
WHERE requirement_code = '3.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Investigaciones de todos los eventos.', 4
FROM iso_requirements 
WHERE requirement_code = '3.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Análisis de causas que dieron origen a los eventos y determinación de controles.', 5
FROM iso_requirements 
WHERE requirement_code = '3.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Comunicación a los trabajadores sobre las acciones de mejora, lecciones aprendidas y similar.', 6
FROM iso_requirements 
WHERE requirement_code = '3.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Seguimiento y cumplimiento a las recomendaciones derivadas de las investigaciones.', 7
FROM iso_requirements 
WHERE requirement_code = '3.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Efectividad de las medidas implementadas.', 8
FROM iso_requirements 
WHERE requirement_code = '3.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 3.2.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Registro estadístico de todos los eventos por ATEL (Verificar  año vencido y lo corrido del año).', 1
FROM iso_requirements 
WHERE requirement_code = '3.2.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Caracterización  de los eventos (causas básicas, causas inmediatas, parte del cuerpo afectada, periodicidad, otros).', 2
FROM iso_requirements 
WHERE requirement_code = '3.2.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Análisis de tendencias e información asociada a los eventos.', 3
FROM iso_requirements 
WHERE requirement_code = '3.2.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Determinación de acciones  correctivas, preventivas  y de mejora.', 4
FROM iso_requirements 
WHERE requirement_code = '3.2.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Implementación de acciones.', 5
FROM iso_requirements 
WHERE requirement_code = '3.2.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Comunicación de estadísticas de ATEL al personal.', 6
FROM iso_requirements 
WHERE requirement_code = '3.2.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 3.3.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Ficha técnica del indicador: Nombre del Indicador /definición/fórmula/Interpretación/periodicidad medición/límite /fuente de información /personas que deben conocer el resultado.', 1
FROM iso_requirements 
WHERE requirement_code = '3.3.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Medición mensual del indicador.', 2
FROM iso_requirements 
WHERE requirement_code = '3.3.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Análisis del indicador para lo corrido del año y/o el año inmediatamente anterior.', 3
FROM iso_requirements 
WHERE requirement_code = '3.3.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Clasificación del origen del peligro/riesgo que los generó.', 4
FROM iso_requirements 
WHERE requirement_code = '3.3.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Planes de acción y su implementación.', 5
FROM iso_requirements 
WHERE requirement_code = '3.3.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Comunicación de resultados de indicador.', 6
FROM iso_requirements 
WHERE requirement_code = '3.3.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 3.3.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Ficha técnica del indicador : Nombre del Indicador /definición/fórmula/Interpretación/periodicidad medición/límite /fuente de información /personas que deben conocer el resultado.', 1
FROM iso_requirements 
WHERE requirement_code = '3.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Medición mensual del indicador.', 2
FROM iso_requirements 
WHERE requirement_code = '3.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Análisis del indicador para lo corrido del año y/o el año inmediatamente anterior.', 3
FROM iso_requirements 
WHERE requirement_code = '3.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Clasificación del origen del peligro/riesgo que los generó.', 4
FROM iso_requirements 
WHERE requirement_code = '3.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Planes de acción y su implementación.', 5
FROM iso_requirements 
WHERE requirement_code = '3.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Comunicación de resultados de indicador.', 6
FROM iso_requirements 
WHERE requirement_code = '3.3.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 3.3.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Ficha técnica del indicador: Nombre del Indicador /definición/fórmula/Interpretación/periodicidad medición/límite /fuente de información /personas que deben conocer el resultado.', 1
FROM iso_requirements 
WHERE requirement_code = '3.3.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Medición anual del indicador.', 2
FROM iso_requirements 
WHERE requirement_code = '3.3.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Análisis del indicador para lo corrido del año y/o el año inmediatamente anterior.', 3
FROM iso_requirements 
WHERE requirement_code = '3.3.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Clasificación del origen del peligro/riesgo que los generó.', 4
FROM iso_requirements 
WHERE requirement_code = '3.3.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Planes de acción y su implementación.', 5
FROM iso_requirements 
WHERE requirement_code = '3.3.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Comunicación de resultados de indicador.', 6
FROM iso_requirements 
WHERE requirement_code = '3.3.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 3.3.4
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Ficha técnica del indicador: Nombre del Indicador /definición/fórmula/Interpretación/periodicidad medición/límite /fuente de información /personas que deben conocer el resultado.', 1
FROM iso_requirements 
WHERE requirement_code = '3.3.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Medición anual del indicador.', 2
FROM iso_requirements 
WHERE requirement_code = '3.3.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Análisis del indicador para lo corrido del año y/o el año inmediatamente anterior.', 3
FROM iso_requirements 
WHERE requirement_code = '3.3.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Clasificación del origen del peligro/riesgo que los generó', 4
FROM iso_requirements 
WHERE requirement_code = '3.3.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Planes de acción y su implementación.', 5
FROM iso_requirements 
WHERE requirement_code = '3.3.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Comunicación de resultados de indicador.', 6
FROM iso_requirements 
WHERE requirement_code = '3.3.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 3.3.5
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Ficha técnica del indicador : Nombre del Indicador /definición/fórmula/Interpretación/periodicidad medición/límite /fuente de información /personas que deben conocer el resultado.', 1
FROM iso_requirements 
WHERE requirement_code = '3.3.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Medición anual del indicador.', 2
FROM iso_requirements 
WHERE requirement_code = '3.3.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Análisis del indicador para lo corrido del año y/o el año inmediatamente anterior.', 3
FROM iso_requirements 
WHERE requirement_code = '3.3.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Clasificación del origen del peligro/riesgo que los generó.', 4
FROM iso_requirements 
WHERE requirement_code = '3.3.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Planes de acción y su implementación.', 5
FROM iso_requirements 
WHERE requirement_code = '3.3.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Comunicación de resultados de indicador.', 6
FROM iso_requirements 
WHERE requirement_code = '3.3.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 3.3.6
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Ficha técnica del indicador: Nombre del Indicador /definición/fórmula/Interpretación/periodicidad medición/límite /fuente de información /personas que deben conocer el resultado.', 1
FROM iso_requirements 
WHERE requirement_code = '3.3.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Medición mensual del indicador.', 2
FROM iso_requirements 
WHERE requirement_code = '3.3.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Análisis del indicador para lo corrido del año y/o el año inmediatamente anterior.', 3
FROM iso_requirements 
WHERE requirement_code = '3.3.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Clasificación del origen del peligro/riesgo que los generó.', 4
FROM iso_requirements 
WHERE requirement_code = '3.3.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Planes de acción y su implementación.', 5
FROM iso_requirements 
WHERE requirement_code = '3.3.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Comunicación de resultados de indicador.', 6
FROM iso_requirements 
WHERE requirement_code = '3.3.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'GESTIÓN DE PELIGROS Y RIESGOS', 7
FROM iso_requirements 
WHERE requirement_code = '3.3.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 4.1.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Metodología de IPVR:', 1
FROM iso_requirements 
WHERE requirement_code = '4.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Documentada  y con alcance a todos los procesos, actividades, procesos, servicios, instalaciones, equipos, centros de trabajo, trabajadores.', 2
FROM iso_requirements 
WHERE requirement_code = '4.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Capacitación al personal sobre metodología. 
Matriz de Peligros y riesgos', 3
FROM iso_requirements 
WHERE requirement_code = '4.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Disponible, actualizada y revisada anualmente.', 4
FROM iso_requirements 
WHERE requirement_code = '4.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Identificación continua de peligros,  valoración de riesgos.', 5
FROM iso_requirements 
WHERE requirement_code = '4.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Análisis de tareas criticas, proceso, servicios de interés  (Trabajos eléctricos, trabajos en alturas, trabajo en caliente, trabajos en  espacios confinados, excavaciones, izaje y maniobra de cargas, vigilancia, transporte, otros).', 6
FROM iso_requirements 
WHERE requirement_code = '4.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Priorización de riesgos de SST.', 7
FROM iso_requirements 
WHERE requirement_code = '4.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Determinación e implementación de medidas de intervención para controlar los riesgos SST (Jerarquía de controles).', 8
FROM iso_requirements 
WHERE requirement_code = '4.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Seguimiento a la efectividad de las medidas de control.', 9
FROM iso_requirements 
WHERE requirement_code = '4.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 4.1.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Mecanismo para asegurar la participación del personal en la IPVR.', 1
FROM iso_requirements 
WHERE requirement_code = '4.1.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Participación de los trabajadores en la IPVR  de su lugar de trabajo.', 2
FROM iso_requirements 
WHERE requirement_code = '4.1.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Incorporación de información proporcionada por el trabajador.', 3
FROM iso_requirements 
WHERE requirement_code = '4.1.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Actualización anual de la matriz IPVR y por accidentes de trabajo mortal , cambios  en procesos ,  instalaciones , maquinaria , equipos y similar.', 4
FROM iso_requirements 
WHERE requirement_code = '4.1.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Capacitación al personal.', 5
FROM iso_requirements 
WHERE requirement_code = '4.1.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Conocimiento del personal sobre los riesgos a los que están expuestos, tareas criticas, controles.', 6
FROM iso_requirements 
WHERE requirement_code = '4.1.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Aplicación de medidas de control por los trabajadores en el lugar de trabajo.', 7
FROM iso_requirements 
WHERE requirement_code = '4.1.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 4.1.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Identificación de todas las sustancias químicas que procesa, manipula, almacena, transporta, desecha  o utiliza la empresa  para el desarrollo de sus actividades.', 1
FROM iso_requirements 
WHERE requirement_code = '4.1.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Determinación del peligro, según las características de las sustancias.', 2
FROM iso_requirements 
WHERE requirement_code = '4.1.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Priorización de sustancias cancerígenas independiente de su dosis o nivel de exposición.', 3
FROM iso_requirements 
WHERE requirement_code = '4.1.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Determinación de medidas de prevención y control.', 4
FROM iso_requirements 
WHERE requirement_code = '4.1.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Implementación de medidas.', 5
FROM iso_requirements 
WHERE requirement_code = '4.1.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Seguimiento a efectividad de medidas y planes de acción.
Sobre el personal expuesto:', 6
FROM iso_requirements 
WHERE requirement_code = '4.1.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Identificación del personal expuesto y frecuencia de exposición.', 7
FROM iso_requirements 
WHERE requirement_code = '4.1.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Vigilancia al estado de salud.', 8
FROM iso_requirements 
WHERE requirement_code = '4.1.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Asignación y uso de elementos de protección personal.', 9
FROM iso_requirements 
WHERE requirement_code = '4.1.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Capacitación al personal en temas de P&P.', 10
FROM iso_requirements 
WHERE requirement_code = '4.1.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Conocimiento del personal.', 11
FROM iso_requirements 
WHERE requirement_code = '4.1.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 4.1.4
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cronograma de mediciones ambientales ocupacionales.', 1
FROM iso_requirements 
WHERE requirement_code = '4.1.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Realización de mediciones para monitorear los factores de riesgo prioritarios según lo programado.', 2
FROM iso_requirements 
WHERE requirement_code = '4.1.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Informe de medición con recomendaciones.', 3
FROM iso_requirements 
WHERE requirement_code = '4.1.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Competencia del higienista que realizo la medición y licencia en SST.', 4
FROM iso_requirements 
WHERE requirement_code = '4.1.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Certificado de calibración y especificaciones técnicas de los equipos.', 5
FROM iso_requirements 
WHERE requirement_code = '4.1.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Análisis de resultados y plan de acción.', 6
FROM iso_requirements 
WHERE requirement_code = '4.1.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Implementación de recomendaciones y acciones para el control de riesgos.', 7
FROM iso_requirements 
WHERE requirement_code = '4.1.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Monitoreo del estado de salud del personal expuesto (Evaluaciones medicas ocupacionales, sistema de vigilancia epidemiológica, otros).', 8
FROM iso_requirements 
WHERE requirement_code = '4.1.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Comunicación al Copasst Vigía de SST sobre resultados.', 9
FROM iso_requirements 
WHERE requirement_code = '4.1.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Capacitación al personal sobre resultados , medidas de  prevención y control.', 10
FROM iso_requirements 
WHERE requirement_code = '4.1.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 4.2.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Implementación de medidas de prevención y control en las áreas de trabajo, según:', 1
FROM iso_requirements 
WHERE requirement_code = '4.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Matriz de peligros y riesgos.', 2
FROM iso_requirements 
WHERE requirement_code = '4.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Todos los riesgos , incluidos los prioritarios.', 3
FROM iso_requirements 
WHERE requirement_code = '4.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Jerarquía de controles.', 4
FROM iso_requirements 
WHERE requirement_code = '4.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Cargos y/o áreas de trabajo críticas.', 5
FROM iso_requirements 
WHERE requirement_code = '4.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Capacitación al personal  sobre las  medidas de prevención y control de riesgos.', 6
FROM iso_requirements 
WHERE requirement_code = '4.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Conocimiento del personal para la gestión del riesgo en el lugar de trabajo.', 7
FROM iso_requirements 
WHERE requirement_code = '4.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Efectividad de las medidas de control.', 8
FROM iso_requirements 
WHERE requirement_code = '4.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Condiciones adecuadas de SST en los lugares de trabajo.', 9
FROM iso_requirements 
WHERE requirement_code = '4.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'No presencia de condiciones subestándar en áreas de trabajo.', 10
FROM iso_requirements 
WHERE requirement_code = '4.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Estado de condiciones locativas , orden y aseo , condiciones de almacenamiento , estado de equipos, máquinas, herramientas, pisos, techos, instalaciones, iluminación, instalaciones eléctricas, otros.', 11
FROM iso_requirements 
WHERE requirement_code = '4.2.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 4.2.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'El trabajador tiene conocimiento, entre otros aspectos sobre:', 1
FROM iso_requirements 
WHERE requirement_code = '4.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Peligros y riesgos del lugar de trabajo.', 2
FROM iso_requirements 
WHERE requirement_code = '4.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Medidas de prevención y control sobre ATEL.', 3
FROM iso_requirements 
WHERE requirement_code = '4.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Procedimientos de trabajo seguro.', 4
FROM iso_requirements 
WHERE requirement_code = '4.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Elementos de protección personal.', 5
FROM iso_requirements 
WHERE requirement_code = '4.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Manejo en caso de emergencia. 
Condiciones adecuadas de SST en los lugares de trabajo:', 6
FROM iso_requirements 
WHERE requirement_code = '4.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Control de las actividades criticas como trabajo en caliente, espacios confinados, trabajo en alturas, riesgo eléctrico, izaje de cargas.', 7
FROM iso_requirements 
WHERE requirement_code = '4.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Estado de orden y aseo.', 8
FROM iso_requirements 
WHERE requirement_code = '4.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Estado de la señalización y demarcación.', 9
FROM iso_requirements 
WHERE requirement_code = '4.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Eficacia de las acciones de prevención y control implementadas.', 10
FROM iso_requirements 
WHERE requirement_code = '4.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Seguridad de instalaciones, máquinas y equipos.', 11
FROM iso_requirements 
WHERE requirement_code = '4.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Gestión de todos los riesgos en SST.', 12
FROM iso_requirements 
WHERE requirement_code = '4.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Control a contratistas.', 13
FROM iso_requirements 
WHERE requirement_code = '4.2.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 4.2.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Identificación de actividades críticas.', 1
FROM iso_requirements 
WHERE requirement_code = '4.2.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Documentación de procedimientos, instructivos, fichas para estas actividades con criterios de SST.', 2
FROM iso_requirements 
WHERE requirement_code = '4.2.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Actualización y uso de documentos  vigentes en lugares de trabajo.', 3
FROM iso_requirements 
WHERE requirement_code = '4.2.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Implementación de procedimientos en  el lugar de trabajo.', 4
FROM iso_requirements 
WHERE requirement_code = '4.2.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Capacitación al personal.', 5
FROM iso_requirements 
WHERE requirement_code = '4.2.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Entrega de procedimientos a los trabajadores.', 6
FROM iso_requirements 
WHERE requirement_code = '4.2.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Conocimiento  del personal sobre procedimientos.', 7
FROM iso_requirements 
WHERE requirement_code = '4.2.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 4.2.4
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Mecanismos estandarizados para realización de inspecciones  en SST.', 1
FROM iso_requirements 
WHERE requirement_code = '4.2.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Alcance sobre todas las áreas, equipos, máquinas, herramientas.', 2
FROM iso_requirements 
WHERE requirement_code = '4.2.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Ejecución de inspecciones según lo programado.', 3
FROM iso_requirements 
WHERE requirement_code = '4.2.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Realización de inspecciones por COPASST, brigada, trabajadores, otros, según corresponda.', 4
FROM iso_requirements 
WHERE requirement_code = '4.2.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Análisis al resultado de las  inspecciones.', 5
FROM iso_requirements 
WHERE requirement_code = '4.2.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Determinación de planes de acción y seguimiento.', 6
FROM iso_requirements 
WHERE requirement_code = '4.2.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 4.2.5
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Mecanismo estandarizado para la realización de mantenimientos preventivos / correctivos.', 1
FROM iso_requirements 
WHERE requirement_code = '4.2.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Criterios de SST para realizar los mantenimientos, teniendo en cuenta manuales de uso.', 2
FROM iso_requirements 
WHERE requirement_code = '4.2.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Lista actualizada de todos las instalaciones, equipos, máquinas y herramientas.', 3
FROM iso_requirements 
WHERE requirement_code = '4.2.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Alcance sobre todas las instalaciones, equipos, máquinas y herramientas.', 4
FROM iso_requirements 
WHERE requirement_code = '4.2.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Ejecución de mantenimientos según lo programado.', 5
FROM iso_requirements 
WHERE requirement_code = '4.2.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Realización de mantenimientos por personal autorizado.', 6
FROM iso_requirements 
WHERE requirement_code = '4.2.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Análisis derivados de los resultados de los mantenimientos por fallas, averías, fugas, limpieza, deterioro, otros.', 7
FROM iso_requirements 
WHERE requirement_code = '4.2.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Determinación de planes de acción y seguimiento.', 8
FROM iso_requirements 
WHERE requirement_code = '4.2.5' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 4.2.6
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Identificación técnica de elementos de protección según riesgos a los que se expone el personal.', 1
FROM iso_requirements 
WHERE requirement_code = '4.2.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Criterios para la selección , mantenimiento y reemplazo de EPP.', 2
FROM iso_requirements 
WHERE requirement_code = '4.2.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Entrega de elementos de protección personal.', 3
FROM iso_requirements 
WHERE requirement_code = '4.2.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Los EPP no son cobrados al personal.', 4
FROM iso_requirements 
WHERE requirement_code = '4.2.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'EPP  de acuerdo a los riesgos del lugar de trabajo.', 5
FROM iso_requirements 
WHERE requirement_code = '4.2.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Uso de EPP por el personal.', 6
FROM iso_requirements 
WHERE requirement_code = '4.2.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Capacitación al personal sobre uso, manejo, almacenamiento, disposición y similar.', 7
FROM iso_requirements 
WHERE requirement_code = '4.2.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Conocimiento del personal.', 8
FROM iso_requirements 
WHERE requirement_code = '4.2.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'GESTIÓN DE AMENAZAS', 9
FROM iso_requirements 
WHERE requirement_code = '4.2.6' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 5.1.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Plan de emergencias documentado.', 1
FROM iso_requirements 
WHERE requirement_code = '5.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Alcance a todos los centros de trabajo, turnos de trabajo y trabajadores.', 2
FROM iso_requirements 
WHERE requirement_code = '5.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Actualización del plan.', 3
FROM iso_requirements 
WHERE requirement_code = '5.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Identificación de amenazas, sismo, terremotos, vendaval, inundación, otros.', 4
FROM iso_requirements 
WHERE requirement_code = '5.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Análisis de vulnerabilidad.', 5
FROM iso_requirements 
WHERE requirement_code = '5.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Procedimientos operativos normalizados.', 6
FROM iso_requirements 
WHERE requirement_code = '5.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Planos de las instalaciones que identifican áreas y salidas de emergencia.', 7
FROM iso_requirements 
WHERE requirement_code = '5.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Señalización, extintores, botiquín, otros.', 8
FROM iso_requirements 
WHERE requirement_code = '5.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Realización y análisis de simulacros.', 9
FROM iso_requirements 
WHERE requirement_code = '5.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Capacitación al trabajador sobre plan de emergencias.', 10
FROM iso_requirements 
WHERE requirement_code = '5.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 5.1.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Conformación de la brigada de emergencias.', 1
FROM iso_requirements 
WHERE requirement_code = '5.1.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Procesos de convocatoria  y conformación.', 2
FROM iso_requirements 
WHERE requirement_code = '5.1.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Vigencia y funcionamiento.', 3
FROM iso_requirements 
WHERE requirement_code = '5.1.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Recursos y tiempo para actividades (Inspecciones, simulacros, otros).', 4
FROM iso_requirements 
WHERE requirement_code = '5.1.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Capacitación  a miembros sobre  deberes, responsabilidades y como responder a emergencias (Incendio , primeros auxilios, evaluación, otros).', 5
FROM iso_requirements 
WHERE requirement_code = '5.1.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Dotación de la brigada de emergencia en función de los peligros y riesgos.', 6
FROM iso_requirements 
WHERE requirement_code = '5.1.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'VERIFICACIÓN DEL SISTEMA DEL SG-SST', 7
FROM iso_requirements 
WHERE requirement_code = '5.1.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 6.1.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Definición de Indicadores Mínimos de SST
  * Frecuencia de la accidentalidad /  Severidad de la accidentalidad /  Mortalidad por Accidentes de Trabajo / Prevalencia de Enfermedad Laboral / Incidencia de Enfermedad Laboral. / Ausentismo por causa médica.
Definición de indicadores del SG-SST que permitan evaluar', 1
FROM iso_requirements 
WHERE requirement_code = '6.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Estructura del SG-SST.', 2
FROM iso_requirements 
WHERE requirement_code = '6.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Proceso del SG-SST.', 3
FROM iso_requirements 
WHERE requirement_code = '6.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Resultado del SG-SST.', 4
FROM iso_requirements 
WHERE requirement_code = '6.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Ficha técnica del indicador.', 5
FROM iso_requirements 
WHERE requirement_code = '6.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Medición del indicador (Según la frecuencia determinada).', 6
FROM iso_requirements 
WHERE requirement_code = '6.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Medición, análisis y planes de acción.', 7
FROM iso_requirements 
WHERE requirement_code = '6.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Comunicación de resultados de indicador.', 8
FROM iso_requirements 
WHERE requirement_code = '6.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 6.1.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Programa de auditorias al SG-SST.', 1
FROM iso_requirements 
WHERE requirement_code = '6.1.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Idoneidad del auditor.', 2
FROM iso_requirements 
WHERE requirement_code = '6.1.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Alcance de auditoria, periodicidad (anual), metodología.', 3
FROM iso_requirements 
WHERE requirement_code = '6.1.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Planeación de auditoria con participación del Copasst  / Vigía de SST', 4
FROM iso_requirements 
WHERE requirement_code = '6.1.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Realización de la auditoria  anual.', 5
FROM iso_requirements 
WHERE requirement_code = '6.1.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Informe.', 6
FROM iso_requirements 
WHERE requirement_code = '6.1.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Análisis de resultados y determinación de acciones correctivas, preventivas  y de mejora.', 7
FROM iso_requirements 
WHERE requirement_code = '6.1.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Comunicación de resultados al personal.', 8
FROM iso_requirements 
WHERE requirement_code = '6.1.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Implementación de acciones de mejora y  su efectividad.', 9
FROM iso_requirements 
WHERE requirement_code = '6.1.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 6.1.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Planeación de la revisión al SG-SST.', 1
FROM iso_requirements 
WHERE requirement_code = '6.1.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Realización de la revisión por la alta dirección al SG-SST (Anual).', 2
FROM iso_requirements 
WHERE requirement_code = '6.1.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Alcance de la revisión gerencial.', 3
FROM iso_requirements 
WHERE requirement_code = '6.1.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Análisis de resultados y determinación de planes de acción.', 4
FROM iso_requirements 
WHERE requirement_code = '6.1.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Comunicación de resultados  de la revisión al personal, Copasst, responsable del sistema, otros.', 5
FROM iso_requirements 
WHERE requirement_code = '6.1.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Suficiencia y capacidad del SG-SST', 6
FROM iso_requirements 
WHERE requirement_code = '6.1.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 6.1.4
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Planeación de la auditoria al SG-SST con participación del COPASST o Vigía de SST.', 1
FROM iso_requirements 
WHERE requirement_code = '6.1.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Comunicación al Copasst  o vigía de SST y al Responsable del SG-SST.
  * Resultados de la revisión por parte de la Alta dirección.
  * Resultados de la auditoría realizada al SG-SST.
  *Los planes de acción derivados de estas revisiones.', 2
FROM iso_requirements 
WHERE requirement_code = '6.1.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'MEJORAMIENTO', 3
FROM iso_requirements 
WHERE requirement_code = '6.1.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 7.1.1
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Resultados del SG-SST (Auditorias, revisiones ,inspecciones, otros) para definir acciones correctivas  y preventivas.', 1
FROM iso_requirements 
WHERE requirement_code = '7.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Documentación de acciones correctivas, preventivas  y de mejora.', 2
FROM iso_requirements 
WHERE requirement_code = '7.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Análisis de causas de las no conformidades.', 3
FROM iso_requirements 
WHERE requirement_code = '7.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Determinación de planes de acción, con responsables y fechas de cumplimiento.', 4
FROM iso_requirements 
WHERE requirement_code = '7.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Comunicación de acciones al personal.', 5
FROM iso_requirements 
WHERE requirement_code = '7.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Implementación de acciones correctivas, preventivas y de mejora.', 6
FROM iso_requirements 
WHERE requirement_code = '7.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Seguimiento de las acciones.', 7
FROM iso_requirements 
WHERE requirement_code = '7.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Efectividad de las acciones.', 8
FROM iso_requirements 
WHERE requirement_code = '7.1.1' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 7.1.2
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Análisis de los resultados derivado de la revisión al SG-SST por la alta dirección.', 1
FROM iso_requirements 
WHERE requirement_code = '7.1.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Definición de acciones correctivas, preventivas  y de mejora.', 2
FROM iso_requirements 
WHERE requirement_code = '7.1.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Implementación de acciones correctivas, preventivas y de mejora.', 3
FROM iso_requirements 
WHERE requirement_code = '7.1.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Comunicación de acciones  al personal.', 4
FROM iso_requirements 
WHERE requirement_code = '7.1.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Seguimiento de las acciones.', 5
FROM iso_requirements 
WHERE requirement_code = '7.1.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Efectividad de las acciones.', 6
FROM iso_requirements 
WHERE requirement_code = '7.1.2' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 7.1.3
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Análisis de los resultados derivado de la investigación de ATEL.', 1
FROM iso_requirements 
WHERE requirement_code = '7.1.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Determinación de causas básicas de los ATEL.', 2
FROM iso_requirements 
WHERE requirement_code = '7.1.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Definición de acciones correctivas, preventivas  y de mejora.', 3
FROM iso_requirements 
WHERE requirement_code = '7.1.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Implementación de acciones correctivas, preventivas  y de mejora.', 4
FROM iso_requirements 
WHERE requirement_code = '7.1.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Comunicación de acciones  al personal.', 5
FROM iso_requirements 
WHERE requirement_code = '7.1.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Seguimiento de las acciones.', 6
FROM iso_requirements 
WHERE requirement_code = '7.1.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Efectividad de las acciones.', 7
FROM iso_requirements 
WHERE requirement_code = '7.1.3' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));

-- Criterios para requisito 7.1.4
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Análisis de  las medidas y acciones correctivas solicitadas por autoridades y ARL.', 1
FROM iso_requirements 
WHERE requirement_code = '7.1.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Determinación de causas básicas.', 2
FROM iso_requirements 
WHERE requirement_code = '7.1.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Definición de acciones correctivas, preventivas  y de mejora.', 3
FROM iso_requirements 
WHERE requirement_code = '7.1.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Implementación de acciones correctivas, preventivas  y de mejora.', 4
FROM iso_requirements 
WHERE requirement_code = '7.1.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Comunicación de acciones  al personal.', 5
FROM iso_requirements 
WHERE requirement_code = '7.1.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Seguimiento de las acciones.', 6
FROM iso_requirements 
WHERE requirement_code = '7.1.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)
SELECT id, 'Efectividad de las acciones.', 7
FROM iso_requirements 
WHERE requirement_code = '7.1.4' 
AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));
