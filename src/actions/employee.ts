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
    salaryAmount: parseFloat(formData.get('salaryAmount') as string),
    contractType: formData.get('contractType') as string,
    defaultPositionId: formData.get('defaultPosition') as string,
    defaultSiteId: formData.get('defaultSite') as string,
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
    salaryAmount: parseFloat(formData.get('salaryAmount') as string),
    contractType: formData.get('contractType') as string,
    defaultPositionId: formData.get('defaultPosition') as string,
    defaultSiteId: formData.get('defaultSite') as string,
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
