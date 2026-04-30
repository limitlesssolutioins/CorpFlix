import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import * as mariadb from 'mariadb';

const prismaClientSingleton = () => {
  // Use explicit connection object to avoid parsing errors
  const pool = mariadb.createPool({
      host: '160.153.188.144',
      port: 3306,
      user: 'lidustechadmin_lidusadmin',
      password: 'LidusTech2026',
      database: 'lidustechadmin_lidusdb',
      connectTimeout: 10000,
      ssl: false
  });
  const adapter = new PrismaMariaDb(pool);
  return new PrismaClient({ adapter });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
