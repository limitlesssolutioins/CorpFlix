const mysql = require('mysql2/promise');

async function check44() {
    try {
        const pool = mysql.createPool(process.env.DATABASE_URL);
        
        console.log('--- Checking AuditChapter for 4.4 ---');
        const [chapters] = await pool.query('SELECT * FROM AuditChapter WHERE standardId = (SELECT id FROM AuditStandard WHERE code = "ISO9001") AND chapterNumber LIKE "4%"');
        console.log(chapters);

        console.log('\n--- Checking AuditRequirement for 4.4 ---');
        const [requirements] = await pool.query('SELECT * FROM AuditRequirement WHERE chapterId IN (SELECT id FROM AuditChapter WHERE standardId = (SELECT id FROM AuditStandard WHERE code = "ISO9001")) AND code LIKE "4.4%"');
        console.log(requirements);
        
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

check44();
