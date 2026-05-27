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
        
        // 1. Lista de columnas necesarias en la tabla Audit
        const auditColumns = [
            { name: 'audit_code', type: 'VARCHAR(191)' },
            { name: 'standard_id', type: 'INT' },
            { name: 'scope', type: 'TEXT' },
            { name: 'objectives', type: 'TEXT' },
            { name: 'criteria', type: 'TEXT' },
            { name: 'company_profile', type: 'VARCHAR(191)' }
        ];

        // Obtener columnas actuales de Audit
        const auditColsRes = await query<any>('SHOW COLUMNS FROM Audit');
        const existingAuditCols = Array.isArray(auditColsRes) ? auditColsRes : (auditColsRes?.rows || []);
        const existingNames = existingAuditCols.map((c: any) => c.Field);

        for (const col of auditColumns) {
            if (!existingNames.includes(col.name)) {
                // Caso especial: si existe standardId (camelCase), renombrarlo
                if (col.name === 'standard_id' && existingNames.includes('standardId')) {
                    await query('ALTER TABLE Audit CHANGE COLUMN standardId standard_id INT');
                } else {
                    await query(`ALTER TABLE Audit ADD COLUMN ${col.name} ${col.type}`);
                }
            }
        }

        // 2. Normalizar AuditProgram
        const programColumns = [
            { name: 'frequency', type: "VARCHAR(50) DEFAULT 'Anual'" },
            { name: 'audit_type', type: 'VARCHAR(255)' },
            { name: 'responsible', type: 'VARCHAR(255)' },
            { name: 'risks', type: 'TEXT' },
            { name: 'duration', type: 'VARCHAR(255)' }
        ];

        const progColsRes = await query<any>('SHOW COLUMNS FROM AuditProgram');
        const existingProgCols = Array.isArray(progColsRes) ? progColsRes : (progColsRes?.rows || []);
        const existingProgNames = existingProgCols.map((c: any) => c.Field);

        for (const col of programColumns) {
            if (!existingProgNames.includes(col.name)) {
                await query(`ALTER TABLE AuditProgram ADD COLUMN ${col.name} ${col.type}`);
            }
        }
        
        // 3. Normalizar AuditPlan
        const planColumns = [
            { name: 'objective', type: 'TEXT' },
            { name: 'scope', type: 'TEXT' },
            { name: 'methods', type: 'TEXT' },
            { name: 'resources', type: 'TEXT' },
            { name: 'risks', type: 'TEXT' }
        ];
        const planColsRes = await query<any>('SHOW COLUMNS FROM AuditPlan');
        const existingPlanCols = Array.isArray(planColsRes) ? planColsRes : (planColsRes?.rows || []);
        const existingPlanNames = existingPlanCols.map((c: any) => c.Field);
        
        for (const col of planColumns) {
            if (!existingPlanNames.includes(col.name)) {
                await query(`ALTER TABLE AuditPlan ADD COLUMN ${col.name} ${col.type}`);
            }
        }

        return NextResponse.json({ 
            success: true, 
            message: 'Migración completada con éxito. Todas las columnas están sincronizadas.'
        });

    } catch (error: any) {
        console.error('Error en migración:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
