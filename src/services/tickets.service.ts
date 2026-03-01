import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

export interface Ticket {
    id?: number;
    ticket_code?: string;
    title: string;
    description?: string;
    category?: string;       // GENERAL | NC | MEJORA | SOLICITUD
    priority?: string;       // BAJA | MEDIA | ALTA | CRITICA
    status?: string;         // ABIERTO | EN_PROGRESO | RESUELTO | CERRADO
    assigned_to?: string;
    requested_by?: string;
    due_date?: string;
    resolved_at?: string;
    resolution_notes?: string;
    source_module?: string;
    source_ref?: string;
    created_at?: string;
    updated_at?: string;
}

export interface TicketStats {
    total: number;
    abiertos: number;
    en_progreso: number;
    resueltos: number;
    vencidos: number;
}

class TicketsService {
    private db: Database.Database;

    constructor(dataDir: string) {
        const dbPath = path.join(dataDir, 'tickets.db');
        if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
        this.db = new Database(dbPath);
        this.initializeDatabase();
    }

    private initializeDatabase() {
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS tickets (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ticket_code TEXT NOT NULL UNIQUE,
                title TEXT NOT NULL,
                description TEXT,
                category TEXT DEFAULT 'GENERAL',
                priority TEXT DEFAULT 'MEDIA',
                status TEXT DEFAULT 'ABIERTO',
                assigned_to TEXT,
                requested_by TEXT,
                due_date TEXT,
                resolved_at TEXT,
                resolution_notes TEXT,
                source_module TEXT,
                source_ref TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
    }

    private generateCode(): string {
        const n = (this.db.prepare('SELECT COUNT(*) as c FROM tickets').get() as any).c + 1;
        return `TKT-${String(n).padStart(4, '0')}`;
    }

    getAllTickets(filters?: { status?: string; priority?: string; category?: string }): Ticket[] {
        let query = 'SELECT * FROM tickets WHERE 1=1';
        const params: any[] = [];
        if (filters?.status)   { query += ' AND status = ?';   params.push(filters.status); }
        if (filters?.priority) { query += ' AND priority = ?'; params.push(filters.priority); }
        if (filters?.category) { query += ' AND category = ?'; params.push(filters.category); }
        query += ` ORDER BY
            CASE status
                WHEN 'ABIERTO'     THEN 0
                WHEN 'EN_PROGRESO' THEN 1
                WHEN 'RESUELTO'    THEN 2
                WHEN 'CERRADO'     THEN 3
                ELSE 4
            END,
            CASE priority
                WHEN 'CRITICA' THEN 0
                WHEN 'ALTA'    THEN 1
                WHEN 'MEDIA'   THEN 2
                WHEN 'BAJA'    THEN 3
                ELSE 4
            END,
            created_at DESC`;
        return this.db.prepare(query).all(...params) as Ticket[];
    }

    getTicketById(id: number): Ticket | undefined {
        return this.db.prepare('SELECT * FROM tickets WHERE id = ?').get(id) as Ticket | undefined;
    }

    createTicket(ticket: Ticket): Ticket {
        const code = this.generateCode();
        const result = this.db.prepare(`
            INSERT INTO tickets (ticket_code, title, description, category, priority, status, assigned_to, requested_by, due_date, source_module, source_ref)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            code,
            ticket.title,
            ticket.description || null,
            ticket.category || 'GENERAL',
            ticket.priority || 'MEDIA',
            ticket.status || 'ABIERTO',
            ticket.assigned_to || null,
            ticket.requested_by || null,
            ticket.due_date || null,
            ticket.source_module || null,
            ticket.source_ref || null,
        );
        return this.getTicketById(result.lastInsertRowid as number)!;
    }

    updateTicket(id: number, ticket: Partial<Ticket>): Ticket | null {
        const existing = this.getTicketById(id);
        if (!existing) return null;
        const resolved_at =
            ticket.status === 'RESUELTO' && existing.status !== 'RESUELTO'
                ? new Date().toISOString().split('T')[0]
                : (ticket.status && ['ABIERTO', 'EN_PROGRESO'].includes(ticket.status) ? null : existing.resolved_at);

        this.db.prepare(`
            UPDATE tickets SET
                title = ?, description = ?, category = ?, priority = ?, status = ?,
                assigned_to = ?, requested_by = ?, due_date = ?,
                resolved_at = ?, resolution_notes = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(
            ticket.title ?? existing.title,
            ticket.description ?? existing.description,
            ticket.category ?? existing.category,
            ticket.priority ?? existing.priority,
            ticket.status ?? existing.status,
            ticket.assigned_to ?? existing.assigned_to,
            ticket.requested_by ?? existing.requested_by,
            ticket.due_date ?? existing.due_date,
            resolved_at ?? null,
            ticket.resolution_notes ?? existing.resolution_notes,
            id,
        );
        return this.getTicketById(id)!;
    }

    deleteTicket(id: number): boolean {
        return (this.db.prepare('DELETE FROM tickets WHERE id = ?').run(id)).changes > 0;
    }

    getStats(): TicketStats {
        const q = (sql: string) => (this.db.prepare(sql).get() as any).c as number;
        return {
            total:       q('SELECT COUNT(*) as c FROM tickets'),
            abiertos:    q("SELECT COUNT(*) as c FROM tickets WHERE status = 'ABIERTO'"),
            en_progreso: q("SELECT COUNT(*) as c FROM tickets WHERE status = 'EN_PROGRESO'"),
            resueltos:   q("SELECT COUNT(*) as c FROM tickets WHERE status = 'RESUELTO'"),
            vencidos:    q("SELECT COUNT(*) as c FROM tickets WHERE status IN ('ABIERTO','EN_PROGRESO') AND due_date IS NOT NULL AND due_date < DATE('now')"),
        };
    }
}

const instances = new Map<string, TicketsService>();

export function getTicketsService(dataDir: string): TicketsService {
    if (!instances.has(dataDir)) instances.set(dataDir, new TicketsService(dataDir));
    return instances.get(dataDir)!;
}
