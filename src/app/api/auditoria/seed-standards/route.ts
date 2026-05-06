import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
    try {
        const standards = [
            {
                code: 'RES0312',
                name: 'Resolución 0312',
                fullName: 'SST - Estándares Mínimos (Res. 0312)',
                category: 'SST y Laboral',
                color: '#eab308', // Yellow/Amber for HardHat
                description: 'Auditoría de cumplimiento de los estándares mínimos del Sistema de Gestión de Seguridad y Salud en el Trabajo.'
            },
            {
                code: 'ISO27001',
                name: 'ISO 27001',
                fullName: 'ISO 27001 - Seguridad de la Información',
                category: 'Ciberseguridad',
                color: '#6366f1', // Indigo for Lock
                description: 'Auditoría del Sistema de Gestión de Seguridad de la Información (SGSI).'
            },
            {
                code: 'PESV',
                name: 'PESV',
                fullName: 'PESV - Plan Estratégico de Seguridad Vial',
                category: 'Seguridad Vial',
                color: '#ec4899', // Pink for Car
                description: 'Auditoría del Plan Estratégico de Seguridad Vial de acuerdo a la normatividad vigente.'
            }
        ];

        for (const std of standards) {
            const existing = await query<any[]>('SELECT id FROM AuditStandard WHERE code = ?', [std.code]);
            if (existing.length === 0) {
                await query(`
                    INSERT INTO AuditStandard (code, name, fullName, category, color, description)
                    VALUES (?, ?, ?, ?, ?, ?)
                `, [std.code, std.name, std.fullName, std.category, std.color, std.description]);
            } else {
                await query(`
                    UPDATE AuditStandard SET name = ?, fullName = ?, category = ?, color = ?, description = ? WHERE code = ?
                `, [std.name, std.fullName, std.category, std.color, std.description, std.code]);
            }
        }

        return NextResponse.json({ success: true, message: 'Standards seeded correctly' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
