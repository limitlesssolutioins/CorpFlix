import React, { useState } from 'react';
import { FaBrain, FaTimes, FaSpinner, FaMagic } from 'react-icons/fa';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  type: string;
  onGenerate: (answers: Record<string, string>) => Promise<void>;
  isGenerating: boolean;
}

export const ProcessAIWizard: React.FC<Props> = ({
  isOpen, onClose, type, onGenerate, isGenerating
}) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const getTitle = () => {
    switch (type) {
      case 'ESTRATÉGICO_PLANIFICACION': return 'Proceso Estrategico 1';
      case 'ESTRATÉGICO_GERENCIAL': return 'Proceso Estrategico 2';
      case 'MISIONAL_COMERCIAL': return 'Proceso Misional 1';
      case 'MISIONAL_COMPRAS': return 'Proceso Misional 2';
      case 'MISIONAL_OPERATIVO': return 'Proceso Misional 3';
      case 'MISIONAL_ALMACENAMIENTO': return 'Proceso Misional 4';
      case 'MISIONAL_FINANZAS': return 'Proceso Misional 5';
      case 'APOYO_RRHH': return 'Proceso Apoyo 1';
      case 'APOYO_MANTENIMIENTO': return 'Proceso Apoyo 2';
      case 'EVALUACION_AUDITORIA': return 'Proceso Evaluacion 1';
      case 'EVALUACION_MEJORA': return 'Proceso Evaluacion 2';
      default: return 'Generar Proceso con IA';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'ESTRATÉGICO':
      case 'ESTRATÉGICO_PLANIFICACION':
      case 'ESTRATÉGICO_GERENCIAL':
        return 'from-purple-600 to-indigo-600';
      case 'MISIONAL':
      case 'MISIONAL_COMERCIAL':
      case 'MISIONAL_COMPRAS':
      case 'MISIONAL_OPERATIVO':
      case 'MISIONAL_ALMACENAMIENTO':
      case 'MISIONAL_FINANZAS':
        return 'from-blue-600 to-sky-600';
      case 'APOYO':
      case 'APOYO_RRHH':
      case 'APOYO_MANTENIMIENTO':
        return 'from-orange-500 to-amber-600';
      case 'EVALUACION':
      case 'EVALUACION_AUDITORIA':
      case 'EVALUACION_MEJORA':
        return 'from-emerald-500 to-teal-600';
      default: return 'from-slate-700 to-slate-900';
    }
  };

  const getQuestion = (): string | null => {
    const questions: Record<string, string> = {
      'ESTRATÉGICO_PLANIFICACION': 'En su empresa se realiza formalmente la planeacion estrategica? (incluyendo mision, vision, politicas, objetivos, indicadores y estrategias)',
      'ESTRATÉGICO_GERENCIAL': 'En su empresa se realizan de manera periodica comites gerenciales, reuniones de la alta direccion y espacios formales de rendicion de cuentas sobre los resultados de la gestion?',
      'MISIONAL_COMERCIAL': 'En su empresa se realiza una labor comercial para ofrecer sus productos y/o servicios?',
      'MISIONAL_COMPRAS': 'Su empresa realiza compras para el desarrollo de sus actividades operativas y administrativas? Proveedores nacionales o internacionales?',
      'MISIONAL_OPERATIVO': 'Cual es la actividad principal de su empresa: produccion de bienes, prestacion de servicios, comercializacion o una combinacion?',
      'MISIONAL_ALMACENAMIENTO': 'Manejan almacenamiento de productos? Son materiales operativos o administrativos?',
      'MISIONAL_FINANZAS': 'Se desarrollan internamente actividades contables, financieras y de gestion de cartera?',
      'APOYO_RRHH': 'Se gestionan internamente actividades de recursos humanos como nomina, contratos y capacitacion?',
      'APOYO_MANTENIMIENTO': 'Se gestionan internamente actividades de mantenimiento de infraestructura, equipos y activos?',
      'EVALUACION_AUDITORIA': 'Se realizan auditorias internas o revisiones periodicas de los procesos?',
      'EVALUACION_MEJORA': 'Se realizan acciones de mejora continua como correcciones, medidas preventivas o planes de mejora?',
    };
    return questions[type] || null;
  };

  const question = getQuestion();

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[110] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        <div className={`bg-gradient-to-r ${getColor()} p-6 text-white flex justify-between items-center`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
              <FaBrain className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold uppercase tracking-wider">{getTitle()}</h3>
              <p className="text-white/80 text-xs">Responde para generar tu proceso a medida.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors">
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          <div className="space-y-6">
            {question ? (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">{question}</label>
                <textarea
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm h-32"
                  placeholder="Escribe aqui tu respuesta..."
                  onChange={(e) => setAnswers(prev => ({ ...prev, q1: e.target.value }))}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Titulo del proceso</label>
                  <input
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                    placeholder="Ej: Gestion de Proyectos, Servicio Posventa..."
                    onChange={(e) => setAnswers(prev => ({ ...prev, q1: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Descripcion breve del proceso</label>
                  <textarea
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm h-24"
                    placeholder="Describe brevemente que actividades incluye este proceso en tu empresa..."
                    onChange={(e) => setAnswers(prev => ({ ...prev, q2: e.target.value }))}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50">
          <button
            onClick={() => onGenerate(answers)}
            disabled={isGenerating || !answers.q1}
            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 shadow-xl flex justify-center items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02]"
          >
            {isGenerating ? <FaSpinner className="animate-spin" /> : <FaMagic />}
            {isGenerating ? 'Analizando...' : 'Generar con IA'}
          </button>
          {!answers.q1 && (
            <p className="text-center text-[10px] text-slate-400 mt-2">Completa los campos para continuar.</p>
          )}
        </div>
      </div>
    </div>
  );
};
