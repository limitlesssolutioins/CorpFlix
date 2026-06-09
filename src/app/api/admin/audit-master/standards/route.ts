import { NextResponse } from 'next/server';
import { auditMasterService } from '@/services/audit-master.service';

export async function GET() {
    try {
        const standards = await auditMasterService.getStandards();
        return NextResponse.json(standards);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch standards' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const id = await auditMasterService.createStandard(data);
        return NextResponse.json({ id });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create standard' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const { id, ...data } = await req.json();
        await auditMasterService.updateStandard(id, data);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update standard' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = parseInt(searchParams.get('id') || '');
        await auditMasterService.deleteStandard(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete standard' }, { status: 500 });
    }
}
