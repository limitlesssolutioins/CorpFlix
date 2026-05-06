import { query } from '@/lib/db';
import { getCompanyId } from '@/lib/companyContext';
import { v4 as uuidv4 } from 'uuid';

export class AbsencesService {
    constructor() {}

    private async getCompanyContext() {
        const companyId = await getCompanyId();
        if (!companyId) throw new Error("Unauthorized");
        return companyId;
    }

    async getAbsences() {
        const companyId = await this.getCompanyContext();
        const sql = `
            SELECT a.*, 
                   e.id as emp_id, e.firstName, e.lastName, e.identification,
                   t.id as type_id, t.name as typeName, t.isPaid
            FROM Absence a
            LEFT JOIN Employee e ON a.employeeId = e.id
            LEFT JOIN AbsenceType t ON a.typeId = t.id
            WHERE a.companyId = ?
            ORDER BY a.startDate DESC
        `;
        const rows = await query<any[]>(sql, [companyId]);
        return rows.map(r => {
            const { emp_id, firstName, lastName, identification, type_id, typeName, isPaid, ...absenceData } = r;
            return {
                ...absenceData,
                employee: emp_id ? { id: emp_id, firstName, lastName, identification } : null,
                type: type_id ? { id: type_id, name: typeName, isPaid: !!isPaid } : null
            };
        });
    }

    async createAbsence(data: any) {
        const companyId = await this.getCompanyContext();
        const id = uuidv4();
        await query(
            'INSERT INTO Absence (id, companyId, employeeId, typeId, startDate, endDate, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [
                id,
                companyId,
                data.employeeId,
                data.typeId,
                new Date(data.startDate),
                new Date(data.endDate),
                data.status || 'PENDING_APPROVAL',
                data.notes || null
            ]
        );
        const rows = await query<any[]>('SELECT * FROM Absence WHERE id = ?', [id]);
        return rows[0];
    }

    async updateStatus(id: string, status: string) {
        const companyId = await this.getCompanyContext();
        await query('UPDATE Absence SET status = ? WHERE id = ? AND companyId = ?', [status, id, companyId]);
        return { count: 1 };
    }
}

export function getAbsencesService(dataDir: string): AbsencesService {
    return new AbsencesService();
}