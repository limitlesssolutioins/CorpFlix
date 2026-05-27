'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Printer, CheckCircle2, XCircle, Lightbulb, AlertTriangle, Pencil, Loader2, TrendingUp } from 'lucide-react';

interface CompanyInfo { company_name?: string; nit?: string; logo?: string; sector?: string; city?: string; address?: string; email?: string; phone?: string; }
interface AuditInfo {
    id: number; audit_code: string; auditor_name: string; audit_date: string;
    scope: string; objectives: string; status: string; standard_name: string;
    standard_color: string; company_profile: string; standard_id: number;
}
interface ChecklistItem {
    id: number; requirement_code: string; requirement_title: string;
    requirement_description: string | null;
    chapter_id: number; chapter_number: string; chapter_title: string;
    weight: number; finding_type_id: number | null;
    finding_description: string | null; evidence: string | null; observations: string | null;
    is_op: number | null;
}
interface AuditProgram {
    id?: number; year: number; objectives?: string; scope?: string; criteria?: string;
    frequency?: string; audit_type?: string; responsible?: string; duration?: string; risks?: string;
}
interface AuditPlan {
    objective?: string; scope?: string; criteria?: string; methods?: string; resources?: string; risks?: string;
}
interface AuditReport {
    suitability?: string; effectiveness?: string; convenience?: string; risks?: string; summary?: string;
}
interface TeamMember { name: string; role_in_audit: string; email: string; }

const CUMPLE_ID = 1;
const NC_ID = 2;
const OPPORTUNITY_ID = 3;
const FORTALEZA_ID = 4;

function groupByChapter(items: ChecklistItem[]) {
    const map = new Map<number, { chapter_id: number; chapter_number: string; chapter_title: string; items: ChecklistItem[] }>();
    for (const item of items) {
        if (!map.has(item.chapter_id)) {
            map.set(item.chapter_id, { chapter_id: item.chapter_id, chapter_number: item.chapter_number, chapter_title: item.chapter_title, items: [] });
        }
        map.get(item.chapter_id)!.items.push(item);
    }
    return Array.from(map.values()).sort((a, b) =>
        a.chapter_number.localeCompare(b.chapter_number, undefined, { numeric: true })
    );
}

