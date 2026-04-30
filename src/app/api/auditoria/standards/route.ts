import { NextResponse } from 'next/server';
import { getCompanyId } from '@/lib/companyContext';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const companyId = await getCompanyId();
        if (!companyId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const standards = await prisma.auditStandard.findMany({
            orderBy: { id: 'asc' },
            include: {
                _count: {
                    select: { chapters: true }
                }
            }
        });
        
        // Map to match old API format expectations if necessary, 
        // though Prisma format is often directly usable.
        const mappedStandards = standards.map(s => ({
            id: s.id,
            code: s.code,
            name: s.name,
            full_name: s.fullName,
            category: s.category,
            color: s.color,
            description: s.description,
            total_requirements: s._count.chapters // approximate mapped value for UI
        }));

        return NextResponse.json(mappedStandards);
    } catch (error) {
        console.error('Error fetching standards:', error);
        return NextResponse.json({ error: 'Failed to fetch standards' }, { status: 500 });
    }
}
