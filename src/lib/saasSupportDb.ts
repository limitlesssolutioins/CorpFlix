import { query } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export class SaasSupportDb {
  constructor() {}

  async getAllTickets() {
    return await query<any[]>('SELECT * FROM SupportTicket ORDER BY createdAt DESC');
  }

  async createTicket(data: any) {
    const id = uuidv4();
    await query('INSERT INTO SupportTicket (id, companyId, subject, description, priority, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, NOW(), NOW())', [
      id,
      data.companyId,
      data.subject,
      data.description,
      data.priority || 'MEDIUM'
    ]);
    const tickets = await query<any[]>('SELECT * FROM SupportTicket WHERE id = ?', [id]);
    return tickets[0];
  }

  async updateTicketStatus(id: string, status: string) {
    await query('UPDATE SupportTicket SET status = ?, updatedAt = NOW() WHERE id = ?', [status, id]);
    const tickets = await query<any[]>('SELECT * FROM SupportTicket WHERE id = ?', [id]);
    return tickets[0];
  }
}

export function getSaasSupportDb(): SaasSupportDb {
  return new SaasSupportDb();
}