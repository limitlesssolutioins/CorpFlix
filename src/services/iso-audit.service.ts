import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const SCHEMA_PATH = path.join(process.cwd(), 'src/data/schema_auditoria.sql');

// Types
export interface AuditStandard {
    id: number;
    code: string;
    name: string;
    full_name: string;
    category: string;
    color: string;
    description: string;
    total_requirements?: number;
    total_audits?: number;
}

export interface ISOChapter {
    id?: number;
    standard_id?: number;
    chapter_number: string;
    chapter_title: string;
    description?: string;
}

export interface ISORequirement {
    id?: number;
    chapter_id: number;
    requirement_code: string;
    requirement_title: string;
    requirement_description?: string;
    is_auditable?: number;
    weight?: number;
    profile?: string;
}

export interface Audit {
    id?: number;
    audit_code?: string;
    standard_id?: number;
    audit_type_id?: number;
    audit_date: string;
    planned_date?: string;
    auditor_name?: string;
    auditor_id?: number;
    scope?: string;
    objectives?: string;
    criteria?: string;
    company_profile?: string;
    status?: string;
    created_by?: number;
}

export interface AuditFinding {
    id?: number;
    audit_id: number;
    requirement_id: number;
    finding_type_id: number;
    finding_description?: string;
    evidence?: string;
    observations?: string;
    auditor_notes?: string;
}

export interface BulkFindingItem {
    requirement_id: number;
    finding_type_id: number | null;
    finding_description?: string;
    evidence?: string;
    observations?: string;
    is_op?: number;
    responsible?: string;
}

export interface AuditAuditor {
    id?: number;
    name: string;
    email?: string;
    role?: string;
    area?: string;
    phone?: string;
    status?: string;
}

export interface AuditTeamMember {
    id?: number;
    audit_id: number;
    auditor_id: number;
    role_in_audit?: string;
    name?: string;
    email?: string;
    role?: string;
    area?: string;
}

export interface AuditProgram {
    id?: number;
    standard_id?: number;
    year: number;
    objectives?: string;
    scope?: string;
    criteria?: string;
    resources?: string;
    methodology?: string;
    status?: string;
    approved_by?: string;
    approved_date?: string;
}

export interface AuditPlan {
    id?: number;
    audit_id: number;
    opening_meeting_datetime?: string;
    closing_meeting_datetime?: string;
    location?: string;
    criteria?: string;
    documents_to_review?: string;
    confidentiality?: string;
}

export interface AuditPlanActivity {
    id?: number;
    plan_id?: number;
    activity_date?: string;
    start_time?: string;
    end_time?: string;
    activity: string;
    process_area?: string;
    auditor_ids?: string;
    documents?: string;
    sort_order?: number;
}

export interface CorrectiveAction {
    id?: number;
    finding_id: number;
    action_code?: string;
    root_cause_analysis?: string;
    corrective_action: string;
    responsible?: string;
    responsible_id?: number;
    target_date?: string;
    completion_date?: string;
    status?: string;
    progress?: number;
    notes?: string;
}

class ISOAuditService {
    private db: Database.Database;

    constructor(dataDir: string) {
        const dbPath = path.join(dataDir, 'auditoria.db');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        this.db = new Database(dbPath);
        this.db.pragma('foreign_keys = OFF');
        this.initializeDatabase();
    }

    private initializeDatabase() {
        try {
            const tableExists = this.db
                .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='iso_chapters'")
                .get();

            if (!tableExists) {
                // Fresh database — run full schema
                const schema = fs.readFileSync(SCHEMA_PATH, 'utf-8');
                this.db.exec(schema);
                console.log('✅ Audit database initialized with multi-standard support');
                this.ensureColumns();
                return;
            }

            // Existing database — check if migration needed
            const standardsTableExists = this.db
                .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='audit_standards'")
                .get();

            if (!standardsTableExists) {
                this.runMigration();
            }
            // Always run additive column migrations (safe for both fresh and migrated DBs)
            this.ensureColumns();
        } catch (error) {
            console.error('❌ Error initializing audit database:', error);
            throw error;
        }
    }

