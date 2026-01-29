'use client';

import { useState, useEffect } from 'react';
import { Process } from '@/components/ProcessGeneratorModal';
import ProcessMapper from './ProcessMapper';
import { Node, Edge, ReactFlowProvider } from 'reactflow';
import { FaMagic, FaPlus, FaTrash } from 'react-icons/fa';
import { ProcessContentWizard } from './ProcessContentWizard';

interface ProcessFormProps {
  process?: Partial<Process>;
  onSave: (process: Process) => void;
}

const ProcessForm = ({ process, onSave }: ProcessFormProps) => {
  const [formData, setFormData] = useState<Partial<Process>>({
    id: '',
    nombre: '',
    responsable: '',
    objetivo: '',
    alcance: '',
    descripcion: '',
    entradas: [],
    salidas: [],
    actividades: [],
    recursos: [],
    indicadores: [],
  });

  const [isWizardOpen, setIsWizardOpen] = useState(false);

  useEffect(() => {
    if (process) {
      setFormData(prev => ({ ...prev, ...process }));
    }
  }, [process]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleListChange = (field: keyof Process, index: number, value: string) => {
    const list = [...(formData[field] as string[] || [])];
    list[index] = value;
    setFormData(prev => ({ ...prev, [field]: list }));
  };

  const addListItem = (field: keyof Process) => {
    const list = [...(formData[field] as string[] || [])];
    list.push('');
    setFormData(prev => ({ ...prev, [field]: list }));
  };

  const removeListItem = (field: keyof Process, index: number) => {
    const list = [...(formData[field] as string[] || [])];
    list.splice(index, 1);
    setFormData(prev => ({ ...prev, [field]: list }));
  };

  // const handleDiagramChange = (nodes: Node[], edges: Edge[]) => {
  //   setFormData(prev => ({ ...prev, nodes, edges }));
  // };

  const handleAIApply = (data: any) => {
    setFormData(prev => ({
      ...prev,
      objetivo: data.objective,
      alcance: data.scope,
      entradas: data.inputs || [],
      salidas: data.outputs || [],
      actividades: data.activities || [],
      recursos: data.resources || [],
      indicadores: data.indicators || [],
      descripcion: data.objective // Use objective as description summary
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.responsable) {
      alert('El nombre y el responsable del proceso son obligatorios.');
      return;
    }
    onSave(formData as Process);
  };

  const renderListField = (label: string, field: keyof Process) => (
    <div className="form-group">
      <label className="form-label flex justify-between items-center">
        {label}
        <button type="button" onClick={() => addListItem(field)} className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1">
          <FaPlus /> Agregar
        </button>
      </label>
      <div className="space-y-2">
        {(formData[field] as string[] || []).map((item, idx) => (
          <div key={idx} className="flex gap-2">
            <input 
              className="form-input text-sm py-2" 
              value={item} 
              onChange={(e) => handleListChange(field, idx, e.target.value)} 
            />
            <button type="button" onClick={() => removeListItem(field, idx)} className="text-red-400 hover:text-red-600">
              <FaTrash />
            </button>
          </div>
        ))}
        {(formData[field] as string[] || []).length === 0 && (
          <p className="text-xs text-slate-400 italic">No hay elementos registrados.</p>
        )}
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative">
      
      {isWizardOpen && (
        <ProcessContentWizard 
          processName={formData.nombre || 'Nuevo Proceso'} 
          onApply={handleAIApply} 
          onClose={() => setIsWizardOpen(false)} 
        />
      )}

      {/* Header / Main Info */}
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-black text-slate-800">Caracterización del Proceso</h3>
        <button 
          type="button" 
          onClick={() => setIsWizardOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold flex items-center gap-2 hover:shadow-lg hover:scale-105 transition-all text-sm"
        >
          <FaMagic className="text-yellow-300" />
          Generar con IA
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="form-group">
          <label htmlFor="nombre" className="form-label">Nombre del Proceso</label>
          <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} className="form-input font-bold" required />
        </div>
        <div className="form-group">
          <label htmlFor="responsable" className="form-label">Responsable</label>
          <input type="text" id="responsable" name="responsable" value={formData.responsable} onChange={handleChange} className="form-input" required />
        </div>
        <div className="form-group md:col-span-2">
          <label htmlFor="objetivo" className="form-label">Objetivo</label>
          <textarea id="objetivo" name="objetivo" value={formData.objetivo} onChange={handleChange} className="form-textarea" rows={3} />
        </div>
        <div className="form-group md:col-span-2">
          <label htmlFor="alcance" className="form-label">Alcance</label>
          <textarea id="alcance" name="alcance" value={formData.alcance} onChange={handleChange} className="form-textarea" rows={3} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {renderListField('Entradas (Insumos)', 'entradas')}
         {renderListField('Salidas (Productos/Resultados)', 'salidas')}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {renderListField('Recursos Necesarios', 'recursos')}
         {renderListField('Indicadores de Gestión', 'indicadores')}
      </div>

      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
         {renderListField('Actividades (Ciclo PHVA)', 'actividades')}
      </div>

      {/* Diagram Placeholder - ReactFlow Logic commented out for simplicity unless needed, or I can re-add it if ProcessMapper is compatible */}
      {/* 
      <div className="form-group mt-8">
        <label className="form-label">Diagrama de Flujo</label>
        <div className="h-64 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-sm">
           El diagrama se gestionará en una futura actualización.
        </div>
      </div> 
      */}

      <div className="flex justify-end pt-4">
        <button type="submit" className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg">
          Guardar Cambios
        </button>
      </div>
    </form>
  );
};

export default ProcessForm;