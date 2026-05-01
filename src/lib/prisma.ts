import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  console.log('🔌 Initializing native Prisma Client...');
  
  let databaseUrl = process.env.DATABASE_URL || '';
  
  // Ensure we optimize the connection pool natively through the connection string
  // if the parameters are not already present in the environment variable.
  if (databaseUrl && !databaseUrl.includes('connection_limit')) {
    const separator = databaseUrl.includes('?') ? '&' : '?';
    // connection_limit: Max connections in the pool
    // connect_timeout: Max seconds waiting for a NEW connection to the DB
    // pool_timeout: Max seconds waiting to get an existing connection FROM the pool
    databaseUrl += `${separator}connection_limit=50&connect_timeout=30&pool_timeout=30`;
  }

  // Set the modified URL directly in the environment so Prisma picks it up natively
  process.env.DATABASE_URL = databaseUrl;

  return new PrismaClient({ 
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
