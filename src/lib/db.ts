import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  connectionLimit: 50,
  connectTimeout: 30000,
  waitForConnections: true,
  queueLimit: 0,
});

export async function query<T>(sql: string, params?: any[]): Promise<T> {
  const [results] = await pool.execute(sql, params);
  return results as T;
}

export default pool;
