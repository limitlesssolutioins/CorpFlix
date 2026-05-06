'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    ArrowLeft, AlertTriangle, Clock, Edit2, Calendar, Search,
    CheckCircle2, X, Save, Loader2, ChevronDown, User, FileText,
    TrendingUp, Filter,
} from 'lucide-react';

interface ConsolidatedAction {
    id: string; // prefixed id
    realId: number;
    source: 'AUDITORIA' | 'RIESGOS';
    code: string;
    title: string;
    description: string;
    origin: string;
    responsible: string;
    target_date: string;
    completion_date?: string;
    status: string;
    progress: number;
    type: 'CORRECTIVA' | 'PREVENTIVA';
    root_cause_analysis?: string;
    notes?: string;
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

const SOURCE_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
    AUDITORIA: { bg: 'bg-violet-100', text: 'text-violet-700', label: 'Auditoría' },
    RIESGOS: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Riesgos' },
};

export default function AccionesMejoraPage() {
    const [actions, setActions] = useState<ConsolidatedAction[]>([]);
    const [filtered, setFiltered] = useState<ConsolidatedAction[]>([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [sourceFilter, setSourceFilter] = useState('');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Edit modal
    const [editModal, setEditModal] = useState<ConsolidatedAction | null>(null);
    const [editForm, setEditForm] = useState<EditForm>({
        corrective_action: '', responsible: '', target_date: '',
        root_cause_analysis: '', notes: '', status: 'OPEN', progress: 0,
    });

    useEffect(() => { fetchActions(); }, []);

    useEffect(() => {
        let result = actions;
        if (statusFilter) result = result.filter(a => a.status === statusFilter);
        if (sourceFilter) result = result.filter(a => a.source === sourceFilter);
        if (search) result = result.filter(a =>
            a.code?.toLowerCase().includes(search.toLowerCase()) ||
            a.title?.toLowerCase().includes(search.toLowerCase()) ||
            a.responsible?.toLowerCase().includes(search.toLowerCase()) ||
            a.origin?.toLowerCase().includes(search.toLowerCase())
        );
        setFiltered(result);
    }, [actions, statusFilter, sourceFilter, search]);

    const fetchActions = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/mejora-continua/acciones');
            const data = await response.json();
            setActions(Array.isArray(data) ? data : []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const openEdit = (action: ConsolidatedAction) => {
        setEditModal(action);
        setEditForm({
            corrective_action: action.title || '',
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
            const body: any = { 
                source: editModal.source,
                realId: editModal.realId,
                ...editForm 
            };
            if (editForm.progress === 100) {
                body.completion_date = new Date().toISOString().split('T')[0];
                body.status = 'CLOSED';
            }
            const res = await fetch('/api/mejora-continua/acciones', {
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Link href="/mejora-continua" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-semibold transition-colors text-sm mb-4">
                        <ArrowLeft size={16} /> Volver a Mejora
                    </Link>
                    <h1 className="text-3xl font-black text-slate-900">Planes de Acción</h1>
                    <p className="text-slate-500 text-sm mt-0.5">Gestión unificada de acciones correctivas de auditoría y preventivas de riesgos</p>
                </div>
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
                    <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-4 text-center shadow-sm`}>
                        <div className={`text-3xl font-black ${s.color}`}>{s.value}</div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="relative">
                    <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        className="pl-9 pr-8 py-2.5 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-400 bg-slate-50 appearance-none min-w-[160px]"
                    >
                        <option value="">Todos los estados</option>
                        <option value="OPEN">Abiertas</option>
                        <option value="IN_PROGRESS">En Progreso</option>
                        <option value="CLOSED">Cerradas</option>
                    </select>
                </div>
                <div className="relative">
                    <select
                        value={sourceFilter}
                        onChange={e => setSourceFilter(e.target.value)}
                        className="pl-4 pr-8 py-2.5 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-400 bg-slate-50 appearance-none min-w-[160px]"
                    >
                        <option value="">Todos los orígenes</option>
                        <option value="AUDITORIA">Auditoría</option>
                        <option value="RIESGOS">Riesgos</option>
                    </select>
                </div>
                <div className="relative flex-1 min-w-[200px]">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text" placeholder="Buscar por código, responsable, origen..."
                        value={search} onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 bg-slate-50"
                    />
                </div>
                {stats.overdue > 0 && (
                    <button onClick={() => { setStatusFilter(''); setSourceFilter(''); setSearch(''); }}
                        className="flex items-center gap-1.5 px-4 py-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors">
                        <AlertTriangle size={13} /> {stats.overdue} Vencida{stats.overdue !== 1 ? 's' : ''}
                    </button>
                )}
            </div>

            {/* List */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-white rounded-[2.5rem] p-20 border-2 border-dashed border-slate-200 text-center">
                    <CheckCircle2 className="w-16 h-16 text-slate-100 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-600 mb-2">No se encontraron acciones</h3>
                    <p className="text-sm text-slate-400 max-w-sm mx-auto">
                        {search || statusFilter || sourceFilter ? 'Ajusta los criterios de búsqueda para encontrar lo que necesitas.' : 'Las acciones se sincronizan automáticamente desde los módulos de Auditoría y Riesgos.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filtered.map(action => {
                        const st = STATUS_CONFIG[action.status] || STATUS_CONFIG.OPEN;
                        const src = SOURCE_CONFIG[action.source] || { bg: 'bg-slate-100', text: 'text-slate-700', label: action.source };
                        const overdue = isOverdue(action.target_date, action.status);
                        const progressColor = action.progress === 100 ? '#22c55e' : action.progress >= 50 ? '#3b82f6' : '#f59e0b';

                        return (
                            <div key={action.id}
                                className={`group bg-white rounded-3xl border-2 shadow-sm hover:shadow-md transition-all duration-300 ${overdue ? 'border-red-100' : 'border-slate-100'}`}>
                                <div className="p-6">
                                    <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap mb-3">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${st.bg} ${st.text} ${st.border}`}>
                                                    {st.label}
                                                </span>
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${src.bg} ${src.text}`}>
                                                    {src.label}
                                                </span>
                                                <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">{action.code}</span>
                                                {overdue && (
                                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
                                                        <AlertTriangle size={10} /> Vencida
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="text-lg font-black text-slate-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">{action.title}</h3>
                                            
                                            {/* Context/Origin */}
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-4 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 w-fit">
                                                <FileText size={12} />
                                                <span>{action.origin}</span>
                                            </div>
                                            
                                            <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">{action.description}</p>
                                        </div>

                                        <div className="lg:w-72 shrink-0 space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Responsable</p>
                                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                                                        <User size={14} className="text-slate-300" />
                                                        <span className="truncate">{action.responsible || 'Pendiente'}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Meta</p>
                                                    <div className={`flex items-center gap-1.5 text-xs font-bold ${overdue ? 'text-red-600' : 'text-slate-700'}`}>
                                                        <Calendar size={14} className="text-slate-300" />
                                                        {formatDate(action.target_date)}
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <div className="flex justify-between items-end mb-1.5">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avance del Plan</p>
                                                    <span className="text-xs font-black" style={{ color: progressColor }}>{action.progress}%</span>
                                                </div>
                                                <div className="w-full bg-slate-100 rounded-full h-2 shadow-inner">
                                                    <div
                                                        className="h-2 rounded-full transition-all duration-700"
                                                        style={{ width: `${action.progress}%`, backgroundColor: progressColor }}
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => openEdit(action)}
                                                className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-slate-900/10"
                                            >
                                                <Edit2 size={14} /> Gestionar Acción
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Edit Modal (Unified) */}
            {editModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setEditModal(null)} />
                    <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-200">
                        {/* Modal header */}
                        <div className="bg-white border-b border-slate-100 px-8 py-6 flex items-center justify-between z-10">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${SOURCE_CONFIG[editModal.source]?.bg} ${SOURCE_CONFIG[editModal.source]?.text}`}>
                                        {SOURCE_CONFIG[editModal.source]?.label}
                                    </span>
                                    <span className="text-[10px] font-mono font-bold text-slate-400">{editModal.code}</span>
                                </div>
                                <h2 className="text-xl font-black text-slate-900">Seguimiento de Acción</h2>
                            </div>
                            <button onClick={() => setEditModal(null)}
                                className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
                            {/* Context (read-only) */}
                            <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                    <FileText size={12} /> Hallazgo / Riesgo de Origen
                                </div>
                                <div className="font-bold text-slate-900 text-sm mb-2">{editModal.origin}</div>
                                <div className="text-slate-600 text-sm leading-relaxed italic">"{editModal.description}"</div>
                            </div>

                            {/* Form */}
                            <div className="grid grid-cols-1 gap-5">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                                        Descripción de la Acción
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={editForm.corrective_action}
                                        onChange={e => setEditForm(f => ({ ...f, corrective_action: e.target.value }))}
                                        placeholder="Describe la tarea o acción a realizar..."
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all resize-none"
                                    />
                                </div>

                                {editModal.source === 'AUDITORIA' && (
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                                            Análisis de Causa Raíz
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={editForm.root_cause_analysis}
                                            onChange={e => setEditForm(f => ({ ...f, root_cause_analysis: e.target.value }))}
                                            placeholder="¿Por qué ocurrió? (Opcional)"
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all resize-none"
                                        />
                                    </div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                                            Responsable
                                        </label>
                                        <input
                                            type="text"
                                            value={editForm.responsible}
                                            onChange={e => setEditForm(f => ({ ...f, responsible: e.target.value }))}
                                            placeholder="Nombre"
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                                            Fecha Límite
                                        </label>
                                        <input
                                            type="date"
                                            value={editForm.target_date}
                                            onChange={e => setEditForm(f => ({ ...f, target_date: e.target.value }))}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                                            Estado Actual
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={editForm.status}
                                                onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white appearance-none transition-all"
                                            >
                                                <option value="OPEN">Abierta / Pendiente</option>
                                                <option value="IN_PROGRESS">En Ejecución</option>
                                                <option value="CLOSED">Finalizada / Cerrada</option>
                                            </select>
                                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center mb-2 ml-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progreso</label>
                                            <span className="text-xs font-black text-blue-600">{editForm.progress}%</span>
                                        </div>
                                        <input
                                            type="range" min="0" max="100" step="10"
                                            value={editForm.progress}
                                            onChange={e => {
                                                const val = parseInt(e.target.value);
                                                setEditForm(f => ({
                                                    ...f, progress: val,
                                                    status: val === 100 ? 'CLOSED' : val > 0 ? 'IN_PROGRESS' : f.status,
                                                }));
                                            }}
                                            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                                        Observaciones de Seguimiento
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={editForm.notes}
                                        onChange={e => setEditForm(f => ({ ...f, notes: e.target.value }))}
                                        placeholder="Bitácora de seguimiento..."
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Modal footer */}
                        <div className="bg-slate-50 border-t border-slate-100 px-8 py-5 flex gap-3 justify-end rounded-b-[2.5rem]">
                            <button onClick={() => setEditModal(null)}
                                className="px-6 py-2.5 text-slate-500 font-bold text-xs uppercase tracking-widest hover:text-slate-800 transition-colors">
                                Descartar
                            </button>
                            <button onClick={saveEdit} disabled={saving || !editForm.corrective_action.trim()}
                                className="flex items-center gap-2 px-8 py-2.5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all disabled:opacity-50 shadow-xl shadow-slate-900/10">
                                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                {saving ? 'Guardando...' : 'Guardar Seguimiento'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