    private runMigration() {
        console.log('🔄 Running audit database migration to multi-standard support...');
        this.db.exec('BEGIN TRANSACTION');
        try {
            // 1. Create audit_standards table
            this.db.exec(`
                CREATE TABLE IF NOT EXISTS audit_standards (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    code TEXT NOT NULL UNIQUE,
                    name TEXT NOT NULL,
                    full_name TEXT NOT NULL,
                    category TEXT,
                    color TEXT DEFAULT '#3b82f6',
                    description TEXT
                )
            `);

            // 2. Insert ISO 9001 as standard id=1
            this.db.exec(`
                INSERT OR IGNORE INTO audit_standards (code, name, full_name, category, color, description) VALUES
                ('ISO9001', 'ISO 9001:2015', 'ISO 9001:2015 - Sistemas de Gestión de la Calidad', 'Calidad', '#3b82f6', 'Establece los requisitos para un sistema de gestión de la calidad.'),
                ('ISO14001', 'ISO 14001:2015', 'ISO 14001:2015 - Sistemas de Gestión Ambiental', 'Medio Ambiente', '#10b981', 'Marco para proteger el medio ambiente.'),
                ('ISO45001', 'ISO 45001:2018', 'ISO 45001:2018 - Sistemas de Gestión de SST', 'Seguridad y Salud en el Trabajo', '#f59e0b', 'Requisitos para un sistema de gestión de SST.'),
                ('RES0312', 'Res. 0312:2019', 'Resolución 0312:2019 - Estándares Mínimos SST Colombia', 'Seguridad y Salud en el Trabajo', '#ef4444', 'Estándares mínimos del SG-SST en Colombia.'),
                ('ISO27001', 'ISO 27001:2022', 'ISO 27001:2022 - Sistemas de Gestión de Seguridad de la Información', 'Seguridad de la Información', '#8b5cf6', 'Requisitos para un SGSI.'),
                ('ISO39001', 'ISO 39001:2012', 'ISO 39001:2012 - Sistemas de Gestión de la Seguridad Vial', 'Seguridad Vial', '#06b6d4', 'Requisitos de un sistema de gestión de seguridad vial.')
            `);

            // 3. Rebuild iso_chapters with standard_id support
            this.db.exec(`
                CREATE TABLE iso_chapters_new (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    standard_id INTEGER NOT NULL DEFAULT 1,
                    chapter_number TEXT NOT NULL,
                    chapter_title TEXT NOT NULL,
                    description TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE(standard_id, chapter_number),
                    FOREIGN KEY (standard_id) REFERENCES audit_standards(id)
                )
            `);
            this.db.exec(`
                INSERT INTO iso_chapters_new (id, standard_id, chapter_number, chapter_title, description, created_at)
                SELECT id, 1, chapter_number, chapter_title, description, created_at FROM iso_chapters
            `);
            this.db.exec('DROP TABLE iso_chapters');
            this.db.exec('ALTER TABLE iso_chapters_new RENAME TO iso_chapters');
            this.db.exec('CREATE INDEX IF NOT EXISTS idx_chapters_standard ON iso_chapters(standard_id)');

            // 4. Rebuild iso_requirements with weight/profile and new UNIQUE constraint
            this.db.exec(`
                CREATE TABLE iso_requirements_new (
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
                )
            `);
            this.db.exec(`
                INSERT INTO iso_requirements_new (id, chapter_id, requirement_code, requirement_title, requirement_description, is_auditable, created_at)
                SELECT id, chapter_id, requirement_code, requirement_title, requirement_description, is_auditable, created_at FROM iso_requirements
            `);
            this.db.exec('DROP TABLE iso_requirements');
            this.db.exec('ALTER TABLE iso_requirements_new RENAME TO iso_requirements');
            this.db.exec('CREATE INDEX IF NOT EXISTS idx_requirements_chapter ON iso_requirements(chapter_id)');

            // 5. Add standard_id and company_profile to audits
            const auditCols = this.db.prepare("PRAGMA table_info(audits)").all() as any[];
            const hasStandardId = auditCols.some(c => c.name === 'standard_id');
            const hasCompanyProfile = auditCols.some(c => c.name === 'company_profile');
            if (!hasStandardId) {
                this.db.exec('ALTER TABLE audits ADD COLUMN standard_id INTEGER DEFAULT 1');
                this.db.exec('UPDATE audits SET standard_id = 1');
            }
            if (!hasCompanyProfile) {
                this.db.exec('ALTER TABLE audits ADD COLUMN company_profile TEXT');
            }

            // 6. Add UNIQUE constraint to audit_findings (audit_id, requirement_id) if not there
            // SQLite doesn't support DROP CONSTRAINT, so we rebuild if needed
            const findingsInfo = this.db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='audit_findings'").get() as any;
            if (findingsInfo && !findingsInfo.sql.includes('UNIQUE(audit_id')) {
                this.db.exec(`
                    CREATE TABLE audit_findings_new (
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
                    )
                `);
                this.db.exec(`
                    INSERT OR IGNORE INTO audit_findings_new
                    SELECT * FROM audit_findings
                `);
                this.db.exec('DROP TABLE audit_findings');
                this.db.exec('ALTER TABLE audit_findings_new RENAME TO audit_findings');
                this.db.exec('CREATE INDEX IF NOT EXISTS idx_findings_audit ON audit_findings(audit_id)');
                this.db.exec('CREATE INDEX IF NOT EXISTS idx_findings_type ON audit_findings(finding_type_id)');
            }

            // 7. Insert new standards data from schema
            const schema = fs.readFileSync(SCHEMA_PATH, 'utf-8');
            // Extract only the INSERT statements for new standards (after ISO 9001)
            const insertSection = schema.substring(schema.indexOf('-- ISO 14001:2015'));
            if (insertSection) {
                // Run only the INSERT OR IGNORE statements (safe to run on existing data)
                const insertStatements = insertSection.match(/INSERT OR IGNORE INTO[\s\S]+?;/g);
                if (insertStatements) {
                    for (const stmt of insertStatements) {
                        try {
                            this.db.exec(stmt);
                        } catch (e) {
                            // Ignore individual insert errors (duplicates, etc.)
                        }
                    }
                }
            }

            this.db.exec('COMMIT');
            console.log('✅ Migration completed successfully');
        } catch (error) {
            this.db.exec('ROLLBACK');
            console.error('❌ Migration failed:', error);
            throw error;
        }
    }

