import React from 'react';
import { FaChartLine, FaShieldAlt, FaBalanceScale, FaRocket, FaExclamationTriangle, FaMagic, FaSpinner, FaSave } from 'react-icons/fa';

interface Props {
  data: any;
  setData: (data: any) => void;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  saving: boolean;
  startWizard: (type: string) => void;
}

export const SwotBlock: React.FC<Props> = ({
  data, setData, isEditing, onEdit, onSave, saving, startWizard
}) => {
  const renderList = (text: string, type: 'strengths' | 'weaknesses' | 'opportunities' | 'threats') => {
    if (!text) return <span className="text-slate-400 italic">No definido</span>;

    const items = text.split('\n').filter(i => i.trim());

    return (
      <div className="space-y-3">
        {items.map((item, idx) => {
          // Check for the [Plan: ...] pattern
          const hasPlan = item.includes('[Plan:');
          let mainText = item.replace(/^•\s*/, '');
          let planText = '';

          if (hasPlan) {
            const parts = mainText.split('[Plan:');
            mainText = parts[0].trim();
            planText = parts[1].replace(']', '').trim();
          }

          return (
            <div key={idx} className="flex flex-col gap-1.5">
              <div className="flex items-start gap-2">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 bg-current opacity-40" />
                <span className="text-sm font-bold text-slate-700 leading-relaxed">{mainText}</span>
              </div>
              {planText && (
                <div className="ml-4 px-3 py-1.5 bg-white/60 rounded-xl border border-current/10 flex flex-col gap-0.5 shadow-sm">
                  <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Acción de Mejora</span>
                  <span className="text-[11px] font-bold italic opacity-80 leading-snug">{planText}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-slate-900 text-white rounded-xl"><FaChartLine /></div>
          <h3 className="text-2xl font-black text-slate-900">Análisis DOFA</h3>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <button onClick={onEdit} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-200 transition-all">Editar Análisis</button>
          ) : (
            <button onClick={onSave} disabled={saving} className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition-all">Aceptar</button>
          )}
          {isEditing && (
            <button onClick={() => startWizard('swot')} className="ai-btn bg-slate-100 text-slate-700 hover:bg-slate-200">
              <FaMagic /> Generar con IA
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-gradient-to-br from-emerald-50 via-emerald-100 to-teal-100 rounded-2xl border-2 border-emerald-200 text-emerald-600 shadow-sm hover:shadow-md transition-all duration-300 group">
          <h4 className="flex items-center gap-2 font-black text-emerald-700 uppercase text-xs tracking-widest mb-4 group-hover:text-emerald-800 transition-colors"><FaShieldAlt /> Fortalezas</h4>
          {isEditing ? <textarea className="w-full p-3 bg-white/60 border-2 border-emerald-200 rounded-xl outline-none h-48 resize-none text-slate-700 font-medium text-sm focus:ring-2 focus:ring-emerald-400 transition-all shadow-sm" value={data.strengths} onChange={e => setData({ ...data, strengths: e.target.value })} /> : renderList(data.strengths, 'strengths')}
        </div>
        <div className="p-6 bg-gradient-to-br from-amber-50 via-amber-100 to-yellow-100 rounded-2xl border-2 border-amber-200 text-amber-600 shadow-sm hover:shadow-md transition-all duration-300 group">
          <h4 className="flex items-center gap-2 font-black text-amber-700 uppercase text-xs tracking-widest mb-4 group-hover:text-amber-800 transition-colors"><FaBalanceScale /> Debilidades</h4>
          {isEditing ? <textarea className="w-full p-3 bg-white/60 border-2 border-amber-200 rounded-xl outline-none h-48 resize-none text-slate-700 font-medium text-sm focus:ring-2 focus:ring-amber-400 transition-all shadow-sm" value={data.weaknesses} onChange={e => setData({ ...data, weaknesses: e.target.value })} /> : renderList(data.weaknesses, 'weaknesses')}
        </div>
        <div className="p-6 bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 rounded-2xl border-2 border-blue-200 text-blue-600 shadow-sm hover:shadow-md transition-all duration-300 group">
          <h4 className="flex items-center gap-2 font-black text-blue-700 uppercase text-xs tracking-widest mb-4 group-hover:text-blue-800 transition-colors"><FaRocket /> Oportunidades</h4>
          {isEditing ? <textarea className="w-full p-3 bg-white/60 border-2 border-blue-200 rounded-xl outline-none h-48 resize-none text-slate-700 font-medium text-sm focus:ring-2 focus:ring-blue-400 transition-all shadow-sm" value={data.opportunities} onChange={e => setData({ ...data, opportunities: e.target.value })} /> : renderList(data.opportunities, 'opportunities')}
        </div>
        <div className="p-6 bg-gradient-to-br from-red-50 via-red-100 to-rose-100 rounded-2xl border-2 border-red-200 text-red-600 shadow-sm hover:shadow-md transition-all duration-300 group">
          <h4 className="flex items-center gap-2 font-black text-red-700 uppercase text-xs tracking-widest mb-4 group-hover:text-red-800 transition-colors"><FaExclamationTriangle /> Amenazas</h4>
          {isEditing ? <textarea className="w-full p-3 bg-white/60 border-2 border-red-200 rounded-xl outline-none h-48 resize-none text-slate-700 font-medium text-sm focus:ring-2 focus:ring-red-400 transition-all shadow-sm" value={data.threats} onChange={e => setData({ ...data, threats: e.target.value })} /> : renderList(data.threats, 'threats')}
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
