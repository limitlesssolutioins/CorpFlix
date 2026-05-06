import { NextResponse } from 'next/server';
import { getCompanyDataDir } from '@/lib/companyContext';
import { getMejoraContinuaService } from '@/services/mejora-continua.service';
import { getIsoAuditService } from '@/services/iso-audit.service';
import { getRiskService } from '@/services/risk.service';

export async function GET() {
    try {
        const dataDir = await getCompanyDataDir();
        const svc = getMejoraContinuaService(dataDir);
        const actions = await svc.getConsolidatedActions();
        return NextResponse.json(actions);
    } catch (error) {
        console.error('Error fetching consolidated actions:', error);
        return NextResponse.json({ error: 'Failed to fetch actions' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const dataDir = await getCompanyDataDir();
        const body = await request.json();
        const { source, realId, ...data } = body;

        if (source === 'AUDITORIA') {
            const auditSvc = getIsoAuditService(dataDir);
            const result = auditSvc.updateCorrectiveAction(realId, {
                corrective_action: data.corrective_action,
                responsible: data.responsible,
                target_date: data.target_date,
                root_cause_analysis: data.root_cause_analysis,
                status: data.status,
                progress: data.progress,
                notes: data.notes
            });
            return NextResponse.json(result);
        } else if (source === 'RIESGOS') {
            const riskSvc = getRiskService(dataDir);
            const result = riskSvc.updateActionPlan(realId, {
                action_description: data.corrective_action,
                responsible: data.responsible,
                target_date: data.target_date,
                status: data.status === 'OPEN' ? 'PENDING' : data.status,
                progress: data.progress,
                notes: data.notes
            });
            return NextResponse.json(result);
        }

        return NextResponse.json({ error: 'Invalid source' }, { status: 400 });
    } catch (error) {
        console.error('Error updating consolidated action:', error);
        return NextResponse.json({ error: 'Failed to update action' }, { status: 500 });
    }
}