    private ensureISO9001SubRequirements() {
        // Check if sub-requirements already exist (use 4.4.1 as sentinel)
        const std = this.db.prepare("SELECT id FROM audit_standards WHERE code='ISO9001'").get() as any;
        if (!std) return;

        const chapter4 = this.db.prepare("SELECT id FROM iso_chapters WHERE standard_id=? AND chapter_number='4'").get(std.id) as any;
        if (!chapter4) return;

        const alreadyHasSub = this.db.prepare("SELECT id FROM iso_requirements WHERE chapter_id=? AND requirement_code='4.4.1'").get(chapter4.id);
        if (alreadyHasSub) return; // Already migrated

        console.log('🔄 Adding ISO 9001 sub-requirements (3-level hierarchy)...');

        // Mark parent requirements as non-auditable where they have sub-items
        const parentCodes = ['4.4','5.1','5.2','6.1','6.2','7.1','7.5','8.2','8.3','8.4','8.5','8.7','9.1','9.2','9.3','10.2'];
        const placeholders = parentCodes.map(() => '?').join(',');
        const chapters = this.db.prepare(`SELECT id FROM iso_chapters WHERE standard_id=?`).all(std.id) as any[];
        const chapterIds = chapters.map(c => c.id);
        if (chapterIds.length > 0) {
            const chPlaceholders = chapterIds.map(() => '?').join(',');
            this.db.prepare(`UPDATE iso_requirements SET is_auditable=0 WHERE chapter_id IN (${chPlaceholders}) AND requirement_code IN (${placeholders})`).run(...chapterIds, ...parentCodes);
        }

        // Helper to get chapter id
        const getChapterId = (num: string) => {
            const ch = this.db.prepare("SELECT id FROM iso_chapters WHERE standard_id=? AND chapter_number=?").get(std.id, num) as any;
            return ch?.id;
        };

        const insertReq = this.db.prepare(`INSERT OR IGNORE INTO iso_requirements (chapter_id, requirement_code, requirement_title, is_auditable) VALUES (?, ?, ?, ?)`);

        this.db.transaction(() => {
            const ch4 = getChapterId('4');
            const ch5 = getChapterId('5');
            const ch6 = getChapterId('6');
            const ch7 = getChapterId('7');
            const ch8 = getChapterId('8');
            const ch9 = getChapterId('9');
            const ch10 = getChapterId('10');

            const rows: [number, string, string, number][] = [
                // Cap 4
                [ch4, '4.4.1', 'SGC — Establecer, implementar, mantener y mejorar procesos', 1],
                [ch4, '4.4.2', 'SGC — Información documentada de procesos', 1],
                // Cap 5
                [ch5, '5.1.1', 'Liderazgo y compromiso para el SGC', 1],
                [ch5, '5.1.2', 'Enfoque al cliente', 1],
                [ch5, '5.2.1', 'Desarrollar la política de la calidad', 1],
                [ch5, '5.2.2', 'Comunicar la política de la calidad', 1],
                // Cap 6
                [ch6, '6.1.1', 'Riesgos y oportunidades — Generalidades', 1],
                [ch6, '6.1.2', 'Planificación de acciones ante riesgos y oportunidades', 1],
                [ch6, '6.2.1', 'Objetivos de la calidad', 1],
                [ch6, '6.2.2', 'Planificación para lograr los objetivos de la calidad', 1],
                // Cap 7
                [ch7, '7.1.1', 'Recursos — Generalidades', 1],
                [ch7, '7.1.2', 'Personas', 1],
                [ch7, '7.1.3', 'Infraestructura', 1],
                [ch7, '7.1.4', 'Ambiente para la operación de los procesos', 1],
                [ch7, '7.1.5', 'Recursos de seguimiento y medición', 0],
                [ch7, '7.1.5.1', 'Recursos de seguimiento y medición — Generalidades', 1],
                [ch7, '7.1.5.2', 'Trazabilidad de las mediciones', 1],
                [ch7, '7.1.6', 'Conocimientos de la organización', 1],
                [ch7, '7.5.1', 'Información documentada — Generalidades', 1],
                [ch7, '7.5.2', 'Creación y actualización de información documentada', 1],
                [ch7, '7.5.3', 'Control de la información documentada', 0],
                [ch7, '7.5.3.1', 'Control de información documentada — Controles requeridos', 1],
                [ch7, '7.5.3.2', 'Control de información documentada — Actividades de control', 1],
                // Cap 8
                [ch8, '8.2.1', 'Comunicación con el cliente', 1],
                [ch8, '8.2.2', 'Determinación de los requisitos para los productos y servicios', 1],
                [ch8, '8.2.3', 'Revisión de los requisitos para los productos y servicios', 0],
                [ch8, '8.2.3.1', 'Revisión de requisitos — Capacidad de cumplimiento', 1],
                [ch8, '8.2.3.2', 'Revisión de requisitos — Información documentada', 1],
                [ch8, '8.2.4', 'Cambios en los requisitos para los productos y servicios', 1],
                [ch8, '8.3.1', 'Diseño y desarrollo — Generalidades', 1],
                [ch8, '8.3.2', 'Planificación del diseño y desarrollo', 1],
                [ch8, '8.3.3', 'Elementos de entrada del diseño y desarrollo', 1],
                [ch8, '8.3.4', 'Controles del diseño y desarrollo', 1],
                [ch8, '8.3.5', 'Elementos de salida del diseño y desarrollo', 1],
                [ch8, '8.3.6', 'Cambios del diseño y desarrollo', 1],
                [ch8, '8.4.1', 'Control de proveedores externos — Generalidades', 1],
                [ch8, '8.4.2', 'Tipo y alcance del control de la provisión externa', 1],
                [ch8, '8.4.3', 'Información para los proveedores externos', 1],
                [ch8, '8.5.1', 'Control de la producción y de la prestación del servicio', 1],
                [ch8, '8.5.2', 'Identificación y trazabilidad', 1],
                [ch8, '8.5.3', 'Propiedad perteneciente a los clientes o proveedores externos', 1],
                [ch8, '8.5.4', 'Preservación', 1],
                [ch8, '8.5.5', 'Actividades posteriores a la entrega', 1],
                [ch8, '8.5.6', 'Control de los cambios en la producción', 1],
                [ch8, '8.7.1', 'Salidas no conformes — Identificación y control', 1],
                [ch8, '8.7.2', 'Salidas no conformes — Información documentada', 1],
                // Cap 9
                [ch9, '9.1.1', 'Seguimiento, medición, análisis y evaluación — Generalidades', 1],
                [ch9, '9.1.2', 'Satisfacción del cliente', 1],
                [ch9, '9.1.3', 'Análisis y evaluación', 1],
                [ch9, '9.2.1', 'Auditoría interna — Programa', 1],
                [ch9, '9.2.2', 'Auditoría interna — Realización', 1],
                [ch9, '9.3.1', 'Revisión por la dirección — Generalidades', 1],
                [ch9, '9.3.2', 'Entradas de la revisión por la dirección', 1],
                [ch9, '9.3.3', 'Salidas de la revisión por la dirección', 1],
                // Cap 10
                [ch10, '10.2.1', 'No conformidad y acción correctiva — Respuesta y tratamiento', 1],
                [ch10, '10.2.2', 'No conformidad y acción correctiva — Información documentada', 1],
            ];

            for (const [chapterId, code, title, auditable] of rows) {
                if (chapterId) insertReq.run(chapterId, code, title, auditable);
            }
        })();

        console.log('✅ ISO 9001 sub-requirements added');
    }

