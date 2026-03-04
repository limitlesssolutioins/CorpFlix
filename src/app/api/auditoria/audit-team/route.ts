import { NextResponse } from 'next/server';
import { getCompanyDataDir } from '@/lib/companyContext';
import { getIsoAuditService } from '@/services/iso-audit.service';

export async function GET(request: Request) {
    try {
        const dataDir = await getCompanyDataDir();
        const svc = getIsoAuditService(dataDir);
        const { searchParams } = new URL(request.url);
        const auditId = searchParams.get('audit_id');
        if (!auditId) return NextResponse.json({ error: 'audit_id is required' }, { status: 400 });
        return NextResponse.json(svc.getAuditTeam(Number(auditId)));
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch audit team' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const dataDir = await getCompanyDataDir();
        const svc = getIsoAuditService(dataDir);
        const body = await request.json();
        const { auditId, members } = body;
        if (!auditId || !Array.isArray(members)) {
            return NextResponse.json({ error: 'auditId and members[] are required' }, { status: 400 });
        }
        svc.setAuditTeam(Number(auditId), members);
        return NextResponse.json(svc.getAuditTeam(Number(auditId)));
    } catch (error) {
        return NextResponse.json({ error: 'Failed to set audit team' }, { status: 500 });
    }
}
