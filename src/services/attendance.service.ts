import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { getDb } from '@/lib/db';

export class AttendanceService {
    private db: any;

    constructor(dataDir: string) {
        this.db = getDb(path.join(dataDir, 'hr.db'));
    }

    async getEmployeeLogs(employeeId: string) {
        return this.db.all('SELECT * FROM AttendanceLog WHERE employeeId = ? ORDER BY clockIn DESC', [employeeId]);
    }

    async clockIn(data: { employeeId: string, latitude?: number, longitude?: number, method?: string, notes?: string }) {
        const id = uuidv4();
        await this.db.run(`
            INSERT INTO AttendanceLog (id, employeeId, clockIn, latitudeIn, longitudeIn, method, notes)
            VALUES (?, ?, datetime('now'), ?, ?, ?, ?)
        `, [id, data.employeeId, data.latitude, data.longitude, data.method || 'MANUAL', data.notes]);
        return this.db.get('SELECT * FROM AttendanceLog WHERE id = ?', [id]);
    }

    async clockOut(id: string, data: { latitude?: number, longitude?: number, notes?: string }) {
        await this.db.run(`
            UPDATE AttendanceLog 
            SET clockOut = datetime('now'), 
                latitudeOut = ?, 
                longitudeOut = ?, 
                notes = COALESCE(notes || ' | ' || ?, notes, ?)
            WHERE id = ?
        `, [data.latitude, data.longitude, data.notes, data.notes, id]);
        return this.db.get('SELECT * FROM AttendanceLog WHERE id = ?', [id]);
    }

    async getActiveLog(employeeId: string) {
        return this.db.get('SELECT * FROM AttendanceLog WHERE employeeId = ? AND clockOut IS NULL ORDER BY clockIn DESC LIMIT 1', [employeeId]);
    }
}

const instances = new Map<string, AttendanceService>();

export function getAttendanceService(dataDir: string): AttendanceService {
    if (!instances.has(dataDir)) {
        instances.set(dataDir, new AttendanceService(dataDir));
    }
    return instances.get(dataDir)!;
}
