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
    <aside className="fixed top-0 left-0 w-72 h-screen p-4 z-50">
      <div className="w-full h-full bg-slate-950/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl">
        
        {/* Profile Section (Header) */}
        <div className="relative p-6 border-b border-white/5">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-full flex items-center gap-4 group transition-transform active:scale-95"
          >
            <div className="relative">
              <div className="w-14 h-14 rounded-full border-2 border-blue-500/30 p-1 group-hover:border-blue-500 transition-all duration-500 rotate-0 group-hover:rotate-[360deg]">
                <div className="w-full h-full rounded-full overflow-hidden bg-slate-800">
                  <img src={companyInfo.logo} alt="Logo" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-slate-950 rounded-full" />
            </div>
            <div className="flex-1 text-left">
              <h2 className="text-sm font-black text-white truncate tracking-tight">{companyInfo.name}</h2>
              <div className="flex items-center gap-1.5">
                <Sparkles size={10} className="text-blue-400" />
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Plan Pro</span>
              </div>
            </div>
            <ChevronDown size={16} className={`text-slate-600 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute top-[85%] left-6 right-6 mt-4 bg-slate-900/95 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl z-[60] overflow-hidden p-1.5 animate-in fade-in zoom-in-95 duration-200">
              <Link 
                href="/administracion/general" 
                onClick={() => setIsProfileOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-sm font-semibold text-slate-300 hover:text-white transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <User size={16} className="text-blue-400" />
                </div>
                Editar Perfil
              </Link>
              <div className="h-px bg-white/5 my-1" />
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 text-sm font-semibold text-red-400 transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <LogOut size={16} />
                </div>
                {isLoggingOut ? 'Saliendo...' : 'Cerrar Sesión'}
              </button>
            </div>
          )}
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-none">
          
          <NavItem href="/" label="Dashboard Corporativo" icon={LayoutDashboard} exact />

          <div className="my-6">
            <Section title="Estrategia" id="gestión" icon={Target}>
              <NavItem href="/gestion/planeacion-estrategica" label="Planeación" icon={Sparkles} />
              <NavItem href="/gestion/procesos" label="Procesos" icon={Network} />
              <NavItem href="/gestion/indicadores" label="Indicadores" icon={BarChart3} />
              <NavItem href="/riesgos" label="Riesgos" icon={AlertTriangle} />
              <NavItem href="/auditoria" label="Auditoría" icon={ClipboardCheck} />
              <NavItem href="/mejora-continua" label="Mejora Continua" icon={Sparkles} />
              <NavItem href="/biblioteca" label="Biblioteca" icon={FolderTree} />
            </Section>

            <Section title="Capital Humano" id="humana" icon={Users2}>
              <NavItem href="/gestion-humana/extras" label="Liquidación Extras" icon={Clock} />
              <NavItem href="/gestion-humana/seguridad-social" label="Seguridad Social" icon={ShieldCheck} />
              <NavItem href="/gestion-humana/domesticas" label="Personal Doméstico" icon={Home} />
            </Section>

            <Section title="Finanzas" id="finanzas" icon={BadgeDollarSign}>
              <NavItem href="/financiero" label="Diagnóstico" icon={PieChart} />
              <NavItem href="/financiero/calculadora" label="Calculadora" icon={Calculator} />
              <NavItem href="/financiero/configuracion" label="Configuración" icon={Wrench} />
            </Section>

            <Section title="Sistema" id="admin" icon={Settings2}>
              <NavItem href="/administracion/suscripcion" label="Suscripción" icon={CreditCard} />
              <NavItem href="/tickets" label="Soporte Técnico" icon={Ticket} />
            </Section>
          </div>
        </div>

        {/* Footer Brand */}
        <div className="p-6 border-t border-white/5 flex items-center justify-center gap-2">
          <img src="/ISOLOGO.png" alt="Lidus" className="h-5 opacity-40 grayscale" />
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Lidus 2026</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
