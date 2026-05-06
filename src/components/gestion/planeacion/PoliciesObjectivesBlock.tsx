import React from 'react';
import { FaFileContract, FaRocket, FaPlus, FaTrash, FaMagic, FaSpinner, FaSave } from 'react-icons/fa';

interface Props {
  data: any;
  updateItem: (list: 'objetivos' | 'politicas', id: string, field: string, val: any) => void;
  addItem: (list: 'objetivos' | 'politicas') => void;
  removeItem: (list: 'objetivos' | 'politicas', id: string) => void;
  companyName: string;
  editingPolicies: boolean;
  editingObjectives: boolean;
  onEditPolicies: () => void;
  onSavePolicies: () => void;
  onEditObjectives: () => void;
  onSaveObjectives: () => void;
  saving: boolean;
  startWizard: (type: string) => void;
}

export const PoliciesObjectivesBlock: React.FC<Props> = ({
  data, updateItem, addItem, removeItem, companyName,
  editingPolicies, editingObjectives,
  onEditPolicies, onSavePolicies,
  onEditObjectives, onSaveObjectives,
  saving, startWizard
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Políticas */}
      <div className="bg-gradient-to-br from-white to-pink-50/30 p-8 rounded-[2.5rem] border-2 border-pink-100 shadow-lg shadow-pink-100/50 hover:shadow-xl transition-all duration-300">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-xl shadow-sm"><FaFileContract size={20} /></div>
            <h3 className="text-xl font-black text-slate-900">Políticas</h3>
          </div>
          <div className="flex gap-2">
            {!editingPolicies ? (
              <button onClick={onEditPolicies} className="px-3 py-1.5 bg-gradient-to-br from-slate-50 to-slate-100 text-slate-700 rounded-lg font-bold text-[10px] uppercase hover:from-slate-100 hover:to-slate-200 transition-all border border-slate-200 shadow-sm">Editar</button>
            ) : (
              <button onClick={onSavePolicies} disabled={saving} className="px-3 py-1.5 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-lg font-bold text-[10px] uppercase hover:from-slate-700 hover:to-slate-800 transition-all shadow-sm">Aceptar</button>
            )}
            {editingPolicies && (
              <>
                <button onClick={() => startWizard('policies')} className="ai-btn bg-gradient-to-br from-pink-50 to-pink-100 text-pink-700 border border-pink-200 hover:from-pink-100 hover:to-pink-200"><FaMagic /> IA</button>
                <button onClick={() => addItem('politicas')} className="action-btn text-pink-600 hover:bg-pink-50"><FaPlus /></button>
              </>
            )}
          </div>
        </div>
        <div className="space-y-4">
          <h4 className="font-bold text-slate-800 italic mb-4 px-3 bg-gradient-to-br from-pink-50 to-white py-2 rounded-lg border border-pink-100 shadow-sm">{companyName} se compromete a:</h4>
          {(data.politicas || []).map((pol: any) => (
            <div key={pol.id} className="flex items-start gap-3 group">
              <div className="mt-4 w-2 h-2 rounded-full bg-pink-500 shrink-0 shadow-sm" />
              {editingPolicies ? (
                <div className="flex-1 flex gap-2">
                  <textarea
                    className="w-full p-3 bg-white/80 border-2 border-pink-100 rounded-xl font-medium outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-200 min-h-[80px] resize-none text-slate-700 shadow-sm transition-all"
                    value={pol.texto}
                    onChange={(e) => updateItem('politicas', pol.id, 'texto', e.target.value)}
                  />
                  <button onClick={() => removeItem('politicas', pol.id)} className="text-slate-300 hover:text-red-500 p-2 transition-colors"><FaTrash /></button>
                </div>
              ) : <p className="text-slate-700 font-medium leading-relaxed">{pol.texto}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Objetivos */}
      <div className="bg-gradient-to-br from-white to-blue-50/30 p-8 rounded-[2.5rem] border-2 border-blue-100 shadow-lg shadow-blue-100/50 hover:shadow-xl transition-all duration-300">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-sm"><FaRocket size={20} /></div>
            <h3 className="text-xl font-black text-slate-900">Objetivos</h3>
          </div>
          <div className="flex gap-2">
            {!editingObjectives ? (
              <button onClick={onEditObjectives} className="px-3 py-1.5 bg-gradient-to-br from-slate-50 to-slate-100 text-slate-700 rounded-lg font-bold text-[10px] uppercase hover:from-slate-100 hover:to-slate-200 transition-all border border-slate-200 shadow-sm">Editar</button>
            ) : (
              <button onClick={onSaveObjectives} disabled={saving} className="px-3 py-1.5 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-lg font-bold text-[10px] uppercase hover:from-slate-700 hover:to-slate-800 transition-all shadow-sm">Aceptar</button>
            )}
            {editingObjectives && (
              <>
                <button onClick={() => startWizard('objectives')} className="ai-btn bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 border border-blue-200 hover:from-blue-100 hover:to-blue-200"><FaMagic /> IA</button>
                <button onClick={() => addItem('objetivos')} className="action-btn text-blue-600 hover:bg-blue-50"><FaPlus /></button>
              </>
            )}
          </div>
        </div>
        <div className="space-y-4">
          {(data.objetivos || []).map((obj: any, idx: number) => (
            <div key={obj.id} className="group">
              <div className="flex items-start gap-4">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-xs shrink-0 mt-1 shadow-sm">{idx + 1}</span>
                <div className="flex-1">
                  {editingObjectives ? (
                    <div className="flex gap-2">
                      <textarea
                        className="w-full p-3 bg-white/80 border-2 border-blue-100 rounded-xl font-medium outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200 min-h-[80px] resize-none text-slate-700 shadow-sm transition-all"
                        value={obj.texto}
                        onChange={(e) => updateItem('objetivos', obj.id, 'texto', e.target.value)}
                      />
                      <button onClick={() => removeItem('objetivos', obj.id)} className="text-slate-300 hover:text-red-500 p-2 transition-colors"><FaTrash /></button>
                    </div>
                  ) : <p className="text-slate-800 font-bold text-sm leading-relaxed">{obj.texto}</p>}
                </div>
              </div>
            </div>
          ))}
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
};
