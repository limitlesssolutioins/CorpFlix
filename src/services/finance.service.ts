import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'src/data/finanzas.json');

export interface LaborCostDetails {
  baseSalary: number;
  socialSecurity: number;
  benefits: number;
  totalCost: number;
  hourlyCost: number;
}

export class FinanceService {
  private getData() {
    const fileContent = fs.readFileSync(DATA_PATH, 'utf-8');
    return JSON.parse(fileContent);
  }

  private saveData(data: any) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
  }

  calculateLaborCost(baseSalary: number): LaborCostDetails {
    const { configuracion } = this.getData();
    const { prestaciones_sociales } = configuracion;

    // Calculamos Seguridad Social (Patronal)
    const salud = (baseSalary * prestaciones_sociales.salud_patronal) / 100;
    const pension = (baseSalary * prestaciones_sociales.pension_patronal) / 100;
    const arl = (baseSalary * prestaciones_sociales.arl_base) / 100;
    const caja = (baseSalary * prestaciones_sociales.caja_compensacion) / 100;
    
    const totalSeguridadSocial = salud + pension + arl + caja;

    // Calculamos Prestaciones
    const cesantias = (baseSalary * prestaciones_sociales.cesantias) / 100;
    const intCesantias = (baseSalary * prestaciones_sociales.intereses_cesantias) / 100;
    const prima = (baseSalary * prestaciones_sociales.prima_servicios) / 100;
    const vacaciones = (baseSalary * prestaciones_sociales.vacaciones) / 100;

    const totalPrestaciones = cesantias + intCesantias + prima + vacaciones;

    const totalCost = baseSalary + totalSeguridadSocial + totalPrestaciones;
    
    // Asumiendo 240 horas laborales al mes
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
    
    // Aplicar overheads administrativos
    const overheadAmount = (subtotalDirectCost * configuracion.overheads.gastos_administrativos_fijos) / 100;
    const totalCost = subtotalDirectCost + overheadAmount;
    
    // Precio para obtener el margen deseado: Costo / (1 - Margen)
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

export const financeService = new FinanceService();
