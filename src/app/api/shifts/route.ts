import { NextRequest, NextResponse } from 'next/server';
import { getCompanyDataDir } from '@/lib/companyContext';
import { getShiftsService } from '@/services/shifts.service';

export async function GET() {
    try {
        const dataDir = await getCompanyDataDir();
        const shiftsService = getShiftsService(dataDir);
        const shifts = await shiftsService.findAll();
        return NextResponse.json(shifts);
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const dataDir = await getCompanyDataDir();
        const shiftsService = getShiftsService(dataDir);
        const body = await req.json();
        const shift = await shiftsService.create(body);
        return NextResponse.json(shift, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}
