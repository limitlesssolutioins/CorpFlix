'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Printer, CheckCircle2, XCircle, Lightbulb, ShieldCheck } from 'lucide-react';

interface CompanyInfo { company_name?: string; nit?: string; logo?: string; sector?: string; city?: string; }
interface AuditInfo {
    id: number; audit_code: string; auditor_name: string; audit_date: string;
    scope: string; objectives: string; criteria: string; status: string;
    standard_name: string; standard_color: string; full_name?: string;
}
interface ChecklistItem {
    id: number; requirement_code: string; requirement_title: string;
    chapter_id: number; chapter_number: string; chapter_title: string;
    weight: number; finding_type_id: number | null; is_op: number | null;
    finding_description: string | null; responsible: string | null;
}
interface TeamMember { name: string; role_in_audit: string; }

const CUMPLE_ID = 1;
const NC_ID = 3;

function groupByChapter(items: ChecklistItem[]) {
    const map = new Map<number, { chapter_number: string; chapter_title: string; items: ChecklistItem[] }>();
    for (const item of items) {
        if (!map.has(item.chapter_id)) {
            map.set(item.chapter_id, { chapter_number: item.chapter_number, chapter_title: item.chapter_title, items: [] });
        }
        map.get(item.chapter_id)!.items.push(item);
    }
    return Array.from(map.values()).sort((a, b) =>
        a.chapter_number.localeCompare(b.chapter_number, undefined, { numeric: true })
    );
}

