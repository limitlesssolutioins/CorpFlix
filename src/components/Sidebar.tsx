'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FaUserTie, FaCog, FaUsers, FaChartLine, FaExclamationTriangle, FaClipboardList, FaTachometerAlt, FaFolderOpen, FaBullseye, FaChevronDown, FaProjectDiagram } from 'react-icons/fa';

const Sidebar = () => {
  const [isAdministracionOpen, setAdministracionOpen] = useState(true);
  const [isGestionOpen, setGestionOpen] = useState(true);
  const [isMejoraContinuaOpen, setIsMejoraContinuaOpen] = useState(false);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link href="/" className="sidebar-logo">CorpFlix</Link>
      </div>
      <nav className="sidebar-nav">
        <div className="nav-section">
            <Link href="/" className="nav-link active">
              <FaUserTie className="nav-icon" />
              Perfil Corporativo
            </Link>
        </div>

        <div className="nav-section">
          <button onClick={() => setAdministracionOpen(!isAdministracionOpen)} className="dropdown-button">
            <span>Administración</span>
            <FaChevronDown className={`dropdown-icon ${isAdministracionOpen ? 'rotate' : ''}`} />
          </button>
          {isAdministracionOpen && (
            <div className="dropdown-content">
              <Link href="/administracion/general" className="nav-link">
                <FaCog className="nav-icon" />
                General
              </Link>
              <Link href="/administracion/roles" className="nav-link">
                <FaUsers className="nav-icon" />
                Roles
              </Link>
            </div>
          )}
        </div>

        <div className="nav-section">
          <button onClick={() => setGestionOpen(!isGestionOpen)} className="dropdown-button">
            <span>Gestión</span>
            <FaChevronDown className={`dropdown-icon ${isGestionOpen ? 'transform rotate-180' : ''}`} />
          </button>
          {isGestionOpen && (
            <div className="dropdown-content">
              <Link href="/gestion/planeacion-estrategica" className="nav-link"><FaBullseye className="nav-icon" />Planeación Estratégica</Link>
              <Link href="/gestion/procesos" className="nav-link"><FaProjectDiagram className="nav-icon" />Procesos</Link>
              <Link href="/gestion/indicadores" className="nav-link"><FaTachometerAlt className="nav-icon" />Indicadores</Link>
              <Link href="/gestion/riesgos" className="nav-link"><FaExclamationTriangle className="nav-icon" />Riesgos</Link>
              <Link href="/gestion/auditoria" className="nav-link"><FaClipboardList className="nav-icon" />Auditoría</Link>
              <Link href="/gestion/mejora-continua" className="nav-link"><FaChartLine className="nav-icon" />Mejora Continua</Link>
              <Link href="/gestion/documentos" className="nav-link"><FaFolderOpen className="nav-icon" />Documentos</Link>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
