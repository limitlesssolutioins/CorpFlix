'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft, Plus, Calendar, Search, Clock, CheckCircle2, ClipboardList,
    FileText, ShieldCheck, FileCheck, Activity, ChevronDown, Users, Loader2,
} from 'lucide-react';

interface AuditStandard { id: number; code: string; name: string; color: string; }
interface TeamMember { auditor_id: number; name: string; role_in_audit: string; }
interface Audit {
    id: number; audit_code: string; audit_type_name: string;
    audit_date: string; auditor_name: string; scope: string;
    objectives: string; status: string; team?: TeamMember[];
}

const STATUS_FLOW: Record<string, { next: string; label: string; nextLabel: string; bg: string; text: string; icon: any }> = {
    PLANNED: { next: 'IN_PROGRESS', label: 'Planificada', nextLabel: 'Iniciar ejecución', bg: 'bg-blue-100', text: 'text-blue-700', icon: Calendar },
    IN_PROGRESS: { next: 'COMPLETED', label: 'En Ejecución', nextLabel: 'Marcar completada', bg: 'bg-amber-100', text: 'text-amber-700', icon: Activity },
    COMPLETED: { next: '', label: 'Completada', nextLabel: '', bg: 'bg-emerald-100', text: 'text-emerald-700', icon: CheckCircle2 },
};

