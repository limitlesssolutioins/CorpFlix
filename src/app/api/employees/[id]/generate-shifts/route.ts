
import { NextRequest, NextResponse } from 'next/server';
import { getCompanyDataDir } from '@/lib/companyContext';
import { getEmployeesService } from '@/services/employees.service';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const dataDir = await getCompanyDataDir();
        const employeesService = getEmployeesService(dataDir);
        const body = await req.json();
        const result = await (employeesService as any).generateShiftsForMonth(id, body.month, body.year);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}
