'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft, Plus, Calendar, ClipboardList, AlertTriangle, CheckCircle2,
    Clock, FileText, LayoutList, Users, ChevronRight, XCircle,
    TrendingUp, Activity, FileCheck, Award, Target,
} from 'lucide-react';

interface AuditStandard {
    id: number; code: string; name: string; full_name: string;
    category: string; color: string; description: string;
    total_requirements: number; total_audits: number;
}
interface Audit {
    id: number; audit_code: string; audit_date: string;
    auditor_name: string; status: string; audit_type_name: string; scope: string;
}
interface KPIs {
    totalAudits: number; auditsThisYear: number; totalFindings: number;
    nonConformities: number; openActions: number; overdueActions: number;
    complianceByChapter: Array<{ chapter_number: string; chapter_title: string; total_requirements: number; conformities: number; non_conformities: number }>;
    findingsByType: Array<{ type_name: string; color: string; count: number }>;
}

const STATUS_CONFIG: Record<string, { bg: string; text: string; label: string; icon: any }> = {
    PLANNED: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Planificada', icon: Calendar },
    IN_PROGRESS: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'En Ejecución', icon: Activity },
    COMPLETED: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Completada', icon: CheckCircle2 },
};

export default function StandardDashboardPage() {
    const params = useParams();
    const code = (params.standard as string).toUpperCase();

    const [standard, setStandard] = useState<AuditStandard | null>(null);
    const [audits, setAudits] = useState<Audit[]>([]);
    const [kpis, setKPIs] = useState<KPIs | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadData(); }, [code]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [stdsRes, auditsRes] = await Promise.all([
                fetch('/api/auditoria/standards'),
                fetch('/api/auditoria/audits'),
            ]);
            const stds: AuditStandard[] = await stdsRes.json();
            const allAudits: any[] = await auditsRes.json();

            const found = stds.find(s => s.code === code);
            setStandard(found || null);

            if (found) {
                const filtered = allAudits.filter(a => a.standard_id === found.id);
                setAudits(filtered.slice(0, 6));
                const kpisRes = await fetch(`/api/auditoria/dashboard?standard_id=${found.id}`);
                setKPIs(await kpisRes.json());
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const formatDate = (d: string) => new Date(d).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!standard) return (
        <div className="max-w-2xl mx-auto text-center py-20">
            <p className="text-slate-500 text-lg">Norma no encontrada: {code}</p>
            <Link href="/auditoria" className="mt-4 inline-block text-blue-600 font-semibold">← Volver</Link>
        </div>
    );

    const standardPath = `/auditoria/${code.toLowerCase()}`;
    const color = standard.color;

    // Compliance analysis
    const totalEvaluated = kpis?.complianceByChapter.reduce((s, c) => s + c.conformities + c.non_conformities, 0) ?? 0;
    const totalConformities = kpis?.complianceByChapter.reduce((s, c) => s + c.conformities, 0) ?? 0;
    const overallPct = totalEvaluated > 0 ? Math.round((totalConformities / totalEvaluated) * 100) : null;

    const auditsByStatus = {
        PLANNED: audits.filter(a => a.status === 'PLANNED').length,
        IN_PROGRESS: audits.filter(a => a.status === 'IN_PROGRESS').length,
        COMPLETED: audits.filter(a => a.status === 'COMPLETED').length,
    };

    return (
        <div className="max-w-7xl mx-auto space-y-5">
            {/* Back */}
            <Link href="/auditoria" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-semibold transition-colors text-sm">
                <ArrowLeft size={16} /> Todos los estándares
            </Link>

            {/* Header card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="h-1.5" style={{ backgroundColor: color }} />
                <div className="p-6 flex items-start justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-lg shrink-0" style={{ backgroundColor: color }}>
                            {standard.code.slice(0, 2)}
                        </div>
                        <div>
                            <div className="text-xs font-black uppercase tracking-widest mb-1" style={{ color }}>{standard.name}</div>
                            <h1 className="text-xl font-black text-slate-900 leading-tight">{standard.full_name.split(' - ')[1] || standard.full_name}</h1>
                            <p className="text-sm text-slate-500 mt-1 max-w-xl">{standard.description}</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <Link
                            href={`${standardPath}/auditorias/nueva`}
                            className="flex items-center gap-2 px-5 py-2.5 text-white rounded-xl font-semibold shadow-sm hover:opacity-90 transition-opacity whitespace-nowrap text-sm"
                            style={{ backgroundColor: color }}
                        >
                            <Plus size={16} /> Nueva Auditoría
                        </Link>
                        {overallPct !== null && (
                            <div className="text-right">
                                <div className="text-2xl font-black" style={{ color }}>{overallPct}%</div>
                                <div className="text-xs text-slate-400 font-semibold">cumplimiento evaluado</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Auditorías', value: kpis?.totalAudits ?? 0, sub: `${kpis?.auditsThisYear ?? 0} este año`, icon: Calendar, bg: 'bg-blue-50', iconColor: 'text-blue-600' },
                    { label: 'Hallazgos', value: kpis?.totalFindings ?? 0, sub: 'total registrados', icon: ClipboardList, bg: 'bg-violet-50', iconColor: 'text-violet-600' },
                    { label: 'No Conformidades', value: kpis?.nonConformities ?? 0, sub: 'requieren acción', icon: XCircle, bg: 'bg-red-50', iconColor: 'text-red-600' },
                    { label: 'Acciones Abiertas', value: kpis?.openActions ?? 0, sub: kpis && kpis.overdueActions > 0 ? `⚠ ${kpis.overdueActions} vencidas` : 'sin vencer', icon: AlertTriangle, bg: kpis && kpis.overdueActions > 0 ? 'bg-orange-50' : 'bg-emerald-50', iconColor: kpis && kpis.overdueActions > 0 ? 'text-orange-600' : 'text-emerald-600' },
                ].map(card => {
                    const Icon = card.icon;
                    return (
                        <div key={card.label} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                            <div className={`w-9 h-9 ${card.bg} rounded-xl flex items-center justify-center mb-3`}>
                                <Icon className={`w-5 h-5 ${card.iconColor}`} />
                            </div>
                            <div className="text-2xl font-black text-slate-900">{card.value}</div>
                            <p className="text-xs font-bold text-slate-600 mt-0.5">{card.label}</p>
                            <p className="text-xs text-slate-400">{card.sub}</p>
                        </div>
                    );
                })}
            </div>

            {/* Navigation actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { href: `${standardPath}/auditorias`, icon: ClipboardList, label: 'Auditorías', desc: 'Gestionar todas' },
                    { href: `${standardPath}/programa`, icon: LayoutList, label: 'Programa', desc: 'Plan anual' },
                    { href: '/auditoria/acciones-correctivas', icon: AlertTriangle, label: 'Acciones NC', desc: 'Seguimiento' },
                    { href: '/auditoria/equipo', icon: Users, label: 'Equipo', desc: 'Auditores' },
                ].map(item => {
                    const Icon = item.icon;
                    return (
                        <Link key={item.href} href={item.href}
                            className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all group">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}18`, color }}>
                                <Icon size={16} />
                            </div>
                            <div className="min-w-0">
                                <div className="text-sm font-bold text-slate-800">{item.label}</div>
                                <div className="text-xs text-slate-400">{item.desc}</div>
                            </div>
                            <ChevronRight size={14} className="ml-auto text-slate-300 group-hover:text-slate-500 shrink-0" />
                        </Link>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                {/* Compliance by chapter */}
                {kpis && kpis.complianceByChapter.length > 0 && (
                    <div className="lg:col-span-3 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-5">
                            <Target size={18} style={{ color }} />
                            <h2 className="text-base font-bold text-slate-900">Cumplimiento por Capítulo</h2>
                            {overallPct !== null && (
                                <span className="ml-auto text-xs font-bold px-2 py-1 rounded-full" style={{ backgroundColor: `${color}18`, color }}>
                                    {overallPct}% global
                                </span>
                            )}
                        </div>
                        <div className="space-y-3">
                            {kpis.complianceByChapter.map(ch => {
                                const evaluated = ch.conformities + ch.non_conformities;
                                const pct = evaluated > 0 ? Math.round((ch.conformities / evaluated) * 100) : null;
                                const barColor = pct === null ? '#e2e8f0' : pct >= 80 ? '#22c55e' : pct >= 60 ? '#eab308' : '#ef4444';

                                return (
                                    <div key={ch.chapter_number} className="group">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <span className="text-xs font-black font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">{ch.chapter_number}</span>
                                                <span className="text-xs font-semibold text-slate-700 truncate">{ch.chapter_title}</span>
                                            </div>
                                            <div className="flex items-center gap-2 ml-2 shrink-0">
                                                {ch.non_conformities > 0 && (
                                                    <span className="text-xs font-bold text-red-600">{ch.non_conformities} NC</span>
                                                )}
                                                <span className="text-sm font-black" style={{ color: pct === null ? '#94a3b8' : barColor }}>
                                                    {pct === null ? '—' : `${pct}%`}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-2">
                                            <div
                                                className="h-2 rounded-full transition-all duration-500"
                                                style={{ width: `${pct ?? 0}%`, backgroundColor: barColor }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {kpis.complianceByChapter.every(c => c.conformities + c.non_conformities === 0) && (
                            <p className="text-center text-sm text-slate-400 mt-4">Sin evaluaciones registradas aún</p>
                        )}
                    </div>
                )}

                {/* Recent audits + pipeline */}
                <div className={`${kpis && kpis.complianceByChapter.length > 0 ? 'lg:col-span-2' : 'lg:col-span-5'} space-y-4`}>
                    {/* Audit pipeline */}
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                        <h2 className="text-sm font-bold text-slate-600 uppercase tracking-wide mb-3">Estado del Programa</h2>
                        <div className="space-y-2">
                            {[
                                { key: 'PLANNED', label: 'Planificadas', count: auditsByStatus.PLANNED, icon: Calendar, color: '#3b82f6' },
                                { key: 'IN_PROGRESS', label: 'En Ejecución', count: auditsByStatus.IN_PROGRESS, icon: Activity, color: '#f59e0b' },
                                { key: 'COMPLETED', label: 'Completadas', count: auditsByStatus.COMPLETED, icon: CheckCircle2, color: '#22c55e' },
                            ].map(s => {
                                const Icon = s.icon;
                                const total = Object.values(auditsByStatus).reduce((a, b) => a + b, 0);
                                const pct = total > 0 ? (s.count / total) * 100 : 0;
                                return (
                                    <div key={s.key} className="flex items-center gap-3">
                                        <Icon size={14} style={{ color: s.color }} className="shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs font-semibold text-slate-600">{s.label}</span>
                                                <span className="text-xs font-black text-slate-800">{s.count}</span>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-1.5">
                                                <div className="h-1.5 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: s.color }} />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {kpis?.totalAudits === 0 && (
                            <p className="text-center text-xs text-slate-400 mt-3">No hay auditorías registradas</p>
                        )}
                    </div>

                    {/* Recent audits */}
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-bold text-slate-600 uppercase tracking-wide">Últimas Auditorías</h2>
                            <Link href={`${standardPath}/auditorias`} className="text-xs font-bold" style={{ color }}>Ver todas →</Link>
                        </div>
                        {audits.length === 0 ? (
                            <div className="text-center py-6">
                                <Calendar className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                                <p className="text-sm text-slate-400">Sin auditorías aún</p>
                                <Link href={`${standardPath}/auditorias/nueva`}
                                    className="mt-2 inline-flex items-center gap-1 text-xs font-bold" style={{ color }}>
                                    <Plus size={12} /> Crear primera
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {audits.map(audit => {
                                    const st = STATUS_CONFIG[audit.status] || STATUS_CONFIG.PLANNED;
                                    const Icon = st.icon;
                                    return (
                                        <div key={audit.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${st.bg} ${st.text}`}>
                                                        <Icon size={10} />{st.label}
                                                    </span>
                                                    <span className="text-xs text-slate-400 font-mono">{audit.audit_code}</span>
                                                </div>
                                                <p className="text-xs text-slate-500 truncate">{formatDate(audit.audit_date)}</p>
                                            </div>
                                            <div className="flex gap-1 shrink-0 ml-2">
                                                <Link href={`${standardPath}/checklist?audit_id=${audit.id}`}
                                                    className="p-1.5 rounded-lg text-white text-xs font-bold hover:opacity-90" style={{ backgroundColor: color }} title="Checklist">
                                                    <ClipboardList size={12} />
                                                </Link>
                                                <Link href={`${standardPath}/reporte?audit_id=${audit.id}`}
                                                    className="p-1.5 rounded-lg text-white text-xs font-bold bg-slate-600 hover:bg-slate-700" title="Informe">
                                                    <FileText size={12} />
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
