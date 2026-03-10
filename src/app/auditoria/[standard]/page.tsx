'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft, Plus, Calendar, ClipboardList, AlertTriangle, CheckCircle2,
    FileText, Users, ChevronRight, Activity, FileCheck, LayoutList,
    ArrowRight, Target,
} from 'lucide-react';

interface AuditStandard {
    id: number; code: string; name: string; full_name: string;
    category: string; color: string; description: string;
    total_requirements: number; total_audits: number;
}
interface Audit {
    id: number; audit_code: string; audit_date: string;
    auditor_name: string; status: string; scope: string;
}
interface KPIs {
    totalAudits: number; auditsThisYear: number; totalFindings: number;
    nonConformities: number; openActions: number; overdueActions: number;
    complianceByChapter: Array<{ chapter_number: string; chapter_title: string; total_requirements: number; conformities: number; non_conformities: number }>;
}

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
            const allAudits: Audit[] = await auditsRes.json();
            const found = stds.find(s => s.code === code);
            setStandard(found || null);
            if (found) {
                const filtered = allAudits
                    .filter(a => (a as any).standard_id === found.id)
                    .sort((a, b) => {
                        // IN_PROGRESS first, then PLANNED, then COMPLETED
                        const order: Record<string, number> = { IN_PROGRESS: 0, PLANNED: 1, COMPLETED: 2 };
                        return (order[a.status] ?? 3) - (order[b.status] ?? 3);
                    });
                setAudits(filtered.slice(0, 8));
                const kpisRes = await fetch(`/api/auditoria/dashboard?standard_id=${found.id}`);
                setKPIs(await kpisRes.json());
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const formatDate = (d: string) => new Date(d).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!standard) return (
        <div className="max-w-xl mx-auto text-center py-20">
            <p className="text-slate-500">Norma no encontrada: {code}</p>
            <Link href="/auditoria" className="mt-3 inline-block text-blue-600 font-semibold text-sm">← Volver</Link>
        </div>
    );

    const color = standard.color || '#3b82f6';
    const standardPath = `/auditoria/${code.toLowerCase()}`;

    const activeAudit = audits.find(a => a.status === 'IN_PROGRESS');
    const plannedAudits = audits.filter(a => a.status === 'PLANNED');
    const completedAudits = audits.filter(a => a.status === 'COMPLETED');

    const overallPct = (() => {
        if (!kpis?.complianceByChapter?.length) return null;
        const ev = kpis.complianceByChapter.reduce((s, c) => s + c.conformities + c.non_conformities, 0);
        const conf = kpis.complianceByChapter.reduce((s, c) => s + c.conformities, 0);
        return ev > 0 ? Math.round((conf / ev) * 100) : null;
    })();

    return (
        <div className="max-w-5xl mx-auto space-y-5">

            {/* Back */}
            <Link href="/auditoria" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-700 text-sm font-semibold transition-colors">
                <ArrowLeft size={15} /> Todas las normas
            </Link>

            {/* Standard header */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="h-1" style={{ backgroundColor: color }} />
                <div className="p-5 flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0" style={{ backgroundColor: color }}>
                            {standard.code.slice(0, 3)}
                        </div>
                        <div>
                            <div className="text-xs font-black uppercase tracking-wide" style={{ color }}>{standard.name}</div>
                            <h1 className="font-black text-slate-900">{standard.full_name.split(' - ')[1] || standard.full_name}</h1>
                        </div>
                    </div>
                    <Link href={`${standardPath}/auditorias/nueva`}
                        className="flex items-center gap-2 px-4 py-2.5 text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity shrink-0"
                        style={{ backgroundColor: color }}>
                        <Plus size={16} /> Nueva Auditoría
                    </Link>
                </div>
            </div>

            {/* ─── AUDITORÍA EN CURSO ─── */}
            {activeAudit && (
                <div className="rounded-2xl border-2 overflow-hidden" style={{ borderColor: color }}>
                    <div className="px-5 py-3 flex items-center gap-2 text-white text-sm font-bold" style={{ backgroundColor: color }}>
                        <Activity size={15} className="animate-pulse" /> Auditoría en Ejecución
                    </div>
                    <div className="bg-white p-5 flex items-center justify-between gap-4 flex-wrap">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-mono text-xs text-slate-400">{activeAudit.audit_code}</span>
                            </div>
                            <p className="font-semibold text-slate-800">{formatDate(activeAudit.audit_date)}</p>
                            {activeAudit.scope && <p className="text-sm text-slate-500 mt-0.5">{activeAudit.scope}</p>}
                        </div>
                        <div className="flex gap-2 shrink-0">
                            <Link href={`${standardPath}/checklist?audit_id=${activeAudit.id}`}
                                className="flex items-center gap-2 px-5 py-2.5 text-white rounded-xl font-bold hover:opacity-90 transition-opacity"
                                style={{ backgroundColor: color }}>
                                <ClipboardList size={16} /> Ir al Checklist
                            </Link>
                            <Link href={`${standardPath}/reporte?audit_id=${activeAudit.id}`}
                                className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors">
                                <FileText size={15} /> Informe
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Sin auditorías → CTA prominente ─── */}
            {audits.length === 0 && (
                <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-10 text-center">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-lg mx-auto mb-4" style={{ backgroundColor: `${color}20` }}>
                        <ClipboardList className="w-7 h-7" style={{ color }} />
                    </div>
                    <h3 className="font-black text-slate-800 text-lg mb-1">Comienza tu primera auditoría</h3>
                    <p className="text-slate-500 text-sm mb-5">Crea una auditoría, completa el checklist y genera el informe</p>
                    <Link href={`${standardPath}/auditorias/nueva`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-white rounded-xl font-bold hover:opacity-90"
                        style={{ backgroundColor: color }}>
                        <Plus size={16} /> Crear auditoría
                    </Link>
                </div>
            )}

            {/* ─── FLUJO DE TRABAJO (solo si no hay activa) ─── */}
            {!activeAudit && audits.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4">Flujo de Auditoría</p>
                    <div className="flex items-center gap-2 flex-wrap">
                        {[
                            { num: '1', label: 'Planificar', sub: 'Datos, equipo, alcance', icon: Calendar, href: `${standardPath}/auditorias/nueva` },
                            { num: '2', label: 'Ejecutar Checklist', sub: 'Evaluar requisito a requisito', icon: ClipboardList, href: `${standardPath}/auditorias` },
                            { num: '3', label: 'Generar Informe', sub: 'Documento de hallazgos', icon: FileText, href: `${standardPath}/auditorias` },
                            { num: '4', label: 'Seguimiento NC', sub: 'Acciones correctivas', icon: AlertTriangle, href: '/auditoria/acciones-correctivas' },
                        ].map((step, i) => {
                            const Icon = step.icon;
                            return (
                                <div key={i} className="flex items-center gap-2">
                                    <Link href={step.href}
                                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 hover:bg-slate-100 transition-all group">
                                        <span className="w-5 h-5 rounded-full text-white text-xs font-black flex items-center justify-center shrink-0" style={{ backgroundColor: color }}>
                                            {step.num}
                                        </span>
                                        <div>
                                            <div className="text-xs font-bold text-slate-700">{step.label}</div>
                                            <div className="text-xs text-slate-400 hidden sm:block">{step.sub}</div>
                                        </div>
                                    </Link>
                                    {i < 3 && <ArrowRight size={14} className="text-slate-300 shrink-0" />}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* ─── Auditorías ─── */}
                <div className="lg:col-span-2 space-y-3">
                    {/* Planificadas */}
                    {plannedAudits.length > 0 && (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                            <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-3">Planificadas ({plannedAudits.length})</p>
                            <div className="space-y-2">
                                {plannedAudits.map(a => (
                                    <div key={a.id} className="flex items-center justify-between p-3 rounded-xl bg-blue-50 border border-blue-100">
                                        <div>
                                            <span className="font-mono text-xs text-slate-400">{a.audit_code}</span>
                                            <p className="text-sm font-semibold text-slate-700">{formatDate(a.audit_date)}</p>
                                            {a.scope && <p className="text-xs text-slate-500 truncate max-w-xs">{a.scope}</p>}
                                        </div>
                                        <Link href={`${standardPath}/plan?audit_id=${a.id}`}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors shrink-0">
                                            <FileCheck size={12} /> Ver Plan
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Completadas */}
                    {completedAudits.length > 0 && (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wide mb-3">Completadas ({completedAudits.length})</p>
                            <div className="space-y-2">
                                {completedAudits.map(a => (
                                    <div key={a.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                                        <div>
                                            <span className="font-mono text-xs text-slate-400">{a.audit_code}</span>
                                            <p className="text-sm font-semibold text-slate-700">{formatDate(a.audit_date)}</p>
                                        </div>
                                        <div className="flex gap-1.5 shrink-0">
                                            <Link href={`${standardPath}/checklist?audit_id=${a.id}`}
                                                className="flex items-center gap-1 px-2.5 py-1.5 text-white rounded-lg text-xs font-bold hover:opacity-90" style={{ backgroundColor: color }}>
                                                <ClipboardList size={12} /> Checklist
                                            </Link>
                                            <Link href={`${standardPath}/reporte?audit_id=${a.id}`}
                                                className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-700 text-white rounded-lg text-xs font-bold hover:bg-slate-800">
                                                <FileText size={12} /> Informe
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {audits.length > 0 && (
                        <Link href={`${standardPath}/auditorias`}
                            className="flex items-center justify-center gap-1.5 py-2.5 text-sm font-bold rounded-xl border-2 border-dashed border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700 transition-all">
                            Ver todas las auditorías <ChevronRight size={14} />
                        </Link>
                    )}
                </div>

                {/* ─── Panel lateral ─── */}
                <div className="space-y-4">
                    {/* KPIs simples */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Resumen</p>
                        <div className="space-y-2">
                            {[
                                { label: 'Total auditorías', value: kpis?.totalAudits ?? 0 },
                                { label: 'No conformidades', value: kpis?.nonConformities ?? 0, alert: (kpis?.nonConformities ?? 0) > 0 },
                                { label: 'Acciones abiertas', value: kpis?.openActions ?? 0, alert: (kpis?.openActions ?? 0) > 0 },
                                ...(overallPct !== null ? [{ label: 'Cumplimiento', value: `${overallPct}%`, color: overallPct >= 80 ? '#22c55e' : overallPct >= 60 ? '#f59e0b' : '#ef4444' }] : []),
                            ].map(row => (
                                <div key={row.label} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                                    <span className="text-xs text-slate-500">{row.label}</span>
                                    <span className={`text-sm font-black ${'alert' in row && row.alert ? 'text-orange-600' : 'color' in row ? '' : 'text-slate-800'}`}
                                        style={'color' in row && row.color ? { color: row.color } : {}}>
                                        {row.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Cumplimiento por capítulo */}
                    {kpis && kpis.complianceByChapter.some(c => c.conformities + c.non_conformities > 0) && (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                            <div className="flex items-center gap-1.5 mb-3">
                                <Target size={14} style={{ color }} />
                                <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">Por Capítulo</p>
                            </div>
                            <div className="space-y-2">
                                {kpis.complianceByChapter.filter(c => c.conformities + c.non_conformities > 0).map(ch => {
                                    const ev = ch.conformities + ch.non_conformities;
                                    const pct = Math.round((ch.conformities / ev) * 100);
                                    const bar = pct >= 80 ? '#22c55e' : pct >= 60 ? '#eab308' : '#ef4444';
                                    return (
                                        <div key={ch.chapter_number}>
                                            <div className="flex items-center justify-between mb-0.5">
                                                <span className="text-xs text-slate-600 truncate max-w-[80%]">
                                                    <span className="font-mono font-bold text-slate-400 mr-1">{ch.chapter_number}</span>
                                                    {ch.chapter_title}
                                                </span>
                                                <span className="text-xs font-black ml-2" style={{ color: bar }}>{pct}%</span>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-1.5">
                                                <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, backgroundColor: bar }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Links secundarios */}
                    <div className="space-y-1.5">
                        {[
                            { href: `${standardPath}/programa`, icon: LayoutList, label: 'Programa anual' },
                            { href: '/auditoria/acciones-correctivas', icon: AlertTriangle, label: 'Acciones correctivas', badge: kpis?.openActions },
                            { href: '/auditoria/equipo', icon: Users, label: 'Equipo auditor' },
                        ].map(link => {
                            const Icon = link.icon;
                            return (
                                <Link key={link.href} href={link.href}
                                    className="flex items-center justify-between px-3 py-2.5 bg-white rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all">
                                    <div className="flex items-center gap-2">
                                        <Icon size={14} className="text-slate-400" /> {link.label}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        {link.badge ? (
                                            <span className="text-xs font-bold px-1.5 py-0.5 bg-orange-100 text-orange-600 rounded-full">{link.badge}</span>
                                        ) : null}
                                        <ChevronRight size={13} className="text-slate-300" />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