export default function CertificadoPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const code = (params.standard as string).toUpperCase();
    const auditId = searchParams.get('audit_id');

    const [company, setCompany] = useState<CompanyInfo>({});
    const [audit, setAudit] = useState<AuditInfo | null>(null);
    const [items, setItems] = useState<ChecklistItem[]>([]);
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auditId) return;
        const load = async () => {
            try {
                const [companyRes, auditsRes, checklistRes] = await Promise.all([
                    fetch('/api/admin/general').then(r => r.json()).catch(() => ({})),
                    fetch('/api/auditoria/audits').then(r => r.json()),
                    fetch(`/api/auditoria/checklist?audit_id=${auditId}`).then(r => r.json()),
                ]);

                const companyData = companyRes?.general || companyRes || {};
                setCompany(companyData);

                const allAudits: AuditInfo[] = Array.isArray(auditsRes) ? auditsRes : [];
                const found = allAudits.find(a => a.id === parseInt(auditId!));
                if (found) {
                    setAudit(found);
                    // Load team
                    const teamRes = await fetch(`/api/auditoria/audit-team?audit_id=${auditId}`).then(r => r.json()).catch(() => []);
                    setTeam(Array.isArray(teamRes) ? teamRes : []);
                }

                const cl: ChecklistItem[] = Array.isArray(checklistRes) ? checklistRes.filter((i: any) => i.is_auditable === 1) : [];
                setItems(cl);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        load();
    }, [auditId]);

    if (!auditId) return (
        <div className="text-center py-20">
            <p className="text-slate-500">Se requiere audit_id en la URL</p>
        </div>
    );

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    const evaluated = items.filter(i => i.finding_type_id !== null).length;
    const cumpleCount = items.filter(i => i.finding_type_id === CUMPLE_ID).length;
    const ncCount = items.filter(i => i.finding_type_id === NC_ID).length;
    const opCount = items.filter(i => i.is_op === 1).length;
    const pct = evaluated > 0 ? Math.round((cumpleCount / evaluated) * 100) : 0;
    const chapters = groupByChapter(items);

    const accentColor = audit?.standard_color || '#3b82f6';
    const standardPath = `/auditoria/${code.toLowerCase()}`;

    const formatDate = (d?: string) => d
        ? new Date(d).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
        : '—';

    const issuedDate = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

    const resultLabel = pct >= 80 ? 'SATISFACTORIO' : pct >= 60 ? 'ACEPTABLE' : 'REQUIERE MEJORA';
    const resultColor = pct >= 80 ? '#22c55e' : pct >= 60 ? '#f59e0b' : '#ef4444';

    return (
        <div className="max-w-4xl mx-auto">
            {/* Screen controls — hidden on print */}
            <div className="print:hidden flex items-center justify-between mb-6">
                <Link href={`${standardPath}/auditorias`} className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-semibold text-sm">
                    <ArrowLeft size={16} /> Volver
                </Link>
                <button onClick={() => window.print()}
                    className="flex items-center gap-2 px-5 py-2.5 text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: accentColor }}>
                    <Printer size={16} /> Imprimir / PDF
                </button>
            </div>

            {/* CERTIFICATE DOCUMENT */}
            <div className="bg-white shadow-xl print:shadow-none" style={{ border: `3px solid ${accentColor}` }}>

                {/* Header stripe */}
                <div className="h-2" style={{ backgroundColor: accentColor }} />

                {/* Title section */}
                <div className="px-10 pt-8 pb-6 text-center border-b-2" style={{ borderColor: `${accentColor}30` }}>
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <ShieldCheck size={36} style={{ color: accentColor }} />
                        <div className="text-left">
                            <div className="text-xs font-black uppercase tracking-widest" style={{ color: accentColor }}>Certificado de</div>
                            <h1 className="text-2xl font-black text-slate-900 leading-tight">Auditoría Interna</h1>
                        </div>
                    </div>

                    <div className="inline-block px-6 py-2 rounded-full text-sm font-black text-white mb-2" style={{ backgroundColor: accentColor }}>
                        {audit?.standard_name || code}
                    </div>
                    <p className="text-xs text-slate-400 font-mono">N° {audit?.audit_code} · Emitido el {issuedDate}</p>
                </div>

                {/* Company + Audit info */}
                <div className="px-10 py-6 grid grid-cols-2 gap-8 border-b" style={{ borderColor: `${accentColor}20` }}>
                    <div>
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Organización auditada</p>
                        {company.logo && (
                            <img src={company.logo} alt="Logo" className="h-10 object-contain mb-2" />
                        )}
                        <p className="font-black text-slate-900 text-lg">{company.company_name || 'Sin nombre registrado'}</p>
                        {company.nit && <p className="text-sm text-slate-500">NIT: {company.nit}</p>}
                        {company.sector && <p className="text-sm text-slate-500">{company.sector}</p>}
                        {company.city && <p className="text-sm text-slate-500">{company.city}</p>}
                    </div>
                    <div>
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Datos de la auditoría</p>
                        <div className="space-y-1.5 text-sm">
                            <div className="flex gap-2">
                                <span className="font-bold text-slate-500 w-24 shrink-0">Norma:</span>
                                <span className="text-slate-800">{audit?.full_name || audit?.standard_name}</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="font-bold text-slate-500 w-24 shrink-0">Fecha:</span>
                                <span className="text-slate-800">{formatDate(audit?.audit_date)}</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="font-bold text-slate-500 w-24 shrink-0">Alcance:</span>
                                <span className="text-slate-800">{audit?.scope || '—'}</span>
                            </div>
                            {audit?.criteria && (
                                <div className="flex gap-2">
                                    <span className="font-bold text-slate-500 w-24 shrink-0">Criterios:</span>
                                    <span className="text-slate-800">{audit.criteria}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Audit team */}
                {team.length > 0 && (
                    <div className="px-10 py-4 border-b" style={{ borderColor: `${accentColor}20` }}>
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Equipo Auditor</p>
                        <div className="flex flex-wrap gap-3">
                            {team.map((m, i) => (
                                <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
                                    <span className="font-semibold text-slate-800 text-sm">{m.name}</span>
                                    <span className="text-xs text-slate-400">· {m.role_in_audit}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* RESULT */}
                <div className="px-10 py-6 border-b" style={{ borderColor: `${accentColor}20` }}>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Resultado de la Auditoría</p>

                    {/* Big compliance number */}
                    <div className="flex items-center gap-8 flex-wrap mb-5">
                        <div className="text-center">
                            <div className="text-6xl font-black" style={{ color: resultColor }}>{pct}%</div>
                            <div className="text-xs font-bold uppercase tracking-wide mt-1" style={{ color: resultColor }}>Cumplimiento</div>
                            <div className="text-sm font-black mt-0.5" style={{ color: resultColor }}>{resultLabel}</div>
                        </div>
                        <div className="flex-1 min-w-60">
                            <div className="w-full bg-slate-100 rounded-full h-4 mb-4">
                                <div className="h-4 rounded-full" style={{ width: `${pct}%`, backgroundColor: resultColor }} />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { label: 'Evaluados', value: evaluated, color: '#64748b' },
                                    { label: 'Conformidades', value: cumpleCount, color: '#22c55e' },
                                    { label: 'No Conformidades', value: ncCount, color: '#ef4444' },
                                    { label: 'Oport. de Mejora', value: opCount, color: '#f59e0b' },
                                ].map(s => (
                                    <div key={s.label} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ backgroundColor: `${s.color}12` }}>
                                        <span className="text-xs font-semibold text-slate-600">{s.label}</span>
                                        <span className="text-lg font-black" style={{ color: s.color }}>{s.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Compliance by chapter */}
                <div className="px-10 py-6 border-b" style={{ borderColor: `${accentColor}20` }}>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Cumplimiento por Capítulo</p>
                    <div className="space-y-2">
                        {chapters.map(ch => {
                            const ev = ch.items.filter(i => i.finding_type_id !== null).length;
                            const conf = ch.items.filter(i => i.finding_type_id === CUMPLE_ID).length;
                            const nc = ch.items.filter(i => i.finding_type_id === NC_ID).length;
                            const chPct = ev > 0 ? Math.round((conf / ev) * 100) : null;
                            const bar = chPct === null ? '#94a3b8' : chPct >= 80 ? '#22c55e' : chPct >= 60 ? '#eab308' : '#ef4444';
                            return (
                                <div key={ch.chapter_number} className="grid grid-cols-12 items-center gap-3 py-1">
                                    <div className="col-span-5 flex items-center gap-2 min-w-0">
                                        <span className="text-xs font-mono font-black text-slate-400 shrink-0">{ch.chapter_number}</span>
                                        <span className="text-xs text-slate-700 truncate">{ch.chapter_title}</span>
                                    </div>
                                    <div className="col-span-5">
                                        <div className="w-full bg-slate-100 rounded-full h-2">
                                            <div className="h-2 rounded-full" style={{ width: `${chPct ?? 0}%`, backgroundColor: bar }} />
                                        </div>
                                    </div>
                                    <div className="col-span-1 text-xs font-black text-right" style={{ color: bar }}>
                                        {chPct !== null ? `${chPct}%` : '—'}
                                    </div>
                                    <div className="col-span-1 text-right">
                                        {nc > 0 && <span className="text-xs font-bold text-red-600">{nc} NC</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* NC list */}
                {ncCount > 0 && (
                    <div className="px-10 py-6 border-b" style={{ borderColor: `${accentColor}20` }}>
                        <p className="text-xs font-black uppercase tracking-widest text-red-500 mb-3">No Conformidades Detectadas ({ncCount})</p>
                        <div className="space-y-2">
                            {items.filter(i => i.finding_type_id === NC_ID).map(item => (
                                <div key={item.id} className="flex items-start gap-2 p-2.5 bg-red-50 border border-red-100 rounded-lg">
                                    <XCircle size={13} className="text-red-500 shrink-0 mt-0.5" />
                                    <div className="text-xs min-w-0">
                                        <span className="font-mono font-black text-red-700 mr-2">{item.requirement_code}</span>
                                        <span className="text-slate-700">{item.requirement_title}</span>
                                        {item.finding_description && (
                                            <p className="text-slate-500 mt-0.5 italic">{item.finding_description}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Opportunities */}
                {opCount > 0 && (
                    <div className="px-10 py-6 border-b" style={{ borderColor: `${accentColor}20` }}>
                        <p className="text-xs font-black uppercase tracking-widest text-amber-600 mb-3">Oportunidades de Mejora ({opCount})</p>
                        <div className="space-y-1.5">
                            {items.filter(i => i.is_op === 1).map(item => (
                                <div key={item.id} className="flex items-start gap-2 p-2 bg-amber-50 border border-amber-100 rounded-lg">
                                    <Lightbulb size={12} className="text-amber-500 shrink-0 mt-0.5" />
                                    <div className="text-xs">
                                        <span className="font-mono font-black text-amber-700 mr-1">{item.requirement_code}</span>
                                        <span className="text-slate-700">{item.requirement_title}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Signatures */}
                <div className="px-10 py-8">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-8 text-center">Firmas y Aprobación</p>
                    <div className="grid grid-cols-2 gap-12">
                        {/* Auditor signature */}
                        <div className="text-center">
                            <div className="border-t-2 border-slate-400 pt-3 mt-16">
                                <p className="font-bold text-slate-800 text-sm">{audit?.auditor_name || '_______________________'}</p>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    {team.find(m => m.role_in_audit === 'Auditor Líder')?.name ? 'Auditor Líder' : 'Auditor Interno'}
                                </p>
                                <p className="text-xs text-slate-400 mt-0.5">{formatDate(audit?.audit_date)}</p>
                            </div>
                        </div>
                        {/* Management signature */}
                        <div className="text-center">
                            <div className="border-t-2 border-slate-400 pt-3 mt-16">
                                <p className="font-bold text-slate-800 text-sm">_______________________</p>
                                <p className="text-xs text-slate-500 mt-0.5">Representante de la Dirección</p>
                                <p className="text-xs text-slate-400 mt-0.5">{issuedDate}</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-10 pt-4 border-t border-slate-100 text-center">
                        <p className="text-xs text-slate-400">
                            Este certificado fue generado el {issuedDate} por el Sistema de Gestión Lidus.
                            Documento de uso interno conforme a la norma {audit?.standard_name || code}.
                        </p>
                    </div>
                </div>

                <div className="h-2" style={{ backgroundColor: accentColor }} />
            </div>

            {/* Print styles */}
            <style>{`
                @media print {
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    @page { margin: 1cm; size: A4 portrait; }
                }
            `}</style>
        </div>
    );
}
