const mysql = require('mysql2/promise');

async function check() {
    try {
        const pool = mysql.createPool(process.env.DATABASE_URL);
        const [rows] = await pool.query('DESCRIBE Audit');
        console.log(rows);
        process.exit(0);
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
}
check();