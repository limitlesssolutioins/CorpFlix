import React from 'react';
import { FaGlobe, FaMoneyBillWave, FaUsers, FaCogs, FaLeaf, FaBalanceScale, FaMagic, FaSpinner, FaSave } from 'react-icons/fa';

interface Props {
  data: any;
  setData: (data: any) => void;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  saving: boolean;
  startWizard: (type: string) => void;
}

export const PestelBlock: React.FC<Props> = ({
  data, setData, isEditing, onEdit, onSave, saving, startWizard
}) => {
  return (
    <div className="bg-white rounded-[2.5rem] p-10 border-2 border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-xl shadow-md"><FaGlobe size={24} /></div>
          <h3 className="text-2xl font-black text-slate-900">Análisis PESTEL</h3>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <button onClick={onEdit} className="px-4 py-2 bg-gradient-to-br from-slate-50 to-slate-100 text-slate-700 rounded-xl font-bold text-xs hover:from-slate-100 hover:to-slate-200 transition-all border border-slate-200 shadow-sm hover:shadow">Editar Análisis</button>
          ) : (
            <button onClick={onSave} disabled={saving} className="px-4 py-2 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-xl font-bold text-xs hover:from-slate-700 hover:to-slate-800 transition-all shadow-sm hover:shadow-md">Aceptar</button>
          )}
          {isEditing && (
            <button onClick={() => startWizard('pestel')} className="ai-btn bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-700 hover:from-indigo-100 hover:to-indigo-200 border border-indigo-200 shadow-sm hover:shadow">
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
            color: 'text-blue-600',
            bgGradient: 'from-blue-50 via-blue-100 to-indigo-100',
            borderColor: 'border-blue-200',
            desc: 'Examina las influencias políticas que podrían afectar a tu organización. Considera cuestiones como estabilidad política, elecciones, políticas fiscales, regulaciones gubernamentales y tratados internacionales.'
          },
          {
            id: 'economic',
            label: 'Económico',
            icon: FaMoneyBillWave,
            color: 'text-emerald-600',
            bgGradient: 'from-emerald-50 via-emerald-100 to-teal-100',
            borderColor: 'border-emerald-200',
            desc: 'Evalúa las condiciones económicas que podrían tener un impacto en tu organización. Esto incluye factores como tasas de crecimiento económico, inflación, tasas de interés, desempleo, fluctuaciones de la moneda y ciclos económicos.'
          },
          {
            id: 'social',
            label: 'Social',
            icon: FaUsers,
            color: 'text-pink-600',
            bgGradient: 'from-pink-50 via-pink-100 to-rose-100',
            borderColor: 'border-pink-200',
            desc: 'Analiza los aspectos culturales, demográficos y sociales que podrían influir en tu organización. Examina tendencias de consumo, cambios demográficos, valores culturales, comportamientos de los consumidores y factores socioculturales.'
          },
          {
            id: 'technological',
            label: 'Tecnológico',
            icon: FaCogs,
            color: 'text-purple-600',
            bgGradient: 'from-purple-50 via-purple-100 to-indigo-100',
            borderColor: 'border-purple-200',
            desc: 'Considera las innovaciones y avances tecnológicos que podrían afectar a tu organización. Examina cambios en la tecnología, investigación y desarrollo, automatización, adopción de tecnología por parte de los consumidores y competencia tecnológica.'
          },
          {
            id: 'ecological',
            label: 'Ecológico',
            icon: FaLeaf,
            color: 'text-green-600',
            bgGradient: 'from-green-50 via-green-100 to-teal-100',
            borderColor: 'border-green-200',
            desc: 'Evalúa el impacto ambiental y las preocupaciones de sostenibilidad. Examina regulaciones ambientales, conciencia ambiental de los consumidores, cambios climáticos, escasez de recursos naturales y tendencias de sostenibilidad.'
          },
          {
            id: 'legal',
            label: 'Legal',
            icon: FaBalanceScale,
            color: 'text-slate-600',
            bgGradient: 'from-slate-50 via-slate-100 to-gray-100',
            borderColor: 'border-slate-200',
            desc: 'Considera el marco legal en el que opera tu organización. Examina leyes laborales, regulaciones de salud y seguridad, leyes de competencia, protección de datos, propiedad intelectual y otras cuestiones legales relevantes.'
          },
        ].map((item) => (
          <div key={item.id} className={`p-6 bg-gradient-to-br ${item.bgGradient} rounded-2xl border-2 ${item.borderColor} shadow-sm hover:shadow-md transition-all duration-300 group relative`}>
            <div className="flex items-center justify-between mb-3 relative">
              <div className="flex items-center gap-2">
                <item.icon className={item.color} />
                <h4 className="font-bold text-slate-900 cursor-help">{item.label}</h4>

                {/* Tooltip */}
                <div className="absolute bottom-full left-0 mb-2 w-64 p-4 bg-slate-800 text-white text-xs rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 font-medium leading-relaxed">
                  {item.desc}
                  <div className="absolute top-full left-4 -mt-1 border-4 border-transparent border-t-slate-800"></div>
                </div>
              </div>

              {isEditing && (
                <button
                  onClick={() => startWizard(`pestel-${item.id}`)}
                  className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                  title={`Generar ${item.label} con IA`}
                >
                  <FaMagic size={12} />
                </button>
              )}
            </div>
            {isEditing ? (
              <textarea
                className="w-full h-32 p-3 bg-white/60 border-2 border-current/20 rounded-xl outline-none focus:ring-2 focus:ring-current/40 text-sm resize-none text-slate-700 font-medium shadow-sm transition-all"
                value={data[item.id]}
                onChange={(e) => setData({ ...data, [item.id]: e.target.value })}
                placeholder={`Factores ${item.label.toLowerCase()}...`}
              />
            ) : <p className="text-sm text-slate-600 leading-relaxed min-h-[3rem] font-medium whitespace-pre-line">{data[item.id] || <span className="text-slate-400 italic">No definido</span>}</p>}
          </div>
        ))}
      </div>
      <style jsx>{`
        .ai-btn {
          @apply text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1 transition-colors border border-transparent hover:border-current;
        }
      `}</style>
    </div>
  );
};
