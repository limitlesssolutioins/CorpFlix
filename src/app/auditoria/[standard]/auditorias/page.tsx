'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Calendar, Filter, Search, Clock, CheckCircle2, ClipboardList, FileText, Award } from 'lucide-react';

interface AuditStandard { id: number; code: string; name: string; color: string; }
interface Audit {
    id: number; audit_code: string; audit_type_name: string;
    audit_date: string; auditor_name: string; scope: string; status: string;
}

export default function StandardAuditoriasPage() {
    const params = useParams();
    const code = (params.standard as string).toUpperCase();

    const [standard, setStandard] = useState<AuditStandard | null>(null);
    const [audits, setAudits] = useState<Audit[]>([]);
    const [filtered, setFiltered] = useState<Audit[]>([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

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
                const data = await res.json();
                setAudits(Array.isArray(data) ? data : []);
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const formatDate = (d: string) => new Date(d).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

    const getStatusBadge = (status: string) => {
        const map: Record<string, { bg: string; label: string; icon: any }> = {
            PLANNED: { bg: 'bg-blue-100 text-blue-700', label: 'Planificada', icon: Calendar },
            IN_PROGRESS: { bg: 'bg-yellow-100 text-yellow-700', label: 'En Progreso', icon: Clock },
            COMPLETED: { bg: 'bg-green-100 text-green-700', label: 'Completada', icon: CheckCircle2 },
        };
        const b = map[status] || map.PLANNED;
        const Icon = b.icon;
        return <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${b.bg}`}><Icon size={11} />{b.label}</span>;
    };

    const accentColor = standard?.color || '#3b82f6';
    const standardPath = `/auditoria/${code.toLowerCase()}`;

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-6">
                <Link href={standardPath} className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold mb-4 transition-colors">
                    <ArrowLeft size={20} /> Volver a {standard?.name || code}
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 mb-1">Auditorías</h1>
                        <p className="text-slate-500 text-sm">{standard?.name} · {audits.length} auditoría{audits.length !== 1 ? 's' : ''}</p>
                    </div>
                    <Link
                        href={`${standardPath}/auditorias/nueva`}
                        className="flex items-center gap-2 px-5 py-3 text-white rounded-xl font-semibold shadow-sm hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: accentColor }}
                    >
                        <Plus size={18} /> Nueva Auditoría
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm mb-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text" placeholder="Buscar por código, auditor o alcance..."
                            value={search} onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <select
                            value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none"
                        >
                            <option value="">Todos los estados</option>
                            <option value="PLANNED">Planificadas</option>
                            <option value="IN_PROGRESS">En Progreso</option>
                            <option value="COMPLETED">Completadas</option>
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 border-2 border-dashed border-slate-300 text-center">
                    <Calendar className="w-14 h-14 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-700 mb-2">No se encontraron auditorías</h3>
                    <p className="text-slate-400 mb-5">{search || statusFilter ? 'Ajusta los filtros' : `Crea la primera auditoría de ${standard?.name}`}</p>
                    {!search && !statusFilter && (
                        <Link href={`${standardPath}/auditorias/nueva`}
                            className="inline-flex items-center gap-2 px-5 py-3 text-white rounded-xl font-semibold"
                            style={{ backgroundColor: accentColor }}>
                            <Plus size={18} /> Nueva Auditoría
                        </Link>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {filtered.map(audit => (
                        <div key={audit.id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        {getStatusBadge(audit.status)}
                                        <span className="text-xs font-mono text-slate-400">{audit.audit_code}</span>
                                    </div>
                                    <h3 className="font-bold text-slate-900">{audit.audit_type_name || 'Auditoría Interna'}</h3>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4 text-sm">
                                <div>
                                    <div className="text-xs font-bold text-slate-400 uppercase mb-0.5">Fecha</div>
                                    <div className="text-slate-700 font-semibold">{formatDate(audit.audit_date)}</div>
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-400 uppercase mb-0.5">Auditor</div>
                                    <div className="text-slate-700">{audit.auditor_name || 'No asignado'}</div>
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-400 uppercase mb-0.5">Alcance</div>
                                    <div className="text-slate-700 truncate">{audit.scope || 'No definido'}</div>
                                </div>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                <Link
                                    href={`${standardPath}/checklist?audit_id=${audit.id}`}
                                    className="flex items-center gap-1.5 px-4 py-2 text-white rounded-lg text-sm font-semibold hover:opacity-90"
                                    style={{ backgroundColor: accentColor }}
                                >
                                    <ClipboardList size={14} /> Lista de Chequeo
                                </Link>
                                <Link
                                    href={`${standardPath}/autoevaluacion?audit_id=${audit.id}`}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 text-white rounded-lg text-sm font-semibold hover:bg-emerald-800"
                                >
                                    <Award size={14} /> Autoevaluación
                                </Link>
                                <Link
                                    href={`${standardPath}/reporte?audit_id=${audit.id}`}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-700 text-white rounded-lg text-sm font-semibold hover:bg-slate-800"
                                >
                                    <FileText size={14} /> Informe Detallado
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
