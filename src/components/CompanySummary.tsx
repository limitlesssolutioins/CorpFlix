import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaGlobe, 
  FaIdCard, 
  FaBriefcase 
} from 'react-icons/fa';

interface CompanySummaryProps {
  summary: string;
  razonSocial: string;
  nit: string;
  direccion: string;
  telefono: string;
  email: string;
  website: string;
  actividadComercial: string;
}

const CompanySummary = (props: CompanySummaryProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
      {/* Main Summary Card */}
      <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
        <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
          <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
          Resumen Ejecutivo
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed font-medium">
          {props.summary}
        </p>
        
        <div className="mt-8 pt-8 border-t border-slate-100">
           <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Actividad Económica</h3>
           <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl">
             <div className="p-3 bg-white text-blue-600 rounded-xl shadow-sm">
               <FaBriefcase />
             </div>
             <p className="text-slate-700 font-medium">{props.actividadComercial}</p>
           </div>
        </div>
      </div>

      {/* Contact & Legal Info Column */}
      <div className="space-y-6">
        {/* Legal Card */}
        <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 transform group-hover:scale-110 transition-transform duration-700">
             <FaIdCard className="text-9xl" />
          </div>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <FaIdCard className="text-emerald-400" /> Información Legal
          </h3>
          <div className="space-y-4 relative z-10">
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase">Razón Social</p>
              <p className="text-lg font-bold">{props.razonSocial}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase">NIT</p>
              <p className="text-lg font-mono font-bold tracking-wider text-emerald-400">{props.nit}</p>
            </div>
          </div>
        </div>

        {/* Contact Grid */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-lg shadow-slate-200/50">
           <h3 className="text-lg font-bold text-slate-900 mb-6">Contacto Directo</h3>
           <ul className="space-y-5">
             <li className="flex items-center gap-4 group cursor-default">
               <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                 <FaMapMarkerAlt />
               </div>
               <span className="text-slate-600 font-medium text-sm">{props.direccion}</span>
             </li>
             <li className="flex items-center gap-4 group cursor-default">
               <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
                 <FaPhone />
               </div>
               <span className="text-slate-600 font-medium text-sm">{props.telefono}</span>
             </li>
             <li className="flex items-center gap-4 group cursor-default">
               <div className="p-3 bg-pink-50 text-pink-600 rounded-xl group-hover:bg-pink-600 group-hover:text-white transition-colors">
                 <FaEnvelope />
               </div>
               <span className="text-slate-600 font-medium text-sm break-all">{props.email}</span>
             </li>
             <li className="flex items-center gap-4 group cursor-default">
               <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                 <FaGlobe />
               </div>
               <span className="text-slate-600 font-medium text-sm">{props.website}</span>
             </li>
           </ul>
        </div>
      </div>
    </div>
  );
};

export default CompanySummary;