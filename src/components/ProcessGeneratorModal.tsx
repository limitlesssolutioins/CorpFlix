import React, { useState, useMemo } from 'react';
import { 
  FaCheckCircle, FaTimes, FaRobot, FaCogs, FaArrowRight, 
  FaBuilding, FaBox, FaMoneyBillWave, FaUsers, FaTools, 
  FaClipboardCheck, FaChartLine, FaLightbulb, FaShieldAlt, 
  FaBriefcase, FaTruck, FaHeadset, FaGavel,
  FaRocket, FaHandsHelping, FaChartPie, FaUserTie,
  FaMagic, FaPlus
} from 'react-icons/fa';
import { toast } from 'sonner';
import { ProcessAIWizard } from './ProcessAIWizard';

export interface Process {
  id: string;
  nombre: string;
  tipo: 'ESTRATÉGICO' | 'MISIONAL' | 'APOYO' | 'EVALUACIÓN';
  responsable: string;
  descripcion: string;
  // Characterization
  objetivo?: string;
  alcance?: string;
  entradas?: string[];
  salidas?: string[];
  actividades?: string[];
  recursos?: string[];
  indicadores?: string[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (processes: Process[]) => void;
}

// --- CONFIGURATION CONSTANTS ---

const STEPS = [
  { id: 'INTRO', title: 'Asistente Inteligente', subtitle: 'Diagnóstico Inicial', icon: FaRobot, color: 'text-blue-600' },
  { id: 'STRATEGY', title: 'Estrategia', subtitle: 'Direccionamiento', icon: FaChartLine, color: 'text-purple-600' },
  { id: 'CORE', title: 'Misionalidad', subtitle: 'Cadena de Valor', icon: FaRocket, color: 'text-blue-600' },
  { id: 'SUPPORT', title: 'Apoyo', subtitle: 'Soporte Operativo', icon: FaHandsHelping, color: 'text-orange-600' },
  { id: 'EVALUATION', title: 'Evaluación', subtitle: 'Mejora Continua', icon: FaChartPie, color: 'text-emerald-600' },
  { id: 'REVIEW', title: 'Confirmación', subtitle: 'Revisión Final', icon: FaCheckCircle, color: 'text-slate-600' },
];

export const ProcessGeneratorModal: React.FC<Props> = ({ isOpen, onClose, onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selections, setSelections] = useState<Record<string, any>>({});
  const [companyDescription, setCompanyDescription] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<Record<string, any[]>>({});
  const [loadingAI, setLoadingAI] = useState<string | null>(null);

  // Wizard State
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardType, setWizardType] = useState<string>('');

  // --- LOGIC GENERATORS ---

