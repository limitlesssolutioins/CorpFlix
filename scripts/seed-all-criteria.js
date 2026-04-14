const fs = require('fs');
const Database = require('better-sqlite3');

const iso9001Data = JSON.parse(fs.readFileSync('src/data/iso9001_extracted.json', 'utf8'));
const iso14001Data = JSON.parse(fs.readFileSync('src/data/iso14001_extracted.json', 'utf8'));

const dbs = [
    new Database('test-db-dir/auditoria.db'),
    new Database('src/data/companies/lidus-1/auditoria.db')
];

function seedDB(db) {
    db.exec('BEGIN TRANSACTION');
    try {
        // Find ISO 9001 and 14001 standard IDs
        const iso9001 = db.prepare("SELECT id FROM audit_standards WHERE code = 'ISO9001'").get();
        const iso14001 = db.prepare("SELECT id FROM audit_standards WHERE code = 'ISO14001'").get();

        if (iso9001) {
            // Delete old criteria
            db.prepare(`
                DELETE FROM requirement_variables WHERE requirement_id IN (
                    SELECT ir.id FROM iso_requirements ir
                    JOIN iso_chapters ic ON ir.chapter_id = ic.id
                    WHERE ic.standard_id = ?
                )
            `).run(iso9001.id);

            const insertStmt = db.prepare(`
                INSERT INTO requirement_variables (requirement_id, variable_text, variable_order)
                SELECT id, ?, ? FROM iso_requirements 
                WHERE requirement_code = ? AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = ?)
            `);

            let count = 0;
            Object.entries(iso9001Data).forEach(([code, criteria]) => {
                criteria.forEach((text, i) => {
                    const result = insertStmt.run(text, i + 1, code, iso9001.id);
                    if(result.changes > 0) count++;
                });
            });
            console.log(`Seeded ${count} criteria for ISO 9001 in ${db.name}`);
        }

        if (iso14001) {
            // Delete old criteria
            db.prepare(`
                DELETE FROM requirement_variables WHERE requirement_id IN (
                    SELECT ir.id FROM iso_requirements ir
                    JOIN iso_chapters ic ON ir.chapter_id = ic.id
                    WHERE ic.standard_id = ?
                )
            `).run(iso14001.id);

            const insertStmt = db.prepare(`
                INSERT INTO requirement_variables (requirement_id, variable_text, variable_order)
                SELECT id, ?, ? FROM iso_requirements 
                WHERE requirement_code = ? AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = ?)
            `);

            let count = 0;
            Object.entries(iso14001Data).forEach(([code, criteria]) => {
                criteria.forEach((text, i) => {
                    const result = insertStmt.run(text, i + 1, code, iso14001.id);
                    if(result.changes > 0) count++;
                });
            });
            console.log(`Seeded ${count} criteria for ISO 14001 in ${db.name}`);
        }

        db.exec('COMMIT');
    } catch(e) {
        db.exec('ROLLBACK');
        console.error('Error seeding ' + db.name + ':', e.message);
    }
}

dbs.forEach(seedDB);

// Also re-generate the SQL seed file properly using proper string escaping!
let sql = '\n-- VARIABLES DE REQUISITOS (CRITERIOS DE EVALUACIÓN)\n';
sql += '-- Generado automáticamente desde los documentos base\n';
sql += '-- =====================================================\n\n';

sql += '-- Criterios para ISO9001\n';
Object.entries(iso9001Data).forEach(([code, criteria]) => {
    sql += `\n-- Criterios para requisito ${code}\n`;
    criteria.forEach((text, i) => {
        const esc = text.replace(/'/g, "''");
        sql += `INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)\n`;
        sql += `SELECT id, '${esc}', ${i + 1}\n`;
        sql += `FROM iso_requirements WHERE requirement_code = '${code}' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO9001'));\n`;
    });
});

sql += '\n-- Criterios para ISO14001\n';
Object.entries(iso14001Data).forEach(([code, criteria]) => {
    sql += `\n-- Criterios para requisito ${code}\n`;
    criteria.forEach((text, i) => {
        const esc = text.replace(/'/g, "''");
        sql += `INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)\n`;
        sql += `SELECT id, '${esc}', ${i + 1}\n`;
        sql += `FROM iso_requirements WHERE requirement_code = '${code}' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'ISO14001'));\n`;
    });
});

// Res 0312 shouldn't be lost, we read it from the old schema block or res0312_criteria.json
// Let's check res0312_criteria.json to re-generate it too just to be complete and bulletproof!
const res0312Data = JSON.parse(fs.readFileSync('src/data/res0312_criteria.json', 'utf8'));
sql += '\n-- Criterios para RES0312\n';
Object.entries(res0312Data).forEach(([code, data]) => {
    if (!data.criteria || data.criteria.length === 0) return;
    sql += `\n-- Criterios para requisito ${code}\n`;
    data.criteria.forEach((text, i) => {
        const esc = text.replace(/'/g, "''");
        sql += `INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)\n`;
        sql += `SELECT id, '${esc}', ${i + 1}\n`;
        sql += `FROM iso_requirements WHERE requirement_code = '${code}' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = 'RES0312'));\n`;
    });
});

// Read original file, cut before "VARIABLES DE REQUISITOS", append new block
const originalFile = fs.readFileSync('src/data/criteria_seed.sql', 'utf8');
const cutIndex = originalFile.indexOf('-- VARIABLES DE REQUISITOS (CRITERIOS DE EVALUACIÓN)');
if (cutIndex !== -1) {
    const finalSql = originalFile.substring(0, cutIndex) + sql;
    fs.writeFileSync('src/data/criteria_seed.sql', finalSql);
} else {
    fs.writeFileSync('src/data/criteria_seed.sql', sql);
}

console.log('Successfully regenerated criteria_seed.sql with all 3 standards.');
