const xlsx = require('xlsx');
const fs = require('fs');

const wb = xlsx.readFile('temp/Diagnostico y auditoria Calidad.xlsx');
const sheets = ['4 CONTEXTO', '5 LIDERAZGO', '6 PLANIFICACIÓN', '7 SOPORTE', '8 OPERACIÓN', '9 EVALUACIÓN DESEMPEÑO', '10 MEJORA'];

const results = {};

sheets.forEach(sheetName => {
    const sheet = wb.Sheets[sheetName];
    if (!sheet) return;
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    let currentReq = null;
    let pendingPrefix = '';

    for (let i = 0; i < data.length; i++) {
        const row = data[i];
        if (!row || row.length === 0) continue;
        const val = String(row[0] || '').trim();
        if (!val) continue;

        // Filter empty or explicitly ignorable cells before splitting
        if (['NUMERAL', 'CUMPLIMIENTO', 'QUÉ TIENE?', 'QUE NOS FALTA', 'NO APLICA', 'ACCIONES', 'OBSERVACIONES'].includes(val)) continue;

        // Split cell by newlines because sometimes multiple requirements or a requirement + criteria are in the same cell
        const lines = val.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);

        for (let j = 0; j < lines.length; j++) {
            const line = lines[j];

            // --- FILTER NOISE ---
            if (line.match(/^\d+\.\s*[A-ZÁÉÍÓÚÑ\s]{10,}$/)) continue; // e.g. "4.CONTEXTO DE LA ORGANIZACIÓN"
            if (line.match(/^\d+\s+[A-ZÁÉÍÓÚÑ\s]+$/)) continue; // e.g. "5 LIDERAZGO"
            if (line.length < 10 && !line.match(/^\d+\.\d+/)) continue;

            // --- DETECT REQUIREMENTS ---
            const reqMatch = line.match(/^(\d+\.\d+(?:\.\d+)?(?:\.\d+)?)\s*\.?\s*(.+)$/);
            const numOnlyMatch = line.match(/^(\d+\.\d+(?:\.\d+)?(?:\.\d+)?)\.?$/);
            
            let code = null;
            let title = null;

            if (reqMatch) {
                code = reqMatch[1];
                title = reqMatch[2];
            } else if (numOnlyMatch) {
                code = numOnlyMatch[1];
            }

            if (code) {
                currentReq = code;
                if (!results[currentReq]) results[currentReq] = [];
                pendingPrefix = ''; // reset pending prefix on new requirement
                
                if (title) {
                    if (title.match(/debe\s*(\w+)?\s*:?$/i) || title.endsWith(':')) {
                        pendingPrefix = title.trim() + ' ';
                    } else if (title.length > 80 && !title.match(/^[A-ZÁÉÍÓÚÑ\s]+$/)) {
                        results[currentReq].push(title.trim());
                    }
                }
                continue;
            }

            // --- DETECT CRITERIA ---
            if (currentReq) {
                let text = line;
                
                if (text.match(/debe\s*(\w+)?\s*:?$/i) || text.match(/:\s*$/)) {
                    pendingPrefix = text.trim() + ' ';
                    continue;
                }

                let isBullet = text.match(/^\s*[\-Ø•\*»a-z]\s*[\)\.]/i) || text.match(/^\s*[\-Ø•\*»]/);
                
                text = text.replace(/^\s*[\-Ø•\*»]\s*/, '')
                           .replace(/^\s*[a-z]\)\s*/, '')
                           .replace(/^\s*[a-z]\.\s*/, '')
                           .replace(/^\s*\d+\)\s*/, '')
                           .trim();

                if (text.length > 5) {
                    if (pendingPrefix && (isBullet || text.charAt(0) === text.charAt(0).toLowerCase())) {
                        text = pendingPrefix + text.charAt(0).toLowerCase() + text.slice(1);
                    } else if (text.charAt(0) === text.charAt(0).toUpperCase() && text.length > 30) {
                         // Full sentence
                    } else if (pendingPrefix) {
                         text = pendingPrefix + text.charAt(0).toLowerCase() + text.slice(1);
                    }

                    if (!results[currentReq].includes(text)) {
                        results[currentReq].push(text);
                    }
                }
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
console.log('Total ISO 9001 criteria extracted:', Object.values(results).reduce((acc, curr) => acc + curr.length, 0));
