import { v4 as uuidv4 } from 'uuid';
import prisma from '@/lib/prisma';
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
        return await prisma.employee.findMany({
            where: { companyId, isActive: true },
            include: {
                defaultSite: true,
                defaultPosition: true,
                team: true
            },
            orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }]
        });
    }

    async findOne(id: string) {
        const companyId = await this.getCompanyContext();
        return await prisma.employee.findFirst({
            where: { id, companyId },
            include: {
                defaultSite: true,
                defaultPosition: true,
                team: true
            }
        });
    }

    async getEmployeesBySite(siteId: string) {
        const companyId = await this.getCompanyContext();
        return await prisma.employee.findMany({
            where: { companyId, defaultSiteId: siteId, isActive: true },
        });
    }

    async getEmployeesByPosition(positionId: string) {
        const companyId = await this.getCompanyContext();
        return await prisma.employee.findMany({
            where: { companyId, defaultPositionId: positionId, isActive: true },
        });
    }

    async create(data: any) {
        const companyId = await this.getCompanyContext();
        
        return await prisma.employee.create({
            data: {
                companyId,
                firstName: data.firstName,
                lastName: data.lastName,
                identification: data.identification,
                documentType: data.documentType || 'CC',
                documentExpeditionCity: data.documentExpeditionCity,
                birthDate: data.birthDate ? new Date(data.birthDate) : null,
                gender: data.gender,
                bloodType: data.bloodType,
                email: data.email,
                phone: data.phone,
                address: data.address,
                city: data.city,
                bankName: data.bankName,
                bankAccountType: data.bankAccountType,
                bankAccountNumber: data.bankAccountNumber,
                emergencyContactName: data.emergencyContactName,
                emergencyContactPhone: data.emergencyContactPhone,
                contractType: data.contractType,
                contractNumber: data.contractNumber,
                startDate: data.startDate ? new Date(data.startDate) : null,
                contractEndDate: data.contractEndDate ? new Date(data.contractEndDate) : null,
                isIntegralSalary: data.isIntegralSalary ? true : false,
                salaryAmount: data.salaryAmount ? Number(data.salaryAmount) : 0,
                salaryScheme: data.salaryScheme || 'FIJO',
                payrollGroup: data.payrollGroup,
                costCenter: data.costCenter,
                contributorType: data.contributorType || '01',
                contributorSubtype: data.contributorSubtype || '00',
                healthFund: data.healthFund,
                healthFundPercentage: data.healthFundPercentage ? Number(data.healthFundPercentage) : 4,
                pensionFund: data.pensionFund,
                pensionFundPercentage: data.pensionFundPercentage ? Number(data.pensionFundPercentage) : 4,
                severanceFund: data.severanceFund,
                compensationFund: data.compensationFund,
                arl: data.arl,
                riskClass: data.riskClass || 'I',
                ciiuCode: data.ciiuCode,
                standardStartTime: data.standardStartTime,
                standardEndTime: data.standardEndTime,
                standardStartTime2: data.standardStartTime2,
                standardEndTime2: data.standardEndTime2,
                workDays: data.workDays,
                defaultSiteId: data.defaultSiteId,
                defaultPositionId: data.defaultPositionId,
                teamId: data.teamId,
                isActive: true
            }
        });
    }

    async update(id: string, data: any) {
        const companyId = await this.getCompanyContext();
        
        // Parse dates safely
        const updateData = { ...data };
        if (data.birthDate) updateData.birthDate = new Date(data.birthDate);
        if (data.startDate) updateData.startDate = new Date(data.startDate);
        if (data.contractEndDate) updateData.contractEndDate = new Date(data.contractEndDate);
        
        if (data.salaryAmount) updateData.salaryAmount = Number(data.salaryAmount);
        if (data.isIntegralSalary !== undefined) updateData.isIntegralSalary = Boolean(data.isIntegralSalary);
        
        return await prisma.employee.updateMany({
            where: { id, companyId },
            data: updateData
        }).then(() => this.findOne(id));
    }

    async remove(id: string) {
        const companyId = await this.getCompanyContext();
        await prisma.employee.updateMany({
            where: { id, companyId },
            data: { isActive: false }
        });
        return { deleted: true };
    }

    async getDocuments(employeeId: string) {
        return await prisma.employeeDocument.findMany({
            where: { employeeId },
            orderBy: { createdAt: 'desc' }
        });
    }

    async addDocument(employeeId: string, data: any) {
        return await prisma.employeeDocument.create({
            data: {
                employeeId,
                title: data.title,
                category: data.category,
                fileUrl: data.fileUrl,
                expiryDate: data.expiryDate ? new Date(data.expiryDate) : null
            }
        });
    }

    async getDisciplinaryRecords(employeeId: string) {
        return await prisma.disciplinaryRecord.findMany({
            where: { employeeId },
            orderBy: { incidentDate: 'desc' }
        });
    }

    async getPerformanceEvaluations(employeeId: string) {
        return await prisma.performanceEvaluation.findMany({
            where: { employeeId },
            orderBy: { evaluationDate: 'desc' }
        });
    }

    async getPositionHistory(employeeId: string) {
        return await prisma.positionHistory.findMany({
            where: { employeeId },
            include: { position: true },
            orderBy: { changeDate: 'desc' }
        });
    }

    async getSalaryHistory(employeeId: string) {
        return await prisma.salaryHistory.findMany({
            where: { employeeId },
            orderBy: { changeDate: 'desc' }
        });
    }
}

// Ensure backward compatibility of instantiation
export function getEmployeesService(dataDir: string): EmployeesService {
    return new EmployeesService();
}