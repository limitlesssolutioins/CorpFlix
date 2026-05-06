'use client';

import Link from 'next/link';
import { Library, FileText, Search, MessageSquare, ArrowRight, FolderOpen, Upload, BookOpen } from 'lucide-react';

export default function BibliotecaPage() {
    const modules = [
        {
            title: 'Gestión de Documentos',
            description: 'Upload, organización y control de versiones de documentos',
            href: '/biblioteca/documentos',
            icon: FolderOpen,
            iconBg: 'from-blue-50 to-blue-100',
            iconColor: 'text-blue-600',
            borderColor: 'border-blue-100',
            hoverBorder: 'group-hover:border-blue-200',
            accentGradient: 'from-blue-400 to-blue-600',
            linkColor: 'text-blue-600'
        },
        {
            title: 'Búsqueda Avanzada',
            description: 'Encuentra documentos por título, categoría, tags o contenido',
            href: '/biblioteca/buscar',
            icon: Search,
            iconBg: 'from-purple-50 to-purple-100',
            iconColor: 'text-purple-600',
            borderColor: 'border-purple-100',
            hoverBorder: 'group-hover:border-purple-200',
            accentGradient: 'from-purple-400 to-purple-600',
            linkColor: 'text-purple-600'
        },
        {
            title: 'Chatbot Asesor',
            description: 'Asistente inteligente para consultas sobre documentación (Próximamente)',
            href: '/biblioteca/chatbot',
            icon: MessageSquare,
            iconBg: 'from-emerald-50 to-emerald-100',
            iconColor: 'text-emerald-600',
            borderColor: 'border-emerald-100',
            hoverBorder: 'group-hover:border-emerald-200',
            accentGradient: 'from-emerald-400 to-emerald-600',
            linkColor: 'text-emerald-600'
        }
    ];

    const quickLinks = [
        { name: 'Normas ISO', count: 0, color: 'bg-blue-100 text-blue-700' },
        { name: 'Procedimientos', count: 0, color: 'bg-green-100 text-green-700' },
        { name: 'Políticas', count: 0, color: 'bg-purple-100 text-purple-700' },
        { name: 'Formatos', count: 0, color: 'bg-orange-100 text-orange-700' }
    ];

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 mb-2 flex items-center gap-3">
                    <Library className="w-10 h-10 text-blue-600" />
                    Biblioteca Virtual
                </h1>
                <p className="text-slate-600">
                    Centro de conocimiento y gestión documental con asistente inteligente
                </p>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-8">
                <div className="flex items-center gap-3">
                    <Search className="w-6 h-6 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Buscar en la biblioteca..."
                        className="flex-1 text-lg outline-none"
                    />
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold">
                        Buscar
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {quickLinks.map((link) => (
                    <div key={link.name} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                        <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${link.color} mb-2`}>
                            {link.count} docs
                        </div>
                        <h3 className="text-sm font-bold text-slate-900">{link.name}</h3>
                    </div>
                ))}
            </div>

            {/* Feature Banner */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200 mb-8">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 mb-2">Centro de Conocimiento Inteligente</h2>
                        <p className="text-slate-700 mb-4">
                            Centraliza toda la documentación de la organización en un solo lugar. Upload de archivos, control de versiones,
                            búsqueda avanzada y próximamente un chatbot asesor basado en IA para responder consultas sobre tu documentación.
                        </p>
                        <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                <Upload className="w-4 h-4 text-blue-600" />
                                <span className="font-semibold text-slate-700">Upload múltiple</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-purple-600" />
                                <span className="font-semibold text-slate-700">Control de versiones</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-emerald-600" />
                                <span className="font-semibold text-slate-700">AI Chatbot (próximamente)</span>
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