    private ensureColumns() {
        const findingCols = this.db.prepare("PRAGMA table_info(audit_findings)").all() as any[];
        if (!findingCols.some(c => c.name === 'is_op')) {
            this.db.exec('ALTER TABLE audit_findings ADD COLUMN is_op INTEGER DEFAULT 0');
            console.log('✅ Added is_op column to audit_findings');
        }
        if (!findingCols.some(c => c.name === 'responsible')) {
            this.db.exec('ALTER TABLE audit_findings ADD COLUMN responsible TEXT');
            console.log('✅ Added responsible column to audit_findings');
        }
        const auditCols = this.db.prepare("PRAGMA table_info(audits)").all() as any[];
        if (!auditCols.some(c => c.name === 'criteria')) {
            this.db.exec('ALTER TABLE audits ADD COLUMN criteria TEXT');
            console.log('✅ Added criteria column to audits');
        }
        // Ensure ISO 9001 sub-requirements exist (3-level hierarchy from Excel)
        this.ensureISO9001SubRequirements();

        // Ensure requirement variables tables
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS requirement_variables (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                requirement_id INTEGER NOT NULL,
                variable_text TEXT NOT NULL,
                variable_order INTEGER DEFAULT 0,
                FOREIGN KEY (requirement_id) REFERENCES iso_requirements(id) ON DELETE CASCADE
            );
            CREATE TABLE IF NOT EXISTS finding_variable_answers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                audit_id INTEGER NOT NULL,
                requirement_id INTEGER NOT NULL,
                variable_id INTEGER NOT NULL,
                answer TEXT DEFAULT NULL,
                UNIQUE(audit_id, requirement_id, variable_id),
                FOREIGN KEY (audit_id) REFERENCES audits(id) ON DELETE CASCADE,
                FOREIGN KEY (variable_id) REFERENCES requirement_variables(id) ON DELETE CASCADE
            );
        `);

        // Ensure new tables exist (additive, safe to run on existing DBs)
        this.db.exec(`
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
            CREATE TABLE IF NOT EXISTS audit_team (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                audit_id INTEGER NOT NULL,
                auditor_id INTEGER NOT NULL,
                role_in_audit TEXT DEFAULT 'Auditor',
                UNIQUE(audit_id, auditor_id),
                FOREIGN KEY (audit_id) REFERENCES audits(id) ON DELETE CASCADE,
                FOREIGN KEY (auditor_id) REFERENCES audit_auditors(id) ON DELETE CASCADE
            );
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
        `);
    }

    // ===================================================
    // STANDARDS
    // ===================================================

    getAllStandards(): AuditStandard[] {
        return this.db.prepare(`
            SELECT s.*,
                (SELECT COUNT(*) FROM iso_requirements r
                 INNER JOIN iso_chapters c ON r.chapter_id = c.id
                 WHERE c.standard_id = s.id AND r.is_auditable = 1) as total_requirements,
                (SELECT COUNT(*) FROM audits WHERE standard_id = s.id) as total_audits
            FROM audit_standards s
            ORDER BY s.id
        `).all() as AuditStandard[];
    }

    getStandardByCode(code: string): AuditStandard | undefined {
        return this.db.prepare(`
            SELECT s.*,
                (SELECT COUNT(*) FROM iso_requirements r
                 INNER JOIN iso_chapters c ON r.chapter_id = c.id
                 WHERE c.standard_id = s.id AND r.is_auditable = 1) as total_requirements,
                (SELECT COUNT(*) FROM audits WHERE standard_id = s.id) as total_audits
            FROM audit_standards s WHERE s.code = ?
        `).get(code) as AuditStandard | undefined;
    }

    getStandardById(id: number): AuditStandard | undefined {
        return this.db.prepare('SELECT * FROM audit_standards WHERE id = ?').get(id) as AuditStandard | undefined;
    }

    // ===================================================
    // ISO STRUCTURE
    // ===================================================

    getAllChapters(): ISOChapter[] {
        // Legacy: returns only ISO 9001 chapters
        const std = this.db.prepare("SELECT id FROM audit_standards WHERE code='ISO9001'").get() as any;
        if (std) {
            return this.db.prepare('SELECT * FROM iso_chapters WHERE standard_id = ? ORDER BY chapter_number').all(std.id) as ISOChapter[];
        }
        return this.db.prepare('SELECT * FROM iso_chapters WHERE standard_id = 1 ORDER BY chapter_number').all() as ISOChapter[];
    }

    getChaptersByStandard(standardId: number): ISOChapter[] {
        return this.db.prepare('SELECT * FROM iso_chapters WHERE standard_id = ? ORDER BY chapter_number').all(standardId) as ISOChapter[];
    }

    getChapterById(id: number): ISOChapter | undefined {
        return this.db.prepare('SELECT * FROM iso_chapters WHERE id = ?').get(id) as ISOChapter | undefined;
    }

    getRequirementsByChapter(chapterId: number): ISORequirement[] {
        return this.db.prepare('SELECT * FROM iso_requirements WHERE chapter_id = ? AND is_auditable = 1 ORDER BY requirement_code').all(chapterId) as ISORequirement[];
    }

    getAllRequirements(): ISORequirement[] {
        return this.db.prepare('SELECT * FROM iso_requirements WHERE is_auditable = 1 ORDER BY requirement_code').all() as ISORequirement[];
    }

    // ===================================================
    // AUDITS
    // ===================================================

    getAllAudits(filters?: { status?: string; year?: number; standard_id?: number }): any[] {
        let query = `SELECT a.*, at.type_name as audit_type_name, s.name as standard_name, s.code as standard_code, s.color as standard_color
            FROM audits a
            LEFT JOIN audit_types at ON a.audit_type_id = at.id
            LEFT JOIN audit_standards s ON a.standard_id = s.id
            WHERE 1=1`;
        const params: any[] = [];

        if (filters?.status) {
            query += ' AND a.status = ?';
            params.push(filters.status);
        }
        if (filters?.year) {
            query += ` AND strftime('%Y', a.audit_date) = ?`;
            params.push(filters.year.toString());
        }
        if (filters?.standard_id) {
            query += ' AND a.standard_id = ?';
            params.push(filters.standard_id);
        }

        query += ' ORDER BY a.audit_date DESC';
        return this.db.prepare(query).all(...params);
    }

    getAuditById(id: number): any {
        return this.db.prepare(`
            SELECT a.*, at.type_name as audit_type_name, s.name as standard_name, s.code as standard_code, s.color as standard_color
            FROM audits a
            LEFT JOIN audit_types at ON a.audit_type_id = at.id
            LEFT JOIN audit_standards s ON a.standard_id = s.id
            WHERE a.id = ?
        `).get(id);
    }

    createAudit(audit: Audit): any {
        const code = audit.audit_code || `AUD-${Date.now()}`;
        const stmt = this.db.prepare(`
            INSERT INTO audits (audit_code, standard_id, audit_type_id, audit_date, planned_date, auditor_name, scope, objectives, criteria, company_profile, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        const result = stmt.run(
            code,
            audit.standard_id || 1,
            audit.audit_type_id || null,
            audit.audit_date,
            audit.planned_date || null,
            audit.auditor_name || null,
            audit.scope || null,
            audit.objectives || null,
            audit.criteria || null,
            audit.company_profile || null,
            audit.status || 'PLANNED'
        );
        return this.getAuditById(result.lastInsertRowid as number);
    }

