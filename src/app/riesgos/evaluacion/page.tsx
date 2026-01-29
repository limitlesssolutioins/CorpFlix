'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, Plus, Save, Trash2, Shield, Calculator, ArrowLeft } from 'lucide-react';

interface Risk {
    id: number;
    category_id: number;
    description: string;
    type?: string;
}

interface Category {
    id: number;
    code: string;
    name: string;
    color?: string;
}

interface ConsequenceCriteria {
    level: number;
    name: string;
    description: string;
}

interface Control {
    description: string;
    effectiveness: number;
    control_type: string;
}

export default function EvaluacionPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [risks, setRisks] = useState<Risk[]>([]);
    const [selectedRisk, setSelectedRisk] = useState<number | null>(null);
    const [probability, setProbability] = useState(3);
    const [consequence, setConsequence] = useState(3);
    const [controls, setControls] = useState<Control[]>([]);
    const [newControl, setNewControl] = useState({ description: '', effectiveness: 3, control_type: 'PREVENTIVO' });
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchCategories();
        fetchRisks();
    }, []);

    const fetchCategories = async () => {
        const response = await fetch('/api/riesgos/categories');
        const data = await response.json();
        setCategories(data);
    };

    const fetchRisks = async () => {
        const response = await fetch('/api/riesgos/risks?status=ACTIVE');
        const data = await response.json();
        setRisks(data);
    };

    const calculateInherentRisk = () => probability * consequence;

    const getInherentRiskLevel = (inherentRisk: number) => {
        if (inherentRisk >= 1 && inherentRisk <= 4) return { level: 'MUY BAJO', color: 'bg-green-500', factor: 1 };
        if (inherentRisk >= 5 && inherentRisk <= 8) return { level: 'BAJO', color: 'bg-green-400', factor: 2 };
        if (inherentRisk >= 9 && inherentRisk <= 15) return { level: 'MEDIO', color: 'bg-yellow-500', factor: 3 };
        if (inherentRisk >= 16 && inherentRisk <= 20) return { level: 'ALTO', color: 'bg-orange-500', factor: 4 };
        return { level: 'MUY ALTO', color: 'bg-red-500', factor: 5 };
    };

    const calculateResidualRisk = () => {
        if (controls.length === 0) return null;
        const avgEffectiveness = controls.reduce((sum, c) => sum + c.effectiveness, 0) / controls.length;

        if (avgEffectiveness >= 4) return { level: 'ACEPTABLE', color: 'bg-green-500', detail: 'NO PRIORITARIO/NO SIGNIFICATIVO' };
        if (avgEffectiveness >= 2.5) return { level: 'ALERTA', color: 'bg-yellow-500', detail: 'NO PRIORITARIO/NO SIGNIFICATIVO' };
        return { level: 'NO ACEPTABLE', color: 'bg-red-500', detail: 'PRIORITARIO/SIGNIFICATIVO' };
    };

    const addControl = () => {
        if (newControl.description.trim()) {
            setControls([...controls, { ...newControl }]);
            setNewControl({ description: '', effectiveness: 3, control_type: 'PREVENTIVO' });
        }
    };

    const removeControl = (index: number) => {
        setControls(controls.filter((_, i) => i !== index));
    };

    const getEffectivenessLabel = (level: number) => {
        if (level === 1) return 'MUY ALTA';
        if (level === 2) return 'ALTA';
        if (level === 3) return 'MEDIA';
        if (level === 4) return 'BAJA';
        return 'MUY BAJA';
    };

    const handleSave = async () => {
        if (!selectedRisk) {
            alert('Por favor selecciona un riesgo');
            return;
        }

        setSaving(true);
        try {
            // Crear evaluación
            const assessmentResponse = await fetch('/api/riesgos/assessments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    risk_id: selectedRisk,
                    assessment_date: new Date().toISOString().split('T')[0],
                    probability,
                    consequence
                })
            });

            const assessment = await assessmentResponse.json();

            // Crear controles
            for (const control of controls) {
                await fetch('/api/riesgos/controls', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        assessment_id: assessment.id,
                        ...control
                    })
                });
            }

            alert('✅ Evaluación guardada exitosamente');

            // Reset form
            setSelectedRisk(null);
            setProbability(3);
            setConsequence(3);
            setControls([]);
        } catch (error) {
            console.error('Error saving assessment:', error);
            alert('❌ Error al guardar la evaluación');
        } finally {
            setSaving(false);
        }
    };

    const selectedRiskObj = risks.find(r => r.id === selectedRisk);
    const inherentRisk = calculateInherentRisk();
    const inherentRiskInfo = getInherentRiskLevel(inherentRisk);
    const residualRiskInfo = calculateResidualRisk();

    const probabilityLabels = ['', 'Remota', 'Baja', 'Media', 'Alta', 'Muy Alta'];
    const consequenceLabels = ['', 'Insignificante', 'Baja', 'Media', 'Alta', 'Significativa'];

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <Link
                    href="/riesgos"
                    className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold mb-4 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Volver al Dashboard
                </Link>
                <h1 className="text-3xl font-black text-slate-900 mb-2">Evaluación de Riesgos</h1>
                <p className="text-slate-600">
                    Evalúa riesgos y define controles para calcular el riesgo inherente y residual
                </p>
            </div>

            {/* Selección de Riesgo */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">1. Seleccionar Riesgo</h2>
                <select
                    value={selectedRisk || ''}
                    onChange={(e) => setSelectedRisk(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Selecciona un riesgo...</option>
                    {risks.map((risk) => (
                        <option key={risk.id} value={risk.id}>
                            {risk.type ? `[${risk.type}] ` : ''}{risk.description}
                        </option>
                    ))}
                </select>

                {selectedRiskObj && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                        <p className="text-sm text-blue-900"><strong>Riesgo seleccionado:</strong> {selectedRiskObj.description}</p>
                    </div>
                )}
            </div>

            {/* Evaluación */}
            {selectedRisk && (
                <>
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-6">2. Evaluar Riesgo Inherente</h2>

                        {/* Probabilidad */}
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-slate-700 mb-3">
                                Probabilidad: <span className="text-blue-600">{probabilityLabels[probability]}</span>
                            </label>
                            <div className="flex items-center gap-4">
                                <span className="text-xs text-slate-500 w-16">Remota</span>
                                <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    value={probability}
                                    onChange={(e) => setProbability(Number(e.target.value))}
                                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                                <span className="text-xs text-slate-500 w-16 text-right">Muy Alta</span>
                                <span className="text-2xl font-black text-blue-600 w-12 text-center">{probability}</span>
                            </div>
                        </div>

                        {/* Consecuencia */}
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-slate-700 mb-3">
                                Consecuencia: <span className="text-purple-600">{consequenceLabels[consequence]}</span>
                            </label>
                            <div className="flex items-center gap-4">
                                <span className="text-xs text-slate-500 w-16">Insignif.</span>
                                <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    value={consequence}
                                    onChange={(e) => setConsequence(Number(e.target.value))}
                                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                                />
                                <span className="text-xs text-slate-500 w-16 text-right">Significativa</span>
                                <span className="text-2xl font-black text-purple-600 w-12 text-center">{consequence}</span>
                            </div>
                        </div>

                        {/* Riesgo Inherente Calculado */}
                        <div className={`p-6 rounded-xl ${inherentRiskInfo.color} bg-opacity-10 border-2 ${inherentRiskInfo.color} border-opacity-30`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <Calculator className="w-6 h-6" />
                                        <h3 className="text-lg font-bold text-slate-900">Riesgo Inherente</h3>
                                    </div>
                                    <p className="text-sm text-slate-600">
                                        {probability} (Probabilidad) × {consequence} (Consecuencia) = {inherentRisk}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className={`inline-block px-6 py-3 ${inherentRiskInfo.color} text-white rounded-xl font-black text-xl`}>
                                        {inherentRiskInfo.level}
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">Factor: {inherentRiskInfo.factor}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Controles */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">3. Definir Controles</h2>

                        {/* Lista de Controles */}
                        {controls.length > 0 && (
                            <div className="mb-4 space-y-3">
                                {controls.map((control, index) => (
                                    <div key={index} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                        <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-slate-900">{control.description}</p>
                                            <div className="flex items-center gap-4 mt-2">
                                                <span className="text-xs text-slate-600">
                                                    <strong>Tipo:</strong> {control.control_type}
                                                </span>
                                                <span className="text-xs text-slate-600">
                                                    <strong>Eficacia:</strong> {getEffectivenessLabel(control.effectiveness)} ({control.effectiveness})
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeControl(index)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Agregar Control */}
                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="Descripción del control..."
                                value={newControl.description}
                                onChange={(e) => setNewControl({ ...newControl, description: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <div className="grid grid-cols-2 gap-3">
                                <select
                                    value={newControl.control_type}
                                    onChange={(e) => setNewControl({ ...newControl, control_type: e.target.value })}
                                    className="px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="PREVENTIVO">Preventivo</option>
                                    <option value="CORRECTIVO">Correctivo</option>
                                    <option value="DETECTIVO">Detectivo</option>
                                </select>

                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1">
                                        Eficacia: {getEffectivenessLabel(newControl.effectiveness)}
                                    </label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="5"
                                        value={newControl.effectiveness}
                                        onChange={(e) => setNewControl({ ...newControl, effectiveness: Number(e.target.value) })}
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={addControl}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
                            >
                                <Plus size={20} />
                                Agregar Control
                            </button>
                        </div>
                    </div>

                    {/* Riesgo Residual */}
                    {residualRiskInfo && (
                        <div className={`p-6 rounded-xl ${residualRiskInfo.color} bg-opacity-10 border-2 ${residualRiskInfo.color} border-opacity-30 mb-6`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <Shield className="w-6 h-6" />
                                        <h3 className="text-lg font-bold text-slate-900">Riesgo Residual</h3>
                                    </div>
                                    <p className="text-sm text-slate-600">
                                        Basado en {controls.length} control(es) definido(s)
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className={`inline-block px-6 py-3 ${residualRiskInfo.color} text-white rounded-xl font-black text-xl`}>
                                        {residualRiskInfo.level}
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">{residualRiskInfo.detail}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Guardar */}
                    <button
                        onClick={handleSave}
                        disabled={saving || !selectedRisk}
                        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save size={24} />
                        {saving ? 'Guardando...' : 'Guardar Evaluación'}
                    </button>
                </>
            )}
        </div>
    );
}
