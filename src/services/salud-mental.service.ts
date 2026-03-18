import fs from 'fs';
import path from 'path';

export interface SaludMentalRespuesta {
    id: string;
    empleadoId: string;
    empleadoNombre: string;
    fecha: string;
    formulario: 'intralaboral' | 'extralaboral' | 'estres';
    respuestas: Record<string, number>;
    puntajeTotal: number;
    nivelRiesgo: 'Bajo' | 'Medio' | 'Alto' | 'Muy Alto';
}

const DEFAULT_DATA = {
    respuestas: [] as SaludMentalRespuesta[]
};

export class SaludMentalService {
    private dataPath: string;

    constructor(dataDir: string) {
        this.dataPath = path.join(dataDir, 'salud-mental.json');
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

    getRespuestas() {
        return this.getData().respuestas || [];
    }

    guardarRespuesta(respuesta: Omit<SaludMentalRespuesta, 'id'>) {
        const data = this.getData();
        const nuevaRespuesta = {
            ...respuesta,
            id: `SM-${Date.now()}`
        };
        data.respuestas.push(nuevaRespuesta);
        this.saveData(data);
        return nuevaRespuesta;
    }
}

const instances = new Map<string, SaludMentalService>();

export function getSaludMentalService(dataDir: string): SaludMentalService {
    if (!instances.has(dataDir)) {
        instances.set(dataDir, new SaludMentalService(dataDir));
    }
    return instances.get(dataDir)!;
}
