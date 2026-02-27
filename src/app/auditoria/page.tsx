'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Leaf, HardHat, Lock, Car, ArrowRight, ClipboardList, AlertTriangle, FileText } from 'lucide-react';

interface AuditStandard {
    id: number;
    code: string;
    name: string;
    full_name: string;
    category: string;
    color: string;
    description: string;
    total_requirements: number;
    total_audits: number;
}

const STANDARD_ICONS: Record<string, any> = {
    ISO9001: ShieldCheck,
    ISO14001: Leaf,
    ISO45001: HardHat,
    RES0312: HardHat,
    ISO27001: Lock,
    ISO39001: Car,
};

export default function AuditoriaPage() {
    const [standards, setStandards] = useState<AuditStandard[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/auditoria/standards')
            .then(r => r.json())
            .then(data => setStandards(Array.isArray(data) ? data : []))
            .catch(() => setStandards([]))
            .finally(() => setLoading(false));
    }, []);

    const categories = Array.from(new Set(standards.map(s => s.category)));

    const globalLinks = [
        { href: '/auditoria/acciones-correctivas', icon: AlertTriangle, label: 'Acciones Correctivas', color: 'text-orange-600', bg: 'bg-orange-50' },
        { href: '/auditoria/reportes', icon: FileText, label: 'Reportes', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-600">Cargando módulo de auditoría...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 mb-2">Módulo de Auditoría</h1>
                <p className="text-slate-600">Selecciona la norma que deseas auditar</p>
            </div>

            {/* Global quick actions */}
            <div className="flex gap-3 mb-8">
                {globalLinks.map(link => {
                    const Icon = link.icon;
                    return (
                        <Link key={link.href} href={link.href}
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 ${link.bg} ${link.color} font-semibold text-sm hover:shadow-sm transition-all`}>
                            <Icon size={16} />
                            {link.label}
                        </Link>
                    );
                })}
            </div>

            {/* Standards by category */}
            {categories.map(category => (
                <div key={category} className="mb-10">
                    <h2 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <div className="w-1 h-5 bg-slate-400 rounded-full" />
                        {category}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {standards.filter(s => s.category === category).map(standard => {
                            const Icon = STANDARD_ICONS[standard.code] || ClipboardList;
                            return (
                                <Link
                                    key={standard.id}
                                    href={`/auditoria/${standard.code.toLowerCase()}`}
                                    className="group bg-white rounded-2xl p-6 border-2 border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
                                >
                                    {/* Color accent bar */}
                                    <div
                                        className="absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-l-2xl"
                                        style={{ backgroundColor: standard.color }}
                                    />

                                    <div className="flex items-start justify-between mb-4">
                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                                            style={{ backgroundColor: standard.color + '20' }}
                                        >
                                            <Icon className="w-6 h-6" style={{ color: standard.color }} />
                                        </div>
                                        <div className="text-right">
                                            {standard.total_audits > 0 && (
                                                <span className="text-xs font-bold px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                                                    {standard.total_audits} auditoría{standard.total_audits !== 1 ? 's' : ''}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-1">
                                        <span
                                            className="text-xs font-black uppercase tracking-widest"
                                            style={{ color: standard.color }}
                                        >
                                            {standard.name}
                                        </span>
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900 mb-2 leading-tight group-hover:text-slate-700">
                                        {standard.full_name.split(' - ')[1] || standard.full_name}
                                    </h3>
                                    <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-2">
                                        {standard.description}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-400 font-semibold">
                                            {standard.total_requirements} requisitos
                                        </span>
                                        <div className="flex items-center gap-1 text-sm font-bold" style={{ color: standard.color }}>
                                            Auditar <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            ))}

            {standards.length === 0 && !loading && (
                <div className="bg-white rounded-2xl p-12 border-2 border-dashed border-slate-300 text-center">
                    <ClipboardList className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-700 mb-2">No se encontraron normas</h3>
                    <p className="text-slate-500">Verifica la conexión con la base de datos</p>
                </div>
            )}
        </div>
    );
}
