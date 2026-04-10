'use server';

import { getCompanyDataDir } from '@/lib/companyContext';
import { getEmployeesService } from '@/services/employees.service';
import { revalidatePath } from 'next/cache';

export async function getEmployeesAction() {
  const dataDir = await getCompanyDataDir();
  return getEmployeesService(dataDir).findAll();
}

export async function getEmployeeByIdAction(id: string) {
  const dataDir = await getCompanyDataDir();
  return getEmployeesService(dataDir).findOne(id);
}

export async function createEmployeeAction(formData: FormData) {
  const dataDir = await getCompanyDataDir();
  
  const newEmployee = {
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    identification: formData.get('identification') as string,
    phone: formData.get('phone') as string,
    email: formData.get('email') as string,
    address: formData.get('address') as string,
    
    contractType: formData.get('contractType') as string,
    contractNumber: formData.get('contractNumber') as string,
    defaultPositionId: formData.get('defaultPosition') as string, // Note: This might need ID lookup if it's text
    startDate: formData.get('startDate') as string,
    contractEndDate: formData.get('contractEndDate') as string || null,
    isIntegralSalary: formData.get('isIntegralSalary') === 'true' ? 1 : 0,
    salaryAmount: parseFloat(formData.get('salaryAmount') as string) || 0,
    defaultSiteId: formData.get('defaultSite') as string, // Note: This might need ID lookup if it's text
    
    contributorType: formData.get('contributorType') as string,
    contributorSubtype: formData.get('contributorSubtype') as string,
    healthFund: formData.get('healthFund') as string,
    healthFundPercentage: parseFloat(formData.get('healthFundPercentage') as string) || 4,
    pensionFund: formData.get('pensionFund') as string,
    pensionFundPercentage: parseFloat(formData.get('pensionFundPercentage') as string) || 4,
    severanceFund: formData.get('severanceFund') as string,
    compensationFund: formData.get('compensationFund') as string,
    arl: formData.get('arl') as string,
    riskClass: formData.get('riskClass') as string,
    ciiuCode: formData.get('ciiuCode') as string,
    
    isActive: 1
  };

  const result = await getEmployeesService(dataDir).create(newEmployee);
  revalidatePath('/gestion-humana/employees');
  return result;
}

export async function updateEmployeeAction(id: string, formData: FormData) {
  const dataDir = await getCompanyDataDir();
  
  const updatedData = {
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    identification: formData.get('identification') as string,
    phone: formData.get('phone') as string,
    email: formData.get('email') as string,
    address: formData.get('address') as string,
    
    contractType: formData.get('contractType') as string,
    contractNumber: formData.get('contractNumber') as string,
    defaultPositionId: formData.get('defaultPosition') as string,
    startDate: formData.get('startDate') as string,
    contractEndDate: formData.get('contractEndDate') as string || null,
    isIntegralSalary: formData.get('isIntegralSalary') === 'true' ? 1 : 0,
    salaryAmount: parseFloat(formData.get('salaryAmount') as string) || 0,
    defaultSiteId: formData.get('defaultSite') as string,
    
    contributorType: formData.get('contributorType') as string,
    contributorSubtype: formData.get('contributorSubtype') as string,
    healthFund: formData.get('healthFund') as string,
    healthFundPercentage: parseFloat(formData.get('healthFundPercentage') as string) || 4,
    pensionFund: formData.get('pensionFund') as string,
    pensionFundPercentage: parseFloat(formData.get('pensionFundPercentage') as string) || 4,
    severanceFund: formData.get('severanceFund') as string,
    compensationFund: formData.get('compensationFund') as string,
    arl: formData.get('arl') as string,
    riskClass: formData.get('riskClass') as string,
    ciiuCode: formData.get('ciiuCode') as string,
    
    isActive: formData.get('isActive') === 'true' ? 1 : 0,
  };

  const result = await getEmployeesService(dataDir).update(id, updatedData);
  revalidatePath('/gestion-humana/employees');
  revalidatePath(`/gestion-humana/employees/edit/${id}`);
  return result;
}

export async function deleteEmployeeAction(id: string) {
  const dataDir = await getCompanyDataDir();
  await getEmployeesService(dataDir).remove(id);
  revalidatePath('/gestion-humana/employees');
  return true;
}
