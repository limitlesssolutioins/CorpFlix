'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Leaf, HardHat, Lock, Car, ClipboardList, AlertTriangle, Users, ChevronRight, Activity } from 'lucide-react';

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
    RES0312: HardHat, ISO27001: Lock, ISO39001: Car,
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
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    const categories = Array.from(new Set(standards.map(s => s.category)));

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-slate-900">Auditorías</h1>
                <p className="text-slate-500 mt-1">Selecciona la norma que deseas auditar</p>
            </div>

            {/* Alert vencidas */}
            {kpis && kpis.overdueActions > 0 && (
                <Link href="/auditoria/acciones-correctivas"
                    className="flex items-center gap-3 p-3.5 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-colors">
                    <AlertTriangle size={18} className="text-red-600 shrink-0" />
                    <span className="text-sm font-semibold text-red-700 flex-1">
                        {kpis.overdueActions} acción{kpis.overdueActions !== 1 ? 'es' : ''} correctiva{kpis.overdueActions !== 1 ? 's' : ''} vencida{kpis.overdueActions !== 1 ? 's' : ''} — requieren atención
                    </span>
                    <ChevronRight size={16} className="text-red-400 shrink-0" />
                </Link>
            )}

            {/* Resumen rápido */}
            {kpis && (kpis.auditsThisYear > 0 || kpis.openActions > 0) && (
                <div className="flex gap-4 flex-wrap text-sm">
                    <span className="flex items-center gap-1.5 text-slate-600">
                        <Activity size={15} className="text-blue-500" />
                        <strong className="text-slate-900">{kpis.auditsThisYear}</strong> auditorías este año
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="flex items-center gap-1.5 text-slate-600">
                        <AlertTriangle size={15} className="text-orange-500" />
                        <strong className="text-slate-900">{kpis.openActions}</strong> acciones abiertas
                    </span>
                    {kpis.nonConformities > 0 && <>
                        <span className="text-slate-300">·</span>
                        <span className="flex items-center gap-1.5 text-slate-600">
                            <strong className="text-slate-900">{kpis.nonConformities}</strong> no conformidades
                        </span>
                    </>}
                </div>
            )}

            {/* Standards */}
            {categories.map(category => (
                <div key={category}>
                    {categories.length > 1 && (
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">{category}</p>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {standards.filter(s => s.category === category).map(std => {
                            const Icon = ICONS[std.code] || ClipboardList;
                            const color = std.color || '#3b82f6';
                            return (
                                <Link key={std.id} href={`/auditoria/${std.code.toLowerCase()}`}
                                    className="group bg-white rounded-2xl p-5 border-2 border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0" style={{ backgroundColor: color }}>
                                            <Icon size={18} />
                                        </div>
                                        {std.total_audits > 0 && (
                                            <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                                {std.total_audits} audit.
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-xs font-black uppercase tracking-wide mb-0.5" style={{ color }}>{std.name}</div>
                                    <h3 className="text-sm font-bold text-slate-900 leading-snug mb-1">
                                        {std.full_name.split(' - ')[1] || std.full_name}
                                    </h3>
                                    <p className="text-xs text-slate-400 line-clamp-2 mb-4">{std.description}</p>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-400">{std.total_requirements} requisitos</span>
                                        <span className="font-bold flex items-center gap-1 group-hover:gap-1.5 transition-all" style={{ color }}>
                                            Abrir <ChevronRight size={13} />
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            ))}

            {/* Accesos globales */}
            <div className="pt-2 flex gap-3 flex-wrap border-t border-slate-100">
                <Link href="/auditoria/acciones-correctivas"
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 text-sm font-semibold hover:border-slate-300 hover:shadow-sm transition-all">
                    <AlertTriangle size={15} className="text-orange-500" /> Acciones Correctivas
                    {kpis && kpis.openActions > 0 && (
                        <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">{kpis.openActions}</span>
                    )}
                </Link>
                <Link href="/auditoria/equipo"
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 text-sm font-semibold hover:border-slate-300 hover:shadow-sm transition-all">
                    <Users size={15} className="text-violet-500" /> Equipo Auditor
                </Link>
            </div>
        </div>
    );
}
