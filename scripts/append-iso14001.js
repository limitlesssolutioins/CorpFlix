const fs = require('fs');

const criteria = JSON.parse(fs.readFileSync('src/data/iso14001_criteria.json', 'utf-8'));

let sql = '\n-- VARIABLES DE REQUISITOS PARA ISO 14001:2015\n';
Object.entries(criteria).forEach(([code, data]) => {
    sql += `\n-- Criterios para requisito ${code}\n`;
    data.criteria.forEach((criterion, index) => {
        const escapedCriterion = criterion.replace(/'/g, "''");
        sql += `INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)\n`;
        sql += `SELECT id, '${escapedCriterion}', ${index + 1}\n`;
        sql += `FROM iso_requirements \n`;
        sql += `WHERE requirement_code = '${code}' \n`;
        sql += `AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));\n`;
    });
});

const content = fs.readFileSync('src/data/criteria_seed.sql', 'utf-8');
if (!content.includes('-- VARIABLES DE REQUISITOS PARA ISO 14001:2015')) {
    fs.writeFileSync('src/data/criteria_seed.sql', content + sql);
    console.log('Appended ISO 14001 to criteria_seed.sql');
} else {
    console.log('ISO 14001 already exists in criteria_seed.sql');
}
