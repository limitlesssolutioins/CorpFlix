import { query } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { getCompanyId } from '@/lib/companyContext';

export interface AuditAuditor {
    id?: number;
    name: string;
    email?: string;
    role?: string;
    area?: string;
    phone?: string;
    status?: string;
}

export interface Audit {
    
    id?: string;
    companyId?: string;
    title: string;
    date?: string | Date;
    status?: string;
    description?: string;
}

export class ISOAuditService {
  constructor(private dataDir: string) {}

  private async getCompanyContext() {
      const companyId = await getCompanyId();
      if (!companyId) throw new Error("Unauthorized");
      return companyId;
  }
  
  getDashboardKPIs(standardId?: number) { return {}; }
  getPrograms(standardId?: number, year?: number) { return []; }
  saveAuditPlan(auditId: string, plan: any, activities: any[]) { return null as any; }
  async getAuditTeam(auditId: string): Promise<any[]> {
    return await query<any[]>(`
        SELECT at.*, aa.name, aa.email, aa.role, aa.area
        FROM AuditTeam at
        INNER JOIN AuditAuditor aa ON at.auditor_id = aa.id
        WHERE at.audit_id = ?
        ORDER BY aa.name
    `, [auditId]);
  }

  async setAuditTeam(auditId: string, members: { auditorId: number; roleInAudit?: string }[]): Promise<void> {
    await query('DELETE FROM AuditTeam WHERE audit_id = ?', [auditId]);
    for (const m of members) {
        await query(`
            INSERT INTO AuditTeam (audit_id, auditor_id, role_in_audit) 
            VALUES (?, ?, ?)
        `, [auditId, m.auditorId, m.roleInAudit || 'Auditor']);
    }
  }

  getAuditPlan(auditId: string) { return { plan: null, activities: [] }; }

  // ==========================================
  // FINDINGS AND CHECKLIST
  // ==========================================

  async getBulkFindings(auditId: string, standardCode?: string): Promise<any[]> {
    const audit = await this.getAuditById(auditId);
    if (!audit) return [];

    const sql = `
        SELECT req.id as id, req.id as requirement_id, req.code as requirement_code, req.title as requirement_title, req.description as requirement_description,
            ch.id as chapter_id, ch.chapterNumber as chapter_number, ch.title as chapter_title, ch.standardId as standard_id,
            req.isAuditable as is_auditable, req.weight as weight,
            af.id as finding_id, af.type as finding_type_name, af.description as finding_description,
            af.evidence, af.evidence as observations,
            CASE
                WHEN af.type = 'CONFORMITY' THEN 1
                WHEN af.type = 'NON_CONFORMITY' THEN 2
                WHEN af.type = 'OPPORTUNITY' THEN 3
                ELSE NULL
            END as finding_type_id
        FROM AuditRequirement req
        INNER JOIN AuditChapter ch ON req.chapterId = ch.id
        LEFT JOIN AuditFinding af ON af.requirementId = req.id AND af.auditId = ?
        WHERE (? IS NULL OR ch.standardId = (SELECT id FROM AuditStandard WHERE code = ?))
        ORDER BY req.code
    `;
    return await query<any[]>(sql, [auditId, standardCode, standardCode]);
  }

  async saveBulkFindings(auditId: string, findings: any[]): Promise<{ saved: number; actionsCreated: number }> {
    let saved = 0;

    for (const f of findings) {
        if (!f.finding_type_id) {
            await query('DELETE FROM AuditFinding WHERE auditId = ? AND requirementId = ?', [auditId, f.requirement_id]);
            continue;
        }

        let typeStr = 'CONFORMITY';
        if (f.finding_type_id === 2) typeStr = 'NON_CONFORMITY';
        if (f.finding_type_id === 3) typeStr = 'OPPORTUNITY';

        const [existing] = await query<any[]>('SELECT id FROM AuditFinding WHERE auditId = ? AND requirementId = ?', [auditId, f.requirement_id]);

        if (existing) {
            await query(`
                UPDATE AuditFinding SET type=?, description=?, evidence=?
                WHERE id=?
            `, [typeStr, f.finding_description || '', f.evidence || '', existing.id]);
        } else {
            await query(`
                INSERT INTO AuditFinding (auditId, requirementId, type, description, evidence, createdAt)
                VALUES (?, ?, ?, ?, ?, NOW())
            `, [auditId, f.requirement_id, typeStr, f.finding_description || '', f.evidence || '']);
        }
        saved++;
    }

    return { saved, actionsCreated: 0 };
  }

  async getBulkVariableAnswers(auditId: string): Promise<any[]> {
    try {
        return await query<any[]>('SELECT * FROM RequirementVariableAnswer WHERE auditId = ?', [auditId]);
    } catch {
        return []; // If table doesn't exist yet, return empty
    }
  }

