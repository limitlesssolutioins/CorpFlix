'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { FaSpinner } from 'react-icons/fa';
import { BrainCircuit, Activity, Home, Search, FileText, CheckCircle } from 'lucide-react';

const QUESTIONNAIRES = [
  {
    id: 'intralaboral',
    title: 'Cuestionario Intralaboral',
    icon: Activity,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    description: 'Evalúa factores de riesgo dentro del entorno de trabajo (carga mental, condiciones, liderazgo).',
    questions: [
      'Las condiciones de mi lugar de trabajo (ruido, iluminación, ventilación) son incómodas o deficientes.',
      'Mi trabajo me exige un esfuerzo físico excesivo.',
      'Tengo demasiadas cosas que hacer en muy poco tiempo.',
      'Me exigen resultados que son difíciles de alcanzar.',
      'Recibo órdenes contradictorias de mis diferentes jefes o superiores.',
      'Mi jefe o superior inmediato es irrespetuoso al comunicarse conmigo.',
      'Siento que mi trabajo me genera un desgaste emocional importante.',
      'Me siento aislado(a) o sin apoyo por parte de mis compañeros de trabajo.',
      'La empresa me brinda oportunidades para aprender y desarrollarme.',
      'Me siento seguro(a) y estable en mi puesto de trabajo actual.'
    ]
  },
  {
    id: 'extralaboral',
    title: 'Cuestionario Extralaboral',
    icon: Home,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    description: 'Evalúa factores fuera del trabajo que pueden afectar la salud (transporte, economía, familia).',
    questions: [
      'Tengo dificultades o tardo mucho tiempo en trasladarme desde mi casa al trabajo.',
      'La zona donde vivo me resulta insegura o peligrosa.',
      'Tengo responsabilidades familiares pesadas (cuidado de niños, adultos mayores, enfermos).',
      'Los problemas o conflictos familiares afectan mi estado de ánimo en el trabajo.',
      'Los ingresos económicos de mi hogar alcanzan para cubrir las necesidades básicas.',
      'Tengo deudas o compromisos financieros que me generan gran preocupación.',
      'El tiempo libre que me queda después del trabajo es suficiente para descansar.',
      'Participo en actividades recreativas, deportivas o sociales en mi tiempo libre.',
      'Cuento con el apoyo de mi familia para resolver mis problemas personales.',
      'Mi entorno familiar o vecinal me permite descansar adecuadamente cuando estoy en casa.'
    ]
  },
  {
    id: 'estres',
    title: 'Evaluación del Estrés',
    icon: BrainCircuit,
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
    description: 'Cuestionario de síntomas para evaluar el nivel de estrés fisiológico, mental y emocional.',
    questions: [
      '¿Con qué frecuencia ha sentido dolores de cabeza frecuentes o migrañas en los últimos 3 meses?',
      '¿Ha tenido problemas estomacales (acidez, indigestión, colon irritable)?',
      '¿Ha sentido tensión, dolor muscular o calambres en el cuello o la espalda?',
      '¿Ha tenido dificultades para quedarse dormido(a) o su sueño se interrumpe constantemente?',
      '¿Se ha sentido inusualmente cansado(a) o fatigado(a) sin razón aparente?',
      '¿Ha experimentado palpitaciones, taquicardia o sensación de ahogo?',
      '¿Ha tenido dificultades para concentrarse en sus tareas diarias?',
      '¿Se ha sentido irritable, de mal humor o impaciente con los demás?',
      '¿Ha sentido ganas de llorar o tristeza sin un motivo específico?',
      '¿Ha sentido que los problemas y responsabilidades lo(a) superan?'
    ]
  }
];

