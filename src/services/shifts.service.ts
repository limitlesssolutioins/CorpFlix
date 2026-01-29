import db from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export class ShiftsService {
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

        const params = [];

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

        const shifts = await db.all(query, params);

        // Add employee object for frontend compatibility
        return shifts.map(s => ({
            ...s,
            employee: {
                firstName: s.firstName,
                lastName: s.lastName
            }
        }));
    }

    async create(data: any) {
        const id = uuidv4();
        await db.run(`
      INSERT INTO Shift (
        id, employeeId, siteId, positionId, startTime, endTime,
        conflictStatus, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, 'NONE', datetime('now'))
    `, [id, data.employeeId, data.siteId, data.positionId, data.startTime, data.endTime]);

        // Log audit
        await this.logAudit('Shift', id, 'CREATE', `Created shift for employee ${data.employeeId}`);

        return this.findOne(id);
    }

    async findOne(id: string) {
        const shift = await db.get(`
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
        const fields = [];
        const values = [];

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

        await db.run(`UPDATE Shift SET ${fields.join(', ')} WHERE id = ?`, values);
        await this.logAudit('Shift', id, 'UPDATE', 'Updated shift');

        return this.findOne(id);
    }

    async remove(id: string) {
        await db.run('DELETE FROM Shift WHERE id = ?', [id]);
        await this.logAudit('Shift', id, 'DELETE', 'Deleted shift');
        return { deleted: true };
    }

    async bulkDelete(ids: string[]) {
        const placeholders = ids.map(() => '?').join(',');
        await db.run(`DELETE FROM Shift WHERE id IN (${placeholders})`, ids);
        await this.logAudit('Shift', 'bulk', 'DELETE', `Deleted ${ids.length} shifts`);
        return { deleted: ids.length };
    }

    private async logAudit(entity: string, entityId: string, action: string, details: string) {
        const id = uuidv4();
        await db.run(`
      INSERT INTO AuditLog (id, entity, entityId, action, details, performedBy, createdAt)
      VALUES (?, ?, ?, ?, ?, 'Sistema', datetime('now'))
    `, [id, entity, entityId, action, details]);
    }
}

export const shiftsService = new ShiftsService();
