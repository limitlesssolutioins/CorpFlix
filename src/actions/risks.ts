'use server';

import { getCompanyDataDir } from '@/lib/companyContext';
import { getManagementService } from '@/services/management.service';

export async function getRisksAction() {
  try {
    const dataDir = await getCompanyDataDir();
    const risks = getManagementService(dataDir).getRisks();
    return { success: true, data: risks };
  } catch (error) {
    console.error('Error fetching risks:', error);
    return { success: false, error: 'Failed to fetch risks' };
  }
}

export async function getRiskCatalogsAction() {
  try {
    const dataDir = await getCompanyDataDir();
    const catalogs = getManagementService(dataDir).getRiskCatalogs();
    return { success: true, data: catalogs };
  } catch (error) {
    console.error('Error fetching catalogs:', error);
    return { success: false, error: 'Failed to fetch catalogs' };
  }
}

export async function saveRisksAction(risks: any[]) {
  try {
    const dataDir = await getCompanyDataDir();
    getManagementService(dataDir).updateRisks(risks);
    return { success: true };
  } catch (error) {
    console.error('Error saving risks:', error);
    return { success: false, error: 'Failed to save risks' };
  }
}