const OPTIONS = [
  { value: 4, label: 'Siempre', color: 'bg-red-500/10 text-red-500 border-red-500/20' },
  { value: 3, label: 'Casi Siempre', color: 'bg-orange-500/10 text-orange-500 border-orange-500/20' },
  { value: 2, label: 'A veces', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
  { value: 1, label: 'Casi Nunca', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  { value: 0, label: 'Nunca', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' }
];

export default function SaludMentalPage() {
  const [activeTab, setActiveTab] = useState<'list' | 'take' | 'results'>('list');
  const [selectedForm, setSelectedForm] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  // Form state
  const [employeeId, setEmployeeId] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [answers, setAnswers] = useState<Record<number, number>>({});

  useEffect(() => {
    if (activeTab === 'results') {
      fetchResults();
    }
  }, [activeTab]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/gestion/salud-mental');
      setResults(res.data || []);
    } catch (error) {
      toast.error('Error al cargar resultados');
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = (formId: string) => {
    setSelectedForm(formId);
    setAnswers({});
    setEmployeeId('');
    setEmployeeName('');
    setActiveTab('take');
  };

  const handleAnswer = (qIndex: number, value: number) => {
    setAnswers(prev => ({ ...prev, [qIndex]: value }));
  };

  const handleSubmit = async () => {
    const currentTest = QUESTIONNAIRES.find(q => q.id === selectedForm);
    if (!currentTest) return;

    if (!employeeId || !employeeName) {
      toast.error('Debe ingresar identificación y nombre');
      return;
    }

    if (Object.keys(answers).length < currentTest.questions.length) {
      toast.error('Debe responder todas las preguntas');
      return;
    }

    setLoading(true);
    try {
      // Calculate simple score for demo
      let total = 0;
      Object.values(answers).forEach(v => total += v);
      
      const maxPossible = currentTest.questions.length * 4;
      const percentage = (total / maxPossible) * 100;
      
      let riskLevel = 'Bajo';
      if (percentage > 75) riskLevel = 'Muy Alto';
      else if (percentage > 50) riskLevel = 'Alto';
      else if (percentage > 25) riskLevel = 'Medio';

      await axios.post('/api/gestion/salud-mental', {
        empleadoId: employeeId,
        empleadoNombre: employeeName,
        fecha: new Date().toISOString(),
        formulario: selectedForm,
        respuestas: answers,
        puntajeTotal: total,
        nivelRiesgo: riskLevel
      });

      toast.success('Respuestas guardadas correctamente');
      setActiveTab('list');
    } catch (error) {
      toast.error('Error al guardar respuestas');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    if (risk === 'Muy Alto') return 'text-red-500 bg-red-500/10 border-red-500/20';
    if (risk === 'Alto') return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
    if (risk === 'Medio') return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
    return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
  };

  const currentTestData = QUESTIONNAIRES.find(q => q.id === selectedForm);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Riesgo Psicosocial</h1>
          <p className="text-slate-500 font-medium italic">Batería de Instrumentos del Ministerio de Trabajo</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${activeTab === 'list' || activeTab === 'take' ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
          >
            Formularios
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${activeTab === 'results' ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
          >
            Resultados
          </button>
        </div>
      </div>

      {activeTab === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {QUESTIONNAIRES.map((q) => (
            <div key={q.id} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${q.bg}`}>
                  <q.icon className={`w-6 h-6 ${q.color}`} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{q.title}</h3>
                <p className="text-sm text-slate-500 mb-6">{q.description}</p>
              </div>
              <button
                onClick={() => handleStartTest(q.id)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-xl transition-colors border border-slate-200"
              >
                <FileText className="w-4 h-4" />
                Iniciar Prueba
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'take' && currentTestData && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <button 
              onClick={() => setActiveTab('list')}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
            >
              ← Volver
            </button>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{currentTestData.title}</h2>
              <p className="text-slate-500 text-sm">Responda todas las preguntas con sinceridad.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-slate-50 p-6 rounded-xl border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Identificación del Empleado</label>
              <input
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="Ej. 1020304050"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nombre Completo</label>
              <input
                type="text"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                placeholder="Ej. Juan Pérez"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
              />
            </div>
          </div>

          <div className="space-y-6">
            {currentTestData.questions.map((question, index) => (
              <div key={index} className="p-4 md:p-6 bg-slate-50/50 border border-slate-100 rounded-xl">
                <p className="text-slate-800 font-semibold mb-4 text-base md:text-lg">
                  <span className="text-slate-400 mr-2">{index + 1}.</span>
                  {question}
                </p>
                <div className="flex flex-wrap gap-2 md:gap-4">
                  {OPTIONS.map(opt => {
                    const isSelected = answers[index] === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleAnswer(index, opt.value)}
                        className={`flex-1 min-w-[100px] px-3 py-2 md:py-3 text-xs md:text-sm font-bold rounded-lg border transition-all ${isSelected ? opt.color : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                      >
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors shadow-sm disabled:opacity-50"
            >
              {loading ? <FaSpinner className="animate-spin" /> : <CheckCircle className="w-5 h-5" />}
              Guardar Cuestionario
            </button>
          </div>
        </div>
      )}

      {activeTab === 'results' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
             <div className="p-12 flex justify-center">
               <FaSpinner className="animate-spin text-3xl text-slate-300" />
             </div>
          ) : results.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-semibold">No hay resultados guardados</p>
              <p className="text-sm">Inicia un cuestionario para ver los datos aquí.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Fecha</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Empleado</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Formulario</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest text-center">Puntaje</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest text-center">Riesgo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {results.sort((a,b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()).map(res => (
                    <tr key={res.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 text-sm font-medium text-slate-600">
                        {new Date(res.fecha).toLocaleDateString('es-CO')}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-900">{res.empleadoNombre}</p>
                        <p className="text-xs text-slate-500 font-mono">{res.empleadoId}</p>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-700 capitalize">
                        {res.formulario}
                      </td>
                      <td className="px-6 py-4 text-center text-sm font-bold text-slate-900">
                        {res.puntajeTotal}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${getRiskColor(res.nivelRiesgo)}`}>
                          {res.nivelRiesgo}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
