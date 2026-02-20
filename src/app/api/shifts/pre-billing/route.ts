import { NextRequest, NextResponse } from 'next/server';
import { getCompanyDataDir } from '@/lib/companyContext';
import { getShiftsService } from '@/services/shifts.service';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const month = searchParams.get('month') || (new Date().getMonth() + 1).toString();
    const year = searchParams.get('year') || new Date().getFullYear().toString();

    try {
        const dataDir = await getCompanyDataDir();
        const shiftsService = getShiftsService(dataDir);
        const report = await (shiftsService as any).getPreBillingReport(Number(month), Number(year));
        return NextResponse.json(report);
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
