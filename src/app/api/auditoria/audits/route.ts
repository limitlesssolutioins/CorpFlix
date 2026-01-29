import { NextResponse } from 'next/server';
import { isoAuditService } from '@/services/iso-audit.service';

// GET /api/auditoria/audits - Obtener auditorías
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const year = searchParams.get('year');

        const filters: any = {};
        if (status) filters.status = status;
        if (year) filters.year = parseInt(year);

        const audits = isoAuditService.getAllAudits(filters);
        return NextResponse.json(audits);
    } catch (error) {
        console.error('Error fetching audits:', error);
        return NextResponse.json({ error: 'Failed to fetch audits' }, { status: 500 });
    }
}

// POST /api/auditoria/audits - Crear nueva auditoría
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const newAudit = isoAuditService.createAudit(body);
        return NextResponse.json(newAudit, { status: 201 });
    } catch (error) {
        console.error('Error creating audit:', error);
        return NextResponse.json({ error: 'Failed to create audit' }, { status: 500 });
    }
}

// PUT /api/auditoria/audits - Actualizar auditoría
export async function PUT(request: Request) {
    try {
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
