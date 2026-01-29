import { NextResponse } from 'next/server';
import { isoAuditService } from '@/services/iso-audit.service';

// GET /api/auditoria/requirements - Obtener requisitos (opcionalmente por capítulo)
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const chapterId = searchParams.get('chapter_id');

        const requirements = chapterId
            ? isoAuditService.getRequirementsByChapter(parseInt(chapterId))
            : isoAuditService.getAllRequirements();

        return NextResponse.json(requirements);
    } catch (error) {
        console.error('Error fetching requirements:', error);
        return NextResponse.json({ error: 'Failed to fetch requirements' }, { status: 500 });
    }
}
