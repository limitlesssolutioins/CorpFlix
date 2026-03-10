'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, CheckCircle2, XCircle, ChevronDown, ChevronRight, Lightbulb, AlertTriangle, User, Plus, Minus } from 'lucide-react';

interface AuditInfo {
    id: number; audit_code: string; auditor_name: string; audit_date: string;
    scope: string; status: string; standard_id: number; company_profile: string;
    standard_name: string; standard_color: string;
}
interface ChecklistItem {
    id: number;
    requirement_code: string;
    requirement_title: string;
    requirement_description: string | null;
    chapter_id: number;
    chapter_number: string;
    chapter_title: string;
    weight: number;
    profile: string;
    is_auditable: number;
    finding_id: number | null;
    finding_type_id: number | null;
    finding_description: string | null;
    evidence: string | null;
    observations: string | null;
    type_code: string | null;
    is_op: number | null;
    responsible: string | null;
}
type FindingState = {
    type_id: number | null;
    description: string;
    evidence: string;
    observations: string;
    is_op: number;
    responsible: string;
};

const CUMPLE_ID = 1;
const NC_ID = 3;

function groupByChapter(items: ChecklistItem[]) {
    const map = new Map<number, { chapter_id: number; chapter_number: string; chapter_title: string; items: ChecklistItem[] }>();
    for (const item of items) {
        if (!map.has(item.chapter_id)) {
            map.set(item.chapter_id, { chapter_id: item.chapter_id, chapter_number: item.chapter_number, chapter_title: item.chapter_title, items: [] });
        }
        map.get(item.chapter_id)!.items.push(item);
    }
    return Array.from(map.values()).sort((a, b) =>
        a.chapter_number.localeCompare(b.chapter_number, undefined, { numeric: true })
    );
}

function getIndentLevel(code: string): number {
    const dots = (code.match(/\./g) || []).length;
    return Math.max(0, dots - 1);
}

// Check if item should be hidden because an ancestor is collapsed
function isHiddenByCollapse(code: string, collapsedParents: Set<string>): boolean {
    const parts = code.split('.');
    for (let i = 1; i < parts.length; i++) {
        const ancestor = parts.slice(0, i).join('.');
        if (collapsedParents.has(ancestor)) return true;
    }
    return false;
}

