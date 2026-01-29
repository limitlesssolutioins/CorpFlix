'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Calendar, Filter, CheckCircle2, Clock, Search, ArrowLeft } from 'lucide-react';

interface Audit {
    id: number;
    audit_code: string;
    audit_type_name: string;
    audit_date: string;
    auditor_name: string;
    scope: string;
    status: string;
}

export default function AuditoriasPage() {
    const [audits, setAudits] = useState<Audit[]>([]);
    const [filteredAudits, setFilteredAudits] = useState<Audit[]>([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAudits();
    }, []);

    useEffect(() => {
        let filtered = audits;

        if (statusFilter) {
            filtered = filtered.filter(a => a.status === statusFilter);
        }

        if (searchQuery) {
            filtered = filtered.filter(a =>
                a.audit_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                a.auditor_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                a.scope?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredAudits(filtered);
    }, [audits, statusFilter, searchQuery]);

    const fetchAudits = async () => {
        try {
            const response = await fetch('/api/auditoria/audits');
            const data = await response.json();
            setAudits(data);
            setFilteredAudits(data);
        } catch (error) {
            console.error('Error fetching audits:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const badges: Record<string, { bg: string; text: string; icon: any }> = {
            PLANNED: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Calendar },
            IN_PROGRESS: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock },
            COMPLETED: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle2 }
        };

        const badge = badges[status] || badges.PLANNED;
        const Icon = badge.icon;

        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${badge.bg} ${badge.text}`}>
                <Icon size={12} />
                {status === 'PLANNED' ? 'Planificada' : status === 'IN_PROGRESS' ? 'En Progreso' : 'Completada'}
            </span>
        );
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <Link
                    href="/auditoria"
                    className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold mb-4 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Volver al Dashboard
                </Link>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 mb-2">Gestión de Auditorías</h1>
                        <p className="text-slate-600">Planifica y gestiona auditorías internas del sistema de calidad</p>
                    </div>
                    <Link
                        href="/auditoria/auditorias/nueva"
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold shadow-sm"
                    >
                        <Plus size={20} />
                        Nueva Auditoría
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar por código, auditor o alcance..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                        >
                            <option value="">Todos los estados</option>
                            <option value="PLANNED">Planificadas</option>
                            <option value="IN_PROGRESS">En Progreso</option>
                            <option value="COMPLETED">Completadas</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Results Count */}
            <div className="mb-4 text-sm text-slate-600 font-semibold">
                {filteredAudits.length} auditoría{filteredAudits.length !== 1 ? 's' : ''} encontrada{filteredAudits.length !== 1 ? 's' : ''}
            </div>

            {/* Audits List */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-slate-600">Cargando auditorías...</p>
                    </div>
                </div>
            ) : filteredAudits.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 border-2 border-dashed border-slate-300 text-center">
                    <Calendar className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-700 mb-2">No se encontraron auditorías</h3>
                    <p className="text-slate-500 mb-6">
                        {searchQuery || statusFilter ? 'Intenta ajustar los filtros' : 'Comienza creando tu primera auditoría'}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredAudits.map((audit) => (
                        <div
                            key={audit.id}
                            className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        {getStatusBadge(audit.status)}
                                        <span className="text-sm font-mono text-slate-500">{audit.audit_code}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                                        {audit.audit_type_name || 'Auditoría Interna'}
                                    </h3>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <div className="text-xs font-bold text-slate-500 uppercase mb-1">Fecha</div>
                                    <div className="text-sm text-slate-900 font-semibold">{formatDate(audit.audit_date)}</div>
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-500 uppercase mb-1">Auditor</div>
                                    <div className="text-sm text-slate-900">{audit.auditor_name || 'No asignado'}</div>
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-500 uppercase mb-1">Alcance</div>
                                    <div className="text-sm text-slate-900">{audit.scope || 'No definido'}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Link
                                    href={`/auditoria/hallazgos?audit_id=${audit.id}`}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-semibold"
                                >
                                    Registrar Hallazgos
                                </Link>
                                <Link
                                    href={`/auditoria/auditorias/${audit.id}`}
                                    className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-semibold"
                                >
                                    Ver Detalles
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
