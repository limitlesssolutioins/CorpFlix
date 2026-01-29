'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { 
  FaBullseye, 
  FaLightbulb, 
  FaShieldAlt, 
  FaChartLine, 
  FaGlobe, 
  FaBalanceScale, 
  FaLeaf, 
  FaCogs, 
  FaUsers, 
  FaMoneyBillWave,
  FaPlus,
  FaTrash,
  FaSave,
  FaSpinner,
  FaExclamationTriangle,
  FaRocket,
  FaMagic,
  FaRobot,
  FaTimes,
  FaCheckCircle,
  FaFileContract,
  FaBrain
} from 'react-icons/fa';

export default function PlaneacionPage() {
  const [data, setData] = useState<any>({
    mision: '',
    vision: '',
    politicas: [],
    objetivos: [],
    strengths: '',
    weaknesses: '',
    opportunities: '',
    threats: '',
    political: '',
    economic: '',
    social: '',
    technological: '',
    ecological: '',
    legal: ''
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingBlocks, setEditingBlocks] = useState<Record<string, boolean>>({
    missionVision: false,
    policies: false,
    objectives: false,
    pestel: false,
    swot: false
  });

  // --- AI Wizard State ---
  // ... (keep wizard states)

  const fetchData = async () => {
    try {
      // Set timeout to prevent hanging
      const [res, settingsRes] = await Promise.all([
        axios.get('/api/gestion/planeacion', { timeout: 8000 }),
        axios.get('/api/settings', { timeout: 8000 })
      ]);
      
      if (settingsRes.data?.companyName) {
        setCompanyName(settingsRes.data.companyName);
      }

      const backendData = res.data || {};
      setData({
        ...backendData,
        politicas: backendData.politicas || [],
        objetivos: backendData.objetivos || [],
        mision: backendData.mision || '',
        vision: backendData.vision || '',
        strengths: backendData.strengths || '',
        weaknesses: backendData.weaknesses || '',
        opportunities: backendData.opportunities || '',
        threats: backendData.threats || '',
        political: backendData.political || '',
        economic: backendData.economic || '',
        social: backendData.social || '',
        technological: backendData.technological || '',
        ecological: backendData.ecological || backendData.environmental || '',
        legal: backendData.legal || ''
      });
    } catch (error) {
      console.error("Error fetching strategy data:", error);
      toast.error('Error cargando planeación (Tiempo de espera agotado o error de servidor)');
    } finally {
      setLoading(false);
    }
  };

  const toggleBlockEdit = (blockId: string) => {
    setEditingBlocks(prev => ({ ...prev, [blockId]: !prev[blockId] }));
  };

  const handleSave = async (blockId?: string) => {
    setSaving(true);
    try {
      await axios.post('/api/gestion/planeacion', data);
      toast.success('Cambios guardados correctamente');
      if (blockId) {
        setEditingBlocks(prev => ({ ...prev, [blockId]: false }));
      }
    } catch (error) {
      toast.error('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  // ... (List Management items)

  const applySelection = (selection: any) => {
    // If AI generates something, we ensure the block is in edit mode
    const typeToBlock: Record<string, string> = {
      mission: 'missionVision',
      vision: 'missionVision',
      policies: 'policies',
      objectives: 'objectives',
      swot: 'swot',
      pestel: 'pestel'
    };
    
    if (wizardType) {
      setEditingBlocks(prev => ({ ...prev, [typeToBlock[wizardType]]: true }));
    }
    
    if (wizardType === 'mission') setData({ ...data, mision: selection });
    else if (wizardType === 'vision') setData({ ...data, vision: selection });
    // ... (rest of applySelection)
  };

  const applyMultiSelection = () => {
    if (wizardType) {
      setEditingBlocks(prev => ({ ...prev, [wizardType === 'policies' ? 'policies' : 'objectives']: true }));
    }
    const targetList = wizardType === 'policies' ? 'politicas' : 'objetivos';
    selectedPolicies.forEach(p => addItem(targetList, p));
    setWizardOpen(false);
    toast.success(`${selectedPolicies.length} elementos agregados`);
  };

  const applyAnalysisSelection = () => {
    if (wizardType) {
      setEditingBlocks(prev => ({ ...prev, [wizardType]: true }));
    }
    const formatList = (list: string[]) => list.map(s => `• ${s}`).join('\n');
  };

  const renderWizardInputs = () => {
    if (wizardType === 'mission') {
      return (
        <>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">1. ¿Quiénes somos? (Nombre de la empresa)</label>
            <input 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Ej: Muebles del Valle S.A."
              onChange={(e) => setWizardInputs({...wizardInputs, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">2. ¿Qué ofrecemos? (Servicios o productos)</label>
            <textarea 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              rows={2}
              placeholder="Ej: Fabricación de muebles de madera sostenible..."
              onChange={(e) => setWizardInputs({...wizardInputs, offerings: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">3. ¿Quiénes son tus clientes o mercado objetivo?</label>
            <input 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Ej: Familias jóvenes en el área metropolitana..."
              onChange={(e) => setWizardInputs({...wizardInputs, clients: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">4. ¿Cuál es tu valor agregado? (Diferenciador)</label>
            <textarea 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              rows={2}
              placeholder="Ej: Diseños personalizados y garantía de por vida..."
              onChange={(e) => setWizardInputs({...wizardInputs, differentiator: e.target.value})}
            />
          </div>
        </>
      );
    }

    if (wizardType === 'vision') {
      return (
        <>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">1. Nombre de la empresa</label>
            <input 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
              placeholder="Ej: TechSolutions..."
              onChange={(e) => setWizardInputs({...wizardInputs, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">2. Fecha objetivo (¿Para cuándo?)</label>
            <input 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
              placeholder="Ej: 2030"
              onChange={(e) => setWizardInputs({...wizardInputs, date: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">3. Localidad o Alcance</label>
            <input 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
              placeholder="Ej: Nivel Nacional, Latinoamérica..."
              onChange={(e) => setWizardInputs({...wizardInputs, scope: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">4. ¿Cómo se visiona para ese año?</label>
            <textarea 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
              rows={2}
              placeholder="Ej: Siendo líderes en innovación tecnológica..."
              onChange={(e) => setWizardInputs({...wizardInputs, goal: e.target.value})}
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
              onChange={(e) => setWizardInputs({...wizardInputs, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Sector Económico</label>
            <input 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all"
              placeholder="Ej: Tecnológico, Industrial, Servicios..."
              onChange={(e) => setWizardInputs({...wizardInputs, sector: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Actividad Económica</label>
            <textarea 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all"
              rows={3}
              placeholder="Ej: Desarrollo de software a medida y consultoría..."
              onChange={(e) => setWizardInputs({...wizardInputs, activity: e.target.value})}
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
                onChange={(e) => setWizardInputs(prev => ({...prev, activity: e.target.value}))}
              />
            </div>
          )}
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
            onChange={(e) => setWizardInputs({...wizardInputs, name: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Sector / Actividad</label>
          <textarea 
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            rows={3}
            placeholder="Ej: Desarrollo de software, Construcción, Salud..."
            onChange={(e) => setWizardInputs({...wizardInputs, activity: e.target.value})}
          />
        </div>
      </>
    );
  };

  if (loading) return <div className="p-8 text-slate-500">Cargando estrategia...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 relative">
      
      {/* --- AI WIZARD MODAL --- */}
      {wizardOpen && wizardType && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                  <FaBrain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-wider">Generador de {wizardType === 'mission' ? 'Misión' : wizardType === 'vision' ? 'Visión' : 'Estrategia'}</h3>
                  <p className="text-indigo-100 text-sm">Gemini IA te ayudará a redactarla.</p>
                </div>
              </div>
              <button onClick={() => setWizardOpen(false)} className="text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors">
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto custom-scrollbar">
              {wizardStep === 0 && (
                <div className="space-y-6">
                  {renderWizardInputs()}
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
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto pr-2">
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
                           
                           return (
                             <div key={key} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                               <div className="flex justify-between items-center mb-3">
                                 <h5 className="font-bold text-slate-700 uppercase text-xs tracking-widest border-b-2 border-indigo-100 pb-1">
                                   {translations[key] || key}
                                 </h5>
                                 <div className="flex gap-2">
                                   <button 
                                     onClick={() => setSelectedAnalysis(prev => ({...prev, [key]: generatedData[key]}))}
                                     className="text-[10px] font-bold text-blue-600 hover:underline"
                                   >
                                     Todas
                                   </button>
                                   <button 
                                     onClick={() => setSelectedAnalysis(prev => ({...prev, [key]: []}))}
                                     className="text-[10px] font-bold text-slate-400 hover:underline"
                                   >
                                     Ninguna
                                   </button>
                                 </div>
                               </div>
                               <div className="space-y-2">
                                 {(generatedData[key] || []).map((item: string, i: number) => (
                                   <label key={i} className="flex items-start gap-2 cursor-pointer hover:bg-white p-2 rounded-lg transition-colors">
                                     <input 
                                       type="checkbox" 
                                       className="mt-1 w-4 h-4 accent-indigo-600 shrink-0"
                                       checked={(selectedAnalysis && selectedAnalysis[key] && selectedAnalysis[key].includes(item)) || false}
                                       onChange={() => toggleAnalysisItem(key, item)}
                                     />
                                     <span className="text-xs text-slate-600 font-medium leading-relaxed">{item}</span>
                                   </label>
                                 ))}
                               </div>
                             </div>
                           );
                         })}
                       </div>

                       <button 
                        onClick={applyAnalysisSelection}
                        className="w-full py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 shadow-lg flex justify-center items-center gap-2 sticky bottom-0"
                      >
                        <FaCheckCircle /> Guardar Selección de Análisis
                      </button>
                    </div>
                  ) : (
                    <>
                      <h4 className="text-lg font-bold text-slate-800 mb-4">
                        {['policies', 'objectives'].includes(wizardType!) ? `Selecciona ${wizardType === 'policies' ? 'las políticas' : 'los objetivos'} a incluir:` : 'Selecciona una opción:'}
                      </h4>
                      
                      {['policies', 'objectives'].includes(wizardType!) ? (
                        <div className="space-y-4">
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
                          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                            {generatedOptions.map((opt, i) => (
                              <label 
                                key={i}
                                className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${selectedPolicies.includes(opt) ? 'border-pink-500 bg-pink-50' : 'border-slate-100 hover:bg-slate-50'}`}
                              >
                                <input 
                                  type="checkbox" 
                                  className="mt-1 w-5 h-5 accent-pink-500"
                                  checked={selectedPolicies.includes(opt)}
                                  onChange={() => togglePolicySelection(opt)}
                                />
                                <span className="text-slate-700 font-medium text-sm">{opt}</span>
                              </label>
                            ))}
                          </div>
                          <button 
                            onClick={applyMultiSelection}
                            disabled={selectedPolicies.length === 0}
                            className="w-full py-3 bg-pink-600 text-white rounded-xl font-bold hover:bg-pink-700 shadow-lg flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          >
                            <FaCheckCircle /> Guardar ({selectedPolicies.length}) Elementos
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {generatedOptions.map((opt, i) => (
                            <div 
                              key={i}
                              onClick={() => applySelection(opt)}
                              className="p-4 border-2 border-slate-100 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 cursor-pointer transition-all group relative"
                            >
                              <p className="text-slate-700 font-medium pr-8">{opt}</p>
                              <FaCheckCircle className="absolute top-4 right-4 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
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
      )}

      {/* Header Page */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Planeación Estratégica</h1>
          <p className="text-slate-500 font-medium italic">Define el norte de tu organización.</p>
        </div>
      </div>

      {/* Misión / Visión */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-2">
            <FaBullseye className="text-blue-600" /> Identidad Corporativa
          </h3>
          <div className="flex gap-2">
            {!editingBlocks.missionVision ? (
              <button onClick={() => toggleBlockEdit('missionVision')} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-200 transition-all">Editar Bloque</button>
            ) : (
              <button onClick={() => handleSave('missionVision')} disabled={saving} className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition-all flex items-center gap-2">
                {saving ? <FaSpinner className="animate-spin" /> : <FaSave />} Aceptar
              </button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="relative group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Misión</span>
              {editingBlocks.missionVision && (
                <button onClick={() => startWizard('mission')} className="ai-btn bg-blue-50 text-blue-600">
                  <FaMagic /> IA
                </button>
              )}
            </div>
            {editingBlocks.missionVision ? (
              <textarea 
                className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-xl resize-none outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 font-medium"
                value={data.mision}
                onChange={(e) => setData({...data, mision: e.target.value})}
              />
            ) : <p className="text-slate-600 text-lg leading-relaxed font-medium">{data.mision || 'No definida'}</p>}
          </div>

          <div className="relative group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Visión</span>
              {editingBlocks.missionVision && (
                <button onClick={() => startWizard('vision')} className="ai-btn bg-purple-50 text-purple-600">
                  <FaMagic /> IA
                </button>
              )}
            </div>
            {editingBlocks.missionVision ? (
              <textarea 
                className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-xl resize-none outline-none focus:ring-2 focus:ring-purple-500 transition-all text-slate-700 font-medium"
                value={data.vision}
                onChange={(e) => setData({...data, vision: e.target.value})}
              />
            ) : <p className="text-slate-600 text-lg leading-relaxed font-medium">{data.vision || 'No definida'}</p>}
          </div>
        </div>
      </div>

      {/* Políticas & Objetivos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Políticas */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
               <FaFileContract className="text-pink-500" size={24} />
               <h3 className="text-xl font-black text-slate-900">Políticas</h3>
            </div>
             <div className="flex gap-2">
               {!editingBlocks.policies ? (
                 <button onClick={() => toggleBlockEdit('policies')} className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg font-bold text-[10px] uppercase hover:bg-slate-200 transition-all">Editar</button>
               ) : (
                 <button onClick={() => handleSave('policies')} disabled={saving} className="px-3 py-1.5 bg-slate-900 text-white rounded-lg font-bold text-[10px] uppercase hover:bg-slate-800 transition-all">Aceptar</button>
               )}
               {editingBlocks.policies && (
                 <>
                   <button onClick={() => startWizard('policies')} className="ai-btn bg-pink-50 text-pink-600"><FaMagic /> IA</button>
                   <button onClick={() => addItem('politicas')} className="action-btn text-pink-600"><FaPlus /></button>
                 </>
               )}
             </div>
          </div>
          <div className="space-y-4">
             <h4 className="font-bold text-slate-800 italic mb-4 px-3 bg-slate-50 py-2 rounded-lg border border-slate-100">{companyName} se compromete a:</h4>
             {(data.politicas || []).map((pol: any, idx: number) => (
              <div key={pol.id} className="flex items-start gap-3 group">
                <div className="mt-4 w-2 h-2 rounded-full bg-pink-400 shrink-0" />
                {editingBlocks.policies ? (
                  <div className="flex-1 flex gap-2">
                    <textarea 
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-pink-500 min-h-[80px] resize-none text-slate-700"
                      value={pol.texto}
                      onChange={(e) => updateItem('politicas', pol.id, 'texto', e.target.value)}
                    />
                    <button onClick={() => removeItem('politicas', pol.id)} className="text-slate-300 hover:text-red-500 p-2"><FaTrash /></button>
                  </div>
                ) : <p className="text-slate-700 font-medium leading-relaxed">{pol.texto}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Objetivos */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
             <div className="flex items-center gap-3">
               <FaRocket className="text-blue-500" size={24} />
               <h3 className="text-xl font-black text-slate-900">Objetivos</h3>
            </div>
             <div className="flex gap-2">
                {!editingBlocks.objectives ? (
                  <button onClick={() => toggleBlockEdit('objectives')} className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg font-bold text-[10px] uppercase hover:bg-slate-200 transition-all">Editar</button>
                ) : (
                  <button onClick={() => handleSave('objectives')} disabled={saving} className="px-3 py-1.5 bg-slate-900 text-white rounded-lg font-bold text-[10px] uppercase hover:bg-slate-800 transition-all">Aceptar</button>
                )}
                {editingBlocks.objectives && (
                  <>
                    <button onClick={() => startWizard('objectives')} className="ai-btn bg-blue-50 text-blue-600"><FaMagic /> IA</button>
                    <button onClick={() => addItem('objetivos')} className="action-btn text-blue-600"><FaPlus /></button>
                  </>
                )}
             </div>
          </div>
          <div className="space-y-4">
            {(data.objetivos || []).map((obj: any, idx: number) => (
              <div key={obj.id} className="group">
                <div className="flex items-start gap-4">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-500 font-bold text-xs shrink-0 mt-1">{idx + 1}</span>
                  <div className="flex-1">
                    {editingBlocks.objectives ? (
                      <div className="flex gap-2">
                        <textarea 
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-blue-500 min-h-[80px] resize-none text-slate-700"
                          value={obj.texto}
                          onChange={(e) => updateItem('objetivos', obj.id, 'texto', e.target.value)}
                        />
                         <button onClick={() => removeItem('objetivos', obj.id)} className="text-slate-300 hover:text-red-500 p-2"><FaTrash /></button>
                      </div>
                    ) : <p className="text-slate-800 font-bold text-sm leading-relaxed">{obj.texto}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PESTEL Analysis */}
      <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50">
        <div className="flex justify-between items-center mb-8">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><FaGlobe size={24} /></div>
              <h3 className="text-2xl font-black text-slate-900">Análisis PESTEL</h3>
           </div>
           <div className="flex gap-2">
              {!editingBlocks.pestel ? (
                <button onClick={() => toggleBlockEdit('pestel')} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-200 transition-all">Editar Análisis</button>
              ) : (
                <button onClick={() => handleSave('pestel')} disabled={saving} className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition-all">Aceptar</button>
              )}
              {editingBlocks.pestel && (
                <button onClick={() => startWizard('pestel')} className="ai-btn bg-indigo-50 text-indigo-600 hover:bg-indigo-100">
                  <FaMagic /> Generar con IA
                </button>
              )}
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { 
              id: 'political', 
              label: 'Político', 
              icon: FaGlobe, 
              color: 'text-blue-500',
              desc: 'Examina las influencias políticas que podrían afectar a tu organización. Considera cuestiones como estabilidad política, elecciones, políticas fiscales, regulaciones gubernamentales y tratados internacionales.'
            },
            { 
              id: 'economic', 
              label: 'Económico', 
              icon: FaMoneyBillWave, 
              color: 'text-emerald-500',
              desc: 'Evalúa las condiciones económicas que podrían tener un impacto en tu organización. Esto incluye factores como tasas de crecimiento económico, inflación, tasas de interés, desempleo, fluctuaciones de la moneda y ciclos económicos.'
            },
            { 
              id: 'social', 
              label: 'Social', 
              icon: FaUsers, 
              color: 'text-pink-500',
              desc: 'Analiza los aspectos culturales, demográficos y sociales que podrían influir en tu organización. Examina tendencias de consumo, cambios demográficos, valores culturales, comportamientos de los consumidores y factores socioculturales.'
            },
            { 
              id: 'technological', 
              label: 'Tecnológico', 
              icon: FaCogs, 
              color: 'text-purple-500',
              desc: 'Considera las innovaciones y avances tecnológicos que podrían afectar a tu organización. Examina cambios en la tecnología, investigación y desarrollo, automatización, adopción de tecnología por parte de los consumidores y competencia tecnológica.'
            },
            { 
              id: 'ecological', 
              label: 'Ecológico', 
              icon: FaLeaf, 
              color: 'text-green-600',
              desc: 'Evalúa el impacto ambiental y las preocupaciones de sostenibilidad. Examina regulaciones ambientales, conciencia ambiental de los consumidores, cambios climáticos, escasez de recursos naturales y tendencias de sostenibilidad.'
            },
            { 
              id: 'legal', 
              label: 'Legal', 
              icon: FaBalanceScale, 
              color: 'text-slate-600',
              desc: 'Considera el marco legal en el que opera tu organización. Examina leyes laborales, regulaciones de salud y seguridad, leyes de competencia, protección de datos, propiedad intelectual y otras cuestiones legales relevantes.'
            },
          ].map((item) => (
            <div key={item.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-100 transition-colors group relative">
              <div className="flex items-center gap-2 mb-3 relative">
                <item.icon className={item.color} />
                <h4 className="font-bold text-slate-900 cursor-help">{item.label}</h4>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-0 mb-2 w-64 p-4 bg-slate-800 text-white text-xs rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 font-medium leading-relaxed">
                  {item.desc}
                  <div className="absolute top-full left-4 -mt-1 border-4 border-transparent border-t-slate-800"></div>
                </div>
              </div>
              {editingBlocks.pestel ? (
                <textarea 
                  className="w-full h-32 p-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none text-slate-700 font-medium"
                  value={data[item.id]}
                  onChange={(e) => setData({ ...data, [item.id]: e.target.value })}
                  placeholder={`Factores ${item.label.toLowerCase()}...`}
                />
              ) : <p className="text-sm text-slate-600 leading-relaxed min-h-[3rem] font-medium whitespace-pre-line">{data[item.id] || <span className="text-slate-400 italic">No definido</span>}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* DOFA Analysis */}
      <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50">
        <div className="flex justify-between items-center mb-8">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-900 text-white rounded-xl"><FaChartLine /></div>
              <h3 className="text-2xl font-black text-slate-900">Análisis DOFA</h3>
           </div>
           <div className="flex gap-2">
              {!editingBlocks.swot ? (
                <button onClick={() => toggleBlockEdit('swot')} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-200 transition-all">Editar Análisis</button>
              ) : (
                <button onClick={() => handleSave('swot')} disabled={saving} className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition-all">Aceptar</button>
              )}
              {editingBlocks.swot && (
                <button onClick={() => startWizard('swot')} className="ai-btn bg-slate-100 text-slate-700 hover:bg-slate-200">
                  <FaMagic /> Generar con IA
                </button>
              )}
           </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
            <h4 className="flex items-center gap-2 font-black text-emerald-700 uppercase text-xs tracking-widest mb-2"><FaShieldAlt /> Fortalezas</h4>
            {editingBlocks.swot ? <textarea className="w-full p-3 bg-white/50 border border-emerald-200 rounded-xl outline-none h-40 resize-none text-slate-700 font-medium" value={data.strengths} onChange={e => setData({...data, strengths: e.target.value})} /> : <p className="text-slate-700 whitespace-pre-wrap font-medium">{data.strengths}</p>}
          </div>
          <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100">
            <h4 className="flex items-center gap-2 font-black text-amber-700 uppercase text-xs tracking-widest mb-2"><FaBalanceScale /> Debilidades</h4>
            {editingBlocks.swot ? <textarea className="w-full p-3 bg-white/50 border border-amber-200 rounded-xl outline-none h-40 resize-none text-slate-700 font-medium" value={data.weaknesses} onChange={e => setData({...data, weaknesses: e.target.value})} /> : <p className="text-slate-700 whitespace-pre-wrap font-medium">{data.weaknesses}</p>}
          </div>
          <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
            <h4 className="flex items-center gap-2 font-black text-blue-700 uppercase text-xs tracking-widest mb-2"><FaRocket /> Oportunidades</h4>
            {editingBlocks.swot ? <textarea className="w-full p-3 bg-white/50 border border-blue-200 rounded-xl outline-none h-40 resize-none text-slate-700 font-medium" value={data.opportunities} onChange={e => setData({...data, opportunities: e.target.value})} /> : <p className="text-slate-700 whitespace-pre-wrap font-medium">{data.opportunities}</p>}
          </div>
          <div className="p-6 bg-red-50 rounded-2xl border border-red-100">
            <h4 className="flex items-center gap-2 font-black text-red-700 uppercase text-xs tracking-widest mb-2"><FaExclamationTriangle /> Amenazas</h4>
            {editingBlocks.swot ? <textarea className="w-full p-3 bg-white/50 border border-red-200 rounded-xl outline-none h-40 resize-none text-slate-700 font-medium" value={data.threats} onChange={e => setData({...data, threats: e.target.value})} /> : <p className="text-slate-700 whitespace-pre-wrap font-medium">{data.threats}</p>}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .ai-btn {
          @apply text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1 transition-colors border border-transparent hover:border-current;
        }
        .action-btn {
          @apply p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors;
        }
      `}</style>
    </div>
  );
}