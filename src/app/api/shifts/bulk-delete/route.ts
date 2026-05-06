
import { NextResponse } from 'next/server';
import { getCompanyDataDir } from '@/lib/companyContext';
import { getShiftsService } from '@/services/shifts.service';

export async function POST(req: Request) {
    try {
        const dataDir = await getCompanyDataDir();
        const shiftsService = getShiftsService(dataDir);
        const { ids } = await req.json();
        if (!ids || !Array.isArray(ids)) {
            return NextResponse.json({ error: 'Invalid ids' }, { status: 400 });
        }
        await shiftsService.bulkDelete(ids);
        return NextResponse.json({ message: 'Deleted' });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
