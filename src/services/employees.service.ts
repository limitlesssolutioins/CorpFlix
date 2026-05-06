import { v4 as uuidv4 } from 'uuid';
import { query } from '@/lib/db';
import { getCompanyId } from '@/lib/companyContext';

export class EmployeesService {
    constructor() {}

    async initializeDatabase() { return; }

    private async getCompanyContext() {
        const companyId = await getCompanyId();
        if (!companyId) throw new Error("Unauthorized or company not found");
        return companyId;
    }

    async findAll() {
        const companyId = await this.getCompanyContext();
        const sql = `
            SELECT e.*, 
                   s.id as site_id, s.name as site_name,
                   p.id as position_id, p.name as position_name,
                   t.id as team_id, t.name as team_name
            FROM Employee e
            LEFT JOIN Site s ON e.defaultSiteId = s.id
            LEFT JOIN Position p ON e.defaultPositionId = p.id
            LEFT JOIN Team t ON e.teamId = t.id
            WHERE e.companyId = ? AND e.isActive = 1
            ORDER BY e.firstName ASC, e.lastName ASC
        `;
        const employees = await query<any[]>(sql, [companyId]);
        
        return employees.map(e => ({
            ...e,
            defaultSite: e.site_id ? { id: e.site_id, name: e.site_name } : null,
            defaultPosition: e.position_id ? { id: e.position_id, name: e.position_name } : null,
            team: e.team_id ? { id: e.team_id, name: e.team_name } : null
        }));
    }

    async findOne(id: string) {
        const companyId = await this.getCompanyContext();
        const sql = `
            SELECT e.*, 
                   s.id as site_id, s.name as site_name,
                   p.id as position_id, p.name as position_name,
                   t.id as team_id, t.name as team_name
            FROM Employee e
            LEFT JOIN Site s ON e.defaultSiteId = s.id
            LEFT JOIN Position p ON e.defaultPositionId = p.id
            LEFT JOIN Team t ON e.teamId = t.id
            WHERE e.id = ? AND e.companyId = ?
        `;
        const employees = await query<any[]>(sql, [id, companyId]);
        if (employees.length === 0) return null;
        
        const e = employees[0];
        return {
            ...e,
            defaultSite: e.site_id ? { id: e.site_id, name: e.site_name } : null,
            defaultPosition: e.position_id ? { id: e.position_id, name: e.position_name } : null,
            team: e.team_id ? { id: e.team_id, name: e.team_name } : null
        };
    }

    async getEmployeesBySite(siteId: string) {
        const companyId = await this.getCompanyContext();
        return await query<any[]>(
            'SELECT * FROM Employee WHERE companyId = ? AND defaultSiteId = ? AND isActive = 1',
            [companyId, siteId]
        );
    }

    async getEmployeesByPosition(positionId: string) {
        const companyId = await this.getCompanyContext();
        return await query<any[]>(
            'SELECT * FROM Employee WHERE companyId = ? AND defaultPositionId = ? AND isActive = 1',
            [companyId, positionId]
        );
    }

    private safeDate(d: any) {
        if (!d) return null;
        const parsed = new Date(d);
        return isNaN(parsed.getTime()) ? null : parsed;
    }

    private safeStr(s: any) {
        if (s === undefined || s === null || s === '') return null;
        return s;
    }

    async create(data: any) {
        const companyId = await this.getCompanyContext();
        const id = uuidv4();
        
        const sql = `
            INSERT INTO Employee (
                id, companyId, firstName, lastName, identification, documentType, 
                documentExpeditionCity, birthDate, gender, bloodType, email, phone, 
                address, city, bankName, bankAccountType, bankAccountNumber, 
                emergencyContactName, emergencyContactPhone, contractType, contractNumber, 
                startDate, contractEndDate, isIntegralSalary, salaryAmount, salaryScheme, 
                payrollGroup, costCenter, contributorType, contributorSubtype, healthFund, 
                healthFundPercentage, pensionFund, pensionFundPercentage, severanceFund, 
                compensationFund, arl, riskClass, ciiuCode, standardStartTime, 
                standardEndTime, standardStartTime2, standardEndTime2, workDays, 
                defaultSiteId, defaultPositionId, teamId, isActive, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        `;

        const rawParams = [
            id, companyId, data.firstName, data.lastName, data.identification, data.documentType || 'CC',
            this.safeStr(data.documentExpeditionCity), this.safeDate(data.birthDate), this.safeStr(data.gender), this.safeStr(data.bloodType), this.safeStr(data.email), this.safeStr(data.phone),
            this.safeStr(data.address), this.safeStr(data.city), this.safeStr(data.bankName), this.safeStr(data.bankAccountType), this.safeStr(data.bankAccountNumber),
            this.safeStr(data.emergencyContactName), this.safeStr(data.emergencyContactPhone), this.safeStr(data.contractType), this.safeStr(data.contractNumber),
            this.safeDate(data.startDate), this.safeDate(data.contractEndDate),
            data.isIntegralSalary ? 1 : 0, data.salaryAmount ? Number(data.salaryAmount) : 0, data.salaryScheme || 'FIJO',
            this.safeStr(data.payrollGroup), this.safeStr(data.costCenter), data.contributorType || '01', data.contributorSubtype || '00', this.safeStr(data.healthFund),
            data.healthFundPercentage ? Number(data.healthFundPercentage) : 4, this.safeStr(data.pensionFund),
            data.pensionFundPercentage ? Number(data.pensionFundPercentage) : 4, this.safeStr(data.severanceFund),
            this.safeStr(data.compensationFund), this.safeStr(data.arl), data.riskClass || 'I', this.safeStr(data.ciiuCode), this.safeStr(data.standardStartTime),
            this.safeStr(data.standardEndTime), this.safeStr(data.standardStartTime2), this.safeStr(data.standardEndTime2), this.safeStr(data.workDays),
            this.safeStr(data.defaultSiteId), this.safeStr(data.defaultPositionId), this.safeStr(data.teamId), 1
        ];

        const params = rawParams.map(p => p === undefined ? null : p);

        await query(sql, params);
        return await this.findOne(id);
    }

