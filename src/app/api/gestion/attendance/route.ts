import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

const attendancePath = path.join(process.cwd(), 'src/data/attendance.json');

interface AttendanceRecord {
  id: string;
  employeeId: string;
  shiftId?: string;
  checkIn: string;
  checkOut?: string;
  notes?: string;
  createdAt: string;
}

export async function GET() {
  try {
    const fileContent = await fs.readFile(attendancePath, 'utf8');
    const attendance = JSON.parse(fileContent);
    return NextResponse.json(attendance);
  } catch (error) {
    console.error('Error reading attendance records:', error);
    return NextResponse.json({ message: 'Error reading attendance records' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { employeeId, shiftId, checkIn, checkOut, notes } = await req.json();

    if (!employeeId || !checkIn) {
      return NextResponse.json({ message: 'Employee ID and Check-in time are required' }, { status: 400 });
    }

    const newRecord: AttendanceRecord = {
      id: uuidv4(),
      employeeId,
      shiftId,
      checkIn,
      checkOut,
      notes,
      createdAt: new Date().toISOString(),
    };

    const fileContent = await fs.readFile(attendancePath, 'utf8');
    const attendance: AttendanceRecord[] = JSON.parse(fileContent);
    attendance.push(newRecord);

    await fs.writeFile(attendancePath, JSON.stringify(attendance, null, 2), 'utf8');
    return NextResponse.json({ message: 'Attendance recorded successfully', record: newRecord });
  } catch (error) {
    console.error('Error writing attendance record:', error);
    return NextResponse.json({ message: 'Error writing attendance record' }, { status: 500 });
  }
}
