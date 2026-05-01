import { NextResponse } from 'next/server';
import { getCompanyId } from '@/lib/companyContext';
import { query } from '@/lib/db';

export async function GET(request: Request) {
    try {
        const companyId = await getCompanyId();
        if (!companyId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const requirementId = searchParams.get('requirement_id');
        if (!requirementId) return NextResponse.json({ error: 'requirement_id required' }, { status: 400 });

        const variables = await query<any[]>('SELECT * FROM RequirementVariable WHERE requirementId = ? ORDER BY `order` ASC', [parseInt(requirementId)]);

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
        await query('DELETE FROM RequirementVariable WHERE requirementId = ?', [reqId]);

        // Create new ones
        const newVariables = [];
        for (let i = 0; i < variables.length; i++) {
            const text = variables[i];
            const order = i + 1;
            const insertResult = await query<any>('INSERT INTO RequirementVariable (requirementId, text, `order`) VALUES (?, ?, ?)', [reqId, text, order]);
            newVariables.push({
                id: insertResult.insertId,
                requirementId: reqId,
                text,
                order
            });
        }

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
