import { getJsonDb, PayrollRecord } from '@/lib/json-db';
import { v4 as uuidv4 } from 'uuid';

const SMLMV = 1300000;
const AUX_TRANSPORTE = 162000;

export class PayrollService {
  private db: ReturnType<typeof getJsonDb>;

  constructor(dataDir: string) {
    this.db = getJsonDb(dataDir);
  }

  async calculatePayroll(employeeId: string, periodName: string): Promise<PayrollRecord | null> {
    const employee = this.db.employees.getById(employeeId);
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
    if (salary <= (SMLMV * 2)) {
      transportAid = AUX_TRANSPORTE;
      details.push({
        concept: 'Auxilio de Transporte',
        type: 'EARNING',
        amount: transportAid
      });
    }

    const totalDevengado = salary + transportAid;

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
    const employees = this.db.employees.getAll();
    const results: PayrollRecord[] = [];

    for (const emp of employees) {
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
