export const SMLMV_2026 = 1300000;
export const AUX_TRANSPORTE_2026 = 162000;

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
    // El estándar diario ahora se deriva de las horas semanales
    const standardDailyHours = weeklyHours / 6;

    const monthlyHours = (weeklyHours / 6) * 30;
    const hourlyRate = salary / monthlyHours;

    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);

    let startTotalMins = startH * 60 + startM;
    let endTotalMins = endH * 60 + endM;

    if (endTotalMins <= startTotalMins) {
        endTotalMins += 24 * 60;
    }

    let totalMins = endTotalMins - startTotalMins - breakMinutes;
    if (totalMins < 0) totalMins = 0;

    const breakStartMin = startTotalMins + Math.floor((endTotalMins - startTotalMins - breakMinutes) / 2);
    const breakEndMin = breakStartMin + breakMinutes;

    let ordDayMins = 0;
    let ordNightMins = 0;
    let extDayMins = 0;
    let extNightMins = 0;

    let workedMinsCounter = 0;

    for (let m = startTotalMins; m < endTotalMins; m++) {
        if (m >= breakStartMin && m < breakEndMin) {
            continue;
        }

        const currentHourOfDay = Math.floor(m / 60) % 24;
        // NUEVA LEY 2101 Y REFORMA: Jornada nocturna inicia a las 19:00 (7 PM) y va hasta las 06:00 AM
        const isNight = currentHourOfDay >= 19 || currentHourOfDay < 6;
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

    // Multiplicadores según Ley Colombiana (+25%, +75%, +35%, etc.)
    const mults = {
        ordinaryDay: isSundayOrHoliday ? 1.75 : 1.0,
        ordinaryNight: isSundayOrHoliday ? 2.10 : 1.35, 
        extraDay: isSundayOrHoliday ? 2.00 : 1.25,
        extraNight: isSundayOrHoliday ? 2.50 : 1.75,
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

// Lógica Decreto 2616 (Trabajadores por Días)
export function calculateDecreto2616(diasTrabajados: number, smlmv: number = SMLMV_2026) {
    let proporcion = 0;
    if (diasTrabajados >= 1 && diasTrabajados <= 7) proporcion = 0.25;
    else if (diasTrabajados >= 8 && diasTrabajados <= 14) proporcion = 0.50;
    else if (diasTrabajados >= 15 && diasTrabajados <= 21) proporcion = 0.75;
    else if (diasTrabajados > 21) proporcion = 1.0;

    const ibc = smlmv * proporcion;
    
    return {
        proporcion,
        ibc,
        // Pension y Caja se calculan sobre la fracción del SMLMV
        pensionAporteTotal: ibc * 0.16,
        pensionDeduccionEmpleado: ibc * 0.04, // Este 4% se descuenta al trabajador
        pensionAporteEmpleador: ibc * 0.12,
        cajaCompensacion: ibc * 0.04,
        arl: ibc * 0.00522, // Riesgo I (Servicio Doméstico)
        
        // La salud en por días (Decreto 2616) asume que la persona está en SISBEN o cotiza salud por otro lado.
        // Si cotiza salud, la base mínima legal SIEMPRE es 1 SMLMV completo (no se puede fraccionar).
        saludAporteTotalCompleto: smlmv * 0.125,
        saludDeduccionEmpleadoCompleto: smlmv * 0.04,
    };
}

// Descanso Dominical Proporcional (Para domésticas por días)
export function calculateDescansoDominical(valorDia: number, diasTrabajadosMes: number) {
    // Si trabaja por días, el proporcional es (valorDia / 6) por cada día laborado.
    return (valorDia / 6) * diasTrabajadosMes;
}

// Provisiones y Liquidación de Prestaciones
export function calculatePrestaciones(salarioBase: number, auxTransporte: number, diasLiquidar: number) {
    const baseLiquidacion = salarioBase + auxTransporte;
    
    const prima = (baseLiquidacion * diasLiquidar) / 360;
    const cesantias = (baseLiquidacion * diasLiquidar) / 360;
    const interesesCesantias = (cesantias * diasLiquidar * 0.12) / 360;
    
    // Vacaciones NO incluyen auxilio de transporte en su base y se liquidan sobre 720 días
    const vacaciones = (salarioBase * diasLiquidar) / 720;

    return {
        baseLiquidacion,
        baseVacaciones: salarioBase,
        prima,
        cesantias,
        interesesCesantias,
        vacaciones,
        total: prima + cesantias + interesesCesantias + vacaciones
    };
}

export function calculateLiquidacionContrato(
    salarioBase: number, 
    auxTransporte: number, 
    fechaInicio: Date, 
    fechaFin: Date,
    diasPendientesVacaciones: number = 0,
    incluyeIndemnizacion: boolean = false
) {
    const msDiff = fechaFin.getTime() - fechaInicio.getTime();
    const diasTotales = Math.ceil(msDiff / (1000 * 60 * 60 * 24)) + 1;
    
    // Suponiendo que se liquidan los días trabajados en el último periodo (año/semestre)
    // Para simplificar, calculamos sobre los días totales si no se tiene registro de última liquidación
    const prest = calculatePrestaciones(salarioBase, auxTransporte, diasTotales);
    
    let indemnizacion = 0;
    if (incluyeIndemnizacion) {
        // Regla básica: 30 días por el primer año, 20 por los siguientes (simplificado)
        indemnizacion = diasTotales <= 360 ? salarioBase : salarioBase + (salarioBase * ((diasTotales - 360) / 360) * (20/30));
    }

    return {
        diasTotales,
        prima: prest.prima,
        cesantias: prest.cesantias,
        interesesCesantias: prest.interesesCesantias,
        vacaciones: (salarioBase * diasPendientesVacaciones) / 30, // Pago de vacaciones pendientes
        indemnizacion,
        total: prest.prima + prest.cesantias + prest.interesesCesantias + ((salarioBase * diasPendientesVacaciones) / 30) + indemnizacion
    };
}
