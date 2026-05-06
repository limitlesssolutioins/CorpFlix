import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { standard_name, audit_code, findings } = body;

        if (!findings || !Array.isArray(findings) || findings.length === 0) {
            return NextResponse.json({ error: 'findings array is required' }, { status: 400 });
        }

        const evaluatedFindings = findings.filter((f: any) => f.type_code !== null);
        const ncFindings = findings.filter((f: any) => f.type_code === 'NC' || f.finding_type_id === 3);
        const cumpleFindings = findings.filter((f: any) => f.type_code === 'C' || f.finding_type_id === 1);

        const findingsSummary = evaluatedFindings.map((f: any) =>
            `- ${f.requirement_code} (${f.chapter_title}): ${f.type_code === 'NC' || f.finding_type_id === 3 ? 'NO CUMPLE' : 'CUMPLE'}${f.finding_description ? ` — ${f.finding_description}` : ''}`
        ).join('\n');

        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const prompt = `Eres un consultor experto en sistemas de gestión certificado en ${standard_name || 'ISO 9001:2015'}.

Se realizó una auditoría interna (${audit_code || ''}) con los siguientes resultados:
- Total evaluados: ${evaluatedFindings.length}
- Conformidades: ${cumpleFindings.length}
- No conformidades: ${ncFindings.length}

Hallazgos:
${findingsSummary}

Basándote en estos resultados, genera entre 4 y 7 oportunidades de mejora concretas y accionables para la organización.

Cada oportunidad debe:
- Ser específica, práctica y medible
- Indicar el área o capítulo al que aplica
- Describir qué mejorar y el beneficio esperado
- Estar redactada en lenguaje claro para la dirección de la empresa

Responde ÚNICAMENTE con un array JSON con este formato exacto:
[
  {
    "area": "Nombre del capítulo o área",
    "oportunidad": "Descripción específica de la oportunidad de mejora",
    "beneficio": "Beneficio esperado al implementarla"
  }
]`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim()
            .replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        let opportunities: any[];
        try {
            opportunities = JSON.parse(text);
            if (!Array.isArray(opportunities)) throw new Error('Not an array');
        } catch {
            return NextResponse.json({ error: 'AI response could not be parsed' }, { status: 500 });
        }

        return NextResponse.json(opportunities);
    } catch (error) {
        console.error('Error generating opportunities:', error);
        return NextResponse.json({ error: 'Failed to generate opportunities' }, { status: 500 });
    }
}
