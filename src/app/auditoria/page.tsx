'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    ShieldCheck, Leaf, HardHat, Lock, Car, ClipboardList,
    AlertTriangle, FileText, Users, TrendingUp, Activity,
    ChevronRight, XCircle, Clock, CheckCircle2, BarChart2,
} from 'lucide-react';

interface AuditStandard {
    id: number; code: string; name: string; full_name: string;
    category: string; color: string; description: string;
    total_requirements: number; total_audits: number;
}
interface GlobalKPIs {
    totalAudits: number; auditsThisYear: number; totalFindings: number;
    nonConformities: number; openActions: number; overdueActions: number;
    complianceByChapter: any[];
}

const STANDARD_ICONS: Record<string, any> = {
    ISO9001: ShieldCheck, ISO14001: Leaf, ISO45001: HardHat,
    RES0312: HardHat, ISO27001: Lock, ISO39001: Car,
};

const STANDARD_COLORS: Record<string, string> = {
    ISO9001: '#3b82f6', ISO14001: '#22c55e', ISO45001: '#f59e0b',
    RES0312: '#f97316', ISO27001: '#8b5cf6', ISO39001: '#06b6d4',
};

export default function AuditoriaPage() {
    const [standards, setStandards] = useState<AuditStandard[]>([]);
    const [kpis, setKpis] = useState<GlobalKPIs | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch('/api/auditoria/standards').then(r => r.json()),
            fetch('/api/auditoria/dashboard').then(r => r.json()),
        ]).then(([stds, kpisData]) => {
            setStandards(Array.isArray(stds) ? stds : []);
            setKpis(kpisData);
        }).catch(() => {}).finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    const hasOverdue = (kpis?.overdueActions ?? 0) > 0;
    const categories = Array.from(new Set(standards.map(s => s.category)));

    const globalCompliancePct = (() => {
        if (!kpis?.complianceByChapter?.length) return null;
        const total = kpis.complianceByChapter.reduce((s, c) => s + (c.total_requirements || 0), 0);
        const conf = kpis.complianceByChapter.reduce((s, c) => s + (c.conformities || 0), 0);
        return total > 0 ? Math.round((conf / total) * 100) : null;
    })();

    return (
        <div className="max-w-7xl mx-auto space-y-6">

            {/* Header */}
            <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">Auditorías e Inspecciones</h1>
                    <p className="text-slate-500 mt-1">Gestión integral del programa de auditorías de la organización</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <Link href="/auditoria/equipo"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 font-semibold text-sm hover:border-slate-300 hover:shadow-sm transition-all">
                        <Users size={16} /> Equipo Auditor
                    </Link>
                    <Link href="/auditoria/reportes"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 font-semibold text-sm hover:border-slate-300 hover:shadow-sm transition-all">
                        <BarChart2 size={16} /> Reportes
                    </Link>
                </div>
            </div>

            {/* Critical alert */}
            {hasOverdue && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-2xl">
                    <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                    <div className="flex-1">
                        <p className="font-bold text-red-700">
                            {kpis!.overdueActions} acción{kpis!.overdueActions !== 1 ? 'es' : ''} correctiva{kpis!.overdueActions !== 1 ? 's' : ''} vencida{kpis!.overdueActions !== 1 ? 's' : ''}
                        </p>
                        <p className="text-sm text-red-600">Requieren atención inmediata para mantener el sistema de gestión.</p>
                    </div>
                    <Link href="/auditoria/acciones-correctivas"
                        className="shrink-0 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-colors">
                        Ver acciones
                    </Link>
                </div>
            )}

            {/* Global KPIs */}
            {kpis && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[
                        { label: 'Auditorías este año', value: kpis.auditsThisYear, sub: `${kpis.totalAudits} total histórico`, icon: Activity, bg: 'bg-blue-50', color: 'text-blue-600', border: 'border-blue-200' },
                        { label: 'Hallazgos totales', value: kpis.totalFindings, sub: 'todos los estándares', icon: ClipboardList, bg: 'bg-purple-50', color: 'text-purple-600', border: 'border-purple-200' },
                        { label: 'No Conformidades', value: kpis.nonConformities, sub: 'requieren acción', icon: XCircle, bg: 'bg-red-50', color: 'text-red-600', border: 'border-red-200' },
                        { label: 'Acciones Abiertas', value: kpis.openActions, sub: kpis.overdueActions > 0 ? `${kpis.overdueActions} vencidas` : 'al día', icon: Clock, bg: kpis.overdueActions > 0 ? 'bg-orange-50' : 'bg-emerald-50', color: kpis.overdueActions > 0 ? 'text-orange-600' : 'text-emerald-600', border: kpis.overdueActions > 0 ? 'border-orange-200' : 'border-emerald-200' },
                        ...(globalCompliancePct !== null ? [{ label: 'Cumplimiento global', value: `${globalCompliancePct}%`, sub: 'promedio evaluado', icon: TrendingUp, bg: globalCompliancePct >= 80 ? 'bg-emerald-50' : globalCompliancePct >= 60 ? 'bg-yellow-50' : 'bg-red-50', color: globalCompliancePct >= 80 ? 'text-emerald-600' : globalCompliancePct >= 60 ? 'text-yellow-600' : 'text-red-600', border: globalCompliancePct >= 80 ? 'border-emerald-200' : globalCompliancePct >= 60 ? 'border-yellow-200' : 'border-red-200' }] : []),
                    ].map(card => {
                        const Icon = card.icon;
                        return (
                            <div key={card.label} className={`bg-white rounded-2xl p-4 border ${card.border} shadow-sm`}>
                                <div className={`w-9 h-9 ${card.bg} rounded-xl flex items-center justify-center mb-3`}>
                                    <Icon className={`w-5 h-5 ${card.color}`} />
                                </div>
                                <div className={`text-2xl font-black mb-0.5 ${card.color}`}>{card.value}</div>
                                <p className="text-xs font-bold text-slate-700">{card.label}</p>
                                <p className="text-xs text-slate-400 mt-0.5">{card.sub}</p>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Standards */}
            {categories.map(category => (
                <div key={category}>
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                        <div className="flex-1 h-px bg-slate-200" />
                        {category}
                        <div className="flex-1 h-px bg-slate-200" />
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {standards.filter(s => s.category === category).map(standard => {
                            const Icon = STANDARD_ICONS[standard.code] || ClipboardList;
                            const color = standard.color || STANDARD_COLORS[standard.code] || '#3b82f6';
                            return (
                                <Link
                                    key={standard.id}
                                    href={`/auditoria/${standard.code.toLowerCase()}`}
                                    className="group relative bg-white rounded-2xl p-6 border-2 border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 overflow-hidden"
                                >
                                    {/* Color accent top bar */}
                                    <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: color }} />

                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: color }}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        {standard.total_audits > 0 && (
                                            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                                                {standard.total_audits} auditoría{standard.total_audits !== 1 ? 's' : ''}
                                            </span>
                                        )}
                                    </div>

                                    <div className="mb-1">
                                        <span className="text-xs font-black uppercase tracking-widest" style={{ color }}>
                                            {standard.name}
                                        </span>
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900 mb-2 leading-tight">
                                        {standard.full_name.split(' - ')[1] || standard.full_name}
                                    </h3>
                                    <p className="text-xs text-slate-500 leading-relaxed mb-5 line-clamp-2">
                                        {standard.description}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-400 font-semibold">
                                            {standard.total_requirements} requisitos
                                        </span>
                                        <div className="flex items-center gap-1 text-sm font-bold transition-colors group-hover:gap-2" style={{ color }}>
                                            Gestionar <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            ))}

            {/* Bottom quick links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {[
                    { href: '/auditoria/acciones-correctivas', icon: AlertTriangle, label: 'Acciones Correctivas', desc: 'Seguimiento de NC y mejoras', color: '#f97316', bg: 'bg-orange-50' },
                    { href: '/auditoria/equipo', icon: Users, label: 'Equipo Auditor', desc: 'Directorio de auditores', color: '#8b5cf6', bg: 'bg-violet-50' },
                    { href: '/auditoria/reportes', icon: FileText, label: 'Reportes Consolidados', desc: 'Visión global del sistema', color: '#0ea5e9', bg: 'bg-sky-50' },
                ].map(link => {
                    const Icon = link.icon;
                    return (
                        <Link key={link.href} href={link.href}
                            className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all group">
                            <div className={`w-10 h-10 ${link.bg} rounded-xl flex items-center justify-center shrink-0`}>
                                <Icon className="w-5 h-5" style={{ color: link.color }} />
                            </div>
                            <div className="min-w-0">
                                <div className="font-bold text-slate-900 text-sm">{link.label}</div>
                                <div className="text-xs text-slate-500">{link.desc}</div>
                            </div>
                            <ChevronRight size={16} className="ml-auto text-slate-300 group-hover:text-slate-500 transition-colors shrink-0" />
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
