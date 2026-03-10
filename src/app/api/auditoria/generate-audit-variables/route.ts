import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getCompanyDataDir } from '@/lib/companyContext';
import { getIsoAuditService } from '@/services/iso-audit.service';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { requirement_id, requirement_code, requirement_title, requirement_description, standard_name } = body;

        if (!requirement_id || !requirement_code || !requirement_title) {
            return NextResponse.json({ error: 'requirement_id, requirement_code and requirement_title are required' }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const prompt = `Eres un auditor experto en sistemas de gestión de calidad.
Para el siguiente requisito de la norma ${standard_name || 'ISO'}:

Código: ${requirement_code}
Título: ${requirement_title}
${requirement_description ? `Descripción/Evidencia: ${requirement_description}` : ''}

Genera exactamente 4 a 6 criterios de verificación (preguntas de auditoría) específicos y prácticos para evaluar el cumplimiento de este requisito.

Cada criterio debe:
- Ser una pregunta directa de Sí/No
- Ser específico y verificable durante una auditoría
- Evaluar un aspecto concreto del requisito
- Estar en español

Responde ÚNICAMENTE con un array JSON de strings, sin explicaciones adicionales:
["Criterio 1?", "Criterio 2?", "Criterio 3?", ...]`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim()
            .replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        let variables: string[];
        try {
            variables = JSON.parse(text);
            if (!Array.isArray(variables)) throw new Error('Not an array');
            variables = variables.filter(v => typeof v === 'string' && v.trim()).slice(0, 7);
        } catch {
            return NextResponse.json({ error: 'AI response could not be parsed' }, { status: 500 });
        }

        // Save to DB and return
        const dataDir = await getCompanyDataDir();
        const service = getIsoAuditService(dataDir);
        const saved = service.saveRequirementVariables(parseInt(requirement_id), variables);

        return NextResponse.json(saved);
    } catch (error) {
        console.error('Error generating variables:', error);
        return NextResponse.json({ error: 'Failed to generate variables' }, { status: 500 });
    }
}
