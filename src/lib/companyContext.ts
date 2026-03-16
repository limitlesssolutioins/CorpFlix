import { cookies } from 'next/headers';
import path from 'path';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'lidus-super-secret-development-key-12345!'
);

export async function getCompanyId(): Promise<string | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value;

  if (!sessionToken) return null;

  try {
    const { payload }: any = await jwtVerify(sessionToken, SECRET_KEY, {
      algorithms: ['HS256'],
    });
    return payload.companyId || null;
  } catch (error) {
    return null;
  }
}

export async function getCompanyDataDir(): Promise<string> {
  const companyId = await getCompanyId();
  if (!companyId) throw new Error('No company selected or unauthorized');
  
  return path.join(process.cwd(), 'src', 'data', 'companies', companyId);
}
