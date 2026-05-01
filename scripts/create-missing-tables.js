const mysql = require('mysql2/promise');

async function migrate() {
    try {
        const pool = mysql.createPool(process.env.DATABASE_URL);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS AuditTeam (
                id INT AUTO_INCREMENT PRIMARY KEY,
                audit_id VARCHAR(191) NOT NULL,
                auditor_id INT NOT NULL,
                role_in_audit VARCHAR(255) DEFAULT 'Auditor'
            )
        `);
        console.log('✅ AuditTeam table created');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS AuditProgram (
                id INT AUTO_INCREMENT PRIMARY KEY,
                standard_id INT,
                year INT NOT NULL,
                objectives TEXT,
                scope TEXT,
                criteria TEXT,
                resources TEXT,
                methodology TEXT,
                status VARCHAR(50) DEFAULT 'DRAFT',
                approved_by VARCHAR(255),
                approved_date DATETIME
            )
        `);
        console.log('✅ AuditProgram table created');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS AuditPlan (
                id INT AUTO_INCREMENT PRIMARY KEY,
                audit_id VARCHAR(191) NOT NULL,
                opening_meeting_datetime DATETIME,
                closing_meeting_datetime DATETIME,
                location VARCHAR(255),
                criteria TEXT,
                documents_to_review TEXT,
                confidentiality TEXT,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ AuditPlan table created');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS AuditPlanActivity (
                id INT AUTO_INCREMENT PRIMARY KEY,
                plan_id INT NOT NULL,
                activity_date DATE,
                start_time VARCHAR(50),
                end_time VARCHAR(50),
                activity VARCHAR(255) NOT NULL,
                process_area VARCHAR(255),
                auditor_ids TEXT,
                documents TEXT,
                sort_order INT DEFAULT 0
            )
        `);
        console.log('✅ AuditPlanActivity table created');

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
migrate();