    updateAudit(id: number, audit: Partial<Audit>): any | null {
        const existing = this.getAuditById(id);
        if (!existing) return null;
        const stmt = this.db.prepare(`
            UPDATE audits SET standard_id=?, audit_type_id=?, audit_date=?, planned_date=?, auditor_name=?, scope=?, objectives=?, criteria=?, company_profile=?, status=?, updated_at=CURRENT_TIMESTAMP
            WHERE id=?
        `);
        stmt.run(
            audit.standard_id ?? existing.standard_id,
            audit.audit_type_id ?? existing.audit_type_id,
            audit.audit_date ?? existing.audit_date,
            audit.planned_date ?? existing.planned_date,
            audit.auditor_name ?? existing.auditor_name,
            audit.scope ?? existing.scope,
            audit.objectives ?? existing.objectives,
            audit.criteria ?? existing.criteria,
            audit.company_profile ?? existing.company_profile,
            audit.status ?? existing.status,
            id
        );
        return this.getAuditById(id);
    }

    // ===================================================
    // FINDINGS
    // ===================================================

    getFindingsByAudit(auditId: number): any[] {
        return this.db.prepare(`
            SELECT af.*, ft.type_name as finding_type_name, ft.color as finding_color,
                req.requirement_code, req.requirement_title, req.weight,
                ch.chapter_number, ch.chapter_title
            FROM audit_findings af
            INNER JOIN finding_types ft ON af.finding_type_id = ft.id
            INNER JOIN iso_requirements req ON af.requirement_id = req.id
            INNER JOIN iso_chapters ch ON req.chapter_id = ch.id
            WHERE af.audit_id = ?
            ORDER BY req.requirement_code
        `).all(auditId);
    }

    getBulkFindings(auditId: number): any[] {
        const audit = this.getAuditById(auditId);
        if (!audit) return [];

        const profile = audit.company_profile;
        let reqQuery = `
            SELECT req.*, ch.chapter_number, ch.chapter_title, ch.standard_id,
                af.id as finding_id, af.finding_type_id, af.finding_description, af.evidence, af.observations, af.is_op, af.responsible,
                ft.type_name as finding_type_name, ft.color as finding_color, ft.type_code, ft.requires_action
            FROM iso_requirements req
            INNER JOIN iso_chapters ch ON req.chapter_id = ch.id
            LEFT JOIN audit_findings af ON af.requirement_id = req.id AND af.audit_id = ?
            LEFT JOIN finding_types ft ON af.finding_type_id = ft.id
            WHERE ch.standard_id = ?
        `;
        const params: any[] = [auditId, audit.standard_id];

        if (profile) {
            reqQuery += ' AND (req.profile IS NULL OR req.profile = ?)';
            params.push(profile);
        }
        reqQuery += ' ORDER BY req.requirement_code';

        return this.db.prepare(reqQuery).all(...params);
    }

    saveBulkFindings(auditId: number, findings: BulkFindingItem[]): { saved: number; actionsCreated: number } {
        const upsert = this.db.prepare(`
            INSERT INTO audit_findings (audit_id, requirement_id, finding_type_id, finding_description, evidence, observations, is_op, responsible)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(audit_id, requirement_id) DO UPDATE SET
                finding_type_id = excluded.finding_type_id,
                finding_description = excluded.finding_description,
                evidence = excluded.evidence,
                observations = excluded.observations,
                is_op = excluded.is_op,
                responsible = excluded.responsible
        `);

        const deleteFind = this.db.prepare('DELETE FROM audit_findings WHERE audit_id = ? AND requirement_id = ?');

        const getFindingType = this.db.prepare('SELECT requires_action FROM finding_types WHERE id = ?');
        const getExistingAction = this.db.prepare('SELECT id FROM corrective_actions WHERE finding_id = ?');

        let saved = 0;
        let actionsCreated = 0;

        const runBulk = this.db.transaction(() => {
            for (const f of findings) {
                if (f.finding_type_id === null) {
                    // Clear the finding for this requirement
                    const existing = this.db.prepare('SELECT id FROM audit_findings WHERE audit_id = ? AND requirement_id = ?').get(auditId, f.requirement_id) as any;
                    if (existing) {
                        deleteFind.run(auditId, f.requirement_id);
                    }
                    continue;
                }

                upsert.run(
                    auditId,
                    f.requirement_id,
                    f.finding_type_id,
                    f.finding_description || null,
                    f.evidence || null,
                    f.observations || null,
                    f.is_op ?? 0,
                    f.responsible || null
                );
                saved++;

                // Auto-create corrective action for NC findings if not already exists
                const findingRow = this.db.prepare('SELECT id FROM audit_findings WHERE audit_id = ? AND requirement_id = ?').get(auditId, f.requirement_id) as any;
                if (findingRow) {
                    const ft = getFindingType.get(f.finding_type_id) as any;
                    if (ft && ft.requires_action === 1) {
                        const existingAction = getExistingAction.get(findingRow.id) as any;
                        if (!existingAction) {
                            this.createCorrectiveAction({
                                finding_id: findingRow.id,
                                corrective_action: 'Pendiente de definir',
                                status: 'OPEN'
                            });
                            actionsCreated++;
                        }
                    }
                }
            }
        });

        runBulk();
        return { saved, actionsCreated };
    }

