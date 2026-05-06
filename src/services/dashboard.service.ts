import { query } from '@/lib/db';
import { getCompanyId } from '@/lib/companyContext';

export class DashboardService {
    constructor() {}

    private async getCompanyContext() {
        const companyId = await getCompanyId();
        if (!companyId) throw new Error("Unauthorized");
        return companyId;
    }

    async getStats() {
        const companyId = await this.getCompanyContext();
        
        const [
            [{ count: totalEmployees }],
            [{ count: totalShifts }],
            [{ count: totalSites }],
            [{ count: activeAbsences }]
        ] = await Promise.all([
            query<any[]>('SELECT COUNT(*) as count FROM Employee WHERE companyId = ? AND isActive = 1', [companyId]),
            query<any[]>('SELECT COUNT(*) as count FROM Shift WHERE companyId = ?', [companyId]),
            query<any[]>('SELECT COUNT(*) as count FROM Site WHERE companyId = ?', [companyId]),
            query<any[]>('SELECT COUNT(*) as count FROM Absence WHERE companyId = ? AND status = ?', [companyId, 'PENDING_APPROVAL'])
        ]);

        const sql = `
            SELECT s.*, 
                   e.id as emp_id, e.firstName, e.lastName, e.identification
            FROM Shift s
            LEFT JOIN Employee e ON s.employeeId = e.id
            WHERE s.companyId = ?
            ORDER BY s.date DESC
            LIMIT 5
        `;
        const shiftRows = await query<any[]>(sql, [companyId]);
        const recentShifts = shiftRows.map(r => {
            const { emp_id, firstName, lastName, identification, ...shiftData } = r;
            return {
                ...shiftData,
                employee: emp_id ? { id: emp_id, firstName, lastName, identification } : null
            };
        });

        return {
            totalEmployees,
            totalShifts,
            totalSites,
            activeAbsences,
            recentShifts
        };
    }
}

export function getDashboardService(dataDir: string): DashboardService {
    return new DashboardService();
}