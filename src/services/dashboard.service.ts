import path from 'path';

const { getDb } = require('@/lib/db');

export class DashboardService {
    private db: any;

    constructor(dataDir: string) {
        this.db = getDb(path.join(dataDir, 'hr.db'));
    }

    async getStats() {
        const totalEmployees = await this.db.get('SELECT COUNT(*) as count FROM Employee WHERE isActive = 1');
        const totalShifts = await this.db.get('SELECT COUNT(*) as count FROM Shift WHERE date(startTime) >= date("now", "start of month")');
        const totalSites = await this.db.get('SELECT COUNT(*) as count FROM Site');
        const activeAbsences = await this.db.get('SELECT COUNT(*) as count FROM Absence WHERE status = "PENDING_APPROVAL"');

        const recentShifts = await this.db.all(`
      SELECT s.*, e.firstName, e.lastName, si.name as siteName
      FROM Shift s
      JOIN Employee e ON s.employeeId = e.id
      JOIN Site si ON s.siteId = si.id
      ORDER BY s.createdAt DESC
      LIMIT 10
    `);

        return {
            totalEmployees: totalEmployees.count,
            totalShifts: totalShifts.count,
            totalSites: totalSites.count,
            activeAbsences: activeAbsences.count,
            recentShifts
        };
    }
}

const instances = new Map<string, DashboardService>();

export function getDashboardService(dataDir: string): DashboardService {
    if (!instances.has(dataDir)) {
        instances.set(dataDir, new DashboardService(dataDir));
    }
    return instances.get(dataDir)!;
}
