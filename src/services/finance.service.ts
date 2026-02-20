import fs from 'fs';
import path from 'path';

export interface LaborCostDetails {
  baseSalary: number;
  socialSecurity: number;
  benefits: number;
  totalCost: number;
  hourlyCost: number;
}

const DEFAULT_FINANZAS = {
  configuracion: {
    prestaciones_sociales: {
      salud_patronal: 8.5,
      pension_patronal: 12,
      arl_base: 0.522,
      caja_compensacion: 4,
      cesantias: 8.33,
      intereses_cesantias: 1,
      prima_servicios: 8.33,
      vacaciones: 4.17
    },
    overheads: {
      gastos_administrativos_fijos: 15
    }
  },
  pagos: [],
  suscripciones: { estado: 'ACTIVO', fechaFin: null },
  tarjetas: []
};

export class FinanceService {
  private dataPath: string;

  constructor(dataDir: string) {
    this.dataPath = path.join(dataDir, 'finanzas.json');
  }

  private getData() {
    try {
      if (!fs.existsSync(this.dataPath)) {
        fs.writeFileSync(this.dataPath, JSON.stringify(DEFAULT_FINANZAS, null, 2));
        return DEFAULT_FINANZAS;
      }
      const fileContent = fs.readFileSync(this.dataPath, 'utf-8');
      return JSON.parse(fileContent);
    } catch {
      return DEFAULT_FINANZAS;
    }
  }

  private saveData(data: any) {
    fs.writeFileSync(this.dataPath, JSON.stringify(data, null, 2));
  }

  calculateLaborCost(baseSalary: number): LaborCostDetails {
    const { configuracion } = this.getData();
    const { prestaciones_sociales } = configuracion;

    const salud = (baseSalary * prestaciones_sociales.salud_patronal) / 100;
    const pension = (baseSalary * prestaciones_sociales.pension_patronal) / 100;
    const arl = (baseSalary * prestaciones_sociales.arl_base) / 100;
    const caja = (baseSalary * prestaciones_sociales.caja_compensacion) / 100;

    const totalSeguridadSocial = salud + pension + arl + caja;

    const cesantias = (baseSalary * prestaciones_sociales.cesantias) / 100;
    const intCesantias = (baseSalary * prestaciones_sociales.intereses_cesantias) / 100;
    const prima = (baseSalary * prestaciones_sociales.prima_servicios) / 100;
    const vacaciones = (baseSalary * prestaciones_sociales.vacaciones) / 100;

    const totalPrestaciones = cesantias + intCesantias + prima + vacaciones;

    const totalCost = baseSalary + totalSeguridadSocial + totalPrestaciones;
    const hourlyCost = totalCost / 240;

    return {
      baseSalary,
      socialSecurity: totalSeguridadSocial,
      benefits: totalPrestaciones,
      totalCost,
      hourlyCost
    };
  }

  calculateQuotation(params: {
    hours: number,
    baseHourlyCost: number,
    materialCosts: number,
    desiredMargin: number
  }) {
    const { configuracion } = this.getData();

    const directLaborCost = params.hours * params.baseHourlyCost;
    const subtotalDirectCost = directLaborCost + params.materialCosts;

    const overheadAmount = (subtotalDirectCost * configuracion.overheads.gastos_administrativos_fijos) / 100;
    const totalCost = subtotalDirectCost + overheadAmount;

    const marginFactor = (100 - params.desiredMargin) / 100;
    const sellPrice = totalCost / marginFactor;

    const profit = sellPrice - totalCost;

    return {
      directLaborCost,
      materialCosts: params.materialCosts,
      overheadAmount,
      totalCost,
      sellPrice,
      profit,
      marginPercentage: params.desiredMargin
    };
  }

  getConfig() {
    return this.getData().configuracion;
  }

  updateConfig(newConfig: any) {
    const data = this.getData();
    data.configuracion = newConfig;
    this.saveData(data);
    return data.configuracion;
  }
}

const instances = new Map<string, FinanceService>();

export function getFinanceService(dataDir: string): FinanceService {
  if (!instances.has(dataDir)) {
    instances.set(dataDir, new FinanceService(dataDir));
  }
  return instances.get(dataDir)!;
}
