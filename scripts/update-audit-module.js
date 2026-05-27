const mysql = require('mysql2/promise');

async function migrate() {
    try {
        console.log('🚀 Iniciando migración del módulo de auditoría...');
        const pool = mysql.createPool(process.env.DATABASE_URL);

        // Actualizar AuditProgram
        console.log('Updating AuditProgram table...');
        await pool.query(`
            ALTER TABLE AuditProgram 
            ADD COLUMN frequency VARCHAR(50) DEFAULT 'Anual',
            ADD COLUMN audit_type VARCHAR(255),
            ADD COLUMN responsible VARCHAR(255),
            ADD COLUMN risks TEXT,
            ADD COLUMN duration VARCHAR(255);
        `).catch(err => console.log('AuditProgram columns might already exist or error:', err.message));

        // Actualizar AuditPlan
        console.log('Updating AuditPlan table...');
        await pool.query(`
            ALTER TABLE AuditPlan 
            ADD COLUMN objective TEXT,
            ADD COLUMN scope TEXT,
            ADD COLUMN methods TEXT,
            ADD COLUMN resources TEXT,
            ADD COLUMN risks TEXT;
        `).catch(err => console.log('AuditPlan columns might already exist or error:', err.message));

        // Actualizar AuditPlanActivity
        console.log('Updating AuditPlanActivity table...');
        await pool.query(`
            ALTER TABLE AuditPlanActivity 
            ADD COLUMN auditee VARCHAR(255),
            ADD COLUMN observations TEXT;
        `).catch(err => console.log('AuditPlanActivity columns might already exist or error:', err.message));

        // Crear AuditReport
        console.log('Creating AuditReport table...');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS AuditReport (
                id INT AUTO_INCREMENT PRIMARY KEY,
                audit_id VARCHAR(191) NOT NULL,
                company_id VARCHAR(191) NOT NULL,
                suitability TEXT,
                effectiveness TEXT,
                convenience TEXT,
                risks TEXT,
                summary TEXT,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                UNIQUE KEY unique_audit (audit_id)
            )
        `);

        console.log('✅ Migración completada con éxito.');
        process.exit(0);
    } catch (e) {
        console.error('❌ Error en la migración:', e);
        process.exit(1);
    }
}
migrate();