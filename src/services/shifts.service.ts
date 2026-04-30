import prisma from '@/lib/prisma';
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
        let whereClause: any = { companyId };

        if (filters?.startDate || filters?.endDate) {
            whereClause.date = {};
            if (filters.startDate) whereClause.date.gte = new Date(filters.startDate);
            if (filters.endDate) whereClause.date.lte = new Date(filters.endDate);
        }
        if (filters?.employeeId) {
            whereClause.employeeId = filters.employeeId;
        }

        return await prisma.shift.findMany({
            where: whereClause,
            include: { employee: true, pattern: true },
            orderBy: { date: 'asc' }
        });
    }

    async createShift(data: any) {
        const companyId = await this.getCompanyContext();
        return await prisma.shift.create({
            data: {
                companyId,
                employeeId: data.employeeId,
                patternId: data.patternId,
                date: new Date(data.date),
                startTime: new Date(data.startTime),
                endTime: new Date(data.endTime),
                status: data.status || 'SCHEDULED'
            }
        });
    }

    async updateShift(id: string, data: any) {
        const companyId = await this.getCompanyContext();
        
        const updateData: any = {};
        if (data.startTime) updateData.startTime = new Date(data.startTime);
        if (data.endTime) updateData.endTime = new Date(data.endTime);
        if (data.status) updateData.status = data.status;

        return await prisma.shift.updateMany({
            where: { id, companyId },
            data: updateData
        });
    }

    async deleteShift(id: string) {
        const companyId = await this.getCompanyContext();
        await prisma.shift.deleteMany({
            where: { id, companyId }
        });
        return true;
    }

    async bulkDeleteShifts(ids: string[]) {
        const companyId = await this.getCompanyContext();
        await prisma.shift.deleteMany({
            where: { id: { in: ids }, companyId }
        });
        return true;
    }

    async getPreBillingData(startDate: string, endDate: string) {
        const companyId = await this.getCompanyContext();
        return await prisma.shift.findMany({
            where: {
                companyId,
                date: {
                    gte: new Date(startDate),
                    lte: new Date(endDate)
                }
            },
            include: { employee: true }
        });
    }
}

export function getShiftsService(dataDir: string): ShiftsService {
    return new ShiftsService();
}