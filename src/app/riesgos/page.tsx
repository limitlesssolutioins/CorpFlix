'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Shield, AlertTriangle, CheckCircle2, Award, HardHat, Leaf, Lock, TrendingUp, Car } from 'lucide-react';

interface CategoryKPI {
    name: string;
    code: string;
    color: string;
    icon: string;
    count: number;
    critical: number;
}

interface DashboardKPIs {
    totalRisks: number;
    totalAssessments: number;
    criticalRisks: number;
    pendingActions: number;
    risksByCategory: CategoryKPI[];
    risksByAcceptability: Array<{ acceptability: string; count: number }>;
}

const CATEGORY_META: Record<string, { slug: string; icon: any; tagline: string; description: string }> = {
    CALIDAD:         { slug: 'calidad',         icon: Award,      tagline: 'Calidad del producto y servicio', description: 'Riesgos que afectan la satisfacción del cliente, procesos, proveedores y cumplimiento.' },
    SST:             { slug: 'sst',             icon: HardHat,    tagline: 'Seguridad y Salud en el Trabajo', description: 'Peligros y condiciones que pueden causar accidentes, enfermedades o incidentes laborales.' },
    AMBIENTAL:       { slug: 'ambiental',       icon: Leaf,       tagline: 'Impacto ambiental', description: 'Efectos de la operación sobre el medio ambiente: residuos, agua, aire y energía.' },
    CIBERSEGURIDAD:  { slug: 'ciberseguridad',  icon: Lock,       tagline: 'Seguridad de la información', description: 'Amenazas digitales: accesos no autorizados, fraudes, pérdida de datos y ataques.' },
    FINANCIERO:      { slug: 'financiero',      icon: TrendingUp, tagline: 'Estabilidad financiera', description: 'Riesgos de liquidez, crédito, fraude, tributario y dependencia de clientes o proveedores.' },
    SEGURIDAD_VIAL:  { slug: 'seguridad-vial',  icon: Car,        tagline: 'Seguridad en carretera', description: 'Riesgos en el uso de vehículos: accidentes, fatiga, mantenimiento y conductas viales.' },
};

export default function RiesgosPage() {
    const [kpis, setKPIs] = useState<DashboardKPIs | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/riesgos/dashboard')
            .then(r => r.json())
            .then(setKPIs)
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const totalRisks = kpis?.totalRisks || 0;
    const criticalRisks = kpis?.criticalRisks || 0;
    const pendingActions = kpis?.pendingActions || 0;
    const categories = kpis?.risksByCategory || [];

    const globalLinks = [
        { href: '/riesgos/planes-accion', label: 'Planes de Acción', badge: pendingActions > 0 ? pendingActions : null, color: 'text-orange-600 bg-orange-50 border-orange-200' },
        { href: '/riesgos/matrices', label: 'Matrices de Riesgo', badge: null, color: 'text-purple-600 bg-purple-50 border-purple-200' },
        { href: '/riesgos/asistente-ia', label: 'Asistente IA', badge: null, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    ];

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-black text-slate-900 mb-1">Gestión de Riesgos</h1>
                <p className="text-slate-500">Selecciona una categoría para identificar y gestionar tus riesgos</p>
            </div>

            {/* Top stats + quick links */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
                <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-slate-900">{totalRisks}</span>
                    <span className="text-slate-500 text-sm">riesgos identificados</span>
                </div>
                {criticalRisks > 0 && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-xl">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <span className="font-bold text-red-700">{criticalRisks}</span>
                        <span className="text-red-600 text-sm">críticos</span>
                    </div>
                )}
                <div className="ml-auto flex gap-2 flex-wrap">
                    {globalLinks.map(link => (
                        <Link key={link.href} href={link.href}
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all hover:shadow-sm ${link.color}`}>
                            {link.label}
                            {link.badge !== null && link.badge !== undefined && link.badge > 0 && (
                                <span className="bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-black">
                                    {link.badge}
                                </span>
                            )}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Category Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {Object.entries(CATEGORY_META).map(([code, meta]) => {
                    const catData = categories.find(c => c.code === code);
                    const count = catData?.count || 0;
                    const critical = catData?.critical || 0;

                    const Icon = meta.icon;
                    return (
                        <Link
                            key={code}
                            href={`/riesgos/${meta.slug}`}
                            className="group bg-white rounded-2xl p-6 border-2 border-slate-100 hover:border-slate-300 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
                        >
                            {/* Left accent bar */}
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-l-2xl" />

                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-slate-100 group-hover:bg-slate-200 transition-colors">
                                    <Icon className="w-6 h-6 text-slate-600" />
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    {count > 0 && (
                                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                            {count} riesgo{count !== 1 ? 's' : ''}
                                        </span>
                                    )}
                                    {critical > 0 && (
                                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600">
                                            {critical} crítico{critical !== 1 ? 's' : ''}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="mb-0.5">
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                    {meta.tagline}
                                </span>
                            </div>
                            <h3 className="text-base font-bold text-slate-900 mb-2 leading-tight">
                                {catData?.name || code}
                            </h3>
                            <p className="text-xs text-slate-500 leading-relaxed mb-4">
                                {meta.description}
                            </p>

                            <div className="flex items-center justify-between">
                                {count === 0 ? (
                                    <span className="text-xs text-slate-400">Sin riesgos registrados aún</span>
                                ) : (
                                    <div className="flex gap-2">
                                        {(kpis?.risksByAcceptability || []).length > 0 && (
                                            <span className="text-xs text-slate-400">{count} evaluados</span>
                                        )}
                                    </div>
                                )}
                                <div className="flex items-center gap-1 text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">
                                    {count === 0 ? 'Identificar riesgos' : 'Ver y gestionar'}
                                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Acceptability summary */}
            {kpis && kpis.risksByAcceptability.length > 0 && (
                <div className="mt-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <h2 className="text-base font-bold text-slate-900 mb-4">Estado general de riesgos</h2>
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { key: 'ACEPTABLE', label: 'Aceptable', icon: CheckCircle2, color: 'bg-green-50 border-green-200 text-green-700' },
                            { key: 'ALERTA', label: 'En alerta', icon: AlertTriangle, color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
                            { key: 'NO ACEPTABLE', label: 'Crítico', icon: AlertTriangle, color: 'bg-red-50 border-red-200 text-red-700' },
                        ].map(item => {
                            const found = kpis.risksByAcceptability.find(r => r.acceptability === item.key);
                            const Icon = item.icon;
                            return (
                                <div key={item.key} className={`p-4 rounded-xl border-2 ${item.color}`}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Icon className="w-4 h-4" />
                                        <span className="font-bold text-sm">{item.label}</span>
                                    </div>
                                    <p className="text-3xl font-black">{found?.count || 0}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
