import db from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export class EmployeesService {
    async findAll() {
        const employees = await db.all(`
      SELECT e.*, 
             s.name as siteName, 
             p.name as positionName,
             t.name as teamName
      FROM Employee e
      LEFT JOIN Site s ON e.defaultSiteId = s.id
      LEFT JOIN Position p ON e.defaultPositionId = p.id
      LEFT JOIN Team t ON e.teamId = t.id
      WHERE e.isActive = 1
      ORDER BY e.firstName, e.lastName
    `);
        return employees;
    }

    async findOne(id: string) {
        const employee = await db.get(`
      SELECT e.*, 
             s.name as siteName, 
             p.name as positionName,
             t.name as teamName
      FROM Employee e
      LEFT JOIN Site s ON e.defaultSiteId = s.id
      LEFT JOIN Position p ON e.defaultPositionId = p.id
      LEFT JOIN Team t ON e.teamId = t.id
      WHERE e.id = ?
    `, [id]);
        return employee;
    }

    async create(data: any) {
        const id = uuidv4();
        await db.run(`
      INSERT INTO Employee (
        id, firstName, lastName, identification, email, phone,
        contractType, salaryAmount, salaryScheme, startDate,
        epsEntity, arlEntity, pensionEntity,
        defaultSiteId, defaultPositionId, teamId,
        standardStartTime, standardEndTime, standardStartTime2, standardEndTime2,
        workDays, isActive, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, datetime('now'), datetime('now'))
    `, [
            id, data.firstName, data.lastName, data.identification, data.email, data.phone,
            data.contractType, data.salaryAmount, data.salaryScheme, data.startDate,
            data.epsEntity, data.arlEntity, data.pensionEntity,
            data.defaultSiteId, data.defaultPositionId, data.teamId,
            data.standardStartTime, data.standardEndTime, data.standardStartTime2, data.standardEndTime2,
            data.workDays
        ]);

        return this.findOne(id);
    }

    async update(id: string, data: any) {
        const fields = [];
        const values = [];

        Object.keys(data).forEach(key => {
            if (data[key] !== undefined) {
                fields.push(`${key} = ?`);
                values.push(data[key]);
            }
        });

        fields.push('updatedAt = datetime(\'now\')');
        values.push(id);

        await db.run(`
      UPDATE Employee 
      SET ${fields.join(', ')}
      WHERE id = ?
    `, values);

        return this.findOne(id);
    }

    async remove(id: string) {
        await db.run('UPDATE Employee SET isActive = 0 WHERE id = ?', [id]);
        return { deleted: true };
    }

    async getDocuments(employeeId: string) {
        return db.all('SELECT * FROM EmployeeDocument WHERE employeeId = ? ORDER BY createdAt DESC', [employeeId]);
    }

    async addDocument(employeeId: string, data: any) {
        const id = uuidv4();
        await db.run(`
      INSERT INTO EmployeeDocument (id, employeeId, title, category, fileUrl, expiryDate, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
    `, [id, employeeId, data.title, data.category, data.fileUrl, data.expiryDate]);

        return db.get('SELECT * FROM EmployeeDocument WHERE id = ?', [id]);
    }
}

export const employeesService = new EmployeesService();
