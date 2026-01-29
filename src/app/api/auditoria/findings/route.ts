import { NextResponse } from 'next/server';
import { isoAuditService } from '@/services/iso-audit.service';

// GET /api/auditoria/findings - Obtener hallazgos por auditoría
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const auditId = searchParams.get('audit_id');

        if (!auditId) {
            return NextResponse.json({ error: 'Audit ID is required' }, { status: 400 });
        }

        const findings = isoAuditService.getFindingsByAudit(parseInt(auditId));
        return NextResponse.json(findings);
    } catch (error) {
        console.error('Error fetching findings:', error);
        return NextResponse.json({ error: 'Failed to fetch findings' }, { status: 500 });
    }
}

// POST /api/auditoria/findings - Crear hallazgo
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const newFinding = isoAuditService.createFinding(body);
        return NextResponse.json(newFinding, { status: 201 });
    } catch (error) {
        console.error('Error creating finding:', error);
        return NextResponse.json({ error: 'Failed to create finding' }, { status: 500 });
    }
}
