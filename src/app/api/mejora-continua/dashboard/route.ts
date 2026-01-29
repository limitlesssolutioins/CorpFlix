import { NextResponse } from 'next/server';
import { mejoraContinuaService } from '@/services/mejora-continua.service';

export async function GET() {
    try {
        const kpis = mejoraContinuaService.getDashboardKPIs();
        const categories = mejoraContinuaService.getAllCategories();

        return NextResponse.json({ ...kpis, categories });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
    }
}