export default function ChecklistPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const code = (params.standard as string).toUpperCase();
    const auditId = searchParams.get('audit_id');

    const [audit, setAudit] = useState<AuditInfo | null>(null);
    const [items, setItems] = useState<ChecklistItem[]>([]);
    const [findings, setFindings] = useState<Map<number, FindingState>>(new Map());
    const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
    const [collapsedChapters, setCollapsedChapters] = useState<Set<number>>(new Set());
    const [collapsedParents, setCollapsedParents] = useState<Set<string>>(new Set());
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

            const allAudits: AuditInfo[] = Array.isArray(auditRes) ? auditRes : [];
            const found = allAudits.find(a => a.id === parseInt(auditId!));
            if (found) setAudit(found);

            const checklistItems: ChecklistItem[] = Array.isArray(checklistRes) ? checklistRes : [];
            setItems(checklistItems);

            const map = new Map<number, FindingState>();
            for (const item of checklistItems) {
                if (item.is_auditable !== 1) continue;
                map.set(item.id, {
                    type_id: item.finding_type_id,
                    description: item.finding_description || '',
                    evidence: item.evidence || '',
                    observations: item.observations || '',
                    is_op: item.is_op || 0,
                    responsible: item.responsible || '',
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
            const existing = next.get(reqId) || { type_id: null, description: '', evidence: '', observations: '', is_op: 0, responsible: '' };
            const is_op = typeId === NC_ID ? 0 : existing.is_op;
            next.set(reqId, { ...existing, type_id: typeId, is_op });
            return next;
        });
    };

    const toggleOp = (reqId: number) => {
        setFindings(prev => {
            const next = new Map(prev);
            const existing = next.get(reqId) || { type_id: null, description: '', evidence: '', observations: '', is_op: 0, responsible: '' };
            next.set(reqId, { ...existing, is_op: existing.is_op ? 0 : 1 });
            return next;
        });
    };

    const setFindingDetail = (reqId: number, field: 'description' | 'evidence' | 'observations' | 'responsible', value: string) => {
        setFindings(prev => {
            const next = new Map(prev);
            const existing = next.get(reqId) || { type_id: null, description: '', evidence: '', observations: '', is_op: 0, responsible: '' };
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

    const toggleParent = (parentCode: string) => {
        setCollapsedParents(prev => {
            const next = new Set(prev);
            if (next.has(parentCode)) next.delete(parentCode); else next.add(parentCode);
            return next;
        });
    };

    const handleSave = async () => {
        if (!auditId) return;
        setSaving(true);
        setSaveResult(null);
        try {
            const leafItems = items.filter(i => i.is_auditable === 1);
            const findingsArray = leafItems.map(item => {
                const f = findings.get(item.id);
                return {
                    requirement_id: item.id,
                    finding_type_id: f?.type_id ?? null,
                    finding_description: f?.description || null,
                    evidence: f?.evidence || null,
                    observations: f?.observations || null,
                    is_op: f?.is_op ?? 0,
                    responsible: f?.responsible || null,
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

    const leafItems = items.filter(i => i.is_auditable === 1);
    const fValues = Array.from(findings.values());
    const evaluated = fValues.filter(f => f.type_id !== null).length;
    const confCount = fValues.filter(f => f.type_id === CUMPLE_ID).length;
    const ncCount = fValues.filter(f => f.type_id === NC_ID).length;
    const opCount = fValues.filter(f => f.is_op === 1).length;

    const isRes0312 = code === 'RES0312';
    const totalWeight = isRes0312 ? leafItems.reduce((sum, i) => sum + (i.weight || 0), 0) : 0;
    const achievedWeight = isRes0312 ? leafItems.reduce((sum, i) => {
        const f = findings.get(i.id);
        return sum + (f?.type_id === CUMPLE_ID ? (i.weight || 0) : 0);
    }, 0) : 0;

    const accentColor = audit?.standard_color || '#3b82f6';
    const standardPath = `/auditoria/${code.toLowerCase()}`;
    const chapters = groupByChapter(items);

    // Count leaf children under a parent code (for badge)
    const countLeafChildren = (parentCode: string) =>
        items.filter(i => i.is_auditable === 1 && i.requirement_code.startsWith(parentCode + '.')).length;

    // Count evaluated leaf children under a parent code
    const countEvaluatedChildren = (parentCode: string) =>
        items.filter(i => i.is_auditable === 1 && i.requirement_code.startsWith(parentCode + '.') && findings.get(i.id)?.type_id !== null).length;

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

            {/* Progress & Summary */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm mb-5">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-slate-700">Progreso de evaluación</span>
                    <span className="text-sm font-black text-slate-900">{evaluated} / {leafItems.length} requisitos</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 mb-4">
                    <div
                        className="h-3 rounded-full transition-all duration-500"
                        style={{ width: `${leafItems.length > 0 ? (evaluated / leafItems.length) * 100 : 0}%`, backgroundColor: accentColor }}
                    />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
                        <div className="text-2xl font-black text-emerald-700">{confCount}</div>
                        <div className="text-xs font-semibold text-emerald-600 mt-0.5">Cumplen</div>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
                        <div className="text-2xl font-black text-red-700">{ncCount}</div>
                        <div className="text-xs font-semibold text-red-600 mt-0.5">No Cumplen (NC)</div>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
                        <div className="text-2xl font-black text-amber-700">{opCount}</div>
                        <div className="text-xs font-semibold text-amber-600 mt-0.5">Oport. Mejora</div>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                        <div className="text-2xl font-black text-slate-500">{leafItems.length - evaluated}</div>
                        <div className="text-xs font-semibold text-slate-400 mt-0.5">Sin evaluar</div>
                    </div>
                </div>
                {isRes0312 && totalWeight > 0 && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700 font-semibold text-center">
                        Puntaje: {achievedWeight.toFixed(1)} / {totalWeight.toFixed(1)} pts · {totalWeight > 0 ? Math.round((achievedWeight / totalWeight) * 100) : 0}% de cumplimiento
                    </div>
                )}
                {saveResult && (
                    <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-semibold">
                        ✅ Guardado: {saveResult.saved} hallazgos
                        {saveResult.actionsCreated > 0 && ` · ${saveResult.actionsCreated} acciones correctivas creadas`}
                    </div>
                )}
            </div>

            {/* Chapters and Requirements */}
            <div className="space-y-4">
                {chapters.map((chapter) => {
                    const isCollapsed = collapsedChapters.has(chapter.chapter_id);
                    const chapterLeafs = chapter.items.filter(i => i.is_auditable === 1);
                    const chapterEvaluated = chapterLeafs.filter(i => findings.get(i.id)?.type_id !== null).length;
                    const chapterAllCumple = chapterLeafs.length > 0 && chapterLeafs.every(i => findings.get(i.id)?.type_id === CUMPLE_ID);
                    const chapterHasNC = chapterLeafs.some(i => findings.get(i.id)?.type_id === NC_ID);

                    return (
                        <div key={chapter.chapter_id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            {/* Chapter Header */}
                            <button
                                onClick={() => toggleChapter(chapter.chapter_id)}
                                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-white shrink-0" style={{ backgroundColor: accentColor }}>
                                        {chapter.chapter_number}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="font-bold text-slate-900">{chapter.chapter_title}</h3>
                                            {chapterAllCumple && (
                                                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                    <CheckCircle2 size={11} /> Conforme
                                                </span>
                                            )}
                                            {chapterHasNC && (
                                                <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                    <XCircle size={11} /> No Conforme
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-400">{chapterEvaluated}/{chapterLeafs.length} evaluados</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <div className="w-24 bg-slate-100 rounded-full h-1.5">
                                        <div
                                            className="h-1.5 rounded-full transition-all"
                                            style={{ width: `${chapterLeafs.length > 0 ? (chapterEvaluated / chapterLeafs.length) * 100 : 0}%`, backgroundColor: accentColor }}
                                        />
                                    </div>
                                    {isCollapsed ? <ChevronRight size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                                </div>
                            </button>

                            {/* Requirements */}
                            {!isCollapsed && (
                                <div className="border-t border-slate-100">
                                    {chapter.items.map((item) => {
                                        // Check if hidden by a collapsed parent
                                        if (isHiddenByCollapse(item.requirement_code, collapsedParents)) return null;

                                        const indent = getIndentLevel(item.requirement_code);

                                        // ─── PARENT ITEM (not auditable) ───────────────────────────
                                        if (item.is_auditable === 0) {
                                            const isParentCollapsed = collapsedParents.has(item.requirement_code);
                                            const childCount = countLeafChildren(item.requirement_code);
                                            const evalCount = countEvaluatedChildren(item.requirement_code);
                                            const allChildCumple = childCount > 0 && items
                                                .filter(i => i.is_auditable === 1 && i.requirement_code.startsWith(item.requirement_code + '.'))
                                                .every(i => findings.get(i.id)?.type_id === CUMPLE_ID);
                                            const hasChildNC = items
                                                .filter(i => i.is_auditable === 1 && i.requirement_code.startsWith(item.requirement_code + '.'))
                                                .some(i => findings.get(i.id)?.type_id === NC_ID);

                                            return (
                                                <div
                                                    key={item.id}
                                                    className="border-b border-slate-100 last:border-0"
                                                    style={{ paddingLeft: `${indent * 20}px` }}
                                                >
                                                    <button
                                                        onClick={() => toggleParent(item.requirement_code)}
                                                        className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors text-left group"
                                                    >
                                                        <div className="flex items-center gap-2.5 min-w-0">
                                                            <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-colors ${isParentCollapsed ? 'bg-slate-100 text-slate-500' : 'text-slate-400'}`}
                                                                style={!isParentCollapsed ? { backgroundColor: `${accentColor}15`, color: accentColor } : {}}>
                                                                {isParentCollapsed
                                                                    ? <Plus size={14} />
                                                                    : <Minus size={14} />
                                                                }
                                                            </div>
                                                            <span className="text-xs font-mono font-black px-2 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                                                                {item.requirement_code}
                                                            </span>
                                                            <span className="text-sm font-bold text-slate-700 truncate">{item.requirement_title}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 shrink-0 ml-3">
                                                            {allChildCumple && (
                                                                <span className="hidden sm:flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                                                    <CheckCircle2 size={10} /> Conforme
                                                                </span>
                                                            )}
                                                            {hasChildNC && (
                                                                <span className="hidden sm:flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                                                                    <XCircle size={10} /> NC
                                                                </span>
                                                            )}
                                                            <span className="text-xs text-slate-400 font-semibold whitespace-nowrap">
                                                                {evalCount}/{childCount}
                                                            </span>
                                                            <div className="w-16 bg-slate-100 rounded-full h-1.5">
                                                                <div className="h-1.5 rounded-full transition-all"
                                                                    style={{ width: `${childCount > 0 ? (evalCount / childCount) * 100 : 0}%`, backgroundColor: accentColor }} />
                                                            </div>
                                                        </div>
                                                    </button>
                                                </div>
                                            );
                                        }

                                        // ─── LEAF ITEM (auditable) ─────────────────────────────────
                                        const f = findings.get(item.id);
                                        const isCumple = f?.type_id === CUMPLE_ID;
                                        const isNC = f?.type_id === NC_ID;
                                        const isExpanded = expandedItems.has(item.id);
                                        const bgColor = isCumple ? '#10b98108' : isNC ? '#ef444408' : 'transparent';

                                        return (
                                            <div
                                                key={item.id}
                                                className="border-b border-slate-50 last:border-0"
                                                style={{ backgroundColor: bgColor, paddingLeft: `${indent * 20 + 16}px` }}
                                            >
                                                <div className="p-3 pr-4">
                                                    <div className="flex items-start gap-3">
                                                        {/* Indent indicator */}
                                                        <div className="shrink-0 mt-1 flex items-center gap-1.5">
                                                            {indent > 0 && <div className="w-3 h-px bg-slate-300 shrink-0" />}
                                                            <span className={`text-xs font-mono font-black px-1.5 py-0.5 rounded ${
                                                                indent === 0 ? 'text-slate-600 bg-slate-100' :
                                                                indent === 1 ? 'text-slate-500 bg-slate-50 border border-slate-200' :
                                                                'text-slate-400 bg-white border border-slate-200'
                                                            }`}>
                                                                {item.requirement_code}
                                                            </span>
                                                        </div>

                                                        {/* Content */}
                                                        <div className="flex-1 min-w-0">
                                                            {/* Title row */}
                                                            <div className="flex items-start justify-between gap-2 flex-wrap">
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-semibold text-slate-800 leading-snug">
                                                                        {item.requirement_title}
                                                                        {isRes0312 && item.weight > 0 && (
                                                                            <span className="ml-2 text-xs text-slate-400 font-normal">({item.weight} pts)</span>
                                                                        )}
                                                                    </p>
                                                                    {item.requirement_description && (
                                                                        <p className="text-xs text-slate-400 mt-0.5 italic leading-snug">
                                                                            {item.requirement_description}
                                                                        </p>
                                                                    )}
                                                                </div>

                                                                {/* Action buttons */}
                                                                <div className="flex items-center gap-1.5 shrink-0">
                                                                    <button
                                                                        onClick={() => setFindingType(item.id, isCumple ? null : CUMPLE_ID)}
                                                                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border-2 text-xs font-bold transition-all ${
                                                                            isCumple
                                                                                ? 'bg-emerald-50 border-emerald-400 text-emerald-700'
                                                                                : 'border-slate-200 hover:border-emerald-300 bg-white text-slate-500'
                                                                        }`}
                                                                    >
                                                                        <CheckCircle2 size={13} className={isCumple ? 'text-emerald-500' : 'text-slate-400'} />
                                                                        Cumple
                                                                    </button>
                                                                    <button
                                                                        onClick={() => setFindingType(item.id, isNC ? null : NC_ID)}
                                                                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border-2 text-xs font-bold transition-all ${
                                                                            isNC
                                                                                ? 'bg-red-50 border-red-400 text-red-700'
                                                                                : 'border-slate-200 hover:border-red-300 bg-white text-slate-500'
                                                                        }`}
                                                                    >
                                                                        <XCircle size={13} className={isNC ? 'text-red-500' : 'text-slate-400'} />
                                                                        No Cumple
                                                                    </button>
                                                                    <button
                                                                        onClick={() => toggleExpand(item.id)}
                                                                        className={`p-1.5 rounded-lg border-2 transition-all ${isExpanded ? 'border-slate-300 bg-slate-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                                                                        title="Detalles y responsable"
                                                                    >
                                                                        {isExpanded ? <ChevronDown size={14} className="text-slate-500" /> : <ChevronRight size={14} className="text-slate-400" />}
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            {/* Status badges */}
                                                            {(isCumple || isNC || f?.responsible) && (
                                                                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                                                    {isCumple && (
                                                                        <>
                                                                            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                                                                                <CheckCircle2 size={11} /> Cumple
                                                                            </span>
                                                                            <button
                                                                                onClick={() => toggleOp(item.id)}
                                                                                className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border transition-all ${
                                                                                    f?.is_op
                                                                                        ? 'bg-amber-50 border-amber-300 text-amber-700'
                                                                                        : 'border-slate-200 text-slate-400 hover:border-amber-300 hover:text-amber-600'
                                                                                }`}
                                                                            >
                                                                                <Lightbulb size={11} />
                                                                                {f?.is_op ? 'Oportunidad de Mejora' : '+ Oportunidad'}
                                                                            </button>
                                                                        </>
                                                                    )}
                                                                    {isNC && (
                                                                        <span className="flex items-center gap-1 text-xs font-bold text-red-600">
                                                                            <AlertTriangle size={11} /> NC · acción correctiva
                                                                        </span>
                                                                    )}
                                                                    {f?.responsible && (
                                                                        <span className="flex items-center gap-1 text-xs text-slate-500">
                                                                            <User size={11} /> {f.responsible}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            )}

                                                            {/* Expanded details */}
                                                            {isExpanded && (
                                                                <div className="mt-3 space-y-3 border-t border-slate-100 pt-3">
                                                                    {/* Responsable */}
                                                                    <div>
                                                                        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase mb-1">
                                                                            <User size={12} /> Responsable
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            value={f?.responsible || ''}
                                                                            onChange={e => setFindingDetail(item.id, 'responsible', e.target.value)}
                                                                            placeholder="Nombre del responsable..."
                                                                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                                        />
                                                                    </div>
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
                                                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Observaciones</label>
                                                                        <textarea rows={2}
                                                                            value={f?.observations || ''}
                                                                            onChange={e => setFindingDetail(item.id, 'observations', e.target.value)}
                                                                            placeholder="Observaciones adicionales..."
                                                                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                                                                        />
                                                                    </div>
                                                                    {isNC && (
                                                                        <div>
                                                                            <label className="block text-xs font-bold text-red-500 uppercase mb-1">Descripción de la No Conformidad</label>
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
                    {saving ? 'Guardando...' : `Guardar Checklist (${evaluated}/${leafItems.length})`}
                </button>
            </div>
        </div>
    );
}
