import { NextResponse } from 'next/server';
import { getCompanyDataDir } from '@/lib/companyContext';
import { getIsoAuditService } from '@/services/iso-audit.service';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const requirementId = searchParams.get('requirement_id');
        if (!requirementId) return NextResponse.json({ error: 'requirement_id required' }, { status: 400 });

        const dataDir = await getCompanyDataDir();
        const service = getIsoAuditService(dataDir);
        const variables = service.getRequirementVariables(parseInt(requirementId));
        return NextResponse.json(variables);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch variables' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { requirement_id, variables } = body;
        if (!requirement_id || !Array.isArray(variables)) {
            return NextResponse.json({ error: 'requirement_id and variables required' }, { status: 400 });
        }

        const dataDir = await getCompanyDataDir();
        const service = getIsoAuditService(dataDir);
        const saved = service.saveRequirementVariables(parseInt(requirement_id), variables);
        return NextResponse.json(saved);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save variables' }, { status: 500 });
    }
}
