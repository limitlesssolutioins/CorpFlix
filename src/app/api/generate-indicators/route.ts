import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getCompanyDataDir } from '@/lib/companyContext';
import { getManagementService } from '@/services/management.service';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'API Key not configured' }, { status: 500 });
    }

    const dataDir = await getCompanyDataDir();
    const { context } = await request.json();
    const plan = getManagementService(dataDir).getStrategicPlan();
    const objectives = plan.objetivos || [];

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const objectivesSection = objectives.length > 0
      ? `Objetivos Estratégicos actuales:\n${objectives.map((obj: any) => `- ${obj.texto}`).join('\n')}`
      : 'No hay objetivos estratégicos definidos aún. Genera indicadores generales apropiados para el contexto de la empresa.';

    const prompt = `
      Actúa como un experto consultor en Sistemas de Gestión de Calidad ISO 9001:2015.
      Tu tarea es generar Indicadores de Gestión (KPIs) para la empresa.

      Contexto de la empresa: "${context}"

      ${objectivesSection}

      INSTRUCCIONES:
      1. Genera al menos un indicador clave por cada objetivo estratégico.
      2. CADA indicador DEBE incluir:
         - Una FÓRMULA MATEMÁTICA clara con la operación exacta (ej: (Numerador / Denominador) × 100).
         - La descripción del NUMERADOR: qué representa y cómo se obtiene (ej: "Número de clientes que respondieron 'Satisfecho' o 'Muy Satisfecho' en la encuesta mensual").
         - La descripción del DENOMINADOR: qué representa y cómo se obtiene (ej: "Total de clientes encuestados en el período").
         - Las VARIABLES involucradas: definición de cada variable usada en la fórmula.
      3. La META debe ser un número puntual basado en estándares de la industria.
      4. El lenguaje debe ser 100% profesional, corporativo y técnico.
      5. La descripción del indicador debe explicar QUÉ mide, CÓMO se mide y QUÉ significa el resultado.

      Debes devolver un array JSON ESTRICTO con la siguiente estructura (sin markdown):
      [
        {
          "nombre": "Nombre del Indicador",
          "descripcion": "Qué mide este indicador, cómo se interpreta y qué decisiones permite tomar.",
          "formula": "Fórmula: (Variable A / Variable B) × 100. Numerador (Variable A): [descripción de qué representa y cómo obtenerlo]. Denominador (Variable B): [descripción de qué representa y cómo obtenerlo].",
          "fuente": "De dónde sale la información (ej: CRM, Encuestas de satisfacción, ERP)",
          "frecuencia": "Mensual/Trimestral/Semestral",
          "meta": 90,
          "unidad": "%"
        }
      ]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extracción robusta de JSON
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No se pudo encontrar un formato JSON válido en la respuesta de la IA');
    }
    
    const cleanText = jsonMatch[0];
    
    return NextResponse.json(JSON.parse(cleanText));

  } catch (error) {
    console.error('Error generating indicators:', error);
    return NextResponse.json({ error: 'Failed to generate indicators' }, { status: 500 });
  }
}
