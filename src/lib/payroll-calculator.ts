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

/**
 * Cálculo de turnos según Ley 2101 de 2021 (Reducción jornada) y Reforma Laboral (Jornada nocturna 7PM)
 */
export function calculateShiftColombian({
    salary,
    weeklyHours,
    startTime,
    endTime,
    breakMinutes,
    isSundayOrHoliday,
}: ShiftCalculationInput): ShiftCalculationResult {
    const standardDailyHours = weeklyHours / 6;
    const monthlyHours = (weeklyHours / 6) * 30;
    const hourlyRate = salary / monthlyHours;

    if (!startTime || !endTime) {
        return {
            hourlyRate: 0,
            totalHours: 0,
            breakdown: {
                ordinaryDay: { hours: 0, amount: 0, multiplier: 1.0, label: 'Ordinaria Diurna' },
                ordinaryNight: { hours: 0, amount: 0, multiplier: 1.35, label: 'Ordinaria Nocturna' },
                extraDay: { hours: 0, amount: 0, multiplier: 1.25, label: 'Extra Diurna' },
                extraNight: { hours: 0, amount: 0, multiplier: 1.75, label: 'Extra Nocturna' },
            },
            totalAmount: 0
        };
    }

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
        if (m >= breakStartMin && m < breakEndMin) continue;

        const currentHourOfDay = Math.floor(m / 60) % 24;
        // Jornada nocturna inicia a las 19:00 (7 PM) según Reforma
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

    return { hourlyRate, totalHours: workedMinsCounter / 60, breakdown, totalAmount };
}

/**
 * Fondo de Solidaridad Pensional (FSP)
 * Se aplica a salarios >= 4 SMLMV
 */
export function calculateFSP(ibc: number, smlmv: number = SMLMV_2026): number {
    const smlmvCount = ibc / smlmv;
    if (smlmvCount < 4) return 0;

    let percentage = 0.01; // Base 1% (Solidaridad)
    
    // Sobretasa de Subsistencia (Escalonada)
    if (smlmvCount >= 4 && smlmvCount < 16) percentage += 0; // Solo el 1% de solidaridad
    else if (smlmvCount >= 16 && smlmvCount <= 17) percentage += 0.002;
    else if (smlmvCount > 17 && smlmvCount <= 18) percentage += 0.004;
    else if (smlmvCount > 18 && smlmvCount <= 19) percentage += 0.006;
    else if (smlmvCount > 19 && smlmvCount <= 20) percentage += 0.008;
    else if (smlmvCount > 20) percentage += 0.01;

    return ibc * percentage;
}

/**
 * Retención en la Fuente (Procedimiento 1 Simplificado)
 * Valores UVT 2026 (Estimado)
 */
export function calculateWithholdingTax(baseGravable: number): number {
    const UVT_2026 = 50000; // Valor aproximado para ejemplo
    const baseUVT = baseGravable / UVT_2026;

    if (baseUVT <= 95) return 0;
    if (baseUVT <= 150) return (baseUVT - 95) * 0.19 * UVT_2026;
    if (baseUVT <= 360) return ((baseUVT - 150) * 0.28 + 10) * UVT_2026;
    if (baseUVT <= 640) return ((baseUVT - 360) * 0.33 + 69) * UVT_2026;
    return ((baseUVT - 640) * 0.35 + 162) * UVT_2026;
}

/**
 * Prestaciones Sociales (Provisiones Mensuales)
 */
export function calculateProvisiones(salarioBase: number, auxTransporte: number) {
    const baseLiquidacion = salarioBase + auxTransporte;
    return {
        prima: baseLiquidacion * 0.0833,
        cesantias: baseLiquidacion * 0.0833,
        interesesCesantias: baseLiquidacion * 0.0833 * 0.12, // 12% anual sobre cesantías
        vacaciones: salarioBase * 0.0417,
        total: baseLiquidacion * 0.2183 // Aproximado
    };
}

/**
 * Seguridad Social y Parafiscales (Aportes Empleador)
 */
export function calculateAportesPatronales(ibc: number, riskClass: string = 'I', exoneradoSenaIcbf: boolean = true) {
    const riskRates: Record<string, number> = {
        'I': 0.00522,
        'II': 0.01044,
        'III': 0.02436,
        'IV': 0.0435,
        'V': 0.0696
    };

    return {
        pension: ibc * 0.12,
        salud: exoneradoSenaIcbf ? 0 : ibc * 0.085,
        arl: ibc * (riskRates[riskClass] || riskRates['I']),
        caja: ibc * 0.04,
        sena: exoneradoSenaIcbf ? 0 : ibc * 0.02,
        icbf: exoneradoSenaIcbf ? 0 : ibc * 0.03
    };
}

export function calculateLiquidacionTotal(salario: number, auxTransporte: number, dias: number) {
    const base = salario + auxTransporte;
    return {
        prima: (base * dias) / 360,
        cesantias: (base * dias) / 360,
        intereses: ((base * dias / 360) * dias * 0.12) / 360,
        vacaciones: (salario * dias) / 720
    };
}

// --- LOGICA PARA TRABAJADORES POR DIAS (DECRETO 2616) ---

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
        pensionAporteTotal: ibc * 0.16,
        pensionDeduccionEmpleado: ibc * 0.04,
        pensionAporteEmpleador: ibc * 0.12,
        cajaCompensacion: ibc * 0.04,
        arl: ibc * 0.00522,
        saludAporteTotalCompleto: smlmv * 0.125,
        saludDeduccionEmpleadoCompleto: smlmv * 0.04,
    };
}

export function calculateDescansoDominical(valorDia: number, diasTrabajadosMes: number) {
    return (valorDia / 6) * diasTrabajadosMes;
}

export function calculatePrestaciones(salarioBase: number, auxTransporte: number, diasLiquidar: number) {
    const baseLiquidacion = salarioBase + auxTransporte;
    const prima = (baseLiquidacion * diasLiquidar) / 360;
    const cesantias = (baseLiquidacion * diasLiquidar) / 360;
    const interesesCesantias = (cesantias * diasLiquidar * 0.12) / 360;
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
    const prest = calculatePrestaciones(salarioBase, auxTransporte, diasTotales);
    
    let indemnizacion = 0;
    if (incluyeIndemnizacion) {
        indemnizacion = diasTotales <= 360 ? salarioBase : salarioBase + (salarioBase * ((diasTotales - 360) / 360) * (20/30));
    }

    return {
        diasTotales,
        prima: prest.prima,
        cesantias: prest.cesantias,
        interesesCesantias: prest.interesesCesantias,
        vacaciones: (salarioBase * diasPendientesVacaciones) / 30,
        indemnizacion,
        total: prest.prima + prest.cesantias + prest.interesesCesantias + ((salarioBase * diasPendientesVacaciones) / 30) + indemnizacion
    };
}
