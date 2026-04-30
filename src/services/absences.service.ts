import prisma from '@/lib/prisma';
import { getCompanyId } from '@/lib/companyContext';

export class AbsencesService {
    constructor() {}

    private async getCompanyContext() {
        const companyId = await getCompanyId();
        if (!companyId) throw new Error("Unauthorized");
        return companyId;
    }

    async getAbsences() {
        const companyId = await this.getCompanyContext();
        return await prisma.absence.findMany({
            where: { companyId },
            include: { employee: true, type: true },
            orderBy: { startDate: 'desc' }
        });
    }

    async createAbsence(data: any) {
        const companyId = await this.getCompanyContext();
        return await prisma.absence.create({
            data: {
                companyId,
                employeeId: data.employeeId,
                typeId: data.typeId,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
                status: data.status || 'PENDING_APPROVAL',
                notes: data.notes
            }
        });
    }

    async updateStatus(id: string, status: string) {
        const companyId = await this.getCompanyContext();
        return await prisma.absence.updateMany({
            where: { id, companyId },
            data: { status }
        });
    }
}

export function getAbsencesService(dataDir: string): AbsencesService {
    return new AbsencesService();
}