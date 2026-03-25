'use client';

import { useState, useEffect } from 'react';
import { Settings2, Plus, Trash2, Save, Clock, Briefcase, Info } from 'lucide-react';

interface TurnoEstandar {
    id: string;
    nombre: string;
    horas: number;
    horaInicio: string;
    horaFin: string;
}

interface Cargo {
    id: string;
    nombre: string;
    salarioBase: number;
    riesgoArl: number;
}

interface HRConfig {
    cargos: Cargo[];
    turnosEstandar: TurnoEstandar[];
    // Se preservan llaves antiguas para no romper, pero no se muestran
    [key: string]: any;
}

export default function ConfiguracionRRHHPage() {
    const [config, setConfig] = useState<HRConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/gestion/payroll-config');
            if (!response.ok) throw new Error('Error de servidor al cargar configuración.');
            const data: HRConfig = await response.json();
            setConfig(data);
        } catch (err: any) {
            setError(err.message || 'Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!config) return;
        try {
            setIsSaving(true);
            const response = await fetch('/api/gestion/payroll-config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config),
            });
            if (!response.ok) throw new Error('Error al guardar.');
            // Aquí podrías mostrar un toast de éxito si usas una librería de notificaciones
        } catch (err: any) {
            alert('Error al guardar: ' + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    // --- Funciones para Cargos ---
    const addCargo = () => {
        if (!config) return;
        const newCargo: Cargo = {
            id: Date.now().toString(),
            nombre: 'Nuevo Cargo',
            salarioBase: 1300000,
            riesgoArl: 1
        };
        setConfig({ ...config, cargos: [...(config.cargos || []), newCargo] });
    };

    const updateCargo = (index: number, field: keyof Cargo, value: string | number) => {
        if (!config) return;
        const newCargos = [...config.cargos];
        newCargos[index] = { ...newCargos[index], [field]: value };
        setConfig({ ...config, cargos: newCargos });
    };

    const removeCargo = (index: number) => {
        if (!config) return;
        const newCargos = config.cargos.filter((_, i) => i !== index);
        setConfig({ ...config, cargos: newCargos });
    };

    // --- Funciones para Turnos ---
    const addTurno = () => {
        if (!config) return;
        const newTurno: TurnoEstandar = {
            id: Date.now().toString(),
            nombre: 'Nuevo Turno',
            horas: 8,
            horaInicio: '08:00',
            horaFin: '17:00'
        };
        setConfig({ ...config, turnosEstandar: [...(config.turnosEstandar || []), newTurno] });
    };

    const updateTurno = (index: number, field: keyof TurnoEstandar, value: string | number) => {
        if (!config) return;
        const newTurnos = [...config.turnosEstandar];
        newTurnos[index] = { ...newTurnos[index], [field]: value };
        setConfig({ ...config, turnosEstandar: newTurnos });
    };

    const removeTurno = (index: number) => {
        if (!config) return;
        const newTurnos = config.turnosEstandar.filter((_, i) => i !== index);
        setConfig({ ...config, turnosEstandar: newTurnos });
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 mt-4">Cargando configuración...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3">
                <Info size={24} />
                <p><strong>Error de Conexión:</strong> {error}</p>
            </div>
        );
    }

    if (!config) return null;

    return (
        <div className="max-w-6xl mx-auto pb-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Settings2 className="text-blue-600" />
                        Configuración de RRHH
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                        Define los parámetros estandarizados para la operación de tu equipo.
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold shadow-sm shadow-blue-600/20 disabled:opacity-70"
                >
                    <Save size={18} />
                    {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>

            <div className="space-y-8">
                {/* Sección de Cargos */}
                <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                <Briefcase size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-lg">Catálogo de Cargos</h4>
                                <p className="text-xs text-slate-500">Define los salarios base y niveles de riesgo por defecto.</p>
                            </div>
                        </div>
                        <button
                            onClick={addCargo}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors"
                        >
                            <Plus size={16} /> Agregar Cargo
                        </button>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {config.cargos?.map((cargo, index) => (
                                <div key={cargo.id} className="group relative bg-white border border-slate-200 hover:border-indigo-300 rounded-xl p-5 shadow-sm transition-all">
                                    <button
                                        onClick={() => removeCargo(index)}
                                        className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                        title="Eliminar cargo"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre del Cargo</label>
                                            <input
                                                type="text"
                                                value={cargo.nombre}
                                                onChange={(e) => updateCargo(index, 'nombre', e.target.value)}
                                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                                placeholder="Ej: Asistente Administrativo"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Salario Base ($)</label>
                                                <input
                                                    type="number"
                                                    value={cargo.salarioBase}
                                                    onChange={(e) => updateCargo(index, 'salarioBase', Number(e.target.value))}
                                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Riesgo ARL</label>
                                                <select
                                                    value={cargo.riesgoArl}
                                                    onChange={(e) => updateCargo(index, 'riesgoArl', Number(e.target.value))}
                                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                                >
                                                    {[1, 2, 3, 4, 5].map((lvl) => (
                                                        <option key={lvl} value={lvl}>Nivel {lvl}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {(!config.cargos || config.cargos.length === 0) && (
                                <div className="col-span-full py-8 text-center border-2 border-dashed border-slate-200 rounded-xl">
                                    <Briefcase size={32} className="mx-auto text-slate-300 mb-2" />
                                    <p className="text-slate-500">No hay cargos definidos. Agrega uno nuevo.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Sección de Turnos */}
                <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                                <Clock size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-lg">Turnos Estándar (Horarios)</h4>
                                <p className="text-xs text-slate-500">Configura plantillas de horarios para asignación rápida.</p>
                            </div>
                        </div>
                        <button
                            onClick={addTurno}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors"
                        >
                            <Plus size={16} /> Agregar Turno
                        </button>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {config.turnosEstandar?.map((turno, index) => (
                                <div key={turno.id} className="group relative bg-white border border-slate-200 hover:border-emerald-300 rounded-xl p-5 shadow-sm transition-all">
                                    <button
                                        onClick={() => removeTurno(index)}
                                        className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                        title="Eliminar turno"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                    
                                    <div className="space-y-4">
                                        <div className="flex justify-between gap-2">
                                            <div className="flex-1">
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Identificador</label>
                                                <input
                                                    type="text"
                                                    value={turno.nombre}
                                                    onChange={(e) => updateTurno(index, 'nombre', e.target.value)}
                                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                                    placeholder="Ej: Turno Operativo"
                                                />
                                            </div>
                                            <div className="w-20">
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Duración</label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        value={turno.horas}
                                                        onChange={(e) => updateTurno(index, 'horas', Number(e.target.value))}
                                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all pr-6"
                                                    />
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">h</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50/50 rounded-lg border border-slate-100">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Hora Inicio</label>
                                                <input
                                                    type="time"
                                                    value={turno.horaInicio}
                                                    onChange={(e) => updateTurno(index, 'horaInicio', e.target.value)}
                                                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-md text-slate-900 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Hora Fin</label>
                                                <input
                                                    type="time"
                                                    value={turno.horaFin}
                                                    onChange={(e) => updateTurno(index, 'horaFin', e.target.value)}
                                                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-md text-slate-900 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {(!config.turnosEstandar || config.turnosEstandar.length === 0) && (
                                <div className="col-span-full py-8 text-center border-2 border-dashed border-slate-200 rounded-xl">
                                    <Clock size={32} className="mx-auto text-slate-300 mb-2" />
                                    <p className="text-slate-500">No hay turnos estandarizados. Agrega uno nuevo.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}