'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { FaSpinner } from 'react-icons/fa';
import { BrainCircuit, Activity, Home, CheckCircle } from 'lucide-react';
import bateriaFormaA from '@/data/bateria_forma_a.json';
import bateriaFormaB from '@/data/bateria_forma_b.json';
import bateriaExtralaboral from '@/data/bateria_extralaboral.json';
import bateriaEstres from '@/data/bateria_estres.json';

const OPTIONS = [
  { value: 4, label: 'Siempre', color: 'bg-red-500/10 text-red-500 border-red-500/20' },
  { value: 3, label: 'Casi Siempre', color: 'bg-orange-500/10 text-orange-500 border-orange-500/20' },
  { value: 2, label: 'A veces', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
  { value: 1, label: 'Casi Nunca', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  { value: 0, label: 'Nunca', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' }
];

export default function PublicEvaluationPage({ params }: { params: { token: string } }) {
  const [token, setToken] = useState<string>('');
  const [evaluacion, setEvaluacion] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pasos: consent -> intra -> extra -> estres -> success
  const [step, setStep] = useState<'consent' | 'intra' | 'extra' | 'estres' | 'success'>('consent');
  const [consentimiento, setConsentimiento] = useState(false);
  
  const [respuestasIntra, setRespuestasIntra] = useState<Record<string, number>>({});
  const [respuestasExtra, setRespuestasExtra] = useState<Record<string, number>>({});
  const [respuestasEstres, setRespuestasEstres] = useState<Record<string, number>>({});

  useEffect(() => {
    // Resolving React 15/Next.js promise-based params
    Promise.resolve(params).then(p => {
        setToken(p.token);
        fetchEvaluacion(p.token);
    });
  }, [params]);

  const fetchEvaluacion = async (t: string) => {
    try {
      const res = await axios.get(`/api/salud-mental/public/${t}`);
      setEvaluacion(res.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'No se pudo cargar la evaluación o ya fue completada.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step === 'consent') {
      if (!consentimiento) {
        toast.error('Debe aceptar el consentimiento para continuar');
        return;
      }
      setStep('intra');
      window.scrollTo(0,0);
    } else if (step === 'intra') {
      const intraQuestions = evaluacion?.formulario === 'A' ? bateriaFormaA : bateriaFormaB;
      if (Object.keys(respuestasIntra).length < intraQuestions.length) {
        toast.error(`Debe responder todas las preguntas (${Object.keys(respuestasIntra).length}/${intraQuestions.length})`);
        return;
      }
      setStep('extra');
      window.scrollTo(0,0);
    } else if (step === 'extra') {
      if (Object.keys(respuestasExtra).length < bateriaExtralaboral.length) {
        toast.error(`Debe responder todas las preguntas (${Object.keys(respuestasExtra).length}/${bateriaExtralaboral.length})`);
        return;
      }
      setStep('estres');
      window.scrollTo(0,0);
    } else if (step === 'estres') {
      if (Object.keys(respuestasEstres).length < bateriaEstres.length) {
        toast.error(`Debe responder todas las preguntas (${Object.keys(respuestasEstres).length}/${bateriaEstres.length})`);
        return;
      }
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios.post(`/api/salud-mental/public/${token}`, {
        consentimiento,
        respuestasIntralaboral: respuestasIntra,
        respuestasExtralaboral: respuestasExtra,
        respuestasEstres: respuestasEstres
      });
      setStep('success');
      window.scrollTo(0,0);
    } catch (err) {
      toast.error('Error al enviar las respuestas. Intente de nuevo.');
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <FaSpinner className="animate-spin text-4xl text-blue-500" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
        </div>
        <h2 className="text-xl font-bold mb-2 dark:text-white">Acceso Denegado</h2>
        <p className="text-gray-600 dark:text-gray-400">{error}</p>
      </div>
    </div>
  );

  const intraQuestions = evaluacion?.formulario === 'A' ? bateriaFormaA : bateriaFormaB;

  const renderQuestions = (questions: any[], answers: Record<string, number>, setAnswers: any) => {
    return (
      <div className="space-y-6 mt-6">
        {questions.map((q, idx) => (
          <div key={q.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-4">{q.id}. {q.text}</h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setAnswers((prev: any) => ({ ...prev, [q.id]: opt.value }))}
                  className={`p-2 rounded-lg text-sm font-medium transition-all ${
                    answers[q.id] === opt.value
                      ? `${opt.color} ring-2 ring-offset-1 dark:ring-offset-gray-800`
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-700/50 dark:text-gray-400 dark:hover:bg-gray-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
            <BrainCircuit size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lidus Evaluaciones</h1>
            <p className="text-gray-500 dark:text-gray-400">Batería de Riesgo Psicosocial - {evaluacion.empleadoNombre}</p>
          </div>
        </div>

        {/* Steps */}
        {step === 'success' ? (
          <div className="bg-white dark:bg-gray-800 p-12 rounded-2xl shadow-sm text-center">
            <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">¡Evaluación Completada!</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Tus respuestas han sido registradas de forma segura y confidencial.
            </p>
            <p className="text-gray-500 mt-2 text-sm">Ya puedes cerrar esta ventana.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            {step === 'consent' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold dark:text-white">Consentimiento Informado</h2>
                <div className="prose dark:prose-invert max-w-none bg-gray-50 dark:bg-gray-900 p-6 rounded-xl text-sm text-gray-600 dark:text-gray-400 h-64 overflow-y-auto">
                  <p>
                    El presente documento tiene como objetivo obtener su consentimiento para la aplicación de la Batería de Instrumentos para la Evaluación de Factores de Riesgo Psicosocial, de acuerdo con la Resolución 2646 de 2008 del Ministerio de la Protección Social de Colombia.
                  </p>
                  <p>
                    Su participación es voluntaria y la información recolectada será manejada bajo estricta confidencialidad por el profesional en psicología especialista en Seguridad y Salud en el Trabajo.
                  </p>
                  <p>
                    <strong>Declaración:</strong> Declaro que he sido informado sobre el propósito de esta evaluación y acepto de manera libre y voluntaria participar en ella.
                  </p>
                </div>
                <label className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 text-blue-600 rounded"
                    checked={consentimiento}
                    onChange={(e) => setConsentimiento(e.target.checked)}
                  />
                  <span className="font-medium text-blue-900 dark:text-blue-100">
                    Acepto el consentimiento informado y deseo continuar con la evaluación
                  </span>
                </label>
              </div>
            )}

            {step === 'intra' && (
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="text-blue-500" />
                  <h2 className="text-2xl font-bold dark:text-white">Factores Intralaborales</h2>
                </div>
                <p className="text-gray-500 dark:text-gray-400">Responda pensando en las condiciones de su trabajo actual.</p>
                {renderQuestions(intraQuestions, respuestasIntra, setRespuestasIntra)}
              </div>
            )}

            {step === 'extra' && (
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Home className="text-purple-500" />
                  <h2 className="text-2xl font-bold dark:text-white">Factores Extralaborales</h2>
                </div>
                <p className="text-gray-500 dark:text-gray-400">Responda pensando en su vida fuera del trabajo (familia, transporte, etc).</p>
                {renderQuestions(bateriaExtralaboral, respuestasExtra, setRespuestasExtra)}
              </div>
            )}

            {step === 'estres' && (
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <BrainCircuit className="text-rose-500" />
                  <h2 className="text-2xl font-bold dark:text-white">Evaluación de Estrés</h2>
                </div>
                <p className="text-gray-500 dark:text-gray-400">Indique con qué frecuencia ha presentado los siguientes síntomas en los últimos 3 meses.</p>
                {renderQuestions(bateriaEstres, respuestasEstres, setRespuestasEstres)}
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
              >
                {step === 'estres' ? 'Enviar Evaluación' : 'Continuar'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