    createFinding(finding: AuditFinding): any {
        const stmt = this.db.prepare(`
            INSERT INTO audit_findings (audit_id, requirement_id, finding_type_id, finding_description, evidence, observations, auditor_notes)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(audit_id, requirement_id) DO UPDATE SET
                finding_type_id = excluded.finding_type_id,
                finding_description = excluded.finding_description,
                evidence = excluded.evidence,
                observations = excluded.observations,
                auditor_notes = excluded.auditor_notes
        `);
        const result = stmt.run(
            finding.audit_id, finding.requirement_id, finding.finding_type_id,
            finding.finding_description || null, finding.evidence || null,
            finding.observations || null, finding.auditor_notes || null
        );
        const findingType = this.db.prepare('SELECT requires_action FROM finding_types WHERE id = ?').get(finding.finding_type_id) as any;
        if (findingType && findingType.requires_action === 1) {
            const findingId = result.lastInsertRowid as number;
            const existingAction = this.db.prepare('SELECT id FROM corrective_actions WHERE finding_id = ?').get(findingId) as any;
            if (!existingAction) {
                this.createCorrectiveAction({ finding_id: findingId, corrective_action: 'Pendiente de definir', status: 'OPEN' });
            }
        }
        return this.db.prepare('SELECT * FROM audit_findings WHERE id = ?').get(result.lastInsertRowid);
    }

    // ===================================================
    // CORRECTIVE ACTIONS
    // ===================================================

    getAllCorrectiveActions(filters?: { status?: string }): any[] {
        let query = `
            SELECT ca.*, af.finding_description, ft.type_name as finding_type,
                req.requirement_code, ch.chapter_title, a.audit_code, s.name as standard_name
            FROM corrective_actions ca
            INNER JOIN audit_findings af ON ca.finding_id = af.id
            INNER JOIN finding_types ft ON af.finding_type_id = ft.id
            INNER JOIN iso_requirements req ON af.requirement_id = req.id
            INNER JOIN iso_chapters ch ON req.chapter_id = ch.id
            INNER JOIN audits a ON af.audit_id = a.id
            LEFT JOIN audit_standards s ON a.standard_id = s.id
            WHERE 1=1
        `;
        const params: any[] = [];
        if (filters?.status) {
            query += ' AND ca.status = ?';
            params.push(filters.status);
        }
        query += ' ORDER BY ca.target_date ASC NULLS LAST';
        return this.db.prepare(query).all(...params);
    }

