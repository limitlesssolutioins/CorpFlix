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

    private ensureColumns() {
        const findingCols = this.db.prepare("PRAGMA table_info(audit_findings)").all() as any[];
        if (!findingCols.some(c => c.name === 'is_op')) {
            this.db.exec('ALTER TABLE audit_findings ADD COLUMN is_op INTEGER DEFAULT 0');
            console.log('✅ Added is_op column to audit_findings');
        }
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
            INSERT INTO audits (audit_code, standard_id, audit_type_id, audit_date, planned_date, auditor_name, scope, objectives, company_profile, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
            audit.company_profile || null,
            audit.status || 'PLANNED'
        );
        return this.getAuditById(result.lastInsertRowid as number);
    }

    updateAudit(id: number, audit: Partial<Audit>): any | null {
        const existing = this.getAuditById(id);
        if (!existing) return null;
        const stmt = this.db.prepare(`
            UPDATE audits SET standard_id=?, audit_type_id=?, audit_date=?, planned_date=?, auditor_name=?, scope=?, objectives=?, company_profile=?, status=?, updated_at=CURRENT_TIMESTAMP
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
                af.id as finding_id, af.finding_type_id, af.finding_description, af.evidence, af.observations, af.is_op,
                ft.type_name as finding_type_name, ft.color as finding_color, ft.type_code, ft.requires_action
            FROM iso_requirements req
            INNER JOIN iso_chapters ch ON req.chapter_id = ch.id
            LEFT JOIN audit_findings af ON af.requirement_id = req.id AND af.audit_id = ?
            LEFT JOIN finding_types ft ON af.finding_type_id = ft.id
            WHERE ch.standard_id = ? AND req.is_auditable = 1
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
            INSERT INTO audit_findings (audit_id, requirement_id, finding_type_id, finding_description, evidence, observations, is_op)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(audit_id, requirement_id) DO UPDATE SET
                finding_type_id = excluded.finding_type_id,
                finding_description = excluded.finding_description,
                evidence = excluded.evidence,
                observations = excluded.observations,
                is_op = excluded.is_op
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
                    f.is_op ?? 0
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
    // DASHBOARD
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
