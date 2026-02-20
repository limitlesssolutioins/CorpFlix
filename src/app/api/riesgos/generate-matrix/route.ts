import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getCompanyDataDir } from '@/lib/companyContext';
import { getRiskService } from '@/services/risk.service';

interface GeneratedControl {
  description: string;
  control_type?: 'PREVENTIVO' | 'CORRECTIVO' | 'DETECTIVO';
  effectiveness?: number;
  responsible?: string;
}

interface GeneratedActionPlan {
  action_description: string;
  responsible?: string;
  target_days?: number;
}

interface GeneratedRiskItem {
  category_code: string;
  type: string;
  description: string;
  caused_by: string;
  impact: string;
  probability: number;
  consequence: number;
  controls: GeneratedControl[];
  action_plan?: GeneratedActionPlan;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function cleanJsonBlock(text: string): string {
  return text.replace(/```json/g, '').replace(/```/g, '').trim();
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY no configurada en .env.local' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const {
      companyName,
      sector,
      processes,
      concerns,
      selectedCategories,
      risksPerCategory,
      responsibleArea
    } = body || {};

    if (!Array.isArray(selectedCategories) || selectedCategories.length === 0) {
      return NextResponse.json(
        { error: 'Debe seleccionar al menos una categoria de riesgo' },
        { status: 400 }
      );
    }

    const normalizedRisksPerCategory = clamp(Number(risksPerCategory) || 3, 1, 8);

    const dataDir = await getCompanyDataDir();
    const riskService = getRiskService(dataDir);
    const categories = riskService.getAllCategories();
    const categoriesMap = new Map(categories.map((c) => [c.code, c]));

    const validSelectedCategories = selectedCategories.filter((code: string) =>
      categoriesMap.has(code)
    );

    if (validSelectedCategories.length === 0) {
      return NextResponse.json(
        { error: 'No hay categorias validas para generar riesgos' },
        { status: 400 }
      );
    }

    const prompt = `
Actua como un consultor experto en gestion integral de riesgos empresariales.
Tu tarea es generar una matriz inicial de riesgos PRACTICA y SIMPLE para una empresa.

Contexto de la empresa:
- Nombre: ${companyName || 'Empresa no especificada'}
- Sector/actividad: ${sector || 'No especificado'}
- Procesos o areas clave: ${processes || 'No especificado'}
- Principales preocupaciones: ${concerns || 'No especificado'}
- Area responsable del seguimiento: ${responsibleArea || 'No especificado'}

Categorias seleccionadas (usa solo estas): ${validSelectedCategories.join(', ')}
Genera exactamente ${normalizedRisksPerCategory} riesgos por cada categoria seleccionada.

Reglas de salida:
1. Devuelve SOLO un arreglo JSON valido.
2. Cada elemento del arreglo debe tener esta estructura:
{
  "category_code": "CALIDAD|SST|AMBIENTAL|CIBERSEGURIDAD|FINANCIERO|SEGURIDAD_VIAL",
  "type": "Tipo corto",
  "description": "Descripcion clara del riesgo",
  "caused_by": "Causa principal",
  "impact": "Impacto probable",
  "probability": 1-5,
  "consequence": 1-5,
  "controls": [
    {
      "description": "Control sugerido",
      "control_type": "PREVENTIVO|CORRECTIVO|DETECTIVO",
      "effectiveness": 1-5,
      "responsible": "Cargo responsable"
    }
  ],
  "action_plan": {
    "action_description": "Accion concreta para mitigar",
    "responsible": "Cargo responsable",
    "target_days": 15-180
  }
}
3. Incluye entre 1 y 3 controles por riesgo.
4. Si el riesgo es alto (probabilidad x consecuencia >= 16), la accion debe ser prioritaria y concreta.
5. No uses markdown. No agregues explicaciones fuera del JSON.
`;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = JSON.parse(cleanJsonBlock(text)) as GeneratedRiskItem[];

    if (!Array.isArray(parsed) || parsed.length === 0) {
      return NextResponse.json(
        { error: 'La IA no devolvio riesgos validos' },
        { status: 500 }
      );
    }

    const today = new Date().toISOString().split('T')[0];
    let createdRisks = 0;
    let createdAssessments = 0;
    let createdControls = 0;
    let createdActionPlans = 0;

    for (const item of parsed) {
      const category = categoriesMap.get(item.category_code);
      if (!category?.id) continue;

      const risk = riskService.createRisk({
        category_id: category.id,
        type: item.type || 'GENERAL',
        description: item.description || 'Riesgo sin descripcion',
        caused_by: item.caused_by || undefined,
        impact: item.impact || undefined,
        status: 'ACTIVE'
      });
      createdRisks += 1;

      const assessment = riskService.createAssessment({
        risk_id: risk.id!,
        assessment_date: today,
        probability: clamp(Number(item.probability) || 3, 1, 5),
        consequence: clamp(Number(item.consequence) || 3, 1, 5)
      });
      createdAssessments += 1;

      const controls = Array.isArray(item.controls) ? item.controls : [];
      for (const control of controls.slice(0, 3)) {
        riskService.createControl({
          assessment_id: assessment.id,
          description: control.description || 'Control sugerido por IA',
          control_type: control.control_type || 'PREVENTIVO',
          effectiveness: clamp(Number(control.effectiveness) || 3, 1, 5),
          responsible: control.responsible || responsibleArea || undefined,
          status: 'ACTIVE'
        });
        createdControls += 1;
      }

      const updatedAssessment = riskService.getAssessmentById(assessment.id);
      const shouldCreatePlan =
        updatedAssessment?.acceptability === 'NO ACEPTABLE' || (assessment.inherent_risk || 0) >= 16;

      if (shouldCreatePlan) {
        const targetDays = clamp(Number(item.action_plan?.target_days) || 60, 15, 180);
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + targetDays);

        riskService.createActionPlan({
          assessment_id: assessment.id,
          action_description:
            item.action_plan?.action_description ||
            `Definir e implementar plan de mitigacion para: ${risk.description}`,
          responsible: item.action_plan?.responsible || responsibleArea || undefined,
          start_date: today,
          target_date: targetDate.toISOString().split('T')[0],
          status: 'PENDING',
          progress: 0
        });
        createdActionPlans += 1;
      }
    }

    return NextResponse.json({
      success: true,
      summary: {
        createdRisks,
        createdAssessments,
        createdControls,
        createdActionPlans
      }
    });
  } catch (error) {
    console.error('Error generating risk matrix with AI:', error);
    return NextResponse.json(
      { error: 'No se pudo generar la matriz de riesgos con IA' },
      { status: 500 }
    );
  }
}
