const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src/data/iso9001_criteria.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const fixes = {
    "4.4": {
        "title": "SISTEMA DE GESTIÓN DE LA CALIDAD Y SUS PROCESOS",
        "criteria": [
            "La organización debe establecer, implementar, mantener y mejorar continuamente un sistema de gestión de la calidad, incluidos los procesos necesarios y sus interacciones, de acuerdo con los requisitos de esta Norma Internacional."
        ]
    },
    "7.1.1": { "title": "Generalidades" },
    "7.1.4": { "title": "Ambiente para la operación de los procesos" },
    "7.1.5.1": { "title": "Generalidades" },
    "7.1.5.2": { "title": "Trazabilidad de la medición" },
    "7.5.1": { "title": "Generalidades" },
    "7.5.3.1": { "title": "Control de la información documentada" },
    "7.5.3.2": { "title": "Control de la información documentada - Conservación" },
    "8.2.3.1": { "title": "Revisión de los requisitos para los productos y servicios" },
    "8.2.3.2": { "title": "Conservación de información documentada de la revisión" },
    "9.3.1": { "title": "Generalidades" }
};

for (const [code, fix] of Object.entries(fixes)) {
    if (!data[code]) {
        data[code] = fix;
    } else {
        if (fix.title) data[code].title = fix.title;
        if (fix.criteria) data[code].criteria = fix.criteria;
    }
}

// Sort keys numerically
const sortedData = {};
Object.keys(data).sort((a, b) => {
    const partsA = a.split('.').map(Number);
    const partsB = b.split('.').map(Number);
    for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
        if ((partsA[i] || 0) < (partsB[i] || 0)) return -1;
        if ((partsA[i] || 0) > (partsB[i] || 0)) return 1;
    }
    return 0;
}).forEach(key => {
    sortedData[key] = data[key];
});

fs.writeFileSync(filePath, JSON.stringify(sortedData, null, 2), 'utf8');
console.log('✅ Fixed iso9001_criteria.json');
