'use client';

import Link from 'next/link';
import { ArrowLeft, Plus, Calendar } from 'lucide-react';

export default function ProyectosPage() {
    const projects = []; // TODO: Fetch from API

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <Link href="/mejora-continua" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold mb-4 transition-colors">
                    <ArrowLeft size={20} />
                    Volver al Dashboard
                </Link>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 mb-2">Proyectos de Mejora</h1>
                        <p className="text-slate-600">Gestión de proyectos con metodología PDCA</p>
                    </div>
                    <Link href="/mejora-continua/proyectos/nuevo" className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold shadow-sm">
                        <Plus size={20} />
                        Nuevo Proyecto
                    </Link>
                </div>
            </div>

            {/* PDCA Kanban Placeholder */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {['PLAN', 'DO', 'CHECK', 'ACT'].map((phase) => (
                    <div key={phase} className="bg-white rounded-xl p-4 border border-slate-200">
                        <h3 className="font-bold text-slate-900 mb-3">{phase}</h3>
                        <div className="text-center py-8 text-slate-400 text-sm">Sin proyectos</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
