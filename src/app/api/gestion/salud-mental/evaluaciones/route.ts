import { NextResponse } from 'next/server';
import { getCompanyDataDir } from '@/lib/companyContext';
import { getSaludMentalService } from '@/services/salud-mental.service';

export async function GET() {
    try {
        const dataDir = await getCompanyDataDir();
        const service = getSaludMentalService(dataDir);
        const evaluaciones = service.getEvaluaciones();
        return NextResponse.json(evaluaciones);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const dataDir = await getCompanyDataDir();
        const service = getSaludMentalService(dataDir);
        const body = await request.json();
        
        if (!body.empleadoId || !body.empleadoNombre || !body.formulario) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const ev = service.crearEvaluacion(body.empleadoId, body.empleadoNombre, body.formulario);
        return NextResponse.json(ev);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
    }
}
