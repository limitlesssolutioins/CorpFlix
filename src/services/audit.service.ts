import db from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export class AuditService {
    async log(entity: string, entityId: string, action: string, details?: string) {
        const id = uuidv4();
        await db.run(`
      INSERT INTO AuditLog (id, entity, entityId, action, details, performedBy, createdAt)
      VALUES (?, ?, ?, ?, ?, 'Sistema', datetime('now'))
    `, [id, entity, entityId, action, details || '']);

        return { id };
    }

    async findAll(filters?: any) {
        let query = 'SELECT * FROM AuditLog WHERE 1=1';
        const params = [];

        if (filters?.entity) {
            query += ' AND entity = ?';
            params.push(filters.entity);
        }

        if (filters?.entityId) {
            query += ' AND entityId = ?';
            params.push(filters.entityId);
        }

        query += ' ORDER BY createdAt DESC LIMIT 100';

        return db.all(query, params);
    }
}

export const auditService = new AuditService();
