'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle, Clock, Edit, Calendar, Filter } from 'lucide-react';

interface CorrectiveAction {
    id: number;
    action_code: string;
    finding_description: string;
    finding_type: string;
    requirement_code: string;
    chapter_title: string;
    audit_code: string;
    root_cause_analysis: string;
    corrective_action: string;
    responsible: string;
    target_date: string;
    completion_date: string;
    status: string;
    progress: number;
}

export default function AccionesCorrectivasPage() {
    const [actions, setActions] = useState<CorrectiveAction[]>([]);
    const [filteredActions, setFilteredActions] = useState<CorrectiveAction[]>([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editProgress, setEditProgress] = useState(0);

    useEffect(() => {
        fetchActions();
    }, []);

    useEffect(() => {
        if (statusFilter) {
            setFilteredActions(actions.filter(a => a.status === statusFilter));
        } else {
            setFilteredActions(actions);
        }
    }, [actions, statusFilter]);

    const fetchActions = async () => {
        try {
            const response = await fetch('/api/auditoria/actions');
            const data = await response.json();
            setActions(data);
            setFilteredActions(data);
        } catch (error) {
            console.error('Error fetching actions:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateProgress = async (id: number, progress: number, status: string) => {
        try {
            const response = await fetch('/api/auditoria/actions', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id,
                    progress,
                    status: progress === 100 ? 'CLOSED' : status,
                    completion_date: progress === 100 ? new Date().toISOString().split('T')[0] : null
                })
            });

            if (response.ok) {
                fetchActions();
                setEditingId(null);
            }
        } catch (error) {
            console.error('Error updating action:', error);
        }
    };

    const getStatusBadge = (status: string) => {
        const badges: Record<string, { bg: string; text: string }> = {
            OPEN: { bg: 'bg-red-100', text: 'text-red-700' },
            IN_PROGRESS: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
            CLOSED: { bg: 'bg-green-100', text: 'text-green-700' }
        };

        const badge = badges[status] || badges.OPEN;

        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${badge.bg} ${badge.text}`}>
                {status === 'OPEN' ? 'Abierta' : status === 'IN_PROGRESS' ? 'En Progreso' : 'Cerrada'}
            </span>
        );
    };

    const isOverdue = (targetDate?: string) => {
        if (!targetDate) return false;
        return new Date(targetDate) < new Date();
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'No definida';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const stats = {
        total: actions.length,
        open: actions.filter(a => a.status === 'OPEN').length,
        inProgress: actions.filter(a => a.status === 'IN_PROGRESS').length,
        closed: actions.filter(a => a.status === 'CLOSED').length,
        overdue: actions.filter(a => isOverdue(a.target_date) && a.status !== 'CLOSED').length
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
                <h1 className="text-3xl font-black text-slate-900 mb-2">Acciones Correctivas</h1>
                <p className="text-slate-600">
                    Seguimiento y gestión de acciones correctivas derivadas de no conformidades
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                    <div className="text-3xl font-black text-slate-900">{stats.total}</div>
                    <div className="text-sm text-slate-600 mt-1">Total</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                    <div className="text-3xl font-black text-red-600">{stats.open}</div>
                    <div className="text-sm text-slate-600 mt-1">Abiertas</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                    <div className="text-3xl font-black text-yellow-600">{stats.inProgress}</div>
                    <div className="text-sm text-slate-600 mt-1">En Progreso</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                    <div className="text-3xl font-black text-green-600">{stats.closed}</div>
                    <div className="text-sm text-slate-600 mt-1">Cerradas</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                    <div className="text-3xl font-black text-orange-600">{stats.overdue}</div>
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
                        <option value="OPEN">Abiertas</option>
                        <option value="IN_PROGRESS">En Progreso</option>
                        <option value="CLOSED">Cerradas</option>
                    </select>
                </div>
            </div>

            {/* Actions List */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-slate-600">Cargando acciones correctivas...</p>
                    </div>
                </div>
            ) : filteredActions.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 border-2 border-dashed border-slate-300 text-center">
                    <Clock className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-700 mb-2">No hay acciones correctivas</h3>
                    <p className="text-slate-500">
                        Las acciones se generan automáticamente al registrar no conformidades
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredActions.map((action) => (
                        <div
                            key={action.id}
                            className={`bg-white rounded-xl p-6 border-2 shadow-sm transition-all ${isOverdue(action.target_date) && action.status !== 'CLOSED'
                                ? 'border-red-300 bg-red-50'
                                : 'border-slate-200'
                                }`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        {getStatusBadge(action.status)}
                                        <span className="text-xs font-mono text-slate-500">{action.action_code}</span>
                                        {isOverdue(action.target_date) && action.status !== 'CLOSED' && (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                                                <AlertTriangle size={12} />
                                                Vencida
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">{action.corrective_action}</h3>
                                    <p className="text-sm text-slate-600 mb-2">
                                        <strong>Hallazgo:</strong> {action.finding_description}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        <strong>Requisito:</strong> {action.requirement_code} - {action.chapter_title}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <div className="text-xs font-bold text-slate-500 uppercase mb-1">Responsable</div>
                                    <div className="text-sm text-slate-900">{action.responsible || 'No asignado'}</div>
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-500 uppercase mb-1">Fecha Meta</div>
                                    <div className={`text-sm font-semibold flex items-center gap-1 ${isOverdue(action.target_date) && action.status !== 'CLOSED' ? 'text-red-600' : 'text-slate-900'
                                        }`}>
                                        <Calendar size={14} />
                                        {formatDate(action.target_date)}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-500 uppercase mb-1">Completado</div>
                                    <div className="text-sm text-slate-900">{formatDate(action.completion_date)}</div>
                                </div>
                            </div>

                            {/* Progress */}
                            <div className="mb-3">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-bold text-slate-700">Progreso</span>
                                    {editingId === action.id ? (
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
                                                onClick={() => updateProgress(action.id, editProgress, action.status)}
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
                                            <span className="text-sm font-black text-slate-900">{action.progress}%</span>
                                            <button
                                                onClick={() => {
                                                    setEditingId(action.id);
                                                    setEditProgress(action.progress);
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
                                        className={`h-3 rounded-full transition-all ${action.progress === 100 ? 'bg-green-600' : action.progress >= 50 ? 'bg-blue-600' : 'bg-yellow-500'
                                            }`}
                                        style={{ width: `${action.progress}%` }}
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
