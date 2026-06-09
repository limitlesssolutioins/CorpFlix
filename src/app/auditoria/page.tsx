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
                <div className="w-12 h-12 border-4 border-slate-100 rounded-full" />
                <div className="absolute top-0 w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        </div>
    );

    const categories = Array.from(new Set(standards.map(s => s.category)));

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-20">
            {/* Simple Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-wider">
                        <Zap size={12} fill="currentColor" /> Centro de Auditoría
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                        Auditorías de Normas
                    </h1>
                    <p className="text-slate-500 font-medium">Gestiona el cumplimiento legal e internacional de tu organización.</p>
                </div>

                {/* Compact Stats Bar */}
                <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
                   <div className="px-4 py-2 border-r border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Ejecución</p>
                      <p className="text-sm font-black text-slate-900">{kpis?.auditsThisYear || 0} <span className="text-slate-400 font-bold">Auds</span></p>
                   </div>
                   <div className="px-4 py-2">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Pendientes</p>
                      <p className="text-sm font-black text-orange-500">{kpis?.openActions || 0} <span className="text-slate-400 font-bold">Accs</span></p>
                   </div>
                   <Link href="/auditoria/equipo" className="p-3 bg-slate-900 text-white rounded-xl hover:bg-blue-600 transition-all group">
                      <Users size={18} className="group-hover:scale-110 transition-transform" />
                   </Link>
                </div>
            </div>

            {/* Overdue Alert Compact */}
            {kpis && kpis.overdueActions > 0 && (
                <div className="px-4">
                    <Link href="/mejora-continua/acciones"
                        className="flex items-center gap-4 p-4 bg-red-50 border border-red-100 rounded-[1.5rem] group hover:bg-red-100 transition-all">
                        <div className="p-2 bg-red-500 text-white rounded-xl shadow-md shadow-red-500/20 animate-pulse">
                            <AlertTriangle size={20} />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-slate-900 font-bold text-sm leading-tight">
                                {kpis.overdueActions} acción{kpis.overdueActions !== 1 ? 'es' : ''} vencida{kpis.overdueActions !== 1 ? 's' : ''} que requiere atención
                            </h4>
                        </div>
                        <ChevronRight size={18} className="text-red-400 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            )}

            {/* Horizontal Scroll Sections */}
            {categories.map(category => (
                <div key={category} className="space-y-4">
                    <div className="flex items-center justify-between px-4">
                        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                           <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                           {category}
                        </h2>
                        <div className="flex gap-2">
                           <div className="w-8 h-1 bg-slate-100 rounded-full overflow-hidden">
                              <div className="w-1/2 h-full bg-blue-500/20" />
                           </div>
                        </div>
                    </div>
                    
                    {/* Horizontal Scroll Container */}
                    <div className="relative group">
                        <div className="flex overflow-x-auto gap-6 px-4 pb-8 no-scrollbar scroll-smooth snap-x">
                            {standards.filter(s => s.category === category).map(std => {
                                const Icon = ICONS[std.code] || ClipboardList;
                                const color = std.color || '#3b82f6';
                                const displayName = std.full_name ? (std.full_name.includes(' - ') ? std.full_name.split(' - ')[1] : std.full_name) : std.name;

                                return (
                                    <Link key={std.id} href={`/auditoria/${std.code.toLowerCase()}`}
                                        className="snap-start min-w-[280px] md:min-w-[320px] bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-500 group/card border-b-4"
                                        style={{ borderBottomColor: color }}>
                                        
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform duration-500 group-hover/card:scale-110" style={{ backgroundColor: color }}>
                                                <Icon size={24} />
                                            </div>
                                            {std.total_audits > 0 && (
                                                <div className="px-3 py-1 bg-slate-50 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    {std.total_audits} Auditadas
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2 mb-6">
                                            <div className="text-[10px] font-black uppercase tracking-wider opacity-60" style={{ color }}>{std.name}</div>
                                            <h3 className="text-lg font-black text-slate-900 tracking-tight leading-tight line-clamp-2">
                                                {displayName}
                                            </h3>
                                        </div>

                                        <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6 line-clamp-2 opacity-80">
                                            {std.description}
                                        </p>

                                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                                <Globe size={12} /> {std.total_requirements} Requisitos
                                            </span>
                                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-900 group-hover/card:bg-slate-900 group-hover/card:text-white transition-all">
                                                <ArrowRight size={16} />
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            ))}

            {/* Quick Actions Footer - Mobile Style Bar */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 z-50">
                <Link href="/mejora-continua/acciones" className="flex items-center gap-2 px-6 py-2.5 text-white text-xs font-black uppercase tracking-widest hover:bg-white/10 rounded-xl transition-all">
                    <Zap size={14} className="text-blue-400" /> Plan Acción
                </Link>
                <div className="w-px h-4 bg-white/20" />
                <Link href="/auditoria/hallazgos" className="flex items-center gap-2 px-6 py-2.5 text-white text-xs font-black uppercase tracking-widest hover:bg-white/10 rounded-xl transition-all">
                    <ClipboardList size={14} className="text-emerald-400" /> Hallazgos
                </Link>
            </div>
            
            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}
