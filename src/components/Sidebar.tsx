'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Settings2, 
  Users2, 
  BarChart3, 
  AlertTriangle, 
  ClipboardCheck, 
  FolderTree, 
  Target, 
  ChevronDown, 
  Network, 
  BadgeDollarSign, 
  CreditCard, 
  LogOut, 
  ShieldCheck, 
  Clock, 
  Home, 
  PieChart, 
  Calculator, 
  Wrench, 
  Ticket,
  User,
  ChevronRight,
  Sparkles
} from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('gestión');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [companyInfo, setCompanyInfo] = useState({ name: '', logo: '' });

  useEffect(() => {
    fetch('/api/admin/general')
      .then(res => res.json())
      .then(data => {
        setCompanyInfo({
          name: data.nombreEmpresa || 'Mi Empresa',
          logo: data.logoUrl || '/ISOLOGO.png'
        });
      })
      .catch(() => setCompanyInfo({ name: 'Lidus Platform', logo: '/ISOLOGO.png' }));
  }, []);

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch {
      router.push('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const NavItem = ({ href, label, icon: Icon, exact = false }: any) => {
    const active = exact ? pathname === href : isActive(href);
    return (
      <Link
        href={href}
        className={`group flex items-center justify-between p-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
          active 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
            : 'text-slate-400 hover:bg-white/5 hover:text-white'
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon size={18} className={active ? 'text-white' : 'text-slate-500 group-hover:text-blue-400 transition-colors'} />
          <span>{label}</span>
        </div>
        {active && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
      </Link>
    );
  };

  const Section = ({ title, id, children, icon: Icon }: any) => {
    const isOpen = expandedSection === id;
    return (
      <div className="mb-2">
        <button
          onClick={() => setExpandedSection(isOpen ? null : id)}
          className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all ${
            isOpen ? 'bg-white/5 text-white' : 'text-slate-500 hover:bg-white/5 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <Icon size={18} className={isOpen ? 'text-blue-400' : 'text-slate-500'} />
            <span className="text-xs font-black uppercase tracking-widest">{title}</span>
          </div>
          <ChevronRight size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-90 text-blue-400' : ''}`} />
        </button>
        <div className={`mt-1 pl-2 space-y-1 overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          {children}
        </div>
      </div>
    );
  };

  return (
    <aside className="fixed top-0 left-0 w-72 h-screen z-50">
      <div className="w-full h-full bg-slate-950 border-r border-white/5 flex flex-col overflow-hidden shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
        
        {/* Profile Section (Header) */}
        <div className="relative p-7 border-b border-white/5 bg-white/[0.02]">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-full flex items-center gap-4 group transition-transform active:scale-95"
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-blue-500/20 p-0.5 group-hover:border-blue-500 transition-all duration-500">
                <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 shadow-inner">
                  <img src={companyInfo.logo} alt="Logo" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-950 rounded-full" />
            </div>
            <div className="flex-1 text-left">
              <h2 className="text-sm font-bold text-white truncate tracking-tight">{companyInfo.name}</h2>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Premium Plan</span>
              </div>
            </div>
            <ChevronDown size={14} className={`text-slate-600 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute top-[85%] left-4 right-4 mt-2 bg-slate-900 border border-white/10 rounded-xl shadow-2xl z-[60] overflow-hidden p-1 animate-in fade-in slide-in-from-top-2 duration-200">
              <Link 
                href="/administracion/general" 
                onClick={() => setIsProfileOpen(false)}
                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/5 text-sm font-medium text-slate-400 hover:text-white transition-all"
              >
                <User size={14} />
                Perfil Empresa
              </Link>
              <div className="h-px bg-white/5 my-1" />
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-red-500/10 text-sm font-medium text-red-400 transition-all"
              >
                <LogOut size={14} />
                {isLoggingOut ? 'Saliendo...' : 'Cerrar Sesión'}
              </button>
            </div>
          )}
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto px-4 py-8 space-y-2 scrollbar-none">
          
          <NavItem href="/" label="Dashboard" icon={LayoutDashboard} exact />

          <div className="pt-6 space-y-4">
            <Section title="Estrategia" id="gestión" icon={Target}>
              <NavItem href="/gestion/planeacion-estrategica" label="Planeación" icon={Sparkles} />
              <NavItem href="/gestion/procesos" label="Procesos" icon={Network} />
              <NavItem href="/gestion/indicadores" label="Indicadores" icon={BarChart3} />
              <NavItem href="/riesgos" label="Riesgos" icon={AlertTriangle} />
              <NavItem href="/auditoria" label="Auditoría" icon={ClipboardCheck} />
              <NavItem href="/mejora-continua" label="Mejora" icon={Sparkles} />
              <NavItem href="/biblioteca" label="Biblioteca" icon={FolderTree} />
            </Section>

            <Section title="Operaciones" id="humana" icon={Users2}>
              <NavItem href="/gestion-humana/extras" label="Horas Extras" icon={Clock} />
              <NavItem href="/gestion-humana/seguridad-social" label="Seg. Social" icon={ShieldCheck} />
              <NavItem href="/gestion-humana/domesticas" label="Domésticas" icon={Home} />
            </Section>

            <Section title="Finanzas" id="finanzas" icon={BadgeDollarSign}>
              <NavItem href="/financiero" label="Diagnóstico" icon={PieChart} />
              <NavItem href="/financiero/calculadora" label="Calculadora" icon={Calculator} />
              <NavItem href="/financiero/configuracion" label="Configuración" icon={Wrench} />
            </Section>

            <Section title="Sistema" id="admin" icon={Settings2}>
              <NavItem href="/administracion/suscripcion" label="Suscripción" icon={CreditCard} />
              <NavItem href="/tickets" label="Soporte" icon={Ticket} />
            </Section>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-white/[0.01] border-t border-white/5 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 grayscale opacity-30">
            <img src="/ISOLOGO.png" alt="Lidus" className="h-4" />
            <span className="text-[9px] font-black tracking-[0.3em] text-white">LIDUS</span>
          </div>
          <p className="text-[8px] text-slate-600 font-bold uppercase">v0.1.0 © 2026</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
