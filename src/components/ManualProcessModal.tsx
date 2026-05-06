import React, { useState } from 'react';
import { 
  FaTimes, FaKeyboard, FaLayerGroup, FaUserTie, FaAlignLeft, FaSave, FaCheckCircle
} from 'react-icons/fa';
import { Process } from './ProcessGeneratorModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (process: Process) => void;
  initialType?: string;
}

export const ManualProcessModal: React.FC<Props> = ({ isOpen, onClose, onSave, initialType }) => {
  const [formData, setFormData] = useState<Partial<Process>>({
    nombre: '',
    tipo: (initialType as any) || 'MISIONAL',
    responsable: '',
    descripcion: ''
  });

  // Update type if initialType changes when opening
  React.useEffect(() => {
    if (isOpen && initialType) {
        setFormData(prev => ({ ...prev, tipo: initialType as any }));
    }
  }, [isOpen, initialType]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre) return;

    const newProcess: Process = {
      id: `MAN-${Date.now()}`,
      nombre: formData.nombre,
      tipo: formData.tipo as Process['tipo'],
      responsable: formData.responsable || 'Sin asignar',
      descripcion: formData.descripcion || ''
    };
    
    onSave(newProcess);
    setFormData({ nombre: '', tipo: 'MISIONAL', responsable: '', descripcion: '' }); // Reset
  };

  const types = [
    { id: 'ESTRATÉGICO', color: 'bg-purple-500', label: 'Estratégico' },
    { id: 'MISIONAL', color: 'bg-blue-500', label: 'Misional' },
    { id: 'APOYO', color: 'bg-orange-500', label: 'Apoyo' },
    { id: 'EVALUACIÓN', color: 'bg-emerald-500', label: 'Evaluación' },
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[2rem] shadow-2xl max-w-lg w-full overflow-hidden flex flex-col relative">
        
        {/* Header */}
        <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg">
                <FaKeyboard size={18} />
             </div>
             <div>
                <h3 className="font-black text-slate-900 text-lg">Crear Proceso</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Configuración Manual</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
             <FaTimes />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2 ml-1">Nombre del Proceso</label>
            <div className="relative">
               <FaLayerGroup className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
               <input 
                 autoFocus
                 className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 outline-none font-bold text-slate-800 transition-all placeholder:font-medium"
                 placeholder="Ej: Gestión de Ventas"
                 value={formData.nombre}
                 onChange={(e) => setFormData({...formData, nombre: e.target.value})}
               />
            </div>
          </div>

          <div>
             <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2 ml-1">Tipo de Proceso</label>
             <div className="grid grid-cols-2 gap-2">
               {types.map(t => (
                 <button
                   key={t.id}
                   type="button"
                   onClick={() => setFormData({...formData, tipo: t.id as any})}
                   className={`p-2 rounded-xl border-2 text-xs font-black transition-all flex items-center gap-2 ${formData.tipo === t.id ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-100 bg-white text-slate-500 hover:border-slate-300'}`}
                 >
                   <div className={`w-3 h-3 rounded-full ${t.color}`}></div>
                   {t.label}
                 </button>
               ))}
             </div>
          </div>

          <div className="hidden"> {/* Responsable oculto/opcional */}
            <input 
                 value={formData.responsable}
                 onChange={(e) => setFormData({...formData, responsable: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2 ml-1">Descripción</label>
            <div className="relative">
               <FaAlignLeft className="absolute left-4 top-4 text-slate-400" />
               <textarea 
                 rows={3}
                 className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 outline-none font-medium text-slate-600 transition-all placeholder:font-medium resize-none"
                 placeholder="Breve descripción del objetivo..."
                 value={formData.descripcion}
                 onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
               />
            </div>
          </div>

          <button 
            type="submit"
            disabled={!formData.nombre}
            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 shadow-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            <FaCheckCircle className="text-emerald-400" /> GUARDAR PROCESO
          </button>

        </form>
      </div>
    </div>
  );
};
