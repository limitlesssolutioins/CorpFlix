import React, { useState } from 'react';
import { FaBrain, FaTimes, FaSpinner, FaMagic, FaCheckCircle, FaArrowRight } from 'react-icons/fa';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  type: string; // 'ESTRATÉGICO', 'MISIONAL', 'APOYO', 'EVALUACIÓN'
  onGenerate: (answers: Record<string, string>) => Promise<void>;
  isGenerating: boolean;
}

export const ProcessAIWizard: React.FC<Props> = ({
  isOpen, onClose, type, onGenerate, isGenerating
}) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const getTitle = () => {
    switch(type) {
        case 'ESTRATÉGICO_PLANIFICACION': return 'Proceso Estratégico 1';
        case 'ESTRATÉGICO_GERENCIAL': return 'Proceso Estratégico 2';
        case 'MISIONAL_COMERCIAL': return 'Proceso Misional 1';
        case 'MISIONAL_COMPRAS': return 'Proceso Misional 2';
        case 'MISIONAL_OPERATIVO': return 'Proceso Misional 3';
        case 'MISIONAL_ALMACENAMIENTO': return 'Proceso Misional 4';
        case 'MISIONAL_FINANZAS': return 'Proceso Misional 5';
        case 'APOYO_RRHH': return 'Proceso Apoyo 1';
        case 'APOYO_MANTENIMIENTO': return 'Proceso Apoyo 2';
        case 'EVALUACION_AUDITORIA': return 'Proceso Evaluación 1';
        case 'EVALUACION_MEJORA': return 'Proceso Evaluación 2';
        default: return `Asistente ${type}`;
    }
  };

  const getColor = () => {
    switch(type) {
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
        case 'EVALUACIÓN': 
        case 'EVALUACION_AUDITORIA':
        case 'EVALUACION_MEJORA':
            return 'from-emerald-500 to-teal-600';
        default: return 'from-slate-700 to-slate-900';
    }
  };

  const renderQuestions = () => {
    const questionText = {
        'ESTRATÉGICO_PLANIFICACION': '¿En su empresa se realiza formalmente la planeación estratégica? (incluyendo misión, visión, políticas, objetivos, indicadores y estrategias)',
        'ESTRATÉGICO_GERENCIAL': '¿En su empresa se realizan de manera periódica comités gerenciales, reuniones de la alta dirección y espacios formales de rendición de cuentas sobre los resultados de la gestión?',
        'MISIONAL_COMERCIAL': '¿En su empresa se realiza una labor comercial para ofrecer sus productos y/o servicios?',
        'MISIONAL_COMPRAS': '¿Podría indicarme si su empresa realiza compras para el desarrollo de sus actividades operativas y administrativas? En caso afirmativo, ¿esas adquisiciones se realizan principalmente a nivel nacional o también incluyen proveedores internacionales?',
        'MISIONAL_OPERATIVO': 'Cuál es la actividad principal o “core business” de su empresa: la producción de bienes, la prestación de servicios, la comercialización/distribución de productos de terceros, o una combinación de estas?',
        'MISIONAL_ALMACENAMIENTO': '¿Ustedes manejan algún tipo de almacenamiento de productos? ¿Son materiales relacionados con la operación del negocio o más bien productos administrativos?',
        'MISIONAL_FINANZAS': '¿Podría indicarme si dentro de la empresa se desarrollan actividades contables, financieras y de gestión de cartera?',
        'APOYO_RRHH': '¿En su empresa se gestionan internamente actividades de recursos humanos como liquidación de nómina, pago de horas extras, prestaciones sociales, contratos de trabajo y programas de capacitación?',
        'APOYO_MANTENIMIENTO': '¿En su empresa se gestionan internamente actividades de mantenimiento preventivo y correctivo de la infraestructura, equipos operativos (máquinas), computadores, aire acondicionado y otros activos?',
        'EVALUACION_AUDITORIA': '¿En su empresa se realizan auditorías internas o revisiones periódicas para verificar que los procesos se cumplan de acuerdo con lo planificado?',
        'EVALUACION_MEJORA': '¿Realizan en la empresa acciones para mejorar continuamente los procesos, como correcciones de problemas, medidas preventivas o planes de mejora?'
    }[type as string] || 'Describe brevemente cómo funciona este proceso en tu empresa:';

    return (
      <>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">1. {questionText}</label>
          <textarea 
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm h-32"
            placeholder="Escribe aquí tu respuesta..."
            onChange={(e) => setAnswers(prev => ({...prev, q1: e.target.value}))}
          />
        </div>
      </>
    );
  };

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
            {renderQuestions()}
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50">
          <button 
            onClick={() => onGenerate(answers)}
            disabled={isGenerating || Object.keys(answers).length < 1}
            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 shadow-xl flex justify-center items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02]"
          >
            {isGenerating ? <FaSpinner className="animate-spin" /> : <FaMagic />}
            {isGenerating ? 'Analizando Respuestas...' : 'Generar Procesos Sugeridos'}
          </button>
          {Object.keys(answers).length < 1 && (
             <p className="text-center text-[10px] text-slate-400 mt-2">Responde la pregunta para continuar.</p>
          )}
        </div>
      </div>
    </div>
  );
};
