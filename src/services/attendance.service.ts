import { query } from '@/lib/db';
import { getCompanyId } from '@/lib/companyContext';
import { v4 as uuidv4 } from 'uuid';

export class AttendanceService {
    constructor() {}

    private async getCompanyContext() {
        const companyId = await getCompanyId();
        if (!companyId) throw new Error("Unauthorized");
        return companyId;
    }

    async getLogs(employeeId: string) {
        const companyId = await this.getCompanyContext();
        return await query<any[]>('SELECT * FROM AttendanceLog WHERE companyId = ? AND employeeId = ? ORDER BY clockIn DESC', [companyId, employeeId]);
    }

    async clockIn(employeeId: string) {
        const companyId = await this.getCompanyContext();
        const id = uuidv4();
        await query(
            'INSERT INTO AttendanceLog (id, companyId, employeeId, clockIn, status) VALUES (?, ?, ?, ?, ?)',
            [id, companyId, employeeId, new Date(), 'ON_TIME']
        );
        const rows = await query<any[]>('SELECT * FROM AttendanceLog WHERE id = ?', [id]);
        return rows[0];
    }

    async clockOut(id: string) {
        const companyId = await this.getCompanyContext();
        await query('UPDATE AttendanceLog SET clockOut = ? WHERE id = ? AND companyId = ?', [new Date(), id, companyId]);
        return { count: 1 };
    }

    async getActive(employeeId: string) {
        const companyId = await this.getCompanyContext();
        const rows = await query<any[]>('SELECT * FROM AttendanceLog WHERE companyId = ? AND employeeId = ? AND clockOut IS NULL ORDER BY clockIn DESC LIMIT 1', [companyId, employeeId]);
        return rows[0] || null;
    }
}

export function getAttendanceService(dataDir: string): AttendanceService {
    return new AttendanceService();
}