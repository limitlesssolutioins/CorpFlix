import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface WizardAnswer {
    questionId: string;
    question: string;
    answer: 'si' | 'no';
}

interface WizardRisk {
    type: string;
    description: string;
    caused_by: string;
    impact: string;
    probability: number;
    consequence: number;
    suggested_action: string;
}

function clamp(v: number, min: number, max: number) {
    return Math.max(min, Math.min(max, v));
}

function cleanJson(text: string): string {
    return text.replace(/```json/g, '').replace(/```/g, '').trim();
}

const CATEGORY_NAMES: Record<string, string> = {
    CALIDAD: 'Calidad del producto y servicio',
    SST: 'Seguridad y Salud en el Trabajo',
    AMBIENTAL: 'Gestión Ambiental',
    CIBERSEGURIDAD: 'Ciberseguridad',
    FINANCIERO: 'Riesgo Financiero',
    SEGURIDAD_VIAL: 'Seguridad Vial',
};

export async function POST(request: Request) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'GEMINI_API_KEY no configurada' }, { status: 500 });
        }

        const body = await request.json();
        const { categoryCode, answers, companyName } = body as {
            categoryCode: string;
            answers: WizardAnswer[];
            companyName?: string;
        };

        if (!categoryCode || !Array.isArray(answers) || answers.length === 0) {
            return NextResponse.json({ error: 'categoryCode y answers son requeridos' }, { status: 400 });
        }

        // Only include "si" answers — those indicate relevant risks
        const relevantAnswers = answers.filter(a => a.answer === 'si');
        const allAnswers = answers.map(a => `- "${a.question}" → ${a.answer === 'si' ? 'SÍ' : 'NO'}`).join('\n');
        const categoryName = CATEGORY_NAMES[categoryCode] || categoryCode;

        const prompt = `
Eres un consultor experto en gestión de riesgos empresariales. Tu tarea es generar riesgos CONCRETOS y PRÁCTICOS para una empresa.

Categoría de riesgo: ${categoryName}
Empresa: ${companyName || 'Empresa pequeña o mediana colombiana'}

El usuario respondió estas preguntas sobre su empresa:
${allAnswers}

Basándote SOLO en las respuestas "SÍ" (que indican que esa situación aplica), genera entre ${Math.max(2, relevantAnswers.length)} y ${Math.min(6, relevantAnswers.length + 2)} riesgos específicos.
Si no hay respuestas "SÍ", genera 3 riesgos comunes de la categoría ${categoryName}.

Reglas:
1. Usa lenguaje SIMPLE y CLARO, sin tecnicismos. El usuario no es experto.
2. La "description" debe empezar con un verbo de riesgo: "Posible...", "Riesgo de...", "Pérdida de...", etc.
3. El "caused_by" debe ser una frase corta y cotidiana.
4. El "impact" debe ser algo concreto que le preocupe al empresario (dinero, tiempo, reputación, salud).
5. El "suggested_action" debe ser una acción concreta y alcanzable para una PYME.
6. Probability y consequence: valores del 1 al 5 (1=muy bajo, 5=muy alto). Sé realista.
7. Devuelve SOLO un arreglo JSON válido. Sin explicaciones ni markdown.

Estructura de cada objeto:
{
  "type": "Tipo corto (1-3 palabras)",
  "description": "Descripción clara del riesgo (máx 15 palabras)",
  "caused_by": "Causa principal en lenguaje simple",
  "impact": "Consecuencia concreta para la empresa",
  "probability": 1-5,
  "consequence": 1-5,
  "suggested_action": "Acción concreta y simple para mitigarlo"
}
`;

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        let parsed: WizardRisk[];
        try {
            parsed = JSON.parse(cleanJson(text));
        } catch {
            return NextResponse.json({ error: 'Error al procesar respuesta de IA' }, { status: 500 });
        }

        if (!Array.isArray(parsed) || parsed.length === 0) {
            return NextResponse.json({ error: 'La IA no generó riesgos válidos' }, { status: 500 });
        }

        // Validate and clamp values
        const risks: WizardRisk[] = parsed.map(r => ({
            type: String(r.type || 'General').slice(0, 50),
            description: String(r.description || 'Riesgo identificado').slice(0, 200),
            caused_by: String(r.caused_by || 'Falta de control').slice(0, 200),
            impact: String(r.impact || 'Afectación operativa').slice(0, 200),
            probability: clamp(Number(r.probability) || 3, 1, 5),
            consequence: clamp(Number(r.consequence) || 3, 1, 5),
            suggested_action: String(r.suggested_action || 'Implementar controles básicos').slice(0, 300),
        }));

        return NextResponse.json({ risks });
    } catch (error) {
        console.error('Wizard risk generation error:', error);
        return NextResponse.json({ error: 'Error generando riesgos' }, { status: 500 });
    }
}
