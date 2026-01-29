'use server';

import { db, Employee } from '@/lib/json-db';
import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from 'next/cache';

export async function getEmployeesAction(): Promise<Employee[]> {
  return db.employees.getAll();
}

export async function getEmployeeByIdAction(id: string): Promise<Employee | undefined> {
  return db.employees.getById(id);
}

export async function createEmployeeAction(formData: FormData): Promise<Employee> {
  const newEmployee: Employee = {
    id: uuidv4(),
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    identification: formData.get('identification') as string,
    salaryAmount: parseFloat(formData.get('salaryAmount') as string),
    contractType: formData.get('contractType') as string,
    defaultPosition: formData.get('defaultPosition') as string,
    defaultSite: formData.get('defaultSite') as string,
    isActive: true, // Por defecto, el nuevo empleado está activo
  };

  db.employees.create(newEmployee);
  revalidatePath('/gestion-humana/employees'); // Invalida el caché para actualizar la lista
  return newEmployee;
}

export async function updateEmployeeAction(id: string, formData: FormData): Promise<Employee | null> {
  const updatedData: Partial<Employee> = {
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    identification: formData.get('identification') as string,
    salaryAmount: parseFloat(formData.get('salaryAmount') as string),
    contractType: formData.get('contractType') as string,
    defaultPosition: formData.get('defaultPosition') as string,
    defaultSite: formData.get('defaultSite') as string,
    isActive: formData.get('isActive') === 'true',
  };

  const updatedEmployee = db.employees.update(id, updatedData);
  revalidatePath('/gestion-humana/employees');
  revalidatePath(`/gestion-humana/employees/edit/${id}`);
  return updatedEmployee;
}

export async function deleteEmployeeAction(id: string): Promise<boolean> {
  const success = db.employees.delete(id);
  revalidatePath('/gestion-humana/employees');
  return success;
}
