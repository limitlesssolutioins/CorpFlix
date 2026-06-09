import { NextResponse } from 'next/server';
import { auditMasterService } from '@/services/audit-master.service';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const requirementId = parseInt(searchParams.get('requirementId') || '');
        const variables = await auditMasterService.getVariables(requirementId);
        return NextResponse.json(variables);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch variables' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { requirementId, variables } = await req.json();
        await auditMasterService.saveVariables(requirementId, variables);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save variables' }, { status: 500 });
    }
}
