import db from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export class AbsencesService {
    async findAll() {
        return db.all(`
      SELECT a.*, e.firstName, e.lastName, at.name as absenceTypeName
      FROM Absence a
      JOIN Employee e ON a.employeeId = e.id
      JOIN AbsenceType at ON a.absenceTypeCode = at.code
      ORDER BY a.startDate DESC
    `);
    }

    async create(data: any) {
        const id = uuidv4();
        await db.run(`
      INSERT INTO Absence (
        id, employeeId, absenceTypeCode, startDate, endDate,
        diagnosisCode, medicalCertificateUrl, status, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDING_APPROVAL', datetime('now'))
    `, [
            id, data.employeeId, data.absenceTypeCode, data.startDate, data.endDate,
            data.diagnosisCode, data.medicalCertificateUrl
        ]);

        return db.get('SELECT * FROM Absence WHERE id = ?', [id]);
    }
}

export const absencesService = new AbsencesService();