  async saveVariableAnswer(auditId: string, requirementId: number, variableId: number, answer: string, nc_text?: string, op_text?: string, evidence?: string): Promise<void> {
    try {
        const [existing] = await query<any[]>('SELECT id FROM RequirementVariableAnswer WHERE auditId = ? AND requirementId = ? AND variableId = ?', [auditId, requirementId, variableId]);
        if (existing) {
            await query(`
                UPDATE RequirementVariableAnswer 
                SET answer=?, nc_text=?, op_text=?, evidence=? 
                WHERE id=?
            `, [answer, nc_text || null, op_text || null, evidence || null, existing.id]);
        } else {
            await query(`
                INSERT INTO RequirementVariableAnswer (auditId, requirementId, variableId, answer, nc_text, op_text, evidence)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [auditId, requirementId, variableId, answer, nc_text || null, op_text || null, evidence || null]);
        }
    } catch {
        // Ignore if table not implemented
    }
  }

  getFindingsByAudit(auditId: string) { return []; }
  // ==========================================
  // AUDITS
  // ==========================================

  async getAllAudits(filters: any = {}): Promise<Audit[]> {
    const companyId = await this.getCompanyContext();
    let sql = 'SELECT * FROM Audit WHERE companyId = ?';
    const params: any[] = [companyId];

    if (filters.status) {
        sql += ' AND status = ?';
        params.push(filters.status);
    }
    
    sql += ' ORDER BY date DESC';
    return await query<Audit[]>(sql, params);
  }

  async getAuditById(id: string): Promise<Audit | null> {
    const companyId = await this.getCompanyContext();
    const [audit] = await query<Audit[]>('SELECT * FROM Audit WHERE id = ? AND companyId = ?', [id, companyId]);
    return audit || null;
  }

  async createAudit(data: Audit): Promise<Audit> {
    const companyId = await this.getCompanyContext();
    const id = uuidv4();
    
    await query(`
        INSERT INTO Audit (id, companyId, title, date, status, description)
        VALUES (?, ?, ?, ?, ?, ?)
    `, [
        id,
        companyId,
        data.title || 'Auditoría sin título',
        data.date ? new Date(data.date) : new Date(),
        data.status || 'PLANNED',
        data.description ?? null // Ensure undefined becomes null
    ]);

    const newAudit = await this.getAuditById(id);
    if (!newAudit) throw new Error("Failed to create audit");
    return newAudit;
  }

  async updateAudit(id: string, data: Partial<Audit>): Promise<Audit | null> {
    const companyId = await this.getCompanyContext();
    const existing = await this.getAuditById(id);
    if (!existing) return null;

    await query(`
        UPDATE Audit SET title=?, date=?, status=?, description=? WHERE id=? AND companyId=?
    `, [
        data.title ?? existing.title,
        data.date ? new Date(data.date) : existing.date,
        data.status ?? existing.status,
        data.description ?? existing.description,
        id,
        companyId
    ]);

    return await this.getAuditById(id);
  }

  async deleteAudit(id: string): Promise<boolean> {
    const companyId = await this.getCompanyContext();
    await query('DELETE FROM Audit WHERE id = ? AND companyId = ?', [id, companyId]);
    return true; // We assume success or rely on DB exceptions
  }

  // ==========================================
  // AUDITORS
  // ==========================================

  async getAuditors(): Promise<AuditAuditor[]> {
    return await query<AuditAuditor[]>('SELECT * FROM AuditAuditor ORDER BY name ASC');
  }

  async createAuditor(data: AuditAuditor): Promise<AuditAuditor> {
    const result = await query<any>(`
        INSERT INTO AuditAuditor (name, email, role, area, phone, status)
        VALUES (?, ?, ?, ?, ?, ?)
    `, [
        data.name,
        data.email || null,
        data.role || 'Auditor',
        data.area || null,
        data.phone || null,
        data.status || 'ACTIVE'
    ]);
    
    const [newAuditor] = await query<AuditAuditor[]>('SELECT * FROM AuditAuditor WHERE id = ?', [result.insertId]);
    return newAuditor;
  }

  async updateAuditor(id: number, data: Partial<AuditAuditor>): Promise<AuditAuditor | null> {
    const [existing] = await query<AuditAuditor[]>('SELECT * FROM AuditAuditor WHERE id = ?', [id]);
    if (!existing) return null;

    await query(`
        UPDATE AuditAuditor SET name=?, email=?, role=?, area=?, phone=?, status=? WHERE id=?
    `, [
        data.name ?? existing.name,
        data.email ?? existing.email,
        data.role ?? existing.role,
        data.area ?? existing.area,
        data.phone ?? existing.phone,
        data.status ?? existing.status,
        id
    ]);

    const [updated] = await query<AuditAuditor[]>('SELECT * FROM AuditAuditor WHERE id = ?', [id]);
    return updated;
  }

  async deleteAuditor(id: number): Promise<{ success: boolean; reason?: string }> {
    const [{ count }] = await query<any[]>('SELECT COUNT(*) as count FROM AuditTeam WHERE auditor_id = ?', [id]);
    if (count > 0) {
        return { success: false, reason: 'El auditor está asignado a una o más auditorías.' };
    }
    await query('DELETE FROM AuditAuditor WHERE id = ?', [id]);
    return { success: true };
  }

    getAllCorrectiveActions(filters?: any) { return null as any; }
    createCorrectiveAction(body: any) { return null as any; }
    updateCorrectiveAction(id: string, updateData: any) { return null as any; }
    createFinding(body: any) { return null as any; }
    saveRequirementVariables(reqId: number, vars: string[]) { return null as any; }
    createProgram(body: any) { return null as any; }
    updateProgram(id: string, data: any) { return null as any; }
}

let instance: ISOAuditService | null = null;
export function getIsoAuditService(dataDir: string): ISOAuditService {
  if (!instance) instance = new ISOAuditService(dataDir);
  return instance;
}