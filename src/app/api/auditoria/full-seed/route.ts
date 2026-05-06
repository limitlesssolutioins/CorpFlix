import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        const standards = [
            { code: 'RES0312', name: 'Resolución 0312', fullName: 'SST - Estándares Mínimos (Res. 0312)', category: 'SST y Laboral', color: '#eab308', description: 'Auditoría de cumplimiento de los estándares mínimos del Sistema de Gestión de Seguridad y Salud en el Trabajo.' },
            { code: 'ISO27001', name: 'ISO 27001', fullName: 'ISO 27001 - Seguridad de la Información', category: 'Ciberseguridad', color: '#6366f1', description: 'Auditoría del Sistema de Gestión de Seguridad de la Información (SGSI).' },
            { code: 'PESV', name: 'PESV', fullName: 'PESV - Plan Estratégico de Seguridad Vial', category: 'Seguridad Vial', color: '#ec4899', description: 'Auditoría del Plan Estratégico de Seguridad Vial de acuerdo a la normatividad vigente.' }
        ];

        let log = [];

        for (const std of standards) {
            // 1. Create or Update Standard
            let stdId;
            const existing = await query<any[]>('SELECT id FROM AuditStandard WHERE code = ?', [std.code]);
            
            if (existing.length === 0) {
                const res: any = await query(`
                    INSERT INTO AuditStandard (code, name, fullName, category, color, description)
                    VALUES (?, ?, ?, ?, ?, ?)
                `, [std.code, std.name, std.fullName, std.category, std.color, std.description]);
                stdId = res.insertId;
                log.push(`Inserted Standard ${std.code} with ID ${stdId}`);
            } else {
                stdId = existing[0].id;
                await query(`
                    UPDATE AuditStandard SET name = ?, fullName = ?, category = ?, color = ?, description = ? WHERE id = ?
                `, [std.name, std.fullName, std.category, std.color, std.description, stdId]);
                log.push(`Updated Standard ${std.code}`);
            }

            // 2. Read criteria file if exists
            let data: any = {};
            try {
                const fileMap: any = { 'RES0312': 'res0312_criteria.json', 'ISO27001': 'iso27001_criteria.json', 'PESV': 'pesv_criteria.json' };
                const dataPath = path.join(process.cwd(), 'src', 'data', fileMap[std.code]);
                if (fs.existsSync(dataPath)) {
                    data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
                } else if (std.code === 'ISO27001') {
                    // Generate basic structure for ISO27001 if file doesn't exist
                    data = {
                        "4.1": { title: "Comprensión de la organización y de su contexto", criteria: ["Se ha determinado el contexto externo e interno.", "Está documentado."] },
                        "5.1": { title: "Liderazgo y compromiso", criteria: ["La alta dirección demuestra liderazgo.", "Política de seguridad establecida."] },
                        "6.1": { title: "Acciones para tratar riesgos y oportunidades", criteria: ["Se han evaluado los riesgos de seguridad.", "Plan de tratamiento de riesgos implementado."] },
                        "7.1": { title: "Recursos", criteria: ["Se proporcionan recursos para el SGSI."] },
                        "8.1": { title: "Planificación y control operacional", criteria: ["Los procesos están controlados."] },
                        "9.1": { title: "Seguimiento, medición, análisis y evaluación", criteria: ["Se mide el desempeño de seguridad."] },
                        "10.1": { title: "Mejora continua", criteria: ["Existen acciones de mejora continua."] }
                    };
                } else if (std.code === 'PESV') {
                    // Generate basic structure for PESV if file doesn't exist
                    data = {
                        "1.1": { title: "Líder del diseño e implementación del PESV", criteria: ["Existe resolución o documento de nombramiento."] },
                        "2.1": { title: "Comité de seguridad vial", criteria: ["Comité conformado y activo."] },
                        "3.1": { title: "Política de Seguridad Vial", criteria: ["Política publicada y comunicada."] },
                        "4.1": { title: "Diagnóstico y evaluación del riesgo", criteria: ["Matriz de riesgos viales actualizada."] },
                        "5.1": { title: "Programas de gestión de riesgos", criteria: ["Programa de vehículos seguros.", "Programa de comportamientos seguros."] }
                    };
                }
            } catch (e) {
                console.error(e);
            }

            // 3. Insert Chapters and Requirements
            for (const [reqCode, content] of Object.entries(data)) {
                const reqTitle = (content as any).title || reqCode;
                const criteria = (content as any).criteria || [];

                // Determine Chapter from reqCode (e.g. "1.1.1" -> Chapter "1", or "4.1" -> Chapter "4")
                const chapterNum = reqCode.split('.')[0];
                const chapterTitle = `Capítulo ${chapterNum}`;

                // Check if chapter exists
                let chapterId;
                const chaps = await query<any[]>('SELECT id FROM AuditChapter WHERE standardId = ? AND name = ?', [stdId, chapterTitle]);
                if (chaps.length === 0) {
                    const chRes: any = await query(`
                        INSERT INTO AuditChapter (standardId, name, sortOrder) VALUES (?, ?, ?)
                    `, [stdId, chapterTitle, parseInt(chapterNum) || 0]);
                    chapterId = chRes.insertId;
                } else {
                    chapterId = chaps[0].id;
                }

                // Check if requirement exists
                let reqId;
                const reqs = await query<any[]>('SELECT id FROM AuditRequirement WHERE chapterId = ? AND code = ?', [chapterId, reqCode]);
                if (reqs.length === 0) {
                    const rRes: any = await query(`
                        INSERT INTO AuditRequirement (chapterId, code, title, description, isRequired) VALUES (?, ?, ?, ?, ?)
                    `, [chapterId, reqCode, reqTitle, '', 1]);
                    reqId = rRes.insertId;
                } else {
                    reqId = reqs[0].id;
                    await query('UPDATE AuditRequirement SET title = ? WHERE id = ?', [reqTitle, reqId]);
                }

                // Update criteria (variables)
                await query('DELETE FROM RequirementVariable WHERE requirementId = ?', [reqId]);
                for (let i = 0; i < criteria.length; i++) {
                    await query('INSERT INTO RequirementVariable (requirementId, text, `order`) VALUES (?, ?, ?)', [reqId, criteria[i], i + 1]);
                }
            }
        }

        return NextResponse.json({ success: true, log });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
