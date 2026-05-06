import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const { processName, context } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ 
        error: 'API Key not configured',
        mock: true // Signal to frontend to use fallback if needed
      }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Actúa como un experto en Sistemas de Gestión de Calidad ISO 9001:2015.
      Genera la caracterización detallada para el proceso: "${processName}".
      
      Contexto de la empresa:
      ${JSON.stringify(context)}

      Debes devolver un objeto JSON ESTRICTO con la siguiente estructura (sin markdown, solo JSON):
      {
        "objective": "Objetivo del proceso (iniciar con verbo en infinitivo)",
        "scope": "Alcance (desde dónde inicia hasta dónde termina)",
        "inputs": ["Entrada 1", "Entrada 2"],
        "outputs": ["Salida 1", "Salida 2"],
        "activities": ["Actividad 1 (Planear)", "Actividad 2 (Hacer)", "Actividad 3 (Verificar)", "Actividad 4 (Actuar)"],
        "resources": ["Recurso Humano", "Infraestructura", "Tecnología"],
        "indicators": ["Indicador 1", "Indicador 2"]
      }

      Asegúrate de que el contenido sea profesional, técnico y alineado con la norma ISO 9001.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean markdown if present
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return NextResponse.json(JSON.parse(cleanText));

  } catch (error) {
    console.error('Error generating process content:', error);
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
  }
}
