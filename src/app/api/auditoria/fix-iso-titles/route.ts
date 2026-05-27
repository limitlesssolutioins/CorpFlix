import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import fs from 'fs';
import path from 'path';

/**
 * Esta ruta API sincroniza los títulos de la ISO 9001 desde el archivo JSON a la base de datos.
 * Corrige puntos como el 4.4 que estaban vacíos.
 * URL: /api/auditoria/fix-iso-titles
 */
export async function GET() {
    try {
        const filePath = path.join(process.cwd(), 'src/data/iso9001_criteria.json');
        
        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: 'No se encontró el archivo iso9001_criteria.json' }, { status: 404 });
        }

        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        // 1. Obtener ID del estándar ISO9001
        const standards = await query<any[]>('SELECT id FROM AuditStandard WHERE code = "ISO9001"');
        if (!standards || standards.length === 0) {
            return NextResponse.json({ error: 'Estándar ISO9001 no encontrado en la base de datos' }, { status: 404 });
        }
        const stdId = standards[0].id;

        let updated = 0;
        let created = 0;
        const logs: string[] = [];

        for (const [code, content] of Object.entries(data)) {
            const title = (content as any).title;
            if (!title) continue;

            // Buscar si ya existe el requisito
            const reqs = await query<any[]>(`
                SELECT r.id 
                FROM AuditRequirement r
                JOIN AuditChapter c ON r.chapterId = c.id
                WHERE c.standardId = ? AND r.code = ?
            `, [stdId, code]);

            if (reqs && reqs.length > 0) {
                // Actualizar título si existe
                await query('UPDATE AuditRequirement SET title = ? WHERE id = ?', [title, reqs[0].id]);
                updated++;
            } else {
                // Si el requisito no existe (como el 4.4), intentar crearlo
                // Primero necesitamos el capítulo correspondiente
                const chapterNum = code.split('.')[0];
                const chapters = await query<any[]>('SELECT id FROM AuditChapter WHERE standardId = ? AND (chapterNumber = ? OR name LIKE ?)', 
                    [stdId, chapterNum, `Capítulo ${chapterNum}%`]);
                
                if (chapters && chapters.length > 0) {
                    await query(`
                        INSERT INTO AuditRequirement (chapterId, code, title, description, isAuditable, weight)
                        VALUES (?, ?, ?, ?, ?, ?)
                    `, [chapters[0].id, code, title, '', 1, 0]);
                    created++;
                    logs.push(`Creado: ${code} - ${title}`);
                } else {
                    logs.push(`Omitido (No se encontró capítulo): ${code}`);
                }
            }
        }

        return NextResponse.json({ 
            success: true, 
            message: 'Sincronización de títulos completada',
            stats: { updated, created },
            logs
        });

    } catch (error: any) {
        console.error('Error en fix-iso-titles:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
