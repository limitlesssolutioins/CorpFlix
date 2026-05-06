'use client';

import React, { useEffect, useState } from 'react';
import { 
    Clock, MapPin, User, Search, Filter, 
    ArrowRight, CheckCircle2, AlertCircle, Calendar
} from 'lucide-react';
import moment from 'moment';
import 'moment/locale/es';
import { toast } from 'sonner';

import { getEmployeesAction } from '@/actions/employee';
import { clockInAction, clockOutAction, getActiveAttendanceLogAction } from '@/actions/attendance';

moment.locale('es');

export default function AsistenciaPage() {
    const [employees, setEmployees] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeLogs, setActiveLogs] = useState<Map<string, any>>(new Map());

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getEmployeesAction();
            setEmployees(data);
            
            // Check active logs for each employee
            const logsMap = new Map();
            await Promise.all(data.map(async (emp: any) => {
                const log = await getActiveAttendanceLogAction(emp.id);
                if (log) logsMap.set(emp.id, log);
            }));
            setActiveLogs(logsMap);
        } catch (error) {
            toast.error("Error al cargar datos de asistencia");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleQuickClock = async (emp: any) => {
        const active = activeLogs.get(emp.id);
        try {
            if (active) {
                await clockOutAction(emp.id, active.id);
                toast.success(`Salida registrada para ${emp.firstName}`);
            } else {
                await clockInAction(emp.id, undefined, undefined, 'MANUAL', 'Registro rápido desde panel central');
                toast.success(`Entrada registrada para ${emp.firstName}`);
            }
            fetchData();
        } catch (e) {
            toast.error("Error al procesar asistencia");
        }
    };

    const filtered = employees.filter(e => 
        `${e.firstName} ${e.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-20 text-center font-black text-slate-400 animate-pulse">Sincronizando Reloj Biométrico...</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Control de Asistencia</h1>
                    <p className="text-slate-500 font-medium italic">Monitoreo de entradas, salidas y tiempo laborado en tiempo real.</p>
                </div>
                <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
                    <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Hoy</button>
                    <button className="px-4 py-2 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-slate-600 transition-colors">Reportes</button>
                </div>
            </div>

            {/* BARRA DE BÚSQUEDA */}
            <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input 
                    type="text" 
                    placeholder="Buscar colaborador por nombre..." 
                    className="w-full pl-16 pr-6 py-5 bg-white border border-slate-200 rounded-[2rem] shadow-sm focus:ring-4 focus:ring-primary-500/10 outline-none font-bold text-slate-700"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* GRID DE COLABORADORES */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((emp) => {
                    const active = activeLogs.get(emp.id);
                    return (
                        <div key={emp.id} className={`bg-white p-6 rounded-[2.5rem] border-2 transition-all group ${active ? 'border-emerald-100 shadow-emerald-500/10 shadow-xl' : 'border-slate-100 hover:border-slate-200 shadow-sm'}`}>
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${active ? 'bg-emerald-500 text-white animate-pulse' : 'bg-slate-100 text-slate-400'}`}>
                                        {emp.firstName[0]}{emp.lastName[0]}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">{emp.firstName} {emp.lastName}</h4>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{emp.positionName || 'Cargo'}</p>
                                    </div>
                                </div>
                                {active ? (
                                    <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[8px] font-black uppercase tracking-widest">En Turno</span>
                                ) : (
                                    <span className="px-2 py-1 bg-slate-50 text-slate-400 rounded-lg text-[8px] font-black uppercase tracking-widest">Fuera</span>
                                )}
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-bold text-slate-400 uppercase tracking-widest">Última Entrada</span>
                                    <span className="font-black text-slate-700">{active ? moment(active.clockIn).format('HH:mm') : '--:--'}</span>
                                </div>
                                <div className="h-1 bg-slate-50 rounded-full overflow-hidden">
                                    {active && <div className="h-full bg-emerald-500 w-1/2 animate-shimmer"></div>}
                                </div>
                            </div>

                            <button 
                                onClick={() => handleQuickClock(emp)}
                                className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${active ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/20'}`}
                            >
                                <Clock size={16} /> {active ? 'Registrar Salida' : 'Registrar Entrada'}
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* ESTADÍSTICAS RÁPIDAS */}
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white flex flex-wrap gap-12 items-center justify-center shadow-2xl">
                <div className="text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Colaboradores</p>
                    <h4 className="text-4xl font-black">{employees.length}</h4>
                </div>
                <div className="w-px h-12 bg-slate-800"></div>
                <div className="text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">En Turno Hoy</p>
                    <h4 className="text-4xl font-black text-emerald-400">{activeLogs.size}</h4>
                </div>
                <div className="w-px h-12 bg-slate-800"></div>
                <div className="text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Retrasos</p>
                    <h4 className="text-4xl font-black text-amber-400">0</h4>
                </div>
            </div>
        </div>
    );
}
