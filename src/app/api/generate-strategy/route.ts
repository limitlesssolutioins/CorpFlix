import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Inicializar el cliente de Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY no configurada en .env.local" }, 
        { status: 500 }
      );
    }

    const body = await request.json();
    const { type, inputs } = body;
    let prompt = "";

    // --- CONSTRUCCIÓN DEL PROMPT ---

    if (type === 'mission') {
      const { name, offerings, clients, differentiator } = inputs;
      prompt = `
        Actúa como un consultor estratégico experto en normas ISO 9001:2015.
        Genera 3 propuestas de Misión corporativa para la empresa "${name}".
        
        Contexto:
        - Qué ofrece: ${offerings}
        - Clientes: ${clients}
        - Diferenciador: ${differentiator}

        Instrucciones:
        - NO tomes los inputs literalmente. Analízalos, mejóralos y redáctalos con lenguaje corporativo natural y profesional.
        - Asegura que la redacción refleje compromiso con la calidad y la satisfacción del cliente.
        - Devuelve SOLO un array JSON válido de strings (ej: ["Propuesta 1", "Propuesta 2", "Propuesta 3"]).
        - el formato siempre debe empezar con el nombre de la empresa ${name} ejemplo "${name} es una empresa..."
        - Sin markdown, sin explicaciones adicionales.
      `;
    } 
    else if (type === 'vision') {
      const { name, date, scope, goal } = inputs;
      prompt = `
        Actúa como un consultor estratégico experto en normas ISO 9001:2015.
        Genera 3 propuestas de Visión corporativa para la empresa "${name}".
        
        Contexto:
        - Fecha objetivo: ${date}
        - Alcance: ${scope}
        - Meta visionaria: ${goal}

        Instrucciones:
        - Redacta con un estilo inspirador pero aterrizado.
        - Devuelve SOLO un array JSON válido de strings.
        - Sin markdown.
      `;
    }
    else if (type === 'swot') {
      const { name, activity, userAnalysis, pestelContext } = inputs;
      prompt = `
        Actúa como un consultor estratégico experto en normas ISO 9001:2015.
        Realiza un Análisis DOFA (FODA) estratégico de alto nivel para la empresa "${name}".

        CONTEXTO INTERNO (Proporcionado por el usuario):
        "${userAnalysis || 'No proporcionado'}"
        
        FACTORES DE CAPACIDAD A EVALUAR (Si el usuario no mencionó alguno, asume el estándar del sector ${activity}):
        - Financiera, Tecnológica, Logística, Comercial, Experiencia, RRHH, Directiva, Good Will, Legal, Ambiente Laboral, Innovación, Gestión del Riesgo.

        CONTEXTO EXTERNO (Resultados PESTEL previos):
        - Político: ${pestelContext?.political || 'No definido'}
        - Económico: ${pestelContext?.economic || 'No definido'}
        - Social: ${pestelContext?.social || 'No definido'}
        - Tecnológico: ${pestelContext?.technological || 'No definido'}
        - Ecológico: ${pestelContext?.ecological || 'No definido'}
        - Legal: ${pestelContext?.legal || 'No definido'}
        
        Instrucciones:
        1. FORTALEZAS: Capacidades internas sobresalientes mencionadas o inferidas.
        2. DEBILIDADES: Falencias internas identificadas. Para cada debilidad DEBES proponer una acción de mejora específica.
        3. OPORTUNIDADES: Cómo aprovechar los factores POSITIVOS del PESTEL usando las fortalezas.
        4. AMENAZAS: Riesgos del entorno PESTEL que pueden afectar la continuidad.

        ESTRUCTURA DE SALIDA (ESTRICTA):
        Devuelve SOLO un objeto JSON con esta estructura:
        {
          "strengths": ["string", ...],
          "weaknesses": [
            { "item": "La debilidad encontrada", "plan": "Acción para mejorarla" },
            ...
          ],
          "opportunities": ["string", ...],
          "threats": ["string", ...]
        }
        Sin markdown.
      `;
    }
    else if (type.startsWith('pestel-')) {
      const sector = type.split('-')[1];
      const { name, activity, userAnalysis } = inputs;
      const sectorLabels: Record<string, string> = {
        political: 'POLÍTICO',
        economic: 'ECONÓMICO',
        social: 'SOCIO-CULTURAL',
        technological: 'TECNOLÓGICO',
        ecological: 'ECOLÓGICO',
        legal: 'LEGAL'
      };

      const criteria: Record<string, string> = {
        political: 'Cambios de regulación (variación de impuestos por reformas), estabilidad política (incertidumbre por decisiones gubernamentales, impacto en la inversión).',
        economic: 'Variaciones de divisas (dólar), tasas bancarias, puntualidad de pago de clientes (liquidez), competencia, cambios en el mercado internacional con impacto local, precios de proveedores.',
        social: 'Generación de empleo en la zona, comportamientos sociales, gestión social, apoyo de vecinos, disponibilidad de recurso humano competente.',
        technological: 'Uso de software para productividad, tecnología en planta/operación, estrategias y herramientas para la innovación.',
        ecological: 'Licencias de sostenibilidad, regulaciones ambientales, cumplimiento legal en ecología.',
        legal: 'Seguridad vial, regulaciones laborales, cumplimiento de SG-SST, uso racional y eficiente de energía.'
      };

      prompt = `
        Actúa como un consultor estratégico experto en normas ISO 9001:2015.
        Genera factores profesionales para el análisis PESTEL, específicamente para el sector ${sectorLabels[sector]} de la empresa "${name}" (${activity}).
        
        ${userAnalysis ? `EL USUARIO HA PROPORCIONADO ESTA OBSERVACIÓN PRELIMINAR: "${userAnalysis}".
        TU TAREA ES TOMAR ESTA INFORMACIÓN Y REDACTARLA EN 5-6 PUNTOS TÉCNICOS, FORMALES Y ESTRATÉGICOS.` : `Ten en cuenta estos criterios generales para el sector: ${criteria[sector]}`}

        Instrucciones Adicionales:
        - Si el usuario proporcionó información, priorízala y expándela con lenguaje corporativo.
        - Si no proporcionó información, genera factores basados en los criterios generales y el sector de la empresa.
        - Devuelve SOLO un objeto JSON con la clave "${sector}" y un array de strings como valor.
        - Estructura: {"${sector}": ["factor 1", "factor 2", ...]}
        - Sin markdown.
      `;
    }
    else if (type === 'pestel') {
      const { name, activity } = inputs;
      prompt = `
        Actúa como un consultor estratégico experto en normas ISO 9001:2015
        Realiza un Análisis PESTEL detallado para la empresa "${name}" del sector: ${activity}.
        
        Para cada sector, ten en cuenta los siguientes criterios:
        - POLÍTICO: Cambios de regulación (variación de impuestos por reformas), estabilidad política (incertidumbre por decisiones gubernamentales, impacto en la inversión).
        - ECONÓMICO: Variaciones de divisas (dólar), tasas bancarias, puntualidad de pago de clientes (liquidez), competencia, cambios en el mercado internacional con impacto local, precios de proveedores.
        - SOCIO-CULTURAL: Generación de empleo en la zona, comportamientos sociales, gestión social, apoyo de vecinos, disponibilidad de recurso humano competente.
        - TECNOLÓGICO: Uso de software para productividad, tecnología en planta/operación, estrategias y herramientas para la innovación.
        - ECOLÓGICO: Licencias de sostenibilidad, regulaciones ambientales, cumplimiento legal en ecología.
        - LEGAL: Seguridad vial, regulaciones laborales, cumplimiento de SG-SST, uso racional y eficiente de energía.

        Instrucciones:
        - Genera factores relevantes y específicos para cada dimensión basados en estos criterios y el sector de la empresa.
        - Devuelve SOLO un objeto JSON válido con esta estructura exacta, donde cada dimensión es un ARRAY de strings:
        {
          "political": ["factor 1", ...],
          "economic": ["factor 1", ...],
          "social": ["factor 1", ...],
          "technological": ["factor 1", ...],
          "ecological": ["factor 1", ...],
          "legal": ["factor 1", ...]
        }
        - Sin markdown.
      `;
    }
    else if (type === 'policies') {
      const { name, activity, sector } = inputs;
      prompt = `Actúa como un consultor estratégico experto en normas ISO 9001:2015
        
        Contexto: La empresa ${name} del sector ${sector} dedicada a ${activity} está definiendo su política integral.
        El encabezado de la política será: "${name} se compromete a:".
        
        Tu tarea es generar los 11 compromisos específicos que completan esa frase, basados en los siguientes temas normativos obligatorios:
        1. Utilizar la actividad económica (${activity}) con altos estándares de calidad.
        2. Proporcionar condiciones de trabajo seguras y saludables.
        3. Implementar y mantener el sistema de gestión.
        4. Asignar los recursos necesarios (financieros, técnicos, humanos).
        5. Contratar y mantener un equipo humano competente.
        6. Preservar el medio ambiente y prevenir la contaminación.
        7. Proteger la seguridad y salud de los trabajadores (identificar, evaluar y valorar riesgos).
        8. Promover la consulta y participación de los trabajadores.
        9. Cumplir la normatividad legal vigente y otros requisitos.
        10. Preservar la confidencialidad, integridad y disponibilidad de la información.
        11. Mejorar continuamente los procesos y el sistema de gestión.
         
        Instrucciones:
        - Genera UN array de 11 strings.
        - Cada string debe ser la continuación de la frase "se compromete a...". Por tanto, inicia directamente con el verbo en infinitivo o la acción (ej: "Garantizar la calidad...", "Asignar los recursos...", "Proteger la salud...").
        - NO incluyas el nombre de la empresa al inicio de cada punto.
        - Redacción formal, ejecutiva y clara.
        - Devuelve SOLO el array JSON de strings. Sin markdown.`;
    }
    else if (type === 'objectives') {
      const { name, activity, usePolicies, policies } = inputs;
      
      if (usePolicies && policies && policies.length > 0) {
        prompt = `
          Actúa como un consultor estratégico experto en normas ISO 9001:2015.
          La empresa "${name}" ha definido las siguientes Políticas de Calidad:
          ${policies.map((p: string, i: number) => `${i+1}. ${p}`).join('\n')}
          
          Basándote ESTRICTAMENTE en estas políticas, genera 10 Objetivos Estratégicos SMART (Específicos, Medibles, Alcanzables, Relevantes y Temporales) que permitan dar cumplimiento a dichos compromisos.
          Cada objetivo debe redactarse iniciando con un verbo de acción (ej: "Aumentar", "Reducir", "Garantizar").
          Devuelve SOLO un array JSON de strings. Sin markdown.
        `;
      } else {
        prompt = `
          Actúa como un consultor estratégico experto en normas ISO 9001:2015
          Genera 4 Objetivos Estratégicos SMART para la empresa "${name}" del sector ${activity}. Devuelve SOLO un array JSON de strings. Sin markdown.
        `;
      }
    }

    
    console.log("Usando modelo: gemini-2.5-flash. API Key presente:", !!apiKey);

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // --- LIMPIEZA Y PARSEO ---
    
    // Eliminar posibles bloques de código markdown ```json ... ```
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let parsedData;
    try {
      parsedData = JSON.parse(cleanedText);
    } catch (e) {
      console.error("Error parsing JSON from AI:", text);
      return NextResponse.json({ error: "Invalid AI response format" }, { status: 500 });
    }

    // Retornar estructura correcta según el tipo
    if (['swot', 'pestel'].includes(type) || type.startsWith('pestel-')) {
      return NextResponse.json({ data: parsedData });
    } else {
      return NextResponse.json({ options: parsedData });
    }

  } catch (error) {
    console.error('AI Generation Error:', error);
    return NextResponse.json({ error: "Failed to connect to AI" }, { status: 500 });
  }
}
