'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft, Plus, AlertTriangle, CheckCircle2, X, ChevronRight,
    Sparkles, Send, RotateCcw, Shield, Clock, TrendingUp
} from 'lucide-react';

// ─── Category config ────────────────────────────────────────────────
const CATEGORY_CONFIG: Record<string, {
    code: string; name: string; emoji: string; color: string;
    tagline: string;
    questions: Array<{ id: string; text: string; hint?: string }>;
}> = {
    calidad: {
        code: 'CALIDAD', name: 'Calidad', emoji: '🏆', color: '#3b82f6',
        tagline: 'Calidad del producto y servicio',
        questions: [
            { id: 'q1', text: '¿Has recibido quejas, reclamos o devoluciones de clientes en el último año?', hint: 'Por ejemplo: clientes insatisfechos, solicitudes de cambio o devoluciones de dinero.' },
            { id: 'q2', text: '¿Dependes de proveedores o contratistas para fabricar o entregar tu producto o servicio?', hint: 'Si falla un proveedor clave, ¿tu empresa no puede operar?' },
            { id: 'q3', text: '¿Los procesos y tareas de tu empresa están documentados y el personal los sigue de forma consistente?' },
            { id: 'q4', text: '¿Ha habido errores o fallas en tu producto o servicio que llegaron al cliente?', hint: 'Errores de calidad, entregas tardías, productos defectuosos.' },
            { id: 'q5', text: '¿Utilizas sistemas, software o tecnología importante para tu operación diaria?', hint: 'Por ejemplo: software de facturación, inventario, producción, etc.' },
            { id: 'q6', text: '¿Tu empresa requiere permisos, licencias o debe cumplir normativas oficiales para operar?', hint: 'Certificaciones, normas técnicas, permisos de funcionamiento.' },
        ]
    },
    sst: {
        code: 'SST', name: 'SST', emoji: '🦺', color: '#f59e0b',
        tagline: 'Seguridad y Salud en el Trabajo',
        questions: [
            { id: 'q1', text: '¿Tus empleados realizan tareas con esfuerzo físico, levantamiento de cargas o movimientos repetitivos?', hint: 'Por ejemplo: cargar objetos pesados, usar herramientas manuales, trabajar de pie mucho tiempo.' },
            { id: 'q2', text: '¿Existe riesgo de caídas, golpes, cortes o atrapamientos en el lugar de trabajo?', hint: 'Pisos resbalosos, alturas, maquinaria, espacios reducidos.' },
            { id: 'q3', text: '¿Se trabaja con equipos eléctricos, maquinaria pesada o herramientas de riesgo?', hint: 'Soldadura, sierras, equipos de presión, instalaciones eléctricas.' },
            { id: 'q4', text: '¿El trabajo genera estrés, presión mental alta, carga emocional o situaciones de conflicto?', hint: 'Atención al público difícil, presión por metas, trabajo bajo presión.' },
            { id: 'q5', text: '¿Se trabaja con químicos, gases, humos, polvo o en condiciones de temperatura extrema?', hint: 'Soldadura, pintura, limpieza con ácidos, hornos, cuartos fríos.' },
            { id: 'q6', text: '¿Tu empresa tiene un plan de emergencias actualizado y el personal lo conoce?', hint: 'Simulacros de evacuación, puntos de encuentro, primeros auxilios.' },
        ]
    },
    ambiental: {
        code: 'AMBIENTAL', name: 'Ambiental', emoji: '🌿', color: '#10b981',
        tagline: 'Impacto ambiental',
        questions: [
            { id: 'q1', text: '¿Tu empresa genera residuos sólidos, líquidos o peligrosos durante su operación?', hint: 'Basura, aceites, envases químicos, aguas residuales.' },
            { id: 'q2', text: '¿Consumes agua en tus procesos productivos o de limpieza?', hint: 'Lavado, refrigeración, producción, servicios sanitarios.' },
            { id: 'q3', text: '¿Tu operación genera ruido, olores, vapores, polvo o emisiones al ambiente?', hint: 'Maquinaria ruidosa, chimeneas, hornos, generadores.' },
            { id: 'q4', text: '¿Tu empresa consume energía eléctrica o combustibles de manera significativa?', hint: 'Maquinaria, vehículos, climatización, iluminación.' },
            { id: 'q5', text: '¿Tus actividades podrían afectar a comunidades vecinas, ecosistemas o zonas naturales cercanas?', hint: 'Ruido que molesta vecinos, descargas cerca de ríos, olores.' },
        ]
    },
    ciberseguridad: {
        code: 'CIBERSEGURIDAD', name: 'Ciberseguridad', emoji: '🔒', color: '#8b5cf6',
        tagline: 'Seguridad de la información',
        questions: [
            { id: 'q1', text: '¿Manejas información confidencial de clientes, empleados o datos financieros en sistemas digitales?', hint: 'Bases de datos de clientes, nóminas, estados financieros, contratos.' },
            { id: 'q2', text: '¿Tu equipo usa correo electrónico, redes sociales o navega en internet para trabajar?', hint: 'Casi siempre esto abre la puerta a correos fraudulentos o virus.' },
            { id: 'q3', text: '¿Las contraseñas de los sistemas son compartidas, no se cambian regularmente o no tienen reglas definidas?', hint: 'Contraseñas simples como "123456", compartidas entre compañeros.' },
            { id: 'q4', text: '¿NO realizas copias de seguridad (backups) periódicas de tu información importante?', hint: 'Si tu computador se daña o es secuestrado, ¿perderías todo?' },
            { id: 'q5', text: '¿Proveedores, técnicos u otras personas externas tienen acceso a tus sistemas o datos?', hint: 'Soporte técnico externo, contadores, asesores con acceso a sistemas.' },
        ]
    },
    financiero: {
        code: 'FINANCIERO', name: 'Financiero', emoji: '💰', color: '#ef4444',
        tagline: 'Estabilidad financiera',
        questions: [
            { id: 'q1', text: '¿Tienes clientes que te pagan a crédito, a plazos o que se han atrasado en sus pagos?', hint: 'Facturas a 30, 60 o 90 días; clientes morosos.' },
            { id: 'q2', text: '¿Necesitas flujo de caja regular para cubrir nómina, proveedores u otras obligaciones?', hint: 'Si los pagos se retrasan, ¿tienes problemas para pagar?' },
            { id: 'q3', text: '¿Tus ingresos dependen principalmente de uno o muy pocos clientes o contratos grandes?', hint: 'Si ese cliente se va, ¿representa más del 30% de tus ventas?' },
            { id: 'q4', text: '¿Tienes obligaciones tributarias, impuestos o multas pendientes o de difícil cumplimiento?', hint: 'IVA, retenciones, contribuciones, sanciones fiscales.' },
            { id: 'q5', text: '¿Han ocurrido pérdidas por fraudes, robos, errores contables o faltantes de inventario?', hint: 'Empleados deshonestos, errores en caja, robos de mercancía.' },
        ]
    },
    'seguridad-vial': {
        code: 'SEGURIDAD_VIAL', name: 'Seguridad Vial', emoji: '🚗', color: '#06b6d4',
        tagline: 'Seguridad en el transporte',
        questions: [
            { id: 'q1', text: '¿Tu empresa usa vehículos propios o arrendados para transportar personas, materiales o equipos?', hint: 'Camiones, furgonetas, motos, carros de la empresa.' },
            { id: 'q2', text: '¿Los conductores realizan viajes largos, en horario nocturno o bajo presión de tiempo?', hint: 'Entregas urgentes, rutas de más de 2 horas, turnos nocturnos.' },
            { id: 'q3', text: '¿Los vehículos cuentan con mantenimiento preventivo programado y documentado?', hint: 'Revisiones periódicas de frenos, llantas, aceite, luces.' },
            { id: 'q4', text: '¿Los conductores han recibido capacitación en manejo seguro y normas de tránsito?', hint: 'Cursos de conducción, primeros auxilios viales, normas de seguridad.' },
            { id: 'q5', text: '¿Se controla que los conductores no manejen con cansancio, bajo efectos del alcohol u otras sustancias?', hint: 'Pruebas de alcoholemia, control de horas de conducción, descanso.' },
        ]
    },
};

