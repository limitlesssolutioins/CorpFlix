import { getJsonDb, PayrollRecord } from '@/lib/json-db';
import { v4 as uuidv4 } from 'uuid';
import { getEmployeesService } from './employees.service';
import { 
  SMLMV_2026, 
  AUX_TRANSPORTE_2026, 
  calculateFSP, 
  calculateWithholdingTax,
  calculateProvisiones,
  calculateAportesPatronales
} from '@/lib/payroll-calculator';

export class PayrollService {
  private db: ReturnType<typeof getJsonDb>;
  private dataDir: string;

  constructor(dataDir: string) {
    this.dataDir = dataDir;
    this.db = getJsonDb(dataDir);
  }

  async calculatePayroll(employeeId: string, periodName: string, options: { excludeSS?: boolean, days?: number } = {}): Promise<PayrollRecord | null> {
    const employeesService = getEmployeesService(this.dataDir);
    const employee = await employeesService.findOne(employeeId);
    if (!employee) throw new Error(`Employee with ID ${employeeId} not found`);

    const isQuincena = periodName.endsWith('-1') || periodName.endsWith('-2');
    const workedDays = options.days !== undefined ? options.days : (isQuincena ? 15 : 30);

    const fullSalary = Number(employee.salaryAmount || 0);
    const baseSalary = (fullSalary / 30) * workedDays;
    
    const details: any[] = [];

    // 1. DEVENGADOS
    details.push({
      concept: 'Salario Básico',
      type: 'EARNING',
      amount: baseSalary,
      days: workedDays,
      isWageForming: true
    });

    let transportAid = 0;
    // Auxilio de transporte se paga si gana <= 2 SMLMV y no es integral
    if (fullSalary <= (SMLMV_2026 * 2) && employee.isIntegralSalary !== 1 && employee.contractType !== 'INDEPENDIENTE') {
      transportAid = (AUX_TRANSPORTE_2026 / 30) * workedDays;
      details.push({
        concept: 'Auxilio de Transporte',
        type: 'EARNING',
        amount: transportAid,
        isWageForming: false
      });
    }

    const totalDevengado = baseSalary + transportAid;

    // 2. DEDUCCIONES
    let totalDeducciones = 0;
    const ibc = baseSalary; // Simplificado: IBC = base salary (sin extras para este MVP)

    if (!options.excludeSS && employee.contractType !== 'INDEPENDIENTE') {
      // Salud (4%)
      const healthAmount = ibc * (employee.healthFundPercentage / 100 || 0.04);
      details.push({ concept: `Aporte Salud (${employee.healthFundPercentage}%)`, type: 'DEDUCTION', amount: healthAmount });

      // Pensión (4%)
      const pensionAmount = ibc * (employee.pensionFundPercentage / 100 || 0.04);
      details.push({ concept: `Aporte Pensión (${employee.pensionFundPercentage}%)`, type: 'DEDUCTION', amount: pensionAmount });

      // Fondo Solidaridad Pensional (FSP)
      const fspAmount = calculateFSP(ibc, SMLMV_2026);
      if (fspAmount > 0) {
        details.push({ concept: 'Fondo Solidaridad Pensional', type: 'DEDUCTION', amount: fspAmount });
      }

      // Retención en la fuente (Estimado sobre base gravable simplificada)
      const baseGravable = ibc - healthAmount - pensionAmount; // Muy simplificado
      const retefuente = calculateWithholdingTax(baseGravable);
      if (retefuente > 0) {
        details.push({ concept: 'Retención en la Fuente', type: 'DEDUCTION', amount: retefuente });
      }

      totalDeducciones = details.filter(d => d.type === 'DEDUCTION').reduce((sum, d) => sum + d.amount, 0);
    }

    const netSalary = totalDevengado - totalDeducciones;

    // 3. PROVISIONES Y COSTO EMPLEADOR (Informativo en el record de nómina)
    const provisiones = calculateProvisiones(baseSalary, transportAid);
    const aportesPatronales = calculateAportesPatronales(ibc, employee.riskClass, true); // Asumimos exoneración 114 ET

    const payrollRecord: PayrollRecord = {
      id: uuidv4(),
      period: periodName,
      employeeId: employee.id,
      grossSalary: totalDevengado,
      deductions: totalDeducciones,
      netSalary: netSalary,
      details: details,
      employerCost: {
        provisiones,
        seguridadSocial: aportesPatronales
      },
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
