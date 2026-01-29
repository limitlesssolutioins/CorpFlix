'use client';

import Link from 'next/link';
import { TrendingUp, Lightbulb, FolderKanban, BookOpen, ArrowRight, Users, DollarSign, CheckCircle2 } from 'lucide-react';

export default function MejoraContinuaPage() {
    const modules = [
        {
            title: 'Sugerencias de Mejora',
            description: 'Sistema Kaizen para propuestas de mejora de toda la organización',
            href: '/mejora-continua/sugerencias',
            icon: Lightbulb,
            iconBg: 'from-yellow-50 to-yellow-100',
            iconColor: 'text-yellow-600',
            borderColor: 'border-yellow-100',
            hoverBorder: 'group-hover:border-yellow-200',
            accentGradient: 'from-yellow-400 to-yellow-600',
            linkColor: 'text-yellow-600'
        },
        {
            title: 'Proyectos de Mejora',
            description: 'Gestión de proyectos formales con metodología PDCA',
            href: '/mejora-continua/proyectos',
            icon: FolderKanban,
            iconBg: 'from-blue-50 to-blue-100',
            iconColor: 'text-blue-600',
            borderColor: 'border-blue-100',
            hoverBorder: 'group-hover:border-blue-200',
            accentGradient: 'from-blue-400 to-blue-600',
            linkColor: 'text-blue-600'
        },
        {
            title: 'Lecciones Aprendidas',
            description: 'Repositorio de conocimiento y mejores prácticas',
            href: '/mejora-continua/lecciones',
            icon: BookOpen,
            iconBg: 'from-purple-50 to-purple-100',
            iconColor: 'text-purple-600',
            borderColor: 'border-purple-100',
            hoverBorder: 'group-hover:border-purple-200',
            accentGradient: 'from-purple-400 to-purple-600',
            linkColor: 'text-purple-600'
        }
    ];

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 mb-2 flex items-center gap-3">
                    <TrendingUp className="w-10 h-10 text-green-600" />
                    Mejora Continua
                </h1>
                <p className="text-slate-600">
                    Sistema de gestión de mejora continua, sugerencias Kaizen y proyectos de optimización
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                            <Lightbulb className="w-6 h-6 text-yellow-600" />
                        </div>
                        <span className="text-3xl font-black text-slate-900">0</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-600">Sugerencias Activas</p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <FolderKanban className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className="text-3xl font-black text-slate-900">0</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-600">Proyectos en Curso</p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                        </div>
                        <span className="text-3xl font-black text-slate-900">0</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-600">Mejoras Implementadas</p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-emerald-600" />
                        </div>
                        <span className="text-3xl font-black text-slate-900">$0</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-600">Ahorros Estimados</p>
                </div>
            </div>

            {/* Feature Banner */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200 mb-8">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 mb-2">Cultura de Mejora Continua</h2>
                        <p className="text-slate-700 mb-4">
                            Fomenta la participación de todos los colaboradores en la identificación de oportunidades de mejora.
                            Implementa metodologías Kaizen, PDCA y gestión de proyectos para optimizar procesos y resultados.
                        </p>
                        <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                <span className="font-semibold text-slate-700">Sistema de votación</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                <span className="font-semibold text-slate-700">Gestiónde proyectos PDCA</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                                <span className="font-semibold text-slate-700">Base de conocimiento</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modules */}
            <div>
                <h2 className="text-2xl font-black text-slate-900 mb-6">Módulos del Sistema</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
