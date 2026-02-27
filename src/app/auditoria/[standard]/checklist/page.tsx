'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, CheckCircle2, XCircle, AlertCircle, MinusCircle, ChevronDown, ChevronRight } from 'lucide-react';

interface AuditStandard { id: number; code: string; name: string; color: string; }
interface AuditInfo {
    id: number; audit_code: string; auditor_name: string; audit_date: string;
    scope: string; status: string; standard_id: number; company_profile: string;
    standard_name: string; standard_color: string;
}
interface ChecklistItem {
    id: number; requirement_code: string; requirement_title: string;
    chapter_id: number; chapter_number: string; chapter_title: string;
    weight: number; profile: string;
    // Finding fields
    finding_id: number | null; finding_type_id: number | null; finding_description: string | null;
    evidence: string | null; observations: string | null; type_code: string | null;
    finding_type_name: string | null; finding_color: string | null; requires_action: number | null;
}

const FINDING_TYPES = [
    { id: 1, code: 'C', label: 'Cumple', icon: CheckCircle2, color: '#10b981', bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-700' },
    { id: 3, code: 'NC_MENOR', label: 'NC Menor', icon: XCircle, color: '#f97316', bg: 'bg-orange-50', border: 'border-orange-400', text: 'text-orange-700' },
    { id: 4, code: 'NC_MAYOR', label: 'NC Mayor', icon: AlertCircle, color: '#ef4444', bg: 'bg-red-50', border: 'border-red-400', text: 'text-red-700' },
    { id: 2, code: 'O', label: 'Observación', icon: MinusCircle, color: '#f59e0b', bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-700' },
];

function groupByChapter(items: ChecklistItem[]) {
    const map = new Map<number, { chapter_number: string; chapter_title: string; items: ChecklistItem[] }>();
    for (const item of items) {
        if (!map.has(item.chapter_id)) {
            map.set(item.chapter_id, { chapter_number: item.chapter_number, chapter_title: item.chapter_title, items: [] });
        }
        map.get(item.chapter_id)!.items.push(item);
    }
    return Array.from(map.values());
}

export default function ChecklistPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const code = (params.standard as string).toUpperCase();
    const auditId = searchParams.get('audit_id');

    const [audit, setAudit] = useState<AuditInfo | null>(null);
    const [items, setItems] = useState<ChecklistItem[]>([]);
    const [findings, setFindings] = useState<Map<number, { type_id: number | null; description: string; evidence: string; observations: string }>>(new Map());
    const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
    const [collapsedChapters, setCollapsedChapters] = useState<Set<number>>(new Set());
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saveResult, setSaveResult] = useState<{ saved: number; actionsCreated: number } | null>(null);

    useEffect(() => {
        if (auditId) loadChecklist();
    }, [auditId]);

    const loadChecklist = async () => {
        setLoading(true);
        try {
            const [auditRes, checklistRes] = await Promise.all([
                fetch(`/api/auditoria/audits`).then(r => r.json()),
                fetch(`/api/auditoria/checklist?audit_id=${auditId}`).then(r => r.json()),
            ]);

            // Get specific audit info
            const allAudits: AuditInfo[] = Array.isArray(auditRes) ? auditRes : [];
            const found = allAudits.find(a => a.id === parseInt(auditId!));
            if (found) setAudit(found);

            const checklistItems: ChecklistItem[] = Array.isArray(checklistRes) ? checklistRes : [];
            setItems(checklistItems);

            // Initialize findings map from existing data
            const map = new Map<number, any>();
            for (const item of checklistItems) {
                map.set(item.id, {
                    type_id: item.finding_type_id,
                    description: item.finding_description || '',
                    evidence: item.evidence || '',
                    observations: item.observations || '',
                });
            }
            setFindings(map);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const setFindingType = (reqId: number, typeId: number | null) => {
        setFindings(prev => {
            const next = new Map(prev);
            const existing = next.get(reqId) || { type_id: null, description: '', evidence: '', observations: '' };
            next.set(reqId, { ...existing, type_id: typeId });
            return next;
        });
    };

    const setFindingDetail = (reqId: number, field: 'description' | 'evidence' | 'observations', value: string) => {
        setFindings(prev => {
            const next = new Map(prev);
            const existing = next.get(reqId) || { type_id: null, description: '', evidence: '', observations: '' };
            next.set(reqId, { ...existing, [field]: value });
            return next;
        });
    };

    const toggleExpand = (reqId: number) => {
        setExpandedItems(prev => {
            const next = new Set(prev);
            if (next.has(reqId)) next.delete(reqId); else next.add(reqId);
            return next;
        });
    };

    const toggleChapter = (chapterId: number) => {
        setCollapsedChapters(prev => {
            const next = new Set(prev);
            if (next.has(chapterId)) next.delete(chapterId); else next.add(chapterId);
            return next;
        });
    };

    const handleSave = async () => {
        if (!auditId) return;
        setSaving(true);
        setSaveResult(null);
        try {
            const findingsArray = items.map(item => {
                const f = findings.get(item.id);
                return {
                    requirement_id: item.id,
                    finding_type_id: f?.type_id || null,
                    finding_description: f?.description || null,
                    evidence: f?.evidence || null,
                    observations: f?.observations || null,
                };
            });

            const res = await fetch('/api/auditoria/checklist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ audit_id: parseInt(auditId), findings: findingsArray }),
            });

            if (res.ok) {
                const result = await res.json();
                setSaveResult(result);
            } else {
                alert('❌ Error al guardar el checklist');
            }
        } catch {
            alert('❌ Error al guardar el checklist');
        } finally {
            setSaving(false);
        }
    };

    const evaluated = Array.from(findings.values()).filter(f => f.type_id !== null).length;
    const ncCount = Array.from(findings.values()).filter(f => {
        const ft = FINDING_TYPES.find(t => t.id === f.type_id);
        return ft && (ft.code === 'NC_MENOR' || ft.code === 'NC_MAYOR');
    }).length;

    const isRes0312 = code === 'RES0312';
    const totalWeight = isRes0312 ? items.reduce((sum, i) => sum + (i.weight || 0), 0) : 0;
    const achievedWeight = isRes0312 ? items.reduce((sum, i) => {
        const f = findings.get(i.id);
        const ft = FINDING_TYPES.find(t => t.id === f?.type_id);
        return sum + (ft?.code === 'C' ? (i.weight || 0) : 0);
    }, 0) : 0;

    const accentColor = audit?.standard_color || '#3b82f6';
    const standardPath = `/auditoria/${code.toLowerCase()}`;
    const chapters = groupByChapter(items);

    if (!auditId) return (
        <div className="max-w-2xl mx-auto text-center py-20">
            <p className="text-slate-500">Se requiere audit_id en la URL</p>
            <Link href={standardPath} className="mt-4 inline-block text-blue-600 font-semibold">← Volver</Link>
        </div>
    );

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto">
            {/* Back */}
            <Link href={`${standardPath}/auditorias`} className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold mb-5 transition-colors">
                <ArrowLeft size={20} /> Volver a Auditorías
            </Link>

            {/* Audit Header */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm mb-5">
                <div className="flex items-start justify-between flex-wrap gap-3">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: accentColor }}>
                                {audit?.standard_name || code}
                            </span>
                            <span className="text-xs font-mono text-slate-400">{audit?.audit_code}</span>
                        </div>
                        <h1 className="text-2xl font-black text-slate-900">Lista de Chequeo</h1>
                        <p className="text-sm text-slate-500 mt-0.5">
                            {audit?.auditor_name} · {audit?.audit_date ? new Date(audit.audit_date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                            {audit?.company_profile && ` · Perfil: ${audit.company_profile} trabajadores`}
                        </p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-5 py-3 text-white rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                        style={{ backgroundColor: accentColor }}
                    >
                        <Save size={18} />
                        {saving ? 'Guardando...' : 'Guardar Checklist'}
                    </button>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm mb-5">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-slate-700">Progreso de evaluación</span>
                    <span className="text-sm font-black text-slate-900">{evaluated} / {items.length} requisitos</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 mb-3">
                    <div
                        className="h-3 rounded-full transition-all duration-500"
                        style={{ width: `${items.length > 0 ? (evaluated / items.length) * 100 : 0}%`, backgroundColor: accentColor }}
                    />
                </div>
                <div className="flex gap-4 text-sm">
                    <span className="text-emerald-600 font-semibold">
                        {Array.from(findings.values()).filter(f => FINDING_TYPES.find(t => t.id === f.type_id)?.code === 'C').length} Conformes
                    </span>
                    {ncCount > 0 && <span className="text-red-600 font-semibold">{ncCount} No Conformidades → se crearán acciones correctivas</span>}
                    {isRes0312 && totalWeight > 0 && (
                        <span className="text-slate-600 font-semibold ml-auto">
                            Puntaje: {achievedWeight.toFixed(1)} / {totalWeight.toFixed(1)} pts ({totalWeight > 0 ? Math.round((achievedWeight / totalWeight) * 100) : 0}%)
                        </span>
                    )}
                </div>

                {saveResult && (
                    <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-semibold">
                        ✅ Guardado: {saveResult.saved} hallazgos
                        {saveResult.actionsCreated > 0 && ` · ${saveResult.actionsCreated} acciones correctivas creadas`}
                    </div>
                )}
            </div>

            {/* Legend */}
            <div className="flex gap-3 mb-5 flex-wrap">
                {FINDING_TYPES.map(ft => {
                    const Icon = ft.icon;
                    return (
                        <div key={ft.code} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${ft.bg} border ${ft.border}`}>
                            <Icon size={14} style={{ color: ft.color }} />
                            <span className={`text-xs font-bold ${ft.text}`}>{ft.label}</span>
                        </div>
                    );
                })}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
                    <MinusCircle size={14} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-500">Sin evaluar</span>
                </div>
            </div>

            {/* Chapters and Requirements */}
            <div className="space-y-4">
                {chapters.map((chapter, ci) => {
                    const chapterId = items.find(i => i.chapter_number === chapter.chapter_number)?.chapter_id || ci;
                    const isCollapsed = collapsedChapters.has(chapterId);
                    const chapterEvaluated = chapter.items.filter(i => findings.get(i.id)?.type_id !== null).length;

                    return (
                        <div key={chapter.chapter_number} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            {/* Chapter Header */}
                            <button
                                onClick={() => toggleChapter(chapterId)}
                                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-white" style={{ backgroundColor: accentColor }}>
                                        {chapter.chapter_number}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">{chapter.chapter_title}</h3>
                                        <p className="text-xs text-slate-400">{chapterEvaluated}/{chapter.items.length} evaluados</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-24 bg-slate-100 rounded-full h-1.5">
                                        <div
                                            className="h-1.5 rounded-full"
                                            style={{ width: `${chapter.items.length > 0 ? (chapterEvaluated / chapter.items.length) * 100 : 0}%`, backgroundColor: accentColor }}
                                        />
                                    </div>
                                    {isCollapsed ? <ChevronRight size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                                </div>
                            </button>

                            {/* Requirements */}
                            {!isCollapsed && (
                                <div className="border-t border-slate-100">
                                    {chapter.items.map((item, idx) => {
                                        const f = findings.get(item.id);
                                        const currentType = FINDING_TYPES.find(t => t.id === f?.type_id);
                                        const isExpanded = expandedItems.has(item.id);
                                        const isNC = currentType?.code === 'NC_MENOR' || currentType?.code === 'NC_MAYOR';

                                        return (
                                            <div
                                                key={item.id}
                                                className={`border-b border-slate-50 last:border-0 transition-colors ${currentType ? '' : 'bg-white'}`}
                                                style={currentType ? { backgroundColor: currentType.color + '08' } : {}}
                                            >
                                                <div className="p-4">
                                                    <div className="flex items-start gap-3">
                                                        {/* Code badge */}
                                                        <div className="shrink-0 mt-0.5">
                                                            <span className="text-xs font-mono font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                                                {item.requirement_code}
                                                            </span>
                                                        </div>

                                                        {/* Title + actions */}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-start justify-between gap-3 flex-wrap">
                                                                <p className="text-sm font-semibold text-slate-800 flex-1">
                                                                    {item.requirement_title}
                                                                    {isRes0312 && item.weight > 0 && (
                                                                        <span className="ml-2 text-xs text-slate-400 font-normal">({item.weight} pts)</span>
                                                                    )}
                                                                </p>

                                                                {/* Finding type buttons */}
                                                                <div className="flex items-center gap-1.5 shrink-0">
                                                                    {FINDING_TYPES.map(ft => {
                                                                        const Icon = ft.icon;
                                                                        const isSelected = f?.type_id === ft.id;
                                                                        return (
                                                                            <button
                                                                                key={ft.code}
                                                                                onClick={() => setFindingType(item.id, isSelected ? null : ft.id)}
                                                                                title={ft.label}
                                                                                className={`p-1.5 rounded-lg border-2 transition-all ${
                                                                                    isSelected
                                                                                        ? `${ft.bg} ${ft.border}`
                                                                                        : 'border-slate-200 hover:border-slate-300 bg-white'
                                                                                }`}
                                                                            >
                                                                                <Icon size={16} style={{ color: isSelected ? ft.color : '#94a3b8' }} />
                                                                            </button>
                                                                        );
                                                                    })}
                                                                    <button
                                                                        onClick={() => toggleExpand(item.id)}
                                                                        className="p-1.5 rounded-lg border-2 border-slate-200 hover:border-slate-300 bg-white"
                                                                        title="Expandir detalles"
                                                                    >
                                                                        {isExpanded ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            {/* Status indicator */}
                                                            {currentType && (
                                                                <div className="flex items-center gap-1 mt-1">
                                                                    <span className="text-xs font-bold" style={{ color: currentType.color }}>
                                                                        {currentType.label}
                                                                    </span>
                                                                    {isNC && <span className="text-xs text-slate-400">· se creará acción correctiva</span>}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Expanded detail fields */}
                                                    {isExpanded && (
                                                        <div className="mt-3 ml-12 space-y-3 border-t border-slate-100 pt-3">
                                                            <div>
                                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Evidencia</label>
                                                                <textarea rows={2}
                                                                    value={f?.evidence || ''}
                                                                    onChange={e => setFindingDetail(item.id, 'evidence', e.target.value)}
                                                                    placeholder="Describe la evidencia encontrada..."
                                                                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Notas / Observaciones</label>
                                                                <textarea rows={2}
                                                                    value={f?.observations || ''}
                                                                    onChange={e => setFindingDetail(item.id, 'observations', e.target.value)}
                                                                    placeholder="Observaciones adicionales..."
                                                                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                                                                />
                                                            </div>
                                                            {isNC && (
                                                                <div>
                                                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Descripción de la No Conformidad</label>
                                                                    <textarea rows={2}
                                                                        value={f?.description || ''}
                                                                        onChange={e => setFindingDetail(item.id, 'description', e.target.value)}
                                                                        placeholder="Describe la no conformidad detectada..."
                                                                        className="w-full px-3 py-2 text-sm border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 resize-none"
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Sticky Save Button */}
            <div className="sticky bottom-6 mt-6 flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 text-white rounded-xl font-bold shadow-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                    style={{ backgroundColor: accentColor }}
                >
                    <Save size={18} />
                    {saving ? 'Guardando...' : `Guardar Checklist (${evaluated}/${items.length} evaluados)`}
                </button>
            </div>
        </div>
    );
}
