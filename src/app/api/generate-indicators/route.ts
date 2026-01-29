import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { managementService } from '@/services/management.service';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'API Key not configured' }, { status: 500 });
    }

    const { context } = await request.json();
    const plan = managementService.getStrategicPlan();
    const objectives = plan.objetivos || [];

    if (objectives.length === 0) {
      return NextResponse.json({ error: 'No se encontraron objetivos en la planeación estratégica' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Actúa como un experto consultor en Sistemas de Gestión de Calidad ISO 9001:2015.
      Tu tarea es generar Indicadores de Gestión (KPIs) basados en los Objetivos Estratégicos de la empresa.

      Contexto de la empresa: "${context}"
      
      Objetivos Estratégicos actuales:
      ${objectives.map((obj: any) => `- ${obj.texto}`).join('\n')}

      INSTRUCCIONES:
      1. Genera al menos un indicador clave por cada objetivo.
      2. CADA indicador DEBE incluir una FÓRMULA ESTADÍSTICA/MATEMÁTICA clara (ej: (N° de incidentes / Total horas hombre) * 100).
      3. La META debe ser un número puntual y específico basado en estándares de la industria para ese objetivo.
      4. El lenguaje debe ser 100% profesional, corporativo y técnico.
      5. No uses jerga informal.

      Debes devolver un objeto JSON ESTRICTO con la siguiente estructura:
      [
        {
          "nombre": "Nombre del Indicador",
          "descripcion": "Definición técnica",
          "formula": "Fórmula matemática",
          "fuente": "De dónde sale la información (ej: CRM, Encuestas, Excel)",
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
