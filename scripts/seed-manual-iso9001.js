const fs = require('fs');
const Database = require('better-sqlite3');

const manualData = JSON.parse(fs.readFileSync('src/data/iso9001_manual_ch10.json', 'utf8'));

const dbs = [
    'test-db-dir/auditoria.db',
    'src/data/companies/lidus-1/auditoria.db'
];

dbs.forEach(dbPath => {
    if (!fs.existsSync(dbPath)) return;
    
    console.log(`\n📦 Manually seeding Chapter 10 for ISO9001 in ${dbPath}...`);
    const db = new Database(dbPath);
    
    try {
        db.exec('BEGIN TRANSACTION');
        
        const stdRow = db.prepare("SELECT id FROM audit_standards WHERE code = 'ISO9001'").get();
        if (!stdRow) throw new Error("ISO9001 standard not found");

        const insertStmt = db.prepare(`
            INSERT INTO requirement_variables (requirement_id, variable_text, variable_order)
            SELECT id, ?, ? FROM iso_requirements 
            WHERE requirement_code = ? AND chapter_id IN (SELECT id FROM iso_chapters WHERE standard_id = ?)
        `);

        let count = 0;
        for (const [code, criteria] of Object.entries(manualData)) {
            // First, delete existing criteria for this specific requirement to avoid duplicates
            db.prepare(`
                DELETE FROM requirement_variables WHERE requirement_id IN (
                    SELECT id FROM iso_requirements WHERE requirement_code = ? AND chapter_id IN (
                        SELECT id FROM iso_chapters WHERE standard_id = ?
                    )
                )
            `).run(code, stdRow.id);

            // Then insert the new clean criteria
            criteria.forEach((text, i) => {
                const result = insertStmt.run(text, i + 1, code, stdRow.id);
                if (result.changes > 0) count++;
            });
        }
        
        db.exec('COMMIT');
        console.log(`✅ Successfully updated ${count} criteria manually for Chapter 4.`);
    } catch (e) {
        db.exec('ROLLBACK');
        console.error(`❌ Error updating database:`, e.message);
    } finally {
        db.close();
    }
});
