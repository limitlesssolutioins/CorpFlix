import { FaBuilding } from 'react-icons/fa';

interface HeaderProps {
  name: string;
  logoUrl?: string; // Nuevo prop opcional
}

const Header = ({ name, logoUrl }: HeaderProps) => {
  return (
    <header className="relative overflow-hidden rounded-[3rem] bg-slate-900 text-white p-16 shadow-2xl mb-12">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
        <div className={`flex items-center justify-center transition-all overflow-hidden ${
          logoUrl 
            ? 'w-64 h-48 rounded-2xl' // Espacio amplio y transparente
            : 'p-6 w-32 h-32 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md'
        }`}>
          {logoUrl ? (
            <img 
              src={logoUrl} 
              alt="Logo Corporativo" 
              className="w-full h-full object-contain" 
            />
          ) : (
            <FaBuilding className="text-6xl text-blue-400" />
          )}
        </div>
        
        <div className="text-center md:text-left">
          <div className="inline-block px-4 py-1 mb-4 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-widest">
            Perfil Corporativo
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-500">
            {name || 'LIDUS'}
          </h1>
          <p className="mt-4 text-xl text-slate-400 max-w-2xl">
            Plataforma Integral de Gestión y Desarrollo Organizacional
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;