import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const { type, context, answers, existingProcesses } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        error: 'API Key not configured',
        mock: true
      }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let typeDefinition = "";
    let specificInstruction = "";

    switch(type) {
        case 'ESTRATÉGICO_PLANIFICACION':
            typeDefinition = "Proceso único de ALTO NIVEL para definir el rumbo de la organización.";
            specificInstruction = `
              IMPORTANTE: Genera EXACTAMENTE UN (1) proceso.
              El nombre de este proceso DEBE SER OBLIGATORIAMENTE "Planificación Estratégica" o una variación muy cercana como "Direccionamiento Estratégico".
              NO generes listas. Solo UN proceso que englobe la definición de misión, visión y objetivos, adaptado a la respuesta del usuario.
              NOTA CRÍTICA: NO menciones "Sistema de Gestión de Calidad", "SGC", "Norma ISO" ni "Certificación" en la descripción. Enfócate puramente en la estrategia de negocio y la operación real de la empresa.
            `;
            break;
        case 'ESTRATÉGICO_GERENCIAL':
            typeDefinition = "Proceso único de ALTO NIVEL para la toma de decisiones y revisión de resultados por la alta dirección.";
            specificInstruction = `
              IMPORTANTE: Genera EXACTAMENTE UN (1) proceso.
              El nombre de este proceso DEBE SER OBLIGATORIAMENTE "Gestión Gerencial".
              NO uses "Revisión por la Dirección" ni otros nombres. Solo "Gestión Gerencial".
              La descripción debe ser detallada y basada en la respuesta del usuario sobre sus comités y rendición de cuentas.
              NOTA CRÍTICA: NO menciones "Sistema de Gestión de Calidad", "SGC", "Norma ISO" ni "Certificación" en la descripción. Enfócate puramente en la gestión directiva, toma de decisiones y resultados del negocio.
            `;
            break;
        case 'MISIONAL_COMERCIAL':
            typeDefinition = "Proceso de captación de mercado, gestión de ventas y fidelización de clientes.";
            specificInstruction = `
              IMPORTANTE: Genera EXACTAMENTE UN (1) proceso.
              EL NOMBRE DE ESTE PROCESO DEBE SER OBLIGATORIAMENTE "Comercial". NO uses ningún otro nombre.
              La descripción debe enfocarse en la estrategia de captación y relación con el cliente.
              NOTA CRÍTICA: NO menciones "Sistema de Gestión", "ISO" ni "Requisitos" en la descripción.
            `;
            break;
        case 'MISIONAL_COMPRAS':
            typeDefinition = "Proceso de gestión de abastecimiento, cadena de suministro y relación con proveedores.";
            specificInstruction = `
              IMPORTANTE: Genera EXACTAMENTE UN (1) proceso.
              EL NOMBRE DE ESTE PROCESO DEBE SER OBLIGATORIAMENTE "Compras". NO uses ningún otro nombre.
              La descripción debe detallar la adquisición de recursos necesarios para la operación.
              NOTA CRÍTICA: NO menciones "SGC", "ISO" ni "Manuales" en la descripción.
            `;
            break;
        case 'MISIONAL_OPERATIVO':
            typeDefinition = "Proceso central de la cadena de valor enfocado en la ejecución técnica del negocio.";
            specificInstruction = `
              REGLAS DE NOMBRE PARA ESTE PROCESO:
              1. Si el usuario indica que su actividad es PRODUCCIÓN, el nombre DEBE ser "Producción".
              2. Si el usuario indica que su actividad es PRESTACIÓN DE SERVICIOS, el nombre DEBE ser "Prestación de servicios".
              3. Si la actividad es una combinación, usa "Producción y servicios".
              4. IMPORTANTE: Si la actividad es PURAMENTE COMERCIALIZACIÓN, DISTRIBUCIÓN o VENTA de productos de terceros, NO GENERES NINGÚN PROCESO (devuelve un array vacío []), ya que esto queda cubierto por el proceso de "Gestión Comercial".
              
              La descripción debe ser técnica y detallar la creación del valor.
              NOTA CRÍTICA: NO menciones "ISO", "SGC" ni "Normas".
            `;
            break;
        case 'MISIONAL_ALMACENAMIENTO':
            typeDefinition = "Proceso de custodia, control de inventarios y logística interna.";
            specificInstruction = `
              IMPORTANTE: Genera EXACTAMENTE UN (1) proceso.
              EL NOMBRE DE ESTE PROCESO DEBE SER OBLIGATORIAMENTE "Almacenamiento". NO uses ningún otro nombre.
              La descripción debe enfocarse en la integridad de los activos y la eficiencia en la disposición de materiales.
              NOTA CRÍTICA: NO menciones terminología normativa en la descripción.
            `;
            break;
        case 'MISIONAL_FINANZAS':
            typeDefinition = "Proceso de gestión de la salud financiera, tesorería y cumplimiento fiscal.";
            specificInstruction = `
              IMPORTANTE: Genera EXACTAMENTE UN (1) proceso.
              EL NOMBRE DE ESTE PROCESO DEBE SER OBLIGATORIAMENTE "Finanzas". NO uses ningún otro nombre.
              La descripción debe elevar conceptos como "registro de transacciones" a "aseguramiento de la integridad financiera".
              NOTA CRÍTICA: NO menciones auditorías externas de ISO ni SGC.
            `;
            break;
        case 'APOYO_RRHH':
            typeDefinition = "Proceso de gestión del capital humano, cultura organizacional y bienestar.";
            specificInstruction = `
              IMPORTANTE: Genera EXACTAMENTE UN (1) proceso.
              EL NOMBRE DE ESTE PROCESO DEBE SER OBLIGATORIAMENTE "Talento Humano". NO uses ningún otro nombre.
              La descripción debe enfocarse en el desarrollo de competencias, clima laboral y bienestar.
              NOTA CRÍTICA: NO menciones "ISO 9001" ni "SGC".
            `;
            break;
        case 'APOYO_MANTENIMIENTO':
            typeDefinition = "Proceso de aseguramiento de la disponibilidad y continuidad operativa de los activos físicos y tecnológicos.";
            specificInstruction = `
              IMPORTANTE: Genera EXACTAMENTE UN (1) proceso.
              EL NOMBRE DE ESTE PROCESO DEBE SER OBLIGATORIAMENTE "Mantenimiento". NO uses ningún otro nombre.
              La descripción debe detallar la protección de la infraestructura para garantizar la continuidad operativa.
              NOTA CRÍTICA: NO menciones "ISO" ni "Control de Documentos".
            `;
            break;
        case 'EVALUACION_AUDITORIA':
            typeDefinition = "Proceso de control interno, verificación de estándares y cumplimiento de metas.";
            specificInstruction = `
              IMPORTANTE: Genera EXACTAMENTE UN (1) proceso.
              EL NOMBRE DE ESTE PROCESO DEBE SER OBLIGATORIAMENTE "Auditoría". NO uses ningún otro nombre.
              La descripción debe enfocarse en la autoevaluación y la transparencia operativa.
              NOTA CRÍTICA: NO menciones "SGC" ni "Certificación" en la descripción.
            `;
            break;
        case 'EVALUACION_MEJORA':
            typeDefinition = "Proceso de evolución continua, aprendizaje organizacional y resolución de problemas.";
            specificInstruction = `
              IMPORTANTE: Genera EXACTAMENTE UN (1) proceso.
              EL NOMBRE DE ESTE PROCESO DEBE SER OBLIGATORIAMENTE "Mejora continua". NO uses ningún otro nombre.
              La descripción debe enfocarse en cómo la empresa optimiza su eficiencia a través del tiempo.
              NOTA CRÍTICA: NO menciones "Acciones Correctivas" ni "No conformidades".
            `;
            break;
        case 'MISIONAL':
            typeDefinition = "Procesos de la cadena de valor.";
            break;
        case 'APOYO':
            typeDefinition = "Procesos que proveen recursos para la operación.";
            break;
        case 'EVALUACIÓN':
            typeDefinition = "Procesos de medición, análisis y mejora.";
            break;
    }

    // Construct the answers context
    let answersContext = "";
    if (answers && Object.keys(answers).length > 0) {
        // For generic types (additional processes), q1=title and q2=description
        if (answers.q1 && answers.q2 && !typeDefinition) {
            answersContext = `Título del proceso: "${answers.q1}"\nDescripción del proceso: "${answers.q2}"`;
        } else {
            answersContext = "Respuestas específicas del usuario sobre su operación:\n";
            for (const [key, value] of Object.entries(answers)) {
                answersContext += `- ${key === 'q1' ? 'Respuesta' : 'Descripción'}: ${value}\n`;
            }
        }
    }

    // For generic types without typeDefinition, use title+description from answers
    if (!typeDefinition && answers?.q1) {
        typeDefinition = `Proceso personalizado basado en: ${answers.q1}`;
        specificInstruction = `
          IMPORTANTE: Genera EXACTAMENTE UN (1) proceso basado en el título y descripción proporcionados por el usuario.
          El nombre DEBE ser: "${answers.q1}".
          La descripción debe estar basada en: "${answers.q2 || answers.q1}", elevando el lenguaje a nivel corporativo y profesional.
          NOTA CRÍTICA: NO menciones "ISO", "SGC" ni terminología normativa. Enfócate en la operación real.
        `;
    }

    const prompt = `
      Actúa como un experto en Sistemas de Gestión de Calidad ISO 9001:2015.
      
      Tu tarea es sugerir una lista de procesos de tipo: "${type.split('_')[0]}" para una empresa.
      
      Contexto General: "${context}"
      
      ${answersContext}

      Definición del tipo de proceso: ${typeDefinition}

      ${specificInstruction}

      Ten en cuenta que ya existen estos procesos estipulados (NO los dupliques):
      ${JSON.stringify(existingProcesses)}

      TONO Y ESTILO:
      - El contenido debe ser 100% profesional, técnico y corporativo.
      - INTERPRETA las respuestas del usuario. NO repitas literalmente sus palabras si son informales o coloquiales (ej: si dice "voz a voz", escribe "estrategia de referidos" o "marketing relacional").
      - Transforma las ideas del usuario en definiciones de procesos de alto nivel empresarial.

      INSTRUCCIÓN CRÍTICA:
      - A menos que se indique lo contrario en las reglas específicas (como en el caso de comercialización pura en el proceso Operativo), DEBES sugerir al menos 1 proceso básico. 
      - Solo devuelve un array vacío [] si la instrucción específica de arriba así lo requiere.
      
      Genera el proceso.

      Debes devolver un objeto JSON ESTRICTO con la siguiente estructura (sin markdown, solo JSON):
      [
        {
          "nombre": "Nombre del Proceso",
          "descripcion": "Breve descripción del proceso basada en la respuesta del usuario"
        }
      ]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean markdown if present
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return NextResponse.json(JSON.parse(cleanText));

  } catch (error) {
    console.error('Error generating process list:', error);
    return NextResponse.json({ error: 'Failed to generate list' }, { status: 500 });
  }
}