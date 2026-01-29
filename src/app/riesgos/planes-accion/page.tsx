'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, AlertTriangle, CheckCircle2, Edit, Filter, Calendar, ArrowLeft } from 'lucide-react';

interface ActionPlan {
    id: number;
    assessment_id: number;
    action_description: string;
    responsible?: string;
    start_date?: string;
    target_date?: string;
    completion_date?: string;
    status: string;
    progress: number;
    inherent_risk_level?: string;
    risk_description?: string;
    category_name?: string;
}

export default function PlanesAccionPage() {
    const [actionPlans, setActionPlans] = useState<ActionPlan[]>([]);
    const [filteredPlans, setFilteredPlans] = useState<ActionPlan[]>([]);
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editProgress, setEditProgress] = useState(0);

    useEffect(() => {
        fetchActionPlans();
    }, []);

    useEffect(() => {
        if (statusFilter) {
            setFilteredPlans(actionPlans.filter(p => p.status === statusFilter));
        } else {
            setFilteredPlans(actionPlans);
        }
    }, [actionPlans, statusFilter]);

    const fetchActionPlans = async () => {
        try {
            const response = await fetch('/api/riesgos/action-plans');
            const data = await response.json();
            setActionPlans(data);
            setFilteredPlans(data);
        } catch (error) {
            console.error('Error fetching action plans:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateProgress = async (id: number, progress: number, status: string) => {
        try {
            const response = await fetch('/api/riesgos/action-plans', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id,
                    progress,
                    status: progress === 100 ? 'COMPLETED' : status,
                    completion_date: progress === 100 ? new Date().toISOString().split('T')[0] : null
                })
            });

            if (response.ok) {
                fetchActionPlans();
                setEditingId(null);
            }
        } catch (error) {
            console.error('Error updating action plan:', error);
        }
    };

    const getStatusBadge = (status: string) => {
        const badges: Record<string, { bg: string; text: string; icon: any }> = {
            PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock },
            IN_PROGRESS: { bg: 'bg-blue-100', text: 'text-blue-700', icon: AlertTriangle },
            COMPLETED: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle2 },
            CANCELLED: { bg: 'bg-gray-100', text: 'text-gray-700', icon: Clock }
        };

        const badge = badges[status] || badges.PENDING;
        const Icon = badge.icon;

        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${badge.bg} ${badge.text}`}>
                <Icon size={12} />
                {status === 'PENDING' ? 'Pendiente' : status === 'IN_PROGRESS' ? 'En Progreso' : status === 'COMPLETED' ? 'Completado' : 'Cancelado'}
            </span>
        );
    };

    const getRiskLevelBadge = (level?: string) => {
        if (!level) return null;

        const colors: Record<string, string> = {
            'MUY BAJO': 'bg-green-500',
            'BAJO': 'bg-green-400',
            'MEDIO': 'bg-yellow-500',
            'ALTO': 'bg-orange-500',
            'MUY ALTO': 'bg-red-500'
        };

        return (
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white ${colors[level] || 'bg-gray-500'}`}>
                {level}
            </span>
        );
    };

    const isOverdue = (targetDate?: string) => {
        if (!targetDate) return false;
        return new Date(targetDate) < new Date() && !actionPlans.find(p => p.target_date === targetDate && p.status === 'COMPLETED');
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'No definida';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const stats = {
        total: actionPlans.length,
        pending: actionPlans.filter(p => p.status === 'PENDING').length,
        inProgress: actionPlans.filter(p => p.status === 'IN_PROGRESS').length,
        completed: actionPlans.filter(p => p.status === 'COMPLETED').length,
        overdue: actionPlans.filter(p => isOverdue(p.target_date) && p.status !== 'COMPLETED').length
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <Link
                    href="/riesgos"
                    className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold mb-4 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Volver al Dashboard
                </Link>
                <h1 className="text-3xl font-black text-slate-900 mb-2">Planes de Acción</h1>
                <p className="text-slate-600">
                    Gestión y seguimiento de planes de acción para mitigación de riesgos
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                    <div className="text-3xl font-black text-slate-900">{stats.total}</div>
                    <div className="text-sm text-slate-600 mt-1">Total Acciones</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                    <div className="text-3xl font-black text-yellow-600">{stats.pending}</div>
                    <div className="text-sm text-slate-600 mt-1">Pendientes</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                    <div className="text-3xl font-black text-blue-600">{stats.inProgress}</div>
                    <div className="text-sm text-slate-600 mt-1">En Progreso</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                    <div className="text-3xl font-black text-green-600">{stats.completed}</div>
                    <div className="text-sm text-slate-600 mt-1">Completadas</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                    <div className="text-3xl font-black text-red-600">{stats.overdue}</div>
                    <div className="text-sm text-slate-600 mt-1">Vencidas</div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-6">
                <div className="flex items-center gap-3">
                    <Filter className="text-slate-400" size={20} />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="flex-1 px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Todos los estados</option>
                        <option value="PENDING">Pendientes</option>
                        <option value="IN_PROGRESS">En Progreso</option>
                        <option value="COMPLETED">Completadas</option>
                    </select>
                </div>
            </div>

            {/* Action Plans List */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-slate-600">Cargando planes de acción...</p>
                    </div>
                </div>
            ) : filteredPlans.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 border-2 border-dashed border-slate-300 text-center">
                    <Clock className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-700 mb-2">No hay planes de acción</h3>
                    <p className="text-slate-500">
                        Los planes de acción se generan automáticamente para riesgos "NO ACEPTABLES"
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredPlans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`bg-white rounded-xl p-6 border-2 shadow-sm transition-all ${isOverdue(plan.target_date) && plan.status !== 'COMPLETED'
                                ? 'border-red-300 bg-red-50'
                                : 'border-slate-200'
                                }`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        {getStatusBadge(plan.status)}
                                        {plan.inherent_risk_level && getRiskLevelBadge(plan.inherent_risk_level)}
                                        {isOverdue(plan.target_date) && plan.status !== 'COMPLETED' && (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                                                <AlertTriangle size={12} />
                                                Vencida
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">{plan.action_description}</h3>
                                    {plan.risk_description && (
                                        <p className="text-sm text-slate-600 mb-2">
                                            <strong>Riesgo:</strong> {plan.risk_description}
                                        </p>
                                    )}
                                    {plan.category_name && (
                                        <p className="text-xs text-slate-500">
                                            <strong>Categoría:</strong> {plan.category_name}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <div>
                                    <div className="text-xs font-bold text-slate-500 uppercase mb-1">Responsable</div>
                                    <div className="text-sm text-slate-900">{plan.responsible || 'No asignado'}</div>
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-500 uppercase mb-1">Fecha Inicio</div>
                                    <div className="text-sm text-slate-900 flex items-center gap-1">
                                        <Calendar size={14} className="text-slate-400" />
                                        {formatDate(plan.start_date)}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-500 uppercase mb-1">Fecha Meta</div>
                                    <div className={`text-sm font-semibold flex items-center gap-1 ${isOverdue(plan.target_date) && plan.status !== 'COMPLETED' ? 'text-red-600' : 'text-slate-900'
                                        }`}>
                                        <Calendar size={14} className="text-slate-400" />
                                        {formatDate(plan.target_date)}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-500 uppercase mb-1">Completado</div>
                                    <div className="text-sm text-slate-900 flex items-center gap-1">
                                        <Calendar size={14} className="text-slate-400" />
                                        {formatDate(plan.completion_date)}
                                    </div>
                                </div>
                            </div>

                            {/* Progress */}
                            <div className="mb-3">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-bold text-slate-700">Progreso</span>
                                    {editingId === plan.id ? (
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={editProgress}
                                                onChange={(e) => setEditProgress(Number(e.target.value))}
                                                className="w-20 px-2 py-1 border border-slate-300 rounded text-sm"
                                            />
                                            <button
                                                onClick={() => updateProgress(plan.id, editProgress, plan.status)}
                                                className="px-3 py-1 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700"
                                            >
                                                Guardar
                                            </button>
                                            <button
                                                onClick={() => setEditingId(null)}
                                                className="px-3 py-1 bg-gray-600 text-white rounded-lg text-xs font-bold hover:bg-gray-700"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-black text-slate-900">{plan.progress}%</span>
                                            <button
                                                onClick={() => {
                                                    setEditingId(plan.id);
                                                    setEditProgress(plan.progress);
                                                }}
                                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                            >
                                                <Edit size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-3">
                                    <div
                                        className={`h-3 rounded-full transition-all ${plan.progress === 100 ? 'bg-green-600' : plan.progress >= 50 ? 'bg-blue-600' : 'bg-yellow-500'
                                            }`}
                                        style={{ width: `${plan.progress}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
