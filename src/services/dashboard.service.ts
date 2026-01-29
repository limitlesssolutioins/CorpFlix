import db from '@/lib/db';

export class DashboardService {
    async getStats() {
        const totalEmployees = await db.get('SELECT COUNT(*) as count FROM Employee WHERE isActive = 1');
        const totalShifts = await db.get('SELECT COUNT(*) as count FROM Shift WHERE date(startTime) >= date("now", "start of month")');
        const totalSites = await db.get('SELECT COUNT(*) as count FROM Site');
        const activeAbsences = await db.get('SELECT COUNT(*) as count FROM Absence WHERE status = "PENDING_APPROVAL"');

        const recentShifts = await db.all(`
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

export const dashboardService = new DashboardService();
