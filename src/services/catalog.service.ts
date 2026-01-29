import db from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export class CatalogService {
    async getSites() {
        return db.all('SELECT * FROM Site ORDER BY name');
    }

    async createSite(data: any) {
        const id = uuidv4();
        await db.run('INSERT INTO Site (id, name, address) VALUES (?, ?, ?)',
            [id, data.name, data.address]);
        return db.get('SELECT * FROM Site WHERE id = ?', [id]);
    }

    async getPositions() {
        return db.all('SELECT * FROM Position ORDER BY name');
    }

    async createPosition(data: any) {
        const id = uuidv4();
        await db.run('INSERT INTO Position (id, name) VALUES (?, ?)', [id, data.name]);
        return db.get('SELECT * FROM Position WHERE id = ?', [id]);
    }

    async getConstants() {
        const absenceTypes = await db.all('SELECT * FROM AbsenceType ORDER BY code');
        return { absenceTypes };
    }
}

export const catalogService = new CatalogService();
