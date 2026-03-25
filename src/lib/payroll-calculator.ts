export interface ShiftCalculationInput {
  salary: number;
  weeklyHours: number; // 46, 44 (Actual), 42 (Julio 2026)
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  breakMinutes: number;
  isSundayOrHoliday: boolean;
}

export interface ShiftCalculationResult {
  hourlyRate: number;
  totalHours: number;
  breakdown: {
    ordinaryDay: { hours: number; amount: number; multiplier: number; label: string };
    ordinaryNight: { hours: number; amount: number; multiplier: number; label: string };
    extraDay: { hours: number; amount: number; multiplier: number; label: string };
    extraNight: { hours: number; amount: number; multiplier: number; label: string };
  };
  totalAmount: number;
}

export function calculateShiftColombian({
  salary,
  weeklyHours,
  startTime,
  endTime,
  breakMinutes,
  isSundayOrHoliday,
}: ShiftCalculationInput): ShiftCalculationResult {
  // Límite legal diario antes de horas extras (generalmente 8h, aunque depende del pacto)
  const standardDailyHours = 8;
  
  // Cálculo del valor de la hora ordinaria según la jornada semanal
  const monthlyHours = (weeklyHours / 6) * 30;
  const hourlyRate = salary / monthlyHours;

  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);

  let startTotalMins = startH * 60 + startM;
  let endTotalMins = endH * 60 + endM;

  // Si la hora de fin es menor a la de inicio, el turno cruzó la medianoche
  if (endTotalMins <= startTotalMins) {
    endTotalMins += 24 * 60;
  }

  let totalMins = endTotalMins - startTotalMins - breakMinutes;
  if (totalMins < 0) totalMins = 0;

  // Asumimos que el descanso se toma a la mitad del turno para el cálculo exacto de tiempos
  const breakStartMin = startTotalMins + Math.floor((endTotalMins - startTotalMins - breakMinutes) / 2);
  const breakEndMin = breakStartMin + breakMinutes;

  let ordDayMins = 0;
  let ordNightMins = 0;
  let extDayMins = 0;
  let extNightMins = 0;

  let workedMinsCounter = 0;

  // Simulamos el turno minuto a minuto para detectar con precisión recargos y extras
  for (let m = startTotalMins; m < endTotalMins; m++) {
    if (m >= breakStartMin && m < breakEndMin) {
      continue; // Minuto de descanso, no se contabiliza
    }

    const currentHourOfDay = Math.floor(m / 60) % 24;
    // En Colombia la jornada nocturna es de 9:00 PM (21:00) a 6:00 AM (06:00)
    const isNight = currentHourOfDay >= 21 || currentHourOfDay < 6;
    const isExtra = workedMinsCounter >= standardDailyHours * 60;

    if (isExtra) {
      if (isNight) extNightMins++;
      else extDayMins++;
    } else {
      if (isNight) ordNightMins++;
      else ordDayMins++;
    }

    workedMinsCounter++;
  }

  const hours = {
    ordinaryDay: ordDayMins / 60,
    ordinaryNight: ordNightMins / 60,
    extraDay: extDayMins / 60,
    extraNight: extNightMins / 60,
  };

  // Multiplicadores según Ley Colombiana
  const mults = {
    ordinaryDay: isSundayOrHoliday ? 1.75 : 1.0,
    ordinaryNight: isSundayOrHoliday ? 2.1 : 1.35, // 1 + 0.35 (Nocturno) + 0.75 (Dominical)
    extraDay: isSundayOrHoliday ? 2.0 : 1.25,
    extraNight: isSundayOrHoliday ? 2.5 : 1.75,
  };

  const breakdown = {
    ordinaryDay: {
      hours: hours.ordinaryDay,
      multiplier: mults.ordinaryDay,
      amount: hours.ordinaryDay * hourlyRate * mults.ordinaryDay,
      label: isSundayOrHoliday ? 'Ordinaria Dominical/Festiva' : 'Ordinaria Diurna',
    },
    ordinaryNight: {
      hours: hours.ordinaryNight,
      multiplier: mults.ordinaryNight,
      amount: hours.ordinaryNight * hourlyRate * mults.ordinaryNight,
      label: isSundayOrHoliday ? 'Ordinaria Nocturna Dominical' : 'Recargo Nocturno',
    },
    extraDay: {
      hours: hours.extraDay,
      multiplier: mults.extraDay,
      amount: hours.extraDay * hourlyRate * mults.extraDay,
      label: isSundayOrHoliday ? 'Extra Diurna Dominical' : 'Hora Extra Diurna',
    },
    extraNight: {
      hours: hours.extraNight,
      multiplier: mults.extraNight,
      amount: hours.extraNight * hourlyRate * mults.extraNight,
      label: isSundayOrHoliday ? 'Extra Nocturna Dominical' : 'Hora Extra Nocturna',
    },
  };

  const totalAmount =
    breakdown.ordinaryDay.amount +
    breakdown.ordinaryNight.amount +
    breakdown.extraDay.amount +
    breakdown.extraNight.amount;

  return {
    hourlyRate,
    totalHours: workedMinsCounter / 60,
    breakdown,
    totalAmount,
  };
}
