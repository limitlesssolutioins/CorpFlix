import { getJsonDb, PayrollRecord } from '@/lib/json-db';
import { v4 as uuidv4 } from 'uuid';
import { getEmployeesService } from './employees.service';

const SMLMV = 1300000;
const AUX_TRANSPORTE = 162000;

export class PayrollService {
  private db: ReturnType<typeof getJsonDb>;
  private dataDir: string;

  constructor(dataDir: string) {
    this.dataDir = dataDir;
    this.db = getJsonDb(dataDir);
  }

  async calculatePayroll(employeeId: string, periodName: string, excludeSS: boolean = false): Promise<PayrollRecord | null> {
    const employeesService = getEmployeesService(this.dataDir);
    const employee = await employeesService.findOne(employeeId);
    if (!employee) {
      throw new Error(`Employee with ID ${employeeId} not found`);
    }

    const isQuincena = periodName.endsWith('-1') || periodName.endsWith('-2');
    const days = isQuincena ? 15 : 30;

    const fullSalary = Number(employee.salaryAmount);
    const baseSalary = isQuincena ? fullSalary / 2 : fullSalary;
    
    const details: any[] = [];

    details.push({
      concept: 'Salario Básico',
      type: 'EARNING',
      amount: baseSalary,
      days: days,
      isWageForming: true
    });

    let transportAid = 0;
    if (fullSalary <= (SMLMV * 2) && employee.contractType !== 'INDEPENDIENTE') {
      transportAid = isQuincena ? AUX_TRANSPORTE / 2 : AUX_TRANSPORTE;
      details.push({
        concept: 'Auxilio de Transporte',
        type: 'EARNING',
        amount: transportAid,
        isWageForming: false
      });
    }

    const totalDevengado = baseSalary + transportAid;

    let totalDeducciones = 0;

    if (!excludeSS) {
      // Deducciones base
      const healthDeduction = baseSalary * 0.04;
      details.push({
        concept: 'Aporte Salud (4%)',
        type: 'DEDUCTION',
        amount: healthDeduction
      });

      const pensionDeduction = baseSalary * 0.04;
      details.push({
        concept: 'Aporte Pensión (4%)',
        type: 'DEDUCTION',
        amount: pensionDeduction
      });
      totalDeducciones = healthDeduction + pensionDeduction;
    }

    const netSalary = totalDevengado - totalDeducciones;

    const payrollRecord: PayrollRecord = {
      id: uuidv4(),
      period: periodName,
      employeeId: employee.id,
      grossSalary: totalDevengado,
      deductions: totalDeducciones,
      netSalary: netSalary,
      details: details,
      status: 'DRAFT',
      createdAt: new Date().toISOString()
    };

    return payrollRecord;
  }

  async addNovelty(payrollId: string, concept: string, amount: number, type: 'EARNING' | 'DEDUCTION', isWageForming: boolean = false) {
    const payroll = this.db.payroll.getById(payrollId);
    if (!payroll) throw new Error("Payroll record not found");

    const newDetail = {
      concept,
      amount,
      type,
      isNovelty: true,
      isWageForming
    };

    const updatedDetails = [...payroll.details, newDetail];
    
    // Recalcular totales
    const totalEarnings = updatedDetails
      .filter(d => d.type === 'EARNING')
      .reduce((sum, d) => sum + d.amount, 0);
    
    const totalDeductions = updatedDetails
      .filter(d => d.type === 'DEDUCTION')
      .reduce((sum, d) => sum + d.amount, 0);

    return this.db.payroll.update(payrollId, {
      details: updatedDetails,
      grossSalary: totalEarnings,
      deductions: totalDeductions,
      netSalary: totalEarnings - totalDeductions
    });
  }

  async generateMassivePayroll(periodName: string, excludeSS: boolean = false): Promise<PayrollRecord[]> {
    const employeesService = getEmployeesService(this.dataDir);
    const employees = await employeesService.findAll();
    const results: PayrollRecord[] = [];

    // Filter out Independientes, they are not part of standard payroll
    const eligibleEmployees = employees.filter((emp: any) => emp.contractType !== 'INDEPENDIENTE' && emp.isActive === 1);

    for (const emp of eligibleEmployees) {
      try {
        const record = await this.calculatePayroll(emp.id, periodName, excludeSS);
        if (record) {
          this.db.payroll.create(record);
          results.push(record);
        }
      } catch (error) {
        console.error(`Error generating payroll for ${emp.firstName}:`, error);
      }
    }

    return results;
  }

  getAllPayrolls() {
    return this.db.payroll.getAll();
  }
}

const instances = new Map<string, PayrollService>();

export function getPayrollService(dataDir: string): PayrollService {
  if (!instances.has(dataDir)) {
    instances.set(dataDir, new PayrollService(dataDir));
  }
  return instances.get(dataDir)!;
}
