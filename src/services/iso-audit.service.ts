import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const SCHEMA_PATH = path.join(process.cwd(), 'src/data/schema_auditoria.sql');

// Types
export interface ISOChapter {
    id?: number;
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
}

export interface Audit {
    id?: number;
    audit_code?: string;
    audit_type_id?: number;
    audit_date: string;
    planned_date?: string;
    auditor_name?: string;
    auditor_id?: number;
    scope?: string;
    objectives?: string;
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
        this.initializeDatabase();
    }

    private initializeDatabase() {
        try {
            const tableExists = this.db
                .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='iso_chapters'")
                .get();

            if (!tableExists) {
                const schema = fs.readFileSync(SCHEMA_PATH, 'utf-8');
                this.db.exec(schema);
                console.log('✅ Audit database initialized successfully');
            }
        } catch (error) {
            console.error('❌ Error initializing audit database:', error);
            throw error;
        }
    }

    // ISO STRUCTURE
    getAllChapters(): ISOChapter[] {
        return this.db.prepare('SELECT * FROM iso_chapters ORDER BY chapter_number').all() as ISOChapter[];
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

    // AUDITS
    getAllAudits(filters?: { status?: string; year?: number }): any[] {
        let query = `SELECT a.*, at.type_name as audit_type_name FROM audits a LEFT JOIN audit_types at ON a.audit_type_id = at.id WHERE 1=1`;
        const params: any[] = [];

        if (filters?.status) {
            query += ' AND a.status = ?';
            params.push(filters.status);
        }

        if (filters?.year) {
            query += ` AND strftime('%Y', a.audit_date) = ?`;
            params.push(filters.year.toString());
        }

        query += ' ORDER BY a.audit_date DESC';
        return this.db.prepare(query).all(...params);
    }

    getAuditById(id: number): any {
        return this.db.prepare(`SELECT a.*, at.type_name as audit_type_name FROM audits a LEFT JOIN audit_types at ON a.audit_type_id = at.id WHERE a.id = ?`).get(id);
    }

    createAudit(audit: Audit): any {
        const code = audit.audit_code || `AUD-${Date.now()}`;
        const stmt = this.db.prepare(`INSERT INTO audits (audit_code, audit_type_id, audit_date, planned_date, auditor_name, scope, objectives, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
        const result = stmt.run(code, audit.audit_type_id || null, audit.audit_date, audit.planned_date || null, audit.auditor_name || null, audit.scope || null, audit.objectives || null, audit.status || 'PLANNED');
        return this.getAuditById(result.lastInsertRowid as number);
    }

    updateAudit(id: number, audit: Partial<Audit>): any | null {
        const existing = this.getAuditById(id);
        if (!existing) return null;
        const stmt = this.db.prepare(`UPDATE audits SET audit_type_id = ?, audit_date = ?, planned_date = ?, auditor_name = ?, scope = ?, objectives = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`);
        stmt.run(audit.audit_type_id ?? existing.audit_type_id, audit.audit_date ?? existing.audit_date, audit.planned_date ?? existing.planned_date, audit.auditor_name ?? existing.auditor_name, audit.scope ?? existing.scope, audit.objectives ?? existing.objectives, audit.status ?? existing.status, id);
        return this.getAuditById(id);
    }

    // FINDINGS
    getFindingsByAudit(auditId: number): any[] {
        return this.db.prepare(`SELECT af.*, ft.type_name as finding_type_name, ft.color as finding_color, req.requirement_code, req.requirement_title, ch.chapter_number, ch.chapter_title FROM audit_findings af INNER JOIN finding_types ft ON af.finding_type_id = ft.id INNER JOIN iso_requirements req ON af.requirement_id = req.id INNER JOIN iso_chapters ch ON req.chapter_id = ch.id WHERE af.audit_id = ? ORDER BY req.requirement_code`).all(auditId);
    }

    createFinding(finding: AuditFinding): any {
        const stmt = this.db.prepare(`INSERT INTO audit_findings (audit_id, requirement_id, finding_type_id, finding_description, evidence, observations, auditor_notes) VALUES (?, ?, ?, ?, ?, ?, ?)`);
        const result = stmt.run(finding.audit_id, finding.requirement_id, finding.finding_type_id, finding.finding_description || null, finding.evidence || null, finding.observations || null, finding.auditor_notes || null);
        const findingType = this.db.prepare('SELECT requires_action FROM finding_types WHERE id = ?').get(finding.finding_type_id) as any;
        if (findingType && findingType.requires_action === 1) {
            this.createCorrectiveAction({ finding_id: result.lastInsertRowid as number, corrective_action: 'Pendiente de definir', status: 'OPEN' });
        }
        return this.db.prepare('SELECT * FROM audit_findings WHERE id = ?').get(result.lastInsertRowid);
    }

    // CORRECTIVE ACTIONS
    getAllCorrectiveActions(filters?: { status?: string }): any[] {
        let query = `SELECT ca.*, af.finding_description, ft.type_name as finding_type, req.requirement_code, ch.chapter_title, a.audit_code FROM corrective_actions ca INNER JOIN audit_findings af ON ca.finding_id = af.id INNER JOIN finding_types ft ON af.finding_type_id = ft.id INNER JOIN iso_requirements req ON af.requirement_id = req.id INNER JOIN iso_chapters ch ON req.chapter_id = ch.id INNER JOIN audits a ON af.audit_id = a.id WHERE 1=1`;
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
        const stmt = this.db.prepare(`INSERT INTO corrective_actions (finding_id, action_code, root_cause_analysis, corrective_action, responsible, target_date, status, progress) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
        const result = stmt.run(action.finding_id, code, action.root_cause_analysis || null, action.corrective_action, action.responsible || null, action.target_date || null, action.status || 'OPEN', action.progress || 0);
        return this.db.prepare('SELECT * FROM corrective_actions WHERE id = ?').get(result.lastInsertRowid);
    }

    updateCorrectiveAction(id: number, action: Partial<CorrectiveAction>): any | null {
        const existing = this.db.prepare('SELECT * FROM corrective_actions WHERE id = ?').get(id) as CorrectiveAction | undefined;
        if (!existing) return null;
        const stmt = this.db.prepare(`UPDATE corrective_actions SET root_cause_analysis = ?, corrective_action = ?, responsible = ?, target_date = ?, completion_date = ?, status = ?, progress = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`);
        stmt.run(action.root_cause_analysis ?? existing.root_cause_analysis, action.corrective_action ?? existing.corrective_action, action.responsible ?? existing.responsible, action.target_date ?? existing.target_date, action.completion_date ?? existing.completion_date, action.status ?? existing.status, action.progress ?? existing.progress, action.notes ?? existing.notes, id);
        return this.db.prepare('SELECT * FROM corrective_actions WHERE id = ?').get(id);
    }

    // DASHBOARD
    getDashboardKPIs() {
        const totalAudits = (this.db.prepare('SELECT COUNT(*) as count FROM audits').get() as any).count;
        const auditsThisYear = (this.db.prepare(`SELECT COUNT(*) as count FROM audits WHERE strftime('%Y', audit_date) = strftime('%Y', 'now')`).get() as any).count;
        const totalFindings = (this.db.prepare('SELECT COUNT(*) as count FROM audit_findings').get() as any).count;
        const nonConformities = (this.db.prepare(`SELECT COUNT(*) as count FROM audit_findings af INNER JOIN finding_types ft ON af.finding_type_id = ft.id WHERE ft.requires_action = 1`).get() as any).count;
        const openActions = (this.db.prepare('SELECT COUNT(*) as count FROM corrective_actions WHERE status = ?').get('OPEN') as any).count;
        const overdueActions = (this.db.prepare(`SELECT COUNT(*) as count FROM corrective_actions WHERE status IN ('OPEN', 'IN_PROGRESS') AND target_date < DATE('now')`).get() as any).count;
        const complianceByChapter = this.db.prepare(`SELECT ch.chapter_number, ch.chapter_title, COUNT(DISTINCT req.id) as total_requirements, COUNT(DISTINCT CASE WHEN ft.type_code = 'C' THEN af.requirement_id END) as conformities, COUNT(DISTINCT CASE WHEN ft.requires_action = 1 THEN af.requirement_id END) as non_conformities FROM iso_chapters ch INNER JOIN iso_requirements req ON ch.id = req.chapter_id LEFT JOIN audit_findings af ON req.id = af.requirement_id LEFT JOIN finding_types ft ON af.finding_type_id = ft.id GROUP BY ch.id ORDER BY ch.chapter_number`).all();
        const findingsByType = this.db.prepare(`SELECT ft.type_name, ft.color, COUNT(*) as count FROM audit_findings af INNER JOIN finding_types ft ON af.finding_type_id = ft.id GROUP BY ft.id ORDER BY ft.severity_level DESC`).all();

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
