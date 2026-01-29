
import { NextRequest, NextResponse } from 'next/server';
import { shiftsService } from '@/services/shifts.service';

export async function GET() {
    try {
        const shifts = await shiftsService.findAll();
        return NextResponse.json(shifts);
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const shift = await shiftsService.create(body);
        return NextResponse.json(shift, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}
