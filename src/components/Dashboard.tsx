'use client';

import { useState, useEffect } from 'react';
import { 
  FaExclamationTriangle, 
  FaChartLine, 
  FaTasks, 
  FaFileAlt, 
  FaProjectDiagram,
  FaArrowRight
} from 'react-icons/fa';
import Link from 'next/link';
import axios from 'axios';
import RiskMatrix from './RiskMatrix';
import IndicatorChart from './IndicatorChart';

// Componente de Tarjeta de Estadística Individual (Estilo Moderno)
const StatCard = ({ title, value, icon, link, color }: { title: string; value: string | number; icon: React.ReactNode; link: string; color: string }) => (
  <Link href={link} className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:-translate-y-1 transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-4 rounded-2xl bg-${color}-50 text-${color}-600 group-hover:bg-${color}-600 group-hover:text-white transition-all`}>
        {icon}
      </div>
      <FaArrowRight className="text-slate-200 group-hover:text-slate-400 transition-colors" />
    </div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
    <p className="text-3xl font-black text-slate-900 mt-1">{value}</p>
  </Link>
);

const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Intentamos obtener datos de la nueva API de Gestión
      const res = await axios.get('/api/gestion/procesos'); // Por ahora procesos, pero podríamos tener un endpoint global
      const processes = res.data || [];

      // Como respaldo, seguimos leyendo cosas de localStorage hasta migrar todo
      const kpiData = JSON.parse(localStorage.getItem('kpiData') || '[]');
      const risks = JSON.parse(localStorage.getItem('corporateRisks') || '[]');
      const documents = JSON.parse(localStorage.getItem('documents') || '[]');

      setStats({
        totalProcesses: processes.length,
        totalIndicators: kpiData.length,
        totalRisks: risks.length,
        totalDocuments: documents.length,
        risks,
        indicators: kpiData
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-400 animate-pulse">Analizando indicadores de gestión...</div>;

  return (
    <section className="space-y-8 mt-16 animate-in fade-in duration-1000">
      <div className="flex items-center gap-4">
        <div className="h-1 w-12 bg-slate-900 rounded-full"></div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Panel de Control de Gestión</h2>
      </div>
      
      {/* Grid de Estadísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Procesos Críticos" value={stats.totalProcesses} icon={<FaProjectDiagram size={20} />} link="/gestion/procesos" color="blue" />
        <StatCard title="Riesgos Identificados" value={stats.totalRisks} icon={<FaExclamationTriangle size={20} />} link="/gestion/riesgos" color="red" />
        <StatCard title="KPIs en Seguimiento" value={stats.totalIndicators} icon={<FaChartLine size={20} />} link="/gestion/indicadores" color="emerald" />
        <StatCard title="Gestión Documental" value={stats.totalDocuments} icon={<FaFileAlt size={20} />} link="/gestion/documentos" color="purple" />
      </div>

      {/* Gráficos Detallados (Si existen datos) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
          <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            Mapa de Calor de Riesgos
          </h3>
          <RiskMatrix risks={stats.risks} />
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
          <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            Desempeño de Indicadores
          </h3>
          <IndicatorChart indicators={stats.indicators} />
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
