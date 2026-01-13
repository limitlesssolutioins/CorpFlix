'use client';

import { useState, useEffect } from 'react';
import { FaExclamationTriangle, FaChartLine, FaTasks, FaFileAlt, FaProjectDiagram } from 'react-icons/fa';
import Link from 'next/link';
import DashboardCard from './DashboardCard';
import RiskMatrix from './RiskMatrix';
import IndicatorChart from './IndicatorChart';

// Interfaces for data structures
interface Risk {
  impact: 'Bajo' | 'Medio' | 'Alto';
  probability: 'Baja' | 'Media' | 'Alta';
}
interface Indicator {
  name: string;
  goal: number;
  measurements: { value: number }[];
}
interface Action {
  status: 'Abierta' | 'En Progreso' | 'Cerrada';
}
interface DashboardStats {
  highRisks: number;
  indicatorsBelowGoal: number;
  openActions: number;
  totalDocuments: number;
  totalProcesses: number;
  risks: Risk[];
  indicators: Indicator[];
}

// StatCard component for top-level metrics
const StatCard = ({ title, value, icon, link, gradientColors }: { title: string; value: string | number; icon: React.ReactNode; link: string; gradientColors: string }) => (
  <Link href={link} className={`stat-card-impact relative block p-6 rounded-xl shadow-lg overflow-hidden text-white transition-transform transform hover:scale-105 ${gradientColors}`}>
    <div className="relative z-10">
        <p className="text-sm font-medium uppercase tracking-wider">{title}</p>
        <p className="text-5xl font-bold mt-2">{value}</p>
    </div>
    <div className="absolute -bottom-4 -right-4 opacity-20 z-0">{icon}</div>
  </Link>
);

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    // Fetch and process data from localStorage
    const riskKeys = ['corporateRisks', 'healthSafetyRisks', 'environmentalRisks', 'financialRisks', 'organizationalRisks'];
    let allRisks: Risk[] = [];
    riskKeys.forEach(key => {
      const stored = localStorage.getItem(key);
      if (stored) allRisks = [...allRisks, ...JSON.parse(stored)];
    });

    const highRisks = allRisks.filter(r => 
        (r.impact === 'Alta' && r.probability === 'Alta') || 
        (r.impact === 'Alta' && r.probability === 'Media') || 
        (r.impact === 'Medio' && r.probability === 'Alta')
    ).length;

    const kpiData = localStorage.getItem('kpiData');
    let indicators: Indicator[] = kpiData ? JSON.parse(kpiData) : [];
    const indicatorsBelowGoal = indicators.filter(ind => {
      const lastMeasurement = ind.measurements[ind.measurements.length - 1];
      return lastMeasurement && lastMeasurement.value < ind.goal;
    }).length;

    const actionKeys = ['improvementActions', 'correctiveActions', 'preventiveActions'];
    let openActions = 0;
    actionKeys.forEach(key => {
      const stored = localStorage.getItem(key);
      if (stored) {
        const actions: Action[] = JSON.parse(stored);
        openActions += actions.filter(a => a.status === 'Abierta' || a.status === 'En Progreso').length;
      }
    });

    const totalDocuments = JSON.parse(localStorage.getItem('documents') || '[]').length;
    const totalProcesses = JSON.parse(localStorage.getItem('processes') || '[]').length;

    setStats({ 
      highRisks, 
      indicatorsBelowGoal, 
      openActions, 
      totalDocuments, 
      totalProcesses, 
      risks: allRisks, 
      indicators 
    });
  }, []);

  if (!stats) {
    return <div className="text-center p-8">Cargando dashboard...</div>;
  }

  return (
    <section className="dashboard-container">
      <h2 className="dashboard-main-title">Panel de Control</h2>
      
      {/* Top Stat Cards */}
      <div className="stat-cards-grid">
        <StatCard title="Riesgos Altos" value={stats.highRisks} icon={<FaExclamationTriangle size={80} />} link="/gestion/riesgos" gradientColors="bg-gradient-to-br from-red-500 to-orange-500" />
        <StatCard title="Indicadores Bajo Meta" value={stats.indicatorsBelowGoal} icon={<FaChartLine size={80} />} link="/gestion/indicadores" gradientColors="bg-gradient-to-br from-blue-500 to-indigo-500" />
        <StatCard title="Acciones Pendientes" value={stats.openActions} icon={<FaTasks size={80} />} link="/gestion/mejora-continua/plan-mejoramiento" gradientColors="bg-gradient-to-br from-yellow-400 to-amber-500" />
        <StatCard title="Procesos Definidos" value={stats.totalProcesses} icon={<FaProjectDiagram size={80} />} link="/gestion/procesos" gradientColors="bg-gradient-to-br from-green-500 to-teal-500" />
        <StatCard title="Documentos Totales" value={stats.totalDocuments} icon={<FaFileAlt size={80} />} link="/gestion/documentos" gradientColors="bg-gradient-to-br from-purple-500 to-violet-500" />
      </div>

      {/* Detailed Cards */}
      <div className="dashboard-details-grid">
        <DashboardCard title="Matriz de Riesgos Resumida">
          <RiskMatrix risks={stats.risks} />
        </DashboardCard>
        <DashboardCard title="Desempeño de Indicadores Clave">
          <IndicatorChart indicators={stats.indicators} />
        </DashboardCard>
      </div>
    </section>
  );
};

export default Dashboard;