import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const { getDb } = require('@/lib/db');

export class EmployeesService {
    private db: any;

    constructor(dataDir: string) {
        this.db = getDb(path.join(dataDir, 'hr.db'));
    }

    async findAll() {
        const employees = await this.db.all(`
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
        const employee = await this.db.get(`
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
        await this.db.run(`
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
        const fields: string[] = [];
        const values: any[] = [];

        Object.keys(data).forEach(key => {
            if (data[key] !== undefined) {
                fields.push(`${key} = ?`);
                values.push(data[key]);
            }
        });

        fields.push('updatedAt = datetime(\'now\')');
        values.push(id);

        await this.db.run(`
      UPDATE Employee
      SET ${fields.join(', ')}
      WHERE id = ?
    `, values);

        return this.findOne(id);
    }

    async remove(id: string) {
        await this.db.run('UPDATE Employee SET isActive = 0 WHERE id = ?', [id]);
        return { deleted: true };
    }

    async getDocuments(employeeId: string) {
        return this.db.all('SELECT * FROM EmployeeDocument WHERE employeeId = ? ORDER BY createdAt DESC', [employeeId]);
    }

    async addDocument(employeeId: string, data: any) {
        const id = uuidv4();
        await this.db.run(`
      INSERT INTO EmployeeDocument (id, employeeId, title, category, fileUrl, expiryDate, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
    `, [id, employeeId, data.title, data.category, data.fileUrl, data.expiryDate]);

        return this.db.get('SELECT * FROM EmployeeDocument WHERE id = ?', [id]);
    }
}

const instances = new Map<string, EmployeesService>();

export function getEmployeesService(dataDir: string): EmployeesService {
    if (!instances.has(dataDir)) {
        instances.set(dataDir, new EmployeesService(dataDir));
    }
    return instances.get(dataDir)!;
}
