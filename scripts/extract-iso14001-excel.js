const xlsx = require('xlsx');
const fs = require('fs');

const wb = xlsx.readFile('temp/DIAGNOSTICO ALUTRAFICLED AMBIENTAL ISO 14001.xlsx');
const sheets = ['CONTEXTO', 'LIDERAZGO', 'PLANIFICACIÓN', 'APOYO', 'OPERACIÓN', 'EVALUACIÓN DEL DESEMPEÑO', 'MEJORA'];

const results = {};

sheets.forEach(sheetName => {
    const sheet = wb.Sheets[sheetName];
    if (!sheet) return;
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    let currentReqCode = null;

    for (let i = 0; i < data.length; i++) {
        const row = data[i];
        if (!row || row.length === 0) continue;
        const val = String(row[0] || '').trim();
        if (!val) continue;

        // Skip standard headers
        if (val.match(/^\d+\.\s*[A-ZÁÉÍÓÚÑ\s]{10,}$/)) continue; // e.g. "4. CONTEXTO DE LA ORGANIZACIÓN"
        
        // Match requirement headers: "4.1 Comprensión..." or "4.4 Sistema..."
        const reqMatch = val.match(/^(\d+\.\d+(?:\.\d+)?)\s+(.+)$/);
        
        if (reqMatch) {
            currentReqCode = reqMatch[1];
            if (!results[currentReqCode]) results[currentReqCode] = [];
            
            // If the title contains significant text (more than just a title), it might be a criterion itself
            const title = reqMatch[2];
            if (title.length > 50 && !title.includes('Comprensión') && !title.includes('Determinación')) {
                 results[currentReqCode].push(title);
            }
            continue;
        }

        // Sometimes the requirement is just the number
        const reqMatch2 = val.match(/^(\d+\.\d+(?:\.\d+)?)$/);
        if (reqMatch2) {
            currentReqCode = reqMatch2[1];
            if (!results[currentReqCode]) results[currentReqCode] = [];
            continue;
        }

        if (currentReqCode) {
            // It's a criterion
            // Filter out noise
            if (val.length < 5) continue;
            if (val === 'NUMERAL' || val === 'CUMPLIMIENTO' || val.includes('NO APLICA') || val === 'QUÉ TIENE?' || val === 'QUE NOS FALTA' || val === 'ACCIONES') continue;
            if (val === 'La organización debe determinar:' || val.includes('debe considerar:')) continue;
            
            // Clean up bullets and sub-numbering
            const cleanVal = val.replace(/^[\-Ø•\*»]\s*/, '')
                                .replace(/^[a-z]\.\s*/, '')
                                .replace(/^\d+\)\s*/, '')
                                .trim();

            if (cleanVal && !results[currentReqCode].includes(cleanVal)) {
                results[currentReqCode].push(cleanVal);
            }
        }
    }
});

fs.writeFileSync('src/data/iso14001_extracted.json', JSON.stringify(results, null, 2));
console.log('Total ISO 14001 criteria extracted:', Object.values(results).reduce((acc, curr) => acc + curr.length, 0));
