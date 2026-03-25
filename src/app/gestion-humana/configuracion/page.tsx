'use client';

import { useState, useEffect } from 'react';
import { Settings2, Plus, Trash2, Save, Clock, Briefcase, Info, Building, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

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
    company: {
        name: string;
        nit: string;
        logoUrl: string;
    };
    cargos: Cargo[];
    turnosEstandar: TurnoEstandar[];
}

export default function ConfiguracionRRHHPage() {
    const [config, setConfig] = useState<HRConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/gestion/payroll-config');
            const data = await response.json();
            setConfig(data);
        } catch (err) {
            toast.error('Error al cargar configuración');
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
            if (response.ok) toast.success('Configuración guardada correctamente');
        } catch (err) {
            toast.error('Error al guardar');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <div className="p-12 text-center animate-pulse text-slate-500 font-bold italic">Sincronizando parámetros...</div>;
    if (!config) return null;

    return (
        <div className="max-w-6xl mx-auto pb-20 space-y-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                        <Settings2 className="text-blue-600" size={32} />
                        Parámetros de RRHH
                    </h3>
                    <p className="text-slate-500 font-medium mt-1">Personaliza la identidad de tus volantes y estandariza la operación.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all font-black shadow-xl shadow-blue-600/20 active:scale-95"
                >
                    <Save size={20} />
                    {isSaving ? 'GUARDANDO...' : 'GUARDAR TODO'}
                </button>
            </div>

            {/* SECCIÓN 1: IDENTIDAD (MARCA BLANCA) */}
            <section className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center"><Building size={24}/></div>
                    <div>
                        <h4 className="font-black text-slate-900 text-xl uppercase tracking-tighter">Identidad de la Empresa</h4>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Estos datos aparecerán en todos los PDF y Volantes.</p>
                    </div>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Nombre Comercial / Razón Social</label>
                            <input 
                                type="text" 
                                value={config.company?.name} 
                                onChange={(e) => setConfig({...config, company: {...config.company, name: e.target.value}})}
                                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none font-bold text-slate-900 transition-all text-lg"
                                placeholder="Ej: Hogar Familia Martinez"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">NIT / Documento Identidad</label>
                            <input 
                                type="text" 
                                value={config.company?.nit} 
                                onChange={(e) => setConfig({...config, company: {...config.company, nit: e.target.value}})}
                                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none font-bold text-slate-900 transition-all"
                                placeholder="900.000.000-1"
                            />
                        </div>
                    </div>
                    <div className="bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-6 text-center group cursor-pointer hover:bg-slate-100 transition-colors">
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-300 mb-3 group-hover:scale-110 transition-transform"><ImageIcon size={32}/></div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Logo de Empresa<br/><span className="text-[10px] font-medium">(Próximamente)</span></p>
                    </div>
                </div>
            </section>

            {/* SECCIÓN 2: CARGOS */}
            <section className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center"><Briefcase size={24}/></div>
                        <div>
                            <h4 className="font-black text-slate-900 text-xl uppercase tracking-tighter">Catálogo de Cargos</h4>
                            <p className="text-xs text-slate-500 font-bold">Salarios y riesgos ARL por defecto.</p>
                        </div>
                    </div>
                    <button onClick={() => setConfig({...config, cargos: [...config.cargos, {id: Date.now().toString(), nombre: 'Nuevo Cargo', salarioBase: 1300000, riesgoArl: 1}]})} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black flex items-center gap-2 hover:indigo-700 transition-all"><Plus size={16}/> AGREGAR</button>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {config.cargos.map((cargo, idx) => (
                        <div key={cargo.id} className="p-6 bg-slate-50 rounded-[2rem] border-2 border-slate-100 relative group">
                            <button onClick={() => setConfig({...config, cargos: config.cargos.filter((_, i) => i !== idx)})} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={18}/></button>
                            <div className="space-y-4">
                                <input type="text" value={cargo.nombre} onChange={(e) => { const c = [...config.cargos]; c[idx].nombre = e.target.value; setConfig({...config, cargos: c}); }} className="w-full bg-transparent border-b-2 border-slate-200 focus:border-indigo-500 outline-none font-black text-slate-900 pb-1" />
                                <div className="grid grid-cols-2 gap-3">
                                    <div><label className="text-[9px] font-black text-slate-400 uppercase">Salario</label><input type="number" value={cargo.salarioBase} onChange={(e) => { const c = [...config.cargos]; c[idx].salarioBase = Number(e.target.value); setConfig({...config, cargos: c}); }} className="w-full bg-white px-2 py-1 rounded-lg border border-slate-200 font-bold text-sm" /></div>
                                    <div><label className="text-[9px] font-black text-slate-400 uppercase">Riesgo ARL</label><select value={cargo.riesgoArl} onChange={(e) => { const c = [...config.cargos]; c[idx].riesgoArl = Number(e.target.value); setConfig({...config, cargos: c}); }} className="w-full bg-white px-2 py-1 rounded-lg border border-slate-200 font-bold text-sm"><option value="1">I</option><option value="2">II</option><option value="3">III</option><option value="4">IV</option><option value="5">V</option></select></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* SECCIÓN 3: TURNOS */}
            <section className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center"><Clock size={24}/></div>
                        <div>
                            <h4 className="font-black text-slate-900 text-xl uppercase tracking-tighter">Turnos Operativos</h4>
                            <p className="text-xs text-slate-500 font-bold text-rose-500 italic">Próximamente: Asignación automática por IA.</p>
                        </div>
                    </div>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {config.turnosEstandar.map((turno) => (
                        <div key={turno.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                            <p className="font-black text-slate-800 text-sm">{turno.nombre}</p>
                            <p className="text-xs text-slate-500 font-bold">{turno.horaInicio} - {turno.horaFin}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}