import { NextResponse } from 'next/server';
import { riskService } from '@/services/risk.service';

// GET /api/riesgos/categories - Obtener todas las categorías
export async function GET() {
    try {
        const categories = riskService.getAllCategories();
        return NextResponse.json(categories);
    } catch (error) {
        console.error('Error fetching risk categories:', error);
        return NextResponse.json(
            { error: 'Failed to fetch risk categories' },
            { status: 500 }
        );
    }
}
