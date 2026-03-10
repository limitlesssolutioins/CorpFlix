'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft, Save, CheckCircle2, XCircle, ChevronDown, ChevronRight,
    Lightbulb, AlertTriangle, User, Plus, Minus, Sparkles, Loader2,
    X, TrendingUp, Pencil, Trash2,
} from 'lucide-react';

interface AuditInfo {
    id: number; audit_code: string; auditor_name: string; audit_date: string;
    scope: string; status: string; standard_id: number; company_profile: string;
    standard_name: string; standard_color: string;
}
interface ChecklistItem {
    id: number; requirement_code: string; requirement_title: string;
    requirement_description: string | null; chapter_id: number;
    chapter_number: string; chapter_title: string;
    weight: number; profile: string; is_auditable: number;
    finding_id: number | null; finding_type_id: number | null;
    finding_description: string | null; evidence: string | null;
    observations: string | null; type_code: string | null;
    is_op: number | null; responsible: string | null;
}
interface Variable { id: number; requirement_id: number; variable_text: string; variable_order: number; }
type FindingState = { type_id: number | null; description: string; evidence: string; observations: string; is_op: number; responsible: string; };
type VarAnswer = 'si' | 'no' | 'na';
interface Opportunity { area: string; oportunidad: string; beneficio: string; }

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
function getIndentLevel(code: string) { return Math.max(0, (code.match(/\./g) || []).length - 1); }
function isHiddenByCollapse(code: string, collapsed: Set<string>) {
    const parts = code.split('.');
    for (let i = 1; i < parts.length; i++) {
        if (collapsed.has(parts.slice(0, i).join('.'))) return true;
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

    // Variables state
    const [reqVariables, setReqVariables] = useState<Map<number, Variable[]>>(new Map());
    const [varAnswers, setVarAnswers] = useState<Map<string, VarAnswer>>(new Map()); // key: `${reqId}-${varId}`
    const [loadingVars, setLoadingVars] = useState<Set<number>>(new Set());
    const [generatingVars, setGeneratingVars] = useState<Set<number>>(new Set());
    const [editingVars, setEditingVars] = useState<Set<number>>(new Set());
    const [varDrafts, setVarDrafts] = useState<Map<number, string[]>>(new Map());
    const [savingVars, setSavingVars] = useState<Set<number>>(new Set());

    // AI opportunities
    const [showOpModal, setShowOpModal] = useState(false);
    const [generatingOps, setGeneratingOps] = useState(false);
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

    useEffect(() => { if (auditId) loadChecklist(); }, [auditId]);

    const loadChecklist = async () => {
        setLoading(true);
        try {
            const [auditRes, checklistRes, answersRes] = await Promise.all([
                fetch(`/api/auditoria/audits`).then(r => r.json()),
                fetch(`/api/auditoria/checklist?audit_id=${auditId}`).then(r => r.json()),
                fetch(`/api/auditoria/variable-answers?audit_id=${auditId}`).then(r => r.json()),
            ]);

            const allAudits: AuditInfo[] = Array.isArray(auditRes) ? auditRes : [];
            const found = allAudits.find(a => a.id === parseInt(auditId!));
            if (found) setAudit(found);

            const checklistItems: ChecklistItem[] = Array.isArray(checklistRes) ? checklistRes : [];
            setItems(checklistItems);

            // Initialize findings
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

            // Initialize variable answers
            const answerMap = new Map<string, VarAnswer>();
            if (Array.isArray(answersRes)) {
                for (const a of answersRes) {
                    answerMap.set(`${a.requirement_id}-${a.variable_id}`, a.answer as VarAnswer);
                }
            }
            setVarAnswers(answerMap);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    // Auto-compute compliance from variable answers
    const computeComplianceFromVars = useCallback((reqId: number, vars: Variable[], currentAnswers: Map<string, VarAnswer>): number | null => {
        if (!vars.length) return null;
        const hasNo = vars.some(v => currentAnswers.get(`${reqId}-${v.id}`) === 'no');
        const allAnswered = vars.every(v => currentAnswers.has(`${reqId}-${v.id}`));
        if (hasNo) return NC_ID;
        if (allAnswered) return CUMPLE_ID;
        return null;
    }, []);

    const setVarAnswer = async (reqId: number, varId: number, answer: VarAnswer) => {
        const newAnswers = new Map(varAnswers);
        newAnswers.set(`${reqId}-${varId}`, answer);
        setVarAnswers(newAnswers);

        // Auto-update finding type
        const vars = reqVariables.get(reqId) || [];
        const computed = computeComplianceFromVars(reqId, vars, newAnswers);
        if (computed !== null) {
            setFindings(prev => {
                const next = new Map(prev);
                const existing = next.get(reqId) || { type_id: null, description: '', evidence: '', observations: '', is_op: 0, responsible: '' };
                const is_op = computed === NC_ID ? 0 : existing.is_op;
                next.set(reqId, { ...existing, type_id: computed, is_op });
                return next;
            });
        }

        // Save to server (fire and forget)
        fetch('/api/auditoria/variable-answers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ audit_id: parseInt(auditId!), requirement_id: reqId, variable_id: varId, answer }),
        }).catch(console.error);
    };

    const loadVariables = async (reqId: number) => {
        if (reqVariables.has(reqId)) return; // Already loaded
        setLoadingVars(prev => new Set(prev).add(reqId));
        try {
            const res = await fetch(`/api/auditoria/variables?requirement_id=${reqId}`);
            const vars = await res.json();
            setReqVariables(prev => new Map(prev).set(reqId, Array.isArray(vars) ? vars : []));
        } catch { }
        finally { setLoadingVars(prev => { const n = new Set(prev); n.delete(reqId); return n; }); }
    };

    const generateVariables = async (item: ChecklistItem) => {
        setGeneratingVars(prev => new Set(prev).add(item.id));
        try {
            const res = await fetch('/api/auditoria/generate-audit-variables', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    requirement_id: item.id,
                    requirement_code: item.requirement_code,
                    requirement_title: item.requirement_title,
                    requirement_description: item.requirement_description,
                    standard_name: audit?.standard_name || code,
                }),
            });
            if (res.ok) {
                const vars = await res.json();
                setReqVariables(prev => new Map(prev).set(item.id, Array.isArray(vars) ? vars : []));
            }
        } catch { }
        finally { setGeneratingVars(prev => { const n = new Set(prev); n.delete(item.id); return n; }); }
    };

    const startEditVars = (reqId: number) => {
        const vars = reqVariables.get(reqId) || [];
        setVarDrafts(prev => new Map(prev).set(reqId, vars.map(v => v.variable_text)));
        setEditingVars(prev => new Set(prev).add(reqId));
    };

    const cancelEditVars = (reqId: number) => {
        setEditingVars(prev => { const n = new Set(prev); n.delete(reqId); return n; });
        setVarDrafts(prev => { const n = new Map(prev); n.delete(reqId); return n; });
    };

    const saveVarEdits = async (reqId: number) => {
        const drafts = (varDrafts.get(reqId) || []).map(t => t.trim()).filter(t => t.length > 0);
        setSavingVars(prev => new Set(prev).add(reqId));
        try {
            const res = await fetch('/api/auditoria/variables', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ requirement_id: reqId, variables: drafts }),
            });
            if (res.ok) {
                const saved = await res.json();
                setReqVariables(prev => new Map(prev).set(reqId, Array.isArray(saved) ? saved : []));
            }
        } catch { }
        finally {
            setSavingVars(prev => { const n = new Set(prev); n.delete(reqId); return n; });
            cancelEditVars(reqId);
        }
    };

    const toggleExpand = async (reqId: number, item: ChecklistItem) => {
        const willExpand = !expandedItems.has(reqId);
        setExpandedItems(prev => {
            const next = new Set(prev);
            if (next.has(reqId)) next.delete(reqId); else next.add(reqId);
            return next;
        });
        if (willExpand) await loadVariables(reqId);
    };

    const generateOpportunities = async () => {
        setGeneratingOps(true);
        setShowOpModal(true);
        try {
            const leafItems = items.filter(i => i.is_auditable === 1);
            const findingsData = leafItems.map(item => {
                const f = findings.get(item.id);
                return {
                    requirement_code: item.requirement_code,
                    chapter_title: item.chapter_title,
                    finding_type_id: f?.type_id ?? null,
                    type_code: f?.type_id === CUMPLE_ID ? 'C' : f?.type_id === NC_ID ? 'NC' : null,
                    finding_description: f?.description || null,
                };
            });

            const res = await fetch('/api/auditoria/generate-opportunities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    standard_name: audit?.standard_name,
                    audit_code: audit?.audit_code,
                    findings: findingsData,
                }),
            });
            if (res.ok) {
                const data = await res.json();
                setOpportunities(Array.isArray(data) ? data : []);
            }
        } catch { }
        finally { setGeneratingOps(false); }
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

    const setFindingDetail = (reqId: number, field: keyof FindingState, value: string) => {
        setFindings(prev => {
            const next = new Map(prev);
            const existing = next.get(reqId) || { type_id: null, description: '', evidence: '', observations: '', is_op: 0, responsible: '' };
            next.set(reqId, { ...existing, [field]: value });
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
            if (res.ok) setSaveResult(await res.json());
            else alert('❌ Error al guardar');
        } catch { alert('❌ Error al guardar'); }
        finally { setSaving(false); }
    };

    const leafItems = items.filter(i => i.is_auditable === 1);
    const fValues = Array.from(findings.values());
    const evaluated = fValues.filter(f => f.type_id !== null).length;
    const confCount = fValues.filter(f => f.type_id === CUMPLE_ID).length;
    const ncCount = fValues.filter(f => f.type_id === NC_ID).length;

    const isRes0312 = code === 'RES0312';
    const totalWeight = isRes0312 ? leafItems.reduce((s, i) => s + (i.weight || 0), 0) : 0;
    const achievedWeight = isRes0312 ? leafItems.reduce((s, i) => {
        const f = findings.get(i.id);
        return s + (f?.type_id === CUMPLE_ID ? (i.weight || 0) : 0);
    }, 0) : 0;

    const accentColor = audit?.standard_color || '#3b82f6';
    const standardPath = `/auditoria/${code.toLowerCase()}`;
    const chapters = groupByChapter(items);

    const countLeafChildren = (parentCode: string) =>
        items.filter(i => i.is_auditable === 1 && i.requirement_code.startsWith(parentCode + '.')).length;
    const countEvaluated = (parentCode: string) =>
        items.filter(i => i.is_auditable === 1 && i.requirement_code.startsWith(parentCode + '.') && findings.get(i.id)?.type_id !== null).length;

    if (!auditId) return (
        <div className="max-w-2xl mx-auto text-center py-20">
            <p className="text-slate-500">Se requiere audit_id en la URL</p>
            <Link href={standardPath} className="mt-4 inline-block text-blue-600 font-semibold text-sm">← Volver</Link>
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
            <Link href={`${standardPath}/auditorias`} className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-semibold mb-5 text-sm transition-colors">
                <ArrowLeft size={16} /> Volver a Auditorías
            </Link>

            {/* Header */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm mb-4">
                <div className="flex items-start justify-between flex-wrap gap-3">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: accentColor }}>
                                {audit?.standard_name || code}
                            </span>
                            <span className="text-xs font-mono text-slate-400">{audit?.audit_code}</span>
                        </div>
                        <h1 className="text-xl font-black text-slate-900">Lista de Chequeo</h1>
                        <p className="text-sm text-slate-500 mt-0.5">
                            {audit?.auditor_name} · {audit?.audit_date ? new Date(audit.audit_date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {evaluated > 0 && (
                            <button onClick={generateOpportunities}
                                className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white rounded-xl font-bold text-sm hover:bg-violet-700 transition-colors">
                                <Sparkles size={15} /> Oportunidades IA
                            </button>
                        )}
                        <button onClick={handleSave} disabled={saving}
                            className="flex items-center gap-2 px-5 py-2.5 text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                            style={{ backgroundColor: accentColor }}>
                            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                            {saving ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Progress */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-slate-700">Progreso</span>
                    <span className="text-sm font-black text-slate-900">{evaluated}/{leafItems.length} requisitos</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 mb-3">
                    <div className="h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${leafItems.length > 0 ? (evaluated / leafItems.length) * 100 : 0}%`, backgroundColor: accentColor }} />
                </div>
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
                        <div className="text-xl font-black text-emerald-700">{confCount}</div>
                        <div className="text-xs font-semibold text-emerald-600">Cumplen</div>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
                        <div className="text-xl font-black text-red-700">{ncCount}</div>
                        <div className="text-xs font-semibold text-red-600">No Cumplen</div>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                        <div className="text-xl font-black text-slate-500">{leafItems.length - evaluated}</div>
                        <div className="text-xs font-semibold text-slate-400">Sin evaluar</div>
                    </div>
                </div>
                {isRes0312 && totalWeight > 0 && (
                    <div className="mt-3 p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700 font-semibold text-center">
                        Puntaje: {achievedWeight.toFixed(1)} / {totalWeight.toFixed(1)} pts · {Math.round((achievedWeight / totalWeight) * 100)}%
                    </div>
                )}
                {saveResult && (
                    <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-semibold">
                        ✅ {saveResult.saved} hallazgos guardados{saveResult.actionsCreated > 0 && ` · ${saveResult.actionsCreated} acciones correctivas creadas`}
                    </div>
                )}
            </div>

            {/* Chapters */}
            <div className="space-y-3">
                {chapters.map(chapter => {
                    const isCollapsed = collapsedChapters.has(chapter.chapter_id);
                    const chapterLeafs = chapter.items.filter(i => i.is_auditable === 1);
                    const chapterEval = chapterLeafs.filter(i => findings.get(i.id)?.type_id !== null).length;
                    const allCumple = chapterLeafs.length > 0 && chapterLeafs.every(i => findings.get(i.id)?.type_id === CUMPLE_ID);
                    const hasNC = chapterLeafs.some(i => findings.get(i.id)?.type_id === NC_ID);

                    return (
                        <div key={chapter.chapter_id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            {/* Chapter header */}
                            <button onClick={() => setCollapsedChapters(prev => { const n = new Set(prev); n.has(chapter.chapter_id) ? n.delete(chapter.chapter_id) : n.add(chapter.chapter_id); return n; })}
                                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-white shrink-0" style={{ backgroundColor: accentColor }}>
                                        {chapter.chapter_number}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-slate-900">{chapter.chapter_title}</h3>
                                            {allCumple && <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">✓ Conforme</span>}
                                            {hasNC && <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">NC</span>}
                                        </div>
                                        <p className="text-xs text-slate-400">{chapterEval}/{chapterLeafs.length} evaluados</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <div className="w-20 bg-slate-100 rounded-full h-1.5">
                                        <div className="h-1.5 rounded-full" style={{ width: `${chapterLeafs.length > 0 ? (chapterEval / chapterLeafs.length) * 100 : 0}%`, backgroundColor: accentColor }} />
                                    </div>
                                    {isCollapsed ? <ChevronRight size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                                </div>
                            </button>

                            {!isCollapsed && (
                                <div className="border-t border-slate-100">
                                    {chapter.items.map(item => {
                                        if (isHiddenByCollapse(item.requirement_code, collapsedParents)) return null;
                                        const indent = getIndentLevel(item.requirement_code);

                                        // PARENT item
                                        if (item.is_auditable === 0) {
                                            const isParentCollapsed = collapsedParents.has(item.requirement_code);
                                            const childCount = countLeafChildren(item.requirement_code);
                                            const evalCount = countEvaluated(item.requirement_code);
                                            return (
                                                <div key={item.id} className="border-b border-slate-100 last:border-0" style={{ paddingLeft: `${indent * 20}px` }}>
                                                    <button onClick={() => setCollapsedParents(prev => { const n = new Set(prev); n.has(item.requirement_code) ? n.delete(item.requirement_code) : n.add(item.requirement_code); return n; })}
                                                        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 transition-colors text-left">
                                                        <div className="flex items-center gap-2 min-w-0">
                                                            <div className="w-5 h-5 rounded flex items-center justify-center shrink-0" style={{ backgroundColor: `${accentColor}18`, color: accentColor }}>
                                                                {isParentCollapsed ? <Plus size={12} /> : <Minus size={12} />}
                                                            </div>
                                                            <span className="text-xs font-mono font-black text-slate-500 shrink-0">{item.requirement_code}</span>
                                                            <span className="text-sm font-bold text-slate-700 truncate">{item.requirement_title}</span>
                                                        </div>
                                                        <span className="text-xs text-slate-400 shrink-0 ml-2">{evalCount}/{childCount}</span>
                                                    </button>
                                                </div>
                                            );
                                        }

                                        // LEAF item
                                        const f = findings.get(item.id);
                                        const isCumple = f?.type_id === CUMPLE_ID;
                                        const isNC = f?.type_id === NC_ID;
                                        const isExpanded = expandedItems.has(item.id);
                                        const vars = reqVariables.get(item.id) || [];
                                        const isLoadingV = loadingVars.has(item.id);
                                        const isGeneratingV = generatingVars.has(item.id);
                                        const isEditingV = editingVars.has(item.id);
                                        const isSavingV = savingVars.has(item.id);
                                        const drafts = varDrafts.get(item.id) || [];
                                        const hasVars = vars.length > 0;
                                        const answeredCount = hasVars ? vars.filter(v => varAnswers.has(`${item.id}-${v.id}`)).length : 0;
                                        const bgColor = isCumple ? '#10b98108' : isNC ? '#ef444408' : 'transparent';

                                        return (
                                            <div key={item.id} className="border-b border-slate-50 last:border-0"
                                                style={{ backgroundColor: bgColor, paddingLeft: `${indent * 20 + 12}px` }}>
                                                <div className="p-3 pr-4">
                                                    <div className="flex items-start gap-3">
                                                        {/* Code */}
                                                        <div className="shrink-0 mt-0.5 flex items-center gap-1.5">
                                                            {indent > 0 && <div className="w-3 h-px bg-slate-300" />}
                                                            <span className={`text-xs font-mono font-black px-1.5 py-0.5 rounded ${indent === 0 ? 'text-slate-600 bg-slate-100' : 'text-slate-400 bg-white border border-slate-200'}`}>
                                                                {item.requirement_code}
                                                            </span>
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            {/* Title + status buttons */}
                                                            <div className="flex items-start justify-between gap-2 flex-wrap">
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-semibold text-slate-800 leading-snug">{item.requirement_title}
                                                                        {isRes0312 && item.weight > 0 && <span className="ml-1.5 text-xs text-slate-400 font-normal">({item.weight}pts)</span>}
                                                                    </p>
                                                                    {/* Variable progress */}
                                                                    {hasVars && (
                                                                        <p className="text-xs text-slate-400 mt-0.5">
                                                                            {answeredCount}/{vars.length} criterios respondidos
                                                                            {answeredCount === vars.length && isCumple && <span className="text-emerald-600 font-bold ml-1">→ Cumple automático</span>}
                                                                            {answeredCount === vars.length && isNC && <span className="text-red-600 font-bold ml-1">→ No Cumple automático</span>}
                                                                        </p>
                                                                    )}
                                                                </div>

                                                                {/* Status buttons */}
                                                                <div className="flex items-center gap-1.5 shrink-0">
                                                                    <button onClick={() => setFindingType(item.id, isCumple ? null : CUMPLE_ID)}
                                                                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border-2 text-xs font-bold transition-all ${isCumple ? 'bg-emerald-50 border-emerald-400 text-emerald-700' : 'border-slate-200 hover:border-emerald-300 bg-white text-slate-500'}`}>
                                                                        <CheckCircle2 size={12} /> Cumple
                                                                    </button>
                                                                    <button onClick={() => setFindingType(item.id, isNC ? null : NC_ID)}
                                                                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border-2 text-xs font-bold transition-all ${isNC ? 'bg-red-50 border-red-400 text-red-700' : 'border-slate-200 hover:border-red-300 bg-white text-slate-500'}`}>
                                                                        <XCircle size={12} /> No Cumple
                                                                    </button>
                                                                    <button onClick={() => toggleExpand(item.id, item)}
                                                                        className={`p-1.5 rounded-lg border-2 transition-all ${isExpanded ? 'border-slate-300 bg-slate-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                                                                        {isExpanded ? <ChevronDown size={14} className="text-slate-500" /> : <ChevronRight size={14} className="text-slate-400" />}
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            {/* Status badges */}
                                                            {(isCumple || isNC) && (
                                                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                                    {isCumple && (
                                                                        <>
                                                                            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1"><CheckCircle2 size={10} /> Cumple</span>
                                                                            <button onClick={() => toggleOp(item.id)}
                                                                                className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border transition-all ${f?.is_op ? 'bg-amber-50 border-amber-300 text-amber-700' : 'border-slate-200 text-slate-400 hover:border-amber-300'}`}>
                                                                                <Lightbulb size={10} /> {f?.is_op ? 'Oportunidad de Mejora' : '+ Oportunidad'}
                                                                            </button>
                                                                        </>
                                                                    )}
                                                                    {isNC && <span className="flex items-center gap-1 text-xs font-bold text-red-600"><AlertTriangle size={10} /> NC — acción correctiva</span>}
                                                                    {f?.responsible && <span className="flex items-center gap-1 text-xs text-slate-400"><User size={10} /> {f.responsible}</span>}
                                                                </div>
                                                            )}

                                                            {/* Expanded panel */}
                                                            {isExpanded && (
                                                                <div className="mt-3 border-t border-slate-100 pt-3 space-y-4">
                                                                    {/* VARIABLES SECTION */}
                                                                    <div>
                                                                        <div className="flex items-center justify-between mb-2">
                                                                            <p className="text-xs font-black text-slate-600 uppercase tracking-wide">Criterios de evaluación</p>
                                                                            <div className="flex items-center gap-2">
                                                                                {hasVars && !isEditingV && (
                                                                                    <span className="text-xs text-slate-400">{answeredCount}/{vars.length} respondidos</span>
                                                                                )}
                                                                                {hasVars && !isLoadingV && !isGeneratingV && !isEditingV && (
                                                                                    <button onClick={() => startEditVars(item.id)}
                                                                                        className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors border border-slate-200">
                                                                                        <Pencil size={10} /> Editar
                                                                                    </button>
                                                                                )}
                                                                            </div>
                                                                        </div>

                                                                        {(isLoadingV || isGeneratingV) ? (
                                                                            <div className="flex items-center gap-2 py-3 text-sm text-slate-500">
                                                                                <Loader2 size={14} className="animate-spin" />
                                                                                {isGeneratingV ? 'Generando criterios con IA...' : 'Cargando criterios...'}
                                                                            </div>
                                                                        ) : isEditingV ? (
                                                                            <div className="space-y-2">
                                                                                {drafts.map((text, idx) => (
                                                                                    <div key={idx} className="flex items-center gap-2">
                                                                                        <input
                                                                                            type="text"
                                                                                            value={text}
                                                                                            onChange={e => {
                                                                                                const next = [...drafts];
                                                                                                next[idx] = e.target.value;
                                                                                                setVarDrafts(prev => new Map(prev).set(item.id, next));
                                                                                            }}
                                                                                            className="flex-1 px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
                                                                                        />
                                                                                        <button onClick={() => {
                                                                                            const next = drafts.filter((_, i) => i !== idx);
                                                                                            setVarDrafts(prev => new Map(prev).set(item.id, next));
                                                                                        }} className="p-1 text-red-400 hover:text-red-600 transition-colors">
                                                                                            <Trash2 size={13} />
                                                                                        </button>
                                                                                    </div>
                                                                                ))}
                                                                                <button onClick={() => setVarDrafts(prev => new Map(prev).set(item.id, [...drafts, '']))}
                                                                                    className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-800 font-bold transition-colors">
                                                                                    <Plus size={12} /> Agregar criterio
                                                                                </button>
                                                                                <div className="flex gap-2 pt-1">
                                                                                    <button onClick={() => saveVarEdits(item.id)} disabled={isSavingV}
                                                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 text-white rounded-lg text-xs font-bold hover:bg-violet-700 transition-colors disabled:opacity-50">
                                                                                        {isSavingV ? <Loader2 size={11} className="animate-spin" /> : <Save size={11} />} Guardar
                                                                                    </button>
                                                                                    <button onClick={() => cancelEditVars(item.id)} disabled={isSavingV}
                                                                                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors border border-slate-200">
                                                                                        Cancelar
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        ) : hasVars ? (
                                                                            <div className="space-y-2">
                                                                                {vars.map(v => {
                                                                                    const ans = varAnswers.get(`${item.id}-${v.id}`);
                                                                                    return (
                                                                                        <div key={v.id} className={`flex items-start gap-3 p-2.5 rounded-xl border ${ans === 'si' ? 'bg-emerald-50 border-emerald-200' : ans === 'no' ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
                                                                                            <p className="text-xs text-slate-700 flex-1 pt-0.5 leading-relaxed">{v.variable_text}</p>
                                                                                            <div className="flex gap-1 shrink-0">
                                                                                                {(['si', 'no', 'na'] as VarAnswer[]).map(a => (
                                                                                                    <button key={a} onClick={() => setVarAnswer(item.id, v.id, a)}
                                                                                                        className={`px-2 py-1 rounded-lg text-xs font-bold border-2 transition-all ${ans === a
                                                                                                            ? a === 'si' ? 'bg-emerald-500 border-emerald-500 text-white'
                                                                                                                : a === 'no' ? 'bg-red-500 border-red-500 text-white'
                                                                                                                    : 'bg-slate-400 border-slate-400 text-white'
                                                                                                            : 'border-slate-200 text-slate-500 hover:border-slate-300 bg-white'}`}>
                                                                                                        {a === 'si' ? 'Sí' : a === 'no' ? 'No' : 'N/A'}
                                                                                                    </button>
                                                                                                ))}
                                                                                            </div>
                                                                                        </div>
                                                                                    );
                                                                                })}
                                                                            </div>
                                                                        ) : (
                                                                            <div className="flex items-center gap-3 p-3 bg-violet-50 border border-violet-200 rounded-xl">
                                                                                <p className="text-xs text-violet-700 flex-1">Sin criterios definidos. Genera preguntas de auditoría con IA para este requisito.</p>
                                                                                <button onClick={() => generateVariables(item)}
                                                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 text-white rounded-lg text-xs font-bold hover:bg-violet-700 transition-colors shrink-0">
                                                                                    <Sparkles size={12} /> Generar
                                                                                </button>
                                                                            </div>
                                                                        )}

                                                                        {/* Regenerate button */}
                                                                        {hasVars && !isLoadingV && !isGeneratingV && !isEditingV && (
                                                                            <button onClick={() => generateVariables(item)}
                                                                                className="mt-2 flex items-center gap-1 text-xs text-violet-500 hover:text-violet-700 transition-colors">
                                                                                <Sparkles size={11} /> Regenerar criterios
                                                                            </button>
                                                                        )}
                                                                    </div>

                                                                    {/* Divider */}
                                                                    <div className="border-t border-slate-100" />

                                                                    {/* Responsable */}
                                                                    <div>
                                                                        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase mb-1"><User size={11} /> Responsable</label>
                                                                        <input type="text" value={f?.responsible || ''}
                                                                            onChange={e => setFindingDetail(item.id, 'responsible', e.target.value)}
                                                                            placeholder="Nombre del responsable..."
                                                                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Evidencia encontrada</label>
                                                                        <textarea rows={2} value={f?.evidence || ''}
                                                                            onChange={e => setFindingDetail(item.id, 'evidence', e.target.value)}
                                                                            placeholder="Describe la evidencia observada..."
                                                                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Observaciones</label>
                                                                        <textarea rows={2} value={f?.observations || ''}
                                                                            onChange={e => setFindingDetail(item.id, 'observations', e.target.value)}
                                                                            placeholder="Observaciones adicionales..."
                                                                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
                                                                    </div>
                                                                    {isNC && (
                                                                        <div>
                                                                            <label className="block text-xs font-bold text-red-500 uppercase mb-1">Descripción de la No Conformidad</label>
                                                                            <textarea rows={2} value={f?.description || ''}
                                                                                onChange={e => setFindingDetail(item.id, 'description', e.target.value)}
                                                                                placeholder="Describe la no conformidad detectada..."
                                                                                className="w-full px-3 py-2 text-sm border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 resize-none" />
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

            {/* Sticky save */}
            <div className="sticky bottom-6 mt-5 flex justify-end">
                <button onClick={handleSave} disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 text-white rounded-xl font-bold shadow-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                    style={{ backgroundColor: accentColor }}>
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {saving ? 'Guardando...' : `Guardar (${evaluated}/${leafItems.length})`}
                </button>
            </div>

            {/* AI Opportunities Modal */}
            {showOpModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => { if (!generatingOps) setShowOpModal(false); }} />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                                    <Sparkles size={16} className="text-violet-600" />
                                </div>
                                <div>
                                    <h2 className="font-black text-slate-900 text-sm">Oportunidades de Mejora — IA</h2>
                                    <p className="text-xs text-slate-400">Generadas con base en los hallazgos de la auditoría</p>
                                </div>
                            </div>
                            {!generatingOps && (
                                <button onClick={() => setShowOpModal(false)}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors">
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        <div className="p-6">
                            {generatingOps ? (
                                <div className="text-center py-10">
                                    <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                                    <p className="font-semibold text-slate-700">Analizando hallazgos con IA...</p>
                                    <p className="text-sm text-slate-400 mt-1">Esto puede tomar unos segundos</p>
                                </div>
                            ) : opportunities.length === 0 ? (
                                <div className="text-center py-8 text-slate-400">
                                    <p>No se pudieron generar oportunidades. Intenta de nuevo.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <p className="text-sm text-slate-500">{opportunities.length} oportunidades identificadas para esta auditoría:</p>
                                    {opportunities.map((op, i) => (
                                        <div key={i} className="border border-slate-200 rounded-xl p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="w-5 h-5 bg-violet-100 text-violet-700 rounded-full text-xs font-black flex items-center justify-center shrink-0">{i + 1}</span>
                                                <span className="text-xs font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full">{op.area}</span>
                                            </div>
                                            <p className="text-sm font-semibold text-slate-800 mb-1">{op.oportunidad}</p>
                                            {op.beneficio && (
                                                <p className="text-xs text-slate-500 flex items-start gap-1">
                                                    <TrendingUp size={11} className="text-emerald-500 shrink-0 mt-0.5" /> {op.beneficio}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {!generatingOps && opportunities.length > 0 && (
                            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex gap-3 justify-end rounded-b-2xl">
                                <button onClick={() => setShowOpModal(false)}
                                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-100 transition-colors">
                                    Cerrar
                                </button>
                                <button onClick={generateOpportunities}
                                    className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-xl font-bold text-sm hover:bg-violet-700 transition-colors">
                                    <Sparkles size={14} /> Regenerar
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
