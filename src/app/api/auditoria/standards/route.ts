import { NextResponse } from 'next/server';
import { getCompanyDataDir } from '@/lib/companyContext';
import { getIsoAuditService } from '@/services/iso-audit.service';

export async function GET() {
    try {
        const dataDir = await getCompanyDataDir();
        const service = getIsoAuditService(dataDir);
        const standards = service.getAllStandards();
        return NextResponse.json(standards);
    } catch (error) {
        console.error('Error fetching standards:', error);
        return NextResponse.json({ error: 'Failed to fetch standards' }, { status: 500 });
    }
}
