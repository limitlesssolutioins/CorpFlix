'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Calendar, ClipboardCheck, AlertTriangle, CheckCircle2, Clock, FileText, Award, ClipboardList } from 'lucide-react';

interface AuditStandard {
    id: number; code: string; name: string; full_name: string;
    category: string; color: string; description: string;
    total_requirements: number; total_audits: number;
}
interface Audit {
    id: number; audit_code: string; audit_date: string;
    auditor_name: string; status: string; audit_type_name: string;
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

    useEffect(() => {
        loadData();
    }, [code]);

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
                setAudits(filtered.slice(0, 5));

                const kpisRes = await fetch(`/api/auditoria/dashboard?standard_id=${found.id}`);
                setKPIs(await kpisRes.json());
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (d: string) => new Date(d).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });

    const getStatusBadge = (status: string) => {
        const map: Record<string, { bg: string; label: string }> = {
            PLANNED: { bg: 'bg-blue-100 text-blue-700', label: 'Planificada' },
            IN_PROGRESS: { bg: 'bg-yellow-100 text-yellow-700', label: 'En Progreso' },
            COMPLETED: { bg: 'bg-green-100 text-green-700', label: 'Completada' },
        };
        const b = map[status] || map.PLANNED;
        return <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${b.bg}`}>{b.label}</span>;
    };

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
    const accentColor = standard.color;

    return (
        <div className="max-w-7xl mx-auto">
            {/* Back */}
            <Link href="/auditoria" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold mb-6 transition-colors">
                <ArrowLeft size={20} /> Volver a Normas
            </Link>

            {/* Header */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-6 flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-lg" style={{ backgroundColor: accentColor }}>
                        {standard.code.slice(0, 2)}
                    </div>
                    <div>
                        <div className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: accentColor }}>{standard.name}</div>
                        <h1 className="text-2xl font-black text-slate-900">{standard.full_name.split(' - ')[1] || standard.full_name}</h1>
                        <p className="text-sm text-slate-500 mt-1">{standard.description}</p>
                    </div>
                </div>
                <Link
                    href={`${standardPath}/auditorias/nueva`}
                    className="flex items-center gap-2 px-5 py-3 text-white rounded-xl font-semibold shadow-sm hover:opacity-90 transition-opacity whitespace-nowrap"
                    style={{ backgroundColor: accentColor }}
                >
                    <Plus size={18} /> Nueva Auditoría
                </Link>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                    { label: 'Auditorías', value: kpis?.totalAudits || 0, sub: `${kpis?.auditsThisYear || 0} este año`, icon: Calendar, bg: 'bg-blue-50', iconColor: 'text-blue-600' },
                    { label: 'Hallazgos', value: kpis?.totalFindings || 0, sub: '', icon: ClipboardCheck, bg: 'bg-purple-50', iconColor: 'text-purple-600' },
                    { label: 'No Conformidades', value: kpis?.nonConformities || 0, sub: '', icon: AlertTriangle, bg: 'bg-red-50', iconColor: 'text-red-600' },
                    { label: 'Acciones Abiertas', value: kpis?.openActions || 0, sub: kpis && kpis.overdueActions > 0 ? `${kpis.overdueActions} vencidas` : '', icon: CheckCircle2, bg: 'bg-orange-50', iconColor: 'text-orange-600' },
                ].map(card => {
                    const Icon = card.icon;
                    return (
                        <div key={card.label} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center`}>
                                    <Icon className={`w-5 h-5 ${card.iconColor}`} />
                                </div>
                                <span className="text-2xl font-black text-slate-900">{card.value}</span>
                            </div>
                            <p className="text-sm font-semibold text-slate-600">{card.label}</p>
                            {card.sub && <p className="text-xs text-slate-400 mt-0.5">{card.sub}</p>}
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Compliance by chapter */}
                {kpis && kpis.complianceByChapter.length > 0 && (
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">Cumplimiento por Capítulo</h2>
                        <div className="space-y-3">
                            {kpis.complianceByChapter.map(ch => {
                                const pct = ch.total_requirements > 0 ? Math.round((ch.conformities / ch.total_requirements) * 100) : 0;
                                return (
                                    <div key={ch.chapter_number}>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-semibold text-slate-700 truncate max-w-[70%]">
                                                {ch.chapter_number}. {ch.chapter_title}
                                            </span>
                                            <span className="text-sm font-black text-slate-900 ml-2">{pct}%</span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all ${pct >= 80 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-400' : 'bg-red-400'}`}
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Recent audits */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-slate-900">Últimas Auditorías</h2>
                        <Link href={`${standardPath}/auditorias`} className="text-sm font-semibold" style={{ color: accentColor }}>
                            Ver todas →
                        </Link>
                    </div>
                    {audits.length === 0 ? (
                        <div className="text-center py-8">
                            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-400 text-sm">No hay auditorías registradas</p>
                            <Link href={`${standardPath}/auditorias/nueva`} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold" style={{ color: accentColor }}>
                                <Plus size={14} /> Crear primera auditoría
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {audits.map(audit => (
                                <div key={audit.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                                    <div>
                                        <div className="flex items-center gap-2 mb-0.5">
                                            {getStatusBadge(audit.status)}
                                            <span className="text-xs text-slate-400 font-mono">{audit.audit_code}</span>
                                        </div>
                                        <p className="text-sm text-slate-600">{formatDate(audit.audit_date)} · {audit.auditor_name || 'Sin auditor'}</p>
                                    </div>
                                    <div className="flex gap-1.5">
                                        <Link
                                            href={`${standardPath}/checklist?audit_id=${audit.id}`}
                                            className="text-xs px-2.5 py-1.5 rounded-lg font-semibold text-white hover:opacity-90 flex items-center gap-1"
                                            style={{ backgroundColor: accentColor }}
                                        >
                                            <ClipboardList size={12} /> Checklist
                                        </Link>
                                        <Link
                                            href={`${standardPath}/reporte?audit_id=${audit.id}`}
                                            className="text-xs px-2.5 py-1.5 rounded-lg font-semibold text-white bg-slate-600 hover:bg-slate-700 flex items-center gap-1"
                                        >
                                            <FileText size={12} /> Informe
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
