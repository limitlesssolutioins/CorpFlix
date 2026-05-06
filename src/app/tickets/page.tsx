'use client';

import { useState, useEffect } from 'react';
import {
    Plus, Search, Filter, Tag, Clock, CheckCircle2, XCircle,
    AlertTriangle, ChevronDown, X, Save, Trash2, Edit2, Inbox
} from 'lucide-react';

interface Ticket {
    id: number; ticket_code: string; title: string; description: string;
    category: string; priority: string; status: string;
    assigned_to: string; requested_by: string; due_date: string;
    resolved_at: string; resolution_notes: string;
    source_module: string; source_ref: string;
    created_at: string; updated_at: string;
}
interface Stats { total: number; abiertos: number; en_progreso: number; resueltos: number; vencidos: number; }

// ── Mappings ─────────────────────────────────────────────────────────

const PRIORITY = {
    BAJA:    { label: 'Baja',    bg: 'bg-slate-100',   text: 'text-slate-600',  border: 'border-slate-300'  },
    MEDIA:   { label: 'Media',   bg: 'bg-blue-100',    text: 'text-blue-700',   border: 'border-blue-300'   },
    ALTA:    { label: 'Alta',    bg: 'bg-orange-100',  text: 'text-orange-700', border: 'border-orange-300' },
    CRITICA: { label: 'Crítica', bg: 'bg-red-100',     text: 'text-red-700',    border: 'border-red-300'    },
} as const;

const STATUS = {
    ABIERTO:     { label: 'Abierto',      bg: 'bg-blue-100',   text: 'text-blue-700',   border: 'border-blue-300',   dot: 'bg-blue-500'   },
    EN_PROGRESO: { label: 'En Progreso',  bg: 'bg-amber-100',  text: 'text-amber-700',  border: 'border-amber-300',  dot: 'bg-amber-500'  },
    RESUELTO:    { label: 'Resuelto',     bg: 'bg-emerald-100',text: 'text-emerald-700',border: 'border-emerald-300',dot: 'bg-emerald-500'},
    CERRADO:     { label: 'Cerrado',      bg: 'bg-slate-100',  text: 'text-slate-500',  border: 'border-slate-300',  dot: 'bg-slate-400'  },
} as const;

const CATEGORY = {
    GENERAL:   { label: 'General',           color: 'text-slate-600'  },
    NC:        { label: 'No Conformidad',     color: 'text-red-600'    },
    MEJORA:    { label: 'Oportunidad Mejora', color: 'text-amber-600'  },
    SOLICITUD: { label: 'Solicitud',          color: 'text-purple-600' },
} as const;

const EMPTY_FORM = {
    title: '', description: '', category: 'GENERAL', priority: 'MEDIA',
    status: 'ABIERTO', assigned_to: '', requested_by: '', due_date: '',
    resolution_notes: '',
};

