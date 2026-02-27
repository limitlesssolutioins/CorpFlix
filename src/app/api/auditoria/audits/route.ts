import { NextResponse } from 'next/server';
import { getCompanyDataDir } from '@/lib/companyContext';
import { getIsoAuditService } from '@/services/iso-audit.service';

export async function GET(request: Request) {
    try {
        const dataDir = await getCompanyDataDir();
        const isoAuditService = getIsoAuditService(dataDir);
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const year = searchParams.get('year');

        const standardId = searchParams.get('standard_id');

        const filters: any = {};
        if (status) filters.status = status;
        if (year) filters.year = parseInt(year);
        if (standardId) filters.standard_id = parseInt(standardId);

        const audits = isoAuditService.getAllAudits(filters);
        return NextResponse.json(audits);
    } catch (error) {
        console.error('Error fetching audits:', error);
        return NextResponse.json({ error: 'Failed to fetch audits' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const dataDir = await getCompanyDataDir();
        const isoAuditService = getIsoAuditService(dataDir);
        const body = await request.json();
        const newAudit = isoAuditService.createAudit(body);
        return NextResponse.json(newAudit, { status: 201 });
    } catch (error) {
        console.error('Error creating audit:', error);
        return NextResponse.json({ error: 'Failed to create audit' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const dataDir = await getCompanyDataDir();
        const isoAuditService = getIsoAuditService(dataDir);
        const body = await request.json();
        const { id, ...updateData } = body;

        if (!id) {
            return NextResponse.json({ error: 'Audit ID is required' }, { status: 400 });
        }

        const updatedAudit = isoAuditService.updateAudit(id, updateData);
        if (!updatedAudit) {
            return NextResponse.json({ error: 'Audit not found' }, { status: 404 });
        }

        return NextResponse.json(updatedAudit);
    } catch (error) {
        console.error('Error updating audit:', error);
        return NextResponse.json({ error: 'Failed to update audit' }, { status: 500 });
    }
}
