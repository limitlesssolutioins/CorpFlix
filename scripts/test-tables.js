const mysql = require('mysql2/promise');

async function test() {
    try {
        const pool = mysql.createPool(process.env.DATABASE_URL);
        const [rows] = await pool.query('SHOW TABLES');
        console.log(rows.map(r => Object.values(r)[0]));
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
test();