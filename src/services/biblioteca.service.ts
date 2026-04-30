import prisma from '@/lib/prisma';
import { getCompanyId } from '@/lib/companyContext';

export class BibliotecaService {
  constructor() {}

  private async getCompanyContext() {
      const companyId = await getCompanyId();
      if (!companyId) throw new Error("Unauthorized");
      return companyId;
  }

  async getDashboardStats() {
    const companyId = await this.getCompanyContext();
    const totalDocuments = await prisma.document.count({ where: { companyId, status: 'ACTIVE' } });
    const totalCategories = await prisma.documentCategory.count();
    const recentUploads = await prisma.document.count({ 
      where: { 
        companyId, 
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } 
      } 
    });

    return { totalDocuments, totalCategories, recentUploads, totalViews: 0, categoryStats: [], recentDocuments: [] };
  }

  async getAllCategories() {
    return await prisma.documentCategory.findMany({ orderBy: { name: 'asc' } });
  }

  async getRecentDocuments() {
    const companyId = await this.getCompanyContext();
    return await prisma.document.findMany({
      where: { companyId, status: 'ACTIVE' },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
      take: 10
    });
  }

  async getAllDocuments() {
    const companyId = await this.getCompanyContext();
    return await prisma.document.findMany({
      where: { companyId },
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async searchDocuments(q: string) {
    const companyId = await this.getCompanyContext();
    return await prisma.document.findMany({
      where: { 
        companyId, 
        status: 'ACTIVE',
        title: { contains: q }
      },
      include: { category: true },
      take: 50
    });
  }
}

export function getBibliotecaService(dataDir: string): BibliotecaService {
  return new BibliotecaService();
}