function PriorityBadge({ p }: { p: string }) {
    const c = PRIORITY[p as keyof typeof PRIORITY] || PRIORITY.MEDIA;
    return <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${c.bg} ${c.text} ${c.border}`}>{c.label}</span>;
}
function StatusBadge({ s }: { s: string }) {
    const c = STATUS[s as keyof typeof STATUS] || STATUS.ABIERTO;
    return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full border ${c.bg} ${c.text} ${c.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
            {c.label}
        </span>
    );
}

function formatDate(d?: string) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
}

function isOverdue(ticket: Ticket) {
    if (!ticket.due_date || ['RESUELTO', 'CERRADO'].includes(ticket.status)) return false;
    return new Date(ticket.due_date) < new Date();
}

// ── Modal ─────────────────────────────────────────────────────────────

function TicketModal({
    ticket, onClose, onSave, onDelete,
}: {
    ticket: Partial<Ticket> | null;
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
    onDelete?: (id: number) => Promise<void>;
}) {
    const isEdit = !!(ticket && (ticket as Ticket).id);
    const [form, setForm] = useState<any>(
        ticket ? {
            title: ticket.title || '',
            description: ticket.description || '',
            category: ticket.category || 'GENERAL',
            priority: ticket.priority || 'MEDIA',
            status: ticket.status || 'ABIERTO',
            assigned_to: ticket.assigned_to || '',
            requested_by: ticket.requested_by || '',
            due_date: ticket.due_date || '',
            resolution_notes: ticket.resolution_notes || '',
        } : { ...EMPTY_FORM }
    );
    const [saving, setSaving] = useState(false);

    const set = (k: string, v: string) => setForm((p: any) => ({ ...p, [k]: v }));

    const handleSave = async () => {
        if (!form.title.trim()) return;
        setSaving(true);
        await onSave(form);
        setSaving(false);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-200">
                    <h2 className="text-lg font-black text-slate-900">{isEdit ? 'Editar Ticket' : 'Nuevo Ticket'}</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100"><X size={20} className="text-slate-500" /></button>
                </div>

                {/* Body */}
                <div className="p-5 space-y-4">
                    {/* Título */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Título *</label>
                        <input
                            type="text" value={form.title} onChange={e => set('title', e.target.value)}
                            placeholder="Describe brevemente el ticket..."
                            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Descripción</label>
                        <textarea
                            rows={3} value={form.description} onChange={e => set('description', e.target.value)}
                            placeholder="Detalle la situación, requisito o mejora..."
                            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                        />
                    </div>

                    {/* Categoría + Prioridad */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Categoría</label>
                            <select value={form.category} onChange={e => set('category', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                                {Object.entries(CATEGORY).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Prioridad</label>
                            <select value={form.priority} onChange={e => set('priority', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                                {Object.entries(PRIORITY).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Estado + Fecha límite */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Estado</label>
                            <select value={form.status} onChange={e => set('status', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                                {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Fecha Límite</label>
                            <input type="date" value={form.due_date} onChange={e => set('due_date', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                        </div>
                    </div>

                    {/* Solicitante + Asignado */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Solicitante</label>
                            <input type="text" value={form.requested_by} onChange={e => set('requested_by', e.target.value)}
                                placeholder="Nombre..."
                                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Asignado a</label>
                            <input type="text" value={form.assigned_to} onChange={e => set('assigned_to', e.target.value)}
                                placeholder="Nombre o área..."
                                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                        </div>
                    </div>

                    {/* Notas de resolución — solo si está resuelto/cerrado */}
                    {(form.status === 'RESUELTO' || form.status === 'CERRADO') && (
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Notas de Resolución</label>
                            <textarea rows={3} value={form.resolution_notes} onChange={e => set('resolution_notes', e.target.value)}
                                placeholder="Describe cómo se resolvió..."
                                className="w-full px-3 py-2 border border-emerald-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none" />
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-5 border-t border-slate-200">
                    <div>
                        {isEdit && onDelete && (
                            <button onClick={() => onDelete((ticket as Ticket).id)}
                                className="flex items-center gap-1.5 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl text-sm font-semibold transition-colors">
                                <Trash2 size={15} /> Eliminar
                            </button>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-sm font-semibold">Cancelar</button>
                        <button onClick={handleSave} disabled={saving || !form.title.trim()}
                            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors">
                            <Save size={15} /> {saving ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────

export default function TicketsPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [stats, setStats] = useState<Stats>({ total: 0, abiertos: 0, en_progreso: 0, resueltos: 0, vencidos: 0 });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus]   = useState('');
    const [filterPriority, setFilterPriority] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [modal, setModal] = useState<{ open: boolean; ticket: Partial<Ticket> | null }>({ open: false, ticket: null });

    useEffect(() => { loadTickets(); }, []);

    const loadTickets = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/tickets');
            const data = await res.json();
            setTickets(data.tickets || []);
            setStats(data.stats || {});
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleSave = async (form: any) => {
        const isEdit = !!(modal.ticket && (modal.ticket as Ticket).id);
        if (isEdit) {
            await fetch(`/api/tickets/${(modal.ticket as Ticket).id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
        } else {
            await fetch('/api/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
        }
        setModal({ open: false, ticket: null });
        loadTickets();
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Eliminar este ticket?')) return;
        await fetch(`/api/tickets/${id}`, { method: 'DELETE' });
        setModal({ open: false, ticket: null });
        loadTickets();
    };

    const handleQuickStatus = async (ticket: Ticket, newStatus: string) => {
        await fetch(`/api/tickets/${ticket.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus }),
        });
        loadTickets();
    };

    const filtered = tickets.filter(t => {
        if (filterStatus   && t.status   !== filterStatus)   return false;
        if (filterPriority && t.priority !== filterPriority) return false;
        if (filterCategory && t.category !== filterCategory) return false;
        if (search) {
            const q = search.toLowerCase();
            return (
                t.title?.toLowerCase().includes(q) ||
                t.description?.toLowerCase().includes(q) ||
                t.ticket_code?.toLowerCase().includes(q) ||
                t.assigned_to?.toLowerCase().includes(q) ||
                t.requested_by?.toLowerCase().includes(q)
            );
        }
        return true;
    });

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">Tickets y Solicitudes</h1>
                    <p className="text-slate-500 text-sm mt-0.5">Gestión centralizada de solicitudes, NC y oportunidades de mejora</p>
                </div>
                <button
                    onClick={() => setModal({ open: true, ticket: null })}
                    className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm"
                >
                    <Plus size={18} /> Nuevo Ticket
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                {[
                    { label: 'Total',        value: stats.total,       bg: 'bg-slate-50',    text: 'text-slate-700',   border: 'border-slate-200', click: () => setFilterStatus('') },
                    { label: 'Abiertos',     value: stats.abiertos,    bg: 'bg-blue-50',     text: 'text-blue-700',    border: 'border-blue-200',  click: () => setFilterStatus('ABIERTO') },
                    { label: 'En Progreso',  value: stats.en_progreso, bg: 'bg-amber-50',    text: 'text-amber-700',   border: 'border-amber-200', click: () => setFilterStatus('EN_PROGRESO') },
                    { label: 'Resueltos',    value: stats.resueltos,   bg: 'bg-emerald-50',  text: 'text-emerald-700', border: 'border-emerald-200', click: () => setFilterStatus('RESUELTO') },
                    { label: 'Vencidos',     value: stats.vencidos,    bg: 'bg-red-50',      text: 'text-red-700',     border: 'border-red-200',   click: () => {} },
                ].map(c => (
                    <button key={c.label} onClick={c.click}
                        className={`${c.bg} border ${c.border} rounded-2xl p-4 text-center hover:opacity-80 transition-opacity cursor-pointer`}>
                        <div className={`text-2xl font-black ${c.text}`}>{c.value}</div>
                        <div className="text-xs font-semibold text-slate-500 mt-0.5">{c.label}</div>
                    </button>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-5">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input type="text" placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    </div>
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                        className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                        <option value="">Todos los estados</option>
                        {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                    <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)}
                        className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                        <option value="">Todas las prioridades</option>
                        {Object.entries(PRIORITY).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                    <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
                        className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                        <option value="">Todas las categorías</option>
                        {Object.entries(CATEGORY).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                </div>
                {(filterStatus || filterPriority || filterCategory || search) && (
                    <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs text-slate-400">{filtered.length} resultado{filtered.length !== 1 ? 's' : ''}</span>
                        <button onClick={() => { setFilterStatus(''); setFilterPriority(''); setFilterCategory(''); setSearch(''); }}
                            className="text-xs text-blue-600 hover:underline font-semibold">Limpiar filtros</button>
                    </div>
                )}
            </div>

            {/* List */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-white rounded-2xl p-16 border-2 border-dashed border-slate-200 text-center">
                    <Inbox className="w-14 h-14 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-600 mb-2">
                        {tickets.length === 0 ? 'No hay tickets todavía' : 'Sin resultados'}
                    </h3>
                    <p className="text-slate-400 text-sm mb-5">
                        {tickets.length === 0 ? 'Crea el primer ticket para comenzar el seguimiento.' : 'Ajusta los filtros para ver más resultados.'}
                    </p>
                    {tickets.length === 0 && (
                        <button onClick={() => setModal({ open: true, ticket: null })}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700">
                            <Plus size={16} /> Nuevo Ticket
                        </button>
                    )}
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map(ticket => {
                        const overdue = isOverdue(ticket);
                        const catInfo = CATEGORY[ticket.category as keyof typeof CATEGORY] || CATEGORY.GENERAL;
                        return (
                            <div key={ticket.id}
                                className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-shadow ${overdue ? 'border-red-200' : 'border-slate-200'}`}>
                                <div className="p-5">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-1 min-w-0">
                                            {/* Top row */}
                                            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                                <span className="font-mono text-xs text-slate-400 font-bold">{ticket.ticket_code}</span>
                                                <StatusBadge s={ticket.status} />
                                                <PriorityBadge p={ticket.priority} />
                                                <span className={`text-xs font-semibold ${catInfo.color}`}>{catInfo.label}</span>
                                                {overdue && (
                                                    <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                                                        <AlertTriangle size={10} /> Vencido
                                                    </span>
                                                )}
                                            </div>

                                            {/* Title */}
                                            <h3 className="font-bold text-slate-900 text-base leading-tight mb-1">{ticket.title}</h3>

                                            {/* Description */}
                                            {ticket.description && (
                                                <p className="text-sm text-slate-500 line-clamp-2 mb-2">{ticket.description}</p>
                                            )}

                                            {/* Meta */}
                                            <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                                                {ticket.assigned_to && <span>Asignado: <span className="font-semibold text-slate-600">{ticket.assigned_to}</span></span>}
                                                {ticket.requested_by && <span>Solicitante: <span className="font-semibold text-slate-600">{ticket.requested_by}</span></span>}
                                                {ticket.due_date && (
                                                    <span className={`flex items-center gap-1 ${overdue ? 'text-red-500 font-bold' : ''}`}>
                                                        <Clock size={11} /> {formatDate(ticket.due_date)}
                                                    </span>
                                                )}
                                                <span>Creado: {formatDate(ticket.created_at)}</span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col gap-2 shrink-0">
                                            <button
                                                onClick={() => setModal({ open: true, ticket })}
                                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                                            >
                                                <Edit2 size={13} /> Editar
                                            </button>

                                            {/* Quick status transitions */}
                                            {ticket.status === 'ABIERTO' && (
                                                <button onClick={() => handleQuickStatus(ticket, 'EN_PROGRESO')}
                                                    className="px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg">
                                                    → En Progreso
                                                </button>
                                            )}
                                            {ticket.status === 'EN_PROGRESO' && (
                                                <button onClick={() => handleQuickStatus(ticket, 'RESUELTO')}
                                                    className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg">
                                                    <CheckCircle2 size={12} className="inline mr-1" />
                                                    Resolver
                                                </button>
                                            )}
                                            {ticket.status === 'RESUELTO' && (
                                                <button onClick={() => handleQuickStatus(ticket, 'CERRADO')}
                                                    className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg">
                                                    Cerrar
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Resolution notes */}
                                    {ticket.resolution_notes && (
                                        <div className="mt-3 pt-3 border-t border-slate-100">
                                            <span className="text-xs font-bold text-emerald-600 uppercase">Resolución: </span>
                                            <span className="text-xs text-slate-600">{ticket.resolution_notes}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal */}
            {modal.open && (
                <TicketModal
                    ticket={modal.ticket}
                    onClose={() => setModal({ open: false, ticket: null })}
                    onSave={handleSave}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
}
