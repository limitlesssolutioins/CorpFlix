import { query } from '@/lib/db';

export interface AuditAuditor {
    id?: number;
    name: string;
    email?: string;
    role?: string;
    area?: string;
    phone?: string;
    status?: string;
}

export class ISOAuditService {
  constructor(private dataDir: string) {}
  
  getDashboardKPIs() { return {}; }
  getAllAudits() { return []; }
  getAuditById() { return null; }
  getPrograms() { return []; }
  getAuditTeam() { return []; }
  getAuditPlan() { return { plan: null, activities: [] }; }
  getFindingsByAudit() { return []; }
  getBulkFindings() { return []; }
  getAllCorrectiveActions() { return []; }
  getBulkVariableAnswers() { return []; }
  saveVariableAnswer() { return true; }
  saveBulkFindings() { return { saved: 0, actionsCreated: 0 }; }

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