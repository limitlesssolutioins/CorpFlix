'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Shield, Sparkles, TrendingUp, Users, FileText } from 'lucide-react';

const HeroSection = () => {
  const [activeTab, setActiveTab] = useState<'risks' | 'indicators' | 'audits'>('indicators');

  const tabsInfo = [
    {
      id: 'indicators' as const,
      label: 'Gestión Humana',
      icon: Users,
      image: '/portfolio/indicadores.jpg',
      badge: 'Nómina, Turnos y Asistencia',
      metricTitle: 'Asistencia y Turnos',
      metricValue: '98.5% Cumplimiento',
      colorClass: 'text-blue-400 border-blue-500/30 bg-blue-500/10'
    },
    {
      id: 'risks' as const,
      label: 'Matrices de Riesgo',
      icon: TrendingUp,
      image: '/portfolio/riesgos.jpg',
      badge: 'Identificación y Mitigación',
      metricTitle: 'Riesgos Mitigados',
      metricValue: '85% Automatizado',
      colorClass: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
    },
    {
      id: 'audits' as const,
      label: 'Auditorías e ISO',
      icon: Shield,
      image: '/portfolio/auditorias.jpg',
      badge: 'ISO 9001, 14001, 45001',
      metricTitle: 'Puntuación Auditoría',
      metricValue: '99.2% Excelente',
      colorClass: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10'
    }
  ];

  const currentTab = tabsInfo.find(t => t.id === activeTab) || tabsInfo[0];

  return (
    <section 
      className="relative flex flex-col items-center justify-center pt-28 md:pt-36 pb-16 md:pb-24 px-6 bg-slate-950 min-h-[90vh] md:min-h-screen overflow-hidden"
    >
      {/* Scope-encapsulated smooth floating animations */}
      <style jsx global>{`
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-12px) scale(1.02); }
        }
        @keyframes float-gentle-delayed {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(12px) scale(0.98); }
        }
        .animate-float-1 {
          animation: float-gentle 7s ease-in-out infinite;
        }
        .animate-float-2 {
          animation: float-gentle-delayed 9s ease-in-out infinite;
        }
      `}</style>

      {/* Layered Background Glows */}
      <div className="absolute top-0 left-1/4 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-blue-600/10 blur-[100px] md:blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] md:w-[550px] md:h-[550px] bg-indigo-600/10 blur-[90px] md:blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[85%] md:w-[800px] h-[350px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Main Content Wrapper */}
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 md:gap-20 relative z-10">
        
        {/* Left Side: Sales Content */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
          
          {/* Main Title - Extremely focused on what Lidus is */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] md:leading-[1.05] tracking-tight mb-6">
            La plataforma todo en uno para <br className="hidden sm:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-300%">
              Gestión Humana y Calidad ISO
            </span>
          </h1>

          {/* Value Prop Subheadline */}
          <p className="text-base md:text-xl text-slate-400 max-w-xl mb-10 leading-relaxed font-medium">
            Automatiza nóminas, turnos, auditorías y control de riesgos con inteligencia artificial. Diseñada para llevar a las empresas al siguiente nivel de excelencia operativa bajo normativa colombiana.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-12">
            <Link 
              href="/login?signup=true" 
              className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-black text-lg transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 flex items-center justify-center gap-3"
            >
              Comenzar ahora
              <ChevronRight size={20} className="stroke-[3]" />
            </Link>
            <a 
              href="#pricing" 
              className="w-full sm:w-auto px-10 py-5 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold text-lg border border-white/10 hover:border-white/20 backdrop-blur-md transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center"
            >
              Ver Precio
            </a>
          </div>

          {/* Value Propositions / Key pillars below CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left w-full border-t border-white/10 pt-8">
            <div className="bg-white/5 p-4 rounded-2xl sm:bg-transparent sm:p-0">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-sm mb-2">
                <Users size={16} className="text-blue-400" />
                Gestión Humana
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Control de asistencia, turnos rotativos y liquidaciones de nómina integradas 100% en tiempo real.
              </p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl sm:bg-transparent sm:p-0">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm mb-2">
                <Shield size={16} className="text-cyan-400" />
                ISO y Res. 0312
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Estructura automática para ISO 9001, 14001, 45001 y estándares del Ministerio de Trabajo.
              </p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl sm:bg-transparent sm:p-0">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm mb-2">
                <Sparkles size={16} className="text-indigo-400 animate-pulse" />
                Asistente IA
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generador automático de matrices de riesgos, planes de acción y documentación técnica.
              </p>
            </div>
          </div>

        </div>

        {/* Right Side: Interactive Mockup Display */}
        <div className="w-full lg:w-1/2 flex flex-col items-center mt-8 lg:mt-0">
          
          {/* Interactive Navigation Tabs for the Mockup */}
          <div className="flex bg-slate-900/80 p-1.5 rounded-2xl border border-white/5 gap-1 mb-6 w-full max-w-[500px] backdrop-blur-md">
            {tabsInfo.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={14} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full max-w-[500px] px-4 sm:px-0">
            
            {/* Glowing aura behind mockup */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/20 to-indigo-600/10 rounded-[3rem] blur-2xl opacity-50 pointer-events-none" />
            
            {/* Premium Mockup Frame */}
            <div className="relative bg-slate-900 border border-white/10 rounded-[3rem] p-2 md:p-3 shadow-2xl transition-all duration-500 hover:border-blue-500/30 group">
              
              {/* Browser bar decor */}
              <div className="flex items-center gap-1.5 px-5 pt-2 pb-4 border-b border-white/5">
                <span className="w-2 h-2 rounded-full bg-red-500/40" />
                <span className="w-2 h-2 rounded-full bg-yellow-500/40" />
                <span className="w-2 h-2 rounded-full bg-green-500/40" />
                <span className="text-[9px] text-slate-500 ml-3 font-mono select-none bg-white/5 px-2 py-0.5 rounded-md w-full max-w-[180px] truncate">
                  lidus.co/app/{activeTab}
                </span>
              </div>

              <div className="bg-slate-950 rounded-[1.75rem] overflow-hidden relative aspect-[4/3] sm:aspect-auto">
                {/* Visual Glass Reflection Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent pointer-events-none z-10" />
                
                {/* Simulated Loading Overlay when Tab Changes */}
                <img 
                  key={activeTab}
                  src={currentTab.image} 
                  alt={currentTab.badge} 
                  className="w-full h-full object-cover sm:h-auto sm:object-contain transform group-hover:scale-[1.015] transition-all duration-700 block animate-fade-in" 
                />
              </div>
            </div>

            {/* Dynamic Floating Card (Adapts to Active Tab) */}
            <div className="absolute -top-4 -left-2 sm:-top-6 sm:-left-8 bg-slate-900/90 border border-white/10 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 animate-float-1 hover:border-blue-500/30 transition-all z-20 scale-90 sm:scale-100">
              <div className={`h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl border flex items-center justify-center text-xs sm:text-sm ${currentTab.colorClass}`}>
                <currentTab.icon size={16} className="sm:size-20 stroke-[2.5]" />
              </div>
              <div>
                <div className="text-[8px] sm:text-[10px] uppercase tracking-widest text-slate-400 font-bold">{currentTab.badge}</div>
                <div className="text-xs sm:text-sm font-black text-white">{currentTab.metricValue}</div>
              </div>
            </div>

            {/* Floating Card 2: AI Assistant (Constant) */}
            <div className="absolute -bottom-6 -right-6 bg-slate-900/90 border border-white/10 p-4 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 animate-float-2 hidden sm:flex hover:border-blue-500/30 transition-colors z-20">
              <div className="h-10 w-10 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center text-blue-400 animate-pulse">
                <Sparkles size={20} className="stroke-[2]" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Asistente IA</div>
                <div className="text-sm font-black text-white">Análisis Activo</div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
