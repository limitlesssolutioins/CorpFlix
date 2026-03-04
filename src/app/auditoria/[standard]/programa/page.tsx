'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Plus, Printer, Calendar, Clock, CheckCircle2 } from 'lucide-react';

interface AuditStandard { id: number; code: string; name: string; full_name: string; color: string; }
interface AuditProgram {
    id?: number; standard_id?: number; year: number;
    objectives?: string; scope?: string; criteria?: string;
    resources?: string; methodology?: string;
    status?: string; approved_by?: string; approved_date?: string;
}
interface AuditRow {
    id: number; audit_code: string; audit_type_name: string;
    audit_date: string; auditor_name: string; status: string;
    team?: { name: string }[];
}

const STATUS_MAP: Record<string, { bg: string; label: string; icon: any }> = {
    PLANNED: { bg: 'bg-blue-100 text-blue-700', label: 'Planificada', icon: Calendar },
    IN_PROGRESS: { bg: 'bg-yellow-100 text-yellow-700', label: 'En Progreso', icon: Clock },
    COMPLETED: { bg: 'bg-green-100 text-green-700', label: 'Completada', icon: CheckCircle2 },
};

export default function ProgramaPage() {
    const params = useParams();
    const code = (params.standard as string).toUpperCase();
    const currentYear = new Date().getFullYear();

    const [standard, setStandard] = useState<AuditStandard | null>(null);
    const [year, setYear] = useState(currentYear);
    const [program, setProgram] = useState<AuditProgram | null>(null);
    const [formData, setFormData] = useState<Omit<AuditProgram, 'id' | 'standard_id' | 'year'>>({
        objectives: '', scope: '', criteria: '', resources: '', methodology: '', status: 'DRAFT', approved_by: '', approved_date: '',
    });
    const [audits, setAudits] = useState<AuditRow[]>([]);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/auditoria/standards')
            .then(r => r.json())
            .then((stds: AuditStandard[]) => setStandard(stds.find(s => s.code === code) || null));
    }, [code]);

    useEffect(() => {
        if (standard) loadData();
    }, [standard, year]);

    const loadData = async () => {
        if (!standard) return;
        setLoading(true);
        try {
            const [progRes, auditsRes] = await Promise.all([
                fetch(`/api/auditoria/programs?standard_id=${standard.id}&year=${year}`),
                fetch(`/api/auditoria/audits?standard_id=${standard.id}&year=${year}`),
            ]);
            const programs: AuditProgram[] = await progRes.json();
            const auditList: AuditRow[] = await auditsRes.json();

            const prog = programs[0] || null;
            setProgram(prog);
            if (prog) {
                setFormData({
                    objectives: prog.objectives || '',
                    scope: prog.scope || '',
                    criteria: prog.criteria || '',
                    resources: prog.resources || '',
                    methodology: prog.methodology || '',
                    status: prog.status || 'DRAFT',
                    approved_by: prog.approved_by || '',
                    approved_date: prog.approved_date || '',
                });
            } else {
                setFormData({ objectives: '', scope: '', criteria: '', resources: '', methodology: '', status: 'DRAFT', approved_by: '', approved_date: '' });
            }

            // Load teams
            const withTeams = await Promise.all((Array.isArray(auditList) ? auditList : []).map(async (a) => {
                try {
                    const r = await fetch(`/api/auditoria/audit-team?audit_id=${a.id}`);
                    const t = await r.json();
                    return { ...a, team: Array.isArray(t) ? t : [] };
                } catch { return { ...a, team: [] }; }
            }));
            setAudits(withTeams);
        } finally { setLoading(false); }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!standard) return;
        setSaving(true);
        try {
            const body = { ...formData, standard_id: standard.id, year, ...(program?.id ? { id: program.id } : {}) };
            const res = await fetch('/api/auditoria/programs', {
                method: program?.id ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            if (res.ok) {
                const saved = await res.json();
                setProgram(saved);
                alert('✅ Programa guardado correctamente');
            } else {
                alert('❌ Error al guardar');
            }
        } finally { setSaving(false); }
    };

    const accentColor = standard?.color || '#3b82f6';
    const standardPath = `/auditoria/${code.toLowerCase()}`;
    const formatDate = (d: string) => d ? new Date(d + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8 print:hidden">
                <Link href={standardPath} className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold mb-4 transition-colors">
                    <ArrowLeft size={20} /> Volver a {standard?.name || code}
                </Link>
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest text-white" style={{ backgroundColor: accentColor }}>
                                {standard?.name || code}
                            </div>
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 mb-1">Programa de Auditoría</h1>
                        <p className="text-slate-500 text-sm">Planificación anual de auditorías</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <select value={year} onChange={e => setYear(Number(e.target.value))}
                            className="px-4 py-2.5 border border-slate-300 rounded-xl font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                            {[currentYear - 1, currentYear, currentYear + 1].map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                        <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold text-sm">
                            <Printer size={16} /> Imprimir
                        </button>
                    </div>
                </div>
            </div>

            {/* Print header */}
            <div className="hidden print:block mb-8">
                <h1 className="text-2xl font-black text-slate-900">{standard?.full_name}</h1>
                <h2 className="text-xl font-bold text-slate-700 mt-1">Programa de Auditoría {year}</h2>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                {/* Program header */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <h2 className="text-base font-bold text-slate-900 mb-4">Información del Programa</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Objetivos del Programa</label>
                            <textarea rows={3} value={formData.objectives}
                                onChange={e => setFormData({ ...formData, objectives: e.target.value })}
                                placeholder="Objetivos que persigue el programa anual de auditorías..."
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Alcance</label>
                                <textarea rows={2} value={formData.scope}
                                    onChange={e => setFormData({ ...formData, scope: e.target.value })}
                                    placeholder="Áreas, procesos o capítulos de la norma incluidos..."
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Criterios</label>
                                <textarea rows={2} value={formData.criteria}
                                    onChange={e => setFormData({ ...formData, criteria: e.target.value })}
                                    placeholder="Normas, reglamentos, procedimientos de referencia..."
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Recursos</label>
                                <textarea rows={2} value={formData.resources}
                                    onChange={e => setFormData({ ...formData, resources: e.target.value })}
                                    placeholder="Recursos humanos, técnicos y financieros asignados..."
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Metodología</label>
                                <textarea rows={2} value={formData.methodology}
                                    onChange={e => setFormData({ ...formData, methodology: e.target.value })}
                                    placeholder="Método de auditoría, tipo de muestreo..."
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Estado</label>
                                <select value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                                    <option value="DRAFT">Borrador</option>
                                    <option value="APPROVED">Aprobado</option>
                                    <option value="CLOSED">Cerrado</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Aprobado por</label>
                                <input type="text" value={formData.approved_by}
                                    onChange={e => setFormData({ ...formData, approved_by: e.target.value })}
                                    placeholder="Nombre del aprobador"
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Fecha aprobación</label>
                                <input type="date" value={formData.approved_date}
                                    onChange={e => setFormData({ ...formData, approved_date: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 print:hidden">
                    <button type="submit" disabled={saving}
                        className="flex items-center gap-2 px-6 py-3 text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 text-sm"
                        style={{ backgroundColor: accentColor }}>
                        <Save size={16} />
                        {saving ? 'Guardando...' : 'Guardar Programa'}
                    </button>
                    <Link href={`${standardPath}/auditorias/nueva`}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 text-sm">
                        <Plus size={16} /> Nueva Auditoría
                    </Link>
                </div>
            </form>

            {/* Audits table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mt-6 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                    <h2 className="text-base font-bold text-slate-900">Auditorías Programadas — {year}</h2>
                    <span className="text-sm text-slate-500">{audits.length} auditoría{audits.length !== 1 ? 's' : ''}</span>
                </div>
                {loading ? (
                    <div className="flex items-center justify-center py-10">
                        <div className="w-8 h-8 border-4 border-slate-300 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : audits.length === 0 ? (
                    <div className="py-12 text-center text-slate-400">
                        <Calendar className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                        <p className="text-sm">No hay auditorías registradas para {year}</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50">
                                    <th className="text-left px-5 py-3 font-bold text-slate-600 text-xs uppercase tracking-wide">Código</th>
                                    <th className="text-left px-5 py-3 font-bold text-slate-600 text-xs uppercase tracking-wide">Tipo</th>
                                    <th className="text-left px-5 py-3 font-bold text-slate-600 text-xs uppercase tracking-wide">Fecha</th>
                                    <th className="text-left px-5 py-3 font-bold text-slate-600 text-xs uppercase tracking-wide">Equipo Auditor</th>
                                    <th className="text-left px-5 py-3 font-bold text-slate-600 text-xs uppercase tracking-wide">Estado</th>
                                    <th className="px-5 py-3 print:hidden" />
                                </tr>
                            </thead>
                            <tbody>
                                {audits.map((a, i) => {
                                    const s = STATUS_MAP[a.status] || STATUS_MAP.PLANNED;
                                    const Icon = s.icon;
                                    return (
                                        <tr key={a.id} className={`border-b border-slate-100 hover:bg-slate-50 ${i === audits.length - 1 ? 'border-0' : ''}`}>
                                            <td className="px-5 py-3 font-mono text-slate-500 text-xs">{a.audit_code}</td>
                                            <td className="px-5 py-3 font-semibold text-slate-800">{a.audit_type_name || 'Interna'}</td>
                                            <td className="px-5 py-3 text-slate-600">{formatDate(a.audit_date)}</td>
                                            <td className="px-5 py-3">
                                                {a.team && a.team.length > 0 ? (
                                                    <div className="flex flex-wrap gap-1">
                                                        {a.team.map((m: any, mi: number) => (
                                                            <span key={mi} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">{m.name}</span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400">{a.auditor_name || '—'}</span>
                                                )}
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${s.bg}`}>
                                                    <Icon size={10} /> {s.label}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 print:hidden">
                                                <Link href={`${standardPath}/plan?audit_id=${a.id}`}
                                                    className="text-xs px-3 py-1.5 rounded-lg font-semibold text-white hover:opacity-90 inline-flex items-center gap-1"
                                                    style={{ backgroundColor: accentColor }}>
                                                    Ver plan
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
