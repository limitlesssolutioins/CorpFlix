import fs from 'fs';
import path from 'path';

const DEFAULT_DATA = {
  planeacion: {},
  procesos: [],
  riesgos: [],
  indicadores: [],
  mejoras: [],
  auditorias: []
};

export class ManagementService {
  private dataPath: string;

  constructor(dataDir: string) {
    this.dataPath = path.join(dataDir, 'gestion.json');
  }

  private getData() {
    try {
      if (!fs.existsSync(this.dataPath)) {
        fs.writeFileSync(this.dataPath, JSON.stringify(DEFAULT_DATA, null, 2));
        return { ...DEFAULT_DATA };
      }
      const fileContent = fs.readFileSync(this.dataPath, 'utf-8');
      return JSON.parse(fileContent);
    } catch (error) {
      return { ...DEFAULT_DATA };
    }
  }

  private saveData(data: any) {
    fs.writeFileSync(this.dataPath, JSON.stringify(data, null, 2));
  }

  // --- PLANEACIÓN ESTRATÉGICA ---
  getStrategicPlan() {
    return this.getData().planeacion;
  }

  updateStrategicPlan(plan: any) {
    const data = this.getData();
    data.planeacion = { ...data.planeacion, ...plan };
    this.saveData(data);
    return data.planeacion;
  }

  // --- PROCESOS ---
  getProcesses() {
    return this.getData().procesos;
  }

  addProcess(process: any) {
    const data = this.getData();
    const newProcess = { ...process, id: process.id || `PROC-${Date.now()}` };
    data.procesos.push(newProcess);
    this.saveData(data);
    return newProcess;
  }

  addProcesses(processes: any[]) {
    const data = this.getData();
    const newProcesses = processes.map((p, index) => ({
      ...p,
      id: p.id || `PROC-${Date.now()}-${index}`
    }));
    data.procesos = [...data.procesos, ...newProcesses];
    this.saveData(data);
    return newProcesses;
  }

  updateProcess(process: any) {
    const data = this.getData();
    const index = data.procesos.findIndex((p: any) => p.id === process.id);
    if (index !== -1) {
      data.procesos[index] = { ...data.procesos[index], ...process };
      this.saveData(data);
      return data.procesos[index];
    }
    return null;
  }

  deleteProcess(id: string) {
    const data = this.getData();
    const initialLength = data.procesos.length;
    data.procesos = data.procesos.filter((p: any) => p.id !== id);

    if (data.procesos.length < initialLength) {
      this.saveData(data);
      return true;
    }
    return false;
  }

  // --- RIESGOS ---
  getRisks() {
    return this.getData().riesgos;
  }

  addRisk(risk: any) {
    const data = this.getData();
    const newRisk = { ...risk, id: `R-${Date.now()}` };
    data.riesgos.push(newRisk);
    this.saveData(data);
    return newRisk;
  }

  updateRisks(risks: any[]) {
    const data = this.getData();
    data.riesgos = risks;
    this.saveData(data);
    return risks;
  }

  getRiskCatalogs() {
    return this.getData().catalogos || { calidad: [], sst: [], ambiental: [] };
  }

  // --- INDICADORES ---
  getIndicators() {
    return this.getData().indicadores || [];
  }

  addIndicators(indicators: any[]) {
    const data = this.getData();
    if (!data.indicadores) data.indicadores = [];

    const newItems = indicators.map((ind, idx) => ({
      ...ind,
      id: ind.id || `IND-${Date.now()}-${idx}`,
      datos: ind.datos || []
    }));

    data.indicadores = [...data.indicadores, ...newItems];
    this.saveData(data);
    return newItems;
  }

  updateIndicator(indicator: any) {
    const data = this.getData();
    const index = data.indicadores.findIndex((i: any) => i.id === indicator.id);
    if (index !== -1) {
      data.indicadores[index] = { ...data.indicadores[index], ...indicator };
      this.saveData(data);
      return data.indicadores[index];
    }
    return null;
  }

  deleteIndicator(id: string) {
    const data = this.getData();
    const initialLength = data.indicadores.length;
    data.indicadores = data.indicadores.filter((i: any) => i.id !== id);

    if (data.indicadores.length < initialLength) {
      this.saveData(data);
      return true;
    }
    return false;
  }
}

const instances = new Map<string, ManagementService>();

export function getManagementService(dataDir: string): ManagementService {
  if (!instances.has(dataDir)) {
    instances.set(dataDir, new ManagementService(dataDir));
  }
  return instances.get(dataDir)!;
}
