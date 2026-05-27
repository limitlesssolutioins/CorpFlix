import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

/**
 * Script de emergencia para normalizar las tablas de auditoría.
 * URL: /api/auditoria/emergency-migration
 */
export async function GET() {
    try {
        console.log('🚀 Iniciando migración de emergencia...');

        // 1. Normalizar AuditStandard (asegurar id vs standard_id no es el problema aquí, sino el nombre de la columna en Audit)
        // Pero primero veamos si AuditStandard tiene los nombres de columna correctos.
        
        // 2. Normalizar Audit
        await query(`
            ALTER TABLE Audit 
            ADD COLUMN IF NOT EXISTS audit_code VARCHAR(191),
            ADD COLUMN IF NOT EXISTS standard_id INT,
            ADD COLUMN IF NOT EXISTS scope TEXT,
            ADD COLUMN IF NOT EXISTS objectives TEXT,
            ADD COLUMN IF NOT EXISTS criteria TEXT,
            ADD COLUMN IF NOT EXISTS company_profile VARCHAR(191)
        `).catch(e => console.log('Audit columns exist or error:', e.message));

        // Si la columna era standardId (camelCase), la renombramos o aseguramos que standard_id exista
        // En MySQL DESCRIBE nos diría, pero aquí vamos a asegurar standard_id
        const columns = await query<any[]>('SHOW COLUMNS FROM Audit');
        const hasStandardIdUnderscore = columns.find(c => c.Field === 'standard_id');
        const hasStandardIdCamel = columns.find(c => c.Field === 'standardId');

        if (hasStandardIdCamel && !hasStandardIdUnderscore) {
            await query('ALTER TABLE Audit CHANGE COLUMN standardId standard_id INT');
            console.log('Renamed standardId to standard_id');
        }

        // 3. Normalizar AuditProgram
        await query(`
            ALTER TABLE AuditProgram 
            MODIFY COLUMN standard_id INT,
            ADD COLUMN IF NOT EXISTS frequency VARCHAR(50) DEFAULT 'Anual',
            ADD COLUMN IF NOT EXISTS audit_type VARCHAR(255),
            ADD COLUMN IF NOT EXISTS responsible VARCHAR(255),
            ADD COLUMN IF NOT EXISTS risks TEXT,
            ADD COLUMN IF NOT EXISTS duration VARCHAR(255)
        `).catch(e => console.log('AuditProgram columns exist or error:', e.message));

        return NextResponse.json({ 
            success: true, 
            message: 'Migración de emergencia completada. Columnas normalizadas a snake_case.',
            columns: columns.map(c => c.Field)
        });

    } catch (error: any) {
        console.error('Error en migración:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
