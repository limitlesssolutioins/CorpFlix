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
                <div className="w-10 h-10 border-4 border-slate-100 rounded-full" />
                <div className="absolute top-0 w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        </div>
    );

    const categories = Array.from(new Set(standards.map(s => s.category)));

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-32">
            {/* Minimal App Header */}
            <div className="flex items-center justify-between px-4 pt-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Auditorías</h1>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Panel de Cumplimiento</p>
                </div>
                
                <div className="flex items-center gap-2">
                    <div className="hidden md:flex flex-col items-end mr-2">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Estado Global</span>
                        <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                            <Activity size={10} /> {kpis?.auditsThisYear || 0} Ejecutadas
                        </span>
                    </div>
                    <Link href="/auditoria/equipo" className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 hover:bg-slate-900 hover:text-white transition-all">
                        <Users size={18} />
                    </Link>
                </div>
            </div>

            {/* Compact Overdue Alert */}
            {kpis && kpis.overdueActions > 0 && (
                <div className="px-4">
                    <Link href="/mejora-continua/acciones"
                        className="flex items-center gap-3 p-3 bg-red-50 border border-red-100 rounded-2xl group hover:bg-red-100 transition-all">
                        <div className="w-8 h-8 bg-red-500 text-white rounded-xl flex items-center justify-center shadow-sm">
                            <AlertTriangle size={16} />
                        </div>
                        <span className="text-[11px] font-bold text-slate-800 flex-1">
                            {kpis.overdueActions} acciones vencidas pendientes
                        </span>
                        <ChevronRight size={14} className="text-red-300" />
                    </Link>
                </div>
            )}

            {/* Grid Sections */}
            {categories.map(category => (
                <div key={category} className="space-y-6 px-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 whitespace-nowrap">{category}</h2>
                        <div className="h-px bg-slate-100 flex-1" />
                    </div>
                    
                    {/* Standardized Grid - Mobile App Style */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                        {standards.filter(s => s.category === category).map(std => {
                            const Icon = ICONS[std.code] || ClipboardList;
                            const color = std.color || '#3b82f6';

                            return (
                                <Link key={std.id} href={`/auditoria/${std.code.toLowerCase()}`}
                                    className="group flex flex-col items-center text-center space-y-3 p-2 transition-all">
                                    
                                    {/* App Icon Style */}
                                    <div className="relative">
                                        <div 
                                            className="w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center text-white shadow-lg group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                                            style={{ backgroundColor: color }}
                                        >
                                            <Icon size={32} className="md:size-40 relative z-10" />
                                            {/* Subtle internal glow */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                                        </div>
                                        
                                        {/* Notification Badge Style for Audits Count */}
                                        {std.total_audits > 0 && (
                                            <div className="absolute -top-1 -right-1 min-w-[20px] h-[20px] bg-slate-900 border-2 border-white text-white rounded-full flex items-center justify-center text-[9px] font-black px-1.5 shadow-md">
                                                {std.total_audits}
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <div className="text-[11px] font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                                            {std.name}
                                        </div>
                                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                            {std.total_requirements} Reqs
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            ))}

            {/* Floating Bottom Navigation (Tab Bar Style) */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center bg-white/80 backdrop-blur-xl border border-slate-200/50 p-1.5 rounded-[2rem] shadow-2xl z-50">
                <Link href="/mejora-continua/acciones" className="flex flex-col items-center gap-1 px-6 py-2 rounded-[1.5rem] hover:bg-slate-50 transition-all group">
                    <Zap size={18} className="text-blue-500 group-hover:scale-110 transition-transform" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Plan Acción</span>
                </Link>
                <div className="w-px h-6 bg-slate-200" />
                <Link href="/auditoria/hallazgos" className="flex flex-col items-center gap-1 px-6 py-2 rounded-[1.5rem] hover:bg-slate-50 transition-all group">
                    <ClipboardList size={18} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Hallazgos</span>
                </Link>
            </div>
        </div>
    );
}
