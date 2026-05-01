import { v4 as uuidv4 } from 'uuid';
import { query } from '@/lib/db';
import { getCompanyId } from '@/lib/companyContext';

export class PayrollService {
    constructor() {}

    private async getCompanyContext() {
        const companyId = await getCompanyId();
        if (!companyId) throw new Error("Unauthorized");
        return companyId;
    }

    async getDashboardStats() {
        const companyId = await this.getCompanyContext();
        return {
            totalPayroll: 0,
            activeEmployees: 0,
            upcomingPayments: 0,
            lastProcessed: null
        };
    }

    async getPayrollRecords(filters?: { periodStart?: string; periodEnd?: string }) {
        const companyId = await this.getCompanyContext();
        
        let sql = 'SELECT * FROM Payroll WHERE companyId = ?';
        const params: any[] = [companyId];
        
        // Potential logic for filters could be added here if needed
        sql += ' ORDER BY periodStart DESC';
        
        const payrolls = await query<any[]>(sql, params);
        
        if (payrolls.length === 0) return [];
        
        const payrollIds = payrolls.map(p => p.id);
        const placeholders = payrollIds.map(() => '?').join(',');
        
        const recordsSql = `
            SELECT pr.*, 
                   e.id as emp_id, e.firstName, e.lastName, e.identification
            FROM PayrollRecord pr
            LEFT JOIN Employee e ON pr.employeeId = e.id
            WHERE pr.payrollId IN (${placeholders})
        `;
        
        const records = await query<any[]>(recordsSql, payrollIds);
        
        // Group records by payrollId
        const recordsByPayroll = records.reduce((acc: any, r: any) => {
            if (!acc[r.payrollId]) {
                acc[r.payrollId] = [];
            }
            
            const { emp_id, firstName, lastName, identification, ...recordData } = r;
            
            acc[r.payrollId].push({
                ...recordData,
                employee: emp_id ? {
                    id: emp_id,
                    firstName,
                    lastName,
                    identification
                } : null
            });
            return acc;
        }, {});
        
        return payrolls.map(p => ({
            ...p,
            records: recordsByPayroll[p.id] || []
        }));
    }

    async calculatePayroll(startDate: string, endDate: string) {
        const companyId = await this.getCompanyContext();
        const id = uuidv4();
        
        const sql = `
            INSERT INTO Payroll (id, companyId, periodStart, periodEnd, status, createdAt)
            VALUES (?, ?, ?, ?, 'DRAFT', NOW())
        `;
        await query(sql, [id, companyId, new Date(startDate), new Date(endDate)]);
        
        const payrolls = await query<any[]>('SELECT * FROM Payroll WHERE id = ?', [id]);
        return payrolls[0];
    }
}

export function getPayrollService(dataDir: string): PayrollService {
    return new PayrollService();
}
