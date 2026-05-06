const xlsx = require('xlsx');
const fs = require('fs');

function extractIso9001() {
    const workbook = xlsx.readFile('src/documentacion/auditoria.xlsx');
    const sheets = ['4 CONTEXTO', '5 LIDERAZGO', '6 PLANIFICACIÓN', '7 SOPORTE', '8 OPERACIÓN', '9 EVALUACIÓN DESEMPEÑO', '10 MEJORA'];
    
    const requirements = {};
    let currentCode = null;
    
    sheets.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        if (!worksheet) return;
        const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
        
        data.forEach((row, i) => {
            if (!row || !row[0] || typeof row[0] !== 'string') return;
            const text = row[0].trim();
            
            // Check if it's a heading like "4.1 COMPRENSIÓN..." or "4.4.1 SGC..."
            const match = text.match(/^(\d+\.\d+(?:\.\d+)?)\s+(.*)/);
            if (match) {
                currentCode = match[1];
                if (!requirements[currentCode]) {
                    requirements[currentCode] = { title: match[2], criteria: [] };
                }
            } else if (currentCode && text.length > 5 && !text.toUpperCase().includes('COMPLETO') && !text.toUpperCase().includes('NO APLICA') && text !== 'La organización debe determinar:') {
                // It's a criteria line under the current code
                requirements[currentCode].criteria.push(text.replace(/^Ø\s*/, '').replace(/^[a-z]\.\s*/, '').trim());
            }
        });
    });
    
    fs.writeFileSync('src/data/iso9001_criteria.json', JSON.stringify(requirements, null, 2));
    console.log('Extracted ISO 9001 criteria to src/data/iso9001_criteria.json');
}

extractIso9001();
