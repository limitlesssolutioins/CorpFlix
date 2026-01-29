import React, { ReactNode, useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  LayoutDashboard, 
  Users, 
  CalendarDays, 
  FileText, 
  Settings, 
  Zap,
  Bell,
  UserCircle,
  LogOut,
  ChevronRight,
  AlertCircle,
  X,
  ShieldCheck,
  Building2,
  PieChart,
  UserMinus
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await axios.get('http://localhost:3000/dashboard/stats');
        setAlerts(res.data.recentConflicts || []);
      } catch (e) { console.error(e); }
    };
    fetchAlerts();
  }, [location.pathname]);

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) => 
    `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
      isActive 
        ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`;

  const groups = [
    {
        title: "Gestión",
        items: [
            { to: "/dashboard", icon: <LayoutDashboard size={18} />, label: "Dashboard" },
            { to: "/employees", icon: <Users size={18} />, label: "Directorio Personal" },
            { to: "/shifts", icon: <CalendarDays size={18} />, label: "Control de Turnos" },
            { to: "/scheduler", icon: <Zap size={18} />, label: "Programador IA" },
        ]
    },
    {
        title: "Financiero",
        items: [
            { to: "/payroll", icon: <FileText size={18} />, label: "Nómina y Liquidación" },
            { to: "/payroll/social-security", icon: <ShieldCheck size={18} />, label: "Seguridad Social (PILA)" },
            { to: "/payroll/settlements", icon: <UserMinus size={18} />, label: "Liquidación Contratos" },
        ]
    },
    {
        title: "Control y Analítica",
        items: [
            { to: "/payroll/pre-billing", icon: <Building2 size={18} />, label: "Horas por Sede" },
            { to: "/audit", icon: <ShieldCheck size={18} />, label: "Auditoría de Cambios" },
        ]
    }
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <aside className="w-72 bg-slate-900 flex flex-col border-r border-slate-800 shadow-2xl z-20">
        <div className="p-8 flex items-center gap-3">
          <div className="bg-primary-500 h-10 w-10 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
            <Zap size={22} className="text-white" fill="currentColor" />
          </div>
          <span className="text-xl font-black text-white tracking-tighter uppercase">TurnoFlow <span className="text-primary-400 text-[10px] font-normal tracking-widest block -mt-1 opacity-60">Enterprise</span></span>
        </div>
        
        <nav className="flex-1 px-4 space-y-8 mt-4 overflow-y-auto pb-10">
          {groups.map((group, idx) => (
            <div key={idx} className="space-y-2">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] px-4 mb-3">{group.title}</p>
                <div className="space-y-1">
                    {group.items.map((item) => (
                        <NavLink key={item.to} to={item.to} className={getNavLinkClass}>
                            {item.icon}
                            <span className="text-xs font-bold">{item.label}</span>
                            <ChevronRight size={12} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                        </NavLink>
                    ))}
                </div>
            </div>
          ))}
        </nav>

        <div className="p-6 mt-auto border-t border-slate-800/50">
          <NavLink to="/settings" className={getNavLinkClass}>
            <Settings size={18} />
            <span className="text-xs font-bold">Configuración Maestro</span>
          </NavLink>
          
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-rose-500/10 hover:text-rose-400 transition-all w-full mt-2 group">
            <LogOut size={18} />
            <span className="text-xs font-bold">Cerrar Sesión</span>
          </button>
        </div>
      </aside>
      
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 z-10">
          <h2 className="text-slate-400 text-xs font-black uppercase tracking-widest">
            {groups.flatMap(g => g.items).find(i => i.to === location.pathname)?.label || "Panel de Gestión"}
          </h2>
          
          <div className="flex items-center gap-6 relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative p-2.5 rounded-xl transition-all ${showNotifications ? 'bg-primary-50 text-primary-600 shadow-inner' : 'text-slate-400 hover:bg-slate-50 hover:text-primary-600'}`}
            >
              <Bell size={20} />
              {alerts.length > 0 && <span className="absolute top-2 right-2 h-2 w-2 bg-rose-500 rounded-full border-2 border-white animate-ping"></span>}
            </button>

            {showNotifications && (
              <div className="absolute top-14 right-0 w-80 bg-white rounded-3xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Notificaciones</h3>
                  <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {alerts.length > 0 ? (
                    alerts.map((alert, i) => (
                      <div key={i} onClick={() => { if (alert.employeeId) { navigate(`/employees/profile/${alert.employeeId}`); setShowNotifications(false); } }} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group">
                        <div className="flex gap-3">
                          <div className={`p-2 h-fit rounded-xl ${alert.severity === 'critical' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}><AlertCircle size={16} /></div>
                          <div>
                            <p className="text-xs font-black text-slate-900 group-hover:text-primary-600 transition-colors">{alert.employee}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{alert.type}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-slate-400 font-medium italic text-xs">Sin notificaciones pendientes.</div>
                  )}
                </div>
              </div>
            )}
            
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-slate-900 group-hover:text-primary-600 transition-colors uppercase tracking-tighter">Administrador</p>
                <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">Limitless Solutions</p>
              </div>
              <div className="h-11 w-11 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600 shadow-inner border border-primary-200">
                <UserCircle size={24} />
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-10 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;