import { NextResponse } from 'next/server';
import { getCompanyDataDir } from '@/lib/companyContext';
import { getSaludMentalService } from '@/services/salud-mental.service';

export async function GET() {
    try {
        const dataDir = await getCompanyDataDir();
        const service = getSaludMentalService(dataDir);
        const respuestas = service.getRespuestas();
        return NextResponse.json(respuestas);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const dataDir = await getCompanyDataDir();
        const service = getSaludMentalService(dataDir);
        const body = await request.json();
        const result = service.guardarRespuesta(body);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
    }
}
