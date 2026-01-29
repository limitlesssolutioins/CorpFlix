import React, { useState } from 'react';
import { FaMagic, FaSpinner, FaCheck, FaTimes, FaLightbulb } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'sonner';

interface Props {
  processName: string;
  onApply: (data: any) => void;
  onClose: () => void;
}

export const ProcessContentWizard: React.FC<Props> = ({ processName, onApply, onClose }) => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Define questions based on process name
  const getQuestions = () => {
    const normalized = processName.toLowerCase();
    
    if (normalized.includes('planeación') || normalized.includes('estrategia')) {
      return [
        { id: 'frequency', label: '¿Con qué frecuencia realizan la planeación estratégica?', placeholder: 'Ej: Anual con revisión trimestral' },
        { id: 'inputs', label: '¿Qué metodologías o insumos utilizan?', placeholder: 'Ej: DOFA, PESTEL, Análisis de Partes Interesadas' },
        { id: 'participants', label: '¿Quiénes participan en la definición?', placeholder: 'Ej: Gerencia General y Líderes de Proceso' }
      ];
    }
    
    if (normalized.includes('comité') || normalized.includes('gerencial')) {
      return [
        { id: 'frequency', label: '¿Cada cuánto se reúne el comité?', placeholder: 'Ej: Mensual o Semanal' },
        { id: 'topics', label: '¿Qué temas principales se tratan?', placeholder: 'Ej: Revisión de indicadores, recursos y quejas' },
        { id: 'outputs', label: '¿Qué documento generan como evidencia?', placeholder: 'Ej: Actas de reunión y compromisos' }
      ];
    }

    // Default generic questions
    return [
      { id: 'goal', label: '¿Cuál es el objetivo principal de este proceso?', placeholder: 'Ej: Asegurar la calidad...' },
      { id: 'trigger', label: '¿Qué dispara o inicia este proceso?', placeholder: 'Ej: Una solicitud del cliente...' }
    ];
  };

  const questions = getQuestions();

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/generate-process-content', {
        processName,
        context: answers
      });
      
      onApply(res.data);
      toast.success('Contenido generado exitosamente');
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Error generando contenido. Intenta de nuevo.');
      
      // Fallback mock for demo if API fails/no key
      const mockData = {
        objective: `Gestionar eficientemente ${processName} para asegurar el cumplimiento de los objetivos organizacionales.`,
        scope: 'Aplica a todas las áreas de la organización.',
        inputs: ['Requisitos del cliente', 'Normatividad legal'],
        outputs: ['Informes de gestión', 'Indicadores actualizados'],
        activities: ['Planificar actividades', 'Ejecutar tareas', 'Verificar cumplimiento', 'Tomar acciones de mejora'],
        resources: ['Personal competente', 'Software especializado'],
        indicators: ['% de Cumplimiento', 'Satisfacción']
      };
      // onApply(mockData); // Uncomment to force mock on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <FaMagic className="text-yellow-300" />
            <h3 className="font-bold text-lg">Generador IA: {processName}</h3>
          </div>
          <p className="text-xs text-indigo-100 opacity-90">
            Responde brevemente para personalizar el contenido.
          </p>
        </div>

        <div className="p-6 space-y-4">
          {questions.map((q) => (
            <div key={q.id}>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">{q.label}</label>
              <input 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all"
                placeholder={q.placeholder}
                onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
              />
            </div>
          ))}

          <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex gap-3 items-start">
             <FaLightbulb className="text-indigo-500 mt-1 shrink-0" />
             <p className="text-xs text-indigo-800">
               La IA generará: Objetivo, Alcance, Entradas, Salidas, Actividades (PHVA), Recursos e Indicadores.
             </p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-200 rounded-lg transition-colors text-sm"
          >
            Cancelar
          </button>
          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg flex items-center gap-2 text-sm disabled:opacity-70"
          >
            {loading ? <FaSpinner className="animate-spin" /> : <FaMagic />}
            {loading ? 'Generando...' : 'Generar Contenido'}
          </button>
        </div>
      </div>
    </div>
  );
};
