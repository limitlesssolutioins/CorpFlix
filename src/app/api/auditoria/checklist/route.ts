import { NextResponse } from 'next/server';
import { getCompanyDataDir } from '@/lib/companyContext';
import { getIsoAuditService } from '@/services/iso-audit.service';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const auditId = searchParams.get('audit_id');

        if (!auditId) {
            return NextResponse.json({ error: 'audit_id is required' }, { status: 400 });
        }

        const dataDir = await getCompanyDataDir();
        const service = getIsoAuditService(dataDir);
        const findings = service.getBulkFindings(parseInt(auditId));
        return NextResponse.json(findings);
    } catch (error) {
        console.error('Error fetching checklist:', error);
        return NextResponse.json({ error: 'Failed to fetch checklist' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const dataDir = await getCompanyDataDir();
        const service = getIsoAuditService(dataDir);
        const body = await request.json();
        const { audit_id, findings } = body;

        if (!audit_id || !Array.isArray(findings)) {
            return NextResponse.json({ error: 'audit_id and findings array are required' }, { status: 400 });
        }

        const result = service.saveBulkFindings(parseInt(audit_id), findings);
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error('Error saving checklist:', error);
        return NextResponse.json({ error: 'Failed to save checklist' }, { status: 500 });
    }
}
