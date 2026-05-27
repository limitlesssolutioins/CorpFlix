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
        
        const report = await svc.getAuditReport(auditId);
        return NextResponse.json(report);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch audit report' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const dataDir = await getCompanyDataDir();
        const svc = getIsoAuditService(dataDir);
        const body = await request.json();
        const { auditId, ...data } = body;
        if (!auditId) return NextResponse.json({ error: 'auditId is required' }, { status: 400 });
        
        const saved = await svc.saveAuditReport(auditId, data);
        return NextResponse.json(saved);
    } catch (error) {
        console.error('Error saving audit report:', error);
        return NextResponse.json({ error: 'Failed to save audit report' }, { status: 500 });
    }
}
