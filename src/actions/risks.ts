'use server';

import { managementService } from '@/services/management.service';

export async function getRisksAction() {
  try {
    const risks = managementService.getRisks();
    return { success: true, data: risks };
  } catch (error) {
    console.error('Error fetching risks:', error);
    return { success: false, error: 'Failed to fetch risks' };
  }
}

export async function getRiskCatalogsAction() {
  try {
    const catalogs = managementService.getRiskCatalogs();
    return { success: true, data: catalogs };
  } catch (error) {
    console.error('Error fetching catalogs:', error);
    return { success: false, error: 'Failed to fetch catalogs' };
  }
}

export async function saveRisksAction(risks: any[]) {
  try {
    managementService.updateRisks(risks);
    return { success: true };
  } catch (error) {
    console.error('Error saving risks:', error);
    return { success: false, error: 'Failed to save risks' };
  }
}