  const proposedProcesses = useMemo(() => {
    const procs: Process[] = [];
    const add = (name: string, type: Process['tipo'], owner: string, desc: string, trigger: boolean = true) => {
      if (trigger) {
        procs.push({
          id: `GEN-${name.replace(/\s+/g, '-')}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          nombre: name,
          tipo: type,
          responsable: owner,
          descripcion: desc
        });
      }
    };

    // 1. ESTRATEGIA
    add('Planificación Estratégica', 'ESTRATÉGICO', 'Gerencia General', 'Definición del rumbo, políticas y objetivos organizacionales.', selections.hasStrategy);
    add('Comité Gerencial', 'ESTRATÉGICO', 'Gerencia General', 'Toma de decisiones de alto nivel y revisión de resultados.', selections.hasStrategy);

    // AI Suggestions Strategy
    if (selections.ai_ESTRATÉGICO) {
        selections.ai_ESTRATÉGICO.forEach((p: any) => add(p.nombre, 'ESTRATÉGICO', p.responsable, p.descripcion, true));
    }

    // 2. MISIONALES
    add('Gestión Comercial', 'MISIONAL', 'Director Comercial', 'Prospección, venta y relación con el cliente.', true);
    add('Compras y Proveedores', 'MISIONAL', 'Jefe de Compras', 'Adquisición de bienes y evaluación de proveedores.', true);
    add('Gestión Operativa', 'MISIONAL', 'Director Operativo', 'Planificación y ejecución de las actividades principales.', true);
    add('Almacenamiento e Inventarios', 'MISIONAL', 'Jefe de Bodega', 'Recepción, custodia y despacho de insumos.', selections.hasStorage);
    add('Gestión Financiera', 'MISIONAL', 'Director Financiero', 'Contabilidad, tesorería, facturación y cartera.', selections.hasFinance);
    
    if (selections.hasLogistics) {
      add('Logística y Distribución', 'MISIONAL', 'Coordinador Logístico', 'Entrega del producto o servicio al cliente final.', true);
    }

    // AI Suggestions Misional
    if (selections.ai_MISIONAL) {
        selections.ai_MISIONAL.forEach((p: any) => add(p.nombre, 'MISIONAL', p.responsable, p.descripcion, true));
    }

    // 3. APOYO
    add('Talento Humano', 'APOYO', 'Jefe de Talento Humano', 'Selección, contratación, nómina y bienestar.', selections.hasHR);
    add('Mantenimiento e Infraestructura', 'APOYO', 'Jefe de Mantenimiento', 'Mantenimiento de equipos, flota e instalaciones.', selections.hasMaintenance);
    
    add('Gestión Tecnológica (TI)', 'APOYO', 'Líder de TI', 'Soporte, infraestructura y seguridad de la información.', selections.hasIT);
    add('Gestión Legal', 'APOYO', 'Asesor Jurídico', 'Aseguramiento del cumplimiento legal y contractual.', selections.hasLegal);

    // AI Suggestions Apoyo
    if (selections.ai_APOYO) {
        selections.ai_APOYO.forEach((p: any) => add(p.nombre, 'APOYO', p.responsable, p.descripcion, true));
    }

    // 4. EVALUACIÓN
    add('Auditoría Interna', 'EVALUACIÓN', 'Auditor Interno', 'Evaluación independiente del cumplimiento de procesos.', selections.hasAudit);
    add('Mejora Continua', 'EVALUACIÓN', 'Líder de Calidad', 'Gestión de hallazgos, acciones correctivas y de mejora.', selections.hasImprovement);
    add('Satisfacción del Cliente', 'EVALUACIÓN', 'Servicio al Cliente', 'Medición y análisis de la percepción del cliente.', selections.hasSatisfaction);

    // AI Suggestions Evaluación
    if (selections.ai_EVALUACIÓN) {
        selections.ai_EVALUACIÓN.forEach((p: any) => add(p.nombre, 'EVALUACIÓN', p.responsable, p.descripcion, true));
    }

    return procs;
  }, [selections]);

  if (!isOpen) return null;

  const currentStep = STEPS[currentStepIndex];

  const handleToggle = (key: string, value: any) => {
    setSelections(prev => ({ ...prev, [key]: value }));
  };
  
  const handleToggleAI = (type: string, proc: any) => {
      const key = `ai_${type}`;
      const currentList = selections[key] || [];
      const exists = currentList.find((p: any) => p.nombre === proc.nombre);
      
      let newList;
      if (exists) {
          newList = currentList.filter((p: any) => p.nombre !== proc.nombre);
      } else {
          newList = [...currentList, proc];
      }
      setSelections(prev => ({ ...prev, [key]: newList }));
  };

  const handleNext = () => setCurrentStepIndex(prev => Math.min(prev + 1, STEPS.length - 1));
  const handleBack = () => setCurrentStepIndex(prev => Math.max(prev - 1, 0));

  const openWizard = (type: string) => {
    setWizardType(type);
    setWizardOpen(true);
  };

  const handleWizardGenerate = async (answers: Record<string, string>) => {
    const type = wizardType;
    if (!companyDescription) {
        toast.error('Por favor ingresa una descripción de la empresa en el paso inicial.');
        return;
    }
    
    setLoadingAI(type);
    try {
        const res = await fetch('/api/generate-process-list', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                type, 
                context: companyDescription,
                answers,
                existingProcesses: proposedProcesses.filter(p => p.tipo === type)
            })
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        
        setAiSuggestions(prev => ({ ...prev, [type]: data }));
        toast.success(`Sugerencias generadas para ${type}`);
        setWizardOpen(false); // Close wizard on success
    } catch (error) {
        toast.error('Error generando sugerencias');
        console.error(error);
    } finally {
        setLoadingAI(null);
    }
  };

  // --- RENDERERS ---

  const renderOption = (key: string, label: string, icon: any, description: string, value: boolean) => (
    <div 
      onClick={() => handleToggle(key, !value)}
      className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-start gap-4 group ${value ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-blue-200 bg-white'}`}
    >
      <div className={`p-3 rounded-lg transition-colors ${value ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-500'}`}>
        {React.createElement(icon, { size: 20 })}
      </div>
      <div>
        <h4 className={`font-bold text-sm mb-1 ${value ? 'text-blue-900' : 'text-slate-700'}`}>{label}</h4>
        <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
      </div>
      <div className={`ml-auto mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${value ? 'border-blue-500 bg-blue-500' : 'border-slate-300'}`}>
        {value && <FaCheckCircle className="text-white text-[10px]" />}
      </div>
    </div>
  );

  const renderAIOptions = (type: string) => {
    const suggestions = aiSuggestions[type] || [];
    const selectedList = selections[`ai_${type}`] || [];

    return (
        <div className="mt-6 border-t border-slate-100 pt-6">
            <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-slate-800 flex items-center gap-2">
                    <FaMagic className="text-purple-500" /> Sugerencias IA
                </h4>
                <button 
                    onClick={() => {
                      if (type === 'MISIONAL') {
                        // Priority mapping for Misional step
                        openWizard('MISIONAL_OPERATIVO');
                      } else if (type === 'APOYO') {
                        // For support, we can open HR by default, or better yet, 
                        // this button usually appears below the options.
                        openWizard('APOYO_RRHH');
                      } else if (type === 'EVALUACIÓN') {
                        openWizard('EVALUACION_AUDITORIA');
                      } else {
                        openWizard(type);
                      }
                    }}
                    disabled={loadingAI === type}
                    className="text-xs font-bold bg-purple-50 text-purple-600 px-3 py-1.5 rounded-lg hover:bg-purple-100 transition-colors flex items-center gap-2"
                >
                    {loadingAI === type ? <span className="animate-spin"><FaCogs /></span> : <FaMagic />}
                    {suggestions.length > 0 ? 'Regenerar con Asistente' : 'Consultar Asistente IA'}
                </button>
            </div>
            
            {suggestions.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                    {suggestions.map((proc: any, idx: number) => {
                        const isSelected = selectedList.some((p: any) => p.nombre === proc.nombre);
                        return (
                            <div 
                                key={idx}
                                onClick={() => handleToggleAI(type, proc)}
                                className={`cursor-pointer p-3 rounded-xl border transition-all flex items-start gap-3 ${isSelected ? 'border-purple-500 bg-purple-50' : 'border-slate-200 hover:border-purple-200 bg-white'}`}
                            >
                                <div className={`mt-1 p-1.5 rounded-md ${isSelected ? 'bg-purple-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                    <FaRobot size={12} />
                                </div>
                                <div>
                                    <h5 className={`font-bold text-xs ${isSelected ? 'text-purple-900' : 'text-slate-700'}`}>{proc.nombre}</h5>
                                    <p className="text-[10px] text-slate-500">{proc.descripcion}</p>
                                    <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1 mt-1">
                                        <FaUserTie size={8} /> {proc.responsable}
                                    </span>
                                </div>
                                {isSelected && <FaCheckCircle className="text-purple-500 text-xs ml-auto mt-1" />}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <p className="text-xs text-slate-400">Haz clic en generar para obtener recomendaciones personalizadas.</p>
                </div>
            )}
        </div>
    );
  };

  const renderContent = () => {
    switch (currentStep.id) {
      case 'INTRO':
        return (
          <div className="text-center py-10 px-4">
            <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-blue-200">
              <FaRobot className="text-white text-5xl animate-bounce" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Diseñemos tu Mapa de Procesos</h2>
            <p className="text-slate-600 text-lg max-w-lg mx-auto mb-6 leading-relaxed">
              Este asistente te guiará para estructurar los procesos de tu organización bajo el modelo <strong>PHVA</strong> y estándares ISO 9001.
            </p>
            
            <div className="max-w-xl mx-auto mb-8 text-left">
                <label className="block text-sm font-bold text-slate-700 mb-2">Describe tu Empresa (Clave para la IA)</label>
                <textarea 
                    value={companyDescription}
                    onChange={(e) => setCompanyDescription(e.target.value)}
                    placeholder="Ej: Somos una empresa de consultoría ambiental que realiza estudios de impacto, monitoreo de calidad del aire y gestión de trámites legales..."
                    className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-sm h-32"
                />
            </div>

            <button 
              onClick={handleNext}
              disabled={!companyDescription}
              className="px-10 py-4 bg-slate-900 text-white text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-3 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Iniciar Diagnóstico <FaArrowRight />
            </button>
          </div>
        );

      case 'STRATEGY':
        return (
          <div className="space-y-6">
            <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 mb-6">
              <h3 className="text-purple-900 font-bold text-lg mb-2 flex items-center gap-2">
                <FaChartLine /> Nivel Estratégico
              </h3>
              <p className="text-purple-700/80 text-sm">
                Procesos que definen el rumbo de la organización y toman las decisiones de alto nivel.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {renderOption('hasStrategy', 'Planificación Estratégica', FaLightbulb, '¿Definen misión, visión, políticas y objetivos anualmente?', selections.hasStrategy)}
              {renderOption('hasQuality', 'Gestión de Calidad', FaClipboardCheck, '¿Tienen un sistema de gestión (ISO) o planean implementarlo?', selections.hasQuality)}
            </div>
            {renderAIOptions('ESTRATÉGICO')}
          </div>
        );

      case 'CORE':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 mb-6">
              <h3 className="text-blue-900 font-bold text-lg mb-2 flex items-center gap-2">
                <FaRocket /> Procesos Misionales
              </h3>
              <p className="text-blue-700/80 text-sm">
                La razón de ser del negocio. ¿Qué hacen para generar valor al cliente?
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
               <button 
                 onClick={() => handleToggle('coreType', 'service')}
                 className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${selections.coreType === 'service' ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-slate-100 hover:border-blue-300'}`}
               >
                 <FaHeadset size={32} className={selections.coreType === 'service' ? 'text-blue-600' : 'text-slate-400'} />
                 <span className="font-bold text-slate-700">Servicios</span>
               </button>
               <button 
                 onClick={() => handleToggle('coreType', 'product')}
                 className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${selections.coreType === 'product' ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-slate-100 hover:border-blue-300'}`}
               >
                 <FaBox size={32} className={selections.coreType === 'product' ? 'text-blue-600' : 'text-slate-400'} />
                 <span className="font-bold text-slate-700">Productos</span>
               </button>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-bold text-slate-700 uppercase tracking-wide">Actividades Adicionales:</p>
              {renderOption('hasLogistics', 'Logística y Distribución', FaTruck, '¿Gestionan flotas de transporte o entregas físicas complejas?', selections.hasLogistics)}
            </div>

            {renderAIOptions('MISIONAL')}
          </div>
        );

      case 'SUPPORT':
        return (
          <div className="space-y-6">
            <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 mb-6">
              <h3 className="text-orange-900 font-bold text-lg mb-2 flex items-center gap-2">
                <FaHandsHelping /> Procesos de Apoyo
              </h3>
              <p className="text-orange-700/80 text-sm">
                Procesos transversales que proveen los recursos necesarios para la operación.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {renderOption('hasHR', 'Gestión Humana', FaUsers, 'Selección, nómina, bienestar.', selections.hasHR)}
              {renderOption('hasFinance', 'Gestión Financiera', FaMoneyBillWave, 'Contabilidad, facturación, tesorería.', selections.hasFinance)}
              {renderOption('hasPurchasing', 'Compras', FaBriefcase, 'Adquisición de bienes y servicios.', selections.hasPurchasing)}
              {renderOption('hasIT', 'Tecnología (TI)', FaCogs, 'Soporte, redes, software.', selections.hasIT)}
              {renderOption('hasMaintenance', 'Mantenimiento', FaTools, 'Infraestructura y equipos.', selections.hasMaintenance)}
              {renderOption('hasLegal', 'Jurídico', FaGavel, 'Contratos y cumplimiento legal.', selections.hasLegal)}
              {renderOption('hasStorage', 'Almacén', FaBox, 'Bodega e inventarios físicos.', selections.hasStorage)}
            </div>
            {renderAIOptions('APOYO')}
          </div>
        );

      case 'EVALUATION':
        return (
          <div className="space-y-6">
            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 mb-6">
              <h3 className="text-emerald-900 font-bold text-lg mb-2 flex items-center gap-2">
                <FaChartPie /> Evaluación y Mejora
              </h3>
              <p className="text-emerald-700/80 text-sm">
                Procesos para medir el desempeño y garantizar la mejora continua (Fase Actuar/Verificar).
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {renderOption('hasAudit', 'Auditoría Interna', FaClipboardCheck, '¿Realizan auditorías periódicas a sus procesos?', selections.hasAudit)}
              {renderOption('hasImprovement', 'Mejora Continua', FaChartLine, '¿Gestionan acciones correctivas y planes de mejora?', selections.hasImprovement)}
              {renderOption('hasSatisfaction', 'Satisfacción Cliente', FaUsers, '¿Miden formalmente la percepción del cliente (PQRS)?', selections.hasSatisfaction)}
            </div>
            {renderAIOptions('EVALUACIÓN')}
          </div>
        );

      case 'REVIEW':
        return (
          <div className="flex flex-col h-full">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-black text-slate-800">Mapa Propuesto</h3>
              <p className="text-slate-500">Hemos generado {proposedProcesses.length} procesos basados en tu diagnóstico.</p>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3 mb-6">
              {proposedProcesses.map(proc => (
                <div key={proc.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
                  <div className={`mt-1 p-2 rounded-lg text-white text-[10px] font-black uppercase tracking-widest ${
                    proc.tipo === 'ESTRATÉGICO' ? 'bg-purple-500' :
                    proc.tipo === 'MISIONAL' ? 'bg-blue-500' :
                    proc.tipo === 'APOYO' ? 'bg-orange-500' : 'bg-emerald-500'
                  }`}>
                    {proc.tipo.substring(0, 3)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{proc.nombre}</h4>
                    <p className="text-xs text-slate-500">{proc.descripcion}</p>
                    <span className="text-[10px] font-bold text-slate-400 mt-1 block flex items-center gap-1">
                      <FaUserTie className="inline" /> {proc.responsable}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => onComplete(proposedProcesses)}
              className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 shadow-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              <FaCheckCircle className="text-emerald-400" /> CONFIRMAR Y CREAR MAPA
            </button>
          </div>
        );
        
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[2rem] shadow-2xl max-w-4xl w-full h-[85vh] flex flex-col overflow-hidden relative">
        
        {/* PROGRESS HEADER */}
        {currentStepIndex > 0 && (
          <div className="bg-white border-b border-slate-100 p-6 flex items-center justify-between shrink-0">
             <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${currentStep.color.replace('text-', 'bg-').replace('600', '100')}`}>
                   {React.createElement(currentStep.icon, { className: currentStep.color, size: 24 })}
                </div>
                <div>
                   <h3 className="font-black text-slate-900 text-lg">{currentStep.title}</h3>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{currentStep.subtitle}</p>
                </div>
             </div>
             
             <div className="flex items-center gap-2">
                {STEPS.map((s, i) => i > 0 && (
                   <div key={s.id} className={`h-1.5 rounded-full transition-all duration-500 ${i <= currentStepIndex ? `w-8 ${s.color.replace('text-', 'bg-')}` : 'w-2 bg-slate-200'}`} />
                ))}
             </div>

             <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-red-500">
               <FaTimes size={20} />
             </button>
          </div>
        )}

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/30">
          {renderContent()}
        </div>

        {/* FOOTER ACTIONS */}
        {currentStepIndex > 0 && currentStepIndex < STEPS.length - 1 && (
           <div className="p-6 border-t border-slate-100 bg-white flex justify-between shrink-0">
              <button 
                onClick={handleBack}
                className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors"
              >
                Atrás
              </button>
              <button 
                onClick={handleNext}
                className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                Siguiente <FaArrowRight size={12} />
              </button>
           </div>
        )}
      </div>
      
      <ProcessAIWizard 
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
        type={wizardType}
        onGenerate={handleWizardGenerate}
        isGenerating={!!loadingAI}
      />
    </div>
  );
};