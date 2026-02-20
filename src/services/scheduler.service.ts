import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const { getDb } = require('@/lib/db');

export class SchedulerService {
    private db: any;

    constructor(dataDir: string) {
        this.db = getDb(path.join(dataDir, 'hr.db'));
    }

    async getTeams() {
        const teams = await this.db.all('SELECT * FROM Team ORDER BY name');

        for (const team of teams) {
            team.employees = await this.db.all(
                'SELECT id, firstName, lastName FROM Employee WHERE teamId = ? AND isActive = 1',
                [team.id]
            );
        }

        return teams;
    }

    async createTeam(data: any) {
        const id = uuidv4();
        await this.db.run('INSERT INTO Team (id, name) VALUES (?, ?)', [id, data.name]);
        return this.db.get('SELECT * FROM Team WHERE id = ?', [id]);
    }

    async getPatterns() {
        return this.db.all('SELECT * FROM ShiftPattern ORDER BY createdAt DESC');
    }

    async createPattern(data: any) {
        const id = uuidv4();
        await this.db.run(
            'INSERT INTO ShiftPattern (id, name, description, sequence, createdAt) VALUES (?, ?, ?, ?, datetime("now"))',
            [id, data.name, data.description, JSON.stringify(data.sequence)]
        );
        return this.db.get('SELECT * FROM ShiftPattern WHERE id = ?', [id]);
    }

    async generateSchedule(data: any) {
        return { success: true, message: 'Schedule generation logic to be implemented' };
    }
}

const instances = new Map<string, SchedulerService>();

export function getSchedulerService(dataDir: string): SchedulerService {
    if (!instances.has(dataDir)) {
        instances.set(dataDir, new SchedulerService(dataDir));
    }
    return instances.get(dataDir)!;
}
