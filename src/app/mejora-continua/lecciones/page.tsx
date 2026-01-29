'use client';

import Link from 'next/link';
import { ArrowLeft, BookOpen, Plus } from 'lucide-react';

export default function LeccionesPage() {
    const lessons = []; // TODO: Fetch from API

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <Link href="/mejora-continua" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold mb-4 transition-colors">
                    <ArrowLeft size={20} />
                    Volver al Dashboard
                </Link>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 mb-2">Lecciones Aprendidas</h1>
                        <p className="text-slate-600">Repositorio de conocimiento y mejores prácticas</p>
                    </div>
                    <Link href="/mejora-continua/lecciones/nueva" className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-semibold shadow-sm">
                        <Plus size={20} />
                        Nueva Lección
                    </Link>
                </div>
            </div>

            {/* Empty State */}
            <div className="bg-white rounded-2xl p-12 border-2 border-dashed border-slate-300 text-center">
                <BookOpen className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-700 mb-2">No hay lecciones aprendidas registradas</h3>
                <p className="text-slate-500 mb-6">Documenta el conocimiento adquirido de proyectos y experiencias</p>
                <Link href="/mejora-continua/lecciones/nueva" className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-semibold">
                    <Plus size={20} />
                    Registrar Primera Lección
                </Link>
            </div>
        </div>
    );
}
