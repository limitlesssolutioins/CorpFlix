const mysql = require('mysql2/promise');

async function test() {
    try {
        const pool = mysql.createPool(process.env.DATABASE_URL);
        const [rows] = await pool.query('SELECT COUNT(*) as count FROM AuditRequirement');
        console.log("Requirements count:", rows[0].count);
        
        const [rows2] = await pool.query('SELECT COUNT(*) as count FROM AuditStandard');
        console.log("Standards count:", rows2[0].count);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
test();