import { NextResponse } from 'next/server';
import { getCompanyDataDir } from '@/lib/companyContext';
import { getIsoAuditService } from '@/services/iso-audit.service';

export async function GET(request: Request) {
    try {
        const dataDir = await getCompanyDataDir();
        const isoAuditService = getIsoAuditService(dataDir);
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
