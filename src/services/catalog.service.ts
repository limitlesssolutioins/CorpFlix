import { query } from '@/lib/db';
import { getCompanyId } from '@/lib/companyContext';
import { v4 as uuidv4 } from 'uuid';

export class CatalogService {
    constructor() {}

    private async getCompanyContext() {
        const companyId = await getCompanyId();
        if (!companyId) throw new Error("Unauthorized");
        return companyId;
    }

    async getSites() {
        const companyId = await this.getCompanyContext();
        return await query<any[]>('SELECT * FROM Site WHERE companyId = ? ORDER BY name ASC', [companyId]);
    }

    async addSite(data: any) {
        const companyId = await this.getCompanyContext();
        const id = uuidv4();
        await query(
            'INSERT INTO Site (id, companyId, name, address) VALUES (?, ?, ?, ?)',
            [id, companyId, data.name, data.address || null]
        );
        const rows = await query<any[]>('SELECT * FROM Site WHERE id = ?', [id]);
        return rows[0];
    }

    async getPositions() {
        const companyId = await this.getCompanyContext();
        return await query<any[]>('SELECT * FROM Position WHERE companyId = ? ORDER BY name ASC', [companyId]);
    }

    async addPosition(data: any) {
        const companyId = await this.getCompanyContext();
        const id = uuidv4();
        await query(
            'INSERT INTO Position (id, companyId, name) VALUES (?, ?, ?)',
            [id, companyId, data.name]
        );
        const rows = await query<any[]>('SELECT * FROM Position WHERE id = ?', [id]);
        return rows[0];
    }

    async getAbsenceTypes() {
        const companyId = await this.getCompanyContext();
        return await query<any[]>('SELECT * FROM AbsenceType WHERE companyId = ? ORDER BY name ASC', [companyId]);
    }
}

export function getCatalogService(dataDir: string): CatalogService {
    return new CatalogService();
}