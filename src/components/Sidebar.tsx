'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  FaUserTie,
  FaCog,
  FaUsers,
  FaChartLine,
  FaExclamationTriangle,
  FaClipboardList,
  FaTachometerAlt,
  FaFolderOpen,
  FaBullseye,
  FaChevronDown,
  FaProjectDiagram,
  FaMoneyBillWave,
  FaCreditCard,
  FaSignOutAlt,
  FaShieldAlt,
  FaClock,
  FaHome,
  FaChartPie,
  FaCalculator,
  FaWrench,
  FaTicketAlt
} from 'react-icons/fa';

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isAdministracionOpen, setAdministracionOpen] = useState(true);
  const [isGestionOpen, setGestionOpen] = useState(true);
  const [isGestionHumanaOpen, setGestionHumanaOpen] = useState(true);
  const [isFinanzasOpen, setFinanzasOpen] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/companies/logout', { method: 'POST' });
    } finally {
      router.push('/login');
      router.refresh();
      setIsLoggingOut(false);
    }
  };

  const subLink = (href: string, label: string, Icon: any, exact = false) => {
    const active = exact ? pathname === href : isActive(href);
    return (
      <Link
        href={href}
        className={`flex items-center p-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors ${active ? 'bg-slate-800 text-white' : ''}`}
      >
        <Icon className="mr-3 shrink-0" />
        {label}
      </Link>
    );
  };

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col fixed top-0 left-0 h-screen overflow-y-auto z-50">
      <div className="p-5 border-b border-slate-700">
        <Link href="/" className="text-2xl font-bold text-white no-underline flex items-center gap-3">
          <img src="/ISOLOGO.png" alt="Isologo" className="h-8 w-auto" />
          <img src="/TEXTO.png" alt="Lidus" className="h-6 w-auto" />
        </Link>
      </div>

      <nav className="flex-grow p-4 flex flex-col gap-2">

        {/* Perfil Corporativo */}
        <div className="mb-2">
          <Link href="/" className={`flex items-center p-3 rounded-lg font-semibold text-white transition-colors hover:bg-slate-700 ${pathname === '/' ? 'bg-blue-600' : ''}`}>
            <FaUserTie className="mr-3 text-lg" />
            Perfil Corporativo
          </Link>
        </div>

        {/* Administración */}
        <div className="mb-2">
          <button onClick={() => setAdministracionOpen(!isAdministracionOpen)} className="w-full flex justify-between items-center p-3 text-xs font-bold text-slate-400 uppercase tracking-widest bg-transparent border-none cursor-pointer rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
            <span>Administración</span>
            <FaChevronDown className={`transition-transform duration-300 ${isAdministracionOpen ? 'rotate-180' : ''}`} />
          </button>
          {isAdministracionOpen && (
            <div className="mt-1 pl-2 flex flex-col gap-1">
              {subLink('/administracion/general', 'General', FaCog, true)}
              {subLink('/administracion/suscripcion', 'Suscripción', FaCreditCard, true)}
            </div>
          )}
        </div>

        {/* Gestión */}
        <div className="mb-2">
          <button onClick={() => setGestionOpen(!isGestionOpen)} className="w-full flex justify-between items-center p-3 text-xs font-bold text-slate-400 uppercase tracking-widest bg-transparent border-none cursor-pointer rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
            <span>Gestión</span>
            <FaChevronDown className={`transition-transform duration-300 ${isGestionOpen ? 'rotate-180' : ''}`} />
          </button>
          {isGestionOpen && (
            <div className="mt-1 pl-2 flex flex-col gap-1">
              {subLink('/gestion/planeacion-estrategica', 'Planeación Estratégica', FaBullseye, true)}
              {subLink('/gestion/procesos', 'Procesos', FaProjectDiagram, true)}
              {subLink('/gestion/indicadores', 'Indicadores', FaTachometerAlt, true)}
              {subLink('/riesgos', 'Riesgos', FaExclamationTriangle)}
              {subLink('/auditoria', 'Auditoría', FaClipboardList)}
              {subLink('/mejora-continua', 'Mejora Continua', FaChartLine)}
              {subLink('/tickets', 'Tickets', FaTicketAlt)}
              {subLink('/biblioteca', 'Biblioteca', FaFolderOpen)}
            </div>
          )}
        </div>

        {/* Gestión Humana */}
        <div className="mb-2">
          <button onClick={() => setGestionHumanaOpen(!isGestionHumanaOpen)} className="w-full flex justify-between items-center p-3 text-xs font-bold text-slate-400 uppercase tracking-widest bg-transparent border-none cursor-pointer rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
            <span>Gestión Humana</span>
            <FaChevronDown className={`transition-transform duration-300 ${isGestionHumanaOpen ? 'rotate-180' : ''}`} />
          </button>
          {isGestionHumanaOpen && (
            <div className="mt-1 pl-2 flex flex-col gap-1">
              {subLink('/gestion-humana/extras', 'Liquidación Extras', FaClock)}
              {subLink('/gestion-humana/seguridad-social', 'Seguridad Social', FaShieldAlt)}
              {subLink('/gestion-humana/domesticas', 'Personal Doméstico', FaHome)}
            </div>
          )}
        </div>

        {/* Finanzas */}
        <div className="mb-2">
          <button onClick={() => setFinanzasOpen(!isFinanzasOpen)} className="w-full flex justify-between items-center p-3 text-xs font-bold text-slate-400 uppercase tracking-widest bg-transparent border-none cursor-pointer rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
            <span>Finanzas</span>
            <FaChevronDown className={`transition-transform duration-300 ${isFinanzasOpen ? 'rotate-180' : ''}`} />
          </button>
          {isFinanzasOpen && (
            <div className="mt-1 pl-2 flex flex-col gap-1">
              {subLink('/financiero', 'Diagnóstico', FaChartPie, true)}
              {subLink('/financiero/calculadora', 'Calculadora', FaCalculator)}
              {subLink('/financiero/configuracion', 'Configuración', FaWrench)}
            </div>
          )}
        </div>

      </nav>

      <div className="p-4 border-t border-slate-700">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-lg font-semibold text-white bg-slate-800 hover:bg-slate-700 disabled:opacity-60 transition-colors"
        >
          <FaSignOutAlt className="text-base" />
          {isLoggingOut ? 'Cerrando sesion...' : 'Cerrar sesion'}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
