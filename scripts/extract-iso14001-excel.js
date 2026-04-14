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

    data.forEach(row => {
        if (!row || row.length === 0) return;
        const firstCol = String(row[0] || '').trim();
        if (!firstCol) return;

        if (firstCol.match(/^\d+\.\s+[A-Z\s]+$/)) return;
        if (firstCol === 'NUMERAL' || firstCol === 'CUMPLIMIENTO') return;
        if (firstCol.includes('NO APLICA') || firstCol === 'La organización debe determinar:') return;

        const reqMatch = firstCol.match(/^(\d+\.\d+(\.\d+)?)\s+(.+)$/);
        if (reqMatch) {
            currentReqCode = reqMatch[1];
            if (!results[currentReqCode]) {
                results[currentReqCode] = [];
            }
        } else if (currentReqCode) {
            const cleanVal = firstCol.replace(/^»\s*/, '').trim();
            if (cleanVal && !results[currentReqCode].includes(cleanVal)) {
                 results[currentReqCode].push(cleanVal);
            }
        }
    });
});

fs.writeFileSync('src/data/iso14001_extracted.json', JSON.stringify(results, null, 2));
console.log('Total ISO 14001 criteria extracted:', Object.values(results).reduce((acc, curr) => acc + curr.length, 0));
