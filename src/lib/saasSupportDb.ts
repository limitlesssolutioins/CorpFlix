import prisma from '@/lib/prisma';

export class SaasSupportDb {
  constructor() {}

  async getAllTickets() {
    return await prisma.supportTicket.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async createTicket(data: any) {
    return await prisma.supportTicket.create({
      data: {
        companyId: data.companyId,
        subject: data.subject,
        description: data.description,
        priority: data.priority || 'MEDIUM'
      }
    });
  }

  async updateTicketStatus(id: string, status: string) {
    return await prisma.supportTicket.update({
      where: { id },
      data: { status }
    });
  }
}

export function getSaasSupportDb(): SaasSupportDb {
  return new SaasSupportDb();
}