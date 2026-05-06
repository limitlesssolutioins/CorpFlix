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
    questions: Array<{ id: string; tipo: string; text: string; hint?: string }>;
}> = {
    calidad: {
        code: 'CALIDAD', name: 'Calidad', emoji: '🏆', color: '#3b82f6',
        tagline: 'Calidad del producto y servicio',
        questions: [
            {
                id: 'imagen', tipo: 'IMAGEN',
                text: '¿Tu empresa tiene trato directo con clientes y gestiona quejas, reclamos, cotizaciones o tiempos de respuesta?',
                hint: 'Riesgos de pérdida de clientes, mala imagen o credibilidad por fallas en la atención.',
            },
            {
                id: 'legalidad', tipo: 'LEGALIDAD',
                text: '¿Tu empresa debe cumplir requisitos legales, permisos, licencias o normativas para operar o participar en contratos?',
                hint: 'Incumplimientos pueden generar sanciones económicas, pérdida de contratos o problemas judiciales.',
            },
            {
                id: 'financiero', tipo: 'FINANCIERO',
                text: '¿En tu operación manejas fondos, documentos de valor económico, presupuestos o recursos financieros críticos?',
                hint: 'Riesgos de apropiación indebida, deterioro de documentos o falta de recursos para operar.',
            },
            {
                id: 'calidad', tipo: 'CALIDAD',
                text: '¿Tu empresa planifica el uso de sus recursos, documenta sus procesos y gestiona su dirección estratégica o sistema de calidad?',
                hint: 'Riesgos de reprocesos, incumplimiento a clientes, pérdida de mercado o documentación desactualizada.',
            },
            {
                id: 'tecnologia', tipo: 'TECNOLOGÍA',
                text: '¿Utilizas software, maquinaria, equipos electrónicos o sistemas tecnológicos esenciales para tu operación diaria?',
                hint: 'La obsolescencia o falla de estos sistemas puede paralizar la operación o afectar la calidad del servicio.',
            },
        ]
    },
    sst: {
        code: 'SST', name: 'SST', emoji: '🦺', color: '#f59e0b',
        tagline: 'Seguridad y Salud en el Trabajo',
        questions: [
            {
                id: 'biologico', tipo: 'BIOLÓGICO',
                text: '¿El personal tiene contacto con personas externas, fluidos corporales, animales, vegetación de campo o alimentos en su trabajo?',
                hint: 'Exposición a virus, bacterias, hongos, picaduras o mordeduras que pueden causar enfermedades.',
            },
            {
                id: 'biomecanico', tipo: 'BIOMECÁNICO',
                text: '¿Las labores implican levantar cargas, esfuerzos físicos, movimientos repetitivos o mantener posturas incómodas por largo tiempo?',
                hint: 'Lesiones músculo-esqueléticas, fatiga, alteraciones lumbares, cervicales o del sistema vascular.',
            },
            {
                id: 'fenomenos', tipo: 'FENÓMENOS NATURALES',
                text: '¿La empresa opera en zonas o realiza actividades expuestas a lluvias fuertes, inundaciones, sismos, tormentas eléctricas o vendavales?',
                hint: 'Riesgo de arroyos, derrumbes, inundaciones u otros eventos naturales que afecten al personal.',
            },
            {
                id: 'fisico', tipo: 'FÍSICO',
                text: '¿Hay exposición a ruido intenso, temperaturas extremas (frío o calor), mala iluminación, radiaciones o vibraciones en el trabajo?',
                hint: 'Daño auditivo, estrés térmico, fatiga visual, trastornos por vibración o presión atmosférica anormal.',
            },
            {
                id: 'psicosocial', tipo: 'PSICOSOCIAL',
                text: '¿El trabajo implica turnos nocturnos, horas extra, alta carga emocional, exigencia de responsabilidades o relaciones de conflicto?',
                hint: 'Estrés laboral, ansiedad, depresión o enfermedades psicosomáticas por demandas laborales excesivas.',
            },
            {
                id: 'publico', tipo: 'PÚBLICO',
                text: '¿Los empleados trabajan en la calle, atienden público de forma directa o realizan actividades en lugares de acceso abierto?',
                hint: 'Riesgo de agresiones de usuarios, asaltos, hurtos o situaciones de orden público.',
            },
            {
                id: 'quimico', tipo: 'QUÍMICO',
                text: '¿Se usan, almacenan o transportan productos químicos, gases, solventes, combustibles, polvos o aerosoles en la operación?',
                hint: 'Intoxicaciones, irritaciones, quemaduras químicas, explosiones o enfermedades respiratorias.',
            },
            {
                id: 'seguridad', tipo: 'SEGURIDAD',
                text: '¿Existen riesgos de caídas, cortes, golpes, choques eléctricos, trabajo en alturas, con maquinaria o accidentes de tránsito?',
                hint: 'Accidentes locativos, mecánicos, eléctricos, de tránsito o en espacios confinados.',
            },
        ]
    },
    ambiental: {
        code: 'AMBIENTAL', name: 'Ambiental', emoji: '🌿', color: '#10b981',
        tagline: 'Impacto ambiental',
        questions: [
            {
                id: 'agua', tipo: 'AGUA',
                text: '¿En tu operación se consume agua o se generan aguas residuales domésticas o industriales (baños, aseo, procesos productivos)?',
                hint: 'Riesgos de consumo excesivo, fugas, aguas residuales o impacto en fuentes hídricas cercanas.',
            },
            {
                id: 'derrames', tipo: 'SUELO / AGUA',
                text: '¿Se almacenan, transportan o usan sustancias como aceites, combustibles o químicos que puedan derramarse accidentalmente?',
                hint: 'Los derrames contaminan suelo y agua; generan sanciones ambientales y daños al ecosistema.',
            },
            {
                id: 'aire', tipo: 'AIRE',
                text: '¿Las actividades generan emisiones al aire como gases, material particulado, olores ofensivos, ruido ambiental o vapores?',
                hint: 'Fuentes fijas (chimeneas) o móviles (vehículos), gases efecto invernadero, ruido que afecte comunidades.',
            },
            {
                id: 'residuos', tipo: 'SUELO / RESIDUOS',
                text: '¿Se generan residuos sólidos de cualquier tipo: ordinarios, aprovechables, especiales o peligrosos (baterías, tóner, EPP contaminados, equipos)?',
                hint: 'Residuos mal gestionados contaminan el suelo y generan multas por incumplimiento ambiental.',
            },
            {
                id: 'energia', tipo: 'ENERGÍA',
                text: '¿Existe consumo significativo de energía eléctrica, gas natural u otros combustibles fósiles en la operación?',
                hint: 'Agotamiento de recursos naturales y huella de carbono asociada al consumo energético.',
            },
            {
                id: 'ecosistema', tipo: 'FLORA / FAUNA / PAISAJE',
                text: '¿Las actividades de tu empresa pueden afectar zonas verdes, cobertura vegetal, fauna silvestre, paisaje o ecosistemas cercanos?',
                hint: 'Impactos en biodiversidad, alteración del paisaje o afectación de hábitats naturales próximos.',
            },
        ]
    },
    ciberseguridad: {
        code: 'CIBERSEGURIDAD', name: 'Ciberseguridad', emoji: '🔒', color: '#8b5cf6',
        tagline: 'Seguridad de la información',
        questions: [
            {
                id: 'datos', tipo: 'DATOS SENSIBLES',
                text: '¿Manejas información confidencial de clientes, empleados o datos financieros almacenados en sistemas digitales?',
                hint: 'Bases de datos, nóminas, contratos digitales o registros con información personal o estratégica.',
            },
            {
                id: 'acceso', tipo: 'CONTROL DE ACCESO',
                text: '¿El acceso a tus sistemas se controla con contraseñas seguras y perfiles de usuario, sin compartir credenciales entre empleados?',
                hint: 'Contraseñas débiles o compartidas permiten accesos no autorizados a información crítica.',
            },
            {
                id: 'amenazas', tipo: 'AMENAZAS EXTERNAS',
                text: '¿Tu equipo usa correo electrónico, internet o redes sociales para trabajar, recibiendo archivos o enlaces externos?',
                hint: 'Phishing, malware, ransomware o ingeniería social a través de comunicaciones digitales.',
            },
            {
                id: 'continuidad', tipo: 'CONTINUIDAD DIGITAL',
                text: '¿Realizas copias de seguridad periódicas de tu información crítica y puedes recuperarla ante una falla o pérdida de datos?',
                hint: 'Sin backups, una falla o ataque puede significar la pérdida definitiva de información vital.',
            },
            {
                id: 'terceros', tipo: 'ACCESO DE TERCEROS',
                text: '¿Proveedores, técnicos externos, contadores o asesores tienen acceso a tus sistemas, redes o datos empresariales?',
                hint: 'Acceso externo no controlado puede comprometer la confidencialidad o integridad de la información.',
            },
        ]
    },
    financiero: {
        code: 'FINANCIERO', name: 'Financiero', emoji: '💰', color: '#ef4444',
        tagline: 'Estabilidad financiera',
        questions: [
            {
                id: 'cartera', tipo: 'CARTERA',
                text: '¿Tienes clientes que te pagan a crédito, a plazos o que han presentado retrasos en sus pagos?',
                hint: 'Cartera vencida que afecta el flujo de caja y la capacidad de cumplir tus propias obligaciones.',
            },
            {
                id: 'liquidez', tipo: 'LIQUIDEZ',
                text: '¿Dependes de flujo de caja regular para cubrir nómina, proveedores, arriendo u otras obligaciones fijas mensuales?',
                hint: 'Si los ingresos se retrasan, ¿tienes dificultades para pagar tus compromisos a tiempo?',
            },
            {
                id: 'concentracion', tipo: 'CONCENTRACIÓN',
                text: '¿Tus ingresos dependen principalmente de uno o muy pocos clientes o contratos que representen más del 30% de tus ventas?',
                hint: 'La pérdida de ese cliente o contrato tendría un impacto grave e inmediato en tu empresa.',
            },
            {
                id: 'tributario', tipo: 'TRIBUTARIO',
                text: '¿Tienes obligaciones tributarias, declaraciones de impuestos, retenciones o aportes de seguridad social que deban gestionarse periódicamente?',
                hint: 'Errores u omisiones generan sanciones, intereses de mora y problemas con los entes de control.',
            },
            {
                id: 'fraude', tipo: 'FRAUDE / PÉRDIDA',
                text: '¿Existe riesgo o han ocurrido pérdidas por fraudes, robos, errores contables, faltantes de inventario o conductas deshonestas?',
                hint: 'Empleados deshonestos, errores de caja, robo de activos o irregularidades en el manejo de recursos.',
            },
        ]
    },
    'seguridad-vial': {
        code: 'SEGURIDAD_VIAL', name: 'Seguridad Vial', emoji: '🚗', color: '#06b6d4',
        tagline: 'Seguridad en el transporte',
        questions: [
            {
                id: 'flota', tipo: 'FLOTA VEHICULAR',
                text: '¿Tu empresa usa vehículos propios o contratados para transportar personas, materiales o equipos como parte habitual de la operación?',
                hint: 'El uso regular de vehículos en la operación expone a la empresa a riesgos de accidentes de tránsito.',
            },
            {
                id: 'conductores', tipo: 'CONDUCTORES',
                text: '¿Los conductores realizan viajes largos, en horario nocturno, bajo presión de tiempo o sin entrenamiento formal en manejo seguro?',
                hint: 'Fatiga, exceso de velocidad, conducción bajo presión o sin capacitación aumentan el riesgo de accidentes.',
            },
            {
                id: 'mantenimiento', tipo: 'MANTENIMIENTO',
                text: '¿Los vehículos tienen un programa de mantenimiento preventivo documentado y se verifica su estado antes de cada uso?',
                hint: 'La falta de revisiones periódicas provoca fallas mecánicas que pueden causar accidentes graves.',
            },
            {
                id: 'normativa', tipo: 'NORMATIVA VIAL',
                text: '¿Los conductores y vehículos tienen al día licencias, documentos, revisión técnico-mecánica y SOAT vigentes?',
                hint: 'Incumplir la normativa vial genera multas, inmovilizaciones y responsabilidad legal ante accidentes.',
            },
            {
                id: 'condiciones', tipo: 'CONDICIONES DE RUTA',
                text: '¿Los vehículos circulan por vías en mal estado, zonas de alto riesgo, en condiciones climáticas adversas o transportan cargas especiales?',
                hint: 'Vías peligrosas, lluvia intensa, derrumbes o cargas indebidas incrementan el riesgo de accidentes.',
            },
        ]
    },
};

// ─── Types ────────────────────────────────────────────────────────────
type WizardStep = 'intro' | 'questions' | 'generating' | 'review' | 'action_plans' | 'saving' | 'done';

interface WizardAnswer { questionId: string; tipo: string; question: string; answer: 'si' | 'no'; }

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
        const newAnswers = [...answers, { questionId: q.id, tipo: q.tipo, question: q.text, answer }];
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
                                    Teniendo en cuenta los posibles <strong>peligros y riesgos</strong> que se presentan
                                    en las empresas, te haremos unas preguntas para identificar cuáles aplican
                                    a tu operación.
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
                                    <span className="inline-block text-xs font-black px-3 py-1 rounded-full text-white mb-3"
                                        style={{ backgroundColor: color }}>
                                        {config.questions[questionIdx].tipo}
                                    </span>
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
