import { NextResponse } from 'next/server';
import { getCompanyDataDir } from '@/lib/companyContext';
import { getRiskService } from '@/services/risk.service';

export async function GET() {
    try {
        const dataDir = await getCompanyDataDir();
        const riskService = getRiskService(dataDir);
        const kpis = riskService.getDashboardKPIs();
        return NextResponse.json(kpis);
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
    }
}
