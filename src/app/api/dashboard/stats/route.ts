
import { NextResponse } from 'next/server';
import { dashboardService } from '@/services/dashboard.service';

export async function GET() {
    try {
        const stats = await dashboardService.getStats();
        return NextResponse.json(stats);
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
