'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Leaf, 
  HardHat, 
  Lock, 
  Car, 
  ClipboardList, 
  AlertTriangle, 
  Users, 
  ChevronRight, 
  Activity,
  Globe,
  Gavel,
  Zap,
  ArrowRight
} from 'lucide-react';

interface AuditStandard {
    id: number; code: string; name: string; full_name: string;
    category: string; color: string; description: string;
    total_requirements: number; total_audits: number;
}
interface GlobalKPIs {
    auditsThisYear: number; nonConformities: number; overdueActions: number; openActions: number;
}

const ICONS: Record<string, any> = {
    ISO9001: ShieldCheck, ISO14001: Leaf, ISO45001: HardHat,
    RES0312: Gavel, ISO27001: Lock, ISO39001: Car, PESV: Car,
};

export default function AuditoriaPage() {
    const [standards, setStandards] = useState<AuditStandard[]>([]);
    const [kpis, setKpis] = useState<GlobalKPIs | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch('/api/auditoria/standards').then(r => r.json()),
            fetch('/api/auditoria/dashboard').then(r => r.json()),
        ]).then(([stds, k]) => {
            setStandards(Array.isArray(stds) ? stds : []);
            setKpis(k);
        }).finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-slate-200 rounded-full" />
                <div className="absolute top-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        </div>
    );

    const categories = Array.from(new Set(standards.map(s => s.category)));

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20">
            {/* Header Hero Section */}
            <div className="relative p-10 md:p-16 rounded-[3rem] bg-slate-950 text-white overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-[500px] h-full bg-blue-600/10 blur-[120px] -rotate-12 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />
                
                <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                        <Zap size={14} className="animate-pulse" /> Cumplimiento Normativo
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none mb-6">
                        Auditorías de Normas <br />
                        <span className="text-slate-500 italic">Legales e Internacionales</span>
                    </h1>
                    <p className="text-lg text-slate-400 font-medium leading-relaxed max-w-xl">
                        Asegura la excelencia operativa evaluando tus procesos bajo estándares locales e internacionales con asistencia inteligente.
                    </p>
                </div>

                {/* KPI Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 relative z-10">
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-[2rem] hover:bg-white/10 transition-colors group">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 rounded-2xl bg-blue-600/20 text-blue-400">
                                <Activity size={20} />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-slate-500">Ejecución Anual</span>
                        </div>
                        <div className="text-3xl font-black text-white">{kpis?.auditsThisYear || 0} <span className="text-sm font-medium text-slate-500 tracking-normal">Auditorías</span></div>
                    </div>
                    
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-[2rem] hover:bg-white/10 transition-colors group">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 rounded-2xl bg-orange-500/20 text-orange-400">
                                <AlertTriangle size={20} />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-slate-500">Acciones Abiertas</span>
                        </div>
                        <div className="text-3xl font-black text-white">{kpis?.openActions || 0} <span className="text-sm font-medium text-slate-500 tracking-normal">Pendientes</span></div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-[2rem] hover:bg-white/10 transition-colors group">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400">
                                <Users size={20} />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-slate-500">Gestión de Equipo</span>
                        </div>
                        <Link href="/auditoria/equipo" className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-emerald-400 transition-colors">
                            Ver Auditores <ChevronRight size={16} />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Alert for overdue actions */}
            {kpis && kpis.overdueActions > 0 && (
                <Link href="/mejora-continua/acciones"
                    className="flex items-center gap-4 p-6 bg-red-500/5 border border-red-500/20 rounded-3xl group hover:bg-red-500/10 transition-all">
                    <div className="p-3 bg-red-500 text-white rounded-2xl shadow-lg shadow-red-500/20">
                        <AlertTriangle size={24} />
                    </div>
                    <div className="flex-1">
                        <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mb-0.5">Atención Requerida</p>
                        <h4 className="text-slate-900 font-bold text-lg leading-tight">
                            {kpis.overdueActions} acción{kpis.overdueActions !== 1 ? 'es' : ''} correctiva{kpis.overdueActions !== 1 ? 's' : ''} vencida{kpis.overdueActions !== 1 ? 's' : ''}
                        </h4>
                    </div>
                    <ArrowRight size={20} className="text-red-300 group-hover:translate-x-1 transition-transform" />
                </Link>
            )}

            {/* Standards Sections */}
            {categories.map(category => (
                <div key={category} className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="h-px bg-slate-200 flex-1" />
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">{category}</h2>
                        <div className="h-px bg-slate-200 flex-1" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {standards.filter(s => s.category === category).map(std => {
                            const Icon = ICONS[std.code] || ClipboardList;
                            const color = std.color || '#3b82f6';
                            const displayName = std.full_name ? (std.full_name.includes(' - ') ? std.full_name.split(' - ')[1] : std.full_name) : std.name;

                            return (
                                <Link key={std.id} href={`/auditoria/${std.code.toLowerCase()}`}
                                    className="group relative flex flex-col p-1 bg-white rounded-[2.5rem] border border-slate-100 hover:border-slate-300 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 hover:-translate-y-2">
                                    
                                    <div className="p-8 pb-4">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6" style={{ backgroundColor: color }}>
                                                <Icon size={32} />
                                            </div>
                                            {std.total_audits > 0 && (
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registradas</span>
                                                    <span className="text-xl font-black text-slate-900">{std.total_audits}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="text-[10px] font-black uppercase tracking-[0.15em] mb-2" style={{ color }}>{std.name}</div>
                                        <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight mb-4 group-hover:text-blue-600 transition-colors">
                                            {displayName}
                                        </h3>
                                        <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8 line-clamp-3">
                                            {std.description}
                                        </p>
                                    </div>

                                    <div className="mt-auto border-t border-slate-50 p-8 pt-6 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded-lg bg-slate-50 text-slate-400 group-hover:text-blue-500 transition-colors">
                                                <Globe size={14} />
                                            </div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                {std.total_requirements} Requisitos
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-900 group-hover:text-blue-600 transition-all">
                                            Evaluar <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            ))}

            {/* Footer Actions */}
            <div className="flex justify-center gap-6 pt-12 border-t border-slate-100">
                <Link href="/mejora-continua/acciones"
                    className="flex items-center gap-3 px-8 py-4 bg-white border border-slate-200 rounded-2xl text-slate-700 font-bold hover:border-blue-500 hover:text-blue-600 hover:shadow-xl hover:shadow-blue-500/10 transition-all">
                    <Zap size={20} className="text-blue-500" /> Plan de Acción
                </Link>
                <Link href="/auditoria/hallazgos"
                    className="flex items-center gap-3 px-8 py-4 bg-white border border-slate-200 rounded-2xl text-slate-700 font-bold hover:border-emerald-500 hover:text-emerald-600 hover:shadow-xl hover:shadow-emerald-500/10 transition-all">
                    <ClipboardList size={20} className="text-emerald-500" /> Historial de Hallazgos
                </Link>
            </div>
        </div>
    );
}
