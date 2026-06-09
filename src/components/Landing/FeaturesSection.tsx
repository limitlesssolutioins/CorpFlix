'use client';

import { 
  Users2, 
  Network, 
  ShieldCheck, 
  BrainCircuit, 
  BarChart3, 
  Target 
} from 'lucide-react';

const features = [
  {
    title: 'Gestión Humana & Nómina',
    description: 'Automatiza turnos, asistencias y pagos. Centraliza el ciclo de vida del colaborador en un solo lugar.',
    icon: Users2,
  },
  {
    title: 'Procesos y Auditorías',
    description: 'Diseña y gestiona tus procesos operativos con diagramas interactivos. Alineado a estándares nacionales e internacionales.',
    icon: Network,
  },
  {
    title: 'Gestión de Riesgos',
    description: 'Identifica, evalúa y mitiga riesgos organizacionales con matrices dinámicas y seguimiento en tiempo real.',
    icon: ShieldCheck,
  },
  {
    title: 'Salud Mental & Bienestar',
    description: 'Mide el clima laboral y el bienestar psicosocial. Acciones preventivas basadas en datos reales.',
    icon: BrainCircuit,
  },
  {
    title: 'Indicadores de Gestión',
    description: 'Tableros de control automáticos (KPIs). Visualiza el rendimiento de tu empresa sin esfuerzo manual.',
    icon: BarChart3,
  },
  {
    title: 'Direccionamiento Estratégico',
    description: 'Define tu visión, misión y objetivos. Conecta la estrategia con la ejecución diaria de tu equipo.',
    icon: Target,
  }
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-16 md:py-24 bg-white w-full flex flex-col items-center">
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-20">
          <h2 className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-4">Módulos Integrales</h2>
          <p className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-6">
            Todo bajo un mismo techo.
          </p>
          <p className="text-base text-slate-500 leading-relaxed font-medium">
            Elimina la dispersión de herramientas. Lidus centraliza los pilares estratégicos para una ejecución impecable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group bg-slate-50/50 p-8 md:p-10 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-6 md:mb-8 text-blue-600 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 group-hover:rotate-6 transition-all duration-500">
                <feature.icon size={24} className="md:size-26" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 md:mb-4 tracking-tight">{feature.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
