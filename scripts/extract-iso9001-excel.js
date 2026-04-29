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

        // Skip standard headers
        if (val.match(/^\d+\s*[A-ZÁÉÍÓÚÑ\s]{10,}$/)) continue; // e.g. "4.CONTEXTO DE LA ORGANIZACIÓN"
        
        // Match requirement headers: "4.1 COMPRENSIÓN..." or "4.4.1 La organización..."
        const reqMatch = val.match(/^(\d+\.\d+(?:\.\d+)?)\s+(.+)$/);
        
        if (reqMatch) {
            currentReq = reqMatch[1];
            if (!results[currentReq]) results[currentReq] = [];
            
            // If the title contains significant text (more than just a title), it might be a criterion itself
            const title = reqMatch[2];
            if (title.length > 50 && !title.includes('COMPRENSIÓN') && !title.includes('DETERMINACIÓN')) {
                 results[currentReq].push(title);
            }
            continue;
        }

        // Sometimes the requirement is just the number
        const reqMatch2 = val.match(/^(\d+\.\d+(?:\.\d+)?)$/);
        if (reqMatch2) {
            currentReq = reqMatch2[1];
            if (!results[currentReq]) results[currentReq] = [];
            continue;
        }

        if (currentReq) {
            // It's a criterion
            // Filter out noise
            if (val.length < 5) continue;
            if (val === 'NUMERAL' || val === 'CUMPLIMIENTO' || val.includes('NO APLICA') || val === 'QUÉ TIENE?' || val === 'QUE NOS FALTA') continue;
            if (val === 'La organización debe determinar:' || val.includes('debe considerar:')) continue;
            
            // Clean up bullets and sub-numbering
            const cleanVal = val.replace(/^[\-Ø•\*]\s*/, '')
                                .replace(/^[a-z]\)\s*/, '')
                                .replace(/^\d+\)\s*/, '')
                                .trim();

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
