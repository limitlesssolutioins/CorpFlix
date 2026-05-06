import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  connectionLimit: 50,
  connectTimeout: 30000,
  waitForConnections: true,
  queueLimit: 0,
});

export async function query<T>(sql: string, params?: any[]): Promise<T> {
  // Saniitize params globally: mysql2 throws an error if a parameter is explicitly `undefined`.
  // This maps any `undefined` to `null` to ensure smooth inserts/updates across the app.
  const safeParams = params ? params.map(p => p === undefined ? null : p) : undefined;
  const [results] = await pool.execute(sql, safeParams);
  return results as T;
}

export default pool;
