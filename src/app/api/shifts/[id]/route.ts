
import { NextRequest, NextResponse } from 'next/server';
import { getCompanyDataDir } from '@/lib/companyContext';
import { getShiftsService } from '@/services/shifts.service';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const dataDir = await getCompanyDataDir();
        const shiftsService = getShiftsService(dataDir);
        const body = await req.json();
        const shift = await shiftsService.update(params.id, body);
        return NextResponse.json(shift);
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const dataDir = await getCompanyDataDir();
        const shiftsService = getShiftsService(dataDir);
        await shiftsService.remove(params.id);
        return NextResponse.json({ message: 'Shift deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
