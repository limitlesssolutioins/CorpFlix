import { NextResponse } from 'next/server';
import { getCompanyDataDir } from '@/lib/companyContext';
import { getMejoraContinuaService } from '@/services/mejora-continua.service';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { riskDescription, actionDescription, responsible, targetDate, riskLevel, categoryName } = body;

        if (!actionDescription) {
            return NextResponse.json({ error: 'actionDescription es requerido' }, { status: 400 });
        }

        const dataDir = await getCompanyDataDir();
        const mcService = getMejoraContinuaService(dataDir);

        const suggestion = mcService.createSuggestion({
            title: `Plan de Acción: ${riskDescription || 'Riesgo identificado'}`,
            description: `Riesgo identificado en la categoría ${categoryName || 'Riesgos'}.\n\n${riskDescription || ''}`,
            submitted_by: responsible || 'Sistema de Riesgos',
            area_affected: categoryName || 'Gestión de Riesgos',
            current_situation: `Se identificó un riesgo de nivel ${riskLevel || 'ALTO'} que requiere atención.`,
            proposed_solution: actionDescription,
            expected_benefits: 'Reducción del nivel de riesgo y mejora del control organizacional.',
            priority: riskLevel === 'NO ACEPTABLE' ? 1 : riskLevel === 'ALERTA' ? 2 : 3,
        });

        return NextResponse.json({ success: true, suggestion });
    } catch (error) {
        console.error('Error sending to mejora continua:', error);
        return NextResponse.json({ error: 'Error al enviar a Mejora Continua' }, { status: 500 });
    }
}
