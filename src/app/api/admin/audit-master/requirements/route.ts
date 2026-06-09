import { NextResponse } from 'next/server';
import { auditMasterService } from '@/services/audit-master.service';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const chapterId = parseInt(searchParams.get('chapterId') || '');
        const requirements = await auditMasterService.getRequirements(chapterId);
        return NextResponse.json(requirements);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch requirements' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const id = await auditMasterService.createRequirement(data);
        return NextResponse.json({ id });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create requirement' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const { id, ...data } = await req.json();
        await auditMasterService.updateRequirement(id, data);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update requirement' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = parseInt(searchParams.get('id') || '');
        await auditMasterService.deleteRequirement(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete requirement' }, { status: 500 });
    }
}
