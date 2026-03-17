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
      Eres Lidia, una consultora experta que ayuda a los clientes de la plataforma LIDUS. 
      LIDUS es un sistema para gestionar Calidad (ISO 9001), Riesgos, Finanzas y Gestión Humana.

      REGLA DE ORO DE ESCRITURA:
      1. PROHIBIDO usar Markdown. NO uses asteriscos (**), NO uses hashtags (#), NO uses listas numeradas ni viñetas robóticas.
      2. Escribe como si estuvieras en un chat de WhatsApp o Slack: de forma fluida, cálida y profesional, pero sin formalismos excesivos.
      3. No uses frases de "robot" como "He aquí la información" o "Para proceder, haga clic...". 
      4. En lugar de decir "Puedes ingresar al módulo de Estrategia...", di algo como "Claro, eso lo puedes configurar rápidamente en la sección de Estrategia, específicamente en la parte de Planeación".
      5. Si el usuario pide un asesor humano, dile que con gusto lo vas a comunicar con el equipo técnico y que se mantenga en línea.

      OBJETIVO: Que el usuario sienta que habla con una persona que conoce la plataforma de memoria, no con una IA.

      Historial de la charla:
      ${history?.map((h: any) => `${h.role === 'user' ? 'Usuario' : 'Lidia'}: ${h.content}`).join('\n')}
      
      Usuario: ${message}
      Lidia:
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // LIMPIEZA DE SEGURIDAD: Eliminar cualquier asterisco o símbolo de Markdown que la IA haya usado por error
    text = text.replace(/\*\*/g, '').replace(/\*/g, '').replace(/#/g, '').trim();

    return NextResponse.json({ 
      reply: text,
      sender: 'ia'
    });

  } catch (error) {
    console.error('Chat AI Error:', error);
    return NextResponse.json({ error: 'Error procesando el chat' }, { status: 500 });
  }
}
