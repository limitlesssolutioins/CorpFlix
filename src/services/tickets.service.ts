import prisma from '@/lib/prisma';
import { getCompanyId } from '@/lib/companyContext';

export class TicketsService {
  constructor() {}

  private async getCompanyContext() {
      const companyId = await getCompanyId();
      if (!companyId) throw new Error("Unauthorized");
      return companyId;
  }

  async getDashboardStats() {
    const companyId = await this.getCompanyContext();
    const openTickets = await prisma.supportTicket.count({ where: { companyId, status: 'OPEN' } });
    return { openTickets };
  }

  async getAllTickets() {
    const companyId = await this.getCompanyContext();
    return await prisma.supportTicket.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getTicketById(id: string) {
    const companyId = await this.getCompanyContext();
    return await prisma.supportTicket.findFirst({
      where: { id, companyId }
    });
  }

  async createTicket(data: any) {
    const companyId = await this.getCompanyContext();
    return await prisma.supportTicket.create({
      data: {
        companyId,
        subject: data.subject,
        description: data.description,
        priority: data.priority || 'MEDIUM'
      }
    });
  }

  async updateTicket(id: string, data: any) {
    const companyId = await this.getCompanyContext();
    return await prisma.supportTicket.updateMany({
      where: { id, companyId },
      data: {
        status: data.status,
        priority: data.priority
      }
    });
  }
}

export function getTicketsService(dataDir: string): TicketsService {
  return new TicketsService();
}