// ─── Types ────────────────────────────────────────────────────────────
type WizardStep = 'intro' | 'questions' | 'generating' | 'review' | 'action_plans' | 'saving' | 'done';

interface WizardAnswer { questionId: string; question: string; answer: 'si' | 'no'; }

interface GeneratedRisk {
    type: string; description: string; caused_by: string;
    impact: string; probability: number; consequence: number;
    suggested_action: string;
}

interface AcceptedRisk extends GeneratedRisk {
    accepted: boolean;
    action_responsible: string;
    action_date: string;
    action_description: string;
}

interface ExistingRisk {
    id: number; description: string; type: string; status: string;
    category_name: string; category_color: string;
    inherent_risk_level?: string; residual_risk_level?: string;
    acceptability?: string; probability?: number; consequence?: number; inherent_risk?: number;
}

const RISK_LEVEL_STYLE: Record<string, string> = {
    'NO ACEPTABLE': 'bg-red-100 text-red-700 border-red-200',
    'ALERTA': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'ACEPTABLE': 'bg-green-100 text-green-700 border-green-200',
};

function getRiskScore(p: number, c: number) { return p * c; }
function getRiskLabel(score: number) {
    if (score >= 16) return { label: 'Muy Alto', color: '#ef4444' };
    if (score >= 9) return { label: 'Medio', color: '#f59e0b' };
    return { label: 'Bajo', color: '#10b981' };
}

