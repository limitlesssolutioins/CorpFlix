'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { FaSpinner } from 'react-icons/fa';

import { MissionVisionBlock } from '@/components/gestion/planeacion/MissionVisionBlock';
import { PoliciesObjectivesBlock } from '@/components/gestion/planeacion/PoliciesObjectivesBlock';
import { PestelBlock } from '@/components/gestion/planeacion/PestelBlock';
import { SwotBlock } from '@/components/gestion/planeacion/SwotBlock';
import { AIWizardModal } from '@/components/gestion/planeacion/AIWizardModal';

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
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardType, setWizardType] = useState<string | null>(null);
  const [wizardStep, setWizardStep] = useState(0);
  const [wizardInputs, setWizardInputs] = useState<Record<string, any>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOptions, setGeneratedOptions] = useState<string[]>([]);
  const [generatedData, setGeneratedData] = useState<any>(null);
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<Record<string, string[]>>({});
  const [companyName, setCompanyName] = useState('La empresa');
  const [companyActivity, setCompanyActivity] = useState('');

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [res, settingsRes] = await Promise.all([
        axios.get('/api/gestion/planeacion', { timeout: 8000 }),
        axios.get('/api/admin/general', { timeout: 8000 })
      ]);

      if (settingsRes.data?.nombreEmpresa) {
        setCompanyName(settingsRes.data.nombreEmpresa);
      }
      if (settingsRes.data?.sectorActividad) {
        setCompanyActivity(settingsRes.data.sectorActividad);
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
      toast.error('Error cargando planeación');
    } finally {
      setLoading(false);
    }
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

  const toggleBlockEdit = (blockId: string) => {
    setEditingBlocks(prev => ({ ...prev, [blockId]: !prev[blockId] }));
  };

  const addItem = (listName: 'objetivos' | 'politicas', text: string = '') => {
    const newItem = { id: Date.now().toString() + Math.random().toString(), texto: text, meta: 100, progreso: 0 };
    setData((prev: any) => ({ ...prev, [listName]: [...(prev[listName] || []), newItem] }));
  };

  const removeItem = (listName: 'objetivos' | 'politicas', id: string) => {
    setData((prev: any) => ({ ...prev, [listName]: prev[listName].filter((o: any) => o.id !== id) }));
  };

  const updateItem = (listName: 'objetivos' | 'politicas', id: string, field: string, value: any) => {
    const updated = data[listName].map((o: any) => 
      o.id === id ? { ...o, [field]: value } : o
    );
    setData({ ...data, [listName]: updated });
  };

  // --- AI Logic ---
  const startWizard = (type: string) => {
    setWizardType(type);
    setWizardOpen(true);
    setWizardStep(0);

    // For individual SWOT quadrants, pass existing items as context
    const existingSwot: Record<string, string> = {
      'swot-strengths': data.strengths,
      'swot-weaknesses': data.weaknesses,
      'swot-opportunities': data.opportunities,
      'swot-threats': data.threats,
    };

    setWizardInputs({
      name: companyName,
      activity: companyActivity,
      ...(existingSwot[type] ? { existingItems: existingSwot[type] } : {}),
      pestelContext: {
        political: data.political,
        economic: data.economic,
        social: data.social,
        technological: data.technological,
        ecological: data.ecological,
        legal: data.legal
      }
    });
    setGeneratedOptions([]);
    setGeneratedData(null);
    setSelectedPolicies([]);
    setSelectedAnalysis({});
  };

  const generateAIProposals = async () => {
    if (!wizardType) return;
    setIsGenerating(true);
    try {
      const response = await axios.post('/api/generate-strategy', { 
        type: wizardType, 
        inputs: wizardInputs 
      });
      
      if (response.data.data) {
        const rawData = response.data.data;
        setGeneratedData(rawData);
        
        const initialSelection: Record<string, string[]> = {};
        Object.keys(rawData).forEach(key => {
            if (Array.isArray(rawData[key])) {
                initialSelection[key] = [...rawData[key]];
            }
        });
        setSelectedAnalysis(initialSelection);
      } else {
        setGeneratedOptions(response.data.options || []);
      }
      setWizardStep(1);
    } catch (error) {
      toast.error("Error conectando con la IA");
    } finally {
      setIsGenerating(false);
    }
  };

  const applySelection = (selection: any) => {
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
    else if (wizardType?.startsWith('pestel-')) {
      const sector = wizardType.split('-')[1];
      const currentVal = data[sector] ? data[sector] + '\n' : '';
      setData({ ...data, [sector]: currentVal + `• ${selection}` });
    }
    
    setWizardOpen(false);
    toast.success("Contenido generado aplicado");
  };

  const togglePolicySelection = (policy: string) => {
    if (selectedPolicies.includes(policy)) {
      setSelectedPolicies(selectedPolicies.filter(p => p !== policy));
    } else {
      setSelectedPolicies([...selectedPolicies, policy]);
    }
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

  const toggleAnalysisItem = (category: string, item: string) => {
    const currentList = selectedAnalysis[category] || [];
    if (currentList.includes(item)) {
      setSelectedAnalysis({
        ...selectedAnalysis,
        [category]: currentList.filter(i => i !== item)
      });
    } else {
      setSelectedAnalysis({
        ...selectedAnalysis,
        [category]: [...currentList, item]
      });
    }
  };

  const applyAnalysisSelection = () => {
    if (wizardType) {
      setEditingBlocks(prev => ({ ...prev, [wizardType.startsWith('swot') ? 'swot' : wizardType]: true }));
    }
    const formatList = (list: any[]) => {
      return list.map(s => {
        if (typeof s === 'string') return `• ${s}`;
        if (s.item) return `• ${s.item}`;
        return '';
      }).filter(Boolean).join('\n');
    };

    if (wizardType === 'swot') {
      setData((prev: any) => ({
        ...prev,
        strengths: formatList(selectedAnalysis.strengths || []),
        weaknesses: formatList(selectedAnalysis.weaknesses || []),
        opportunities: formatList(selectedAnalysis.opportunities || []),
        threats: formatList(selectedAnalysis.threats || [])
      }));
    } else if (wizardType?.startsWith('swot-')) {
      // Individual quadrant: append to existing content
      const quadrant = wizardType.split('-')[1]; // strengths, weaknesses, opportunities, threats
      const newItems = formatList(selectedAnalysis[quadrant] || []);
      setData((prev: any) => {
        const existing = prev[quadrant] ? prev[quadrant].trim() : '';
        return {
          ...prev,
          [quadrant]: existing ? `${existing}\n${newItems}` : newItems
        };
      });
    } else if (wizardType === 'pestel' || wizardType?.startsWith('pestel-')) {
      if (wizardType === 'pestel') {
        setData((prev: any) => ({
          ...prev,
          political: formatList(selectedAnalysis.political || []),
          economic: formatList(selectedAnalysis.economic || []),
          social: formatList(selectedAnalysis.social || []),
          technological: formatList(selectedAnalysis.technological || []),
          ecological: formatList(selectedAnalysis.ecological || []),
          legal: formatList(selectedAnalysis.legal || [])
        }));
      } else {
        const sector = wizardType.split('-')[1];
        setData((prev: any) => ({
          ...prev,
          [sector]: formatList(selectedAnalysis[sector] || [])
        }));
      }
    }
    setWizardOpen(false);
    toast.success("Análisis aplicado correctamente");
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <FaSpinner className="animate-spin text-4xl text-slate-300 mb-4" />
      <p className="text-slate-500 font-medium animate-pulse">Cargando estrategia...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 relative">
      
      <AIWizardModal 
        wizardOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
        wizardType={wizardType}
        wizardStep={wizardStep}
        setWizardStep={setWizardStep}
        wizardInputs={wizardInputs}
        setWizardInputs={setWizardInputs}
        generatedData={generatedData}
        generatedOptions={generatedOptions}
        isGenerating={isGenerating}
        generateAIProposals={generateAIProposals}
        applySelection={applySelection}
        selectedPolicies={selectedPolicies}
        selectedAnalysis={selectedAnalysis}
        togglePolicySelection={togglePolicySelection}
        toggleAnalysisItem={toggleAnalysisItem}
        applyMultiSelection={applyMultiSelection}
        applyAnalysisSelection={applyAnalysisSelection}
        setSelectedPolicies={setSelectedPolicies}
        setSelectedAnalysis={setSelectedAnalysis}
        companyName={companyName}
        companyActivity={companyActivity}
        data={data}
      />

      {/* Header Page */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Planeación Estratégica</h1>
          <p className="text-slate-500 font-medium italic">Define el norte de tu organización.</p>
        </div>
      </div>

      <MissionVisionBlock 
        data={data}
        setData={setData}
        isEditing={editingBlocks.missionVision}
        onEdit={() => toggleBlockEdit('missionVision')}
        onSave={() => handleSave('missionVision')}
        saving={saving}
        startWizard={startWizard}
      />

      <PoliciesObjectivesBlock 
        data={data}
        updateItem={updateItem}
        addItem={addItem}
        removeItem={removeItem}
        companyName={companyName}
        editingPolicies={editingBlocks.policies}
        editingObjectives={editingBlocks.objectives}
        onEditPolicies={() => toggleBlockEdit('policies')}
        onSavePolicies={() => handleSave('policies')}
        onEditObjectives={() => toggleBlockEdit('objectives')}
        onSaveObjectives={() => handleSave('objectives')}
        saving={saving}
        startWizard={startWizard}
      />

      <PestelBlock 
        data={data}
        setData={setData}
        isEditing={editingBlocks.pestel}
        onEdit={() => toggleBlockEdit('pestel')}
        onSave={() => handleSave('pestel')}
        saving={saving}
        startWizard={startWizard}
      />

      <SwotBlock 
        data={data}
        setData={setData}
        isEditing={editingBlocks.swot}
        onEdit={() => toggleBlockEdit('swot')}
        onSave={() => handleSave('swot')}
        saving={saving}
        startWizard={startWizard}
      />
      
    </div>
  );
}
