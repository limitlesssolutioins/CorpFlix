import db from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export class SchedulerService {
    async getTeams() {
        const teams = await db.all('SELECT * FROM Team ORDER BY name');

        // Get employees for each team
        for (const team of teams) {
            team.employees = await db.all(
                'SELECT id, firstName, lastName FROM Employee WHERE teamId = ? AND isActive = 1',
                [team.id]
            );
        }

        return teams;
    }

    async createTeam(data: any) {
        const id = uuidv4();
        await db.run('INSERT INTO Team (id, name) VALUES (?, ?)', [id, data.name]);
        return db.get('SELECT * FROM Team WHERE id = ?', [id]);
    }

    async getPatterns() {
        return db.all('SELECT * FROM ShiftPattern ORDER BY createdAt DESC');
    }

    async createPattern(data: any) {
        const id = uuidv4();
        await db.run(
            'INSERT INTO ShiftPattern (id, name, description, sequence, createdAt) VALUES (?, ?, ?, ?, datetime("now"))',
            [id, data.name, data.description, JSON.stringify(data.sequence)]
        );
        return db.get('SELECT * FROM ShiftPattern WHERE id = ?', [id]);
    }

    async generateSchedule(data: any) {
        // This would contain the complex logic for generating shifts based on patterns
        // For now, return success
        return { success: true, message: 'Schedule generation logic to be implemented' };
    }
}

export const schedulerService = new SchedulerService();
