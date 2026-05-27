const fs = require('fs');
const path = require('path');

const CHAPTER_TITLES = {
  "4": "Contexto de la organización",
  "5": "Liderazgo",
  "6": "Planificación",
  "7": "Apoyo",
  "8": "Operación",
  "9": "Evaluación del desempeño",
  "10": "Mejora"
};

const ISO9001_SPECIAL_TITLES = {
  "4.4": "SISTEMA DE GESTIÓN DE LA CALIDAD Y SUS PROCESOS",
  "7.1.1": "Generalidades",
  "7.1.4": "Ambiente para la operación de los procesos",
  "7.1.5.1": "Generalidades",
  "7.1.5.2": "Trazabilidad de la medición",
  "7.5.1": "Generalidades",
  "7.5.3.1": "Control de la información documentada",
  "7.5.3.2": "Control de la información documentada - Conservación",
  "8.2.3.1": "Revisión de los requisitos para los productos y servicios",
  "8.2.3.2": "Conservación de información documentada de la revisión",
  "9.3.1": "Generalidades"
};

function consolidateISO(standardCode, name, fullName, category, color, criteriaFile, manualFiles) {
  const criteriaData = JSON.parse(fs.readFileSync(criteriaFile, 'utf8'));
  const allCodes = new Set(Object.keys(criteriaData));
  
  const mergedCriteria = {};
  for (const [code, data] of Object.entries(criteriaData)) {
    mergedCriteria[code] = {
      title: data.title || "",
      criteria: data.criteria || []
    };
  }

  manualFiles.forEach(file => {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    for (const [code, criteria] of Object.entries(data)) {
      allCodes.add(code);
      if (!mergedCriteria[code]) {
        mergedCriteria[code] = { title: "", criteria: [] };
      }
      // Use criteria from manual if it's more complete or if criteria.json was empty
      if (criteria.length > mergedCriteria[code].criteria.length) {
        mergedCriteria[code].criteria = criteria;
      }
    }
  });

  // Apply ISO 9001 special titles
  if (standardCode === "ISO9001") {
    for (const [code, title] of Object.entries(ISO9001_SPECIAL_TITLES)) {
      if (mergedCriteria[code]) {
        mergedCriteria[code].title = title;
      } else {
        mergedCriteria[code] = { title, criteria: [] };
        allCodes.add(code);
      }
    }
  }

  const GENERIC_TITLES = {
    "5.1": "Liderazgo y compromiso",
    "5.2": "Política",
    "6.1": "Acciones para abordar riesgos y oportunidades",
    "6.2": "Objetivos de la calidad y planificación para lograrlos",
    "7.1": "Recursos",
    "7.1.5": "Recursos de seguimiento y medición",
    "7.5": "Información documentada",
    "7.5.3": "Control de la información documentada",
    "8.2": "Requisitos para los productos y servicios",
    "8.2.3": "Revisión de los requisitos para los productos y servicios",
    "8.3": "Diseño y desarrollo de los productos y servicios",
    "8.4": "Control de los procesos, productos y servicios suministrados externamente",
    "8.5": "Producción y provisión del servicio",
    "8.7": "Control de las salidas no conformes",
    "9.1": "Seguimiento, medición, análisis y evaluación",
    "9.2": "Auditoría interna",
    "9.3": "Revisión por la dirección",
    "10.2": "No conformidad y acción correctiva",
    // RES 0312
    "1.1": "Recursos financieros, técnicos, humanos y de otra índole",
    "1.2": "Capacitación en el Sistema de Gestión de Seguridad y Salud en el Trabajo",
    "2.1": "Política de Seguridad y Salud en el Trabajo",
    "2.2": "Objetivos del Sistema de Gestión de la Seguridad y la Salud en el Trabajo SG-SST",
    "2.3": "Evaluación inicial del SG-SST",
    "2.4": "Plan Anual de Trabajo",
    "2.5": "Archivo y retención documental del SG-SST",
    "2.6": "Rendición de cuentas",
    "2.7": "Matriz legal",
    "2.8": "Mecanismos de comunicación",
    "2.9": "Adquisiciones",
    "2.10": "Contratación",
    "2.11": "Gestión del cambio",
    "3.1": "Condiciones de salud en el trabajo",
    "3.2": "Registro, reporte e investigación de las enfermedades laborales, los incidentes y accidentes de trabajo",
    "3.3": "Mecanismos de vigilancia de las condiciones de salud de los trabajadores",
    "4.1": "Identificación de peligros, evaluación y valoración de riesgos",
    "4.2": "Medidas de prevención y control para intervenir los peligros/riesgos",
    "5.1": "Plan de prevención, preparación y respuesta ante emergencias",
    "6.1": "Gestión y resultados del SG-SST",
    "7.1": "Acciones preventivas y correctivas"
  };

  const sortedCodes = Array.from(allCodes).sort((a, b) => {
    const partsA = a.split('.').map(Number);
    const partsB = b.split('.').map(Number);
    for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
      if (partsA[i] === undefined) return -1;
      if (partsB[i] === undefined) return 1;
      if (partsA[i] !== partsB[i]) return partsA[i] - partsB[i];
    }
    return 0;
  });

  const reqMap = {};

  // First, ensure all parents exist
  sortedCodes.forEach(code => {
    const parts = code.split('.');
    for (let i = 2; i <= parts.length; i++) {
      const parentCode = parts.slice(0, i).join('.');
      if (!reqMap[parentCode]) {
        reqMap[parentCode] = {
          code: parentCode,
          title: mergedCriteria[parentCode]?.title || GENERIC_TITLES[parentCode] || parentCode,
          criteria: mergedCriteria[parentCode]?.criteria || [],
          isAuditable: true,
          subRequirements: []
        };
      }
    }
  });

  const chapters = [];
  for (let i = 4; i <= 10; i++) {
    chapters.push({
      number: i.toString(),
      title: CHAPTER_TITLES[i.toString()],
      requirements: []
    });
  }

  // Now build the tree
  Object.keys(reqMap).sort((a, b) => {
    const partsA = a.split('.').map(Number);
    const partsB = b.split('.').map(Number);
    for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
      if (partsA[i] === undefined) return -1;
      if (partsB[i] === undefined) return 1;
      if (partsA[i] !== partsB[i]) return partsA[i] - partsB[i];
    }
    return 0;
  }).forEach(code => {
    const req = reqMap[code];
    const parts = code.split('.');
    const chapterNum = parts[0];
    if (parseInt(chapterNum) < 4 || parseInt(chapterNum) > 10) return;

    if (parts.length === 2) {
      const chapter = chapters.find(c => c.number === chapterNum);
      if (chapter) chapter.requirements.push(req);
    } else {
      const parentCode = parts.slice(0, -1).join('.');
      if (reqMap[parentCode]) {
        reqMap[parentCode].subRequirements.push(req);
        reqMap[parentCode].isAuditable = false;
      }
    }
  });

  // Clean up subRequirements if empty and convert to target format
  function clean(reqs) {
    return reqs.map(r => {
      const res = {
        code: r.code,
        title: r.title,
        isAuditable: r.isAuditable,
        criteria: r.criteria
      };
      if (r.subRequirements.length > 0) {
        res.requirements = clean(r.subRequirements);
      }
      return res;
    });
  }

  chapters.forEach(ch => {
    ch.requirements = clean(ch.requirements);
  });

  const result = {
    code: standardCode,
    name: name,
    fullName: fullName,
    category: category,
    color: color,
    chapters: chapters
  };

  return result;
}