// ─── Main Component ──────────────────────────────────────────────────
export default function CategoryPage() {
    const params = useParams();
    const slug = params.category as string;
    const config = CATEGORY_CONFIG[slug];

    const [existingRisks, setExistingRisks] = useState<ExistingRisk[]>([]);
    const [loadingRisks, setLoadingRisks] = useState(true);
    const [showWizard, setShowWizard] = useState(false);

    // Wizard state
    const [wizardStep, setWizardStep] = useState<WizardStep>('intro');
    const [questionIdx, setQuestionIdx] = useState(0);
    const [answers, setAnswers] = useState<WizardAnswer[]>([]);
    const [generatedRisks, setGeneratedRisks] = useState<GeneratedRisk[]>([]);
    const [reviewIdx, setReviewIdx] = useState(0);
    const [acceptedRisks, setAcceptedRisks] = useState<AcceptedRisk[]>([]);
    const [actionPlanIdx, setActionPlanIdx] = useState(0);
    const [saveResult, setSaveResult] = useState<{ created: number } | null>(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [animDir, setAnimDir] = useState<'in' | 'out'>('in');

    useEffect(() => {
        if (!config) return;
        loadExistingRisks();
    }, [slug]);

    const loadExistingRisks = async () => {
        setLoadingRisks(true);
        try {
            const res = await fetch(`/api/riesgos/risks?category_code=${config.code}`);
            const data = await res.json();
            setExistingRisks(Array.isArray(data) ? data : []);
        } catch { setExistingRisks([]); }
        finally { setLoadingRisks(false); }
    };

    const resetWizard = () => {
        setWizardStep('intro');
        setQuestionIdx(0);
        setAnswers([]);
        setGeneratedRisks([]);
        setReviewIdx(0);
        setAcceptedRisks([]);
        setActionPlanIdx(0);
        setSaveResult(null);
        setErrorMsg('');
    };

    const openWizard = () => { resetWizard(); setShowWizard(true); };
    const closeWizard = () => { setShowWizard(false); resetWizard(); };

    // ── Wizard logic ──
    const handleAnswer = (answer: 'si' | 'no') => {
        const q = config.questions[questionIdx];
        const newAnswers = [...answers, { questionId: q.id, question: q.text, answer }];
        setAnswers(newAnswers);

        if (questionIdx < config.questions.length - 1) {
            setAnimDir('out');
            setTimeout(() => {
                setQuestionIdx(i => i + 1);
                setAnimDir('in');
            }, 200);
        } else {
            generateRisks(newAnswers);
        }
    };

    const generateRisks = async (finalAnswers: WizardAnswer[]) => {
        setWizardStep('generating');
        setErrorMsg('');
        try {
            const res = await fetch('/api/riesgos/wizard', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ categoryCode: config.code, answers: finalAnswers }),
            });
            const data = await res.json();
            if (!res.ok || !data.risks) throw new Error(data.error || 'Error');
            setGeneratedRisks(data.risks);
            setReviewIdx(0);
            setWizardStep('review');
        } catch (e: any) {
            setErrorMsg(e.message || 'Error generando riesgos. Intenta de nuevo.');
            setWizardStep('questions');
            setQuestionIdx(config.questions.length - 1);
        }
    };

    const handleReviewDecision = (accepted: boolean) => {
        const risk = generatedRisks[reviewIdx];
        if (accepted) {
            setAcceptedRisks(prev => [...prev, {
                ...risk, accepted: true,
                action_responsible: '', action_date: '', action_description: risk.suggested_action,
            }]);
        }
        if (reviewIdx < generatedRisks.length - 1) {
            setReviewIdx(i => i + 1);
        } else {
            // After review: go to action plans for accepted high risks, or save directly
            const finalAccepted = accepted
                ? [...acceptedRisks, { ...risk, accepted: true, action_responsible: '', action_date: '', action_description: risk.suggested_action }]
                : acceptedRisks;
            const highRisks = finalAccepted.filter(r => getRiskScore(r.probability, r.consequence) >= 9);
            if (highRisks.length > 0) {
                setAcceptedRisks(finalAccepted);
                setActionPlanIdx(0);
                setWizardStep('action_plans');
            } else {
                setAcceptedRisks(finalAccepted);
                saveRisks(finalAccepted);
            }
        }
    };

    const updateActionPlan = (field: 'action_responsible' | 'action_date' | 'action_description', value: string) => {
        setAcceptedRisks(prev => prev.map((r, i) => i === actionPlanIdx ? { ...r, [field]: value } : r));
    };

    const handleNextActionPlan = () => {
        if (actionPlanIdx < acceptedRisks.length - 1) {
            setActionPlanIdx(i => i + 1);
        } else {
            saveRisks(acceptedRisks);
        }
    };

    const saveRisks = async (risks: AcceptedRisk[]) => {
        if (risks.length === 0) { setWizardStep('done'); setSaveResult({ created: 0 }); return; }
        setWizardStep('saving');
        const today = new Date().toISOString().split('T')[0];
        let created = 0;
        try {
            for (const r of risks) {
                // 1. Create risk
                const riskRes = await fetch('/api/riesgos/risks', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ category_code: config.code, type: r.type, description: r.description, caused_by: r.caused_by, impact: r.impact, status: 'ACTIVE' }),
                });
                if (!riskRes.ok) continue;
                const newRisk = await riskRes.json();

                // 2. Create assessment
                const assRes = await fetch('/api/riesgos/assessments', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ risk_id: newRisk.id, assessment_date: today, probability: r.probability, consequence: r.consequence }),
                });
                if (!assRes.ok) continue;
                const newAss = await assRes.json();

                // 3. Create action plan if score >= 9
                const score = getRiskScore(r.probability, r.consequence);
                if (score >= 9 && r.action_description) {
                    const targetDate = r.action_date || (() => {
                        const d = new Date(); d.setDate(d.getDate() + 60);
                        return d.toISOString().split('T')[0];
                    })();
                    await fetch('/api/riesgos/action-plans', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            assessment_id: newAss.id,
                            action_description: r.action_description,
                            responsible: r.action_responsible || undefined,
                            start_date: today, target_date: targetDate,
                            status: 'PENDING', progress: 0,
                        }),
                    });
                }
                created++;
            }
            setSaveResult({ created });
            setWizardStep('done');
            loadExistingRisks();
        } catch {
            setErrorMsg('Error al guardar los riesgos. Intenta de nuevo.');
            setWizardStep('action_plans');
        }
    };

    // ─── Render helpers ───────────────────────────────────────────────
    if (!config) return (
        <div className="max-w-2xl mx-auto text-center py-20">
            <p className="text-slate-500">Categoría no encontrada: {slug}</p>
            <Link href="/riesgos" className="mt-4 inline-block text-blue-600 font-semibold">← Volver</Link>
        </div>
    );

    const color = config.color;
    const criticalCount = existingRisks.filter(r => r.acceptability === 'NO ACEPTABLE').length;

    return (
        <div className="max-w-5xl mx-auto">
            {/* Back */}
            <Link href="/riesgos" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold mb-5 transition-colors">
                <ArrowLeft size={20} /> Volver a Riesgos
            </Link>

            {/* Header */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-6 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl" style={{ backgroundColor: color + '18' }}>
                        {config.emoji}
                    </div>
                    <div>
                        <div className="text-xs font-black uppercase tracking-widest mb-0.5" style={{ color }}>{config.tagline}</div>
                        <h1 className="text-2xl font-black text-slate-900">Riesgos de {config.name}</h1>
                        <p className="text-sm text-slate-400 mt-0.5">{existingRisks.length} riesgos identificados{criticalCount > 0 ? ` · ${criticalCount} críticos` : ''}</p>
                    </div>
                </div>
                <button
                    onClick={openWizard}
                    className="flex items-center gap-2 px-5 py-3 text-white rounded-xl font-bold shadow-sm hover:opacity-90 transition-all hover:shadow-md"
                    style={{ backgroundColor: color }}
                >
                    <Sparkles size={18} /> Identificar Riesgos
                </button>
            </div>

            {/* Existing risks */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="font-bold text-slate-900">Riesgos Identificados</h2>
                    <Link href={`/riesgos/evaluacion`} className="text-sm font-semibold" style={{ color }}>
                        Evaluar riesgos →
                    </Link>
                </div>

                {loadingRisks ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: color + '40', borderTopColor: 'transparent' }} />
                    </div>
                ) : existingRisks.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-5xl mb-4">{config.emoji}</div>
                        <h3 className="text-lg font-bold text-slate-700 mb-2">Aún no hay riesgos en esta categoría</h3>
                        <p className="text-slate-400 mb-6 max-w-xs mx-auto">Usa el asistente para identificar los riesgos que aplican a tu empresa — son preguntas simples.</p>
                        <button onClick={openWizard}
                            className="inline-flex items-center gap-2 px-5 py-3 text-white rounded-xl font-bold"
                            style={{ backgroundColor: color }}>
                            <Sparkles size={16} /> Identificar mis primeros riesgos
                        </button>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {existingRisks.map(risk => {
                            const score = (risk.probability || 0) * (risk.consequence || 0);
                            const level = score > 0 ? getRiskLabel(score) : null;
                            return (
                                <div key={risk.id} className="p-4 hover:bg-slate-50/50 transition-colors">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <span className="text-xs font-bold px-2 py-0.5 rounded-full border"
                                                    style={{ backgroundColor: color + '15', color, borderColor: color + '40' }}>
                                                    {risk.type}
                                                </span>
                                                {risk.acceptability && (
                                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${RISK_LEVEL_STYLE[risk.acceptability] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                                                        {risk.acceptability}
                                                    </span>
                                                )}
                                                {level && (
                                                    <span className="text-xs font-semibold" style={{ color: level.color }}>
                                                        {score} pts · {level.label}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm font-semibold text-slate-800">{risk.description}</p>
                                        </div>
                                        <Link href={`/riesgos/evaluacion?risk_id=${risk.id}`}
                                            className="shrink-0 text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all font-semibold">
                                            Evaluar
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ─── WIZARD OVERLAY ─────────────────────────────────────── */}
            {showWizard && (
                <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeWizard} />
                    <div className="relative w-full md:max-w-lg bg-white rounded-t-3xl md:rounded-3xl shadow-2xl max-h-[92vh] overflow-y-auto">

                        {/* Wizard header */}
                        <div className="sticky top-0 bg-white rounded-t-3xl z-10 px-6 pt-5 pb-4 border-b border-slate-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">{config.emoji}</span>
                                    <span className="font-bold text-slate-900 text-sm">Riesgos de {config.name}</span>
                                </div>
                                <button onClick={closeWizard} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                                    <X size={16} className="text-slate-600" />
                                </button>
                            </div>
                            {/* Progress bar */}
                            {wizardStep === 'questions' && (
                                <div className="mt-3">
                                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                                        <span>Pregunta {questionIdx + 1} de {config.questions.length}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                                        <div className="h-1.5 rounded-full transition-all duration-500"
                                            style={{ width: `${((questionIdx + 1) / config.questions.length) * 100}%`, backgroundColor: color }} />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ── INTRO ── */}
                        {wizardStep === 'intro' && (
                            <div className="p-6 text-center">
                                <div className="text-5xl mb-4">{config.emoji}</div>
                                <h2 className="text-xl font-black text-slate-900 mb-3">Identificar riesgos de {config.name}</h2>
                                <p className="text-slate-500 mb-6 leading-relaxed">
                                    Te haré <strong>{config.questions.length} preguntas simples</strong> sobre tu empresa.
                                    Con tus respuestas generaré una lista de riesgos específicos para tu operación.
                                </p>
                                <div className="bg-slate-50 rounded-xl p-4 mb-6 text-left">
                                    <p className="text-xs font-bold text-slate-500 uppercase mb-2">¿Cómo funciona?</p>
                                    <div className="space-y-2">
                                        {['Responde sí o no a cada pregunta', 'La IA genera los riesgos que aplican', 'Revisas y aceptas cada uno', 'Definimos el plan de acción'].map((step, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <div className="w-6 h-6 rounded-full text-white text-xs font-black flex items-center justify-center shrink-0"
                                                    style={{ backgroundColor: color }}>{i + 1}</div>
                                                <span className="text-sm text-slate-600">{step}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <button onClick={() => setWizardStep('questions')}
                                    className="w-full py-4 text-white rounded-2xl font-black text-lg hover:opacity-90 transition-opacity"
                                    style={{ backgroundColor: color }}>
                                    Comenzar →
                                </button>
                            </div>
                        )}

                        {/* ── QUESTIONS ── */}
                        {wizardStep === 'questions' && (
                            <div className="p-6">
                                {errorMsg && (
                                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                                        {errorMsg}
                                    </div>
                                )}
                                <div style={{ animation: animDir === 'in' ? 'fadeSlideIn 0.25s ease' : 'fadeSlideOut 0.2s ease' }}>
                                    <p className="text-xl font-bold text-slate-900 mb-3 leading-snug">
                                        {config.questions[questionIdx].text}
                                    </p>
                                    {config.questions[questionIdx].hint && (
                                        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                                            💡 {config.questions[questionIdx].hint}
                                        </p>
                                    )}
                                    {!config.questions[questionIdx].hint && <div className="mb-6" />}
                                    <div className="grid grid-cols-2 gap-4">
                                        <button onClick={() => handleAnswer('si')}
                                            className="py-5 rounded-2xl border-2 border-emerald-300 bg-emerald-50 hover:bg-emerald-100 transition-all font-black text-emerald-700 text-lg hover:scale-105 hover:shadow-md">
                                            ✓ Sí
                                        </button>
                                        <button onClick={() => handleAnswer('no')}
                                            className="py-5 rounded-2xl border-2 border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all font-black text-slate-500 text-lg hover:scale-105 hover:shadow-md">
                                            ✗ No
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── GENERATING ── */}
                        {wizardStep === 'generating' && (
                            <div className="p-6 text-center py-16">
                                <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-6"
                                    style={{ borderColor: color + '40', borderTopColor: color }} />
                                <h3 className="text-lg font-bold text-slate-900 mb-2">Analizando tus respuestas...</h3>
                                <p className="text-slate-400 text-sm">Identificando los riesgos que aplican a tu empresa</p>
                            </div>
                        )}

                        {/* ── RISK REVIEW ── */}
                        {wizardStep === 'review' && generatedRisks.length > 0 && (
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-xs font-bold text-slate-400 uppercase">
                                        Riesgo {reviewIdx + 1} de {generatedRisks.length}
                                    </p>
                                    <div className="flex gap-1">
                                        {generatedRisks.map((_, i) => (
                                            <div key={i} className="w-2 h-2 rounded-full transition-all"
                                                style={{ backgroundColor: i <= reviewIdx ? color : '#e2e8f0' }} />
                                        ))}
                                    </div>
                                </div>

                                {(() => {
                                    const r = generatedRisks[reviewIdx];
                                    const score = getRiskScore(r.probability, r.consequence);
                                    const level = getRiskLabel(score);
                                    return (
                                        <div>
                                            <div className="rounded-2xl p-5 mb-4 border-2" style={{ backgroundColor: level.color + '10', borderColor: level.color + '40' }}>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="text-xs font-black px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: level.color }}>
                                                        {level.label} · {score} pts
                                                    </span>
                                                    <span className="text-xs font-bold text-slate-500">{r.type}</span>
                                                </div>
                                                <h3 className="font-black text-slate-900 text-base mb-3 leading-snug">{r.description}</h3>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex gap-2">
                                                        <span className="font-bold text-slate-500 shrink-0">¿Por qué?</span>
                                                        <span className="text-slate-700">{r.caused_by}</span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <span className="font-bold text-slate-500 shrink-0">Impacto:</span>
                                                        <span className="text-slate-700">{r.impact}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="text-sm font-bold text-slate-700 mb-2">¿Este riesgo aplica a tu empresa?</p>
                                            <div className="grid grid-cols-2 gap-3">
                                                <button onClick={() => handleReviewDecision(true)}
                                                    className="py-4 rounded-2xl border-2 border-emerald-400 bg-emerald-50 hover:bg-emerald-100 transition-all font-black text-emerald-700 text-base">
                                                    ✓ Incluir
                                                </button>
                                                <button onClick={() => handleReviewDecision(false)}
                                                    className="py-4 rounded-2xl border-2 border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all font-black text-slate-500 text-base">
                                                    → Saltar
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        )}

                        {/* ── ACTION PLANS ── */}
                        {wizardStep === 'action_plans' && acceptedRisks.length > 0 && (
                            <div className="p-6">
                                <div className="mb-4">
                                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">
                                        Plan de acción {actionPlanIdx + 1} de {acceptedRisks.length}
                                    </p>
                                    <h3 className="font-black text-slate-900 text-base leading-snug">
                                        {acceptedRisks[actionPlanIdx].description}
                                    </h3>
                                    {(() => {
                                        const r = acceptedRisks[actionPlanIdx];
                                        const score = getRiskScore(r.probability, r.consequence);
                                        const level = getRiskLabel(score);
                                        return (
                                            <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white mt-1 inline-block" style={{ backgroundColor: level.color }}>
                                                {level.label} · {score} pts
                                            </span>
                                        );
                                    })()}
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1.5">¿Qué harás para controlarlo?</label>
                                        <textarea rows={3}
                                            value={acceptedRisks[actionPlanIdx].action_description}
                                            onChange={e => updateActionPlan('action_description', e.target.value)}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                                            placeholder="Describe la acción concreta que tomarás..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1.5">¿Quién se encarga?</label>
                                        <input type="text"
                                            value={acceptedRisks[actionPlanIdx].action_responsible}
                                            onChange={e => updateActionPlan('action_responsible', e.target.value)}
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            placeholder="Nombre o cargo del responsable"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1.5">¿Cuándo debes tenerlo listo?</label>
                                        <input type="date"
                                            value={acceptedRisks[actionPlanIdx].action_date}
                                            onChange={e => updateActionPlan('action_date', e.target.value)}
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        />
                                    </div>
                                </div>

                                {errorMsg && <p className="text-sm text-red-600 mt-3">{errorMsg}</p>}

                                <button onClick={handleNextActionPlan}
                                    className="w-full mt-5 py-4 text-white rounded-2xl font-black text-base hover:opacity-90 transition-opacity"
                                    style={{ backgroundColor: color }}>
                                    {actionPlanIdx < acceptedRisks.length - 1 ? 'Siguiente riesgo →' : 'Guardar todos los riesgos'}
                                </button>
                            </div>
                        )}

                        {/* ── SAVING ── */}
                        {wizardStep === 'saving' && (
                            <div className="p-6 text-center py-16">
                                <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-6"
                                    style={{ borderColor: color + '40', borderTopColor: color }} />
                                <h3 className="text-lg font-bold text-slate-900">Guardando riesgos...</h3>
                            </div>
                        )}

                        {/* ── DONE ── */}
                        {wizardStep === 'done' && saveResult !== null && (
                            <div className="p-6 text-center">
                                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                                    style={{ backgroundColor: color + '20' }}>
                                    <CheckCircle2 className="w-8 h-8" style={{ color }} />
                                </div>
                                <h2 className="text-xl font-black text-slate-900 mb-2">
                                    {saveResult.created > 0 ? `¡${saveResult.created} riesgo${saveResult.created !== 1 ? 's' : ''} registrado${saveResult.created !== 1 ? 's' : ''}!` : '¡Listo!'}
                                </h2>
                                <p className="text-slate-500 mb-6 leading-relaxed text-sm">
                                    {saveResult.created > 0
                                        ? 'Los riesgos han sido guardados con sus planes de acción. Puedes evaluarlos y darles seguimiento desde tu perfil.'
                                        : 'No se seleccionaron riesgos para guardar. Puedes volver a identificarlos cuando quieras.'}
                                </p>

                                <div className="space-y-3">
                                    <button onClick={closeWizard}
                                        className="w-full py-3.5 text-white rounded-2xl font-bold hover:opacity-90"
                                        style={{ backgroundColor: color }}>
                                        Ver mis riesgos
                                    </button>
                                    <Link href="/riesgos/planes-accion"
                                        className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl border-2 border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                                        onClick={closeWizard}>
                                        <Clock size={16} /> Ver planes de acción
                                    </Link>
                                    <button onClick={() => {
                                        // Send to mejora continua
                                        const highRisks = acceptedRisks.filter(r => getRiskScore(r.probability, r.consequence) >= 9);
                                        Promise.all(highRisks.map(r =>
                                            fetch('/api/riesgos/send-to-mc', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({
                                                    riskDescription: r.description,
                                                    actionDescription: r.action_description,
                                                    responsible: r.action_responsible,
                                                    targetDate: r.action_date,
                                                    riskLevel: getRiskLabel(getRiskScore(r.probability, r.consequence)).label,
                                                    categoryName: config.name,
                                                }),
                                            })
                                        )).then(() => alert(`✅ ${highRisks.length} plan${highRisks.length !== 1 ? 'es' : ''} enviado${highRisks.length !== 1 ? 's' : ''} a Mejora Continua`));
                                    }}
                                        className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl border-2 font-bold transition-colors hover:bg-yellow-50"
                                        style={{ borderColor: '#f59e0b', color: '#d97706' }}>
                                        <Send size={16} /> Enviar a Mejora Continua
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeSlideIn {
                    from { opacity: 0; transform: translateX(30px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes fadeSlideOut {
                    from { opacity: 1; transform: translateX(0); }
                    to { opacity: 0; transform: translateX(-20px); }
                }
            `}</style>
        </div>
    );
}
