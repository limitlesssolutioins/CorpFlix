import { NextResponse } from 'next/server';
import { getCompanyDataDir } from '@/lib/companyContext';
import { getIsoAuditService } from '@/services/iso-audit.service';

export async function GET(request: Request) {
    try {
        const dataDir = await getCompanyDataDir();
        const isoAuditService = getIsoAuditService(dataDir);
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');

        const filters: any = {};
        if (status) filters.status = status;

        const actions = isoAuditService.getAllCorrectiveActions(filters);
        return NextResponse.json(actions);
    } catch (error) {
        console.error('Error fetching corrective actions:', error);
        return NextResponse.json({ error: 'Failed to fetch actions' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const dataDir = await getCompanyDataDir();
        const isoAuditService = getIsoAuditService(dataDir);
        const body = await request.json();
        const newAction = isoAuditService.createCorrectiveAction(body);
        return NextResponse.json(newAction, { status: 201 });
    } catch (error) {
        console.error('Error creating corrective action:', error);
        return NextResponse.json({ error: 'Failed to create action' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const dataDir = await getCompanyDataDir();
        const isoAuditService = getIsoAuditService(dataDir);
        const body = await request.json();
        const { id, ...updateData } = body;

        if (!id) {
            return NextResponse.json({ error: 'Action ID is required' }, { status: 400 });
        }

        const updatedAction = isoAuditService.updateCorrectiveAction(id, updateData);
        if (!updatedAction) {
            return NextResponse.json({ error: 'Action not found' }, { status: 404 });
        }

        return NextResponse.json(updatedAction);
    } catch (error) {
        console.error('Error updating corrective action:', error);
        return NextResponse.json({ error: 'Failed to update action' }, { status: 500 });
    }
}