function consolidateRES0312() {
  const criteriaData = JSON.parse(fs.readFileSync('src/data/res0312_criteria.json', 'utf8'));
  const allCodesSet = new Set(Object.keys(criteriaData));
  
  const GENERIC_TITLES = {
    // ... I'll just use the ones I added to the global GENERIC_TITLES if I had made it global, 
    // but it's local to consolidateISO. I'll move it or just copy it.
  };
  // Better yet, I'll move GENERIC_TITLES outside.

  function clean(reqs) {
    return reqs.map(r => {
      const res = {
        code: r.code,
        title: r.title,
        isAuditable: r.isAuditable,
        criteria: r.criteria
      };
      if (r.subRequirements.length > 0) {
        res.requirements = clean(r.subRequirements);
      }
      return res;
    });
  }

  chapters.forEach(ch => {
    ch.requirements = clean(ch.requirements);
  });

  return {
    code: "RES0312",
    name: "Resolución 0312",
    fullName: "Estándares Mínimos del SG-SST",
    category: "SST",
    color: "#eab308",
    chapters: chapters
  };
}

const iso9001 = consolidateISO(
  "ISO9001", 
  "ISO 9001:2015", 
  "Sistema de Gestión de la Calidad", 
  "Calidad", 
  "#3b82f6",
  "src/data/iso9001_criteria.json",
  fs.readdirSync('src/data').filter(f => f.startsWith('iso9001_manual_ch')).map(f => path.join('src/data', f))
);

const iso14001 = consolidateISO(
  "ISO14001", 
  "ISO 14001:2015", 
  "Sistema de Gestión Ambiental", 
  "Ambiental", 
  "#10b981", // Added a green color for Environmental
  "src/data/iso14001_criteria.json",
  fs.readdirSync('src/data').filter(f => f.startsWith('iso14001_manual_ch')).map(f => path.join('src/data', f))
);

const res0312 = consolidateRES0312();

if (!fs.existsSync('src/data/standards')) {
  fs.mkdirSync('src/data/standards', { recursive: true });
}

fs.writeFileSync('src/data/standards/iso9001.json', JSON.stringify(iso9001, null, 2));
fs.writeFileSync('src/data/standards/iso14001.json', JSON.stringify(iso14001, null, 2));
fs.writeFileSync('src/data/standards/res0312.json', JSON.stringify(res0312, null, 2));

console.log('Standards consolidated successfully!');
