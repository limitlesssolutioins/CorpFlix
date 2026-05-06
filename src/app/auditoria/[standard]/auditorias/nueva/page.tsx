'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Users, X, Plus, ExternalLink } from 'lucide-react';

interface AuditStandard { id: number; code: string; name: string; color: string; }
interface Auditor { id: number; name: string; role: string; area: string; email: string; status: string; }
interface TeamMember { auditorId: number; roleInAudit: string; name: string; role: string; }

const ROLES_IN_AUDIT = ['Auditor Líder', 'Auditor', 'Observador', 'Experto Técnico'];

export default function NuevaAuditoriaStandardPage() {
    const params = useParams();
    const router = useRouter();
    const code = (params.standard as string).toUpperCase();

    const [standard, setStandard] = useState<AuditStandard | null>(null);
    const [formData, setFormData] = useState({
        audit_date: new Date().toISOString().split('T')[0],
        scope: '',
        objectives: '',
        criteria: '',
        audit_type_id: 1,
        company_profile: '',
    });
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [allAuditors, setAllAuditors] = useState<Auditor[]>([]);
    const [showTeamModal, setShowTeamModal] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetch('/api/auditoria/standards')
            .then(r => r.json())
            .then((stds: AuditStandard[]) => setStandard(stds.find(s => s.code === code) || null));
        fetch('/api/auditoria/auditors')
            .then(r => r.json())
            .then((data: Auditor[]) => setAllAuditors(Array.isArray(data) ? data.filter(a => a.status === 'ACTIVE') : []));
    }, [code]);

    const isRes0312 = code === 'RES0312';
    const accentColor = standard?.color || '#3b82f6';
    const standardPath = `/auditoria/${code.toLowerCase()}`;

    const toggleAuditor = (a: Auditor) => {
        if (team.find(m => m.auditorId === a.id)) {
            setTeam(team.filter(m => m.auditorId !== a.id));
        } else {
            setTeam([...team, { auditorId: a.id, roleInAudit: 'Auditor', name: a.name, role: a.role }]);
        }
    };

    const updateRoleInAudit = (auditorId: number, roleInAudit: string) => {
        setTeam(team.map(m => m.auditorId === auditorId ? { ...m, roleInAudit } : m));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.audit_date) {
            alert('Por favor ingresa la fecha de auditoría');
            return;
        }
        if (isRes0312 && !formData.company_profile) {
            alert('Para Res. 0312 debes seleccionar el tamaño de la empresa');
            return;
        }

        setSaving(true);
        try {
            const auditorName = team.map(m => m.name).join(', ') || '';
            const res = await fetch('/api/auditoria/audits', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    auditor_name: auditorName,
                    standard_id: standard?.id,
                    status: 'PLANNED',
                }),
            });

            if (res.ok) {
                const newAudit = await res.json();
                // Save team if members selected
                if (team.length > 0) {
                    await fetch('/api/auditoria/audit-team', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            auditId: newAudit.id,
                            members: team.map(m => ({ auditorId: m.auditorId, roleInAudit: m.roleInAudit })),
                        }),
                    });
                }
                router.push(`${standardPath}/auditorias`);
            } else {
                alert('❌ Error al crear auditoría');
            }
        } catch {
            alert('❌ Error al crear auditoría');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8">
                <Link href={`${standardPath}/auditorias`}
                    className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold mb-4 transition-colors">
                    <ArrowLeft size={20} /> Volver a Auditorías
                </Link>
                <div className="flex items-center gap-3 mb-2">
                    <div className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest text-white"
                        style={{ backgroundColor: accentColor }}>
                        {standard?.name || code}
                    </div>
                </div>
                <h1 className="text-3xl font-black text-slate-900 mb-1">Nueva Auditoría</h1>
                <p className="text-slate-500">Planifica una nueva auditoría para {standard?.name}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <h2 className="text-base font-bold text-slate-900 mb-4">Información General</h2>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                                    Fecha de Auditoría <span className="text-red-500">*</span>
                                </label>
                                <input type="date" required
                                    value={formData.audit_date}
                                    onChange={e => setFormData({ ...formData, audit_date: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Tipo de Auditoría</label>
                                <select
                                    value={formData.audit_type_id}
                                    onChange={e => setFormData({ ...formData, audit_type_id: Number(e.target.value) })}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                >
                                    <option value={1}>Interna</option>
                                    <option value={2}>Externa</option>
                                    <option value={3}>Seguimiento</option>
                                    <option value={4}>Producto</option>
                                    <option value={5}>Proceso</option>
                                </select>
                            </div>
                        </div>

                        {/* Team picker */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-sm font-bold text-slate-700">Equipo Auditor</label>
                                <Link href="/auditoria/equipo" target="_blank"
                                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline font-semibold">
                                    <ExternalLink size={12} /> Gestionar directorio
                                </Link>
                            </div>

                            {team.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {team.map(m => (
                                        <div key={m.auditorId} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-full text-sm">
                                            <span className="font-semibold text-slate-800">{m.name}</span>
                                            <select value={m.roleInAudit}
                                                onChange={e => updateRoleInAudit(m.auditorId, e.target.value)}
                                                className="text-xs bg-transparent text-slate-500 border-none outline-none cursor-pointer">
                                                {ROLES_IN_AUDIT.map(r => <option key={r} value={r}>{r}</option>)}
                                            </select>
                                            <button type="button" onClick={() => setTeam(team.filter(t => t.auditorId !== m.auditorId))}
                                                className="text-slate-400 hover:text-red-500 transition-colors">
                                                <X size={13} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <button type="button" onClick={() => setShowTeamModal(true)}
                                className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-slate-400 hover:text-slate-700 transition-colors text-sm font-semibold w-full justify-center">
                                <Users size={16} /> Seleccionar del directorio
                                {allAuditors.length === 0 && <span className="text-xs text-slate-400">(sin auditores registrados)</span>}
                            </button>
                        </div>

                        {/* Res.0312 profile */}
                        {isRes0312 && (
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                                    Tamaño de la Empresa <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { value: '≤10', label: '≤ 10 trabajadores', sub: 'Riesgo I, II, III' },
                                        { value: '11-50', label: '11 - 50 trabajadores', sub: 'Riesgo IV, V' },
                                        { value: '>50', label: '> 50 trabajadores', sub: 'Cualquier riesgo' },
                                    ].map(opt => (
                                        <button key={opt.value} type="button"
                                            onClick={() => setFormData({ ...formData, company_profile: opt.value })}
                                            className={`p-3 rounded-xl border-2 text-left transition-all ${
                                                formData.company_profile === opt.value
                                                    ? 'border-red-500 bg-red-50'
                                                    : 'border-slate-200 hover:border-slate-300'
                                            }`}>
                                            <div className="font-bold text-sm text-slate-900">{opt.label}</div>
                                            <div className="text-xs text-slate-500 mt-0.5">{opt.sub}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Alcance</label>
                            <textarea rows={2}
                                value={formData.scope}
                                onChange={e => setFormData({ ...formData, scope: e.target.value })}
                                placeholder="Define el alcance de la auditoría (procesos, áreas, capítulos a auditar...)"
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Objetivos</label>
                            <textarea rows={2}
                                value={formData.objectives}
                                onChange={e => setFormData({ ...formData, objectives: e.target.value })}
                                placeholder="Describe los objetivos de la auditoría..."
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Criterios de Auditoría</label>
                            <textarea rows={2}
                                value={formData.criteria}
                                onChange={e => setFormData({ ...formData, criteria: e.target.value })}
                                placeholder="Normas, procedimientos o requisitos legales de referencia..."
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                            />
                        </div>
                    </div>
                </div>

                <button type="submit" disabled={saving}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 text-white rounded-xl font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: accentColor }}>
                    <Save size={20} />
                    {saving ? 'Creando...' : 'Crear Auditoría'}
                </button>
            </form>

            {/* Team picker modal */}
            {showTeamModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
                            <h2 className="text-lg font-bold text-slate-900">Seleccionar Auditores</h2>
                            <button onClick={() => setShowTeamModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="p-4 max-h-96 overflow-y-auto">
                            {allAuditors.length === 0 ? (
                                <div className="text-center py-8 text-slate-400">
                                    <Users className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                                    <p className="text-sm">No hay auditores en el directorio.</p>
                                    <Link href="/auditoria/equipo" target="_blank"
                                        className="mt-2 inline-flex items-center gap-1 text-blue-600 text-sm font-semibold hover:underline">
                                        <Plus size={14} /> Agregar auditores
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {allAuditors.map(a => {
                                        const selected = !!team.find(m => m.auditorId === a.id);
                                        return (
                                            <button key={a.id} type="button" onClick={() => toggleAuditor(a)}
                                                className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                                                    selected ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                                                }`}>
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${selected ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
                                                    {a.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-semibold text-slate-900 text-sm">{a.name}</div>
                                                    <div className="text-xs text-slate-400">{a.role}{a.area ? ` · ${a.area}` : ''}</div>
                                                </div>
                                                {selected && <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                </div>}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                        <div className="px-6 py-4 border-t border-slate-200">
                            <button onClick={() => setShowTeamModal(false)}
                                className="w-full px-4 py-2.5 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-700 text-sm">
                                Listo ({team.length} seleccionado{team.length !== 1 ? 's' : ''})
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
