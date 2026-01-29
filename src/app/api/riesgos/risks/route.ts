import { NextResponse } from 'next/server';
import { riskService } from '@/services/risk.service';

// GET /api/riesgos/risks - Obtener todos los riesgos (con filtros opcionales)
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const category_id = searchParams.get('category_id');
        const status = searchParams.get('status');

        const filters: any = {};
        if (category_id) filters.category_id = parseInt(category_id);
        if (status) filters.status = status;

        const risks = riskService.getAllRisks(filters);
        return NextResponse.json(risks);
    } catch (error) {
        console.error('Error fetching risks:', error);
        return NextResponse.json(
            { error: 'Failed to fetch risks' },
            { status: 500 }
        );
    }
}

// POST /api/riesgos/risks - Crear nuevo riesgo
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const newRisk = riskService.createRisk(body);
        return NextResponse.json(newRisk, { status: 201 });
    } catch (error) {
        console.error('Error creating risk:', error);
        return NextResponse.json(
            { error: 'Failed to create risk' },
            { status: 500 }
        );
    }
}

// PUT /api/riesgos/risks - Actualizar riesgo existente
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, ...updateData } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'Risk ID is required' },
                { status: 400 }
            );
        }

        const updatedRisk = riskService.updateRisk(id, updateData);

        if (!updatedRisk) {
            return NextResponse.json(
                { error: 'Risk not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedRisk);
    } catch (error) {
        console.error('Error updating risk:', error);
        return NextResponse.json(
            { error: 'Failed to update risk' },
            { status: 500 }
        );
    }
}

// DELETE /api/riesgos/risks - Eliminar riesgo
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Risk ID is required' },
                { status: 400 }
            );
        }

        const deleted = riskService.deleteRisk(parseInt(id));

        if (!deleted) {
            return NextResponse.json(
                { error: 'Risk not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting risk:', error);
        return NextResponse.json(
            { error: 'Failed to delete risk' },
            { status: 500 }
        );
    }
}
