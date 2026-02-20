import { NextResponse } from 'next/server';
import { getCompanyDataDir } from '@/lib/companyContext';
import { getIsoAuditService } from '@/services/iso-audit.service';

export async function GET(request: Request) {
    try {
        const dataDir = await getCompanyDataDir();
        const isoAuditService = getIsoAuditService(dataDir);
        const { searchParams } = new URL(request.url);
        const auditId = searchParams.get('audit_id');

        if (!auditId) {
            return NextResponse.json({ error: 'Audit ID is required' }, { status: 400 });
        }

        const findings = isoAuditService.getFindingsByAudit(parseInt(auditId));
        return NextResponse.json(findings);
    } catch (error) {
        console.error('Error fetching findings:', error);
        return NextResponse.json({ error: 'Failed to fetch findings' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const dataDir = await getCompanyDataDir();
        const isoAuditService = getIsoAuditService(dataDir);
        const body = await request.json();
        const newFinding = isoAuditService.createFinding(body);
        return NextResponse.json(newFinding, { status: 201 });
    } catch (error) {
        console.error('Error creating finding:', error);
        return NextResponse.json({ error: 'Failed to create finding' }, { status: 500 });
    }
}
