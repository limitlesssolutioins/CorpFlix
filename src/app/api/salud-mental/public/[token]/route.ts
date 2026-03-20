import { NextResponse } from 'next/server';
import { getSaludMentalService } from '@/services/salud-mental.service';
import path from 'path';

export async function GET(request: Request, { params }: { params: { token: string } }) {
    try {
        const { token } = await params;
        const parts = token.split('___');
        const companyId = parts.length > 1 ? parts[0] : null;

        if (!companyId) {
            return NextResponse.json({ error: 'Token inválido' }, { status: 400 });
        }

        const dataDir = path.join(process.cwd(), 'src/data/companies', companyId);
        const service = getSaludMentalService(dataDir);
        const evaluacion = service.getEvaluacion(token);
        
        if (!evaluacion) {
            return NextResponse.json({ error: 'Token inválido o no encontrado' }, { status: 404 });
        }

        if (evaluacion.estado === 'COMPLETADO') {
            return NextResponse.json({ error: 'Esta evaluación ya fue completada' }, { status: 400 });
        }

        return NextResponse.json(evaluacion);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}

export async function POST(request: Request, { params }: { params: { token: string } }) {
    try {
        const { token } = await params;
        const parts = token.split('___');
        const companyId = parts.length > 1 ? parts[0] : null;

        if (!companyId) {
            return NextResponse.json({ error: 'Token inválido' }, { status: 400 });
        }

        const dataDir = path.join(process.cwd(), 'src/data/companies', companyId);
        const service = getSaludMentalService(dataDir);
        const evaluacion = service.getEvaluacion(token);
        
        if (!evaluacion) {
            return NextResponse.json({ error: 'Token inválido' }, { status: 404 });
        }

        if (evaluacion.estado === 'COMPLETADO') {
            return NextResponse.json({ error: 'Esta evaluación ya fue completada' }, { status: 400 });
        }

        const body = await request.json();
        
        // Calcular nivel de riesgo simple (para demostración, la lógica real de la batería es más compleja)
        const calculateRisk = (answers: Record<string, number>, count: number) => {
            let total = 0;
            Object.values(answers).forEach(v => total += v);
            const percentage = (total / (count * 4)) * 100;
            if (percentage > 75) return 'Muy Alto';
            if (percentage > 50) return 'Alto';
            if (percentage > 25) return 'Medio';
            if (percentage > 10) return 'Bajo';
            return 'Sin Riesgo';
        };

        const result = service.guardarRespuesta({
            token: evaluacion.token,
            empleadoId: evaluacion.empleadoId,
            empleadoNombre: evaluacion.empleadoNombre,
            fecha: new Date().toISOString(),
            formulario: evaluacion.formulario,
            consentimiento: body.consentimiento,
            respuestasIntralaboral: body.respuestasIntralaboral,
            respuestasExtralaboral: body.respuestasExtralaboral,
            respuestasEstres: body.respuestasEstres,
            nivelRiesgoIntra: calculateRisk(body.respuestasIntralaboral, evaluacion.formulario === 'A' ? 123 : 97),
            nivelRiesgoExtra: calculateRisk(body.respuestasExtralaboral, 31),
            nivelRiesgoEstres: calculateRisk(body.respuestasEstres, 31)
        });

        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
    }
}
