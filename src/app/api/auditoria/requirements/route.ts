import { NextResponse } from 'next/server';
import { getCompanyId } from '@/lib/companyContext';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const companyId = await getCompanyId();
        if (!companyId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const chapterId = searchParams.get('chapter_id');

        const requirements = await prisma.auditRequirement.findMany({
            where: chapterId ? { chapterId: parseInt(chapterId) } : undefined,
            orderBy: { code: 'asc' }
        });

        const mappedReqs = requirements.map(r => ({
            id: r.id,
            chapter_id: r.chapterId,
            requirement_code: r.code,
            requirement_title: r.title,
            requirement_description: r.description,
            is_auditable: r.isAuditable ? 1 : 0,
            weight: r.weight,
        }));

        return NextResponse.json(mappedReqs);
    } catch (error) {
        console.error('Error fetching requirements:', error);
        return NextResponse.json({ error: 'Failed to fetch requirements' }, { status: 500 });
    }
}
