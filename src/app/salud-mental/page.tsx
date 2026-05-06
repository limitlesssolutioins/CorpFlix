'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  BrainCircuit, 
  Activity, 
  HeartHandshake, 
  BarChart4, 
  ArrowRight,
  ShieldCheck,
  TrendingDown,
  Users
} from 'lucide-react';

export default function SaludMentalDashboard() {
  const router = useRouter();

  const metrics = [
    { title: 'Índice de Burnout Global', value: '18%', trend: '-2.4%', status: 'good' },
    { title: 'Evaluaciones Completadas', value: '142', trend: '+12', status: 'neutral' },
    { title: 'Riesgo Psicosocial Alto', value: '4 Áreas', trend: 'Revisión Necesaria', status: 'warning' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 rounded-bl-full -mr-20 -mt-20 blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20">
              <BrainCircuit className="text-primary-400" size={24} />
            </div>
            <h1 className="text-3xl font-black tracking-tight">Ecosistema de Salud Mental</h1>
          </div>
          <p className="text-slate-400 font-medium max-w-2xl leading-relaxed">
            Un espacio integral para medir, prevenir y actuar sobre el bienestar de tus colaboradores. Cumple con la normativa (Res. 2646) mientras construyes una cultura organizacional saludable y resiliente.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((m, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{m.title}</p>
              <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{m.value}</h3>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${
                m.status === 'good' ? 'bg-emerald-50 text-emerald-600' : 
                m.status === 'warning' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-600'
              }`}>
                {m.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Modules Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Module 1: Laboral */}
        <div 
          onClick={() => router.push('/salud-mental/laboral')}
          className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm cursor-pointer hover:border-primary-500 group transition-all duration-300 relative overflow-hidden"
        >
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
            <Activity size={28} />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">Salud Mental Laboral</h3>
          <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed">
            Evaluación de Riesgo Psicosocial, clima laboral, encuestas Intralaborales (Forma A y B) y mapa de carga de trabajo.
          </p>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600 group-hover:gap-4 transition-all">
            Ir al Módulo <ArrowRight size={14} />
          </div>
        </div>

        {/* Module 2: Personal */}
        <div 
          onClick={() => router.push('/salud-mental/personal')}
          className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm cursor-pointer hover:border-purple-500 group transition-all duration-300 relative overflow-hidden"
        >
          <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all">
            <Users size={28} />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">Bienestar Personal</h3>
          <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed">
            Encuestas Extralaborales, Mood Tracker anónimo, evaluación de estrés (Burnout) e historial clínico de bienestar.
          </p>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-purple-600 group-hover:gap-4 transition-all">
            Ir al Módulo <ArrowRight size={14} />
          </div>
        </div>

        {/* Module 3: Bienestar & Acción */}
        <div 
          onClick={() => router.push('/salud-mental/bienestar')}
          className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-lg cursor-pointer hover:border-emerald-500 group transition-all duration-300 relative overflow-hidden"
        >
          <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all">
            <HeartHandshake size={28} />
          </div>
          <h3 className="text-xl font-black text-white mb-2">Centro de Acción</h3>
          <p className="text-sm text-slate-400 font-medium mb-8 leading-relaxed">
            Cápsulas de resiliencia, rutas de intervención, pausas cognitivas y botón S.O.S. para intervención en crisis.
          </p>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400 group-hover:gap-4 transition-all">
            Ir al Módulo <ArrowRight size={14} />
          </div>
        </div>

      </div>

      {/* Analytics Preview Banner */}
      <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-slate-50 rounded-2xl">
            <BarChart4 className="text-slate-400" size={32} />
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-900">Dashboard Gerencial (Próximamente)</h4>
            <p className="text-sm text-slate-500">Cruces de datos entre niveles de estrés y novedades de nómina.</p>
          </div>
        </div>
        <button className="px-6 py-3 bg-slate-100 text-slate-400 rounded-xl text-xs font-black uppercase tracking-widest cursor-not-allowed">
          En Desarrollo
        </button>
      </div>
    </div>
  );
}
