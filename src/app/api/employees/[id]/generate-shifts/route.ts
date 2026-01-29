
import { NextRequest, NextResponse } from 'next/server';
import { employeesService } from '@/services/employees.service';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const result = await employeesService.generateShiftsForMonth(params.id, body.month, body.year);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
