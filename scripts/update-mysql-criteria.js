import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

const pool = mysql.createPool({
  uri: process.env.DATABASE_URL || 'mysql://lidustechadmin_lidusadmin:LidusTech2026@160.153.188.144:3306/lidustechadmin_lidusdb',
  connectionLimit: 10,
});

async function main() {
  console.log('🔄 Connecting to MySQL and seeding criteria and titles...');

  try {
    const standards = [
      { code: 'ISO9001', file: 'iso9001_criteria.json' },
      { code: 'ISO14001', file: 'iso14001_criteria.json' },
      { code: 'RES0312', file: 'res0312_criteria.json' },
    ];

    for (const std of standards) {
      const dataPath = path.join(process.cwd(), 'src', 'data', std.file);
      if (!fs.existsSync(dataPath)) {
        console.warn(`⚠️ File not found: ${std.file}`);
        continue;
      }

      console.log(`✅ Processing ${std.code}...`);
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

      // 1. Get Standard ID
      const [stdRows] = await pool.query('SELECT id FROM AuditStandard WHERE code = ?', [std.code]);
      if (!stdRows || stdRows.length === 0) {
        console.warn(`⚠️ Standard ${std.code} not found in DB.`);
        continue;
      }
      const stdId = stdRows[0].id;

      let requirementsUpdated = 0;
      let variablesCreated = 0;

      for (const [reqCode, content] of Object.entries(data)) {
        // Find requirement ID by standardId and code
        const [reqRows] = await pool.query(`
          SELECT r.id 
          FROM AuditRequirement r
          JOIN AuditChapter c ON r.chapterId = c.id
          WHERE c.standardId = ? AND r.code = ?
        `, [stdId, reqCode]);

        if (!reqRows || reqRows.length === 0) {
           // Not found, could be missing in DB. Skip or create?
           // For now, let's assume the DB schema is populated and we are updating
           continue;
        }
        
        const reqId = reqRows[0].id;
        const title = content.title || reqCode;
        const criteria = content.criteria || [];

        // Update Title
        await pool.query('UPDATE AuditRequirement SET title = ? WHERE id = ?', [title, reqId]);
        requirementsUpdated++;

        // Update Variables
        await pool.query('DELETE FROM RequirementVariable WHERE requirementId = ?', [reqId]);
        
        for (let i = 0; i < criteria.length; i++) {
          await pool.query('INSERT INTO RequirementVariable (requirementId, text, `order`) VALUES (?, ?, ?)', [reqId, criteria[i], i + 1]);
          variablesCreated++;
        }
      }

      console.log(`   - Updated ${requirementsUpdated} requirement titles.`);
      console.log(`   - Created ${variablesCreated} variables/criteria.`);
    }

    console.log('🎉 Seed complete!');

  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await pool.end();
  }
}

main();