'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, AlertTriangle, CheckCircle2, Clock, TrendingUp, FileText, Plus, Sparkles } from 'lucide-react';

interface DashboardKPIs {
    totalRisks: number;
    totalAssessments: number;
    criticalRisks: number;
    pendingActions: number;
    risksByCategory: Array<{
        name: string;
        code: string;
        color: string;
        count: number;
    }>;
    risksByLevel: Array<{
        level: string;
        count: number;
    }>;
    risksByAcceptability: Array<{
        acceptability: string;
        count: number;
    }>;
}

export default function RiesgosPage() {
    const [kpis, setKPIs] = useState<DashboardKPIs | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await fetch('/api/riesgos/dashboard');
            const data = await response.json();
            setKPIs(data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getCriticalPercentage = () => {
        if (!kpis || kpis.totalAssessments === 0) return 0;
        return Math.round((kpis.criticalRisks / kpis.totalAssessments) * 100);
    };

    const modules = [
        {
            title: 'Catálogo de Riesgos',
            description: 'Gestión completa del catálogo de riesgos identificados por categoría.',
            href: '/riesgos/catalogo',
            icon: FileText,
            iconBg: 'from-blue-50 to-blue-100',
            iconColor: 'text-blue-600',
            borderColor: 'border-blue-100',
            hoverBorder: 'group-hover:border-blue-200',
            accentGradient: 'from-blue-400 to-blue-600'
        },
        {
            title: 'Evaluación de Riesgos',
            description: 'Evaluar riesgos, calcular riesgo inherente y residual, definir controles.',
            href: '/riesgos/evaluacion',
            icon: Shield,
            iconBg: 'from-purple-50 to-purple-100',
            iconColor: 'text-purple-600',
            borderColor: 'border-purple-100',
            hoverBorder: 'group-hover:border-purple-200',
            accentGradient: 'from-purple-400 to-purple-600'
        },
        {
            title: 'Matrices de Riesgo',
            description: 'Visualización de matrices 5×5 por categoría con riesgos mapeados.',
            href: '/riesgos/matrices',
            icon: TrendingUp,
            iconBg: 'from-emerald-50 to-emerald-100',
            iconColor: 'text-emerald-600',
            borderColor: 'border-emerald-100',
            hoverBorder: 'group-hover:border-emerald-200',
            accentGradient: 'from-emerald-400 to-emerald-600'
        },
        {
            title: 'Planes de Acción',
            description: 'Gestión de planes de acción para mitigación de riesgos críticos.',
            href: '/riesgos/planes-accion',
            icon: Clock,
            iconBg: 'from-orange-50 to-orange-100',
            iconColor: 'text-orange-600',
            borderColor: 'border-orange-100',
            hoverBorder: 'group-hover:border-orange-200',
            accentGradient: 'from-orange-400 to-orange-600'
        },
        {
            title: 'Asistente IA',
            description: 'Genera matriz de riesgos, controles y planes de accion con preguntas simples.',
            href: '/riesgos/asistente-ia',
            icon: Sparkles,
            iconBg: 'from-indigo-50 to-indigo-100',
            iconColor: 'text-indigo-600',
            borderColor: 'border-indigo-100',
            hoverBorder: 'group-hover:border-indigo-200',
            accentGradient: 'from-indigo-400 to-indigo-600'
        }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">Cargando módulo de riesgos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 mb-2">Gestión de Riesgos</h1>
                <p className="text-slate-600">
                    Sistema integral de identificación, evaluación y control de riesgos organizacionales
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className="text-3xl font-black text-slate-900">{kpis?.totalRisks || 0}</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-600">Riesgos Identificados</p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                            <Shield className="w-6 h-6 text-purple-600" />
                        </div>
                        <span className="text-3xl font-black text-slate-900">{kpis?.totalAssessments || 0}</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-600">Evaluaciones Realizadas</p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="text-right">
                            <span className="text-3xl font-black text-slate-900">{kpis?.criticalRisks || 0}</span>
                            <span className="text-sm text-red-600 font-bold ml-2">({getCriticalPercentage()}%)</span>
                        </div>
                    </div>
                    <p className="text-sm font-semibold text-slate-600">Riesgos Críticos</p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                            <Clock className="w-6 h-6 text-orange-600" />
                        </div>
                        <span className="text-3xl font-black text-slate-900">{kpis?.pendingActions || 0}</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-600">Acciones Pendientes</p>
                </div>
            </div>

            {/* Categorías de Riesgo */}
            {kpis && kpis.risksByCategory.length > 0 && (
                <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Riesgos por Categoría</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {kpis.risksByCategory.map((cat) => (
                            <div
                                key={cat.code}
                                className="p-4 rounded-xl border-2 border-slate-100 hover:border-slate-200 transition-colors"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: cat.color }}
                                    />
                                    <span className="font-bold text-slate-700">{cat.name}</span>
                                </div>
                                <p className="text-2xl font-black text-slate-900">{cat.count}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Módulos */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-black text-slate-900">Módulos del Sistema</h2>
                    <Link
                        href="/riesgos/catalogo"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
                    >
                        <Plus size={20} />
                        Agregar Riesgo
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {modules.map((module) => (
                        <Link
                            key={module.href}
                            href={module.href}
                            className={`group bg-white rounded-2xl p-6 border-2 ${module.borderColor} ${module.hoverBorder} shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden`}
                        >
                            {/* Gradient accent bar on left */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${module.accentGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                            {/* Icon container with gradient background */}
                            <div className={`w-14 h-14 bg-gradient-to-br ${module.iconBg} rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-110`}>
                                <module.icon className={`w-7 h-7 ${module.iconColor}`} />
                            </div>

                            <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-slate-700 transition-colors">{module.title}</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                {module.description}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Estado de Riesgos */}
            {kpis && kpis.risksByAcceptability.length > 0 && (
                <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Distribución por Nivel de Aceptabilidad</h2>
                    <div className="grid grid-cols-3 gap-4">
                        {kpis.risksByAcceptability.map((item) => {
                            const getColor = (acceptability: string) => {
                                if (acceptability === 'ACEPTABLE') return 'bg-green-100 text-green-700 border-green-200';
                                if (acceptability === 'ALERTA') return 'bg-yellow-100 text-yellow-700 border-yellow-200';
                                return 'bg-red-100 text-red-700 border-red-200';
                            };

                            const getIcon = (acceptability: string) => {
                                if (acceptability === 'ACEPTABLE') return <CheckCircle2 className="w-5 h-5" />;
                                if (acceptability === 'ALERTA') return <AlertTriangle className="w-5 h-5" />;
                                return <AlertTriangle className="w-5 h-5" />;
                            };

                            return (
                                <div
                                    key={item.acceptability}
                                    className={`p-4 rounded-xl border-2 ${getColor(item.acceptability)}`}
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        {getIcon(item.acceptability)}
                                        <span className="font-bold">{item.acceptability}</span>
                                    </div>
                                    <p className="text-3xl font-black">{item.count}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

