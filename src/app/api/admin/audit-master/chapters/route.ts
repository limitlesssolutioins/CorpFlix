import { NextResponse } from 'next/server';
import { auditMasterService } from '@/services/audit-master.service';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const standardId = parseInt(searchParams.get('standardId') || '');
        const chapters = await auditMasterService.getChapters(standardId);
        return NextResponse.json(chapters);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch chapters' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const id = await auditMasterService.createChapter(data);
        return NextResponse.json({ id });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create chapter' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const { id, ...data } = await req.json();
        await auditMasterService.updateChapter(id, data);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update chapter' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = parseInt(searchParams.get('id') || '');
        await auditMasterService.deleteChapter(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete chapter' }, { status: 500 });
    }
}
