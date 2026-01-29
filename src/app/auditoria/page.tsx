'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ClipboardCheck, AlertTriangle, CheckCircle2, FileText, Calendar, ArrowRight } from 'lucide-react';

interface DashboardKPIs {
    totalAudits: number;
    auditsThisYear: number;
    totalFindings: number;
    nonConformities: number;
    openActions: number;
    overdueActions: number;
    complianceByChapter: Array<{
        chapter_number: string;
        chapter_title: string;
        total_requirements: number;
        conformities: number;
        non_conformities: number;
    }>;
    findingsByType: Array<{
        type_name: string;
        color: string;
        count: number;
    }>;
}

export default function AuditoriaPage() {
    const [kpis, setKPIs] = useState<DashboardKPIs | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await fetch('/api/auditoria/dashboard');
            const data = await response.json();
            setKPIs(data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const modules = [
        {
            title: 'Gestión de Auditorías',
            description: 'Planificar, programar y gestionar auditorías internas del sistema',
            href: '/auditoria/auditorias',
            icon: Calendar,
            iconBg: 'from-blue-50 to-blue-100',
            iconColor: 'text-blue-600',
            borderColor: 'border-blue-100',
            hoverBorder: 'group-hover:border-blue-200',
            accentGradient: 'from-blue-400 to-blue-600',
            linkColor: 'text-blue-600'
        },
        {
            title: 'Registro de Hallazgos',
            description: 'Documentar conformidades, no conformidades y observaciones',
            href: '/auditoria/hallazgos',
            icon: ClipboardCheck,
            iconBg: 'from-purple-50 to-purple-100',
            iconColor: 'text-purple-600',
            borderColor: 'border-purple-100',
            hoverBorder: 'group-hover:border-purple-200',
            accentGradient: 'from-purple-400 to-purple-600',
            linkColor: 'text-purple-600'
        },
        {
            title: 'Acciones Correctivas',
            description: 'Gestionar y dar seguimiento a acciones correctivas',
            href: '/auditoria/acciones-correctivas',
            icon: AlertTriangle,
            iconBg: 'from-orange-50 to-orange-100',
            iconColor: 'text-orange-600',
            borderColor: 'border-orange-100',
            hoverBorder: 'group-hover:border-orange-200',
            accentGradient: 'from-orange-400 to-orange-600',
            linkColor: 'text-orange-600'
        },
        {
            title: 'Reportes',
            description: 'Generar informes de auditoría y análisis de cumplimiento',
            href: '/auditoria/reportes',
            icon: FileText,
            iconBg: 'from-emerald-50 to-emerald-100',
            iconColor: 'text-emerald-600',
            borderColor: 'border-emerald-100',
            hoverBorder: 'group-hover:border-emerald-200',
            accentGradient: 'from-emerald-400 to-emerald-600',
            linkColor: 'text-emerald-600'
        }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">Cargando módulo de auditoría...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 mb-2">Auditoría ISO 9001:2015</h1>
                <p className="text-slate-600">
                    Sistema de gestión de auditorías internas basado en ISO 9001
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className="text-3xl font-black text-slate-900">{kpis?.totalAudits || 0}</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-600">Auditorías Totales</p>
                    <p className="text-xs text-slate-500 mt-1">{kpis?.auditsThisYear || 0} este año</p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                            <ClipboardCheck className="w-6 h-6 text-purple-600" />
                        </div>
                        <span className="text-3xl font-black text-slate-900">{kpis?.totalFindings || 0}</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-600">Hallazgos Registrados</p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <span className="text-3xl font-black text-slate-900">{kpis?.nonConformities || 0}</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-600">No Conformidades</p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6 text-orange-600" />
                        </div>
                        <div className="text-right">
                            <span className="text-3xl font-black text-slate-900">{kpis?.openActions || 0}</span>
                            {kpis && kpis.overdueActions > 0 && (
                                <span className="text-sm text-red-600 font-bold ml-2">({kpis.overdueActions} vencidas)</span>
                            )}
                        </div>
                    </div>
                    <p className="text-sm font-semibold text-slate-600">Acciones Abiertas</p>
                </div>
            </div>

            {/* Hallazgos por Tipo */}
            {kpis && kpis.findingsByType.length > 0 && (
                <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Hallazgos por Tipo</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {kpis.findingsByType.map((finding: any) => (
                            <div
                                key={finding.type_name}
                                className="p-4 rounded-xl border-2 border-slate-100"
                                style={{ borderColor: finding.color + '40' }}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: finding.color }}
                                    />
                                    <span className="font-bold text-slate-700 text-sm">{finding.type_name}</span>
                                </div>
                                <p className="text-2xl font-black text-slate-900">{finding.count}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Cumplimiento por Capítulo */}
            {kpis && kpis.complianceByChapter.length > 0 && (
                <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Cumplimiento por Capítulo ISO 9001</h2>
                    <div className="space-y-3">
                        {kpis.complianceByChapter.map((chapter) => {
                            const compliancePercent = chapter.total_requirements > 0
                                ? Math.round((chapter.conformities / chapter.total_requirements) * 100)
                                : 0;

                            return (
                                <div key={chapter.chapter_number} className="border-0 border-slate-200 rounded-xl p-4 bg-slate-50">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <span className="font-bold text-slate-900">{chapter.chapter_number}. {chapter.chapter_title}</span>
                                            <span className="text-xs text-slate-500 ml-3">{chapter.conformities}/{chapter.total_requirements} requisitos conformes</span>
                                        </div>
                                        <span className="text-lg font-black text-slate-900">{compliancePercent}%</span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${compliancePercent >= 80 ? 'bg-green-600' : compliancePercent >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                            style={{ width: `${compliancePercent}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Módulos */}
            <div>
                <h2 className="text-2xl font-black text-slate-900 mb-6">Módulos del Sistema</h2>
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
                            <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                {module.description}
                            </p>

                            <div className={`flex items-center gap-2 text-sm font-bold ${module.linkColor}`}>
                                Acceder <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
