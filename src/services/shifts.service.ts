import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const { getDb } = require('@/lib/db');

export class ShiftsService {
    private db: any;

    constructor(dataDir: string) {
        this.db = getDb(path.join(dataDir, 'hr.db'));
    }

    async findAll(filters?: any) {
        let query = `
      SELECT s.*,
             e.firstName, e.lastName,
             si.name as siteName,
             p.name as positionName
      FROM Shift s
      JOIN Employee e ON s.employeeId = e.id
      JOIN Site si ON s.siteId = si.id
      JOIN Position p ON s.positionId = p.id
      WHERE 1=1
    `;

        const params: any[] = [];

        if (filters?.employeeId) {
            query += ' AND s.employeeId = ?';
            params.push(filters.employeeId);
        }

        if (filters?.siteId) {
            query += ' AND s.siteId = ?';
            params.push(filters.siteId);
        }

        if (filters?.startDate) {
            query += ' AND date(s.startTime) >= date(?)';
            params.push(filters.startDate);
        }

        if (filters?.endDate) {
            query += ' AND date(s.endTime) <= date(?)';
            params.push(filters.endDate);
        }

        query += ' ORDER BY s.startTime DESC';

        const shifts = await this.db.all(query, params);

        return shifts.map((s: any) => ({
            ...s,
            employee: {
                firstName: s.firstName,
                lastName: s.lastName
            }
        }));
    }

    async create(data: any) {
        const id = uuidv4();
        await this.db.run(`
      INSERT INTO Shift (
        id, employeeId, siteId, positionId, startTime, endTime,
        conflictStatus, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, 'NONE', datetime('now'))
    `, [id, data.employeeId, data.siteId, data.positionId, data.startTime, data.endTime]);

        await this.logAudit('Shift', id, 'CREATE', `Created shift for employee ${data.employeeId}`);

        return this.findOne(id);
    }

    async findOne(id: string) {
        const shift = await this.db.get(`
      SELECT s.*,
             e.firstName, e.lastName,
             si.name as siteName,
             p.name as positionName
      FROM Shift s
      JOIN Employee e ON s.employeeId = e.id
      JOIN Site si ON s.siteId = si.id
      JOIN Position p ON s.positionId = p.id
      WHERE s.id = ?
    `, [id]);

        if (shift) {
            shift.employee = {
                firstName: shift.firstName,
                lastName: shift.lastName
            };
        }

        return shift;
    }

    async update(id: string, data: any) {
        const fields: string[] = [];
        const values: any[] = [];

        if (data.startTime) {
            fields.push('startTime = ?');
            values.push(data.startTime);
        }
        if (data.endTime) {
            fields.push('endTime = ?');
            values.push(data.endTime);
        }
        if (data.siteId) {
            fields.push('siteId = ?');
            values.push(data.siteId);
        }
        if (data.positionId) {
            fields.push('positionId = ?');
            values.push(data.positionId);
        }

        values.push(id);

        await this.db.run(`UPDATE Shift SET ${fields.join(', ')} WHERE id = ?`, values);
        await this.logAudit('Shift', id, 'UPDATE', 'Updated shift');

        return this.findOne(id);
    }

    async remove(id: string) {
        await this.db.run('DELETE FROM Shift WHERE id = ?', [id]);
        await this.logAudit('Shift', id, 'DELETE', 'Deleted shift');
        return { deleted: true };
    }

    async bulkDelete(ids: string[]) {
        const placeholders = ids.map(() => '?').join(',');
        await this.db.run(`DELETE FROM Shift WHERE id IN (${placeholders})`, ids);
        await this.logAudit('Shift', 'bulk', 'DELETE', `Deleted ${ids.length} shifts`);
        return { deleted: ids.length };
    }

    private async logAudit(entity: string, entityId: string, action: string, details: string) {
        const id = uuidv4();
        await this.db.run(`
      INSERT INTO AuditLog (id, entity, entityId, action, details, performedBy, createdAt)
      VALUES (?, ?, ?, ?, ?, 'Sistema', datetime('now'))
    `, [id, entity, entityId, action, details]);
    }
}

const instances = new Map<string, ShiftsService>();

export function getShiftsService(dataDir: string): ShiftsService {
    if (!instances.has(dataDir)) {
        instances.set(dataDir, new ShiftsService(dataDir));
    }
    return instances.get(dataDir)!;
}
