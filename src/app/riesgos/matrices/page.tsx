'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, Info, ArrowLeft } from 'lucide-react';

interface Category {
    id: number;
    code: string;
    name: string;
    color?: string;
}

interface Assessment {
    id: number;
    risk_id: number;
    risk_description: string;
    risk_type: string;
    probability: number;
    consequence: number;
    inherent_risk: number;
    inherent_risk_level: string;
}

export default function MatricesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [assessments, setAssessments] = useState<Assessment[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedCell, setSelectedCell] = useState<{ probability: number; consequence: number } | null>(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            fetchAssessments();
        }
    }, [selectedCategory]);

    const fetchCategories = async () => {
        const response = await fetch('/api/riesgos/categories');
        const data = await response.json();
        setCategories(data);
        if (data.length > 0) {
            setSelectedCategory(data[0].code);
        }
    };

    const fetchAssessments = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/riesgos/assessments');
            const data = await response.json();

            // Filter by category
            const category = categories.find(c => c.code === selectedCategory);
            if (category) {
                const filtered = data.filter((a: any) => a.category_code === selectedCategory);
                setAssessments(filtered);
            }
        } catch (error) {
            console.error('Error fetching assessments:', error);
        } finally {
            setLoading(false);
        }
    };

    const getRisksInCell = (probability: number, consequence: number) => {
        return assessments.filter(a => a.probability === probability && a.consequence === consequence);
    };

    const getCellColor = (probability: number, consequence: number) => {
        const value = probability * consequence;
        if (value >= 1 && value <= 4) return 'bg-green-500';
        if (value >= 5 && value <= 8) return 'bg-green-400';
        if (value >= 9 && value <= 15) return 'bg-yellow-400';
        if (value >= 16 && value <= 20) return 'bg-orange-500';
        return 'bg-red-500';
    };

    const getCellLevel = (probability: number, consequence: number) => {
        const value = probability * consequence;
        if (value >= 1 && value <= 4) return 'MUY BAJO';
        if (value >= 5 && value <= 8) return 'BAJO';
        if (value >= 9 && value <= 15) return 'MEDIO';
        if (value >= 16 && value <= 20) return 'ALTO';
        return 'MUY ALTO';
    };

    const probabilityLabels = ['', 'Remota', 'Baja', 'Media', 'Alta', 'Muy Alta'];
    const consequenceLabels = ['', 'Insignif.', 'Baja', 'Media', 'Alta', 'Significativa'];

    const selectedCategoryObj = categories.find(c => c.code === selectedCategory);
    const cellRisks = selectedCell ? getRisksInCell(selectedCell.probability, selectedCell.consequence) : [];

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <Link
                    href="/riesgos"
                    className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold mb-4 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Volver al Dashboard
                </Link>
                <h1 className="text-3xl font-black text-slate-900 mb-2">Matrices de Riesgo</h1>
                <p className="text-slate-600">
                    Visualización de matrices 5×5 (Probabilidad vs Consecuencia) por categoría
                </p>
            </div>

            {/* Category Tabs */}
            <div className="mb-6 flex flex-wrap gap-2">
                {categories.map((cat) => (
                    <button
                        key={cat.code}
                        onClick={() => {
                            setSelectedCategory(cat.code);
                            setSelectedCell(null);
                        }}
                        className={`px-6 py-3 rounded-xl font-bold transition-all ${selectedCategory === cat.code
                            ? 'text-white shadow-lg scale-105'
                            : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-slate-300'
                            }`}
                        style={{
                            backgroundColor: selectedCategory === cat.code ? cat.color : undefined
                        }}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-slate-600">Cargando matriz...</p>
                    </div>
                </div>
            ) : (
                <>
                    {/* Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                        <div className="flex items-start gap-3">
                            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div>
                                <h3 className="font-bold text-blue-900 mb-1">Cómo leer la matriz</h3>
                                <p className="text-sm text-blue-800">
                                    Cada celda muestra el nivel de riesgo inherente basado en Probabilidad (filas) × Consecuencia (columnas).
                                    Haz clic en una celda para ver los riesgos evaluados en ese nivel.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Risk Matrix */}
                    <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm mb-6">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th className="w-32"></th>
                                        <th className="p-2 text-center border border-slate-300 bg-purple-50 font-bold text-purple-900">
                                            {consequenceLabels[1]}<br /><span className="text-xs">(1)</span>
                                        </th>
                                        <th className="p-2 text-center border border-slate-300 bg-purple-50 font-bold text-purple-900">
                                            {consequenceLabels[2]}<br /><span className="text-xs">(2)</span>
                                        </th>
                                        <th className="p-2 text-center border border-slate-300 bg-purple-50 font-bold text-purple-900">
                                            {consequenceLabels[3]}<br /><span className="text-xs">(3)</span>
                                        </th>
                                        <th className="p-2 text-center border border-slate-300 bg-purple-50 font-bold text-purple-900">
                                            {consequenceLabels[4]}<br /><span className="text-xs">(4)</span>
                                        </th>
                                        <th className="p-2 text-center border border-slate-300 bg-purple-50 font-bold text-purple-900">
                                            {consequenceLabels[5]}<br /><span className="text-xs">(5)</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[5, 4, 3, 2, 1].map((prob) => (
                                        <tr key={prob}>
                                            <td className="p-2 text-right border border-slate-300 bg-blue-50 font-bold text-blue-900">
                                                <div>{probabilityLabels[prob]}</div>
                                                <div className="text-xs">({prob})</div>
                                            </td>
                                            {[1, 2, 3, 4, 5].map((cons) => {
                                                const risksInCell = getRisksInCell(prob, cons);
                                                const cellColor = getCellColor(prob, cons);
                                                const cellLevel = getCellLevel(prob, cons);
                                                const value = prob * cons;
                                                const isSelected = selectedCell?.probability === prob && selectedCell?.consequence === cons;

                                                return (
                                                    <td
                                                        key={cons}
                                                        onClick={() => setSelectedCell({ probability: prob, consequence: cons })}
                                                        className={`p-3 border border-slate-300 cursor-pointer transition-all hover:scale-105 ${cellColor} ${isSelected ? 'ring-4 ring-blue-500 ring-offset-2' : ''
                                                            }`}
                                                    >
                                                        <div className="text-center">
                                                            <div className="text-white font-black text-lg mb-1">{value}</div>
                                                            <div className="text-white text-xs font-bold mb-2">{cellLevel}</div>
                                                            {risksInCell.length > 0 && (
                                                                <div className="bg-white bg-opacity-90 rounded-full px-2 py-1 text-slate-900 text-xs font-bold">
                                                                    {risksInCell.length} riesgo{risksInCell.length !== 1 ? 's' : ''}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Legend */}
                        <div className="mt-6 flex items-center justify-center gap-4 flex-wrap">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-green-500 rounded"></div>
                                <span className="text-sm font-semibold text-slate-700">Muy Bajo / Bajo</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-yellow-400 rounded"></div>
                                <span className="text-sm font-semibold text-slate-700">Medio</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-orange-500 rounded"></div>
                                <span className="text-sm font-semibold text-slate-700">Alto</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-red-500 rounded"></div>
                                <span className="text-sm font-semibold text-slate-700">Muy Alto</span>
                            </div>
                        </div>
                    </div>

                    {/* Selected Cell Details */}
                    {selectedCell && (
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">
                                Riesgos en celda: Probabilidad {selectedCell.probability} × Consecuencia {selectedCell.consequence} = {selectedCell.probability * selectedCell.consequence}
                            </h3>

                            {cellRisks.length === 0 ? (
                                <p className="text-slate-500 text-center py-8">No hay riesgos evaluados en esta celda</p>
                            ) : (
                                <div className="space-y-3">
                                    {cellRisks.map((risk) => (
                                        <div
                                            key={risk.id}
                                            className="p-4 bg-slate-50 rounded-xl border border-slate-200"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    {risk.risk_type && (
                                                        <span className="inline-block px-3 py-1 bg-slate-200 text-slate-700 rounded-full text-xs font-bold mb-2">
                                                            {risk.risk_type}
                                                        </span>
                                                    )}
                                                    <p className="font-semibold text-slate-900">{risk.risk_description}</p>
                                                </div>
                                                <div
                                                    className={`ml-4 px-4 py-2 ${getCellColor(risk.probability, risk.consequence)} text-white rounded-lg text-sm font-bold`}
                                                >
                                                    {risk.inherent_risk_level}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Stats */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mt-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Estadísticas - {selectedCategoryObj?.name}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div className="text-center">
                                <div className="text-3xl font-black text-green-600">{assessments.filter(a => a.inherent_risk_level === 'MUY BAJO' || a.inherent_risk_level === 'BAJO').length}</div>
                                <div className="text-sm text-slate-600 mt-1">Muy Bajo / Bajo</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-black text-yellow-600">{assessments.filter(a => a.inherent_risk_level === 'MEDIO').length}</div>
                                <div className="text-sm text-slate-600 mt-1">Medio</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-black text-orange-600">{assessments.filter(a => a.inherent_risk_level === 'ALTO').length}</div>
                                <div className="text-sm text-slate-600 mt-1">Alto</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-black text-red-600">{assessments.filter(a => a.inherent_risk_level === 'MUY ALTO').length}</div>
                                <div className="text-sm text-slate-600 mt-1">Muy Alto</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-black text-blue-600">{assessments.length}</div>
                                <div className="text-sm text-slate-600 mt-1">Total</div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
