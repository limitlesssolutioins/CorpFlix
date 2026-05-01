import { v4 as uuidv4 } from 'uuid';
import { query } from '@/lib/db';
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
    const result = await query<any[]>(
      'SELECT COUNT(*) as count FROM SupportTicket WHERE companyId = ? AND status = "OPEN"', 
      [companyId]
    );
    return { openTickets: result[0]?.count || 0 };
  }

  async getAllTickets() {
    const companyId = await this.getCompanyContext();
    return await query<any[]>(
      'SELECT * FROM SupportTicket WHERE companyId = ? ORDER BY createdAt DESC',
      [companyId]
    );
  }

  async getTicketById(id: string) {
    const companyId = await this.getCompanyContext();
    const tickets = await query<any[]>(
      'SELECT * FROM SupportTicket WHERE id = ? AND companyId = ?',
      [id, companyId]
    );
    return tickets.length > 0 ? tickets[0] : null;
  }

  async createTicket(data: any) {
    const companyId = await this.getCompanyContext();
    const id = uuidv4();
    
    await query(
      `INSERT INTO SupportTicket (id, companyId, subject, description, priority, status, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, 'OPEN', NOW(), NOW())`,
      [id, companyId, data.subject, data.description, data.priority || 'MEDIUM']
    );
    
    return await this.getTicketById(id);
  }

  async updateTicket(id: string, data: any) {
    const companyId = await this.getCompanyContext();
    
    const updates: string[] = [];
    const params: any[] = [];

    if (data.status) {
      updates.push('status = ?');
      params.push(data.status);
    }
    if (data.priority) {
      updates.push('priority = ?');
      params.push(data.priority);
    }

    if (updates.length === 0) return { count: 0 };

    params.push(id, companyId);
    
    await query(
      `UPDATE SupportTicket SET ${updates.join(', ')}, updatedAt = NOW() WHERE id = ? AND companyId = ?`,
      params
    );
    
    return { count: 1 };
  }
}

export function getTicketsService(dataDir: string): TicketsService {
  return new TicketsService();
}
