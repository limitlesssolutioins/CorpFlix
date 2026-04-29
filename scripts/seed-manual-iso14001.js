const fs = require('fs');
const Database = require('better-sqlite3');

const ch5Data = JSON.parse(fs.readFileSync('src/data/iso14001_manual_ch5.json', 'utf8'));
const ch6Data = JSON.parse(fs.readFileSync('src/data/iso14001_manual_ch6.json', 'utf8'));
const ch7Data = JSON.parse(fs.readFileSync('src/data/iso14001_manual_ch7.json', 'utf8'));
const ch8Data = JSON.parse(fs.readFileSync('src/data/iso14001_manual_ch8.json', 'utf8'));
const ch9Data = JSON.parse(fs.readFileSync('src/data/iso14001_manual_ch9.json', 'utf8'));
const ch10Data = JSON.parse(fs.readFileSync('src/data/iso14001_manual_ch10.json', 'utf8'));

const manualData = { ...ch5Data, ...ch6Data, ...ch7Data, ...ch8Data, ...ch9Data, ...ch10Data };

const dbs = [
    'test-db-dir/auditoria.db',
    'src/data/companies/lidus-1/auditoria.db'
];

dbs.forEach(dbPath => {
    if (!fs.existsSync(dbPath)) return;
    
    console.log(`\n📦 Manually seeding Chapters 5 to 10 for ISO14001 in ${dbPath}...`);
    const db = new Database(dbPath);
    
    try {
        db.exec('BEGIN TRANSACTION');
        
        const stdRow = db.prepare("SELECT id FROM audit_standards WHERE code = 'ISO14001'").get();
        if (!stdRow) throw new Error("ISO14001 standard not found");

        const insertStmt = db.prepare(`
            INSERT INTO requirement_variables (requirement_id, variable_text, variable_order)
            SELECT id, ?, ? FROM iso_requirements 
            WHERE requirement_code = ? AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = ?)
        `);

        let count = 0;
        for (const [code, criteria] of Object.entries(manualData)) {
            // Delete existing criteria for this requirement to override
            db.prepare(`
                DELETE FROM requirement_variables WHERE requirement_id IN (
                    SELECT id FROM iso_requirements WHERE requirement_code = ? AND chapter_id IN (
                        SELECT id FROM iso_chapters WHERE standard_id = ?
                    )
                )
            `).run(code, stdRow.id);

            criteria.forEach((text, i) => {
                const result = insertStmt.run(text, i + 1, code, stdRow.id);
                if (result.changes > 0) count++;
            });
        }
        
        db.exec('COMMIT');
        console.log(`✅ Successfully updated ${count} criteria manually for Chapter 4 (ISO 14001).`);
    } catch (e) {
        db.exec('ROLLBACK');
        console.error(`❌ Error updating database:`, e.message);
    } finally {
        db.close();
    }
});
