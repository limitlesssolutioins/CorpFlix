'use client';

import Link from 'next/link';
import { Clock, Shield, Users, ArrowRight } from 'lucide-react';

export default function GestionHumanaPage() {
    const modules = [
        {
            title: 'Liquidación de Horas Extras',
            description: 'Cálculo y gestión de horas extra, recargos nocturnos y dominicales.',
            href: '/gestion-humana/extras',
            icon: Clock,
            iconBg: 'from-blue-50 to-blue-100',
            iconColor: 'text-blue-600',
            borderColor: 'border-blue-100',
            hoverBorder: 'group-hover:border-blue-200',
            accentGradient: 'from-blue-400 to-blue-600',
            linkColor: 'text-blue-600'
        },
        {
            title: 'Liquidación Seguridad Social',
            description: 'Gestión de aportes a salud, pensión, ARL y parafiscales.',
            href: '/gestion-humana/seguridad-social',
            icon: Shield,
            iconBg: 'from-emerald-50 to-emerald-100',
            iconColor: 'text-emerald-600',
            borderColor: 'border-emerald-100',
            hoverBorder: 'group-hover:border-emerald-200',
            accentGradient: 'from-emerald-400 to-emerald-600',
            linkColor: 'text-emerald-600'
        },
        {
            title: 'Personal Doméstico',
            description: 'Liquidación y gestión simplificada para empleados del servicio doméstico.',
            href: '/gestion-humana/domesticas',
            icon: Users,
            iconBg: 'from-rose-50 to-rose-100',
            iconColor: 'text-rose-600',
            borderColor: 'border-rose-100',
            hoverBorder: 'group-hover:border-rose-200',
            accentGradient: 'from-rose-400 to-rose-600',
            linkColor: 'text-rose-600'
        }
    ];

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-12 text-center">
                <h2 className="text-3xl font-black text-slate-900 mb-4">Módulos de Gestión Humana</h2>
                <p className="text-slate-600 max-w-2xl mx-auto">
                    Seleccione el módulo que desea gestionar. Centralizamos la liquidación de extras,
                    seguridad social y personal doméstico en una sola plataforma.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {modules.map((module) => (
                    <Link
                        key={module.href}
                        href={module.href}
                        className={`group bg-white rounded-[2rem] p-8 border-2 ${module.borderColor} ${module.hoverBorder} shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden`}
                    >
                        {/* Gradient accent bar on left */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${module.accentGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                        {/* Icon container with gradient background */}
                        <div className={`w-14 h-14 bg-gradient-to-br ${module.iconBg} rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-110`}>
                            <module.icon className={`w-7 h-7 ${module.iconColor}`} />
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-slate-700 transition-colors">{module.title}</h3>
                        <p className="text-slate-500 text-sm leading-relaxed mb-6">
                            {module.description}
                        </p>

                        <div className={`flex items-center gap-2 text-sm font-bold ${module.linkColor}`}>
                            Ingresar al Módulo <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}