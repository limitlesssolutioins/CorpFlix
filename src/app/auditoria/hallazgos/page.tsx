'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Save, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

interface Chapter {
    id: number;
    chapter_number: string;
    chapter_title: string;
}

interface Requirement {
    id: number;
    requirement_code: string;
    requirement_title: string;
}

interface FindingType {
    id: number;
    type_code: string;
    type_name: string;
    color: string;
}

function HallazgosContent() {
    const searchParams = useSearchParams();
    const auditId = searchParams.get('audit_id');

    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [requirements, setRequirements] = useState<Requirement[]>([]);
    const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
    const [selectedRequirement, setSelectedRequirement] = useState<number | null>(null);
    const [findingTypeId, setFindingTypeId] = useState<number>(1);
    const [description, setDescription] = useState('');
    const [evidence, setEvidence] = useState('');
    const [observations, setObservations] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [auditInfo, setAuditInfo] = useState<any>(null);

    const findingTypes = [
        { id: 1, type_code: 'C', type_name: 'CONFORMIDAD', color: '#10b981' },
        { id: 2, type_code: 'O', type_name: 'OBSERVACIÓN', color: '#f59e0b' },
        { id: 3, type_code: 'NC_MENOR', type_name: 'NO CONFORMIDAD MENOR', color: '#f97316' },
        { id: 4, type_code: 'NC_MAYOR', type_name: 'NO CONFORMIDAD MAYOR', color: '#ef4444' }
    ];

    useEffect(() => {
        fetchChapters();
        if (auditId) {
            fetchAuditInfo();
        }
    }, [auditId]);

    useEffect(() => {
        if (selectedChapter) {
            fetchRequirements(selectedChapter);
        }
    }, [selectedChapter]);

    const fetchAuditInfo = async () => {
        if (!auditId) return;
        try {
            const response = await fetch(`/api/auditoria/audits?id=${auditId}`);
            const data = await response.json();
            if (data.length > 0) {
                setAuditInfo(data[0]);
            }
        } catch (error) {
            console.error('Error fetching audit info:', error);
        }
    };

    const fetchChapters = async () => {
        try {
            const response = await fetch('/api/auditoria/chapters');
            const data = await response.json();
            setChapters(data);
        } catch (error) {
            console.error('Error fetching chapters:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRequirements = async (chapterId: number) => {
        try {
            const response = await fetch(`/api/auditoria/requirements?chapter_id=${chapterId}`);
            const data = await response.json();
            setRequirements(data);
        } catch (error) {
            console.error('Error fetching requirements:', error);
        }
    };

    const handleSave = async () => {
        if (!selectedRequirement) {
            alert('Por favor selecciona un requisito');
            return;
        }

        if (!auditId) {
            alert('Error: No se ha especificado una auditoría. Por favor crea una auditoría primero.');
            return;
        }

        setSaving(true);
        try {
            const response = await fetch('/api/auditoria/findings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    audit_id: parseInt(auditId),
                    requirement_id: selectedRequirement,
                    finding_type_id: findingTypeId,
                    finding_description: description,
                    evidence: evidence,
                    observations: observations
                })
            });

            if (response.ok) {
                alert('✅ Hallazgo registrado exitosamente');
                // Reset form
                setDescription('');
                setEvidence('');
                setObservations('');
                setSelectedRequirement(null);
            } else {
                alert('❌ Error al guardar hallazgo');
            }
        } catch (error) {
            console.error('Error saving finding:', error);
            alert('❌ Error al guardar hallazgo');
        } finally {
            setSaving(false);
        }
    };

    const selectedType = findingTypes.find(t => t.id === findingTypeId);

    return (
        <div className="max-w-6xl mx-auto">

            <div className="mb-8">
                <Link
                    href="/auditoria"
                    className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold mb-4 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Volver al Dashboard
                </Link>
                <h1 className="text-3xl font-black text-slate-900 mb-2">Registro de Hallazgos</h1>
                <p className="text-slate-600">
                    Documenta conformidades, no conformidades y observaciones por requisito ISO
                </p>
            </div>

            {/* Audit Info Banner */}
            {auditId && auditInfo && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                            <h3 className="font-bold text-blue-900 mb-1">Auditoría: {auditInfo.audit_code}</h3>
                            <p className="text-sm text-blue-800">
                                <strong>Auditor:</strong> {auditInfo.auditor_name} | <strong>Fecha:</strong> {new Date(auditInfo.audit_date).toLocaleDateString('es-ES')}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* No Audit Warning */}
            {!auditId && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                            <h3 className="font-bold text-yellow-900 mb-1">Sin auditoría seleccionada</h3>
                            <p className="text-sm text-yellow-800">
                                Por favor crea o selecciona una auditoría antes de registrar hallazgos.
                            </p>
                            <Link
                                href="/auditoria/auditorias/nueva"
                                className="inline-block mt-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-semibold"
                            >
                                Crear Nueva Auditoría
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
            ) : (
                <>
                    {/* Chapter Selection */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">1. Seleccionar Capítulo ISO 9001</h2>
                        <select
                            value={selectedChapter || ''}
                            onChange={(e) => {
                                setSelectedChapter(Number(e.target.value));
                                setSelectedRequirement(null);
                            }}
                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Selecciona un capítulo...</option>
                            {chapters.map((chapter) => (
                                <option key={chapter.id} value={chapter.id}>
                                    {chapter.chapter_number}. {chapter.chapter_title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Requirement Selection */}
                    {selectedChapter && (
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-6">
                            <h2 className="text-lg font-bold text-slate-900 mb-4">2. Seleccionar Requisito</h2>
                            <select
                                value={selectedRequirement || ''}
                                onChange={(e) => setSelectedRequirement(Number(e.target.value))}
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Selecciona un requisito...</option>
                                {requirements.map((req) => (
                                    <option key={req.id} value={req.id}>
                                        {req.requirement_code} - {req.requirement_title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Finding Type Selection */}
                    {selectedRequirement && (
                        <>
                            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-6">
                                <h2 className="text-lg font-bold text-slate-900 mb-4">3. Tipo de Hallazgo</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {findingTypes.map((type) => (
                                        <button
                                            key={type.id}
                                            onClick={() => setFindingTypeId(type.id)}
                                            className={`p-4 rounded-xl border-2 transition-all ${findingTypeId === type.id
                                                ? 'border-opacity-100 shadow-lg scale-105'
                                                : 'border-opacity-20 hover:border-opacity-40'
                                                }`}
                                            style={{
                                                borderColor: type.color,
                                                backgroundColor: findingTypeId === type.id ? type.color + '10' : 'transparent'
                                            }}
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }} />
                                                <span className="font-bold text-sm text-slate-900">{type.type_name}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Finding Details */}
                            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-6">
                                <h2 className="text-lg font-bold text-slate-900 mb-4">4. Detalles del Hallazgo</h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Descripción</label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            rows={3}
                                            placeholder="Describe el hallazgo encontrado..."
                                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Evidencia</label>
                                        <textarea
                                            value={evidence}
                                            onChange={(e) => setEvidence(e.target.value)}
                                            rows={2}
                                            placeholder="Registra la evidencia que respalda el hallazgo..."
                                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Observaciones</label>
                                        <textarea
                                            value={observations}
                                            onChange={(e) => setObservations(e.target.value)}
                                            rows={2}
                                            placeholder="Notas adicionales u observaciones..."
                                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Summary & Save */}
                            <div
                                className="p-6 rounded-xl border-2 mb-6"
                                style={{
                                    borderColor: selectedType?.color + '40',
                                    backgroundColor: selectedType?.color + '10'
                                }}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    {selectedType?.type_code === 'C' && <CheckCircle2 className="w-6 h-6" style={{ color: selectedType.color }} />}
                                    {selectedType?.type_code === 'O' && <FileText className="w-6 h-6" style={{ color: selectedType.color }} />}
                                    {(selectedType?.type_code === 'NC_MENOR' || selectedType?.type_code === 'NC_MAYOR') && (
                                        <AlertTriangle className="w-6 h-6" style={{ color: selectedType.color }} />
                                    )}
                                    <h3 className="text-lg font-bold text-slate-900">Resumen del Hallazgo</h3>
                                </div>
                                <p className="text-sm text-slate-700 mb-3">
                                    <strong>Tipo:</strong> {selectedType?.type_name}
                                </p>
                                {(selectedType?.type_code === 'NC_MENOR' || selectedType?.type_code === 'NC_MAYOR') && (
                                    <p className="text-sm font-bold" style={{ color: selectedType.color }}>
                                        ⚠️ Se generará automáticamente una acción correctiva para este hallazgo
                                    </p>
                                )}
                            </div>

                            <button
                                onClick={handleSave}
                                disabled={saving || !description}
                                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save size={24} />
                                {saving ? 'Guardando...' : 'Guardar Hallazgo'}
                            </button>
                        </>
                    )}
                </>
            )}
        </div>
    );
}

export default function HallazgosPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>}>
            <HallazgosContent />
        </Suspense>
    );
}
