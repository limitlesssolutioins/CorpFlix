import { NextResponse } from 'next/server';
import { getCompanyDataDir } from '@/lib/companyContext';
import { getIsoAuditService } from '@/services/iso-audit.service';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const auditId = searchParams.get('audit_id');
        if (!auditId) return NextResponse.json({ error: 'audit_id required' }, { status: 400 });

        const dataDir = await getCompanyDataDir();
        const service = getIsoAuditService(dataDir);
        const answers = service.getBulkVariableAnswers(parseInt(auditId));
        return NextResponse.json(answers);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch answers' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { audit_id, requirement_id, variable_id, answer } = body;
        if (!audit_id || !requirement_id || !variable_id || !answer) {
            return NextResponse.json({ error: 'audit_id, requirement_id, variable_id, answer required' }, { status: 400 });
        }

        const dataDir = await getCompanyDataDir();
        const service = getIsoAuditService(dataDir);
        service.saveVariableAnswer(parseInt(audit_id), parseInt(requirement_id), parseInt(variable_id), answer);
        return NextResponse.json({ ok: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save answer' }, { status: 500 });
    }
}
