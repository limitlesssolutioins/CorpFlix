import { v4 as uuidv4 } from 'uuid';
import { query } from '@/lib/db';
import { getCompanyId } from '@/lib/companyContext';

export class RiskService {
  constructor() {}

  private async getCompanyContext() {
      const companyId = await getCompanyId();
      if (!companyId) throw new Error("Unauthorized");
      return companyId;
  }

  async getDashboardStats() {
    const companyId = await this.getCompanyContext();
    const [totalRisksResult, highRisksResult, actionPlansResult] = await Promise.all([
      query<any[]>('SELECT COUNT(*) as count FROM Risk WHERE companyId = ?', [companyId]),
      query<any[]>('SELECT COUNT(*) as count FROM Risk WHERE companyId = ? AND residualRisk >= 15', [companyId]),
      query<any[]>('SELECT COUNT(*) as count FROM Risk WHERE companyId = ? AND status = "MITIGATED"', [companyId])
    ]);
    
    return {
      totalRisks: totalRisksResult[0]?.count || 0,
      highRisks: highRisksResult[0]?.count || 0,
      openActionPlans: actionPlansResult[0]?.count || 0
    };
  }

  async getAllCategories() {
    return await query<any[]>('SELECT * FROM RiskCategory ORDER BY name ASC');
  }

  async getAllRisks() {
    const companyId = await this.getCompanyContext();
    const sql = `
      SELECT r.*, c.id as cat_id, c.code as cat_code, c.name as cat_name, c.description as cat_description, c.color as cat_color, c.icon as cat_icon
      FROM Risk r
      LEFT JOIN RiskCategory c ON r.categoryId = c.id
      WHERE r.companyId = ?
      ORDER BY r.createdAt DESC
    `;
    const risks = await query<any[]>(sql, [companyId]);
    
    return risks.map(r => {
      const { cat_id, cat_code, cat_name, cat_description, cat_color, cat_icon, ...riskData } = r;
      return {
        ...riskData,
        category: cat_id ? {
          id: cat_id,
          code: cat_code,
          name: cat_name,
          description: cat_description,
          color: cat_color,
          icon: cat_icon
        } : null
      };
    });
  }

  async getRiskById(id: string) {
    const companyId = await this.getCompanyContext();
    const sql = `
      SELECT r.*, c.id as cat_id, c.code as cat_code, c.name as cat_name, c.description as cat_description, c.color as cat_color, c.icon as cat_icon
      FROM Risk r
      LEFT JOIN RiskCategory c ON r.categoryId = c.id
      WHERE r.id = ? AND r.companyId = ?
    `;
    const risks = await query<any[]>(sql, [id, companyId]);
    if (risks.length === 0) return null;
    
    const r = risks[0];
    const { cat_id, cat_code, cat_name, cat_description, cat_color, cat_icon, ...riskData } = r;
    return {
      ...riskData,
      category: cat_id ? {
        id: cat_id,
        code: cat_code,
        name: cat_name,
        description: cat_description,
        color: cat_color,
        icon: cat_icon
      } : null
    };
  }

  async createRisk(data: any) {
    const companyId = await this.getCompanyContext();
    const id = uuidv4();
    const status = data.status || 'IDENTIFIED';
    
    const sql = `
      INSERT INTO Risk (id, companyId, categoryId, title, description, status, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
    await query(sql, [id, companyId, data.categoryId, data.title, data.description, status]);
    
    return await this.getRiskById(id);
  }

  async updateRisk(id: string, data: any) {
    const companyId = await this.getCompanyContext();
    const sql = `
      UPDATE Risk 
      SET title = COALESCE(?, title), 
          description = COALESCE(?, description), 
          probability = COALESCE(?, probability), 
          consequence = COALESCE(?, consequence), 
          residualRisk = COALESCE(?, residualRisk), 
          status = COALESCE(?, status),
          updatedAt = NOW()
      WHERE id = ? AND companyId = ?
    `;
    
    await query(sql, [
      data.title ?? null, 
      data.description ?? null, 
      data.probability ?? null, 
      data.consequence ?? null, 
      data.residualRisk ?? null, 
      data.status ?? null, 
      id, 
      companyId
    ]);
    
    return { count: 1 };
  }

  // Stubs for criteria if needed for UI mapping, though often these are just enums or static config in SaaS
  getProbabilityCriteria() { return []; }
  getConsequenceCriteria() { return []; }
  getControlEffectivenessCriteria() { return []; }
  getControlsByRisk() { return []; }
  getActionPlansByRisk() { return []; }
  getAssessmentsByRisk() { return []; }
}

export function getRiskService(dataDir: string): RiskService {
  return new RiskService();
}