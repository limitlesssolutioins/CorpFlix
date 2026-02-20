import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const { getDb } = require('@/lib/db');

export class AuditService {
    private db: any;

    constructor(dataDir: string) {
        this.db = getDb(path.join(dataDir, 'hr.db'));
    }

    async log(entity: string, entityId: string, action: string, details?: string) {
        const id = uuidv4();
        await this.db.run(`
      INSERT INTO AuditLog (id, entity, entityId, action, details, performedBy, createdAt)
      VALUES (?, ?, ?, ?, ?, 'Sistema', datetime('now'))
    `, [id, entity, entityId, action, details || '']);

        return { id };
    }

    async findAll(filters?: any) {
        let query = 'SELECT * FROM AuditLog WHERE 1=1';
        const params: any[] = [];

        if (filters?.entity) {
            query += ' AND entity = ?';
            params.push(filters.entity);
        }

        if (filters?.entityId) {
            query += ' AND entityId = ?';
            params.push(filters.entityId);
        }

        query += ' ORDER BY createdAt DESC LIMIT 100';

        return this.db.all(query, params);
    }
}

const instances = new Map<string, AuditService>();

export function getAuditService(dataDir: string): AuditService {
    if (!instances.has(dataDir)) {
        instances.set(dataDir, new AuditService(dataDir));
    }
    return instances.get(dataDir)!;
}
