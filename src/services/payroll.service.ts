import { db, PayrollRecord, Employee } from '@/lib/json-db';
import { v4 as uuidv4 } from 'uuid';

// Constantes legales Colombia 2026 (Proyección/Ejemplo)
const SMLMV = 1300000;
const AUX_TRANSPORTE = 162000;

export class PayrollService {
  
  /**
   * Calcula la nómina para un empleado en un periodo específico.
   * Por ahora asume periodo mensual (30 días) para simplificar.
   */
  async calculatePayroll(employeeId: string, periodName: string): Promise<PayrollRecord | null> {
    const employee = db.employees.getById(employeeId);
    if (!employee) {
      throw new Error(`Employee with ID ${employeeId} not found`);
    }

    const salary = Number(employee.salaryAmount);
    const details = [];
    
    // 1. Devengados
    // Salario Básico
    details.push({
      concept: 'Salario Básico',
      type: 'EARNING',
      amount: salary
    });

    // Auxilio de Transporte (Si gana menos de 2 SMLMV)
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

    // 2. Deducciones
    // Salud (4% del salario base, sin aux transporte)
    const healthDeduction = salary * 0.04;
    details.push({
      concept: 'Aporte Salud (4%)',
      type: 'DEDUCTION',
      amount: healthDeduction
    });

    // Pensión (4% del salario base)
    const pensionDeduction = salary * 0.04;
    details.push({
      concept: 'Aporte Pensión (4%)',
      type: 'DEDUCTION',
      amount: pensionDeduction
    });

    const totalDeducciones = healthDeduction + pensionDeduction;

    // 3. Neto
    const netSalary = totalDevengado - totalDeducciones;

    // Estructurar el registro
    const payrollRecord: PayrollRecord = {
      id: uuidv4(),
      period: periodName,
      employeeId: employee.id,
      grossSalary: totalDevengado,
      deductions: totalDeducciones,
      netSalary: netSalary,
      details: details,
      status: 'DRAFT', // Se crea en borrador
      createdAt: new Date().toISOString()
    };

    return payrollRecord;
  }

  /**
   * Genera y guarda la nómina para TODOS los empleados activos
   */
  async generateMassivePayroll(periodName: string): Promise<PayrollRecord[]> {
    const employees = db.employees.getAll();
    const results: PayrollRecord[] = [];

    for (const emp of employees) {
      try {
        const record = await this.calculatePayroll(emp.id, periodName);
        if (record) {
          db.payroll.create(record);
          results.push(record);
        }
      } catch (error) {
        console.error(`Error generating payroll for ${emp.firstName}:`, error);
      }
    }

    return results;
  }

  /**
   * Obtiene el historial de nóminas
   */
  getAllPayrolls() {
    return db.payroll.getAll();
  }
}

export const payrollService = new PayrollService();
