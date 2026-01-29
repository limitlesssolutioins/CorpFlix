import { NextResponse } from 'next/server';
import { isoAuditService } from '@/services/iso-audit.service';

// GET /api/auditoria/dashboard - Obtener KPIs y estadísticas
export async function GET() {
    try {
        const kpis = isoAuditService.getDashboardKPIs();
        return NextResponse.json(kpis);
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
    }
}
