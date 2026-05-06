'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Printer, CheckCircle2, XCircle, Lightbulb, AlertTriangle } from 'lucide-react';

interface CompanyInfo { company_name?: string; nit?: string; logo?: string; sector?: string; city?: string; address?: string; email?: string; phone?: string; }
interface AuditInfo {
    id: number; audit_code: string; auditor_name: string; audit_date: string;
    scope: string; objectives: string; status: string; standard_name: string;
    standard_color: string; company_profile: string;
}
interface ChecklistItem {
    id: number; requirement_code: string; requirement_title: string;
    requirement_description: string | null;
    chapter_id: number; chapter_number: string; chapter_title: string;
    weight: number; finding_type_id: number | null;
    finding_description: string | null; evidence: string | null; observations: string | null;
    is_op: number | null;
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

export default function InformeDetallado() {
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
    const evaluated = items.filter(i => i.finding_type_id !== null).length;
    const cumpleCount = items.filter(i => i.finding_type_id === CUMPLE_ID).length;
    const ncCount = items.filter(i => i.finding_type_id === NC_ID).length;
    const opCount = items.filter(i => i.is_op === 1).length;
    const pctCumplimiento = evaluated > 0 ? Math.round((cumpleCount / evaluated) * 100) : 0;

    const ncItems = items.filter(i => i.finding_type_id === NC_ID);
    const opItems = items.filter(i => i.is_op === 1);

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
                                    <tr><td className="py-1.5 font-semibold text-slate-500 pr-3">Norma</td><td className="py-1.5 font-bold text-slate-800">{audit?.standard_name}</td></tr>
                                    <tr><td className="py-1.5 font-semibold text-slate-500 pr-3">Auditor</td><td className="py-1.5 text-slate-700">{audit?.auditor_name || '—'}</td></tr>
                                    <tr><td className="py-1.5 font-semibold text-slate-500 pr-3">Fecha</td><td className="py-1.5 text-slate-700">{audit?.audit_date ? formatDate(audit.audit_date) : '—'}</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {audit?.objectives && (
                        <div className="mt-4">
                            <div className="text-xs font-black uppercase text-slate-400 mb-1">Objetivos</div>
                            <p className="text-sm text-slate-700 leading-relaxed">{audit.objectives}</p>
                        </div>
                    )}
                    {audit?.scope && (
                        <div className="mt-3">
                            <div className="text-xs font-black uppercase text-slate-400 mb-1">Alcance</div>
                            <p className="text-sm text-slate-700 leading-relaxed">{audit.scope}</p>
                        </div>
                    )}
                </div>

                {/* ═══════════════════════════════════════════
                    2. RESUMEN DE RESULTADOS
                ═══════════════════════════════════════════ */}
                <div className="mb-8 avoid-break">
                    <h2 className="text-base font-black text-slate-800 uppercase tracking-widest mb-4 pb-2 border-b-2 border-slate-800">
                        2. Resumen de Resultados
                    </h2>
                    <div className="grid grid-cols-4 gap-4 mb-5">
                        <div className="border-2 border-slate-200 rounded-xl p-4 text-center">
                            <div className="text-2xl font-black text-slate-700">{evaluated}<span className="text-base font-normal text-slate-400">/{total}</span></div>
                            <div className="text-xs font-bold text-slate-500 mt-1">Evaluados</div>
                        </div>
                        <div className="border-2 border-emerald-200 bg-emerald-50 rounded-xl p-4 text-center">
                            <div className="text-2xl font-black text-emerald-700">{cumpleCount}</div>
                            <div className="text-xs font-bold text-emerald-600 mt-1">Cumplen</div>
                        </div>
                        <div className="border-2 border-red-200 bg-red-50 rounded-xl p-4 text-center">
                            <div className="text-2xl font-black text-red-700">{ncCount}</div>
                            <div className="text-xs font-bold text-red-600 mt-1">No Conformidades</div>
                        </div>
                        <div className={`border-2 rounded-xl p-4 text-center ${pctCumplimiento >= 80 ? 'border-emerald-300 bg-emerald-50' : pctCumplimiento >= 50 ? 'border-yellow-300 bg-yellow-50' : 'border-red-300 bg-red-50'}`}>
                            <div className={`text-2xl font-black ${pctCumplimiento >= 80 ? 'text-emerald-700' : pctCumplimiento >= 50 ? 'text-yellow-700' : 'text-red-700'}`}>{pctCumplimiento}%</div>
                            <div className={`text-xs font-bold mt-1 ${pctCumplimiento >= 80 ? 'text-emerald-600' : pctCumplimiento >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>Cumplimiento</div>
                        </div>
                    </div>

                    {/* Tabla capítulos */}
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="bg-slate-100 text-slate-700">
                                <th className="text-left p-2.5 font-semibold border border-slate-200">Capítulo</th>
                                <th className="text-center p-2.5 font-semibold border border-slate-200 w-20">Req.</th>
                                <th className="text-center p-2.5 font-semibold border border-slate-200 w-20">Cumple</th>
                                <th className="text-center p-2.5 font-semibold border border-slate-200 w-16">NC</th>
                                <th className="text-center p-2.5 font-semibold border border-slate-200 w-16">OP</th>
                                <th className="text-center p-2.5 font-semibold border border-slate-200 w-20">%</th>
                                <th className="text-center p-2.5 font-semibold border border-slate-200 w-28">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {chapters.map((ch, i) => {
                                const chEval = ch.items.filter(r => r.finding_type_id !== null).length;
                                const chCumple = ch.items.filter(r => r.finding_type_id === CUMPLE_ID).length;
                                const chNC = ch.items.filter(r => r.finding_type_id === NC_ID).length;
                                const chOP = ch.items.filter(r => r.is_op === 1).length;
                                const pct = chEval > 0 ? Math.round((chCumple / chEval) * 100) : 0;
                                const allCumple = ch.items.length > 0 && ch.items.every(r => r.finding_type_id === CUMPLE_ID);
                                return (
                                    <tr key={ch.chapter_id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                        <td className="p-2.5 border border-slate-200">
                                            <span className="font-bold">{ch.chapter_number}.</span> {ch.chapter_title}
                                        </td>
                                        <td className="p-2.5 border border-slate-200 text-center">{ch.items.length}</td>
                                        <td className="p-2.5 border border-slate-200 text-center text-emerald-700 font-bold">{chCumple}</td>
                                        <td className="p-2.5 border border-slate-200 text-center text-red-700 font-bold">{chNC || '—'}</td>
                                        <td className="p-2.5 border border-slate-200 text-center text-amber-700 font-bold">{chOP || '—'}</td>
                                        <td className="p-2.5 border border-slate-200 text-center font-bold">{chEval > 0 ? `${pct}%` : '—'}</td>
                                        <td className="p-2.5 border border-slate-200 text-center">
                                            {allCumple ? (
                                                <span className="text-emerald-700 font-bold text-xs">✓ Conforme</span>
                                            ) : chNC > 0 ? (
                                                <span className="text-red-700 font-bold text-xs">✗ No Conforme</span>
                                            ) : (
                                                <span className="text-slate-400 text-xs">Parcial</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* ═══════════════════════════════════════════
                    3. NO CONFORMIDADES
                ═══════════════════════════════════════════ */}
                {ncItems.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-base font-black text-slate-800 uppercase tracking-widest mb-4 pb-2 border-b-2 border-slate-800">
                            3. No Conformidades ({ncCount})
                        </h2>
                        <div className="space-y-3">
                            {ncItems.map((item, idx) => (
                                <div key={item.id} className="avoid-break border border-red-200 rounded-xl p-4 bg-red-50">
                                    <div className="flex items-start gap-3 mb-2">
                                        <span className="shrink-0 bg-red-700 text-white text-xs font-black px-2 py-0.5 rounded font-mono">{item.requirement_code}</span>
                                        <div className="flex-1">
                                            <p className="font-bold text-slate-900 text-sm">{item.requirement_title}</p>
                                            <p className="text-xs text-slate-500 mt-0.5">{item.chapter_number}. {item.chapter_title}</p>
                                        </div>
                                        <span className="text-xs font-black text-red-700 bg-red-100 border border-red-300 px-2 py-0.5 rounded-full shrink-0">NC #{idx + 1}</span>
                                    </div>
                                    <div className="grid grid-cols-1 gap-2 mt-3 ml-0 text-sm">
                                        {item.finding_description && (
                                            <div className="bg-white rounded-lg p-3 border border-red-100">
                                                <div className="text-xs font-black text-red-500 uppercase mb-1">Descripción de la No Conformidad</div>
                                                <p className="text-slate-700">{item.finding_description}</p>
                                            </div>
                                        )}
                                        {item.evidence && (
                                            <div className="bg-white rounded-lg p-3 border border-slate-100">
                                                <div className="text-xs font-black text-slate-400 uppercase mb-1">Evidencia</div>
                                                <p className="text-slate-700">{item.evidence}</p>
                                            </div>
                                        )}
                                        {item.observations && (
                                            <div className="bg-white rounded-lg p-3 border border-slate-100">
                                                <div className="text-xs font-black text-slate-400 uppercase mb-1">Observaciones</div>
                                                <p className="text-slate-700">{item.observations}</p>
                                            </div>
                                        )}
                                        <div className="bg-white rounded-lg p-3 border border-orange-100">
                                            <div className="text-xs font-black text-orange-500 uppercase mb-1">Acción Correctiva Requerida</div>
                                            <div className="grid grid-cols-3 gap-3 mt-1 text-xs text-slate-500">
                                                <div>Responsable: <span className="border-b border-slate-300 inline-block w-20"></span></div>
                                                <div>Fecha límite: <span className="border-b border-slate-300 inline-block w-20"></span></div>
                                                <div>Estado: <span className="border-b border-slate-300 inline-block w-16"></span></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ═══════════════════════════════════════════
                    4. OPORTUNIDADES DE MEJORA
                ═══════════════════════════════════════════ */}
                {opItems.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-base font-black text-slate-800 uppercase tracking-widest mb-4 pb-2 border-b-2 border-slate-800">
                            {ncItems.length > 0 ? '4' : '3'}. Oportunidades de Mejora ({opCount})
                        </h2>
                        <div className="space-y-3">
                            {opItems.map((item, idx) => (
                                <div key={item.id} className="avoid-break border border-amber-200 rounded-xl p-4 bg-amber-50">
                                    <div className="flex items-start gap-3">
                                        <span className="shrink-0 bg-amber-600 text-white text-xs font-black px-2 py-0.5 rounded font-mono">{item.requirement_code}</span>
                                        <div className="flex-1">
                                            <p className="font-bold text-slate-900 text-sm">{item.requirement_title}</p>
                                            <p className="text-xs text-slate-500 mt-0.5">{item.chapter_number}. {item.chapter_title}</p>
                                            {item.observations && (
                                                <p className="text-sm text-slate-700 mt-2 bg-white rounded-lg p-2 border border-amber-100">
                                                    {item.observations}
                                                </p>
                                            )}
                                        </div>
                                        <span className="text-xs font-black text-amber-700 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full shrink-0">OP #{idx + 1}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {ncItems.length === 0 && opItems.length === 0 && evaluated > 0 && (
                    <div className="mb-8 p-5 border-2 border-emerald-200 rounded-xl bg-emerald-50 text-center avoid-break">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                        <p className="font-bold text-emerald-800">Sin No Conformidades ni Oportunidades de Mejora identificadas</p>
                        <p className="text-sm text-emerald-600 mt-1">Todos los requisitos evaluados cumplen con los criterios de la norma</p>
                    </div>
                )}

                {/* ═══════════════════════════════════════════
                    5. CONCLUSIONES Y FIRMA
                ═══════════════════════════════════════════ */}
                <div className="mb-8 avoid-break">
                    <h2 className="text-base font-black text-slate-800 uppercase tracking-widest mb-4 pb-2 border-b-2 border-slate-800">
                        {ncItems.length > 0 && opItems.length > 0 ? '5' : ncItems.length > 0 || opItems.length > 0 ? '4' : '3'}. Conclusiones
                    </h2>
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 leading-relaxed mb-6">
                        <p>
                            La auditoría interna realizada a <strong>{company.company_name || '[Empresa]'}</strong> bajo los criterios de la norma <strong>{audit?.standard_name}</strong> arrojó un nivel de cumplimiento del <strong>{pctCumplimiento}%</strong> ({cumpleCount} de {evaluated} requisitos evaluados).
                            {ncCount > 0 && ` Se identificaron ${ncCount} No Conformidad${ncCount > 1 ? 'es' : ''} que requieren${ncCount > 1 ? '' : ''} acciones correctivas.`}
                            {opCount > 0 && ` Se identificaron además ${opCount} Oportunidad${opCount > 1 ? 'es' : ''} de Mejora que el equipo debería considerar implementar.`}
                        </p>
                        <p className="mt-3 text-xs text-slate-400">
                            Informe generado el {today} · {evaluated} de {total} requisitos evaluados
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-16">
                        <div className="text-center">
                            <div className="border-b-2 border-slate-400 mb-2 pb-12"></div>
                            <p className="text-sm font-bold text-slate-800">{audit?.auditor_name || 'Auditor'}</p>
                            <p className="text-xs text-slate-500">Auditor Responsable</p>
                            <p className="text-xs text-slate-400 mt-1">{audit?.audit_date ? formatDate(audit.audit_date) : ''}</p>
                        </div>
                        <div className="text-center">
                            <div className="border-b-2 border-slate-400 mb-2 pb-12"></div>
                            <p className="text-sm font-bold text-slate-800">Representante de la Dirección</p>
                            <p className="text-xs text-slate-500">{company.company_name || '[Empresa]'}</p>
                            <p className="text-xs text-slate-400 mt-1">{today}</p>
                        </div>
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
