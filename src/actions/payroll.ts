'use server';

import { getCompanyDataDir } from '@/lib/companyContext';
import { getPayrollService } from '@/services/payroll.service';
import { getEmployeesService } from '@/services/employees.service';

export async function generatePayrollReportAction(month: number, year: number, period: string, excludeSS: boolean = false, forceRecalculate: boolean = false) {
  const dataDir = await getCompanyDataDir();
  const payrollService = getPayrollService(dataDir);
  const employeesService = getEmployeesService(dataDir);

  const periodName = `${year}-${month.toString().padStart(2, '0')}-${period}`;

  // Since PayrollService was migrated to MySQL, getAllPayrolls/generateMassivePayroll are currently returning `null as any`.
  // We need to bypass the filter crash and return a mocked empty array for now until the calculation engine is fully rewritten for MySQL.
  
  const allPayrolls = payrollService.getAllPayrolls() || [];
  
  if (forceRecalculate) {
    const existing = allPayrolls.filter((p: any) => p.period === periodName);
    // @ts-ignore
    if (payrollService.db) existing.forEach((p: any) => payrollService.db.payroll.delete(p.id));
  }

  let payrolls = allPayrolls.filter((p: any) => p.period === periodName);

  if (payrolls.length === 0) {
    const generated = await payrollService.generateMassivePayroll(periodName, excludeSS);
    payrolls = generated || [];
  }

  const report = await Promise.all(payrolls.map(async (p: any) => {
    const emp = await employeesService.findOne(p.employeeId);

    const earnings = (p.details || []).filter((d: any) => d.type === 'EARNING');
    const deductions = (p.details || []).filter((d: any) => d.type === 'DEDUCTION');

    const basePayDetail = earnings.find((d: any) => d.concept === 'Salario Básico');
    const basePay = basePayDetail?.amount || 0;
    const daysWorked = basePayDetail?.days || (period === 'full' ? 30 : 15);
    const transportAid = earnings.find((d: any) => d.concept === 'Auxilio de Transporte')?.amount || 0;

    const otherEarnings = earnings
      .filter((d: any) => d.concept !== 'Salario Básico' && d.concept !== 'Auxilio de Transporte')
      .reduce((sum: number, d: any) => sum + d.amount, 0);

    const totalDeductions = deductions.reduce((sum: number, d: any) => sum + d.amount, 0);
    const wageFormingEarnings = earnings
      .filter((d: any) => d.isWageForming)
      .reduce((sum: number, d: any) => sum + d.amount, 0);
      
    const totalProvisions = (wageFormingEarnings) * 0.2183;

    return {
      id: p.id,
      employeeId: p.employeeId,
      employeeName: emp ? `${emp.firstName} ${emp.lastName}` : 'Desconocido',
      contractType: emp?.contractType || 'Indefinido',
      periodLabel: period === 'full' ? 'Mensual' : `Q${period}`,
      daysWorked,
      basePay,
      transportAid,
      otherEarnings,
      socialSecurity: { total: totalDeductions },
      provisions: { total: totalProvisions },
      totalPay: p.netSalary,
    };
  }));

  return report;
}

export async function addPayrollNoveltyAction(payrollId: string, concept: string, amount: number, type: 'EARNING' | 'DEDUCTION', isWageForming: boolean = false) {
  const dataDir = await getCompanyDataDir();
  const payrollService = getPayrollService(dataDir);
  return payrollService.addNovelty(payrollId, concept, amount, type, isWageForming);
}
