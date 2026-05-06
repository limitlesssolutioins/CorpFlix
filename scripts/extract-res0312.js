const xlsx = require('xlsx');
const fs = require('fs');

function extractRes0312() {
    const workbook = xlsx.readFile('src/documentacion/Diagnostico y auditoria Seguridad.xlsx');
    // The "Más de 50 T ó R IV, V" sheet usually has ALL 60 standards.
    const sheetName = 'Más de 50 T ó R IV, V'; 
    const worksheet = workbook.Sheets[sheetName];
    if (!worksheet) return;

    const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
    const requirements = {};
    let currentCode = null;

    data.forEach((row, i) => {
        if (!row || !row[0]) return;
        const colA = String(row[0]).trim();
        const colB = String(row[1] || '').trim();
        
        // It's a standard code like '1.1.1', '2.1.1'
        if (/^\d+\.\d+\.\d+$/.test(colA)) {
            currentCode = colA;
            if (!requirements[currentCode]) {
                requirements[currentCode] = { title: colB, criteria: [] };
            }
        } 
        // If it has supporting text or item descriptions in col B while we have a currentCode
        // Looking at the peek, colB has "ÍTEM DEL ESTÁNDAR" split by bullet points.
        else if (currentCode && colB && colB.length > 5 && !colA.startsWith('ESTÁNDAR')) {
            const bullets = colB.split(/\n\*/).map(s => s.replace(/^\*/, '').trim()).filter(s => s.length > 5);
            requirements[currentCode].criteria.push(...bullets);
        }
    });

    fs.writeFileSync('src/data/res0312_criteria.json', JSON.stringify(requirements, null, 2));
    console.log('Extracted RES0312 criteria to src/data/res0312_criteria.json');
}

extractRes0312();
