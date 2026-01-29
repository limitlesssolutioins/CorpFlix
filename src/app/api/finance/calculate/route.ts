import { NextResponse } from 'next/server';
import { financeService } from '@/services/finance.service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Si recibimos salario base, calculamos el costo de labor primero
    let hourlyCost = body.baseHourlyCost;
    let laborDetails = null;

    if (body.baseSalary) {
      laborDetails = financeService.calculateLaborCost(body.baseSalary);
      hourlyCost = laborDetails.hourlyCost;
    }

    const result = financeService.calculateQuotation({
      hours: body.hours || 0,
      baseHourlyCost: hourlyCost || 0,
      materialCosts: body.materialCosts || 0,
      desiredMargin: body.desiredMargin || 0
    });

    return NextResponse.json({
      ...result,
      laborDetails
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error performing calculation' }, { status: 500 });
  }
}
