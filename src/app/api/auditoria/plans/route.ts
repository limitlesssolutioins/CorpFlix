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
        return NextResponse.json(svc.getAuditPlan(Number(auditId)));
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch plan' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const dataDir = await getCompanyDataDir();
        const svc = getIsoAuditService(dataDir);
        const body = await request.json();
        const { auditId, plan, activities } = body;
        if (!auditId) return NextResponse.json({ error: 'auditId is required' }, { status: 400 });
        const result = svc.saveAuditPlan(Number(auditId), plan || {}, activities || []);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save plan' }, { status: 500 });
    }
}
