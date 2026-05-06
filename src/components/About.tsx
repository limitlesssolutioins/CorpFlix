import { 
  FaBullseye, 
  FaLightbulb, 
  FaRocket, 
  FaCheckCircle, 
  FaShieldAlt, 
  FaChartLine, 
  FaExclamationTriangle, 
  FaBalanceScale,
  FaFileContract
} from 'react-icons/fa';

interface StrategicItem {
  id: number;
  text: string;
  texto?: string; // Compatibilidad
}

interface AboutProps {
  mission: string;
  vision: string;
  policies: StrategicItem[];
  objectives: StrategicItem[];
  // FODA Props
  strengths?: string;
  weaknesses?: string;
  opportunities?: string;
  threats?: string;
}

const About = ({ 
  mission, 
  vision, 
  objectives, 
  policies,
  strengths,
  weaknesses,
  opportunities,
  threats
}: AboutProps) => {
  return (
    <div className="space-y-12 mb-16">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-1 w-12 bg-slate-900 rounded-full"></div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Plataforma Estratégica</h2>
      </div>

      {/* Mission & Vision Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Mission Card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-blue-300/50 group hover:-translate-y-2 transition-transform duration-500">
          <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
            <FaBullseye className="text-[12rem] transform rotate-12" />
          </div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/20">
              <FaBullseye className="text-3xl text-blue-200" />
            </div>
            <h3 className="text-2xl font-black mb-4 tracking-tight">Nuestra Misión</h3>
            <p className="text-blue-100 text-lg leading-relaxed font-medium">
              {mission || "Definiendo nuestro propósito..."}
            </p>
          </div>
        </div>

        {/* Vision Card */}
        <div className="bg-gradient-to-br from-purple-600 to-indigo-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-purple-300/50 group hover:-translate-y-2 transition-transform duration-500">
          <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
            <FaLightbulb className="text-[12rem] transform -rotate-12" />
          </div>
          <div className="relative z-10">
             <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/20">
              <FaLightbulb className="text-3xl text-purple-200" />
            </div>
            <h3 className="text-2xl font-black mb-4 tracking-tight">Nuestra Visión</h3>
            <p className="text-purple-100 text-lg leading-relaxed font-medium">
              {vision || "Proyectando nuestro futuro..."}
            </p>
          </div>
        </div>
      </div>

      {/* FODA Section */}
      {(strengths || weaknesses || opportunities || threats) && (
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-slate-900 text-white rounded-xl">
              <FaChartLine />
            </div>
            <h3 className="text-2xl font-black text-slate-900">Análisis Estratégico (DOFA)</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
              <div className="flex items-center gap-3 mb-3 text-emerald-700 font-black uppercase tracking-widest text-xs">
                <FaShieldAlt className="text-lg" /> Fortalezas
              </div>
              <p className="text-slate-700 font-medium whitespace-pre-wrap">{strengths || "Sin definir"}</p>
            </div>

            <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100">
              <div className="flex items-center gap-3 mb-3 text-amber-700 font-black uppercase tracking-widest text-xs">
                <FaBalanceScale className="text-lg" /> Debilidades
              </div>
              <p className="text-slate-700 font-medium whitespace-pre-wrap">{weaknesses || "Sin definir"}</p>
            </div>

            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
              <div className="flex items-center gap-3 mb-3 text-blue-700 font-black uppercase tracking-widest text-xs">
                <FaRocket className="text-lg" /> Oportunidades
              </div>
              <p className="text-slate-700 font-medium whitespace-pre-wrap">{opportunities || "Sin definir"}</p>
            </div>

            <div className="p-6 bg-red-50 rounded-2xl border border-red-100">
              <div className="flex items-center gap-3 mb-3 text-red-700 font-black uppercase tracking-widest text-xs">
                <FaExclamationTriangle className="text-lg" /> Amenazas
              </div>
              <p className="text-slate-700 font-medium whitespace-pre-wrap">{threats || "Sin definir"}</p>
            </div>
          </div>
        </div>
      )}

      {/* Objectives & Policies Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Objectives */}
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <FaRocket size={20} />
            </div>
            <h3 className="text-xl font-black text-slate-900">Objetivos</h3>
          </div>
          
          <div className="space-y-4">
            {(objectives || []).map((obj, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="mt-1 flex-shrink-0">
                  <FaCheckCircle className="text-indigo-500" />
                </div>
                <p className="text-slate-700 font-medium leading-relaxed">
                  {obj.texto || obj.text || (typeof obj === 'string' ? obj : '')}
                </p>
              </div>
            ))}
            {(!objectives || objectives.length === 0) && (
              <p className="text-slate-400 italic">No definidos.</p>
            )}
          </div>
        </div>

        {/* Policies */}
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-pink-50 text-pink-600 rounded-xl">
              <FaFileContract size={20} />
            </div>
            <h3 className="text-xl font-black text-slate-900">Políticas</h3>
          </div>
          
          <div className="space-y-4">
            {(policies || []).map((pol, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="mt-1 flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-pink-500 mt-2" />
                </div>
                <p className="text-slate-700 font-medium leading-relaxed">
                  {pol.texto || pol.text || (typeof pol === 'string' ? pol : '')}
                </p>
              </div>
            ))}
             {(!policies || policies.length === 0) && (
              <p className="text-slate-400 italic">No definidas.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;