'use server';

import { getCompanyDataDir } from '@/lib/companyContext';
import { getPayrollService } from '@/services/payroll.service';
import { getEmployeesService } from '@/services/employees.service';

export async function generatePayrollReportAction(month: number, year: number, period: string) {
  const dataDir = await getCompanyDataDir();
  const payrollService = getPayrollService(dataDir);
  const employeesService = getEmployeesService(dataDir);

  // 1. Definir el nombre del periodo para guardar/buscar
  const periodName = `${year}-${month.toString().padStart(2, '0')}-${period}`;

  // 2. Intentar buscar nómina existente
  let payrolls = payrollService.getAllPayrolls().filter((p: any) => p.period === periodName);

  // 3. Si no hay nómina generada para este periodo, la generamos al vuelo
  if (payrolls.length === 0) {
    payrolls = await payrollService.generateMassivePayroll(periodName);
  }

  // 4. Transformar los datos al formato que espera el Frontend
  const report = await Promise.all(payrolls.map(async (p: any) => {
    const emp = await employeesService.findOne(p.employeeId);

    const earnings = p.details.filter((d: any) => d.type === 'EARNING');
    const deductions = p.details.filter((d: any) => d.type === 'DEDUCTION');

    const basePay = earnings.find((d: any) => d.concept === 'Salario Básico')?.amount || 0;
    const transportAid = earnings.find((d: any) => d.concept === 'Auxilio de Transporte')?.amount || 0;

    const surchargeTotal = earnings
      .filter((d: any) => d.concept !== 'Salario Básico' && d.concept !== 'Auxilio de Transporte')
      .reduce((sum: number, d: any) => sum + d.amount, 0);

    const totalDeductions = deductions.reduce((sum: number, d: any) => sum + d.amount, 0);
    const totalProvisions = (p.grossSalary - transportAid) * 0.2183;

    return {
      employeeId: p.employeeId,
      employeeName: emp ? `${emp.firstName} ${emp.lastName}` : 'Desconocido',
      contractType: emp?.contractType || 'Indefinido',
      periodLabel: period === 'full' ? 'Mensual' : `Q${period}`,
      daysWorked: 30,
      basePay,
      transportAid,
      surchargeTotal,
      socialSecurity: { total: totalDeductions },
      provisions: { total: totalProvisions },
      totalPay: p.netSalary,
    };
  }));

  return report;
}
