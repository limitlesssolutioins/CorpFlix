import { NextResponse } from 'next/server';
import { riskService } from '@/services/risk.service';

// GET /api/riesgos/controls - Obtener controles por assessment
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const assessment_id = searchParams.get('assessment_id');

        if (!assessment_id) {
            return NextResponse.json(
                { error: 'Assessment ID is required' },
                { status: 400 }
            );
        }

        const controls = riskService.getControlsByAssessment(parseInt(assessment_id));
        return NextResponse.json(controls);
    } catch (error) {
        console.error('Error fetching controls:', error);
        return NextResponse.json(
            { error: 'Failed to fetch controls' },
            { status: 500 }
        );
    }
}

// POST /api/riesgos/controls - Crear nuevo control
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const newControl = riskService.createControl(body);
        return NextResponse.json(newControl, { status: 201 });
    } catch (error) {
        console.error('Error creating control:', error);
        return NextResponse.json(
            { error: 'Failed to create control' },
            { status: 500 }
        );
    }
}
