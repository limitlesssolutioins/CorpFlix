const fs = require('fs');
const Database = require('better-sqlite3');
const path = require('path');

const schemaPath = 'src/data/schema_auditoria.sql';
const schema = fs.readFileSync(schemaPath, 'utf8');

const dbs = [
    'test-db-dir/auditoria.db',
    'src/data/companies/lidus-1/auditoria.db'
];

dbs.forEach(dbPath => {
    if (fs.existsSync(dbPath)) {
        console.log(`Updating schema for ${dbPath}...`);
        const db = new Database(dbPath);
        try {
            db.exec(schema);
            console.log(`✅ Schema updated for ${dbPath}`);
        } catch (e) {
            console.error(`❌ Error updating schema for ${dbPath}:`, e.message);
        } finally {
            db.close();
        }
    }
});
