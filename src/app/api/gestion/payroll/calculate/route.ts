import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import moment from 'moment';
import { getCompanyDataDir } from '@/lib/companyContext';
import { getEmployeesService } from '@/services/employees.service';

interface AttendanceRecord {
  id: string;
  employeeId: string;
  shiftId?: string;
  checkIn: string;
  checkOut?: string;
  notes?: string;
  createdAt: string;
}

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  salaryAmount: number;
  contractType: string;
}

interface ExtraOption {
  id: string;
  name: string;
  factor: number;
}

interface PayrollConfigData {
  extras: ExtraOption[];
  domesticas: any;
  seguridadSocial: any;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const monthParam = searchParams.get('month');
  const yearParam = searchParams.get('year');
  const periodParam = searchParams.get('period'); // '1', '2', 'full'

  if (!monthParam || !yearParam || !periodParam) {
    return NextResponse.json({ message: 'Month, year, and period are required' }, { status: 400 });
  }

  const month = parseInt(monthParam, 10);
  const year = parseInt(yearParam, 10);
  const period = periodParam as '1' | '2' | 'full';

  try {
    const dataDir = await getCompanyDataDir();
    const attendancePath = path.join(dataDir, 'attendance.json');
    const payrollConfigPath = path.join(dataDir, 'gestion-humana.json');

    const [attendanceFile, payrollConfigFile] = await Promise.all([
      fs.readFile(attendancePath, 'utf8').catch(() => '[]'),
      fs.readFile(payrollConfigPath, 'utf8').catch(() => '{"extras":[]}'),
    ]);

    const attendanceRecords: AttendanceRecord[] = JSON.parse(attendanceFile);
    const payrollConfig: PayrollConfigData = JSON.parse(payrollConfigFile);
    const employees: Employee[] = (await getEmployeesService(dataDir).findAll()) as Employee[];

    const report: any[] = [];

    const daysInMonth = moment(`${year}-${month}`, 'YYYY-MM').daysInMonth();
    let startDate: moment.Moment;
    let endDate: moment.Moment;
    let periodLabel: string;

    if (period === '1') {
      startDate = moment(`${year}-${month}-01`, 'YYYY-MM-DD');
      endDate = moment(`${year}-${month}-15`, 'YYYY-MM-DD');
      periodLabel = '1ra Quincena';
    } else if (period === '2') {
      startDate = moment(`${year}-${month}-16`, 'YYYY-MM-DD');
      endDate = moment(`${year}-${month}-${daysInMonth}`, 'YYYY-MM-DD');
      periodLabel = '2da Quincena';
    } else {
      startDate = moment(`${year}-${month}-01`, 'YYYY-MM-DD');
      endDate = moment(`${year}-${month}-${daysInMonth}`, 'YYYY-MM-DD');
      periodLabel = 'Mes Completo';
    }

    for (const employee of employees) {
      let totalHoursWorked = 0;
      let totalExtraHours = 0;
      let totalExtraPay = 0;

      const employeeAttendance = attendanceRecords.filter(
        (rec) =>
          rec.employeeId === employee.id &&
          moment(rec.checkIn).isBetween(startDate, endDate, null, '[]')
      );

      for (const record of employeeAttendance) {
        if (record.checkIn && record.checkOut) {
          const checkInMoment = moment(record.checkIn);
          const checkOutMoment = moment(record.checkOut);
          const duration = moment.duration(checkOutMoment.diff(checkInMoment));
          const hours = duration.asHours();

          // For simplicity, assume anything over 8 hours a day is extra for now
          // This logic will need to be refined for actual legal compliance (diurna, nocturna, festivos, etc.)
          const regularHours = Math.min(hours, 8); // Assuming 8 regular hours per day for simplicity
          const extraHours = hours - regularHours;
          
          totalHoursWorked += regularHours;
          totalExtraHours += Math.max(0, extraHours); // Ensure extra hours are not negative

          // Apply a default extra factor for simplicity for now
          // This should be more complex based on day of week, time of day, etc.
          const extraFactor = payrollConfig.extras.find(e => e.id === 'extra1')?.factor || 1.25;
          totalExtraPay += extraHours * (employee.salaryAmount / (30 * 8)) * extraFactor; // (salary / days_in_month / regular_hours_per_day) * factor
        }
      }

      const baseDailySalary = employee.salaryAmount / 30; // Assuming 30 days for monthly salary
      const daysWorked = employeeAttendance.length > 0 ? totalHoursWorked / 8 : 0; // Simplified days worked
      const basePay = baseDailySalary * daysWorked; 

      // Simplified social security and provisions for now
      const socialSecurityTotal = basePay * 0.08; // Example: 4% health, 4% pension for employee
      const provisionsTotal = basePay * 0.2; // Example: 8.33% cesantias, 8.33% prima, 4.17% vacaciones

      const transportAid = employee.salaryAmount < 2600000 ? 162000 : 0; // Simplified transport aid threshold

      report.push({
        employeeId: employee.id,
        employeeName: `${employee.firstName} ${employee.lastName}`,
        contractType: employee.contractType,
        periodLabel,
        daysWorked,
        basePay,
        surchargeTotal: totalExtraPay,
        transportAid,
        socialSecurity: { total: socialSecurityTotal },
        provisions: { total: provisionsTotal },
        totalPay: basePay + totalExtraPay + transportAid - socialSecurityTotal,
      });
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error('Error calculating payroll:', error);
    return NextResponse.json({ message: 'Error calculating payroll' }, { status: 500 });
  }
}
