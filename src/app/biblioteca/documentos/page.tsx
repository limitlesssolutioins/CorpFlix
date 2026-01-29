'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, FolderOpen, FileText, Download, Eye } from 'lucide-react';

export default function DocumentosPage() {
    const [selectedCategory, setSelectedCategory] = useState('');

    const categories = [
        { id: 1, name: 'Normas', count: 0, color: 'bg-blue-100 text-blue-700' },
        { id: 2, name: 'Procedimientos', count: 0, color: 'bg-green-100 text-green-700' },
        { id: 3, name: 'Políticas', count: 0, color: 'bg-purple-100 text-purple-700' },
        { id: 4, name: 'Formatos', count: 0, color: 'bg-orange-100 text-orange-700' },
        { id: 5, name: 'Referencias', count: 0, color: 'bg-cyan-100 text-cyan-700' },
        { id: 6, name: 'Capacitación', count: 0, color: 'bg-pink-100 text-pink-700' }
    ];

    const documents = []; // TODO: Fetch from API

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <Link href="/biblioteca" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold mb-4 transition-colors">
                    <ArrowLeft size={20} />
                    Volver a Biblioteca
                </Link>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 mb-2">Gestión de Documentos</h1>
                        <p className="text-slate-600">Organiza y administra la documentación del sistema</p>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold shadow-sm">
                        <Upload size={20} />
                        Subir Documento
                    </button>
                </div>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.name)}
                        className={`p-4 rounded-xl border-2 transition-all ${selectedCategory === cat.name
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-slate-200 hover:border-blue-300'
                            }`}
                    >
                        <FolderOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <h3 className="font-bold text-slate-900 text-sm mb-1">{cat.name}</h3>
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${cat.color}`}>
                            {cat.count} docs
                        </span>
                    </button>
                ))}
            </div>

            {/* Upload Area */}
            <div className="bg-white rounded-2xl p-12 border-2 border-dashed border-slate-300 text-center mb-8">
                <Upload className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-700 mb-2">Arrastra archivos aquí o haz click para subir</h3>
                <p className="text-slate-500 text-sm mb-4">Soporta PDF, Word, Excel, PowerPoint</p>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold">
                    Seleccionar Archivos
                </button>
            </div>

            {/* Documents List */}
            {documents.length === 0 ? (
                <div className="bg-slate-50 rounded-xl p-8 text-center">
                    <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-600">No hay documentos en esta categoría</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {/* Document items would go here */}
                </div>
            )}
        </div>
    );
}
