'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  ShieldCheck, 
  Save,
  AlertTriangle,
  X,
  Search,
  Filter
} from 'lucide-react';
import RiskMatrix, { ExtendedRisk } from './RiskMatrix';
import { getRiskCatalogsAction } from '@/actions/risks';
import { toast } from 'sonner';

interface RiskManagementProps {
  initialRisks?: ExtendedRisk[];
  onSave?: (risks: ExtendedRisk[]) => void;
}

const RiskManagement = ({ initialRisks = [], onSave }: RiskManagementProps) => {
  const [risks, setRisks] = useState<ExtendedRisk[]>(initialRisks);
  const [viewMode, setViewMode] = useState<'matrix' | 'table'>('table');
  const [activeTab, setActiveTab] = useState<'Calidad' | 'SST' | 'Ambiental' | 'Todos'>('Todos');
  const [showForm, setShowForm] = useState(false);
  const [catalogs, setCatalogs] = useState<any>({ calidad: [], sst: [], ambiental: [] });
  
  // Form State
  const [formData, setFormData] = useState<Partial<ExtendedRisk>>({
    proceso: '',
    actividad: '',
    nombre: '',
    descripcion: '',
    causa: '',
    consecuencia: '',
    probability: 1,
    impact: 1,
    controles: '',
    eficacia: 1,
    probabilidadResidual: 1,
    impactoResidual: 1,
    planAccion: '',
    categoria: 'Calidad',
    // Specialized fields
    tipoActividad: 'RUTINARIA',
    condicionOperacion: 'NORMAL',
    expuestos: { fijo: 0, temporal: 0, contratista: 0, visitante: 0 }
  });

  useEffect(() => {
    if (initialRisks.length > 0) {
      setRisks(initialRisks);
    }
    fetchCatalogs();
  }, [initialRisks]);

  const fetchCatalogs = async () => {
    const res = await getRiskCatalogsAction();
    if (res.success) {
      setCatalogs(res.data);
    }
  };

  const calculateRiskLevel = (p: number, i: number) => p * i;

  const handleInputChange = (field: keyof ExtendedRisk, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleExpuestosChange = (type: 'fijo' | 'temporal' | 'contratista' | 'visitante', val: number) => {
    setFormData(prev => ({
        ...prev,
        expuestos: { ...prev.expuestos!, [type]: val }
    }));
  };

  const handleCatalogSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDesc = e.target.value;
    if (!selectedDesc) return;

    // Find in catalogs based on current category
    let foundItem;
    if (formData.categoria === 'Calidad') foundItem = catalogs.calidad.find((c: any) => c.descripcion === selectedDesc);
    else if (formData.categoria === 'SST') foundItem = catalogs.sst.find((c: any) => c.descripcion === selectedDesc);
    else if (formData.categoria === 'Ambiental') foundItem = catalogs.ambiental.find((c: any) => c.descripcion === selectedDesc);

    if (foundItem) {
        setFormData(prev => ({
            ...prev,
            nombre: foundItem.nombre,
            descripcion: foundItem.descripcion,
            causa: foundItem.causa,
            consecuencia: foundItem.consecuencia
        }));
    } else {
        // Custom input case
        setFormData(prev => ({ ...prev, descripcion: selectedDesc }));
    }
  };

  const handleSubmit = () => {
    if (!formData.proceso || !formData.descripcion) {
      toast.error("Complete Proceso y Descripción del Riesgo");
      return;
    }

    const prob = Number(formData.probability || 1);
    const imp = Number(formData.impact || 1);
    const probRes = Number(formData.probabilidadResidual || 1);
    const impRes = Number(formData.impactoResidual || 1);

    const newRisk: ExtendedRisk = {
      id: formData.id || `R-${Date.now()}`,
      proceso: formData.proceso!,
      actividad: formData.actividad || '',
      nombre: formData.nombre || formData.descripcion!.substring(0, 30),
      descripcion: formData.descripcion!,
      causa: formData.causa || '',
      consecuencia: formData.consecuencia || '',
      probability: prob,
      impact: imp,
      nivelRiesgo: calculateRiskLevel(prob, imp),
      controles: formData.controles || '',
      eficacia: Number(formData.eficacia || 1),
      probabilidadResidual: probRes,
      impactoResidual: impRes,
      nivelRiesgoResidual: calculateRiskLevel(probRes, impRes),
      planAccion: formData.planAccion || '',
      categoria: formData.categoria || 'Calidad',
      // Specialized
      tipoActividad: formData.categoria === 'SST' ? formData.tipoActividad : undefined,
      condicionOperacion: formData.categoria === 'Ambiental' ? formData.condicionOperacion : undefined,
      expuestos: formData.categoria === 'SST' ? formData.expuestos : undefined
    };

    const updatedRisks = [...risks, newRisk];
    setRisks(updatedRisks);
    if (onSave) onSave(updatedRisks);
    
    setShowForm(false);
    resetForm();
    toast.success("Riesgo registrado exitosamente");
  };

  const resetForm = () => {
    setFormData({
        proceso: '',
        actividad: '',
        nombre: '',
        descripcion: '',
        causa: '',
        consecuencia: '',
        probability: 1,
        impact: 1,
        controles: '',
        eficacia: 1,
        probabilidadResidual: 1,
        impactoResidual: 1,
        planAccion: '',
        categoria: activeTab === 'Todos' ? 'Calidad' : activeTab,
        tipoActividad: 'RUTINARIA',
        condicionOperacion: 'NORMAL',
        expuestos: { fijo: 0, temporal: 0, contratista: 0, visitante: 0 }
    });
  };

  const getRiskColor = (level: number) => {
    if (level >= 16) return 'bg-red-500 text-white';
    if (level >= 5) return 'bg-yellow-400 text-slate-900';
    return 'bg-emerald-500 text-white';
  };

  const getShortLabel = (level: number) => {
    if (level >= 16) return 'ALTO';
    if (level >= 5) return 'MEDIO';
    return 'BAJO';
  };

  const filteredRisks = activeTab === 'Todos' ? risks : risks.filter(r => r.categoria === activeTab);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Category Tabs */}
      <div className="flex overflow-x-auto pb-2 gap-2 border-b border-slate-200">
        {['Todos', 'Calidad', 'SST', 'Ambiental', 'Financiero', 'Ciberseguridad'].map(cat => (
            <button
                key={cat}
                onClick={() => setActiveTab(cat as any)}
                className={`px-5 py-2.5 rounded-t-xl text-sm font-black uppercase tracking-wide transition-all ${activeTab === cat ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
            >
                {cat === 'SST' ? 'Seguridad y Salud' : cat}
            </button>
        ))}
      </div>

      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setViewMode('table')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'table' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Matriz Detallada
          </button>
          <button 
            onClick={() => setViewMode('matrix')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'matrix' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Mapa de Calor
          </button>
        </div>
        <button 
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-black hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
        >
          <Plus size={18} /> AGREGAR RIESGO
        </button>
      </div>

      {/* Creation Modal / Form */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-2xl font-black text-slate-900">Nuevo Registro de Riesgo</h3>
                <p className="text-sm text-slate-500 font-medium">Complete todos los campos de la matriz de riesgos.</p>
              </div>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* LEFT COLUMN: Context & Description */}
                <div className="space-y-6">
                    <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-indigo-600"></div> CONTEXTO Y DESCRIPCIÓN
                    </h4>
                    
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Categoría del Riesgo</label>
                        <select value={formData.categoria} onChange={(e) => handleInputChange('categoria', e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all">
                            <option value="Calidad">Calidad</option>
                            <option value="SST">Seguridad y Salud (SST)</option>
                            <option value="Ambiental">Ambiental</option>
                            <option value="Financiero">Financiero</option>
                            <option value="Ciberseguridad">Ciberseguridad</option>
                            <option value="Operativo">Operativo</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Proceso</label>
                            <input type="text" value={formData.proceso} onChange={(e) => handleInputChange('proceso', e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold outline-none focus:border-indigo-500" placeholder="Ej: Comercial" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Actividad</label>
                            <input type="text" value={formData.actividad} onChange={(e) => handleInputChange('actividad', e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold outline-none focus:border-indigo-500" placeholder="Ej: Visita Clientes" />
                        </div>
                    </div>

                    {/* SPECIALIZED FIELDS */}
                    {formData.categoria === 'SST' && (
                        <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                            <h5 className="text-[10px] font-black text-indigo-400 uppercase mb-3">Detalle SST</h5>
                            <div className="mb-3">
                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Tipo de Actividad</label>
                                <select value={formData.tipoActividad} onChange={(e) => handleInputChange('tipoActividad', e.target.value)} className="w-full bg-white border border-indigo-100 rounded-xl p-2 text-xs font-bold outline-none">
                                    <option value="RUTINARIA">Rutinaria</option>
                                    <option value="NO RUTINARIA">No Rutinaria</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Personal Expuesto</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {['fijo', 'temporal', 'contratista', 'visitante'].map(type => (
                                        <div key={type}>
                                            <span className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">{type.substring(0,4)}.</span>
                                            <input type="number" min="0" value={(formData.expuestos as any)?.[type] || 0} onChange={(e) => handleExpuestosChange(type as any, Number(e.target.value))} className="w-full text-center bg-white border border-indigo-100 rounded-lg p-1.5 text-xs font-black outline-none" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {formData.categoria === 'Ambiental' && (
                        <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                             <h5 className="text-[10px] font-black text-emerald-400 uppercase mb-3">Detalle Ambiental</h5>
                             <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Condición de Operación</label>
                                <select value={formData.condicionOperacion} onChange={(e) => handleInputChange('condicionOperacion', e.target.value)} className="w-full bg-white border border-emerald-100 rounded-xl p-2 text-xs font-bold outline-none">
                                    <option value="NORMAL">Normal</option>
                                    <option value="ANORMAL">Anormal</option>
                                    <option value="EMERGENCIA">Emergencia</option>
                                </select>
                        </div>
                    )}

                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 flex justify-between">
                            <span>Descripción del Riesgo</span>
                            <span className="text-indigo-500 cursor-pointer hover:underline" onClick={() => toast.info('Seleccione de la lista para autocompletar')}>Ver Catálogo</span>
                        </label>
                        <select onChange={handleCatalogSelection} className="w-full mb-2 bg-slate-50 border border-slate-100 rounded-xl p-2 text-xs font-bold text-slate-600 outline-none">
                            <option value="">-- Seleccionar de Biblioteca --</option>
                            {formData.categoria === 'Calidad' && catalogs.calidad?.map((c:any, i:number) => <option key={i} value={c.descripcion}>{c.nombre}</option>)}
                            {formData.categoria === 'SST' && catalogs.sst?.map((c:any, i:number) => <option key={i} value={c.descripcion}>{c.nombre}</option>)}
                            {formData.categoria === 'Ambiental' && catalogs.ambiental?.map((c:any, i:number) => <option key={i} value={c.descripcion}>{c.nombre}</option>)}
                        </select>
                        <textarea value={formData.descripcion} onChange={(e) => handleInputChange('descripcion', e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-medium outline-none h-20 resize-none focus:border-indigo-500" placeholder="O escriba manualmente..." />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Causa / Generado Por</label>
                        <textarea value={formData.causa} onChange={(e) => handleInputChange('causa', e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-medium outline-none h-16 resize-none focus:border-indigo-500" placeholder="Origen del riesgo" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Impacto / Consecuencia</label>
                        <textarea value={formData.consecuencia} onChange={(e) => handleInputChange('consecuencia', e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-medium outline-none h-16 resize-none focus:border-indigo-500" placeholder="Efecto si se materializa" />
                    </div>
                </div>

                {/* RIGHT COLUMN: Valuation & Controls */}
                <div className="space-y-6">
                    <h4 className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-600"></div> VALORACIÓN Y CONTROLES
                    </h4>
                    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Probabilidad (1-5)</label>
                                <select value={formData.probability} onChange={(e) => handleInputChange('probability', Number(e.target.value))} className="w-full bg-white border border-slate-200 rounded-xl p-2 text-sm font-bold outline-none">
                                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Impacto (1-5)</label>
                                <select value={formData.impact} onChange={(e) => handleInputChange('impact', Number(e.target.value))} className="w-full bg-white border border-slate-200 rounded-xl p-2 text-sm font-bold outline-none">
                                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                            <span className="text-xs font-black text-slate-400 uppercase">Nivel Inherente</span>
                            <span className={`px-4 py-1 rounded-full text-xs font-black ${getRiskColor(calculateRiskLevel(Number(formData.probability), Number(formData.impact)))}`}>
                                {calculateRiskLevel(Number(formData.probability), Number(formData.impact))} - {getShortLabel(calculateRiskLevel(Number(formData.probability), Number(formData.impact)))}
                            </span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Controles Actuales</label>
                        <textarea value={formData.controles} onChange={(e) => handleInputChange('controles', e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-medium outline-none h-24 resize-none focus:border-indigo-500" placeholder="Medidas preventivas existentes" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Eficacia (1-5)</label>
                            <select value={formData.eficacia} onChange={(e) => handleInputChange('eficacia', Number(e.target.value))} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2 text-sm font-bold outline-none">
                                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Plan de Acción</label>
                            <input type="text" value={formData.planAccion} onChange={(e) => handleInputChange('planAccion', e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold outline-none focus:border-indigo-500" placeholder="Acciones futuras" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
                <button onClick={() => setShowForm(false)} className="px-6 py-3 text-sm font-black text-slate-400 hover:text-slate-600 transition-colors uppercase">Cancelar</button>
                <button onClick={handleSubmit} className="px-10 py-3 bg-slate-900 text-white rounded-2xl text-sm font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 flex items-center gap-2">
                    <Save size={18} /> GUARDAR EN MATRIZ
                </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Table View */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
             <div className="overflow-x-auto">
                <table className="w-full min-w-[1600px] border-collapse text-left text-xs">
                    <thead>
                        <tr className="bg-slate-900 text-white divide-x divide-slate-700">
                            <th className="p-5 font-black uppercase tracking-widest w-48">Proceso / Actividad</th>
                            {activeTab === 'SST' && <th className="p-5 font-black uppercase tracking-widest w-24 bg-indigo-900">Tipo</th>}
                            {activeTab === 'SST' && <th className="p-5 font-black uppercase tracking-widest w-32 bg-indigo-900">Expuestos</th>}
                            {activeTab === 'Ambiental' && <th className="p-5 font-black uppercase tracking-widest w-24 bg-emerald-900">Condición</th>}
                            <th className="p-5 font-black uppercase tracking-widest w-64">Descripción del Riesgo</th>
                            <th className="p-5 font-black uppercase tracking-widest w-48">Causa / Generado Por</th>
                            <th className="p-5 font-black uppercase tracking-widest w-48">Impacto / Consecuencia</th>
                            <th className="p-5 font-black uppercase tracking-widest text-center w-16">P</th>
                            <th className="p-5 font-black uppercase tracking-widest text-center w-16">C</th>
                            <th className="p-5 font-black uppercase tracking-widest text-center w-28">Inherente</th>
                            <th className="p-5 font-black uppercase tracking-widest w-48">Controles Actuales</th>
                            <th className="p-5 font-black uppercase tracking-widest text-center w-16">Eficacia</th>
                            <th className="p-5 font-black uppercase tracking-widest text-center w-28">Residual</th>
                            <th className="p-5 font-black uppercase tracking-widest w-48">Plan de Acción</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                        {filteredRisks.map((risk, idx) => (
                            <tr key={risk.id || idx} className="hover:bg-slate-50/80 transition-colors divide-x divide-slate-100">
                                <td className="p-5">
                                    <div className="font-black text-slate-900">{risk.proceso}</div>
                                    <div className="text-[10px] text-slate-400 uppercase mt-1">{risk.actividad}</div>
                                    <span className={`inline-block mt-2 px-2 py-0.5 rounded text-[9px] font-black uppercase ${risk.categoria === 'SST' ? 'bg-indigo-50 text-indigo-500' : risk.categoria === 'Ambiental' ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-100 text-slate-500'}`}>{risk.categoria}</span>
                                </td>

                                {/* SST Columns */}
                                {activeTab === 'SST' && (
                                    <>
                                        <td className="p-5 text-[10px] font-bold text-indigo-600">{risk.tipoActividad}</td>
                                        <td className="p-5">
                                            <div className="flex flex-col gap-1 text-[9px] font-bold text-slate-500">
                                                {risk.expuestos?.fijo ? <span>Fijo: {risk.expuestos.fijo}</span> : null}
                                                {risk.expuestos?.contratista ? <span>Cont: {risk.expuestos.contratista}</span> : null}
                                            </div>
                                        </td>
                                    </>
                                )}

                                {/* Ambiental Columns */}
                                {activeTab === 'Ambiental' && (
                                    <td className="p-5 text-[10px] font-bold text-emerald-600">{risk.condicionOperacion}</td>
                                )}

                                <td className="p-5 leading-relaxed">{risk.descripcion}</td>
                                <td className="p-5 leading-relaxed">{risk.causa}</td>
                                <td className="p-5 leading-relaxed">{risk.consecuencia}</td>
                                
                                <td className="p-5 text-center font-black text-slate-900 bg-slate-50/30">{risk.probability}</td>
                                <td className="p-5 text-center font-black text-slate-900 bg-slate-50/30">{risk.impact}</td>
                                <td className="p-5 text-center">
                                    <div className={`inline-block px-3 py-1 rounded-lg font-black text-[10px] ${getRiskColor(risk.nivelRiesgo)}`}>
                                        {getShortLabel(risk.nivelRiesgo)} ({risk.nivelRiesgo})
                                    </div>
                                </td>

                                <td className="p-5 italic">{risk.controles || 'Sin controles'}</td>
                                <td className="p-5 text-center font-black text-slate-900">{risk.eficacia}</td>
                                
                                <td className="p-5 text-center">
                                    <div className={`inline-block px-3 py-1 rounded-lg font-black text-[10px] ${getRiskColor(risk.nivelRiesgoResidual || 1)}`}>
                                        {getShortLabel(risk.nivelRiesgoResidual || 1)} ({risk.nivelRiesgoResidual || 1})
                                    </div>
                                </td>

                                <td className="p-5 font-bold text-indigo-600">{risk.planAccion || 'Por definir'}</td>
                            </tr>
                        ))}
                        {filteredRisks.length === 0 && (
                            <tr>
                                <td colSpan={14} className="p-12 text-center text-slate-400 font-medium">No hay riesgos registrados en esta categoría.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
             </div>
        </div>
      ) : (
        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
          <RiskMatrix risks={filteredRisks} />
        </div>
      )}
    </div>
  );
};

export default RiskManagement;
