import { NextResponse } from 'next/server';
import { getCompanyDataDir } from '@/lib/companyContext';
import { getIsoAuditService } from '@/services/iso-audit.service';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const standardId = searchParams.get('standard_id');

        const dataDir = await getCompanyDataDir();
        const isoAuditService = getIsoAuditService(dataDir);
        const kpis = isoAuditService.getDashboardKPIs(standardId ? parseInt(standardId) : undefined);
        return NextResponse.json(kpis);
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
    }
}
