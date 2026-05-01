import { NextResponse } from 'next/server';
import { getCompanyDataDir } from '@/lib/companyContext';
import { getIsoAuditService } from '@/services/iso-audit.service';

export async function GET() {
    try {
        const dataDir = await getCompanyDataDir();
        const svc = getIsoAuditService(dataDir);
        const auditors = await svc.getAuditors();
        return NextResponse.json(auditors);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch auditors' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const dataDir = await getCompanyDataDir();
        const svc = getIsoAuditService(dataDir);
        const body = await request.json();
        if (!body.name) return NextResponse.json({ error: 'name is required' }, { status: 400 });
        const newAuditor = await svc.createAuditor(body);
        return NextResponse.json(newAuditor, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create auditor' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const dataDir = await getCompanyDataDir();
        const svc = getIsoAuditService(dataDir);
        const body = await request.json();
        const { id, ...data } = body;
        if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
        const updated = await svc.updateAuditor(id, data);
        if (!updated) return NextResponse.json({ error: 'Auditor not found' }, { status: 404 });
        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update auditor' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const dataDir = await getCompanyDataDir();
        const svc = getIsoAuditService(dataDir);
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
        const result = await svc.deleteAuditor(Number(id));
        if (!result.success) return NextResponse.json({ error: result.reason }, { status: 409 });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete auditor' }, { status: 500 });
    }
}
