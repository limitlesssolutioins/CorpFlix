import prisma from '@/lib/prisma';
import { getCompanyId } from '@/lib/companyContext';

export class CatalogService {
    constructor() {}

    private async getCompanyContext() {
        const companyId = await getCompanyId();
        if (!companyId) throw new Error("Unauthorized");
        return companyId;
    }

    async getSites() {
        const companyId = await this.getCompanyContext();
        return await prisma.site.findMany({ where: { companyId }, orderBy: { name: 'asc' } });
    }

    async addSite(data: any) {
        const companyId = await this.getCompanyContext();
        return await prisma.site.create({
            data: { companyId, name: data.name, address: data.address }
        });
    }

    async getPositions() {
        const companyId = await this.getCompanyContext();
        return await prisma.position.findMany({ where: { companyId }, orderBy: { name: 'asc' } });
    }

    async addPosition(data: any) {
        const companyId = await this.getCompanyContext();
        return await prisma.position.create({
            data: { companyId, name: data.name }
        });
    }

    async getAbsenceTypes() {
        const companyId = await this.getCompanyContext();
        return await prisma.absenceType.findMany({ where: { companyId }, orderBy: { name: 'asc' } });
    }
}

export function getCatalogService(dataDir: string): CatalogService {
    return new CatalogService();
}