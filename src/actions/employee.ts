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
    documentType: formData.get('documentType') as string || 'CC',
    documentExpeditionCity: formData.get('documentExpeditionCity') as string,
    birthDate: formData.get('birthDate') as string,
    gender: formData.get('gender') as string,
    bloodType: formData.get('bloodType') as string,
    phone: formData.get('phone') as string,
    email: formData.get('email') as string,
    address: formData.get('address') as string,
    city: formData.get('city') as string,
    
    bankName: formData.get('bankName') as string,
    bankAccountType: formData.get('bankAccountType') as string,
    bankAccountNumber: formData.get('bankAccountNumber') as string,
    emergencyContactName: formData.get('emergencyContactName') as string,
    emergencyContactPhone: formData.get('emergencyContactPhone') as string,

    contractType: formData.get('contractType') as string,
    contractNumber: formData.get('contractNumber') as string,
    defaultPositionId: formData.get('defaultPosition') as string, 
    startDate: formData.get('startDate') as string,
    contractEndDate: formData.get('contractEndDate') as string || null,
    isIntegralSalary: formData.get('isIntegralSalary') === 'true' ? 1 : 0,
    salaryAmount: parseFloat(formData.get('salaryAmount') as string) || 0,
    salaryScheme: formData.get('salaryScheme') as string || 'FIJO',
    payrollGroup: formData.get('payrollGroup') as string,
    costCenter: formData.get('costCenter') as string,
    defaultSiteId: formData.get('defaultSite') as string,
    
    contributorType: formData.get('contributorType') as string || '01',
    contributorSubtype: formData.get('contributorSubtype') as string || '00',
    healthFund: formData.get('healthFund') as string,
    healthFundPercentage: parseFloat(formData.get('healthFundPercentage') as string) || 4,
    pensionFund: formData.get('pensionFund') as string,
    pensionFundPercentage: parseFloat(formData.get('pensionFundPercentage') as string) || 4,
    severanceFund: formData.get('severanceFund') as string,
    compensationFund: formData.get('compensationFund') as string,
    arl: formData.get('arl') as string,
    riskClass: formData.get('riskClass') as string || 'I',
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
    documentType: formData.get('documentType') as string,
    documentExpeditionCity: formData.get('documentExpeditionCity') as string,
    birthDate: formData.get('birthDate') as string,
    gender: formData.get('gender') as string,
    bloodType: formData.get('bloodType') as string,
    phone: formData.get('phone') as string,
    email: formData.get('email') as string,
    address: formData.get('address') as string,
    city: formData.get('city') as string,

    bankName: formData.get('bankName') as string,
    bankAccountType: formData.get('bankAccountType') as string,
    bankAccountNumber: formData.get('bankAccountNumber') as string,
    emergencyContactName: formData.get('emergencyContactName') as string,
    emergencyContactPhone: formData.get('emergencyContactPhone') as string,
    
    contractType: formData.get('contractType') as string,
    contractNumber: formData.get('contractNumber') as string,
    defaultPositionId: formData.get('defaultPosition') as string,
    startDate: formData.get('startDate') as string,
    contractEndDate: formData.get('contractEndDate') as string || null,
    isIntegralSalary: formData.get('isIntegralSalary') === 'true' ? 1 : 0,
    salaryAmount: parseFloat(formData.get('salaryAmount') as string) || 0,
    salaryScheme: formData.get('salaryScheme') as string,
    payrollGroup: formData.get('payrollGroup') as string,
    costCenter: formData.get('costCenter') as string,
    defaultSiteId: formData.get('defaultSite') as string,
    
    contributorType: formData.get('contributorType') as string,
    contributorSubtype: formData.get('contributorSubtype') as string,
    healthFund: formData.get('healthFund') as string,
    healthFundPercentage: parseFloat(formData.get('healthFundPercentage') as string),
    pensionFund: formData.get('pensionFund') as string,
    pensionFundPercentage: parseFloat(formData.get('pensionFundPercentage') as string),
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

export async function getEmployeeSalaryHistoryAction(employeeId: string) {
  const dataDir = await getCompanyDataDir();
  return getEmployeesService(dataDir).getSalaryHistory(employeeId);
}

export async function getEmployeePositionHistoryAction(employeeId: string) {
  const dataDir = await getCompanyDataDir();
  return getEmployeesService(dataDir).getPositionHistory(employeeId);
}

export async function getEmployeeDisciplinaryRecordsAction(employeeId: string) {
  const dataDir = await getCompanyDataDir();
  return getEmployeesService(dataDir).getDisciplinaryRecords(employeeId);
}

export async function getEmployeePerformanceEvaluationsAction(employeeId: string) {
  const dataDir = await getCompanyDataDir();
  return getEmployeesService(dataDir).getPerformanceEvaluations(employeeId);
}

