const mysql = require('mysql2/promise');
async function run() {
    const pool = mysql.createPool(process.env.DATABASE_URL);
    const [rows] = await pool.query('SELECT * FROM AuditStandard');
    console.log(rows);
    process.exit(0);
}
run();
