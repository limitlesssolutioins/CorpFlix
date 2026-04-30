import prisma from '@/lib/prisma';
import { getCompanyId } from '@/lib/companyContext';

export class MejoraContinuaService {
  constructor() {}

  private async getCompanyContext() {
      const companyId = await getCompanyId();
      if (!companyId) throw new Error("Unauthorized");
      return companyId;
  }

  async getDashboardStats() {
    const companyId = await this.getCompanyContext();
    const [suggestions, projects, lessons] = await Promise.all([
      prisma.improvementSuggestion.count({ where: { companyId } }),
      prisma.improvementProject.count({ where: { companyId } }),
      prisma.lessonLearned.count({ where: { companyId } })
    ]);
    return { suggestions, projects, lessons };
  }

  async getAllSuggestions() {
    const companyId = await this.getCompanyContext();
    return await prisma.improvementSuggestion.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getAllProjects() {
    const companyId = await this.getCompanyContext();
    return await prisma.improvementProject.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getAllLessonsLearned() {
    const companyId = await this.getCompanyContext();
    return await prisma.lessonLearned.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' }
    });
  }
}

export function getMejoraContinuaService(dataDir: string): MejoraContinuaService {
  return new MejoraContinuaService();
}