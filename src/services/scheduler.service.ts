import { v4 as uuidv4 } from 'uuid';
import { query } from '@/lib/db';
import { getCompanyId } from '@/lib/companyContext';

export class SchedulerService {
    constructor() {}

    private async getCompanyContext() {
        const companyId = await getCompanyId();
        if (!companyId) throw new Error("Unauthorized");
        return companyId;
    }

    async getTeams() {
        const companyId = await this.getCompanyContext();
        
        const teams = await query<any[]>(
            'SELECT * FROM Team WHERE companyId = ? ORDER BY name ASC',
            [companyId]
        );
        
        if (teams.length === 0) return [];
        
        const teamIds = teams.map(t => t.id);
        const placeholders = teamIds.map(() => '?').join(',');
        
        const employees = await query<any[]>(
            `SELECT * FROM Employee WHERE teamId IN (${placeholders}) AND companyId = ? AND isActive = 1`,
            [...teamIds, companyId]
        );
        
        const employeesByTeam = employees.reduce((acc: any, emp: any) => {
            if (!acc[emp.teamId]) acc[emp.teamId] = [];
            acc[emp.teamId].push(emp);
            return acc;
        }, {});
        
        return teams.map(t => ({
            ...t,
            employees: employeesByTeam[t.id] || []
        }));
    }

    async createTeam(data: any) {
        const companyId = await this.getCompanyContext();
        const id = uuidv4();
        await query(
            'INSERT INTO Team (id, companyId, name, createdAt) VALUES (?, ?, ?, NOW())',
            [id, companyId, data.name]
        );
        const teams = await query<any[]>('SELECT * FROM Team WHERE id = ?', [id]);
        return teams[0];
    }

    async getPatterns() {
        const companyId = await this.getCompanyContext();
        return await query<any[]>(
            'SELECT * FROM ShiftPattern WHERE companyId = ? ORDER BY createdAt DESC',
            [companyId]
        );
    }

    async createPattern(data: any) {
        const companyId = await this.getCompanyContext();
        const id = uuidv4();
        const daysStr = typeof data.days === 'string' ? data.days : JSON.stringify(data.days);
        
        await query(
            'INSERT INTO ShiftPattern (id, companyId, name, startTime, endTime, days, createdAt) VALUES (?, ?, ?, ?, ?, ?, NOW())',
            [id, companyId, data.name, data.startTime, data.endTime, daysStr]
        );
        
        const patterns = await query<any[]>('SELECT * FROM ShiftPattern WHERE id = ?', [id]);
        return patterns[0];
    }

    async assignPattern(employeeId: string, patternId: string) {
        // Since patternId isn't on the Employee model directly,
        // this typically involves generating actual shifts based on the pattern,
        // or updating a field if it exists. For now, returning a stub success.
        return { success: true, employeeId, patternId };
    }

    async getShiftsByTeamAndDate(teamId: string, startDate: string, endDate: string) {
        const companyId = await this.getCompanyContext();
        
        const sql = `
            SELECT s.*, 
                   e.id as emp_id, e.firstName, e.lastName, e.identification, e.teamId
            FROM Shift s
            JOIN Employee e ON s.employeeId = e.id
            WHERE s.companyId = ? 
              AND e.teamId = ?
              AND s.date >= ? 
              AND s.date <= ?
        `;
        
        const shifts = await query<any[]>(sql, [
            companyId, 
            teamId, 
            new Date(startDate), 
            new Date(endDate)
        ]);
        
        return shifts.map(s => {
            const { emp_id, firstName, lastName, identification, teamId, ...shiftData } = s;
            return {
                ...shiftData,
                employee: emp_id ? { id: emp_id, firstName, lastName, identification, teamId } : null
            };
        });
    }

    async deleteShiftsForTeam(teamId: string, startDate: string, endDate: string) {
        const companyId = await this.getCompanyContext();
        
        // Find employees first
        const employees = await query<any[]>(
            'SELECT id FROM Employee WHERE companyId = ? AND teamId = ?',
            [companyId, teamId]
        );
        const employeeIds = employees.map(e => e.id);

        if (employeeIds.length === 0) return true;
        
        const placeholders = employeeIds.map(() => '?').join(',');
        
        const sql = `
            DELETE FROM Shift
            WHERE companyId = ? 
              AND employeeId IN (${placeholders})
              AND date >= ?
              AND date <= ?
        `;
        
        await query(sql, [companyId, ...employeeIds, new Date(startDate), new Date(endDate)]);
        return true;
    }

    generateSchedule(body: any) { return null as any; }
}

export function getSchedulerService(dataDir: string): SchedulerService {
    return new SchedulerService();
}