    async update(id: string, data: any) {
        const companyId = await this.getCompanyContext();
        
        // Exclude fields that shouldn't be updated directly or need special handling
        const { id: _, companyId: __, createdAt: ___, updatedAt: ____, ...updateData } = data;
        
        const fields = Object.keys(updateData);
        if (fields.length === 0) return await this.findOne(id);

        const setClause = fields.map(field => `${field} = ?`).join(', ');
        const rawParams = fields.map(field => {
            let value = updateData[field];
            if (['birthDate', 'startDate', 'contractEndDate'].includes(field)) {
                return this.safeDate(value);
            }
            if (field === 'salaryAmount' && value !== undefined && value !== null) {
                return Number(value);
            }
            if (field === 'isIntegralSalary' && value !== undefined && value !== null) {
                return value ? 1 : 0;
            }
            if (value === '') return null;
            return value;
        });

        const params = rawParams.map(p => p === undefined ? null : p);

        const sql = `UPDATE Employee SET ${setClause}, updatedAt = NOW() WHERE id = ? AND companyId = ?`;
        await query(sql, [...params, id, companyId]);
        
        return await this.findOne(id);
    }

    async remove(id: string) {
        const companyId = await this.getCompanyContext();
        await query(
            'UPDATE Employee SET isActive = 0, updatedAt = NOW() WHERE id = ? AND companyId = ?',
            [id, companyId]
        );
        return { deleted: true };
    }

    async getDocuments(employeeId: string) {
        return await query<any[]>(
            'SELECT * FROM EmployeeDocument WHERE employeeId = ? ORDER BY createdAt DESC',
            [employeeId]
        );
    }

    async addDocument(employeeId: string, data: any) {
        const id = uuidv4();
        const sql = `
            INSERT INTO EmployeeDocument (id, employeeId, title, category, fileUrl, expiryDate, createdAt)
            VALUES (?, ?, ?, ?, ?, ?, NOW())
        `;
        const params = [
            id, employeeId, data.title, data.category, data.fileUrl,
            this.safeDate(data.expiryDate)
        ];
        await query(sql, params);
        const docs = await query<any[]>('SELECT * FROM EmployeeDocument WHERE id = ?', [id]);
        return docs[0];
    }

    async getDisciplinaryRecords(employeeId: string) {
        return await query<any[]>(
            'SELECT * FROM DisciplinaryRecord WHERE employeeId = ? ORDER BY incidentDate DESC',
            [employeeId]
        );
    }

    async getPerformanceEvaluations(employeeId: string) {
        return await query<any[]>(
            'SELECT * FROM PerformanceEvaluation WHERE employeeId = ? ORDER BY evaluationDate DESC',
            [employeeId]
        );
    }

    async getPositionHistory(employeeId: string) {
        const sql = `
            SELECT ph.*, p.id as pos_id, p.name as pos_name
            FROM PositionHistory ph
            LEFT JOIN Position p ON ph.positionId = p.id
            WHERE ph.employeeId = ?
            ORDER BY ph.changeDate DESC
        `;
        const history = await query<any[]>(sql, [employeeId]);
        return history.map(h => ({
            ...h,
            position: h.pos_id ? { id: h.pos_id, name: h.pos_name } : null
        }));
    }

    async getSalaryHistory(employeeId: string) {
        return await query<any[]>(
            'SELECT * FROM SalaryHistory WHERE employeeId = ? ORDER BY changeDate DESC',
            [employeeId]
        );
    }
}

export function getEmployeesService(dataDir: string): EmployeesService {
    return new EmployeesService();
}