export default function StandardAuditoriasPage() {
    const params = useParams();
    const code = (params.standard as string).toUpperCase();

    const [standard, setStandard] = useState<AuditStandard | null>(null);
    const [audits, setAudits] = useState<Audit[]>([]);
    const [filtered, setFiltered] = useState<Audit[]>([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    useEffect(() => { loadData(); }, [code]);

    useEffect(() => {
        let result = audits;
        if (statusFilter) result = result.filter(a => a.status === statusFilter);
        if (search) result = result.filter(a =>
            a.audit_code?.toLowerCase().includes(search.toLowerCase()) ||
            a.auditor_name?.toLowerCase().includes(search.toLowerCase()) ||
            a.scope?.toLowerCase().includes(search.toLowerCase())
        );
        setFiltered(result);
    }, [audits, statusFilter, search]);

    const loadData = async () => {
        setLoading(true);
        try {
            const stdsRes = await fetch('/api/auditoria/standards');
            const stds: AuditStandard[] = await stdsRes.json();
            const found = stds.find(s => s.code === code);
            setStandard(found || null);

            if (found) {
                const res = await fetch(`/api/auditoria/audits?standard_id=${found.id}`);
                const data: Audit[] = await res.json();
                const list = Array.isArray(data) ? data : [];

                const withTeams = await Promise.all(list.map(async audit => {
                    try {
                        const teamRes = await fetch(`/api/auditoria/audit-team?audit_id=${audit.id}`);
                        const team = await teamRes.json();
                        return { ...audit, team: Array.isArray(team) ? team : [] };
                    } catch { return { ...audit, team: [] }; }
                }));
                setAudits(withTeams);
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const advanceStatus = async (audit: Audit) => {
        const conf = STATUS_FLOW[audit.status];
        if (!conf?.next) return;
        setUpdatingId(audit.id);
        try {
            await fetch('/api/auditoria/audits', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: audit.id, status: conf.next }),
            });
            setAudits(prev => prev.map(a => a.id === audit.id ? { ...a, status: conf.next } : a));
        } catch (e) { console.error(e); }
        finally { setUpdatingId(null); }
    };

    const formatDate = (d: string) => new Date(d).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

    const accentColor = standard?.color || '#3b82f6';
    const standardPath = `/auditoria/${code.toLowerCase()}`;

    const counts = {
        PLANNED: audits.filter(a => a.status === 'PLANNED').length,
        IN_PROGRESS: audits.filter(a => a.status === 'IN_PROGRESS').length,
        COMPLETED: audits.filter(a => a.status === 'COMPLETED').length,
    };

    return (
        <div className="max-w-7xl mx-auto space-y-5">
            {/* Back + header */}
            <div>
                <Link href={standardPath} className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-semibold transition-colors text-sm mb-4">
                    <ArrowLeft size={16} /> Volver a {standard?.name || code}
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900">Gestión de Auditorías</h1>
                        <p className="text-slate-500 text-sm mt-0.5">
                            {standard?.name} · {audits.length} auditoría{audits.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <Link
                        href={`${standardPath}/auditorias/nueva`}
                        className="flex items-center gap-2 px-4 py-2.5 text-white rounded-xl font-semibold shadow-sm hover:opacity-90 transition-opacity text-sm"
                        style={{ backgroundColor: accentColor }}
                    >
                        <Plus size={16} /> Nueva Auditoría
                    </Link>
                </div>
            </div>

            {/* Status pills */}
            {audits.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                    {[
                        { key: '', label: `Todas (${audits.length})` },
                        { key: 'PLANNED', label: `Planificadas (${counts.PLANNED})`, bg: 'bg-blue-50', text: 'text-blue-700', activeBg: 'bg-blue-600' },
                        { key: 'IN_PROGRESS', label: `En Ejecución (${counts.IN_PROGRESS})`, bg: 'bg-amber-50', text: 'text-amber-700', activeBg: 'bg-amber-500' },
                        { key: 'COMPLETED', label: `Completadas (${counts.COMPLETED})`, bg: 'bg-emerald-50', text: 'text-emerald-700', activeBg: 'bg-emerald-600' },
                    ].map(f => (
                        <button key={f.key}
                            onClick={() => setStatusFilter(f.key)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                statusFilter === f.key
                                    ? 'text-white shadow-sm'
                                    : `${f.bg || 'bg-slate-100'} ${f.text || 'text-slate-600'} hover:opacity-80`
                            }`}
                            style={statusFilter === f.key ? { backgroundColor: accentColor } : {}}
                        >
                            {f.label}
                        </button>
                    ))}
                    <div className="flex-1" />
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input
                            type="text" placeholder="Buscar..."
                            value={search} onChange={e => setSearch(e.target.value)}
                            className="pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 w-40"
                            style={{ '--tw-ring-color': accentColor } as any}
                        />
                    </div>
                </div>
            )}

            {/* Content */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 border-2 border-dashed border-slate-200 text-center">
                    <Calendar className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                    <h3 className="font-bold text-slate-600 mb-1">No se encontraron auditorías</h3>
                    <p className="text-sm text-slate-400 mb-5">{search || statusFilter ? 'Ajusta los filtros de búsqueda' : `Registra la primera auditoría de ${standard?.name}`}</p>
                    {!search && !statusFilter && (
                        <Link href={`${standardPath}/auditorias/nueva`}
                            className="inline-flex items-center gap-2 px-5 py-2.5 text-white rounded-xl font-semibold text-sm"
                            style={{ backgroundColor: accentColor }}>
                            <Plus size={16} /> Nueva Auditoría
                        </Link>
                    )}
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map(audit => {
                        const st = STATUS_FLOW[audit.status] || STATUS_FLOW.PLANNED;
                        const StatusIcon = st.icon;
                        const isUpdating = updatingId === audit.id;

                        return (
                            <div key={audit.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                {/* Top accent line per status */}
                                <div className="h-0.5" style={{
                                    backgroundColor: audit.status === 'PLANNED' ? '#3b82f6' : audit.status === 'IN_PROGRESS' ? '#f59e0b' : '#22c55e'
                                }} />

                                <div className="p-5">
                                    {/* Row 1: Status + code + advance button */}
                                    <div className="flex items-start justify-between gap-3 mb-4">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${st.bg} ${st.text}`}>
                                                <StatusIcon size={11} /> {st.label}
                                            </span>
                                            <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">{audit.audit_code}</span>
                                            <span className="text-xs text-slate-500">{audit.audit_type_name || 'Auditoría Interna'}</span>
                                        </div>
                                        {/* Advance status button */}
                                        {st.next && (
                                            <button
                                                onClick={() => advanceStatus(audit)}
                                                disabled={isUpdating}
                                                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-dashed text-xs font-bold transition-all hover:bg-slate-50 disabled:opacity-50"
                                                style={{ borderColor: accentColor, color: accentColor }}
                                            >
                                                {isUpdating ? <Loader2 size={12} className="animate-spin" /> : <ChevronDown size={12} />}
                                                {st.nextLabel}
                                            </button>
                                        )}
                                    </div>

                                    {/* Row 2: Details */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 text-sm">
                                        <div>
                                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Fecha</div>
                                            <div className="font-semibold text-slate-800">{formatDate(audit.audit_date)}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Alcance</div>
                                            <div className="text-slate-600 line-clamp-1">{audit.scope || 'No definido'}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Equipo Auditor</div>
                                            {audit.team && audit.team.length > 0 ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {audit.team.slice(0, 3).map((m: any) => (
                                                        <span key={m.auditor_id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                                                            <Users size={9} /> {m.name}
                                                        </span>
                                                    ))}
                                                    {audit.team.length > 3 && (
                                                        <span className="text-xs text-slate-400">+{audit.team.length - 3} más</span>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="text-slate-400 text-sm">{audit.auditor_name || 'Sin asignar'}</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Row 3: Action buttons */}
                                    <div className="flex gap-2 flex-wrap pt-3 border-t border-slate-100">
                                        <Link
                                            href={`${standardPath}/plan?audit_id=${audit.id}`}
                                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                                        >
                                            <FileCheck size={13} /> Plan de Auditoría
                                        </Link>
                                        <Link
                                            href={`${standardPath}/checklist?audit_id=${audit.id}`}
                                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-white hover:opacity-90 transition-opacity"
                                            style={{ backgroundColor: accentColor }}
                                        >
                                            <ClipboardList size={13} /> Lista de Chequeo
                                        </Link>
                                        <Link
                                            href={`${standardPath}/certificado?audit_id=${audit.id}`}
                                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 transition-colors"
                                        >
                                            <ShieldCheck size={13} /> Certificado
                                        </Link>
                                        <Link
                                            href={`${standardPath}/reporte?audit_id=${audit.id}`}
                                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-white bg-slate-700 hover:bg-slate-800 transition-colors"
                                        >
                                            <FileText size={13} /> Informe
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
