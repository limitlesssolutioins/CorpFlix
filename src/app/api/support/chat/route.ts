import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { verifySession } from '@/lib/auth';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const session: any = await verifySession();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { message, history } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Mensaje vacío' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Eres el asistente virtual oficial de LIDUS, una plataforma integral de gestión organizacional (Sistemas de Gestión de Calidad, ISO 9001, Riesgos, Finanzas, Gestión Humana).
      
      Tu objetivo es ayudar al usuario a navegar por la plataforma y responder dudas sobre procesos empresariales.
      
      Reglas:
      1. Sé profesional, amable y conciso.
      2. Si el usuario pregunta cómo hacer algo en Lidus, oriéntalo hacia los módulos: Estrategia (Planeación, Riesgos, Indicadores), Capital Humano (Nómina, Seguridad Social) o Finanzas.
      3. Si no sabes algo técnico de la empresa del usuario, indícale que puede contactar a un asesor humano escribiendo "asesor".
      4. No inventes funcionalidades que no existen.
      
      Historial reciente:
      ${history?.map((h: any) => `${h.role === 'user' ? 'Usuario' : 'Asistente'}: ${h.content}`).join('\n')}
      
      Usuario: ${message}
      Asistente:
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ 
      reply: text,
      sender: 'ia'
    });

  } catch (error) {
    console.error('Chat AI Error:', error);
    return NextResponse.json({ error: 'Error procesando el chat' }, { status: 500 });
  }
}
