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
