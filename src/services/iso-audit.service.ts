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
  
  getDashboardKPIs() { return {}; }
  getPrograms() { return []; }
  getAuditTeam() { return []; }
  getAuditPlan() { return { plan: null, activities: [] }; }
  getFindingsByAudit() { return []; }
  getBulkFindings() { return []; }
  getAllCorrectiveActions() { return []; }
  getBulkVariableAnswers() { return []; }
  saveVariableAnswer() { return true; }
  saveBulkFindings() { return { saved: 0, actionsCreated: 0 }; }

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
        data.title,
        data.date ? new Date(data.date) : new Date(),
        data.status || 'PLANNED',
        data.description || null
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
}

let instance: ISOAuditService | null = null;
export function getIsoAuditService(dataDir: string): ISOAuditService {
  if (!instance) instance = new ISOAuditService(dataDir);
  return instance;
}