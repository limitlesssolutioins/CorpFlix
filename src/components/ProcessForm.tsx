'use client';

import { useState, useEffect } from 'react';
import { Process } from '../app/gestion/procesos/page'; // Adjusted import path
import ProcessMapper from './ProcessMapper';
import { Node, Edge, ReactFlowProvider } from 'reactflow';

interface ProcessFormProps {
  process?: Partial<Process>; // Allow partial process for creation
  onSave: (process: Process) => void;
}

const ProcessForm = ({ process, onSave }: ProcessFormProps) => {
  const [formData, setFormData] = useState<Omit<Process, 'id'> | Process>({
    name: '',
    objective: '',
    scope: '',
    owner: '',
    nodes: [],
    edges: [],
  });

  useEffect(() => {
    if (process) {
      setFormData(prev => ({ ...prev, ...process }));
    }
  }, [process]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDiagramChange = (nodes: Node[], edges: Edge[]) => {
    setFormData(prev => ({ ...prev, nodes, edges }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.owner) {
      alert('El nombre y el responsable del proceso son obligatorios.');
      return;
    }
    onSave(formData as Process);
  };

  return (
    <form onSubmit={handleSubmit} className="form-section">
      {/* Characterization Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="form-group">
          <label htmlFor="name" className="form-label">Nombre del Proceso</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="form-input" required />
        </div>
        <div className="form-group">
          <label htmlFor="owner" className="form-label">Responsable (Dueño del Proceso)</label>
          <input type="text" id="owner" name="owner" value={formData.owner} onChange={handleChange} className="form-input" required />
        </div>
        <div className="form-group md:col-span-2">
          <label htmlFor="objective" className="form-label">Objetivo</label>
          <textarea id="objective" name="objective" value={formData.objective} onChange={handleChange} className="form-textarea" rows={3} />
        </div>
        <div className="form-group md:col-span-2">
          <label htmlFor="scope" className="form-label">Alcance</label>
          <textarea id="scope" name="scope" value={formData.scope} onChange={handleChange} className="form-textarea" rows={3} />
        </div>
      </div>

      {/* Process Mapper */}
      <div className="form-group mt-8">
        <label className="form-label">Diagrama de Flujo del Proceso</label>
        <ReactFlowProvider>
          <ProcessMapper 
            initialNodes={formData.nodes}
            initialEdges={formData.edges}
            onDiagramChange={handleDiagramChange} 
          />
        </ReactFlowProvider>
      </div>

      <button type="submit" className="feature-button mt-6">
        Guardar Proceso
      </button>
    </form>
  );
};

export default ProcessForm;
