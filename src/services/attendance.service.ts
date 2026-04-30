import prisma from '@/lib/prisma';
import { getCompanyId } from '@/lib/companyContext';

export class AttendanceService {
    constructor() {}

    private async getCompanyContext() {
        const companyId = await getCompanyId();
        if (!companyId) throw new Error("Unauthorized");
        return companyId;
    }

    async getLogs(employeeId: string) {
        const companyId = await this.getCompanyContext();
        return await prisma.attendanceLog.findMany({
            where: { companyId, employeeId },
            orderBy: { clockIn: 'desc' }
        });
    }

    async clockIn(employeeId: string) {
        const companyId = await this.getCompanyContext();
        return await prisma.attendanceLog.create({
            data: {
                companyId,
                employeeId,
                clockIn: new Date(),
                status: 'ON_TIME'
            }
        });
    }

    async clockOut(id: string) {
        const companyId = await this.getCompanyContext();
        return await prisma.attendanceLog.updateMany({
            where: { id, companyId },
            data: { clockOut: new Date() }
        });
    }

    async getActive(employeeId: string) {
        const companyId = await this.getCompanyContext();
        return await prisma.attendanceLog.findFirst({
            where: { companyId, employeeId, clockOut: null },
            orderBy: { clockIn: 'desc' }
        });
    }
}

export function getAttendanceService(dataDir: string): AttendanceService {
    return new AttendanceService();
}