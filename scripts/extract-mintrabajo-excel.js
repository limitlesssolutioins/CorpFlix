const xlsx = require('xlsx');
const fs = require('fs');

const wb = xlsx.readFile('temp/CHECK LIST LABORAL ( MINISTERIO DE TRABAJO) (1).xlsx');
const sheet = wb.Sheets['Transcripción literal'];
const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

const results = {};
let currentReq = null;

data.forEach(row => {
    if (!row || row.length === 0) return;
    
    const item = String(row[0] || '').trim();
    const info = String(row[1] || '').trim();
    
    // Look for codes like 1.1., 1.2., etc.
    const reqMatch = info.match(/^(\d+\.\d+)\.\s+(.+)$/);
    if (reqMatch) {
        currentReq = reqMatch[1];
        if (!results[currentReq]) results[currentReq] = [];
        return;
    }

    if (currentReq && info && info !== 'INFORMACION') {
        // Skip some noise
        if (info.includes('Diligencie o seleccione') || info.includes('documento soporte')) return;
        if (info === 'SI' || info === 'NO' || info === 'N/A') return;
        
        if (info.length > 5 && !results[currentReq].includes(info)) {
            results[currentReq].push(info);
        }
    }
});

fs.writeFileSync('src/data/mintrabajo_extracted.json', JSON.stringify(results, null, 2));
console.log('Total MINTRABAJO criteria extracted:', Object.values(results).reduce((acc, curr) => acc + curr.length, 0));
