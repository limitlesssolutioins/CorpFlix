import { NextResponse } from 'next/server';
import { getCompanyId } from '@/lib/companyContext';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const companyId = await getCompanyId();
        if (!companyId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const standardId = searchParams.get('standard_id');

        const chapters = await prisma.auditChapter.findMany({
            where: standardId ? { standardId: parseInt(standardId) } : undefined,
            orderBy: { chapterNumber: 'asc' }
        });

        const mappedChapters = chapters.map(c => ({
            id: c.id,
            standard_id: c.standardId,
            chapter_number: c.chapterNumber,
            chapter_title: c.title,
            description: c.description
        }));

        return NextResponse.json(mappedChapters);
    } catch (error) {
        console.error('Error fetching ISO chapters:', error);
        return NextResponse.json({ error: 'Failed to fetch chapters' }, { status: 500 });
    }
}