export default function InformeDetallado() {
    const params = useParams();
    const searchParams = useSearchParams();
    const code = (params.standard as string).toUpperCase();
    const auditId = searchParams.get('audit_id');

    const [company, setCompany] = useState<CompanyInfo>({});
    const [audit, setAudit] = useState<AuditInfo | null>(null);
    const [items, setItems] = useState<ChecklistItem[]>([]);
    const [program, setProgram] = useState<AuditProgram | null>(null);
    const [plan, setPlan] = useState<AuditPlan | null>(null);
    const [report, setReport] = useState<AuditReport | null>(null);
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [savingReport, setSavingReport] = useState(false);

    useEffect(() => {
        if (auditId) loadData();
    }, [auditId]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [companyRes, auditRes, checklistRes, teamRes, reportRes] = await Promise.all([
                fetch('/api/admin/general').then(r => r.json()),
                fetch('/api/auditoria/audits').then(r => r.json()),
                fetch(`/api/auditoria/checklist?audit_id=${auditId}`).then(r => r.json()),
                fetch(`/api/auditoria/audit-team?audit_id=${auditId}`).then(r => r.json()),
                fetch(`/api/auditoria/reporte?audit_id=${auditId}`).then(r => r.json()),
            ]);
            
            setCompany(companyRes || {});
            const allAudits: AuditInfo[] = Array.isArray(auditRes) ? auditRes : [];
            const found = allAudits.find(a => a.id === parseInt(auditId!));
            if (found) {
                setAudit(found);
                // Fetch program and plan linked to this audit
                const auditYear = new Date(found.audit_date).getFullYear();
                const [progRes, planRes] = await Promise.all([
                    fetch(`/api/auditoria/programs?standard_id=${found.standard_id}&year=${auditYear}`).then(r => r.json()),
                    fetch(`/api/auditoria/plans?audit_id=${auditId}`).then(r => r.json()),
                ]);
                setProgram(Array.isArray(progRes) ? progRes[0] : null);
                setPlan(planRes?.plan || null);
            }
            setItems(Array.isArray(checklistRes) ? checklistRes : []);
            setTeam(Array.isArray(teamRes) ? teamRes : []);
            setReport(reportRes || { summary: '', risks: '', suitability: '', effectiveness: '', convenience: '' });
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveReport = async () => {
        if (!auditId || !report) return;
        setSavingReport(true);
        try {
            const res = await fetch('/api/auditoria/reporte', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ auditId, ...report }),
            });
            if (res.ok) {
                const saved = await res.json();
                setReport(saved);
                alert('Informe guardado correctamente');
            }
        } catch (e) {
            console.error(e);
        } finally {
            setSavingReport(false);
        }
    };

    const chapters = groupByChapter(items);
    const total = items.length;
    const evaluated = items.filter(i => i.finding_type_id !== null).length;
    const cumpleCount = items.filter(i => i.finding_type_id === CUMPLE_ID).length;
    const ncCount = items.filter(i => i.finding_type_id === NC_ID).length;
    const opCount = items.filter(i => i.finding_type_id === OPPORTUNITY_ID).length;
    const fortalezaCount = items.filter(i => i.finding_type_id === FORTALEZA_ID).length;
    const pctCumplimiento = evaluated > 0 ? Math.round(((cumpleCount + fortalezaCount + opCount) / evaluated) * 100) : 0;

    const ncItems = items.filter(i => i.finding_type_id === NC_ID);
    const opItems = items.filter(i => i.finding_type_id === OPPORTUNITY_ID);
    const fortalezaItems = items.filter(i => i.finding_type_id === FORTALEZA_ID);

    const leadAuditor = team.find(m => m.role_in_audit === 'Auditor Líder') || team[0];
    const auditTeam = team.filter(m => m.role_in_audit !== 'Auditor Líder');

    const formatDate = (d: string) => new Date(d).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    const today = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    const standardPath = `/auditoria/${code.toLowerCase()}`;

    const statusLabel = (s: string) => ({ PLANNED: 'Planificada', IN_PROGRESS: 'En Progreso', COMPLETED: 'Completada' }[s] || s);

    if (!auditId) return <div className="p-10 text-slate-500">Se requiere audit_id en la URL</div>;
    if (loading) return <div className="flex items-center justify-center min-h-[400px]"><div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    .no-print { display: none !important; }
                    body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
                    @page { margin: 1.8cm; size: A4; }
                    .page-break { page-break-before: always; }
                    .avoid-break { page-break-inside: avoid; }
                }
            `}} />

            {/* Toolbar */}
            <div className="no-print flex items-center gap-4 mb-6">
                <Link href={`${standardPath}/auditorias`} className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold transition-colors">
                    <ArrowLeft size={20} /> Volver
                </Link>
                <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-700 transition-colors ml-auto"
                >
                    <Printer size={18} /> Imprimir / Exportar PDF
                </button>
            </div>

            <div className="max-w-4xl mx-auto bg-white">

                {/* ═══════════════════════════════════════════
                    PORTADA
                ═══════════════════════════════════════════ */}
                <div className="min-h-[28cm] flex flex-col justify-between pb-8 border-b-2 border-slate-800 mb-8">
                    {/* Header */}
                    <div className="flex items-center justify-between py-5 border-b border-slate-200">
                        <div className="flex items-center gap-4">
                            <img src="/ISOLOGO.png" alt="Lidus" className="h-10 w-auto" onError={e => (e.currentTarget.style.display = 'none')} />
                            <div className="h-8 w-px bg-slate-300" />
                            {company.logo && (
                                <img src={company.logo} alt="Logo empresa" className="h-10 w-auto object-contain" onError={e => (e.currentTarget.style.display = 'none')} />
                            )}
                        </div>
                        <div className="text-right text-xs text-slate-400">
                            <div className="font-bold uppercase tracking-widest">Informe de Auditoría</div>
                            <div className="font-mono mt-0.5">{audit?.audit_code}</div>
                        </div>
                    </div>

                    {/* Title block */}
                    <div className="flex-1 flex flex-col justify-center py-12">
                        <div className="inline-block mb-4">
                            <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full text-white" style={{ backgroundColor: audit?.standard_color || '#3b82f6' }}>
                                {audit?.standard_name}
                            </span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 mb-3 leading-tight">
                            Informe de<br />Auditoría Interna
                        </h1>
                        <p className="text-xl text-slate-500 mb-8">{company.company_name || '[Empresa]'}</p>

                        <div className="grid grid-cols-3 gap-6 mt-4">
                            <div className="border-l-4 border-slate-800 pl-4">
                                <div className="text-xs font-black uppercase text-slate-400 mb-1">Auditor</div>
                                <div className="font-bold text-slate-800">{audit?.auditor_name || '—'}</div>
                            </div>
                            <div className="border-l-4 border-slate-800 pl-4">
                                <div className="text-xs font-black uppercase text-slate-400 mb-1">Fecha de Auditoría</div>
                                <div className="font-bold text-slate-800">{audit?.audit_date ? formatDate(audit.audit_date) : '—'}</div>
                            </div>
                            <div className="border-l-4 border-slate-800 pl-4">
                                <div className="text-xs font-black uppercase text-slate-400 mb-1">Estado</div>
                                <div className="font-bold text-slate-800">{audit ? statusLabel(audit.status) : '—'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Footer portada */}
                    <div className="text-xs text-slate-400 flex justify-between">
                        <span>{company.company_name} · {company.nit}</span>
                        <span>Generado el {today}</span>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════
                    1. INFORMACIÓN GENERAL
                ═══════════════════════════════════════════ */}
                <div className="mb-8 avoid-break">
                    <h2 className="text-base font-black text-slate-800 uppercase tracking-widest mb-4 pb-2 border-b-2 border-slate-800">
                        1. Información General
                    </h2>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-xs font-black uppercase text-slate-400 mb-2">Empresa Auditada</h3>
                            <table className="w-full text-sm">
                                <tbody className="divide-y divide-slate-100">
                                    <tr><td className="py-1.5 font-semibold text-slate-500 pr-3 w-28">Razón Social</td><td className="py-1.5 font-bold text-slate-800">{company.company_name || '—'}</td></tr>
                                    <tr><td className="py-1.5 font-semibold text-slate-500 pr-3">NIT</td><td className="py-1.5 text-slate-700">{company.nit || '—'}</td></tr>
                                    <tr><td className="py-1.5 font-semibold text-slate-500 pr-3">Sector</td><td className="py-1.5 text-slate-700">{company.sector || '—'}</td></tr>
                                    <tr><td className="py-1.5 font-semibold text-slate-500 pr-3">Ciudad</td><td className="py-1.5 text-slate-700">{company.city || '—'}</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <h3 className="text-xs font-black uppercase text-slate-400 mb-2">Datos de la Auditoría</h3>
                            <table className="w-full text-sm">
                                <tbody className="divide-y divide-slate-100">
                                    <tr><td className="py-1.5 font-semibold text-slate-500 pr-3 w-28">Código</td><td className="py-1.5 font-mono font-bold text-slate-800">{audit?.audit_code}</td></tr>
                                    <tr><td className="py-1.5 font-semibold text-slate-500 pr-3">Auditor Líder</td><td className="py-1.5 font-bold text-slate-800">{leadAuditor?.name || audit?.auditor_name || '—'}</td></tr>
                                    <tr><td className="py-1.5 font-semibold text-slate-500 pr-3">Equipo Auditor</td><td className="py-1.5 text-slate-700">{auditTeam.map(t => t.name).join(', ') || '—'}</td></tr>
                                    <tr><td className="py-1.5 font-semibold text-slate-500 pr-3">Criterios</td><td className="py-1.5 text-slate-700">{plan?.criteria || program?.criteria || audit?.standard_name}</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mt-4">
                        <div>
                            <div className="text-xs font-black uppercase text-slate-400 mb-1">Objetivos de la Auditoría</div>
                            <p className="text-sm text-slate-700 leading-relaxed">{plan?.objective || audit?.objectives || '—'}</p>
                        </div>
                        <div>
                            <div className="text-xs font-black uppercase text-slate-400 mb-1">Alcance</div>
                            <p className="text-sm text-slate-700 leading-relaxed">{plan?.scope || audit?.scope || '—'}</p>
                        </div>
                    </div>

                    <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="text-xs font-black uppercase text-slate-400 mb-2">Descripción del Proceso de Auditoría</div>
                        <p className="text-sm text-slate-700 leading-relaxed italic">
                            {report?.summary || 'La auditoría se realizó siguiendo el plan establecido, cubriendo los procesos y áreas definidos en el alcance mediante entrevistas, revisión documental y observación directa.'}
                        </p>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════
                    2. RESUMEN DE RESULTADOS
                ═══════════════════════════════════════════ */}
                <div className="mb-8 avoid-break">
                    <h2 className="text-base font-black text-slate-800 uppercase tracking-widest mb-4 pb-2 border-b-2 border-slate-800">
                        2. Resumen de Resultados
                    </h2>
                    <div className="grid grid-cols-5 gap-3 mb-5">
                        <div className="border border-slate-200 rounded-xl p-3 text-center">
                            <div className="text-xl font-black text-slate-700">{evaluated}<span className="text-xs font-normal text-slate-400">/{total}</span></div>
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Evaluados</div>
                        </div>
                        <div className="border border-blue-200 bg-blue-50 rounded-xl p-3 text-center">
                            <div className="text-xl font-black text-blue-700">{fortalezaCount}</div>
                            <div className="text-[10px] font-bold text-blue-600 uppercase">Fortalezas</div>
                        </div>
                        <div className="border border-emerald-200 bg-emerald-50 rounded-xl p-3 text-center">
                            <div className="text-xl font-black text-emerald-700">{cumpleCount}</div>
                            <div className="text-[10px] font-bold text-emerald-600 uppercase">Cumplen</div>
                        </div>
                        <div className="border border-amber-200 bg-amber-50 rounded-xl p-3 text-center">
                            <div className="text-xl font-black text-amber-700">{opCount}</div>
                            <div className="text-[10px] font-bold text-amber-600 uppercase">Oportunidades</div>
                        </div>
                        <div className="border border-red-200 bg-red-50 rounded-xl p-3 text-center">
                            <div className="text-xl font-black text-red-700">{ncCount}</div>
                            <div className="text-[10px] font-bold text-red-600 uppercase">No Conf.</div>
                        </div>
                    </div>

                    {/* Tabla capítulos */}
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="bg-slate-100 text-slate-700">
                                <th className="text-left p-2.5 font-semibold border border-slate-200">Capítulo</th>
                                <th className="text-center p-2.5 font-semibold border border-slate-200 w-16">Total</th>
                                <th className="text-center p-2.5 font-semibold border border-slate-200 w-16">Fort.</th>
                                <th className="text-center p-2.5 font-semibold border border-slate-200 w-16">C</th>
                                <th className="text-center p-2.5 font-semibold border border-slate-200 w-16 text-amber-700">OP</th>
                                <th className="text-center p-2.5 font-semibold border border-slate-200 w-16 text-red-700">NC</th>
                                <th className="text-center p-2.5 font-semibold border border-slate-200 w-16">%</th>
                            </tr>
                        </thead>
                        <tbody>
                            {chapters.map((ch, i) => {
                                const chEval = ch.items.filter(r => r.finding_type_id !== null).length;
                                const chFort = ch.items.filter(r => r.finding_type_id === FORTALEZA_ID).length;
                                const chCumple = ch.items.filter(r => r.finding_type_id === CUMPLE_ID).length;
                                const chOP = ch.items.filter(r => r.finding_type_id === OPPORTUNITY_ID).length;
                                const chNC = ch.items.filter(r => r.finding_type_id === NC_ID).length;
                                const pct = chEval > 0 ? Math.round(((chCumple + chFort + chOP) / chEval) * 100) : 0;
                                return (
                                    <tr key={ch.chapter_id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                        <td className="p-2 border border-slate-200">
                                            <span className="font-bold">{ch.chapter_number}.</span> {ch.chapter_title}
                                        </td>
                                        <td className="p-2 border border-slate-200 text-center">{ch.items.length}</td>
                                        <td className="p-2 border border-slate-200 text-center text-blue-700 font-bold">{chFort || '—'}</td>
                                        <td className="p-2 border border-slate-200 text-center text-emerald-700 font-bold">{chCumple || '—'}</td>
                                        <td className="p-2 border border-slate-200 text-center text-amber-700 font-bold">{chOP || '—'}</td>
                                        <td className="p-2 border border-slate-200 text-center text-red-700 font-bold">{chNC || '—'}</td>
                                        <td className="p-2 border border-slate-200 text-center font-bold">{chEval > 0 ? `${pct}%` : '—'}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* ═══════════════════════════════════════════
                    3. HALLAZGOS DETALLADOS
                ═══════════════════════════════════════════ */}
                
                {/* FORTALEZAS */}
                {fortalezaItems.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-base font-black text-slate-800 uppercase tracking-widest mb-4 pb-2 border-b-2 border-slate-800">
                            3. Fortalezas ({fortalezaCount})
                        </h2>
                        <div className="grid grid-cols-1 gap-3">
                            {fortalezaItems.map((item, idx) => (
                                <div key={item.id} className="avoid-break border border-blue-200 rounded-xl p-4 bg-blue-50/30">
                                    <div className="flex items-start gap-3">
                                        <span className="shrink-0 bg-blue-700 text-white text-xs font-black px-2 py-0.5 rounded font-mono">{item.requirement_code}</span>
                                        <div className="flex-1">
                                            <p className="font-bold text-slate-900 text-sm">{item.requirement_title}</p>
                                            <p className="text-sm text-slate-700 mt-2">{item.finding_description || item.observations || 'Sin descripción detallada.'}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* OPORTUNIDADES */}
                {opItems.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-base font-black text-slate-800 uppercase tracking-widest mb-4 pb-2 border-b-2 border-slate-800">
                            4. Oportunidades de Mejora ({opCount})
                        </h2>
                        <div className="space-y-3">
                            {opItems.map((item, idx) => (
                                <div key={item.id} className="avoid-break border border-amber-200 rounded-xl p-4 bg-amber-50/30">
                                    <div className="flex items-start gap-3">
                                        <span className="shrink-0 bg-amber-600 text-white text-xs font-black px-2 py-0.5 rounded font-mono">{item.requirement_code}</span>
                                        <div className="flex-1">
                                            <p className="font-bold text-slate-900 text-sm">{item.requirement_title}</p>
                                            <p className="text-sm text-slate-700 mt-2 italic">"{item.finding_description || item.observations}"</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* NO CONFORMIDADES */}
                {ncItems.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-base font-black text-slate-800 uppercase tracking-widest mb-4 pb-2 border-b-2 border-slate-800">
                            5. No Conformidades ({ncCount})
                        </h2>
                        <div className="space-y-4">
                            {ncItems.map((item, idx) => (
                                <div key={item.id} className="avoid-break border border-red-200 rounded-xl p-4 bg-red-50/30">
                                    <div className="flex items-start gap-3 mb-3">
                                        <span className="shrink-0 bg-red-700 text-white text-xs font-black px-2 py-0.5 rounded font-mono">{item.requirement_code}</span>
                                        <div className="flex-1">
                                            <p className="font-bold text-slate-900 text-sm">{item.requirement_title}</p>
                                            <p className="text-xs text-slate-500 mt-0.5">{item.chapter_number}. {item.chapter_title}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3 ml-0">
                                        <div className="bg-white rounded-lg p-3 border border-red-100">
                                            <div className="text-[10px] font-black text-red-500 uppercase mb-1">Descripción del Hallazgo</div>
                                            <p className="text-sm text-slate-700">{item.finding_description || 'Sin descripción.'}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-white rounded-lg p-3 border border-slate-100">
                                                <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Evidencia / Soporte</div>
                                                <p className="text-xs text-slate-700">{item.evidence || 'Ver registros del proceso.'}</p>
                                            </div>
                                            <div className="bg-white rounded-lg p-3 border border-slate-100">
                                                <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Observaciones</div>
                                                <p className="text-xs text-slate-700">{item.observations || '—'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ═══════════════════════════════════════════
                    6. CONCLUSIONES
                ═══════════════════════════════════════════ */}
                <div className="mb-8 avoid-break">
                    <h2 className="text-base font-black text-slate-800 uppercase tracking-widest mb-4 pb-2 border-b-2 border-slate-800">
                        6. Conclusiones del Sistema
                    </h2>
                    
                    <div className="space-y-4">
                        <div className="border-l-4 border-emerald-500 pl-4 py-1">
                            <h4 className="text-xs font-black uppercase text-slate-400 mb-1">Adecuación del Sistema</h4>
                            <p className="text-sm text-slate-700 italic">
                                {report?.suitability || 'El sistema de gestión se considera adecuado para los propósitos de la organización y cumple con la estructura requerida por la norma.'}
                            </p>
                        </div>
                        <div className="border-l-4 border-blue-500 pl-4 py-1">
                            <h4 className="text-xs font-black uppercase text-slate-400 mb-1">Eficacia del Sistema</h4>
                            <p className="text-sm text-slate-700 italic">
                                {report?.effectiveness || 'Se evidencia una implementación eficaz de los controles evaluados, logrando los resultados planificados en la mayoría de los procesos.'}
                            </p>
                        </div>
                        <div className="border-l-4 border-amber-500 pl-4 py-1">
                            <h4 className="text-xs font-black uppercase text-slate-400 mb-1">Conveniencia del Sistema</h4>
                            <p className="text-sm text-slate-700 italic">
                                {report?.convenience || 'El sistema sigue siendo conveniente para la mejora continua y el cumplimiento de los objetivos estratégicos de la empresa.'}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 leading-relaxed mb-6">
                        <div className="text-xs font-black uppercase text-slate-400 mb-2">Resumen Ejecutivo</div>
                        <p>
                            La auditoría interna realizada a <strong>{company.company_name || '[Empresa]'}</strong> bajo los criterios de la norma <strong>{audit?.standard_name}</strong> arrojó un nivel de cumplimiento del <strong>{pctCumplimiento}%</strong>.
                            Se identificaron <strong>{fortalezaCount}</strong> fortalezas y <strong>{opCount}</strong> oportunidades de mejora.
                            {ncCount > 0 ? ` Asimismo, se registraron ${ncCount} no conformidades que requieren acciones correctivas inmediatas.` : ' No se registraron no conformidades durante este ciclo.'}
                        </p>
                        {report?.risks && (
                            <div className="mt-4 pt-4 border-t border-slate-200">
                                <div className="text-xs font-black uppercase text-red-400 mb-1">Riesgos Identificados</div>
                                <p className="text-xs text-slate-500">{report.risks}</p>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-16 mt-12">
                        <div className="text-center">
                            <div className="border-b border-slate-400 mb-2 pb-12"></div>
                            <p className="text-sm font-bold text-slate-800">{leadAuditor?.name || audit?.auditor_name || 'Auditor'}</p>
                            <p className="text-xs text-slate-500">Auditor Responsable</p>
                            <p className="text-[10px] text-slate-400 mt-1">{audit?.audit_date ? formatDate(audit.audit_date) : ''}</p>
                        </div>
                        <div className="text-center">
                            <div className="border-b border-slate-400 mb-2 pb-12"></div>
                            <p className="text-sm font-bold text-slate-800">Representante de la Dirección</p>
                            <p className="text-xs text-slate-500">{company.company_name || '[Empresa]'}</p>
                            <p className="text-[10px] text-slate-400 mt-1">{today}</p>
                        </div>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════
                    SECCIÓN DE EDICIÓN (SOLO PANTALLA)
                ═══════════════════════════════════════════ */}
                <div className="no-print mt-20 p-8 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-300">
                    <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                        <Pencil size={20} className="text-blue-500" />
                        Finalizar Conclusiones del Informe
                    </h2>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Descripción General de la Auditoría</label>
                            <textarea rows={3} value={report?.summary || ''}
                                onChange={e => setReport(r => r ? { ...r, summary: e.target.value } : null)}
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Relato de cómo se desarrolló la auditoría..."
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Adecuación</label>
                                <textarea rows={4} value={report?.suitability || ''}
                                    onChange={e => setReport(r => r ? { ...r, suitability: e.target.value } : null)}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Eficacia</label>
                                <textarea rows={4} value={report?.effectiveness || ''}
                                    onChange={e => setReport(r => r ? { ...r, effectiveness: e.target.value } : null)}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Conveniencia</label>
                                <textarea rows={4} value={report?.convenience || ''}
                                    onChange={e => setReport(r => r ? { ...r, convenience: e.target.value } : null)}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Riesgos Identificados</label>
                            <textarea rows={2} value={report?.risks || ''}
                                onChange={e => setReport(r => r ? { ...r, risks: e.target.value } : null)}
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <button onClick={handleSaveReport} disabled={savingReport}
                            className="w-full py-4 bg-slate-900 text-white rounded-xl font-black hover:bg-slate-800 transition-colors disabled:opacity-50">
                            {savingReport ? 'Guardando...' : 'Guardar Informe y Finalizar'}
                        </button>
                    </div>
                </div>

                {/* Pie de página */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-400">
                    <span>Generado por Lidus · lidus.app</span>
                    <span>{audit?.audit_code} · {audit?.standard_name} · {today}</span>
                </div>
            </div>
        </>
    );
}
