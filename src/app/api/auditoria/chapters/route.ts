import { NextResponse } from 'next/server';
import { isoAuditService } from '@/services/iso-audit.service';

// GET /api/auditoria/chapters - Obtener todos los capítulos ISO 9001
export async function GET() {
    try {
        const chapters = isoAuditService.getAllChapters();
        return NextResponse.json(chapters);
    } catch (error) {
        console.error('Error fetching ISO chapters:', error);
        return NextResponse.json({ error: 'Failed to fetch chapters' }, { status: 500 });
    }
}
