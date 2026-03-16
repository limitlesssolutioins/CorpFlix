import { NextResponse } from 'next/server';
import { verifySession, getCompanyId } from '@/lib/companyContext';
import { emitTaskProgress } from '@/lib/socket-server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const companyId = await getCompanyId();
    if (!companyId) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const taskId = `report-${Date.now()}`;

    // Lógica asíncrona simulada con Sockets para progreso
    (async () => {
      try {
        // Paso 1: Inicio
        emitTaskProgress(companyId, taskId, 10, 'Iniciando generación de reporte estratégico...');
        await new Promise(r => setTimeout(r, 2000));

        // Paso 2: Análisis de datos
        emitTaskProgress(companyId, taskId, 30, 'Analizando matriz de riesgos e indicadores...');
        await new Promise(r => setTimeout(r, 3000));

        // Paso 3: IA
        emitTaskProgress(companyId, taskId, 60, 'Gemini AI está redactando las conclusiones ejecutivas...');
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent("Genera un resumen ejecutivo breve (3 párrafos) sobre la importancia de la gestión de riesgos en una empresa moderna.");
        const text = result.response.text();
        await new Promise(r => setTimeout(r, 2000));

        // Paso 4: Estructuración
        emitTaskProgress(companyId, taskId, 90, 'Estructurando documento final y recomendaciones...');
        await new Promise(r => setTimeout(r, 2000));

        // Paso 5: Finalización
        emitTaskProgress(companyId, taskId, 100, 'Reporte generado con éxito.', { 
            reportText: text,
            downloadUrl: '#' 
        });
      } catch (err) {
        emitTaskProgress(companyId, taskId, 0, 'Error durante la generación del reporte.');
      }
    })();

    return NextResponse.json({ success: true, taskId });

  } catch (error) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
