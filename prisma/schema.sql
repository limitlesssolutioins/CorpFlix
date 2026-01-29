-- SQLite Schema for Turnos/LIDUS Integration
-- Generated from Prisma schema

-- Sites
CREATE TABLE IF NOT EXISTS "Site" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "address" TEXT
);

-- Positions
CREATE TABLE IF NOT EXISTS "Position" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- Teams
CREATE TABLE IF NOT EXISTS "Team" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- Employees
CREATE TABLE IF NOT EXISTS "Employee" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "identification" TEXT NOT NULL UNIQUE,
    "email" TEXT UNIQUE,
    "phone" TEXT,
    "contractType" TEXT NOT NULL,
    "salaryAmount" DECIMAL NOT NULL,
    "salaryScheme" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "epsEntity" TEXT NOT NULL,
    "arlEntity" TEXT NOT NULL,
    "pensionEntity" TEXT NOT NULL,
    "defaultSiteId" TEXT NOT NULL,
    "defaultPositionId" TEXT NOT NULL,
    "teamId" TEXT,
    "standardStartTime" TEXT,
    "standardEndTime" TEXT,
    "standardStartTime2" TEXT,
    "standardEndTime2" TEXT,
    "workDays" TEXT,
    "isActive" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("defaultSiteId") REFERENCES "Site"("id"),
    FOREIGN KEY ("defaultPositionId") REFERENCES "Position"("id"),
    FOREIGN KEY ("teamId") REFERENCES "Team"("id")
);

-- Shifts
CREATE TABLE IF NOT EXISTS "Shift" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employeeId" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "positionId" TEXT NOT NULL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    "conflictStatus" TEXT NOT NULL DEFAULT 'NONE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("employeeId") REFERENCES "Employee"("id"),
    FOREIGN KEY ("siteId") REFERENCES "Site"("id"),
    FOREIGN KEY ("positionId") REFERENCES "Position"("id")
);

-- Absence Types
CREATE TABLE IF NOT EXISTS "AbsenceType" (
    "code" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "paidBy" TEXT NOT NULL,
    "percentage" DECIMAL NOT NULL,
    "affectsTransportAid" INTEGER NOT NULL
);

-- Absences
CREATE TABLE IF NOT EXISTS "Absence" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employeeId" TEXT NOT NULL,
    "absenceTypeCode" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "diagnosisCode" TEXT,
    "medicalCertificateUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING_APPROVAL',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("employeeId") REFERENCES "Employee"("id"),
    FOREIGN KEY ("absenceTypeCode") REFERENCES "AbsenceType"("code")
);

-- Shift Conflicts
CREATE TABLE IF NOT EXISTS "ShiftConflict" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shiftId" TEXT NOT NULL,
    "absenceId" TEXT NOT NULL,
    "conflictMessage" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("shiftId") REFERENCES "Shift"("id"),
    FOREIGN KEY ("absenceId") REFERENCES "Absence"("id")
);

-- Attendance
CREATE TABLE IF NOT EXISTS "Attendance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employeeId" TEXT NOT NULL,
    "shiftId" TEXT,
    "checkIn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "checkOut" DATETIME,
    "latitude" REAL,
    "longitude" REAL,
    "status" TEXT NOT NULL DEFAULT 'ON_TIME',
    "observations" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("employeeId") REFERENCES "Employee"("id"),
    FOREIGN KEY ("shiftId") REFERENCES "Shift"("id")
);

-- Employee Documents
CREATE TABLE IF NOT EXISTS "EmployeeDocument" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employeeId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "expiryDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("employeeId") REFERENCES "Employee"("id")
);

-- Notification Log
CREATE TABLE IF NOT EXISTS "NotificationLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employeeId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SENT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("employeeId") REFERENCES "Employee"("id")
);

-- Shift Patterns
CREATE TABLE IF NOT EXISTS "ShiftPattern" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sequence" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Audit Log
CREATE TABLE IF NOT EXISTS "AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" TEXT,
    "performedBy" TEXT NOT NULL DEFAULT 'Sistema',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Shift Swap Requests
CREATE TABLE IF NOT EXISTS "ShiftSwapRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "requestDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shiftId" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "reason" TEXT,
    "managerComment" TEXT,
    FOREIGN KEY ("shiftId") REFERENCES "Shift"("id"),
    FOREIGN KEY ("requesterId") REFERENCES "Employee"("id"),
    FOREIGN KEY ("targetId") REFERENCES "Employee"("id")
);

-- System Configuration
CREATE TABLE IF NOT EXISTS "SystemConfiguration" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyName" TEXT NOT NULL DEFAULT 'Nombre de la Empresa',
    "idType" TEXT NOT NULL DEFAULT 'NIT',
    "nit" TEXT,
    "logoUrl" TEXT,
    "address" TEXT,
    "city" TEXT DEFAULT 'Cartagena',
    "taxRegime" TEXT DEFAULT 'Régimen Común',
    "paymentFrequency" TEXT NOT NULL DEFAULT 'MONTHLY',
    "currentYear" INTEGER NOT NULL DEFAULT 2026,
    "smlmv" DECIMAL NOT NULL,
    "transportAid" DECIMAL NOT NULL,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Salary Scales
CREATE TABLE IF NOT EXISTS "SalaryScale" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "amount" DECIMAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Holidays
CREATE TABLE IF NOT EXISTS "Holiday" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL UNIQUE,
    "name" TEXT NOT NULL
);

-- Insert default absence types
INSERT OR IGNORE INTO "AbsenceType" ("code", "name", "paidBy", "percentage", "affectsTransportAid") VALUES
('EG', 'Enfermedad General', 'EPS', 66.67, 1),
('AT', 'Accidente de Trabajo', 'ARL', 100, 0),
('LM', 'Licencia de Maternidad', 'EPS', 100, 0),
('LP', 'Licencia de Paternidad', 'EPS', 100, 0),
('LNR', 'Licencia No Remunerada', 'NINGUNO', 0, 1),
('VAC', 'Vacaciones', 'EMPLEADOR', 100, 0);

-- Insert default system configuration
INSERT OR IGNORE INTO "SystemConfiguration" ("id", "companyName", "city", "currentYear", "smlmv", "transportAid", "paymentFrequency", "taxRegime") VALUES
('default', 'LIDUS', 'Cartagena', 2026, 1423500, 200000, 'MONTHLY', 'Régimen Común');
