'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Filter, Edit, Trash2, AlertCircle, ArrowLeft } from 'lucide-react';

interface Risk {
    id: number;
    category_id: number;
    code?: string;
    type?: string;
    description: string;
    caused_by?: string;
    impact?: string;
    status?: string;
}

interface Category {
    id: number;
    code: string;
    name: string;
    color?: string;
    icon?: string;
}

export default function CatalogoRiesgosPage() {
    const [risks, setRisks] = useState<Risk[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        fetchCategories();
        fetchRisks();
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            fetchRisks(selectedCategory);
        } else {
            fetchRisks();
        }
    }, [selectedCategory]);

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/riesgos/categories');
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchRisks = async (categoryCode?: string) => {
        try {
            setLoading(true);
            const category = categories.find(c => c.code === categoryCode);
            const url = category
                ? `/api/riesgos/risks?category_id=${category.id}&status=ACTIVE`
                : '/api/riesgos/risks?status=ACTIVE';

            const response = await fetch(url);
            const data = await response.json();
            setRisks(data);
        } catch (error) {
            console.error('Error fetching risks:', error);
        } finally {
            setLoading(false);
        }
    };

    const getCategoryName = (categoryId: number) => {
        const cat = categories.find(c => c.id === categoryId);
        return cat ? cat.name : 'Desconocido';
    };

    const getCategoryColor = (categoryId: number) => {
        const cat = categories.find(c => c.id === categoryId);
        return cat?.color || '#94a3b8';
    };

    const filteredRisks = risks.filter(risk => {
        const matchesSearch =
            risk.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            risk.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            risk.caused_by?.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesSearch;
    });

    const handleImportCatalog = async (categoryCode: string) => {
        try {
            const response = await fetch('/api/riesgos/import', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category: categoryCode })
            });

            const result = await response.json();

            if (result.success) {
                alert(`✅ Se importaron ${result.imported} riesgos de ${result.category}`);
                fetchRisks();
            } else {
                alert(`❌ Error al importar: ${result.error}`);
            }
        } catch (error) {
            console.error('Error importing catalog:', error);
            alert('❌ Error al importar catálogo');
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/riesgos"
                    className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold mb-4 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Volver al Dashboard
                </Link>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 mb-2">Catálogo de Riesgos</h1>
                        <p className="text-slate-600">
                            Gestión completa del catálogo de riesgos identificados por categoría
                        </p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold shadow-sm"
                    >
                        <Plus size={20} />
                        Agregar Riesgo
                    </button>
                </div>

                {/* Import Catalogs */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                            <h3 className="font-bold text-blue-900 mb-2">Importar Catálogos Predefinidos</h3>
                            <div className="flex flex-wrap gap-2">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.code}
                                        onClick={() => handleImportCatalog(cat.code)}
                                        className="px-3 py-1.5 bg-white border-2 border-blue-200 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-semibold"
                                    >
                                        Importar {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar por descripción, tipo o causa..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                        >
                            <option value="">Todas las categorías</option>
                            {categories.map((cat) => (
                                <option key={cat.code} value={cat.code}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Results Count */}
            <div className="mb-4 text-sm text-slate-600 font-semibold">
                {filteredRisks.length} riesgo{filteredRisks.length !== 1 ? 's' : ''} encontrado{filteredRisks.length !== 1 ? 's' : ''}
            </div>

            {/* Risks Table */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-slate-600">Cargando riesgos...</p>
                    </div>
                </div>
            ) : filteredRisks.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 border-2 border-dashed border-slate-300 text-center">
                    <AlertCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-700 mb-2">No se encontraron riesgos</h3>
                    <p className="text-slate-500 mb-6">
                        {searchQuery || selectedCategory
                            ? 'Intenta ajustar los filtros de búsqueda'
                            : 'Comienza importando un catálogo o agregando riesgos manualmente'}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredRisks.map((risk) => (
                        <div
                            key={risk.id}
                            className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span
                                            className="px-3 py-1 rounded-full text-xs font-bold text-white"
                                            style={{ backgroundColor: getCategoryColor(risk.category_id) }}
                                        >
                                            {getCategoryName(risk.category_id)}
                                        </span>
                                        {risk.type && (
                                            <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold">
                                                {risk.type}
                                            </span>
                                        )}
                                        {risk.code && (
                                            <span className="text-xs text-slate-500 font-mono">{risk.code}</span>
                                        )}
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">{risk.description}</h3>

                                    {risk.caused_by && (
                                        <div className="mb-2">
                                            <span className="text-xs font-bold text-slate-500 uppercase">Causado por:</span>
                                            <p className="text-sm text-slate-700 mt-1">{risk.caused_by}</p>
                                        </div>
                                    )}

                                    {risk.impact && (
                                        <div>
                                            <span className="text-xs font-bold text-slate-500 uppercase">Impacto:</span>
                                            <p className="text-sm text-slate-700 mt-1">{risk.impact}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 ml-4">
                                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                        <Edit size={18} />
                                    </button>
                                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
