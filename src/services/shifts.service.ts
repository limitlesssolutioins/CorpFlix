import { query } from '@/lib/db';
import { getCompanyId } from '@/lib/companyContext';
import { v4 as uuidv4 } from 'uuid';

export class ShiftsService {
    constructor() {}

    private async getCompanyContext() {
        const companyId = await getCompanyId();
        if (!companyId) throw new Error("Unauthorized");
        return companyId;
    }

    async getShifts(filters?: { startDate?: string; endDate?: string; employeeId?: string }) {
        const companyId = await this.getCompanyContext();
        
        let sql = `
            SELECT s.*, 
                   e.id as emp_id, e.firstName, e.lastName, e.identification,
                   p.id as pat_id, p.name as pat_name, p.startTime as pat_start, p.endTime as pat_end
            FROM Shift s
            LEFT JOIN Employee e ON s.employeeId = e.id
            LEFT JOIN ShiftPattern p ON s.patternId = p.id
            WHERE s.companyId = ?
        `;
        const params: any[] = [companyId];

        if (filters?.startDate) {
            sql += ` AND s.date >= ?`;
            params.push(new Date(filters.startDate));
        }
        if (filters?.endDate) {
            sql += ` AND s.date <= ?`;
            params.push(new Date(filters.endDate));
        }
        if (filters?.employeeId) {
            sql += ` AND s.employeeId = ?`;
            params.push(filters.employeeId);
        }

        sql += ` ORDER BY s.date ASC`;

        const shifts = await query<any[]>(sql, params);
        
        return shifts.map(s => {
            const { 
                emp_id, firstName, lastName, identification,
                pat_id, pat_name, pat_start, pat_end, 
                ...shiftData 
            } = s;
            
            return {
                ...shiftData,
                employee: emp_id ? { id: emp_id, firstName, lastName, identification } : null,
                pattern: pat_id ? { id: pat_id, name: pat_name, startTime: pat_start, endTime: pat_end } : null
            };
        });
    }

    async createShift(data: any) {
        const companyId = await this.getCompanyContext();
        const id = uuidv4();
        
        const sql = `
            INSERT INTO Shift (id, companyId, employeeId, patternId, date, startTime, endTime, status, createdAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `;
        const params = [
            id, 
            companyId, 
            data.employeeId, 
            data.patternId || null, 
            new Date(data.date), 
            new Date(data.startTime), 
            new Date(data.endTime), 
            data.status || 'SCHEDULED'
        ];
        
        await query(sql, params);
        const newShifts = await query<any[]>('SELECT * FROM Shift WHERE id = ?', [id]);
        return newShifts[0];
    }

    async updateShift(id: string, data: any) {
        const companyId = await this.getCompanyContext();
        
        const updates: string[] = [];
        const params: any[] = [];

        if (data.startTime) {
            updates.push('startTime = ?');
            params.push(new Date(data.startTime));
        }
        if (data.endTime) {
            updates.push('endTime = ?');
            params.push(new Date(data.endTime));
        }
        if (data.status) {
            updates.push('status = ?');
            params.push(data.status);
        }

        if (updates.length === 0) return { count: 0 };

        params.push(id, companyId);
        const sql = `UPDATE Shift SET ${updates.join(', ')} WHERE id = ? AND companyId = ?`;
        
        await query(sql, params);
        return { count: 1 };
    }

    async deleteShift(id: string) {
        const companyId = await this.getCompanyContext();
        await query('DELETE FROM Shift WHERE id = ? AND companyId = ?', [id, companyId]);
        return true;
    }

    async bulkDeleteShifts(ids: string[]) {
        const companyId = await this.getCompanyContext();
        if (ids.length === 0) return true;
        
        const placeholders = ids.map(() => '?').join(',');
        const sql = `DELETE FROM Shift WHERE id IN (${placeholders}) AND companyId = ?`;
        
        await query(sql, [...ids, companyId]);
        return true;
    }

    async getPreBillingData(startDate: string, endDate: string) {
        const companyId = await this.getCompanyContext();
        const sql = `
            SELECT s.*, e.id as emp_id, e.firstName, e.lastName, e.identification
            FROM Shift s
            JOIN Employee e ON s.employeeId = e.id
            WHERE s.companyId = ? AND s.date >= ? AND s.date <= ?
        `;
        
        const shifts = await query<any[]>(sql, [
            companyId, 
            new Date(startDate), 
            new Date(endDate)
        ]);
        
        return shifts.map(s => {
            const { emp_id, firstName, lastName, identification, ...shiftData } = s;
            return {
                ...shiftData,
                employee: { id: emp_id, firstName, lastName, identification }
            };
        });
    }
}

export function getShiftsService(dataDir: string): ShiftsService {
    return new ShiftsService();
}
