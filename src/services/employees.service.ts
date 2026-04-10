import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { getDb } from '@/lib/db';

export class EmployeesService {
    private db: any;

    constructor(dataDir: string) {
        this.db = getDb(path.join(dataDir, 'hr.db'));
        this.ensureSchema();
    }

    private ensureSchema() {
        const columnsToAdd = [
            'address TEXT',
            'contractEndDate DATE',
            'isIntegralSalary INTEGER DEFAULT 0',
            'contractNumber TEXT',
            'payrollGroup TEXT',
            'costCenter TEXT',
            'contributorType TEXT',
            'contributorSubtype TEXT',
            'healthFundPercentage REAL DEFAULT 4',
            'pensionFundPercentage REAL DEFAULT 4',
            'severanceFund TEXT',
            'compensationFund TEXT',
            'riskClass TEXT',
            'ciiuCode TEXT'
        ];

        try {
            // First check if the table exists to avoid errors on completely fresh installs
            const tableExists = this.db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='Employee'").get();
            if (!tableExists) return; // Let init-hr-db.js handle full creation if it's completely missing

            // Try to add each column. We catch and ignore errors because SQLite will throw an error if the column already exists.
            for (const col of columnsToAdd) {
                try {
                    this.db.exec(`ALTER TABLE Employee ADD COLUMN ${col}`);
                } catch (e: any) {
                    // Ignore "duplicate column name" errors
                    if (!e.message.includes('duplicate column name')) {
                        console.error(`Error adding column ${col}:`, e.message);
                    }
                }
            }
        } catch (error) {
            console.error('Error ensuring Employee schema:', error);
        }
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
        id, firstName, lastName, identification, email, phone, address,
        contractType, contractNumber, startDate, contractEndDate,
        isIntegralSalary, salaryAmount, payrollGroup, costCenter,
        defaultSiteId, defaultPositionId,
        contributorType, contributorSubtype, 
        healthFund, healthFundPercentage,
        pensionFund, pensionFundPercentage,
        severanceFund, compensationFund,
        arl, riskClass, ciiuCode,
        isActive, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, datetime('now'), datetime('now'))
    `, [
            id, data.firstName, data.lastName, data.identification, data.email, data.phone, data.address,
            data.contractType, data.contractNumber, data.startDate, data.contractEndDate,
            data.isIntegralSalary, data.salaryAmount, data.payrollGroup, data.costCenter,
            data.defaultSiteId, data.defaultPositionId,
            data.contributorType, data.contributorSubtype,
            data.healthFund, data.healthFundPercentage,
            data.pensionFund, data.pensionFundPercentage,
            data.severanceFund, data.compensationFund,
            data.arl, data.riskClass, data.ciiuCode
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
