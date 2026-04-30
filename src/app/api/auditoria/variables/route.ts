import { NextResponse } from 'next/server';
import { getCompanyId } from '@/lib/companyContext';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const companyId = await getCompanyId();
        if (!companyId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const requirementId = searchParams.get('requirement_id');
        if (!requirementId) return NextResponse.json({ error: 'requirement_id required' }, { status: 400 });

        const variables = await prisma.requirementVariable.findMany({
            where: { requirementId: parseInt(requirementId) },
            orderBy: { order: 'asc' }
        });

        const mappedVars = variables.map(v => ({
            id: v.id,
            requirement_id: v.requirementId,
            variable_text: v.text,
            variable_order: v.order
        }));

        return NextResponse.json(mappedVars);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch variables' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const companyId = await getCompanyId();
        if (!companyId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const { requirement_id, variables } = body;
        if (!requirement_id || !Array.isArray(variables)) {
            return NextResponse.json({ error: 'requirement_id and variables required' }, { status: 400 });
        }

        const reqId = parseInt(requirement_id);

        // Delete existing variables
        await prisma.requirementVariable.deleteMany({
            where: { requirementId: reqId }
        });

        // Create new ones
        const newVariables = await prisma.$transaction(
            variables.map((text: string, index: number) => 
                prisma.requirementVariable.create({
                    data: {
                        requirementId: reqId,
                        text,
                        order: index + 1
                    }
                })
            )
        );

        const mappedVars = newVariables.map(v => ({
            id: v.id,
            requirement_id: v.requirementId,
            variable_text: v.text,
            variable_order: v.order
        }));

        return NextResponse.json(mappedVars);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save variables' }, { status: 500 });
    }
}
