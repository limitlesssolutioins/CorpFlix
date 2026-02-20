import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const { getDb } = require('@/lib/db');

export class AbsencesService {
    private db: any;

    constructor(dataDir: string) {
        this.db = getDb(path.join(dataDir, 'hr.db'));
    }

    async findAll() {
        return this.db.all(`
      SELECT a.*, e.firstName, e.lastName, at.name as absenceTypeName
      FROM Absence a
      JOIN Employee e ON a.employeeId = e.id
      JOIN AbsenceType at ON a.absenceTypeCode = at.code
      ORDER BY a.startDate DESC
    `);
    }

    async create(data: any) {
        const id = uuidv4();
        await this.db.run(`
      INSERT INTO Absence (
        id, employeeId, absenceTypeCode, startDate, endDate,
        diagnosisCode, medicalCertificateUrl, status, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDING_APPROVAL', datetime('now'))
    `, [
            id, data.employeeId, data.absenceTypeCode, data.startDate, data.endDate,
            data.diagnosisCode, data.medicalCertificateUrl
        ]);

        return this.db.get('SELECT * FROM Absence WHERE id = ?', [id]);
    }
}

const instances = new Map<string, AbsencesService>();

export function getAbsencesService(dataDir: string): AbsencesService {
    if (!instances.has(dataDir)) {
        instances.set(dataDir, new AbsencesService(dataDir));
    }
    return instances.get(dataDir)!;
}
