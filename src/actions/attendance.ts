'use server';

import { getCompanyDataDir } from '@/lib/companyContext';
import { getAttendanceService } from '@/services/attendance.service';
import { revalidatePath } from 'next/cache';

export async function getEmployeeAttendanceLogsAction(employeeId: string) {
    const dataDir = await getCompanyDataDir();
    return getAttendanceService(dataDir).getLogs(employeeId);
}

export async function getActiveAttendanceLogAction(employeeId: string) {
    const dataDir = await getCompanyDataDir();
    return getAttendanceService(dataDir).getActive(employeeId);
}

export async function clockInAction(employeeId: string, latitude?: number, longitude?: number, method: string = 'MANUAL', notes?: string) {
    const dataDir = await getCompanyDataDir();
    const result = await getAttendanceService(dataDir).clockIn(employeeId);
    revalidatePath(`/gestion-humana/employees/${employeeId}`);
    return result;
}

export async function clockOutAction(employeeId: string, logId: string, latitude?: number, longitude?: number, notes?: string) {
    const dataDir = await getCompanyDataDir();
    const result = await getAttendanceService(dataDir).clockOut(logId);
    revalidatePath(`/gestion-humana/employees/${employeeId}`);
    return result;
}
