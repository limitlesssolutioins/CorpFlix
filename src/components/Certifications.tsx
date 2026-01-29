import Image from 'next/image';
import { FaAward } from 'react-icons/fa';

interface Certification {
  name: string;
  logoUrl: string;
}

interface CertificationsProps {
  certifications: Certification[];
}

const Certifications = ({ certifications }: CertificationsProps) => {
  return (
    <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50 h-full">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
          <FaAward size={20} />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900">Certificaciones</h3>
          <p className="text-sm text-slate-400 font-medium">Estándares de Calidad y Cumplimiento</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {certifications.map((cert, index) => (
          <div key={index} className="flex flex-col items-center gap-3 group">
            <div className="w-full aspect-square bg-slate-50 rounded-2xl flex items-center justify-center p-4 border border-slate-100 group-hover:border-amber-200 group-hover:bg-amber-50/30 transition-all">
              {/* Fallback visual if no image is present, or the actual image */}
              <div className="text-center">
                 <span className="block text-2xl font-black text-slate-300 group-hover:text-amber-500 transition-colors">ISO</span>
                 <span className="text-xs font-bold text-slate-400">{cert.name.replace('ISO', '').trim()}</span>
              </div>
            </div>
            <p className="text-xs font-bold text-slate-600 text-center uppercase tracking-wider">{cert.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Certifications;
