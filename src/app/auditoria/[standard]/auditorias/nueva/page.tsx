'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

interface AuditStandard { id: number; code: string; name: string; color: string; }

export default function NuevaAuditoriaStandardPage() {
    const params = useParams();
    const router = useRouter();
    const code = (params.standard as string).toUpperCase();

    const [standard, setStandard] = useState<AuditStandard | null>(null);
    const [formData, setFormData] = useState({
        audit_date: new Date().toISOString().split('T')[0],
        auditor_name: '',
        scope: '',
        objectives: '',
        audit_type_id: 1,
        company_profile: '',
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetch('/api/auditoria/standards')
            .then(r => r.json())
            .then((stds: AuditStandard[]) => {
                const found = stds.find(s => s.code === code);
                setStandard(found || null);
            });
    }, [code]);

    const isRes0312 = code === 'RES0312';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.audit_date || !formData.auditor_name) {
            alert('Por favor completa los campos requeridos');
            return;
        }
        if (isRes0312 && !formData.company_profile) {
            alert('Para Res. 0312 debes seleccionar el tamaño de la empresa');
            return;
        }

        setSaving(true);
        try {
            const res = await fetch('/api/auditoria/audits', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    standard_id: standard?.id,
                    status: 'PLANNED',
                }),
            });

            if (res.ok) {
                const newAudit = await res.json();
                router.push(`/auditoria/${code.toLowerCase()}/checklist?audit_id=${newAudit.id}`);
            } else {
                alert('❌ Error al crear auditoría');
            }
        } catch {
            alert('❌ Error al crear auditoría');
        } finally {
            setSaving(false);
        }
    };

    const accentColor = standard?.color || '#3b82f6';
    const standardPath = `/auditoria/${code.toLowerCase()}`;

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8">
                <Link href={`${standardPath}/auditorias`}
                    className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold mb-4 transition-colors">
                    <ArrowLeft size={20} /> Volver a Auditorías
                </Link>
                <div className="flex items-center gap-3 mb-2">
                    <div
                        className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest text-white"
                        style={{ backgroundColor: accentColor }}
                    >
                        {standard?.name || code}
                    </div>
                </div>
                <h1 className="text-3xl font-black text-slate-900 mb-1">Nueva Auditoría</h1>
                <p className="text-slate-500">Planifica una nueva auditoría · Al guardar irás directamente al checklist</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <h2 className="text-base font-bold text-slate-900 mb-4">Información de la Auditoría</h2>
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
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                                    Tipo de Auditoría
                                </label>
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

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">
                                Auditor(es) <span className="text-red-500">*</span>
                            </label>
                            <input type="text" required
                                value={formData.auditor_name}
                                onChange={e => setFormData({ ...formData, auditor_name: e.target.value })}
                                placeholder="Nombre del auditor o equipo auditor"
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                        </div>

                        {/* Res. 0312 profile selector */}
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
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, company_profile: opt.value })}
                                            className={`p-3 rounded-xl border-2 text-left transition-all ${
                                                formData.company_profile === opt.value
                                                    ? 'border-red-500 bg-red-50'
                                                    : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                        >
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
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 text-white rounded-xl font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: accentColor }}
                >
                    <Save size={20} />
                    {saving ? 'Creando...' : 'Crear Auditoría e Ir al Checklist'}
                </button>
            </form>
        </div>
    );
}
