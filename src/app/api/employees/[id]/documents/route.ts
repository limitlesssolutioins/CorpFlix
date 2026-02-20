
import { NextRequest, NextResponse } from 'next/server';
import { getCompanyDataDir } from '@/lib/companyContext';
import { getEmployeesService } from '@/services/employees.service';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const dataDir = await getCompanyDataDir();
        const employeesService = getEmployeesService(dataDir);
        const docs = await employeesService.getDocuments(params.id);
        return NextResponse.json(docs);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
    }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const dataDir = await getCompanyDataDir();
        const employeesService = getEmployeesService(dataDir);
        const body = await req.json();
        const doc = await employeesService.addDocument(params.id, body);
        return NextResponse.json(doc, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to add document' }, { status: 400 });
    }
}
