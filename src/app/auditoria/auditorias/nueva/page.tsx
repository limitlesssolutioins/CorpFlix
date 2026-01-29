'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';

export default function NuevaAuditoriaPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        audit_date: new Date().toISOString().split('T')[0],
        auditor_name: '',
        scope: '',
        objectives: '',
        audit_type_id: 1
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.audit_date || !formData.auditor_name) {
            alert('Por favor completa los campos requeridos');
            return;
        }

        setSaving(true);
        try {
            const response = await fetch('/api/auditoria/audits', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    status: 'PLANNED'
                })
            });

            if (response.ok) {
                const newAudit = await response.json();
                alert('✅ Auditoría creada exitosamente');
                router.push(`/auditoria/hallazgos?audit_id=${newAudit.id}`);
            } else {
                alert('❌ Error al crear auditoría');
            }
        } catch (error) {
            console.error('Error creating audit:', error);
            alert('❌ Error al crear auditoría');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <Link
                    href="/auditoria/auditorias"
                    className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold mb-4 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Volver a Auditorías
                </Link>
                <h1 className="text-3xl font-black text-slate-900 mb-2">Nueva Auditoría</h1>
                <p className="text-slate-600">
                    Planifica una nueva auditoría interna del sistema de gestión
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">Información de la Auditoría</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Fecha de Auditoría <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={formData.audit_date}
                                onChange={(e) => setFormData({ ...formData, audit_date: e.target.value })}
                                required
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Auditor(es) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.auditor_name}
                                onChange={(e) => setFormData({ ...formData, auditor_name: e.target.value })}
                                placeholder="Nombre del auditor o equipo auditor"
                                required
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Tipo de Auditoría
                            </label>
                            <select
                                value={formData.audit_type_id}
                                onChange={(e) => setFormData({ ...formData, audit_type_id: Number(e.target.value) })}
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value={1}>Interna</option>
                                <option value={2}>Externa</option>
                                <option value={3}>Seguimiento</option>
                                <option value={4}>Producto</option>
                                <option value={5}>Proceso</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Alcance
                            </label>
                            <textarea
                                value={formData.scope}
                                onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                                rows={3}
                                placeholder="Define el alcance de la auditoría (procesos, áreas, capítulos ISO a auditar...)"
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Objetivos
                            </label>
                            <textarea
                                value={formData.objectives}
                                onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                                rows={3}
                                placeholder="Describe los objetivos de la auditoría..."
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save size={24} />
                        {saving ? 'Creando...' : 'Crear Auditoría y Registrar Hallazgos'}
                    </button>
                </div>
            </form>
        </div>
    );
}
