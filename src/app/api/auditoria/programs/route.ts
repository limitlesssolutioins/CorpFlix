import { NextResponse } from 'next/server';
import { getCompanyDataDir } from '@/lib/companyContext';
import { getIsoAuditService } from '@/services/iso-audit.service';

export async function GET(request: Request) {
    try {
        const dataDir = await getCompanyDataDir();
        const svc = getIsoAuditService(dataDir);
        const { searchParams } = new URL(request.url);
        const standardId = searchParams.get('standard_id');
        const year = searchParams.get('year');
        return NextResponse.json(svc.getPrograms(
            standardId ? Number(standardId) : undefined,
            year ? Number(year) : undefined
        ));
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch programs' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const dataDir = await getCompanyDataDir();
        const svc = getIsoAuditService(dataDir);
        const body = await request.json();
        if (!body.year) return NextResponse.json({ error: 'year is required' }, { status: 400 });
        return NextResponse.json(svc.createProgram(body), { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create program' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const dataDir = await getCompanyDataDir();
        const svc = getIsoAuditService(dataDir);
        const body = await request.json();
        const { id, ...data } = body;
        if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
        const updated = svc.updateProgram(id, data);
        if (!updated) return NextResponse.json({ error: 'Program not found' }, { status: 404 });
        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update program' }, { status: 500 });
    }
}
