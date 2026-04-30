const mariadb = require('mariadb');
const fs = require('fs');
const path = require('path');

async function main() {
  console.log('🌱 Starting raw MariaDB seed...');

  const pool = mariadb.createPool({
    host: '160.153.188.144',
    user: 'lidustechadmin_lidusadmin',
    password: 'LidusTech2026',
    database: 'lidustechadmin_lidusdb',
  });

  let conn;
  try {
    conn = await pool.getConnection();

    // 1. Initial System Config
    console.log('📦 Seeding SystemConfiguration...');
    await conn.query(`
      INSERT INTO SystemConfiguration (id, companyName, city, currentYear, smlmv, transportAid, paymentFrequency, taxRegime, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE companyName=VALUES(companyName), updatedAt=VALUES(updatedAt)
    `, ['default', 'Lidus Tech', 'Cartagena', 2026, 1423500, 200000, 'MONTHLY', 'Régimen Común', new Date()]);

    // 2. Audit Standards
    const standards = [
      { code: 'ISO9001', name: 'ISO 9001:2015', fullName: 'Sistemas de Gestión de la Calidad', category: 'Calidad', color: '#3b82f6' },
      { code: 'ISO14001', name: 'ISO 14001:2015', fullName: 'Sistemas de Gestión Ambiental', category: 'Ambiental', color: '#10b981' },
    ];

    for (const std of standards) {
      console.log(`✅ Standard ${std.code} seeding...`);
      const res = await conn.query(`
        INSERT INTO AuditStandard (code, name, fullName, category, color)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE name=VALUES(name)
      `, [std.code, std.name, std.fullName, std.category, std.color]);
      
      const stdRow = await conn.query('SELECT id FROM AuditStandard WHERE code = ?', [std.code]);
      const stdId = stdRow[0].id;

      const jsonPath = path.join(process.cwd(), 'src', 'data', `${std.code.toLowerCase()}_extracted.json`);
      if (fs.existsSync(jsonPath)) {
        const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        for (const [reqCode, content] of Object.entries(data)) {
          const chapterNum = reqCode.split('.')[0];
          
          await conn.query(`
            INSERT INTO AuditChapter (standardId, chapterNumber, title, createdAt)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE title=VALUES(title)
          `, [stdId, chapterNum, `Capítulo ${chapterNum}`, new Date()]);
          
          const chapRow = await conn.query('SELECT id FROM AuditChapter WHERE standardId = ? AND chapterNumber = ?', [stdId, chapterNum]);
          const chapId = chapRow[0].id;

          await conn.query(`
            INSERT INTO AuditRequirement (chapterId, code, title, createdAt)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE title=VALUES(title)
          `, [chapId, reqCode, reqCode, new Date()]);
          
          const reqRow = await conn.query('SELECT id FROM AuditRequirement WHERE chapterId = ? AND code = ?', [chapId, reqCode]);
          const reqId = reqRow[0].id;

          await conn.query('DELETE FROM RequirementVariable WHERE requirementId = ?', [reqId]);
          const criteria = Array.isArray(content) ? content : (content.criteria || []);
          for (let i = 0; i < criteria.length; i++) {
            await conn.query(`
              INSERT INTO RequirementVariable (requirementId, text, \`order\`)
              VALUES (?, ?, ?)
            `, [reqId, criteria[i], i + 1]);
          }
        }
        console.log(`   Seeded ${Object.keys(data).length} requirements for ${std.code}`);
      }
    }
    console.log('🚀 Raw seed finished successfully!');
  } catch (err) {
    console.error('❌ Seed failed:', err);
  } finally {
    if (conn) conn.release();
    await pool.end();
  }
}

main();