    createCorrectiveAction(action: CorrectiveAction): any {
        const code = action.action_code || `AC-${Date.now()}`;
        const stmt = this.db.prepare(`
            INSERT INTO corrective_actions (finding_id, action_code, root_cause_analysis, corrective_action, responsible, target_date, status, progress)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        const result = stmt.run(
            action.finding_id, code, action.root_cause_analysis || null,
            action.corrective_action, action.responsible || null,
            action.target_date || null, action.status || 'OPEN', action.progress || 0
        );
        return this.db.prepare('SELECT * FROM corrective_actions WHERE id = ?').get(result.lastInsertRowid);
    }

    updateCorrectiveAction(id: number, action: Partial<CorrectiveAction>): any | null {
        const existing = this.db.prepare('SELECT * FROM corrective_actions WHERE id = ?').get(id) as CorrectiveAction | undefined;
        if (!existing) return null;
        const stmt = this.db.prepare(`
            UPDATE corrective_actions SET root_cause_analysis=?, corrective_action=?, responsible=?, target_date=?, completion_date=?, status=?, progress=?, notes=?, updated_at=CURRENT_TIMESTAMP
            WHERE id=?
        `);
        stmt.run(
            action.root_cause_analysis ?? existing.root_cause_analysis,
            action.corrective_action ?? existing.corrective_action,
            action.responsible ?? existing.responsible,
            action.target_date ?? existing.target_date,
            action.completion_date ?? existing.completion_date,
            action.status ?? existing.status,
            action.progress ?? existing.progress,
            action.notes ?? existing.notes,
            id
        );
        return this.db.prepare('SELECT * FROM corrective_actions WHERE id = ?').get(id);
    }

    // ===================================================
    // AUDITORS DIRECTORY
    // ===================================================

    getAuditors(): AuditAuditor[] {
        return this.db.prepare('SELECT * FROM audit_auditors ORDER BY name').all() as AuditAuditor[];
    }

    createAuditor(data: AuditAuditor): AuditAuditor {
        const result = this.db.prepare(`
            INSERT INTO audit_auditors (name, email, role, area, phone, status)
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(
            data.name,
            data.email || null,
            data.role || 'Auditor',
            data.area || null,
            data.phone || null,
            data.status || 'ACTIVE'
        );
        return this.db.prepare('SELECT * FROM audit_auditors WHERE id = ?').get(result.lastInsertRowid) as AuditAuditor;
    }

    updateAuditor(id: number, data: Partial<AuditAuditor>): AuditAuditor | null {
        const existing = this.db.prepare('SELECT * FROM audit_auditors WHERE id = ?').get(id) as AuditAuditor | undefined;
        if (!existing) return null;
        this.db.prepare(`
            UPDATE audit_auditors SET name=?, email=?, role=?, area=?, phone=?, status=? WHERE id=?
        `).run(
            data.name ?? existing.name,
            data.email ?? existing.email,
            data.role ?? existing.role,
            data.area ?? existing.area,
            data.phone ?? existing.phone,
            data.status ?? existing.status,
            id
        );
        return this.db.prepare('SELECT * FROM audit_auditors WHERE id = ?').get(id) as AuditAuditor;
    }

    deleteAuditor(id: number): { success: boolean; reason?: string } {
        const inUse = this.db.prepare('SELECT COUNT(*) as count FROM audit_team WHERE auditor_id = ?').get(id) as any;
        if (inUse.count > 0) {
            return { success: false, reason: 'El auditor está asignado a una o más auditorías.' };
        }
        this.db.prepare('DELETE FROM audit_auditors WHERE id = ?').run(id);
        return { success: true };
    }

    // ===================================================
    // AUDIT TEAM
    // ===================================================

    getAuditTeam(auditId: number): AuditTeamMember[] {
        return this.db.prepare(`
            SELECT at.*, aa.name, aa.email, aa.role, aa.area
            FROM audit_team at
            INNER JOIN audit_auditors aa ON at.auditor_id = aa.id
            WHERE at.audit_id = ?
            ORDER BY aa.name
        `).all(auditId) as AuditTeamMember[];
    }

    setAuditTeam(auditId: number, members: { auditorId: number; roleInAudit?: string }[]): void {
        const deleteStmt = this.db.prepare('DELETE FROM audit_team WHERE audit_id = ?');
        const insertStmt = this.db.prepare('INSERT OR IGNORE INTO audit_team (audit_id, auditor_id, role_in_audit) VALUES (?, ?, ?)');
        this.db.transaction(() => {
            deleteStmt.run(auditId);
            for (const m of members) {
                insertStmt.run(auditId, m.auditorId, m.roleInAudit || 'Auditor');
            }
        })();
    }

    // ===================================================
    // AUDIT PROGRAMS
    // ===================================================

    getPrograms(standardId?: number, year?: number): AuditProgram[] {
        let query = 'SELECT * FROM audit_programs WHERE 1=1';
        const params: any[] = [];
        if (standardId) { query += ' AND standard_id = ?'; params.push(standardId); }
        if (year) { query += ' AND year = ?'; params.push(year); }
        query += ' ORDER BY year DESC, id DESC';
        return this.db.prepare(query).all(...params) as AuditProgram[];
    }

    createProgram(data: AuditProgram): AuditProgram {
        const result = this.db.prepare(`
            INSERT INTO audit_programs (standard_id, year, objectives, scope, criteria, resources, methodology, status, approved_by, approved_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            data.standard_id || null, data.year,
            data.objectives || null, data.scope || null, data.criteria || null,
            data.resources || null, data.methodology || null,
            data.status || 'DRAFT', data.approved_by || null, data.approved_date || null
        );
        return this.db.prepare('SELECT * FROM audit_programs WHERE id = ?').get(result.lastInsertRowid) as AuditProgram;
    }

    updateProgram(id: number, data: Partial<AuditProgram>): AuditProgram | null {
        const existing = this.db.prepare('SELECT * FROM audit_programs WHERE id = ?').get(id) as AuditProgram | undefined;
        if (!existing) return null;
        this.db.prepare(`
            UPDATE audit_programs SET objectives=?, scope=?, criteria=?, resources=?, methodology=?,
            status=?, approved_by=?, approved_date=?, updated_at=CURRENT_TIMESTAMP WHERE id=?
        `).run(
            data.objectives ?? existing.objectives,
            data.scope ?? existing.scope,
            data.criteria ?? existing.criteria,
            data.resources ?? existing.resources,
            data.methodology ?? existing.methodology,
            data.status ?? existing.status,
            data.approved_by ?? existing.approved_by,
            data.approved_date ?? existing.approved_date,
            id
        );
        return this.db.prepare('SELECT * FROM audit_programs WHERE id = ?').get(id) as AuditProgram;
    }

    // ===================================================
    // AUDIT PLANS
    // ===================================================

    getAuditPlan(auditId: number): { plan: AuditPlan | null; activities: AuditPlanActivity[] } {
        const plan = this.db.prepare('SELECT * FROM audit_plans WHERE audit_id = ?').get(auditId) as AuditPlan | null;
        if (!plan) return { plan: null, activities: [] };
        const activities = this.db.prepare('SELECT * FROM audit_plan_activities WHERE plan_id = ? ORDER BY sort_order, id').all((plan as any).id) as AuditPlanActivity[];
        return { plan, activities };
    }

    saveAuditPlan(auditId: number, planData: Partial<AuditPlan>, activities: Omit<AuditPlanActivity, 'id' | 'plan_id'>[]): { plan: AuditPlan; activities: AuditPlanActivity[] } {
        let planId: number;
        const existing = this.db.prepare('SELECT id FROM audit_plans WHERE audit_id = ?').get(auditId) as any;

        if (existing) {
            planId = existing.id;
            this.db.prepare(`
                UPDATE audit_plans SET opening_meeting_datetime=?, closing_meeting_datetime=?, location=?,
                criteria=?, documents_to_review=?, confidentiality=?, updated_at=CURRENT_TIMESTAMP
                WHERE id=?
            `).run(
                planData.opening_meeting_datetime || null,
                planData.closing_meeting_datetime || null,
                planData.location || null,
                planData.criteria || null,
                planData.documents_to_review || null,
                planData.confidentiality || null,
                planId
            );
        } else {
            const result = this.db.prepare(`
                INSERT INTO audit_plans (audit_id, opening_meeting_datetime, closing_meeting_datetime, location, criteria, documents_to_review, confidentiality)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `).run(
                auditId,
                planData.opening_meeting_datetime || null,
                planData.closing_meeting_datetime || null,
                planData.location || null,
                planData.criteria || null,
                planData.documents_to_review || null,
                planData.confidentiality || null
            );
            planId = result.lastInsertRowid as number;
        }

        // Replace activities
        this.db.prepare('DELETE FROM audit_plan_activities WHERE plan_id = ?').run(planId);
        const insertAct = this.db.prepare(`
            INSERT INTO audit_plan_activities (plan_id, activity_date, start_time, end_time, activity, process_area, auditor_ids, documents, sort_order)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        this.db.transaction(() => {
            activities.forEach((act, i) => {
                insertAct.run(planId, act.activity_date || null, act.start_time || null, act.end_time || null,
                    act.activity, act.process_area || null, act.auditor_ids || null, act.documents || null, act.sort_order ?? i);
            });
        })();

        return this.getAuditPlan(auditId) as any;
    }

    // ===================================================
    // DASHBOARD
    // ===================================================

    // ===================================================
    // REQUIREMENT VARIABLES
    // ===================================================

    getRequirementVariables(requirementId: number): any[] {
        return this.db.prepare(
            'SELECT * FROM requirement_variables WHERE requirement_id = ? ORDER BY variable_order'
        ).all(requirementId);
    }

    saveRequirementVariables(requirementId: number, variables: string[]): any[] {
        this.db.prepare('DELETE FROM requirement_variables WHERE requirement_id = ?').run(requirementId);
        const stmt = this.db.prepare(
            'INSERT INTO requirement_variables (requirement_id, variable_text, variable_order) VALUES (?, ?, ?)'
        );
        for (let i = 0; i < variables.length; i++) {
            stmt.run(requirementId, variables[i], i);
        }
        return this.getRequirementVariables(requirementId);
    }

    getBulkVariableAnswers(auditId: number): any[] {
        return this.db.prepare(
            'SELECT * FROM finding_variable_answers WHERE audit_id = ?'
        ).all(auditId);
    }

    saveVariableAnswer(auditId: number, requirementId: number, variableId: number, answer: string): void {
        this.db.prepare(`
            INSERT INTO finding_variable_answers (audit_id, requirement_id, variable_id, answer)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(audit_id, requirement_id, variable_id) DO UPDATE SET answer = excluded.answer
        `).run(auditId, requirementId, variableId, answer);
    }

    // ===================================================
    getDashboardKPIs(standardId?: number) {
        const stdFilter = standardId ? ' AND a.standard_id = ?' : '';
        const stdParams = standardId ? [standardId] : [];

        const totalAudits = (this.db.prepare(`SELECT COUNT(*) as count FROM audits a WHERE 1=1${stdFilter}`).get(...stdParams) as any).count;
        const auditsThisYear = (this.db.prepare(`SELECT COUNT(*) as count FROM audits a WHERE strftime('%Y', audit_date) = strftime('%Y', 'now')${stdFilter}`).get(...stdParams) as any).count;

        let findingsBase = `FROM audit_findings af INNER JOIN audits a ON af.audit_id = a.id WHERE 1=1${stdFilter}`;
        const totalFindings = (this.db.prepare(`SELECT COUNT(*) as count ${findingsBase}`).get(...stdParams) as any).count;
        const nonConformities = (this.db.prepare(`SELECT COUNT(*) as count ${findingsBase} AND af.finding_type_id IN (SELECT id FROM finding_types WHERE requires_action = 1)`).get(...stdParams) as any).count;

        const openActions = (this.db.prepare(`SELECT COUNT(*) as count FROM corrective_actions WHERE status = 'OPEN'`).get() as any).count;
        const overdueActions = (this.db.prepare(`SELECT COUNT(*) as count FROM corrective_actions WHERE status IN ('OPEN', 'IN_PROGRESS') AND target_date < DATE('now')`).get() as any).count;

        const chapterFilter = standardId ? ' AND ch.standard_id = ?' : '';
        const complianceByChapter = this.db.prepare(`
            SELECT ch.chapter_number, ch.chapter_title, COUNT(DISTINCT req.id) as total_requirements,
                COUNT(DISTINCT CASE WHEN ft.type_code = 'C' THEN af.requirement_id END) as conformities,
                COUNT(DISTINCT CASE WHEN ft.requires_action = 1 THEN af.requirement_id END) as non_conformities
            FROM iso_chapters ch
            INNER JOIN iso_requirements req ON ch.id = req.chapter_id
            LEFT JOIN audit_findings af ON req.id = af.requirement_id
            LEFT JOIN finding_types ft ON af.finding_type_id = ft.id
            WHERE 1=1${chapterFilter}
            GROUP BY ch.id ORDER BY ch.chapter_number
        `).all(...(standardId ? [standardId] : []));

        const findingsByType = this.db.prepare(`
            SELECT ft.type_name, ft.color, COUNT(*) as count
            FROM audit_findings af
            INNER JOIN finding_types ft ON af.finding_type_id = ft.id
            INNER JOIN audits a ON af.audit_id = a.id
            WHERE 1=1${stdFilter}
            GROUP BY ft.id ORDER BY ft.severity_level DESC
        `).all(...stdParams);

        return { totalAudits, auditsThisYear, totalFindings, nonConformities, openActions, overdueActions, complianceByChapter, findingsByType };
    }
}

const instances = new Map<string, ISOAuditService>();

export function getIsoAuditService(dataDir: string): ISOAuditService {
    if (!instances.has(dataDir)) {
        instances.set(dataDir, new ISOAuditService(dataDir));
    }
    return instances.get(dataDir)!;
}
