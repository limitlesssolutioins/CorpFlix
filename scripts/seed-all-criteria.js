const fs = require('fs');
const Database = require('better-sqlite3');
const path = require('path');

// Load extracted data
const iso9001Data = JSON.parse(fs.readFileSync('src/data/iso9001_extracted.json', 'utf8'));
const iso14001Data = JSON.parse(fs.readFileSync('src/data/iso14001_extracted.json', 'utf8'));
const res0312Data = JSON.parse(fs.readFileSync('src/data/res0312_extracted.json', 'utf8'));
const mintrabajoData = JSON.parse(fs.readFileSync('src/data/mintrabajo_extracted.json', 'utf8'));

const dbs = [];
if (fs.existsSync('test-db-dir/auditoria.db')) dbs.push(new Database('test-db-dir/auditoria.db'));
if (fs.existsSync('src/data/companies/lidus-1/auditoria.db')) dbs.push(new Database('src/data/companies/lidus-1/auditoria.db'));

function seedDB(db) {
    console.log(`\n📦 Seeding database: ${db.name || 'auditoria.db'}...`);
    db.exec('BEGIN TRANSACTION');
    try {
        const standards = [
            { code: 'ISO9001', data: iso9001Data, name: 'ISO 9001:2015' },
            { code: 'ISO14001', data: iso14001Data, name: 'ISO 14001:2015' },
            { code: 'RES0312', data: res0312Data, name: 'Res. 0312:2019' },
            { code: 'MINTRABAJO', data: mintrabajoData, name: 'MinTrabajo Laboral' }
        ];

        for (const std of standards) {
            const stdRow = db.prepare("SELECT id FROM audit_standards WHERE code = ?").get(std.code);
            if (!stdRow) {
                console.warn(`⚠️  Standard ${std.code} not found in database, skipping.`);
                continue;
            }

            // Delete old criteria for this standard
            db.prepare(`
                DELETE FROM requirement_variables WHERE requirement_id IN (
                    SELECT ir.id FROM iso_requirements ir
                    JOIN iso_chapters ic ON ir.chapter_id = ic.id
                    WHERE ic.standard_id = ?
                )
            `).run(stdRow.id);

            const insertStmt = db.prepare(`
                INSERT INTO requirement_variables (requirement_id, variable_text, variable_order)
                SELECT id, ?, ? FROM iso_requirements 
                WHERE requirement_code = ? AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = ?)
            `);

            let count = 0;
            Object.entries(std.data).forEach(([code, criteria]) => {
                // If criteria is an object with a 'criteria' array (old format support)
                const items = Array.isArray(criteria) ? criteria : (criteria.criteria || []);
                items.forEach((text, i) => {
                    try {
                        const result = insertStmt.run(text, i + 1, code, stdRow.id);
                        if (result.changes > 0) count++;
                    } catch (e) {
                        // Likely requirement_code not found
                    }
                });
            });
            console.log(`✅ Seeded ${count} criteria for ${std.name}`);
        }

        db.exec('COMMIT');
    } catch (e) {
        db.exec('ROLLBACK');
        console.error(`❌ Error seeding database:`, e.message);
    }
}

dbs.forEach(seedDB);

// Re-generate the SQL seed file
let sql = '\n-- VARIABLES DE REQUISITOS (CRITERIOS DE EVALUACIÓN)\n';
sql += '-- Generado automáticamente desde los documentos base\n';
sql += '-- =====================================================\n\n';

function appendToSQL(code, data, name) {
    sql += `\n-- Criterios para ${name} (${code})\n`;
    Object.entries(data).forEach(([reqCode, criteria]) => {
        const items = Array.isArray(criteria) ? criteria : (criteria.criteria || []);
        if (items.length === 0) return;
        sql += `\n-- Criterios para requisito ${reqCode}\n`;
        items.forEach((text, i) => {
            const esc = text.replace(/'/g, "''");
            sql += `INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)\n`;
            sql += `SELECT id, '${esc}', ${i + 1}\n`;
            sql += `FROM iso_requirements WHERE requirement_code = '${reqCode}' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = '${code}'));\n`;
        });
    });
}

appendToSQL('ISO9001', iso9001Data, 'ISO 9001:2015');
appendToSQL('ISO14001', iso14001Data, 'ISO 14001:2015');
appendToSQL('RES0312', res0312Data, 'Res. 0312:2019');
appendToSQL('MINTRABAJO', mintrabajoData, 'MinTrabajo Laboral');

const targetPath = 'src/data/criteria_seed.sql';
fs.writeFileSync(targetPath, sql, 'utf8');

console.log(`\n🎉 Successfully regenerated ${targetPath} and updated databases.`);
