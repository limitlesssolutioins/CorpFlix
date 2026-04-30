import prisma from '@/lib/prisma';
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
    const [totalRisks, highRisks, actionPlans] = await Promise.all([
      prisma.risk.count({ where: { companyId } }),
      prisma.risk.count({ where: { companyId, residualRisk: { gte: 15 } } }), // Example threshold for high risk
      prisma.risk.count({ where: { companyId, status: 'MITIGATED' } }) // Using status as proxy for plan existance
    ]);
    
    return {
      totalRisks,
      highRisks,
      openActionPlans: actionPlans
    };
  }

  async getAllCategories() {
    return await prisma.riskCategory.findMany({ orderBy: { name: 'asc' } });
  }

  async getAllRisks() {
    const companyId = await this.getCompanyContext();
    return await prisma.risk.findMany({
      where: { companyId },
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getRiskById(id: string) {
    const companyId = await this.getCompanyContext();
    return await prisma.risk.findFirst({
      where: { id, companyId },
      include: { category: true }
    });
  }

  async createRisk(data: any) {
    const companyId = await this.getCompanyContext();
    return await prisma.risk.create({
      data: {
        companyId,
        categoryId: data.categoryId,
        title: data.title,
        description: data.description,
        status: data.status || 'IDENTIFIED'
      }
    });
  }

  async updateRisk(id: string, data: any) {
    const companyId = await this.getCompanyContext();
    return await prisma.risk.updateMany({
      where: { id, companyId },
      data: {
        title: data.title,
        description: data.description,
        probability: data.probability,
        consequence: data.consequence,
        residualRisk: data.residualRisk,
        status: data.status
      }
    });
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