
import { NextResponse } from 'next/server';
import { getCompanyDataDir } from '@/lib/companyContext';
import { getDashboardService } from '@/services/dashboard.service';

export async function GET() {
    try {
        const dataDir = await getCompanyDataDir();
        const dashboardService = getDashboardService(dataDir);
        const stats = await dashboardService.getStats();
        return NextResponse.json(stats);
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
