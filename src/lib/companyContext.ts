import { cookies } from 'next/headers';
import path from 'path';

export async function getCompanyDataDir(): Promise<string> {
  const cookieStore = await cookies();
  const companyId = cookieStore.get('lidus_company_id')?.value;
  if (!companyId) throw new Error('No company selected');
  return path.join(process.cwd(), 'src', 'data', 'companies', companyId);
}
