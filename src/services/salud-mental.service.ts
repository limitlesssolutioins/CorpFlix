import fs from 'fs';
import path from 'path';

export interface EvaluacionToken {
    token: string;
    empleadoId: string;
    empleadoNombre: string;
    fechaCreacion: string;
    formulario: 'A' | 'B';
    estado: 'PENDIENTE' | 'COMPLETADO';
}

export interface SaludMentalRespuesta {
    id: string;
    token: string;
    empleadoId: string;
    empleadoNombre: string;
    fecha: string;
    formulario: 'A' | 'B';
    respuestasIntralaboral: Record<string, number>;
    respuestasExtralaboral: Record<string, number>;
    respuestasEstres: Record<string, number>;
    nivelRiesgoIntra: 'Sin Riesgo' | 'Bajo' | 'Medio' | 'Alto' | 'Muy Alto';
    nivelRiesgoExtra: 'Sin Riesgo' | 'Bajo' | 'Medio' | 'Alto' | 'Muy Alto';
    nivelRiesgoEstres: 'Sin Riesgo' | 'Bajo' | 'Medio' | 'Alto' | 'Muy Alto';
    consentimiento: boolean;
}

const DEFAULT_DATA = {
    evaluaciones: [] as EvaluacionToken[],
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

    // --- Evaluaciones (Tokens) ---
    getEvaluaciones() {
        return this.getData().evaluaciones || [];
    }

    getEvaluacion(token: string): EvaluacionToken | undefined {
        return this.getEvaluaciones().find((e: EvaluacionToken) => e.token === token);
    }

    crearEvaluacion(empleadoId: string, empleadoNombre: string, formulario: 'A' | 'B'): EvaluacionToken {
        const data = this.getData();
        const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const nuevaEvaluacion: EvaluacionToken = {
            token,
            empleadoId,
            empleadoNombre,
            fechaCreacion: new Date().toISOString(),
            formulario,
            estado: 'PENDIENTE'
        };
        if (!data.evaluaciones) data.evaluaciones = [];
        data.evaluaciones.push(nuevaEvaluacion);
        this.saveData(data);
        return nuevaEvaluacion;
    }

    marcarEvaluacionCompletada(token: string) {
        const data = this.getData();
        const ev = data.evaluaciones?.find((e: EvaluacionToken) => e.token === token);
        if (ev) {
            ev.estado = 'COMPLETADO';
            this.saveData(data);
        }
    }

    // --- Respuestas ---
    getRespuestas() {
        return this.getData().respuestas || [];
    }

    guardarRespuesta(respuesta: Omit<SaludMentalRespuesta, 'id'>) {
        const data = this.getData();
        const nuevaRespuesta = {
            ...respuesta,
            id: `SM-${Date.now()}`
        };
        if (!data.respuestas) data.respuestas = [];
        data.respuestas.push(nuevaRespuesta);
        this.saveData(data);
        
        // Marcar token como completado
        if (respuesta.token) {
            this.marcarEvaluacionCompletada(respuesta.token);
        }
        
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
