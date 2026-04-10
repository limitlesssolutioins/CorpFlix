const fs = require('fs');

function generateSQL() {
    const iso9001 = JSON.parse(fs.readFileSync('src/data/iso9001_criteria.json', 'utf8'));
    const res0312 = JSON.parse(fs.readFileSync('src/data/res0312_criteria.json', 'utf8'));

    let sql = `\n\n-- =====================================================\n-- VARIABLES DE REQUISITOS (CRITERIOS DE EVALUACIÓN)\n-- Generado automáticamente desde los documentos base\n-- =====================================================\n\n`;

    // Function to generate SQL block for a standard
    const buildSqlForStandard = (standardCode, dataMap) => {
        let block = `\n-- Criterios para ${standardCode}\n`;
        for (const [reqCode, data] of Object.entries(dataMap)) {
            if (!data.criteria || data.criteria.length === 0) continue;
            
            block += `\n-- Criterios para requisito ${reqCode}\n`;
            data.criteria.forEach((criteria, idx) => {
                // Escape single quotes
                const safeText = criteria.replace(/'/g, "''").trim();
                if (!safeText) return;
                
                block += `INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)\n`;
                block += `SELECT id, '${safeText}', ${idx + 1}\n`;
                block += `FROM iso_requirements \n`;
                block += `WHERE requirement_code = '${reqCode}' \n`;
                block += `AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = '${standardCode}'));\n`;
            });
        }
        return block;
    };

    sql += buildSqlForStandard('ISO9001', iso9001);
    sql += buildSqlForStandard('RES0312', res0312);

    fs.writeFileSync('src/data/criteria_seed.sql', sql);
    console.log('SQL seed generated at src/data/criteria_seed.sql');
}

generateSQL();
