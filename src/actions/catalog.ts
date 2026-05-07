'use server';
import { getCompanyDataDir } from '@/lib/companyContext';
import { getCatalogService } from '@/services/catalog.service';

export async function getSitesAction() {
  const dataDir = await getCompanyDataDir();
  return getCatalogService(dataDir).getSites();
}

export async function getPositionsAction() {
  const dataDir = await getCompanyDataDir();
  return getCatalogService(dataDir).getPositions();
}
