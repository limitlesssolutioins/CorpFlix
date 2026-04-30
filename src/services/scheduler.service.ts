import prisma from '@/lib/prisma';
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
        return await prisma.team.findMany({
            where: { companyId },
            include: { employees: true },
            orderBy: { name: 'asc' }
        });
    }

    async createTeam(data: any) {
        const companyId = await this.getCompanyContext();
        return await prisma.team.create({
            data: { companyId, name: data.name }
        });
    }

    async getPatterns() {
        const companyId = await this.getCompanyContext();
        return await prisma.shiftPattern.findMany({
            where: { companyId },
            orderBy: { createdAt: 'desc' }
        });
    }

    async createPattern(data: any) {
        const companyId = await this.getCompanyContext();
        return await prisma.shiftPattern.create({
            data: {
                companyId,
                name: data.name,
                startTime: data.startTime,
                endTime: data.endTime,
                days: typeof data.days === 'string' ? data.days : JSON.stringify(data.days)
            }
        });
    }

    async assignPattern(employeeId: string, patternId: string) {
        // Since patternId isn't on the Employee model directly,
        // this typically involves generating actual shifts based on the pattern,
        // or updating a field if it exists. For now, returning a stub success.
        return { success: true, employeeId, patternId };
    }

    async getShiftsByTeamAndDate(teamId: string, startDate: string, endDate: string) {
        const companyId = await this.getCompanyContext();
        return await prisma.shift.findMany({
            where: {
                companyId,
                employee: { teamId },
                date: {
                    gte: new Date(startDate),
                    lte: new Date(endDate)
                }
            },
            include: { employee: true }
        });
    }

    async deleteShiftsForTeam(teamId: string, startDate: string, endDate: string) {
        const companyId = await this.getCompanyContext();
        
        // Find employees first
        const employees = await prisma.employee.findMany({
            where: { companyId, teamId },
            select: { id: true }
        });
        const employeeIds = employees.map(e => e.id);

        if (employeeIds.length === 0) return true;

        await prisma.shift.deleteMany({
            where: {
                companyId,
                employeeId: { in: employeeIds },
                date: {
                    gte: new Date(startDate),
                    lte: new Date(endDate)
                }
            }
        });
        return true;
    }
}

export function getSchedulerService(dataDir: string): SchedulerService {
    return new SchedulerService();
}