import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import * as mariadb from 'mariadb';

const prismaClientSingleton = () => {
  console.log('🔌 Initializing new MariaDB Connection Pool...');
  
  // Use explicit connection object to avoid parsing errors
  const pool = mariadb.createPool({
      host: '160.153.188.144',
      port: 3306,
      user: 'lidustechadmin_lidusadmin',
      password: 'LidusTech2026',
      database: 'lidustechadmin_lidusdb',
      connectTimeout: 20000,      // Increased to 20s
      acquireTimeout: 30000,      // Increased to 30s
      connectionLimit: 50,        // Increased to 50 for production load
      idleTimeout: 30000,         // Close idle connections after 30s
      minimumIdle: 2,             // Keep at least 2 connections ready
      noDelay: true,              // Performance optimization
      ssl: false
  });

  pool.on('error', (err) => {
    console.error('❌ MariaDB Pool Error:', err);
  });

  const adapter = new PrismaMariaDb(pool);
  return new PrismaClient({ 
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
  });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

// In production, we want to be absolutely sure we use the global singleton
// to avoid "too many connections" or pool timeouts due to multiple pools.
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
} else {
  // Even in production, sometimes hot-swapping or multiple entries can happen
  // saving to globalThis is safer for long-running processes.
  globalThis.prismaGlobal = prisma;
}
