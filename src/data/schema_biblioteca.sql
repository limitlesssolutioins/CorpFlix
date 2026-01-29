-- Schema para Módulo de Biblioteca Virtual
-- Sistema de gestión documental y base de conocimiento

-- =====================================================
-- CATEGORÍAS Y METADATOS
-- =====================================================

-- Categorías de documentos
CREATE TABLE IF NOT EXISTS document_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_name TEXT NOT NULL UNIQUE,
    parent_id INTEGER,
    description TEXT,
    icon TEXT,
    color TEXT,
    FOREIGN KEY (parent_id) REFERENCES document_categories(id)
);

-- Tags para documentos
CREATE TABLE IF NOT EXISTS document_tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tag_name TEXT NOT NULL UNIQUE,
    color TEXT
);

-- =====================================================
-- DOCUMENTOS
-- =====================================================

CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    document_code TEXT UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    category_id INTEGER,
    file_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size INTEGER,
    file_type TEXT,
    mime_type TEXT,
    version TEXT DEFAULT '1.0',
    status TEXT DEFAULT 'PUBLISHED',
    author TEXT,
    uploaded_by TEXT,
    uploaded_by_id INTEGER,
    upload_date DATE DEFAULT CURRENT_DATE,
    last_modified DATE,
    expiry_date DATE,
    views INTEGER DEFAULT 0,
    downloads INTEGER DEFAULT 0,
    is_public INTEGER DEFAULT 1,
    requires_approval INTEGER DEFAULT 0,
    approved_by TEXT,
    approval_date DATE,
    keywords TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES document_categories(id)
);

CREATE INDEX idx_documents_category ON documents(category_id);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_documents_upload_date ON documents(upload_date);

-- Relación documentos-tags
CREATE TABLE IF NOT EXISTS document_tag_relation (
    document_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    PRIMARY KEY (document_id, tag_id),
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES document_tags(id) ON DELETE CASCADE
);

-- Versiones de documentos
CREATE TABLE IF NOT EXISTS document_versions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    document_id INTEGER NOT NULL,
    version_number TEXT NOT NULL,
    file_path TEXT NOT NULL,
    change_description TEXT,
    uploaded_by TEXT,
    upload_date DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
);

-- =====================================================
-- ACCESO Y SEGURIDAD
-- =====================================================

-- Log de accesos a documentos
CREATE TABLE IF NOT EXISTS access_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    document_id INTEGER NOT NULL,
    accessed_by TEXT,
    access_type TEXT,
    access_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address TEXT,
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
);

CREATE INDEX idx_access_logs_document ON access_logs(document_id);
CREATE INDEX idx_access_logs_date ON access_logs(access_date);

-- =====================================================
-- CHATBOT (PLACEHOLDER)
-- =====================================================

-- Conversaciones del chatbot
CREATE TABLE IF NOT EXISTS chatbot_conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    conversation_id TEXT UNIQUE,
    user_id INTEGER,
    user_name TEXT,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active INTEGER DEFAULT 1
);

-- Mensajes del chatbot
CREATE TABLE IF NOT EXISTS chatbot_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    conversation_id TEXT NOT NULL,
    message_text TEXT NOT NULL,
    is_user_message INTEGER NOT NULL,
    cited_documents TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES chatbot_conversations(conversation_id) ON DELETE CASCADE
);

-- =====================================================
-- DATOS INICIALES
-- =====================================================

-- Categorías predefinidas
INSERT OR IGNORE INTO document_categories (category_name, description, icon, color) VALUES
('Normas', 'Normas ISO, estándares internacionales', 'FileCheck', '#3b82f6'),
('Procedimientos', 'Procedimientos operativos y documentados', 'FileText', '#10b981'),
('Políticas', 'Políticas organizacionales', 'Shield', '#8b5cf6'),
('Formatos', 'Formatos y plantillas', 'FileSpreadsheet', '#f59e0b'),
('Referencias', 'Material de referencia y consulta', 'BookOpen', '#06b6d4'),
('Capacitación', 'Material de capacitación y entrenamiento', 'GraduationCap', '#ec4899'),
('Legales', 'Documentos legales y regulatorios', 'Scale', '#ef4444'),
('Técnicos', 'Documentación técnica', 'Wrench', '#22c55e');

-- Tags predefinidos
INSERT OR IGNORE INTO document_tags (tag_name, color) VALUES
('ISO 9001', '#3b82f6'),
('ISO 14001', '#22c55e'),
('ISO 45001', '#ef4444'),
('Calidad', '#3b82f6'),
('Seguridad', '#ef4444'),
('Medio Ambiente', '#22c55e'),
('Urgente', '#f59e0b'),
('Actualizado', '#10b981');
