'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, ThumbsUp, MessageSquare, Filter, Search } from 'lucide-react';

export default function SugerenciasPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const suggestions = []; // TODO: Fetch from API

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <Link href="/mejora-continua" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold mb-4 transition-colors">
                    <ArrowLeft size={20} />
                    Volver al Dashboard
                </Link>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 mb-2">Sugerencias de Mejora</h1>
                        <p className="text-slate-600">Sistema Kaizen para ideas de mejora continua</p>
                    </div>
                    <Link href="/mejora-continua/sugerencias/nueva" className="flex items-center gap-2 px-6 py-3 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition-colors font-semibold shadow-sm">
                        <Plus size={20} />
                        Nueva Sugerencia
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                        <input type="text" placeholder="Buscar sugerencias..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 appearance-none">
                            <option value="">Todos los estados</option>
                            <option value="NEW">Nueva</option>
                            <option value="UNDER_REVIEW">En Evaluación</option>
                            <option value="APPROVED">Aprobada</option>
                            <option value="IMPLEMENTED">Implementada</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Empty State */}
            {suggestions.length === 0 && (
                <div className="bg-white rounded-2xl p-12 border-2 border-dashed border-slate-300 text-center">
                    <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Plus className="w-8 h-8 text-yellow-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-700 mb-2">No hay sugerencias registradas</h3>
                    <p className="text-slate-500 mb-6">Comienza creando tu primera sugerencia de mejora</p>
                    <Link href="/mejora-continua/sugerencias/nueva" className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition-colors font-semibold">
                        <Plus size={20} />
                        Crear Primera Sugerencia
                    </Link>
                </div>
            )}
        </div>
    );
}
