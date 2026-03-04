'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Plus, Trash2, Printer } from 'lucide-react';

interface AuditStandard { id: number; code: string; name: string; color: string; }
interface Audit { id: number; audit_code: string; audit_type_name: string; audit_date: string; auditor_name: string; status: string; }
interface TeamMember { auditor_id: number; name: string; role: string; role_in_audit: string; }
interface Activity {
    id?: number;
    activity_date: string;
    start_time: string;
    end_time: string;
    activity: string;
    process_area: string;
    auditor_ids: string;
    documents: string;
    sort_order?: number;
}

const emptyActivity = (): Activity => ({
    activity_date: '', start_time: '', end_time: '',
    activity: '', process_area: '', auditor_ids: '', documents: '',
});

function PlanContent() {
    const params = useParams();
    const searchParams = useSearchParams();
    const code = (params.standard as string).toUpperCase();
    const auditId = searchParams.get('audit_id');

    const [standard, setStandard] = useState<AuditStandard | null>(null);
    const [audit, setAudit] = useState<Audit | null>(null);
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [planData, setPlanData] = useState({
        opening_meeting_datetime: '',
        closing_meeting_datetime: '',
        location: '',
        criteria: '',
        documents_to_review: '',
        confidentiality: '',
    });
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetch('/api/auditoria/standards')
            .then(r => r.json())
            .then((stds: AuditStandard[]) => setStandard(stds.find(s => s.code === code) || null));
    }, [code]);

    useEffect(() => {
        if (auditId) loadData();
    }, [auditId]);

    const loadData = async () => {
        if (!auditId) return;
        setLoading(true);
        try {
            const [auditRes, teamRes, planRes] = await Promise.all([
                fetch(`/api/auditoria/audits`).then(r => r.json()),
                fetch(`/api/auditoria/audit-team?audit_id=${auditId}`).then(r => r.json()),
                fetch(`/api/auditoria/plans?audit_id=${auditId}`).then(r => r.json()),
            ]);

            const allAudits = Array.isArray(auditRes) ? auditRes : [];
            setAudit(allAudits.find((a: Audit) => a.id === Number(auditId)) || null);
            setTeam(Array.isArray(teamRes) ? teamRes : []);

            if (planRes?.plan) {
                const p = planRes.plan;
                setPlanData({
                    opening_meeting_datetime: p.opening_meeting_datetime || '',
                    closing_meeting_datetime: p.closing_meeting_datetime || '',
                    location: p.location || '',
                    criteria: p.criteria || '',
                    documents_to_review: p.documents_to_review || '',
                    confidentiality: p.confidentiality || '',
                });
            }
            setActivities(Array.isArray(planRes?.activities) && planRes.activities.length > 0
                ? planRes.activities
                : [emptyActivity()]);
        } finally { setLoading(false); }
    };

    const handleSave = async () => {
        if (!auditId) return;
        setSaving(true);
        try {
            const res = await fetch('/api/auditoria/plans', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    auditId: Number(auditId),
                    plan: planData,
                    activities: activities.filter(a => a.activity.trim()),
                }),
            });
            if (res.ok) {
                const data = await res.json();
                setActivities(data.activities?.length > 0 ? data.activities : [emptyActivity()]);
                alert('✅ Plan guardado correctamente');
            } else {
                alert('❌ Error al guardar');
            }
        } finally { setSaving(false); }
    };

    const addActivity = () => setActivities([...activities, emptyActivity()]);

    const updateActivity = (index: number, field: keyof Activity, value: string) => {
        setActivities(activities.map((a, i) => i === index ? { ...a, [field]: value } : a));
    };

    const removeActivity = (index: number) => {
        if (activities.length === 1) { setActivities([emptyActivity()]); return; }
        setActivities(activities.filter((_, i) => i !== index));
    };

    const accentColor = standard?.color || '#3b82f6';
    const standardPath = `/auditoria/${code.toLowerCase()}`;

    const formatDate = (d: string) => d ? new Date(d + (d.includes('T') ? '' : 'T00:00:00')).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

    if (!auditId) return (
        <div className="max-w-2xl mx-auto py-20 text-center">
            <p className="text-slate-500">No se especificó una auditoría. <Link href={`${standardPath}/auditorias`} className="text-blue-600 font-semibold">Volver a Auditorías</Link></p>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6 print:hidden">
                <Link href={`${standardPath}/auditorias`} className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold mb-4 transition-colors">
                    <ArrowLeft size={20} /> Volver a Auditorías
                </Link>
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest text-white" style={{ backgroundColor: accentColor }}>
                                {standard?.name || code}
                            </div>
                            {audit && <span className="text-xs font-mono text-slate-400">{audit.audit_code}</span>}
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 mb-1">Plan de Auditoría</h1>
                        {audit && <p className="text-slate-500 text-sm">{audit.audit_type_name || 'Auditoría'} · {formatDate(audit.audit_date)}</p>}
                    </div>
                    <div className="flex gap-2 print:hidden">
                        <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold text-sm">
                            <Printer size={16} /> Imprimir
                        </button>
                        <button onClick={handleSave} disabled={saving}
                            className="flex items-center gap-2 px-5 py-2.5 text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 text-sm"
                            style={{ backgroundColor: accentColor }}>
                            <Save size={16} />
                            {saving ? 'Guardando...' : 'Guardar Plan'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Print header */}
            <div className="hidden print:block mb-8">
                <h1 className="text-2xl font-black text-slate-900">Plan de Auditoría</h1>
                <p className="text-slate-600 mt-1">{standard?.name} · {audit?.audit_code} · {audit && formatDate(audit.audit_date)}</p>
            </div>

            {/* Team chips */}
            {team.length > 0 && (
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm mb-5">
                    <h2 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Equipo Auditor</h2>
                    <div className="flex flex-wrap gap-2">
                        {team.map(m => (
                            <div key={m.auditor_id} className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full">
                                <div className="w-6 h-6 rounded-full bg-slate-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                                    {m.name?.charAt(0).toUpperCase()}
                                </div>
                                <span className="font-semibold text-slate-800 text-sm">{m.name}</span>
                                <span className="text-xs text-slate-500">{m.role_in_audit || m.role}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="space-y-5">
                    {/* Meetings */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                        <h2 className="text-base font-bold text-slate-900 mb-4">Reuniones</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Reunión de Apertura</label>
                                <input type="datetime-local" value={planData.opening_meeting_datetime}
                                    onChange={e => setPlanData({ ...planData, opening_meeting_datetime: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Reunión de Cierre</label>
                                <input type="datetime-local" value={planData.closing_meeting_datetime}
                                    onChange={e => setPlanData({ ...planData, closing_meeting_datetime: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Lugar de la Auditoría</label>
                                <input type="text" value={planData.location}
                                    onChange={e => setPlanData({ ...planData, location: e.target.value })}
                                    placeholder="Instalaciones, sala de reuniones..."
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Criteria & documents */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                        <h2 className="text-base font-bold text-slate-900 mb-4">Criterios y Documentos</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Criterios de Auditoría</label>
                                <textarea rows={3} value={planData.criteria}
                                    onChange={e => setPlanData({ ...planData, criteria: e.target.value })}
                                    placeholder="Normas, procedimientos y requisitos legales de referencia..."
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Documentos a Revisar</label>
                                <textarea rows={3} value={planData.documents_to_review}
                                    onChange={e => setPlanData({ ...planData, documents_to_review: e.target.value })}
                                    placeholder="Lista de documentos, registros y evidencias requeridas..."
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Confidencialidad</label>
                                <textarea rows={2} value={planData.confidentiality}
                                    onChange={e => setPlanData({ ...planData, confidentiality: e.target.value })}
                                    placeholder="Declaración de confidencialidad y tratamiento de la información..."
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Activity agenda */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                            <h2 className="text-base font-bold text-slate-900">Agenda de Actividades</h2>
                            <button type="button" onClick={addActivity}
                                className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold text-sm hover:bg-slate-200 print:hidden">
                                <Plus size={15} /> Agregar actividad
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50">
                                        <th className="text-left px-3 py-3 font-bold text-slate-600 text-xs uppercase tracking-wide whitespace-nowrap">Fecha</th>
                                        <th className="text-left px-3 py-3 font-bold text-slate-600 text-xs uppercase tracking-wide whitespace-nowrap">Inicio</th>
                                        <th className="text-left px-3 py-3 font-bold text-slate-600 text-xs uppercase tracking-wide whitespace-nowrap">Fin</th>
                                        <th className="text-left px-3 py-3 font-bold text-slate-600 text-xs uppercase tracking-wide">Actividad</th>
                                        <th className="text-left px-3 py-3 font-bold text-slate-600 text-xs uppercase tracking-wide whitespace-nowrap">Proceso/Área</th>
                                        <th className="text-left px-3 py-3 font-bold text-slate-600 text-xs uppercase tracking-wide">Auditor(es)</th>
                                        <th className="text-left px-3 py-3 font-bold text-slate-600 text-xs uppercase tracking-wide">Documentos</th>
                                        <th className="px-3 py-3 print:hidden" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {activities.map((act, i) => (
                                        <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                                            <td className="px-3 py-2">
                                                <input type="date" value={act.activity_date}
                                                    onChange={e => updateActivity(i, 'activity_date', e.target.value)}
                                                    className="w-32 px-2 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                                                />
                                            </td>
                                            <td className="px-3 py-2">
                                                <input type="time" value={act.start_time}
                                                    onChange={e => updateActivity(i, 'start_time', e.target.value)}
                                                    className="w-24 px-2 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                                                />
                                            </td>
                                            <td className="px-3 py-2">
                                                <input type="time" value={act.end_time}
                                                    onChange={e => updateActivity(i, 'end_time', e.target.value)}
                                                    className="w-24 px-2 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                                                />
                                            </td>
                                            <td className="px-3 py-2">
                                                <input type="text" value={act.activity}
                                                    onChange={e => updateActivity(i, 'activity', e.target.value)}
                                                    placeholder="Descripción de la actividad"
                                                    className="w-48 px-2 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                                                />
                                            </td>
                                            <td className="px-3 py-2">
                                                <input type="text" value={act.process_area}
                                                    onChange={e => updateActivity(i, 'process_area', e.target.value)}
                                                    placeholder="Proceso o área"
                                                    className="w-32 px-2 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                                                />
                                            </td>
                                            <td className="px-3 py-2">
                                                <input type="text" value={act.auditor_ids}
                                                    onChange={e => updateActivity(i, 'auditor_ids', e.target.value)}
                                                    placeholder="Nombres auditores"
                                                    className="w-36 px-2 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                                                />
                                            </td>
                                            <td className="px-3 py-2">
                                                <input type="text" value={act.documents}
                                                    onChange={e => updateActivity(i, 'documents', e.target.value)}
                                                    placeholder="Docs requeridos"
                                                    className="w-36 px-2 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                                                />
                                            </td>
                                            <td className="px-3 py-2 print:hidden">
                                                <button type="button" onClick={() => removeActivity(i)}
                                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                    <Trash2 size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {activities.length === 0 && (
                            <div className="py-8 text-center text-slate-400 text-sm">
                                No hay actividades. <button type="button" onClick={addActivity} className="text-blue-600 font-semibold hover:underline">Agregar primera actividad</button>
                            </div>
                        )}
                    </div>

                    {/* Save button */}
                    <div className="flex justify-end print:hidden pb-8">
                        <button onClick={handleSave} disabled={saving}
                            className="flex items-center gap-2 px-6 py-3 text-white rounded-xl font-bold hover:opacity-90 disabled:opacity-50"
                            style={{ backgroundColor: accentColor }}>
                            <Save size={18} />
                            {saving ? 'Guardando...' : 'Guardar Plan de Auditoría'}
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                @media print {
                    nav, header, aside, .print\\:hidden { display: none !important; }
                    body { font-size: 11px; }
                    .print\\:block { display: block !important; }
                    table { page-break-inside: avoid; }
                }
            `}</style>
        </div>
    );
}

export default function PlanPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>}>
            <PlanContent />
        </Suspense>
    );
}
