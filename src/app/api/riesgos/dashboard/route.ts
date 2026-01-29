import { NextResponse } from 'next/server';
import { riskService } from '@/services/risk.service';

// GET /api/riesgos/dashboard - Obtener KPIs y estadísticas para dashboard
export async function GET() {
    try {
        const kpis = riskService.getDashboardKPIs();
        return NextResponse.json(kpis);
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch dashboard data' },
            { status: 500 }
        );
    }
}
