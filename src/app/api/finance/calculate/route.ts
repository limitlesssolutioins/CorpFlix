import { NextResponse } from 'next/server';
import { getCompanyDataDir } from '@/lib/companyContext';
import { getFinanceService } from '@/services/finance.service';

export async function POST(request: Request) {
  try {
    const dataDir = await getCompanyDataDir();
    const financeService = getFinanceService(dataDir);
    const body = await request.json();

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

    return NextResponse.json({ ...result, laborDetails });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error performing calculation' }, { status: 500 });
  }
}
