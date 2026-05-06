'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Printer, CheckCircle2, XCircle, Lightbulb } from 'lucide-react';

interface CompanyInfo { company_name?: string; nit?: string; logo?: string; sector?: string; city?: string; }
interface AuditInfo {
    id: number; audit_code: string; auditor_name: string; audit_date: string;
    scope: string; objectives: string; status: string; standard_name: string;
    standard_color: string; full_name?: string;
}
interface ChecklistItem {
    id: number; requirement_code: string; requirement_title: string;
    chapter_id: number; chapter_number: string; chapter_title: string;
    weight: number; finding_type_id: number | null; is_op: number | null;
}

const CUMPLE_ID = 1;
const NC_ID = 3;

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

export default function AutoevaluacionPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const code = (params.standard as string).toUpperCase();
    const auditId = searchParams.get('audit_id');

    const [company, setCompany] = useState<CompanyInfo>({});
    const [audit, setAudit] = useState<AuditInfo | null>(null);
    const [items, setItems] = useState<ChecklistItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (auditId) loadData();
    }, [auditId]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [companyRes, auditRes, checklistRes] = await Promise.all([
                fetch('/api/admin/general').then(r => r.json()),
                fetch('/api/auditoria/audits').then(r => r.json()),
                fetch(`/api/auditoria/checklist?audit_id=${auditId}`).then(r => r.json()),
            ]);
            setCompany(companyRes || {});
            const allAudits: AuditInfo[] = Array.isArray(auditRes) ? auditRes : [];
            const found = allAudits.find(a => a.id === parseInt(auditId!));
            if (found) setAudit(found);
            setItems(Array.isArray(checklistRes) ? checklistRes : []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const chapters = groupByChapter(items);
    const total = items.length;
    const cumpleCount = items.filter(i => i.finding_type_id === CUMPLE_ID).length;
    const ncCount = items.filter(i => i.finding_type_id === NC_ID).length;
    const opCount = items.filter(i => i.is_op === 1).length;
    const evaluated = items.filter(i => i.finding_type_id !== null).length;
    const pctCumplimiento = evaluated > 0 ? Math.round((cumpleCount / evaluated) * 100) : 0;

    const formatDate = (d: string) => new Date(d).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    const today = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    const standardPath = `/auditoria/${code.toLowerCase()}`;

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
                }
            `}} />

            {/* Toolbar — hidden on print */}
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

            {/* ═══════════════════════════════════════
                DOCUMENTO IMPRIMIBLE
            ═══════════════════════════════════════ */}
            <div className="max-w-4xl mx-auto bg-white" id="doc-autoevaluacion">

                {/* ── ENCABEZADO ── */}
                <div className="flex items-center justify-between pb-5 border-b-2 border-slate-800 mb-6">
                    <div className="flex items-center gap-4">
                        <img src="/ISOLOGO.png" alt="Lidus" className="h-10 w-auto" onError={e => (e.currentTarget.style.display = 'none')} />
                        <div className="h-8 w-px bg-slate-300" />
                        {company.logo && (
                            <img src={company.logo} alt="Logo empresa" className="h-10 w-auto object-contain" onError={e => (e.currentTarget.style.display = 'none')} />
                        )}
                    </div>
                    <div className="text-right">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Documento de Autoevaluación</div>
                        <div className="text-xs text-slate-500 mt-0.5">{audit?.standard_name}</div>
                    </div>
                </div>

                {/* ── TÍTULO ── */}
                <div className="mb-7">
                    <h1 className="text-3xl font-black text-slate-900 mb-1">Autoevaluación del Sistema de Gestión</h1>
                    <p className="text-slate-500 text-sm">{audit?.standard_name} · {audit?.audit_code}</p>
                </div>

                {/* ── INFORMACIÓN GENERAL ── */}
                <div className="grid grid-cols-2 gap-6 mb-7 p-5 bg-slate-50 rounded-xl border border-slate-200">
                    <div>
                        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Empresa</div>
                        <table className="w-full text-sm">
                            <tbody className="divide-y divide-slate-100">
                                <tr><td className="py-1.5 font-semibold text-slate-500 pr-3 w-28">Razón Social</td><td className="py-1.5 text-slate-800 font-bold">{company.company_name || '—'}</td></tr>
                                <tr><td className="py-1.5 font-semibold text-slate-500 pr-3">NIT</td><td className="py-1.5 text-slate-700">{company.nit || '—'}</td></tr>
                                <tr><td className="py-1.5 font-semibold text-slate-500 pr-3">Sector</td><td className="py-1.5 text-slate-700">{company.sector || '—'}</td></tr>
                                <tr><td className="py-1.5 font-semibold text-slate-500 pr-3">Ciudad</td><td className="py-1.5 text-slate-700">{company.city || '—'}</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Auditoría</div>
                        <table className="w-full text-sm">
                            <tbody className="divide-y divide-slate-100">
                                <tr><td className="py-1.5 font-semibold text-slate-500 pr-3 w-28">Código</td><td className="py-1.5 font-mono text-slate-800">{audit?.audit_code}</td></tr>
                                <tr><td className="py-1.5 font-semibold text-slate-500 pr-3">Auditor</td><td className="py-1.5 text-slate-800 font-bold">{audit?.auditor_name || '—'}</td></tr>
                                <tr><td className="py-1.5 font-semibold text-slate-500 pr-3">Fecha</td><td className="py-1.5 text-slate-700">{audit?.audit_date ? formatDate(audit.audit_date) : '—'}</td></tr>
                                <tr><td className="py-1.5 font-semibold text-slate-500 pr-3">Norma</td><td className="py-1.5 text-slate-700">{audit?.standard_name}</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ── RESUMEN EJECUTIVO ── */}
                <div className="mb-7">
                    <h2 className="text-base font-black text-slate-800 uppercase tracking-widest mb-4 pb-2 border-b border-slate-200">Resumen Ejecutivo</h2>
                    <div className="grid grid-cols-4 gap-4">
                        <div className="border-2 border-emerald-200 bg-emerald-50 rounded-xl p-4 text-center">
                            <div className="text-3xl font-black text-emerald-700">{cumpleCount}</div>
                            <div className="text-xs font-bold text-emerald-600 mt-1">Requisitos que Cumplen</div>
                        </div>
                        <div className="border-2 border-red-200 bg-red-50 rounded-xl p-4 text-center">
                            <div className="text-3xl font-black text-red-700">{ncCount}</div>
                            <div className="text-xs font-bold text-red-600 mt-1">No Conformidades</div>
                        </div>
                        <div className="border-2 border-amber-200 bg-amber-50 rounded-xl p-4 text-center">
                            <div className="text-3xl font-black text-amber-700">{opCount}</div>
                            <div className="text-xs font-bold text-amber-600 mt-1">Oportunidades de Mejora</div>
                        </div>
                        <div className={`border-2 rounded-xl p-4 text-center ${pctCumplimiento >= 80 ? 'border-emerald-300 bg-emerald-50' : pctCumplimiento >= 50 ? 'border-yellow-300 bg-yellow-50' : 'border-red-300 bg-red-50'}`}>
                            <div className={`text-3xl font-black ${pctCumplimiento >= 80 ? 'text-emerald-700' : pctCumplimiento >= 50 ? 'text-yellow-700' : 'text-red-700'}`}>{pctCumplimiento}%</div>
                            <div className={`text-xs font-bold mt-1 ${pctCumplimiento >= 80 ? 'text-emerald-600' : pctCumplimiento >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>% Cumplimiento</div>
                        </div>
                    </div>
                </div>

                {/* ── CUMPLIMIENTO POR CAPÍTULO ── */}
                <div className="mb-7">
                    <h2 className="text-base font-black text-slate-800 uppercase tracking-widest mb-4 pb-2 border-b border-slate-200">Cumplimiento por Capítulo</h2>
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="bg-slate-800 text-white">
                                <th className="text-left p-3 rounded-tl-lg font-semibold">Capítulo</th>
                                <th className="text-center p-3 font-semibold w-24">Total Req.</th>
                                <th className="text-center p-3 font-semibold w-24">Cumplen</th>
                                <th className="text-center p-3 font-semibold w-20">NC</th>
                                <th className="text-center p-3 font-semibold w-20">OP</th>
                                <th className="text-center p-3 rounded-tr-lg font-semibold w-28">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {chapters.map((ch, i) => {
                                const chCumple = ch.items.filter(r => r.finding_type_id === CUMPLE_ID).length;
                                const chNC = ch.items.filter(r => r.finding_type_id === NC_ID).length;
                                const chOP = ch.items.filter(r => r.is_op === 1).length;
                                const allCumple = ch.items.length > 0 && ch.items.every(r => r.finding_type_id === CUMPLE_ID);
                                return (
                                    <tr key={ch.chapter_id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                        <td className="p-3 border-b border-slate-100">
                                            <span className="font-bold text-slate-700">{ch.chapter_number}.</span> {ch.chapter_title}
                                        </td>
                                        <td className="p-3 border-b border-slate-100 text-center text-slate-600">{ch.items.length}</td>
                                        <td className="p-3 border-b border-slate-100 text-center font-bold text-emerald-700">{chCumple}</td>
                                        <td className="p-3 border-b border-slate-100 text-center font-bold text-red-600">{chNC || '—'}</td>
                                        <td className="p-3 border-b border-slate-100 text-center font-bold text-amber-600">{chOP || '—'}</td>
                                        <td className="p-3 border-b border-slate-100 text-center">
                                            {allCumple ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                                                    <CheckCircle2 size={11} /> Conforme
                                                </span>
                                            ) : chNC > 0 ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                                                    <XCircle size={11} /> No Conforme
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs font-bold">
                                                    Parcial
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* ── DECLARACIÓN ── */}
                <div className="mb-10 p-5 border border-slate-300 rounded-xl bg-slate-50">
                    <h2 className="text-sm font-black text-slate-700 uppercase tracking-widest mb-3">Declaración</h2>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        La presente autoevaluación, realizada en cumplimiento de los requisitos de la norma <strong>{audit?.standard_name}</strong>, certifica que la organización <strong>{company.company_name || '[Empresa]'}</strong> ha completado el proceso de evaluación de conformidad de su sistema de gestión, con los resultados descritos en este documento. Los hallazgos identificados serán objeto de seguimiento y acciones correctivas según corresponda.
                    </p>
                    <p className="text-xs text-slate-400 mt-2">Documento generado el {today} · {evaluated} de {total} requisitos evaluados</p>
                </div>

                {/* ── FIRMAS ── */}
                <div className="grid grid-cols-2 gap-16 mt-8">
                    <div className="text-center">
                        <div className="border-b-2 border-slate-400 mb-2 pb-10"></div>
                        <p className="text-sm font-bold text-slate-800">{audit?.auditor_name || 'Auditor'}</p>
                        <p className="text-xs text-slate-500">Auditor Responsable</p>
                        <p className="text-xs text-slate-400 mt-1">{audit?.audit_date ? formatDate(audit.audit_date) : ''}</p>
                    </div>
                    <div className="text-center">
                        <div className="border-b-2 border-slate-400 mb-2 pb-10"></div>
                        <p className="text-sm font-bold text-slate-800">Representante Legal</p>
                        <p className="text-xs text-slate-500">{company.company_name || '[Empresa]'}</p>
                        <p className="text-xs text-slate-400 mt-1">{today}</p>
                    </div>
                </div>

                {/* Pie de página */}
                <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-400">
                    <span>Generado por Lidus · lidus.app</span>
                    <span>{audit?.audit_code} · {audit?.standard_name}</span>
                </div>
            </div>
        </>
    );
}
