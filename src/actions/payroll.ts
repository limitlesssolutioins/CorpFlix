'use server';

import { payrollService } from '@/services/payroll.service';
import { db } from '@/lib/json-db';

export async function generatePayrollReportAction(month: number, year: number, period: string) {
  // 1. Definir el nombre del periodo para guardar/buscar
  const periodName = `${year}-${month.toString().padStart(2, '0')}-${period}`;

  // 2. Intentar buscar nómina existente
  let payrolls = payrollService.getAllPayrolls().filter(p => p.period === periodName);

  // 3. Si no hay nómina generada para este periodo, la generamos al vuelo (simulando cálculo en tiempo real)
  // En un sistema real, esto se haría con un botón explícito "Generar", pero aquí lo haremos automático para la demo.
  if (payrolls.length === 0) {
    payrolls = await payrollService.generateMassivePayroll(periodName);
  }

  // 4. Transformar los datos al formato que espera el Frontend
  // El frontend espera: { employeeName, daysWorked, basePay, surchargeTotal, socialSecurity: { total }, provisions: { total }, totalPay }
  
  const report = payrolls.map(p => {
    const emp = db.employees.getById(p.employeeId);
    
    // Extraer detalles para sumas
    const earnings = p.details.filter(d => d.type === 'EARNING');
    const deductions = p.details.filter(d => d.type === 'DEDUCTION');

    const basePay = earnings.find(d => d.concept === 'Salario Básico')?.amount || 0;
    const transportAid = earnings.find(d => d.concept === 'Auxilio de Transporte')?.amount || 0;
    
    // Todo lo que sea earning pero no salario ni transporte, lo contamos como recargo/extra por ahora
    const surchargeTotal = earnings
      .filter(d => d.concept !== 'Salario Básico' && d.concept !== 'Auxilio de Transporte')
      .reduce((sum, d) => sum + d.amount, 0);

    const totalDeductions = deductions.reduce((sum, d) => sum + d.amount, 0);
    
    // Provisiones (simuladas aquí mismo para visualización, ya que el servicio básico aún no las guarda en DB)
    // Cesantías (8.33%) + Primas (8.33%) + Vacaciones (4.17%) + Intereses (1%) ~= 21.83%
    const totalProvisions = (p.grossSalary - transportAid) * 0.2183; 

    return {
      employeeId: p.employeeId,
      employeeName: emp ? `${emp.firstName} ${emp.lastName}` : 'Desconocido',
      contractType: emp?.contractType || 'Indefinido',
      periodLabel: period === 'full' ? 'Mensual' : `Q${period}`,
      daysWorked: 30, // Simplificación
      basePay: basePay,
      transportAid: transportAid,
      surchargeTotal: surchargeTotal,
      socialSecurity: { total: totalDeductions },
      provisions: { total: totalProvisions },
      totalPay: p.netSalary
    };
  });

  return report;
}
