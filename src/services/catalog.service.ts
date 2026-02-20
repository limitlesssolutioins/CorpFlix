import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const { getDb } = require('@/lib/db');

export class CatalogService {
    private db: any;

    constructor(dataDir: string) {
        this.db = getDb(path.join(dataDir, 'hr.db'));
    }

    async getSites() {
        return this.db.all('SELECT * FROM Site ORDER BY name');
    }

    async createSite(data: any) {
        const id = uuidv4();
        await this.db.run('INSERT INTO Site (id, name, address) VALUES (?, ?, ?)',
            [id, data.name, data.address]);
        return this.db.get('SELECT * FROM Site WHERE id = ?', [id]);
    }

    async getPositions() {
        return this.db.all('SELECT * FROM Position ORDER BY name');
    }

    async createPosition(data: any) {
        const id = uuidv4();
        await this.db.run('INSERT INTO Position (id, name) VALUES (?, ?)', [id, data.name]);
        return this.db.get('SELECT * FROM Position WHERE id = ?', [id]);
    }

    async getConstants() {
        const absenceTypes = await this.db.all('SELECT * FROM AbsenceType ORDER BY code');
        return { absenceTypes };
    }
}

const instances = new Map<string, CatalogService>();

export function getCatalogService(dataDir: string): CatalogService {
    if (!instances.has(dataDir)) {
        instances.set(dataDir, new CatalogService(dataDir));
    }
    return instances.get(dataDir)!;
}
