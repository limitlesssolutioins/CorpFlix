import prisma from '@/lib/prisma';
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
        
        const [totalEmployees, totalShifts, totalSites, activeAbsences] = await Promise.all([
            prisma.employee.count({ where: { companyId, isActive: true } }),
            prisma.shift.count({ where: { companyId } }),
            prisma.site.count({ where: { companyId } }),
            prisma.absence.count({ where: { companyId, status: 'PENDING_APPROVAL' } })
        ]);

        const recentShifts = await prisma.shift.findMany({
            where: { companyId },
            include: { employee: true },
            orderBy: { date: 'desc' },
            take: 5
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