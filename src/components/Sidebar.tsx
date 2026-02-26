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
  FaClock,
  FaMoneyBillWave,
  FaIdCard,
  FaCreditCard,
  FaSignOutAlt
} from 'react-icons/fa';

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isAdministracionOpen, setAdministracionOpen] = useState(true);
  const [isRecursosHumanosOpen, setRecursosHumanosOpen] = useState(true); // New state
  const [isGestionOpen, setGestionOpen] = useState(true);
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
          <Link href="/" className={`flex items-center p-3 rounded-lg font-semibold text-white transition-colors hover:bg-slate-700 ${isActive('/') && pathname === '/' ? 'bg-blue-600' : ''}`}>
            <FaUserTie className="mr-3 text-lg" />
            Perfil Corporativo
          </Link>
        </div>

        {/* Gestión Humana */}
        <div className="mb-2">
          <Link href="/gestion-humana" className={`flex items-center p-3 rounded-lg font-semibold text-white transition-colors hover:bg-slate-700 ${isActive('/gestion-humana') ? 'bg-blue-600' : ''}`}>
            <FaUsers className="mr-3 text-lg" />
            Gestión Humana
          </Link>
        </div>

        {/* Finanzas */}
        <div className="mb-2">
          <Link href="/financiero" className={`flex items-center p-3 rounded-lg font-semibold text-white transition-colors hover:bg-slate-700 ${isActive('/financiero') && pathname === '/financiero' ? 'bg-blue-600' : ''}`}>
            <FaMoneyBillWave className="mr-3 text-lg" />
            Finanzas
          </Link>
        </div>

        {/* Administración */}
        <div className="mb-2">
          <button onClick={() => setAdministracionOpen(!isAdministracionOpen)} className="w-full flex justify-between items-center p-3 text-xs font-bold text-slate-400 uppercase tracking-widest bg-transparent border-none cursor-pointer rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
            <span>Administración</span>
            <FaChevronDown className={`transition-transform duration-300 ${isAdministracionOpen ? 'rotate-180' : ''}`} />
          </button>
          {isAdministracionOpen && (
            <div className="mt-2 pl-2 flex flex-col gap-1">
              <Link href="/administracion/general" className={`flex items-center p-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors ${pathname === '/administracion/general' ? 'bg-slate-800 text-white' : ''}`}>
                <FaCog className="mr-3" />
                General
              </Link>
<Link href="/administracion/suscripcion" className={`flex items-center p-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors ${pathname === '/administracion/suscripcion' ? 'bg-slate-800 text-white' : ''}`}>
                <FaCreditCard className="mr-3" />
                Suscripción
              </Link>
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
            <div className="mt-2 pl-2 flex flex-col gap-1">
              <Link href="/gestion/planeacion-estrategica" className={`flex items-center p-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors ${pathname === '/gestion/planeacion-estrategica' ? 'bg-slate-800 text-white' : ''}`}><FaBullseye className="mr-3" />Planeación Estratégica</Link>
              <Link href="/gestion/procesos" className={`flex items-center p-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors ${pathname === '/gestion/procesos' ? 'bg-slate-800 text-white' : ''}`}><FaProjectDiagram className="mr-3" />Procesos</Link>
              <Link href="/gestion/indicadores" className={`flex items-center p-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors ${pathname === '/gestion/indicadores' ? 'bg-slate-800 text-white' : ''}`}><FaTachometerAlt className="mr-3" />Indicadores</Link>
              <Link href="/riesgos" className={`flex items-center p-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors ${isActive('/riesgos') ? 'bg-slate-800 text-white' : ''}`}><FaExclamationTriangle className="mr-3" />Riesgos</Link>
              <Link href="/auditoria" className={`flex items-center p-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors ${isActive('/auditoria') ? 'bg-slate-800 text-white' : ''}`}><FaClipboardList className="mr-3" />Auditoría</Link>
              <Link href="/mejora-continua" className={`flex items-center p-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors ${isActive('/mejora-continua') ? 'bg-slate-800 text-white' : ''}`}><FaChartLine className="mr-3" />Mejora Continua</Link>
              <Link href="/biblioteca" className={`flex items-center p-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors ${isActive('/biblioteca') ? 'bg-slate-800 text-white' : ''}`}><FaFolderOpen className="mr-3" />Biblioteca</Link>

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
