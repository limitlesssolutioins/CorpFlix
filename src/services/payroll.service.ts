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

  async calculatePayroll(employeeId: string, periodName: string): Promise<PayrollRecord | null> {
    const employeesService = getEmployeesService(this.dataDir);
    const employee = await employeesService.findOne(employeeId);
    if (!employee) {
      throw new Error(`Employee with ID ${employeeId} not found`);
    }

    const salary = Number(employee.salaryAmount);
    const details: any[] = [];

    details.push({
      concept: 'Salario Básico',
      type: 'EARNING',
      amount: salary
    });

    let transportAid = 0;
    // Domesticas internas do not get transport aid, but we'll assume standard for now unless defined.
    // Also Independientes are excluded beforehand.
    if (salary <= (SMLMV * 2) && employee.contractType !== 'INDEPENDIENTE') {
      transportAid = AUX_TRANSPORTE;
      details.push({
        concept: 'Auxilio de Transporte',
        type: 'EARNING',
        amount: transportAid
      });
    }

    const totalDevengado = salary + transportAid;

    // Domésticas y otros pagan 4% (Independientes don't, but they are excluded)
    const healthDeduction = salary * 0.04;
    details.push({
      concept: 'Aporte Salud (4%)',
      type: 'DEDUCTION',
      amount: healthDeduction
    });

    const pensionDeduction = salary * 0.04;
    details.push({
      concept: 'Aporte Pensión (4%)',
      type: 'DEDUCTION',
      amount: pensionDeduction
    });

    const totalDeducciones = healthDeduction + pensionDeduction;
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

  async generateMassivePayroll(periodName: string): Promise<PayrollRecord[]> {
    const employeesService = getEmployeesService(this.dataDir);
    const employees = await employeesService.findAll();
    const results: PayrollRecord[] = [];

    // Filter out Independientes, they are not part of standard payroll
    const eligibleEmployees = employees.filter((emp: any) => emp.contractType !== 'INDEPENDIENTE' && emp.isActive === 1);

    for (const emp of eligibleEmployees) {
      try {
        const record = await this.calculatePayroll(emp.id, periodName);
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
