import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

export interface SaasTicket {
    id?: number;
    ticket_code?: string;
    company_id: string;
    user_id?: string;
    subject: string;
    status?: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    transcript: string;
    created_at?: string;
    resolved_at?: string;
}

class SaasSupportDb {
    private db: Database.Database;

    constructor() {
        // Point to the global data directory
        const dataDir = path.join(process.cwd(), 'src', 'data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        const dbPath = path.join(dataDir, 'saas_support.db');
        this.db = new Database(dbPath);
        this.initializeDatabase();
    }

    private initializeDatabase() {
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS saas_tickets (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ticket_code TEXT NOT NULL UNIQUE,
                company_id TEXT NOT NULL,
                user_id TEXT,
                subject TEXT NOT NULL,
                status TEXT DEFAULT 'OPEN',
                priority TEXT DEFAULT 'MEDIUM',
                transcript TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                resolved_at TIMESTAMP
            )
        `);
    }

    private generateCode(): string {
        const row = this.db.prepare('SELECT COUNT(*) as c FROM saas_tickets').get() as { c: number };
        const n = row.c + 1;
        return `SAAS-${String(n).padStart(4, '0')}`;
    }

    createTicket(ticket: Omit<SaasTicket, 'id' | 'ticket_code' | 'created_at' | 'resolved_at'>): SaasTicket {
        const code = this.generateCode();
        const result = this.db.prepare(`
            INSERT INTO saas_tickets (ticket_code, company_id, user_id, subject, status, priority, transcript)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(
            code,
            ticket.company_id,
            ticket.user_id || null,
            ticket.subject,
            ticket.status || 'OPEN',
            ticket.priority || 'MEDIUM',
            ticket.transcript
        );
        return this.getTicketById(result.lastInsertRowid as number)!;
    }

    getTicketById(id: number): SaasTicket | undefined {
        return this.db.prepare('SELECT * FROM saas_tickets WHERE id = ?').get(id) as SaasTicket | undefined;
    }

    getAllTickets(): SaasTicket[] {
        return this.db.prepare('SELECT * FROM saas_tickets ORDER BY created_at DESC').all() as SaasTicket[];
    }

    updateTicketStatus(id: number, status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'): SaasTicket | undefined {
        const resolved_at = status === 'RESOLVED' || status === 'CLOSED' ? new Date().toISOString() : null;
        this.db.prepare(`
            UPDATE saas_tickets 
            SET status = ?, resolved_at = ?
            WHERE id = ?
        `).run(status, resolved_at, id);
        return this.getTicketById(id);
    }
}

// Singleton instance
let instance: SaasSupportDb | null = null;

export function getSaasSupportDb(): SaasSupportDb {
    if (!instance) {
        instance = new SaasSupportDb();
    }
    return instance;
}
