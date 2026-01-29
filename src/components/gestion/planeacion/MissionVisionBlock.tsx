import React from 'react';
import { FaBullseye, FaLightbulb, FaMagic, FaSpinner, FaSave } from 'react-icons/fa';

interface Props {
  data: any;
  setData: (data: any) => void;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  saving: boolean;
  startWizard: (type: string) => void;
}

export const MissionVisionBlock: React.FC<Props> = ({
  data, setData, isEditing, onEdit, onSave, saving, startWizard
}) => {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-sm"><FaBullseye size={20} /></div>
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Identidad Corporativa</h3>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <button onClick={onEdit} className="px-4 py-2 bg-gradient-to-br from-slate-50 to-slate-100 text-slate-700 rounded-xl font-bold text-xs hover:from-slate-100 hover:to-slate-200 transition-all border border-slate-200 shadow-sm">Editar Bloque</button>
          ) : (
            <button onClick={onSave} disabled={saving} className="px-4 py-2 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-xl font-bold text-xs hover:from-slate-700 hover:to-slate-800 transition-all shadow-sm hover:shadow-md flex items-center gap-2">
              {saving ? <FaSpinner className="animate-spin" /> : <FaSave />} Aceptar
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="relative group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Misión</span>
            {isEditing && (
              <button onClick={() => startWizard('mission')} className="ai-btn bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 border border-blue-200 shadow-sm hover:shadow">
                <FaMagic /> IA
              </button>
            )}
          </div>
          {isEditing ? (
            <textarea
              className="w-full h-48 p-4 bg-gradient-to-br from-blue-50/50 to-white border-2 border-blue-100 rounded-xl resize-none outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition-all text-slate-700 font-medium shadow-sm"
              value={data.mision}
              onChange={(e) => setData({ ...data, mision: e.target.value })}
            />
          ) : <p className="text-slate-600 text-lg leading-relaxed font-medium">{data.mision || 'No definida'}</p>}
        </div>

        <div className="relative group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Visión</span>
            {isEditing && (
              <button onClick={() => startWizard('vision')} className="ai-btn bg-gradient-to-br from-purple-50 to-purple-100 text-purple-700 border border-purple-200 shadow-sm hover:shadow">
                <FaMagic /> IA
              </button>
            )}
          </div>
          {isEditing ? (
            <textarea
              className="w-full h-48 p-4 bg-gradient-to-br from-purple-50/50 to-white border-2 border-purple-100 rounded-xl resize-none outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-300 transition-all text-slate-700 font-medium shadow-sm"
              value={data.vision}
              onChange={(e) => setData({ ...data, vision: e.target.value })}
            />
          ) : <p className="text-slate-600 text-lg leading-relaxed font-medium">{data.vision || 'No definida'}</p>}
        </div>
      </div>
      <style jsx>{`
        .ai-btn {
          @apply text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1 transition-colors border border-transparent hover:border-current;
        }
      `}</style>
    </div>
  );
};
