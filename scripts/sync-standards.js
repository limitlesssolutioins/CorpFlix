const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function syncStandards() {
    console.log('🔄 Starting Audit Standards Sync...');
    const pool = mysql.createPool(process.env.DATABASE_URL);
    
    try {
        const standardsDir = path.join(process.cwd(), 'src/data/standards');
        const files = fs.readdirSync(standardsDir).filter(f => f.endsWith('.json'));

        for (const file of files) {
            console.log(`\n📄 Processing ${file}...`);
            const data = JSON.parse(fs.readFileSync(path.join(standardsDir, file), 'utf8'));

            // 1. Sync AuditStandard
            const [existingStd] = await pool.query('SELECT id FROM AuditStandard WHERE code = ?', [data.code]);
            let stdId;
            if (existingStd.length > 0) {
                stdId = existingStd[0].id;
                await pool.query(`
                    UPDATE AuditStandard SET name=?, fullName=?, category=?, color=?, description=?
                    WHERE id=?
                `, [data.name, data.fullName, data.category, data.color, data.description || '', stdId]);
                console.log(`   - Updated standard: ${data.code}`);
            } else {
                const [res] = await pool.query(`
                    INSERT INTO AuditStandard (code, name, fullName, category, color, description)
                    VALUES (?, ?, ?, ?, ?, ?)
                `, [data.code, data.name, data.fullName, data.category, data.color, data.description || '']);
                stdId = res.insertId;
                console.log(`   - Created standard: ${data.code} (ID: ${stdId})`);
            }

            // 2. Sync Chapters
            for (const chap of data.chapters) {
                const [existingChap] = await pool.query(
                    'SELECT id FROM AuditChapter WHERE standardId = ? AND chapterNumber = ?', 
                    [stdId, chap.number]
                );
                let chapterId;
                if (existingChap.length > 0) {
                    chapterId = existingChap[0].id;
                    await pool.query(
                        'UPDATE AuditChapter SET title = ? WHERE id = ?',
                        [chap.title, chapterId]
                    );
                } else {
                    const [res] = await pool.query(
                        'INSERT INTO AuditChapter (standardId, chapterNumber, title) VALUES (?, ?, ?)',
                        [stdId, chap.number, chap.title]
                    );
                    chapterId = res.insertId;
                }
                console.log(`     - Chapter ${chap.number}: ${chap.title}`);

                // 3. Sync Requirements (Flattened)
                const flattenedReqs = [];
                function flatten(reqs) {
                    reqs.forEach(r => {
                        flattenedReqs.push(r);
                        if (r.subRequirements) flatten(r.subRequirements);
                    });
                }
                flatten(chap.requirements);

                for (const req of flattenedReqs) {
                    const [existingReq] = await pool.query(
                        'SELECT id FROM AuditRequirement WHERE chapterId = ? AND code = ?',
                        [chapterId, req.code]
                    );
                    
                    const isAuditable = req.isAuditable ? 1 : 0;
                    const weight = req.weight || 0;
                    const title = req.title || req.code;

                    let dbReqId;
                    if (existingReq.length > 0) {
                        dbReqId = existingReq[0].id;
                        await pool.query(
                            'UPDATE AuditRequirement SET title=?, isAuditable=?, weight=? WHERE id=?',
                            [title, isAuditable, weight, dbReqId]
                        );
                    } else {
                        const [res] = await pool.query(
                            'INSERT INTO AuditRequirement (chapterId, code, title, isAuditable, weight) VALUES (?, ?, ?, ?, ?)',
                            [chapterId, req.code, title, isAuditable, weight]
                        );
                        dbReqId = res.insertId;
                    }

                    // Sync Criteria (Variables)
                    if (req.criteria && req.criteria.length > 0) {
                        await pool.query('DELETE FROM RequirementVariable WHERE requirementId = ?', [dbReqId]);
                        for (let i = 0; i < req.criteria.length; i++) {
                            await pool.query(
                                'INSERT INTO RequirementVariable (requirementId, text, `order`) VALUES (?, ?, ?)',
                                [dbReqId, req.criteria[i], i + 1]
                            );
                        }
                    }
                }
                console.log(`       - Synced ${flattenedReqs.length} requirements`);
            }
        }

        console.log('\n✅ Audit Standards Sync completed successfully!');

    } catch (err) {
        console.error('\n❌ Error during sync:', err);
    } finally {
        await pool.end();
    }
}

syncStandards();
