const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dataDir = path.join(process.cwd(), 'src', 'data');

const iso9001 = {};
fs.readdirSync(dataDir).forEach(file => {
    if (file.startsWith('iso9001_manual_ch') && file.endsWith('.json')) {
        const data = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
        Object.assign(iso9001, data);
    }
});

const iso14001 = {};
fs.readdirSync(dataDir).forEach(file => {
    if (file.startsWith('iso14001_manual_ch') && file.endsWith('.json')) {
        const data = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
        Object.assign(iso14001, data);
    }
});

const standards = [
    { code: 'ISO9001', data: iso9001 },
    { code: 'ISO14001', data: iso14001 }
];

// Find all auditoria.db files
function findDbs(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const name = path.join(dir, file);
        if (fs.statSync(name).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git' && file !== '.next') {
                findDbs(name, fileList);
            }
        } else {
            if (file === 'auditoria.db') {
                fileList.push(name);
            }
        }
    });
    return fileList;
}

const dbFiles = findDbs(process.cwd());
console.log('🔍 Found databases:', dbFiles);

dbFiles.forEach(dbPath => {
    console.log(`\n📦 SEEDING: ${dbPath}`);
    const db = new Database(dbPath);
    
    try {
        db.exec('BEGIN TRANSACTION');
        
        for (const std of standards) {
            const stdRow = db.prepare("SELECT id FROM audit_standards WHERE code = ?").get(std.code);
            if (!stdRow) {
                console.log(`  ⚠️  Standard ${std.code} not found, skipping.`);
                continue;
            }

            // Clear old criteria for this standard
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
            for (const [code, criteria] of Object.entries(std.data)) {
                criteria.forEach((text, i) => {
                    const result = insertStmt.run(text, i + 1, code, stdRow.id);
                    if (result.changes > 0) count++;
                });
            }
            console.log(`  ✅ Seeded ${count} clean criteria for ${std.code}`);
        }
        
        db.exec('COMMIT');
    } catch (e) {
        db.exec('ROLLBACK');
        console.error(`  ❌ Error:`, e.message);
    } finally {
        db.close();
    }
});

// Also update the criteria_seed.sql so new databases get the correct data
let sql = '-- VARIABLES DE REQUISITOS (CRITERIOS DE EVALUACIÓN) MANUALES\n\n';
for (const std of standards) {
    sql += `-- Standard: ${std.code}\n`;
    for (const [code, criteria] of Object.entries(std.data)) {
        criteria.forEach((text, i) => {
            const esc = text.replace(/'/g, "''");
            sql += `INSERT OR IGNORE INTO requirement_variables (requirement_id, variable_text, variable_order)\n`;
            sql += `SELECT id, '${esc}', ${i + 1}\n`;
            sql += `FROM iso_requirements WHERE requirement_code = '${code}' AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = (SELECT id FROM audit_standards WHERE code = '${std.code}'));\n`;
        });
    }
}
fs.writeFileSync(path.join(dataDir, 'criteria_seed.sql'), sql, 'utf8');
console.log(`\n📄 Updated ${path.join(dataDir, 'criteria_seed.sql')}`);
