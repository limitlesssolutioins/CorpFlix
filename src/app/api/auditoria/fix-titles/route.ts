import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), 'src/data/iso9001_criteria.json');
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        // Get ISO9001 Standard ID
        const [stdRows] = await query<any[]>('SELECT id FROM AuditStandard WHERE code = "ISO9001"');
        if (!stdRows || stdRows.length === 0) {
            return NextResponse.json({ error: 'ISO9001 Standard not found in DB' }, { status: 404 });
        }
        const stdId = stdRows[0].id;

        let updated = 0;
        let created = 0;

        for (const [code, content] of Object.entries(data)) {
            const title = (content as any).title;
            if (!title) continue;

            // Find requirement
            const [reqRows] = await query<any[]>(`
                SELECT r.id 
                FROM AuditRequirement r
                JOIN AuditChapter c ON r.chapterId = c.id
                WHERE c.standardId = ? AND r.code = ?
            `, [stdId, code]);

            if (reqRows && reqRows.length > 0) {
                await query('UPDATE AuditRequirement SET title = ? WHERE id = ?', [title, reqRows[0].id]);
                updated++;
            } else {
                // If 4.4 is missing, we might need to find the chapter to insert it
                const chapterNum = code.split('.')[0];
                const [chRows] = await query<any[]>('SELECT id FROM AuditChapter WHERE standardId = ? AND chapterNumber = ?', [stdId, chapterNum]);
                
                if (chRows && chRows.length > 0) {
                    await query(`
                        INSERT INTO AuditRequirement (chapterId, code, title, description, isAuditable, weight)
                        VALUES (?, ?, ?, ?, ?, ?)
                    `, [chRows[0].id, code, title, '', 1, 0]);
                    created++;
                }
            }
        }

        return NextResponse.json({ success: true, updated, created });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
