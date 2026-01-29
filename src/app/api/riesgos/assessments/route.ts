import { NextResponse } from 'next/server';
import { riskService } from '@/services/risk.service';

// GET /api/riesgos/assessments - Obtener todas las evaluaciones
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const risk_id = searchParams.get('risk_id');

        const filters: any = {};
        if (risk_id) filters.risk_id = parseInt(risk_id);

        const assessments = riskService.getAllAssessments(filters);
        return NextResponse.json(assessments);
    } catch (error) {
        console.error('Error fetching assessments:', error);
        return NextResponse.json(
            { error: 'Failed to fetch assessments' },
            { status: 500 }
        );
    }
}

// POST /api/riesgos/assessments - Crear nueva evaluación
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const newAssessment = riskService.createAssessment(body);
        return NextResponse.json(newAssessment, { status: 201 });
    } catch (error) {
        console.error('Error creating assessment:', error);
        return NextResponse.json(
            { error: 'Failed to create assessment' },
            { status: 500 }
        );
    }
}
