'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    ArrowLeft, AlertTriangle, Clock, Edit2, Calendar, Search,
    CheckCircle2, X, Save, Loader2, ChevronDown, User, FileText,
    TrendingUp, Filter,
} from 'lucide-react';

interface CorrectiveAction {
    id: number;
    action_code: string;
    finding_description: string;
    finding_type: string;
    requirement_code: string;
    chapter_title: string;
    audit_code: string;
    standard_name: string;
    root_cause_analysis: string;
    corrective_action: string;
    responsible: string;
    target_date: string;
    completion_date: string;
    status: string;
    progress: number;
    notes: string;
}

interface EditForm {
    corrective_action: string;
    responsible: string;
    target_date: string;
    root_cause_analysis: string;
    notes: string;
    status: string;
    progress: number;
}

const STATUS_CONFIG: Record<string, { bg: string; text: string; border: string; label: string }> = {
    OPEN: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-300', label: 'Abierta' },
    IN_PROGRESS: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-300', label: 'En Progreso' },
    CLOSED: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-300', label: 'Cerrada' },
};

export default function AccionesCorrectivasPage() {
    const [actions, setActions] = useState<CorrectiveAction[]>([]);
    const [filtered, setFiltered] = useState<CorrectiveAction[]>([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Edit modal
    const [editModal, setEditModal] = useState<CorrectiveAction | null>(null);
    const [editForm, setEditForm] = useState<EditForm>({
        corrective_action: '', responsible: '', target_date: '',
        root_cause_analysis: '', notes: '', status: 'OPEN', progress: 0,
    });

    useEffect(() => { fetchActions(); }, []);

    useEffect(() => {
        let result = actions;
        if (statusFilter) result = result.filter(a => a.status === statusFilter);
        if (search) result = result.filter(a =>
            a.action_code?.toLowerCase().includes(search.toLowerCase()) ||
            a.corrective_action?.toLowerCase().includes(search.toLowerCase()) ||
            a.responsible?.toLowerCase().includes(search.toLowerCase()) ||
            a.audit_code?.toLowerCase().includes(search.toLowerCase()) ||
            a.requirement_code?.toLowerCase().includes(search.toLowerCase())
        );
        setFiltered(result);
    }, [actions, statusFilter, search]);

    const fetchActions = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/auditoria/actions');
            const data = await response.json();
            setActions(Array.isArray(data) ? data : []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const openEdit = (action: CorrectiveAction) => {
        setEditModal(action);
        setEditForm({
            corrective_action: action.corrective_action || '',
            responsible: action.responsible || '',
            target_date: action.target_date ? action.target_date.split('T')[0] : '',
            root_cause_analysis: action.root_cause_analysis || '',
            notes: action.notes || '',
            status: action.status || 'OPEN',
            progress: action.progress || 0,
        });
    };

    const saveEdit = async () => {
        if (!editModal) return;
        setSaving(true);
        try {
            const body: any = { id: editModal.id, ...editForm };
            if (editForm.progress === 100) {
                body.completion_date = new Date().toISOString().split('T')[0];
                body.status = 'CLOSED';
            }
            const res = await fetch('/api/auditoria/actions', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            if (res.ok) {
                await fetchActions();
                setEditModal(null);
            }
        } catch (e) { console.error(e); }
        finally { setSaving(false); }
    };

    const isOverdue = (targetDate?: string, status?: string) => {
        if (!targetDate || status === 'CLOSED') return false;
        return new Date(targetDate) < new Date();
    };

    const formatDate = (d?: string) => {
        if (!d) return '—';
        return new Date(d).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const stats = {
        total: actions.length,
        open: actions.filter(a => a.status === 'OPEN').length,
        inProgress: actions.filter(a => a.status === 'IN_PROGRESS').length,
        closed: actions.filter(a => a.status === 'CLOSED').length,
        overdue: actions.filter(a => isOverdue(a.target_date, a.status)).length,
    };

    return (
        <div className="max-w-7xl mx-auto space-y-5">
            {/* Header */}
            <div>
                <Link href="/auditoria" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-semibold transition-colors text-sm mb-4">
                    <ArrowLeft size={16} /> Volver al módulo
                </Link>
                <h1 className="text-2xl font-black text-slate-900">Acciones Correctivas</h1>
                <p className="text-slate-500 text-sm mt-0.5">Seguimiento y gestión de acciones derivadas de no conformidades</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {[
                    { label: 'Total', value: stats.total, color: 'text-slate-800', bg: 'bg-slate-50', border: 'border-slate-200' },
                    { label: 'Abiertas', value: stats.open, color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' },
                    { label: 'En Progreso', value: stats.inProgress, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
                    { label: 'Cerradas', value: stats.closed, color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
                    { label: 'Vencidas', value: stats.overdue, color: stats.overdue > 0 ? 'text-red-700' : 'text-slate-400', bg: stats.overdue > 0 ? 'bg-red-50' : 'bg-slate-50', border: stats.overdue > 0 ? 'border-red-300' : 'border-slate-200' },
                ].map(s => (
                    <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl p-3 text-center`}>
                        <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
                        <div className="text-xs font-semibold text-slate-500 mt-0.5">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap items-center">
                <div className="relative">
                    <Filter size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        className="pl-8 pr-8 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white appearance-none"
                    >
                        <option value="">Todos los estados</option>
                        <option value="OPEN">Abiertas</option>
                        <option value="IN_PROGRESS">En Progreso</option>
                        <option value="CLOSED">Cerradas</option>
                    </select>
                </div>
                <div className="relative">
                    <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text" placeholder="Buscar por código, responsable, requisito..."
                        value={search} onChange={e => setSearch(e.target.value)}
                        className="pl-8 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 w-72 bg-white"
                    />
                </div>
                {stats.overdue > 0 && (
                    <button onClick={() => { setStatusFilter(''); setSearch(''); }}
                        className="ml-auto flex items-center gap-1.5 px-3 py-2 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors">
                        <AlertTriangle size={13} /> {stats.overdue} acción{stats.overdue !== 1 ? 'es' : ''} vencida{stats.overdue !== 1 ? 's' : ''}
                    </button>
                )}
            </div>

            {/* List */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 border-2 border-dashed border-slate-200 text-center">
                    <CheckCircle2 className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                    <h3 className="font-bold text-slate-600 mb-1">No hay acciones correctivas</h3>
                    <p className="text-sm text-slate-400">
                        {search || statusFilter ? 'Ajusta los filtros' : 'Se generan automáticamente al registrar no conformidades en el checklist'}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map(action => {
                        const st = STATUS_CONFIG[action.status] || STATUS_CONFIG.OPEN;
                        const overdue = isOverdue(action.target_date, action.status);
                        const progressColor = action.progress === 100 ? '#22c55e' : action.progress >= 50 ? '#3b82f6' : '#f59e0b';

                        return (
                            <div key={action.id}
                                className={`bg-white rounded-2xl border-2 shadow-sm transition-all ${overdue ? 'border-red-200 bg-red-50/30' : 'border-slate-200'}`}>
                                <div className="p-5">
                                    {/* Header */}
                                    <div className="flex items-start justify-between gap-3 mb-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap mb-2">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${st.bg} ${st.text} ${st.border}`}>
                                                    {action.status === 'OPEN' && <Clock size={10} className="mr-1" />}
                                                    {action.status === 'IN_PROGRESS' && <TrendingUp size={10} className="mr-1" />}
                                                    {action.status === 'CLOSED' && <CheckCircle2 size={10} className="mr-1" />}
                                                    {st.label}
                                                </span>
                                                <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{action.action_code}</span>
                                                {action.standard_name && (
                                                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{action.standard_name}</span>
                                                )}
                                                {overdue && (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold border border-red-300">
                                                        <AlertTriangle size={10} /> Vencida
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="font-bold text-slate-900 leading-tight">{action.corrective_action}</h3>
                                        </div>
                                        <button
                                            onClick={() => openEdit(action)}
                                            className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                                        >
                                            <Edit2 size={13} /> Editar
                                        </button>
                                    </div>

                                    {/* NC origin */}
                                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 mb-4">
                                        <div className="flex items-start gap-2">
                                            <FileText size={13} className="text-slate-400 shrink-0 mt-0.5" />
                                            <div className="min-w-0">
                                                <div className="text-xs text-slate-500 mb-0.5">
                                                    <span className="font-bold text-slate-700">{action.requirement_code}</span>
                                                    {action.chapter_title && ` · ${action.chapter_title}`}
                                                    {action.audit_code && ` · Auditoría ${action.audit_code}`}
                                                </div>
                                                <p className="text-xs text-slate-600 leading-relaxed">{action.finding_description || 'Sin descripción de hallazgo'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Details grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                                        <div>
                                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Responsable</div>
                                            <div className="flex items-center gap-1 text-sm text-slate-800 font-semibold">
                                                <User size={13} className="text-slate-400 shrink-0" />
                                                {action.responsible || <span className="text-slate-400 font-normal">Sin asignar</span>}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Fecha Meta</div>
                                            <div className={`flex items-center gap-1 text-sm font-semibold ${overdue ? 'text-red-600' : 'text-slate-800'}`}>
                                                <Calendar size={13} className="shrink-0" />
                                                {formatDate(action.target_date)}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Fecha Cierre</div>
                                            <div className="text-sm text-slate-700">{formatDate(action.completion_date)}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Avance</div>
                                            <div className="text-sm font-black" style={{ color: progressColor }}>{action.progress}%</div>
                                        </div>
                                    </div>

                                    {/* Progress bar */}
                                    <div className="w-full bg-slate-100 rounded-full h-2">
                                        <div
                                            className="h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${action.progress}%`, backgroundColor: progressColor }}
                                        />
                                    </div>

                                    {/* Root cause if present */}
                                    {action.root_cause_analysis && (
                                        <div className="mt-3 text-xs text-slate-500">
                                            <span className="font-bold text-slate-600">Causa raíz: </span>
                                            {action.root_cause_analysis}
                                        </div>
                                    )}
                                    {action.notes && (
                                        <div className="mt-1 text-xs text-slate-500">
                                            <span className="font-bold text-slate-600">Notas: </span>
                                            {action.notes}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Edit Modal */}
            {editModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setEditModal(null)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        {/* Modal header */}
                        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
                            <div>
                                <h2 className="font-black text-slate-900">Editar Acción Correctiva</h2>
                                <p className="text-xs text-slate-400 font-mono mt-0.5">{editModal.action_code}</p>
                            </div>
                            <button onClick={() => setEditModal(null)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors">
                                <X size={16} />
                            </button>
                        </div>

                        {/* NC Context (read-only) */}
                        <div className="px-6 pt-4 pb-2">
                            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs">
                                <div className="font-bold text-red-700 mb-1">No Conformidad de origen</div>
                                <div className="text-red-600">
                                    <span className="font-mono font-bold">{editModal.requirement_code}</span>
                                    {editModal.chapter_title && ` · ${editModal.chapter_title}`}
                                </div>
                                <div className="text-slate-600 mt-1">{editModal.finding_description}</div>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="px-6 py-4 space-y-4">
                            {/* Corrective action */}
                            <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                                    Acción Correctiva *
                                </label>
                                <textarea
                                    rows={3}
                                    value={editForm.corrective_action}
                                    onChange={e => setEditForm(f => ({ ...f, corrective_action: e.target.value }))}
                                    placeholder="Describe la acción correctiva a implementar..."
                                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                                />
                            </div>

                            {/* Root cause */}
                            <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                                    Análisis de Causa Raíz
                                </label>
                                <textarea
                                    rows={3}
                                    value={editForm.root_cause_analysis}
                                    onChange={e => setEditForm(f => ({ ...f, root_cause_analysis: e.target.value }))}
                                    placeholder="¿Cuál es la causa raíz del problema? (5 Por qués, Ishikawa...)"
                                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                                />
                            </div>

                            {/* Responsible + target date */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                                        Responsable
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.responsible}
                                        onChange={e => setEditForm(f => ({ ...f, responsible: e.target.value }))}
                                        placeholder="Nombre del responsable"
                                        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                                        Fecha Meta
                                    </label>
                                    <input
                                        type="date"
                                        value={editForm.target_date}
                                        onChange={e => setEditForm(f => ({ ...f, target_date: e.target.value }))}
                                        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>
                            </div>

                            {/* Status + progress */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                                        Estado
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={editForm.status}
                                            onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))}
                                            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none"
                                        >
                                            <option value="OPEN">Abierta</option>
                                            <option value="IN_PROGRESS">En Progreso</option>
                                            <option value="CLOSED">Cerrada</option>
                                        </select>
                                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                                        Progreso: <span className="text-blue-600">{editForm.progress}%</span>
                                    </label>
                                    <input
                                        type="range" min="0" max="100" step="5"
                                        value={editForm.progress}
                                        onChange={e => {
                                            const val = parseInt(e.target.value);
                                            setEditForm(f => ({
                                                ...f, progress: val,
                                                status: val === 100 ? 'CLOSED' : val > 0 ? 'IN_PROGRESS' : f.status,
                                            }));
                                        }}
                                        className="w-full mt-1.5 accent-blue-600"
                                    />
                                    <div className="flex justify-between text-xs text-slate-400 mt-0.5">
                                        <span>0%</span><span>50%</span><span>100%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">
                                    Notas / Observaciones
                                </label>
                                <textarea
                                    rows={2}
                                    value={editForm.notes}
                                    onChange={e => setEditForm(f => ({ ...f, notes: e.target.value }))}
                                    placeholder="Notas adicionales sobre el seguimiento..."
                                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                                />
                            </div>
                        </div>

                        {/* Modal footer */}
                        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex gap-3 justify-end rounded-b-2xl">
                            <button onClick={() => setEditModal(null)}
                                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-100 transition-colors">
                                Cancelar
                            </button>
                            <button onClick={saveEdit} disabled={saving || !editForm.corrective_action.trim()}
                                className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors disabled:opacity-50">
                                {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                                {saving ? 'Guardando...' : 'Guardar cambios'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
