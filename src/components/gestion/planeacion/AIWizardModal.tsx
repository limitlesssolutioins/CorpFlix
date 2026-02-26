import React from 'react';
import { FaBrain, FaTimes, FaSpinner, FaMagic, FaCheckCircle } from 'react-icons/fa';

interface Props {
  wizardOpen: boolean;
  onClose: () => void;
  wizardType: string | null;
  wizardStep: number;
  setWizardStep: (step: number) => void;
  wizardInputs: Record<string, any>;
  setWizardInputs: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  generatedData: any;
  generatedOptions: string[];
  isGenerating: boolean;
  generateAIProposals: () => void;
  applySelection: (selection: any) => void;
  selectedPolicies: string[];
  selectedAnalysis: Record<string, string[]>;
  togglePolicySelection: (p: string) => void;
  toggleAnalysisItem: (cat: string, item: string) => void;
  applyMultiSelection: () => void;
  applyAnalysisSelection: () => void;
  setSelectedPolicies: (p: string[]) => void;
  setSelectedAnalysis: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  companyName: string;
  companyActivity: string;
  data: any;
}

export const AIWizardModal: React.FC<Props> = ({
  wizardOpen, onClose, wizardType, wizardStep, setWizardStep,
  wizardInputs, setWizardInputs, generatedData, generatedOptions,
  isGenerating, generateAIProposals, applySelection,
  selectedPolicies, selectedAnalysis, togglePolicySelection, toggleAnalysisItem,
  applyMultiSelection, applyAnalysisSelection, setSelectedPolicies, setSelectedAnalysis,
  companyName, companyActivity, data
}) => {
  if (!wizardOpen || !wizardType) return null;

  const renderInputs = () => {
    if (wizardType === 'mission') {
      return (
        <>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">1. ¿Quiénes somos? (Nombre de la empresa)</label>
            <input 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Ej: Muebles del Valle S.A."
              onChange={(e) => setWizardInputs(prev => ({...prev, name: e.target.value}))}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">2. ¿Qué ofrecemos? (Servicios o productos)</label>
            <textarea 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              rows={2}
              placeholder="Ej: Fabricación de muebles de madera sostenible..."
              onChange={(e) => setWizardInputs(prev => ({...prev, offerings: e.target.value}))}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">3. ¿Quiénes son tus clientes o mercado objetivo?</label>
            <input 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Ej: Familias jóvenes en el área metropolitana..."
              onChange={(e) => setWizardInputs(prev => ({...prev, clients: e.target.value}))}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">4. ¿Cuál es tu valor agregado? (Diferenciador)</label>
            <textarea 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              rows={2}
              placeholder="Ej: Diseños personalizados y garantía de por vida..."
              onChange={(e) => setWizardInputs(prev => ({...prev, differentiator: e.target.value}))}
            />
          </div>
        </>
      );
    }
    // ... Vision inputs logic remains same pattern
    if (wizardType === 'vision') {
        return (
          <>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">1. Nombre de la empresa</label>
              <input 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                placeholder="Ej: TechSolutions..."
                onChange={(e) => setWizardInputs(prev => ({...prev, name: e.target.value}))}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">2. Fecha objetivo (¿Para cuándo?)</label>
              <input 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                placeholder="Ej: 2030"
                onChange={(e) => setWizardInputs(prev => ({...prev, date: e.target.value}))}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">3. Localidad o Alcance</label>
              <input 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                placeholder="Ej: Nivel Nacional, Latinoamérica..."
                onChange={(e) => setWizardInputs(prev => ({...prev, scope: e.target.value}))}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">4. ¿Cómo se visiona para ese año?</label>
              <textarea 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                rows={2}
                placeholder="Ej: Siendo líderes en innovación tecnológica..."
                onChange={(e) => setWizardInputs(prev => ({...prev, goal: e.target.value}))}
              />
            </div>
          </>
        );
    }

    if (wizardType === 'policies') {
        return (
          <>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Nombre de la Empresa</label>
              <input 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                placeholder="Ej: LIDUS S.A.S."
                onChange={(e) => setWizardInputs(prev => ({...prev, name: e.target.value}))}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Sector Económico</label>
              <input 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                placeholder="Ej: Tecnológico, Industrial, Servicios..."
                onChange={(e) => setWizardInputs(prev => ({...prev, sector: e.target.value}))}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Actividad Económica</label>
              <textarea 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                rows={3}
                placeholder="Ej: Desarrollo de software a medida y consultoría..."
                onChange={(e) => setWizardInputs(prev => ({...prev, activity: e.target.value}))}
              />
            </div>
          </>
        );
    }

    if (wizardType === 'objectives') {
        const hasPolicies = data.politicas && data.politicas.length > 0;
        return (
          <>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Nombre de la Empresa</label>
              <input 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Ej: LIDUS S.A.S."
                onChange={(e) => setWizardInputs(prev => ({...prev, name: e.target.value}))}
              />
            </div>
  
            {hasPolicies && (
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 accent-blue-600"
                    onChange={(e) => setWizardInputs(prev => ({
                      ...prev, 
                      usePolicies: e.target.checked,
                      policies: e.target.checked ? data.politicas.map((p: any) => p.texto) : []
                    }))}
                  />
                  <span className="text-blue-800 font-bold text-sm">
                    Basar objetivos en mis {data.politicas.length} políticas actuales
                  </span>
                </label>
                <p className="text-xs text-blue-600 mt-2 ml-8">
                  La IA analizará tus políticas para proponer objetivos alineados con ellas.
                </p>
              </div>
            )}
  
            {(!wizardInputs.usePolicies) && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Sector / Actividad</label>
                <textarea 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  rows={3}
                  placeholder="Ej: Desarrollo de software, Construcción, Salud..."
                  defaultValue={companyActivity}
                  onChange={(e) => setWizardInputs(prev => ({...prev, activity: e.target.value || companyActivity}))}
                />
              </div>
            )}
          </>
        );
    }

    // Individual SWOT quadrant
    if (wizardType.startsWith('swot-')) {
      const quadrant = wizardType.split('-')[1];
      const quadrantInfo: Record<string, { label: string; bgClass: string; textClass: string; desc: string }> = {
        strengths: { label: 'Fortalezas', bgClass: 'bg-emerald-50 border-emerald-100', textClass: 'text-emerald-800', desc: 'Capacidades y ventajas internas que diferencian a la empresa.' },
        weaknesses: { label: 'Debilidades', bgClass: 'bg-amber-50 border-amber-100', textClass: 'text-amber-800', desc: 'Áreas internas que limitan el desempeño o representan una desventaja competitiva.' },
        opportunities: { label: 'Oportunidades', bgClass: 'bg-blue-50 border-blue-100', textClass: 'text-blue-800', desc: 'Factores externos positivos del entorno que la empresa puede aprovechar.' },
        threats: { label: 'Amenazas', bgClass: 'bg-red-50 border-red-100', textClass: 'text-red-800', desc: 'Factores externos que pueden representar un riesgo o impacto negativo.' },
      };
      const info = quadrantInfo[quadrant] || { label: quadrant, bgClass: 'bg-slate-50 border-slate-100', textClass: 'text-slate-800', desc: '' };
      return (
        <>
          <div className={`p-4 rounded-2xl border ${info.bgClass} mb-4`}>
            <p className={`text-xs font-bold ${info.textClass} uppercase tracking-wide mb-1`}>{info.label} — Generar 3 elementos nuevos</p>
            <p className={`text-xs ${info.textClass} opacity-80`}>{info.desc}</p>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Contexto adicional (opcional)</label>
            <textarea
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
              rows={3}
              placeholder="Describe aspectos relevantes que la IA debe considerar..."
              onChange={(e) => setWizardInputs(prev => ({ ...prev, userAnalysis: e.target.value }))}
            />
            <p className="text-[10px] text-slate-400 mt-1">La IA generará 3 elementos nuevos y los agregará a los existentes.</p>
          </div>
        </>
      );
    }

    // Default for SWOT / PESTEL
    if (wizardType === 'swot') {
      const internalFactors = [
        'Capacidad financiera', 'Soporte tecnológico', 'Infraestructura logística', 
        'Base de datos e información comercial', 'Experiencia en el negocio', 
        'Capacidad de respuesta a clientes', 'Compromiso del personal', 
        'Formación directiva', 'Good Will y reconocimiento social', 'Soporte administrativo',
        'Situación legal frente al estado', 'Ambiente laboral', 'Estructura organizacional',
        'Planes de desarrollo de talento', 'Capacidades distintivas/competitivas',
        'Estilo de dirección', 'Creatividad e innovación', 'Gestión del conocimiento',
        'Gestión del riesgo y continuidad', 'Gestión de procesos y mejora'
      ];

      const hasPestelData = data.political || data.economic || data.social || data.technological || data.ecological || data.legal;

      return (
        <>
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-700 mb-6 text-white">
            <h4 className="font-black text-indigo-400 mb-2 flex items-center gap-2 uppercase tracking-tight">
              Análisis de Capacidades Internas
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Para generar un DOFA preciso, evalúa cómo se encuentra tu empresa en los siguientes factores:
            </p>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
              {internalFactors.map((f, i) => (
                <span key={i} className="text-[9px] bg-slate-800 px-2 py-1 rounded-md border border-slate-700 text-slate-300 font-bold uppercase">
                  {f}
                </span>
              ))}
            </div>
          </div>

          {hasPestelData && (
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 mb-6 flex items-center gap-4">
              <div className="p-2 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-200">
                <FaCheckCircle />
              </div>
              <div>
                <p className="text-xs font-black text-emerald-900 uppercase tracking-wide">Contexto PESTEL detectado</p>
                <p className="text-[10px] text-emerald-700 font-medium">La IA usará tu análisis externo para proponer Oportunidades y Amenazas coherentes.</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Nombre de la Empresa</label>
              <input 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                defaultValue={companyName}
                onChange={(e) => setWizardInputs(prev => ({...prev, name: e.target.value || companyName}))}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 italic">Describe las Fortalezas y Debilidades (Análisis Interno):</label>
              <textarea 
                className="w-full p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                rows={5}
                placeholder="Ej: Contamos con alta capacidad financiera pero debilidad en infraestructura logística. El compromiso del personal es alto..."
                onChange={(e) => setWizardInputs(prev => ({
                    ...prev, 
                    userAnalysis: e.target.value,
                    pestelContext: {
                        political: data.political,
                        economic: data.economic,
                        social: data.social,
                        technological: data.technological,
                        ecological: data.ecological,
                        legal: data.legal
                    }
                }))}
              />
            </div>
          </div>
        </>
      );
    }

    // Individual PESTEL logic
    if (wizardType.startsWith('pestel-')) {
      const sector = wizardType.split('-')[1];
      const sectorInfo: Record<string, {label: string, desc: string, points: string[]}> = {
        political: { 
          label: 'Político', 
          desc: 'Examina las influencias políticas que podrían afectar a tu organización.',
          points: [
            'Cambios de regulación (Variación de impuestos por reformas)',
            'Estabilidad política e incertidumbre en decisiones gubernamentales',
            'Niveles de inversión nacional/extranjera'
          ]
        },
        economic: { 
          label: 'Económico', 
          desc: 'Evalúa las condiciones económicas que podrían tener un impacto.',
          points: [
            'Variaciones de divisas (Dólar)',
            'Tasas bancarias y de interés',
            'Liquidez y puntualidad de pago de clientes',
            'Competencia y cambios en mercado internacional/local',
            'Precios y estabilidad de proveedores'
          ]
        },
        social: { 
          label: 'Social', 
          desc: 'Analiza los aspectos culturales, demográficos y sociales.',
          points: [
            'Generación de empleo en la zona de influencia',
            'Comportamientos sociales (Impacto positivo/negativo)',
            'Gestión social y apoyo vecinal',
            'Disponibilidad de recurso humano competente'
          ]
        },
        technological: { 
          label: 'Tecnológico', 
          desc: 'Considera las innovaciones y avances tecnológicos.',
          points: [
            'Software para mejorar la productividad',
            'Tecnología en planta para mejorar la operación',
            'Estrategias y herramientas para innovar'
          ]
        },
        ecological: { 
          label: 'Ecológico', 
          desc: 'Evalúa el impacto ambiental y las preocupaciones de sostenibilidad.',
          points: [
            'Licencias de sostenibilidad del negocio',
            'Regulaciones ambientales vigentes',
            'Cumplimiento de ley en temas de ecología'
          ]
        },
        legal: { 
          label: 'Legal', 
          desc: 'Considera el marco legal en el que opera tu organización.',
          points: [
            'Cumplimiento de seguridad vial',
            'Regulaciones laborales vigentes',
            'Cumplimiento de SG-SST',
            'Uso racional y eficiente de energía'
          ]
        }
      };

      const info = sectorInfo[sector] || { label: sector, desc: '', points: [] };

      return (
        <>
          <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 mb-6">
            <h4 className="font-black text-indigo-900 mb-2 flex items-center gap-2 uppercase tracking-tight">
              Análisis {info.label}
            </h4>
            <p className="text-sm text-indigo-800/80 leading-relaxed mb-4 font-medium">{info.desc}</p>
            <div className="space-y-2">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Factores a considerar:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {info.points.map((p, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white/60 p-2 rounded-xl border border-indigo-100/50">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                    <span className="text-[11px] text-indigo-900 font-bold">{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Nombre de la Empresa</label>
            <input 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="Ej: LIDUS S.A.S."
              defaultValue={companyName}
              onChange={(e) => setWizardInputs(prev => ({...prev, name: e.target.value || companyName}))}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Sector / Actividad</label>
            <textarea 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              rows={2}
              placeholder="Ej: Desarrollo de software, Construcción, Salud..."
              defaultValue={companyActivity}
              onChange={(e) => setWizardInputs(prev => ({...prev, activity: e.target.value || companyActivity}))}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 italic">3. Describe tu observación o análisis para este sector:</label>
            <textarea 
              className="w-full p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
              rows={4}
              placeholder={`Basado en la guía de arriba, ¿qué has identificado en el sector ${info.label.toLowerCase()} de tu empresa?`}
              onChange={(e) => setWizardInputs(prev => ({...prev, userAnalysis: e.target.value}))}
            />
            <p className="text-[10px] text-slate-400 mt-2">La IA tomará tus ideas y las redactará de forma profesional y técnica.</p>
          </div>
        </>
      );
    }

    return (
        <>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Nombre de la Empresa</label>
            <input 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="Ej: LIDUS S.A.S."
              onChange={(e) => setWizardInputs(prev => ({...prev, name: e.target.value}))}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Sector / Actividad</label>
            <textarea 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              rows={3}
              placeholder="Ej: Desarrollo de software, Construcción, Salud..."
              defaultValue={companyActivity}
              onChange={(e) => setWizardInputs(prev => ({...prev, activity: e.target.value || companyActivity}))}
            />
          </div>
        </>
    );
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
              <FaBrain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold uppercase tracking-wider">
                {wizardType?.startsWith('swot-')
                  ? `Generar ${({'swot-strengths':'Fortalezas','swot-weaknesses':'Debilidades','swot-opportunities':'Oportunidades','swot-threats':'Amenazas'} as Record<string,string>)[wizardType] || 'DOFA'}`
                  : 'Generador de Estrategia'
                }
              </h3>
              <p className="text-indigo-100 text-sm">Gemini IA te ayudará a redactarla.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors">
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar">
          {wizardStep === 0 && (
            <div className="space-y-6">
              {renderInputs()}
              <div className="flex justify-end pt-4">
                <button 
                  onClick={generateAIProposals}
                  disabled={isGenerating}
                  className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 flex items-center gap-2 disabled:opacity-50 shadow-lg"
                >
                  {isGenerating ? <FaSpinner className="animate-spin" /> : <FaMagic />}
                  {isGenerating ? 'Consultando a Gemini...' : 'Generar Propuestas'}
                </button>
              </div>
            </div>
          )}

          {wizardStep === 1 && (
            <div className="space-y-6">
              {generatedData ? (
                <div className="space-y-6">
                   <h4 className="text-lg font-bold text-slate-800 mb-2">Análisis Generado:</h4>
                   
                   <div className={`grid gap-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar ${Object.keys(generatedData).length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                     {Object.keys(generatedData).map((key) => {
                       const translations: Record<string, string> = {
                         strengths: 'Fortalezas',
                         weaknesses: 'Debilidades',
                         opportunities: 'Oportunidades',
                         threats: 'Amenazas',
                         political: 'Político',
                         economic: 'Económico',
                         social: 'Social',
                         technological: 'Tecnológico',
                         ecological: 'Ecológico',
                         legal: 'Legal'
                       };

                       const colors: Record<string, string> = {
                        political: 'from-blue-500 to-indigo-600',
                        economic: 'from-emerald-500 to-teal-600',
                        social: 'from-pink-500 to-rose-600',
                        technological: 'from-purple-500 to-violet-600',
                        ecological: 'from-green-500 to-emerald-600',
                        legal: 'from-slate-600 to-slate-800'
                       };
                       
                       return (
                         <div key={key} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                           <div className={`bg-gradient-to-r ${colors[key] || 'from-indigo-500 to-purple-600'} p-3 flex justify-between items-center`}>
                             <h5 className="font-black text-white uppercase text-[10px] tracking-widest flex items-center gap-2">
                               <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                               {translations[key] || key}
                             </h5>
                             <div className="flex gap-2">
                               <button 
                                 onClick={() => setSelectedAnalysis(prev => ({...prev, [key]: generatedData[key]}))}
                                 className="text-[9px] font-black bg-white/20 hover:bg-white/40 text-white px-2 py-1 rounded-lg transition-colors uppercase"
                               >
                                 Todas
                               </button>
                               <button 
                                 onClick={() => setSelectedAnalysis(prev => ({...prev, [key]: []}))}
                                 className="text-[9px] font-black bg-black/10 hover:bg-black/20 text-white/80 px-2 py-1 rounded-lg transition-colors uppercase"
                               >
                                 Ninguna
                               </button>
                             </div>
                           </div>
                           <div className="p-3 space-y-2 bg-slate-50/50">
                             {(generatedData[key] || []).map((item: any, i: number) => {
                               const isSelected = (selectedAnalysis?.[key] || []).includes(item);
                               const text = typeof item === 'string' ? item : item.item;
                               const plan = typeof item === 'object' ? item.plan : null;

                               return (
                                 <label 
                                   key={i} 
                                   className={`flex flex-col gap-2 p-3 rounded-xl border-2 transition-all cursor-pointer group ${isSelected ? 'border-indigo-500 bg-indigo-50 shadow-sm' : 'border-white bg-white hover:border-slate-200 shadow-sm'}`}
                                 >
                                   <div className="flex items-start gap-3">
                                      <div className={`mt-0.5 shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 group-hover:border-indigo-400'}`}>
                                        {isSelected && <FaCheckCircle className="text-white w-3 h-3" />}
                                      </div>
                                      <input 
                                        type="checkbox" 
                                        className="hidden"
                                        checked={isSelected}
                                        onChange={() => toggleAnalysisItem(key, item)}
                                      />
                                      <div className="flex flex-col gap-1">
                                        <span className={`text-xs leading-relaxed font-bold transition-colors ${isSelected ? 'text-indigo-900' : 'text-slate-600'}`}>{text}</span>
                                        {plan && (
                                          <div className={`text-[10px] px-2 py-1 rounded-lg border flex flex-col gap-0.5 ${isSelected ? 'bg-emerald-100 border-emerald-200 text-emerald-800' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                                            <span className="font-black uppercase tracking-tighter text-[8px]">Plan de Mejora:</span>
                                            <span className="font-medium italic">{plan}</span>
                                          </div>
                                        )}
                                      </div>
                                   </div>
                                 </label>
                               );
                             })}
                           </div>
                         </div>
                       );
                     })}
                   </div>

                   <div className="pt-4">
                    <button 
                      onClick={applyAnalysisSelection}
                      className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 shadow-xl flex justify-center items-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <FaCheckCircle className="text-emerald-400" /> APLICAR SELECCIÓN AL DOCUMENTO
                    </button>
                   </div>
                </div>
              ) : (
                <>
                  <h4 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3 uppercase tracking-tight">
                    <div className="w-1.5 h-8 bg-indigo-600 rounded-full"></div>
                    {['policies', 'objectives'].includes(wizardType!) ? `Propuestas de ${wizardType === 'policies' ? 'Políticas' : 'Objetivos'}` : 'Selecciona la mejor propuesta'}
                  </h4>
                  
                  {['policies', 'objectives'].includes(wizardType!) ? (
                    <div className="space-y-4">
                      {/* ... (Policies/Objectives existing logic, can be improved similarly) */}
                      <div className="flex gap-2 mb-2">
                        <button 
                          onClick={() => setSelectedPolicies([...generatedOptions])}
                          className="text-xs text-blue-600 font-bold hover:underline"
                        >
                          Seleccionar Todas
                        </button>
                        <button 
                          onClick={() => setSelectedPolicies([])}
                          className="text-xs text-slate-400 font-bold hover:underline"
                        >
                          Desmarcar Todas
                        </button>
                      </div>
                      {wizardType === 'policies' && (
                        <h4 className="font-bold text-slate-800 italic mb-2 mt-4">{wizardInputs.name || companyName} se compromete a:</h4>
                      )}
                      <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                        {Array.isArray(generatedOptions) && generatedOptions.map((opt, i) => {
                          const isSelected = selectedPolicies.includes(opt);
                          return (
                            <label 
                              key={i}
                              className={`flex items-start gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-all ${isSelected ? 'border-pink-500 bg-pink-50 shadow-md' : 'border-slate-100 bg-white hover:border-slate-300'}`}
                            >
                              <div className={`mt-0.5 shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-pink-600 border-pink-600' : 'border-slate-300'}`}>
                                {isSelected && <FaCheckCircle className="text-white w-3 h-3" />}
                              </div>
                              <input 
                                type="checkbox" 
                                className="hidden"
                                checked={isSelected}
                                onChange={() => togglePolicySelection(opt)}
                              />
                              <span className={`font-bold text-sm leading-relaxed ${isSelected ? 'text-pink-900' : 'text-slate-700'}`}>{opt}</span>
                            </label>
                          );
                        })}
                      </div>
                      <button 
                        onClick={applyMultiSelection}
                        disabled={selectedPolicies.length === 0}
                        className="w-full py-4 bg-pink-600 text-white rounded-2xl font-black hover:bg-pink-700 shadow-xl flex justify-center items-center gap-3 disabled:opacity-50 transition-all hover:scale-[1.02]"
                      >
                        <FaCheckCircle /> AGREGAR {selectedPolicies.length} ELEMENTOS
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {Array.isArray(generatedOptions) && generatedOptions.map((opt, i) => (
                        <div 
                          key={i}
                          onClick={() => applySelection(opt)}
                          className="p-6 border-2 border-slate-100 rounded-2xl hover:border-indigo-500 hover:bg-indigo-50 hover:shadow-xl cursor-pointer transition-all group relative overflow-hidden"
                        >
                          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <div className="flex justify-between items-start gap-4">
                            <p className="text-slate-700 font-bold leading-relaxed text-sm">{opt}</p>
                            <div className="shrink-0 p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-600 transition-colors">
                              <FaMagic className="text-indigo-600 group-hover:text-white w-4 h-4 transition-colors" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
              <button 
                onClick={() => setWizardStep(0)}
                className="text-slate-400 text-sm hover:text-slate-800 underline w-full text-center mt-4"
              >
                Volver y editar respuestas
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
