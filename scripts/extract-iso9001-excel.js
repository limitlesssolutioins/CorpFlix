const xlsx = require('xlsx');
const fs = require('fs');

const wb = xlsx.readFile('temp/Diagnostico y auditoria Calidad.xlsx');
// Relevant sheets
const sheets = ['4 CONTEXTO', '5 LIDERAZGO', '6 PLANIFICACIÓN', '7 SOPORTE', '8 OPERACIÓN', '9 EVALUACIÓN DESEMPEÑO', '10 MEJORA'];

const results = {};
const log = [];

sheets.forEach(sheetName => {
    const sheet = wb.Sheets[sheetName];
    if (!sheet) return;
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    let currentReq = null;

    for (let i = 0; i < data.length; i++) {
        const row = data[i];
        if (!row || row.length === 0) continue;
        const val = String(row[0] || '').trim();
        if (!val) continue;

        // Skip headers
        if (val.match(/^\d+\s+[A-ZÁÉÍÓÚÑ\s]+$/)) continue; // e.g. "4 CONTEXTO DE LA..."
        if (val === 'La organización debe determinar:') continue;
        if (val === 'Cuando se determina este alcance, la organización debe considerar:') continue;
        if (val.startsWith('El alcance debe estar disponible y mantenerse')) continue;

        // Match requirement headers: "4.1 COMPRENSIÓN..." or "4.4.1 La organización..."
        const reqMatch = val.match(/^(\d+\.\d+(?:\.\d+)?)\s+(.+)$/);
        
        if (reqMatch) {
            currentReq = reqMatch[1];
            if (!results[currentReq]) results[currentReq] = [];
            // Sometimes the requirement title itself is followed by text, we skip adding the title as a criterion.
            // But if it's "4.4.1 The organization shall..." we might need to add it?
            // Actually, we'll only extract the subsequent rows as criteria.
            continue;
        }

        // Sometimes the requirement is just the number followed by text in the next line.
        const reqMatch2 = val.match(/^(\d+\.\d+(?:\.\d+)?)$/);
        if (reqMatch2) {
            currentReq = reqMatch2[1];
            if (!results[currentReq]) results[currentReq] = [];
            continue;
        }

        if (currentReq) {
            // It's a criterion
            // Filter out noise
            if (val === 'NUMERAL' || val === 'CUMPLIMIENTO' || val.includes('NO APLICA') || val === 'QUÉ TIENE?') continue;
            
            // Clean up bullets
            const cleanVal = val.replace(/^Ø\s*/, '').replace(/^a\)\s*/, 'a) ').replace(/^b\)\s*/, 'b) ').trim();
            if (cleanVal && !results[currentReq].includes(cleanVal)) {
                results[currentReq].push(cleanVal);
            }
        }
    }
});

// Save to JSON for verification
fs.writeFileSync('src/data/iso9001_extracted.json', JSON.stringify(results, null, 2));

// Generate SQL
let sql = '\n-- VARIABLES DE REQUISITOS PARA ISO 9001:2015 EXTRAÍDOS DEL EXCEL\n';
Object.entries(results).forEach(([code, criteria]) => {
    if (criteria.length === 0) return;
    sql += `\n-- Criterios para requisito ${code}\n`;
    criteria.forEach((criterion, index) => {
        const escaped = criterion.replace(/'/g, "''");
        sql += `INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)\n`;
        sql += `SELECT id, '${escaped}', ${index + 1}\n`;
        sql += `FROM iso_requirements \n`;
        sql += `WHERE requirement_code = '${code}' \n`;
        sql += `AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));\n`;
    });
});

fs.writeFileSync('src/data/iso9001_seed.sql', sql);
console.log('Extracted ISO 9001 criteria to src/data/iso9001_seed.sql');
