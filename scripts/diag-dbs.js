const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

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
console.log('--- DATABASE DIAGNOSTICS ---');

dbFiles.forEach(dbPath => {
    console.log(`\nLocation: ${dbPath}`);
    try {
        const db = new Database(dbPath);
        const count = db.prepare("SELECT COUNT(*) as c FROM requirement_variables").get().c;
        console.log(`  Variables total: ${count}`);
        
        const row441 = db.prepare(`
            SELECT COUNT(*) as c FROM requirement_variables rv
            JOIN iso_requirements ir ON rv.requirement_id = ir.id
            WHERE ir.requirement_code = '4.4.1'
        `).get().c;
        console.log(`  Variables for 4.4.1: ${row441}`);

        if (row441 > 0) {
            const sample = db.prepare(`
                SELECT rv.variable_text FROM requirement_variables rv
                JOIN iso_requirements ir ON rv.requirement_id = ir.id
                WHERE ir.requirement_code = '4.4.1'
                LIMIT 2
            `).all();
            sample.forEach((s, i) => console.log(`    Sample ${i+1}: ${s.variable_text.substring(0, 50)}...`));
        }

        const audits = db.prepare("SELECT audit_code FROM audits LIMIT 3").all();
        if (audits.length > 0) {
            console.log(`  Recent Audits: ${audits.map(a => a.audit_code).join(', ')}`);
        } else {
            console.log(`  Recent Audits: NONE`);
        }
        
        db.close();
    } catch (e) {
        console.log(`  Error: ${e.message}`);
    }
});
