'use client';

import { Check, ArrowRight, Timer } from 'lucide-react';
import Link from 'next/link';

const plan = {
  name: 'Plan Lidus Total',
  price: '50.000',
  description: 'Acceso ilimitado a todas las herramientas de la plataforma. Potencia tu empresa con la suite más completa.',
  features: [
    'Gestión de Empleados ilimitados',
    'Nómina y Prestaciones Sociales',
    'Turnos, Asistencia y Recargos',
    'Auditorías ISO & Estándares Mínimos',
    'Diagnóstico Financiero & Proyección de Renta',
    'Cálculo de Precios (Pricing) por Proyecto',
    'Gestión de Riesgos y Procesos (BPM)',
    'Asistente IA Avanzado',
    'Salud Mental y Riesgo Psicosocial',
    'Dashboard Estratégico e Indicadores',
    'Soporte Prioritario 24/7',
  ],
  cta: 'Comenzar Lanzamiento',
};

const PricingSection = () => {
  return (
    <section id="pricing" className="py-16 md:py-24 bg-white w-full flex flex-col items-center">
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <h2 className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-4">Suscripción</h2>
          <p className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-6">
            Todo el poder de Lidus en un solo plan.
          </p>
          <p className="text-base text-slate-500 leading-relaxed font-medium">
            Sin complicaciones, sin niveles. Accede a todas las funcionalidades por un precio único de lanzamiento.
          </p>
        </div>

        <div className="flex justify-center">
          <div 
            className="relative w-full max-w-xl p-8 md:p-12 rounded-[3rem] border border-slate-800 shadow-2xl shadow-slate-200/50 bg-slate-950 text-white transition-all duration-500 hover:scale-[1.02]"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.15em] flex items-center gap-2">
              <Timer size={14} />
              Oferta de Lanzamiento
            </div>
            
            <div className="mb-10 text-center">
              <h3 className="text-xl font-bold mb-6 text-blue-500 uppercase tracking-widest">{plan.name}</h3>
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl md:text-6xl font-black tracking-tighter">$ {plan.price}</span>
                  <span className="text-sm font-bold text-slate-500">/ mes</span>
                </div>
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-wider animate-pulse">
                  Precio limitado • Subirá pronto
                </div>
              </div>
              <p className="mt-8 text-sm leading-relaxed font-medium text-slate-400 max-w-sm mx-auto">
                {plan.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mb-12">
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Check className="shrink-0 mt-0.5 text-blue-500" size={18} />
                  <span className="text-[13px] font-bold text-slate-300 leading-tight">{feature}</span>
                </div>
              ))}
            </div>

            <Link 
              href="/login?signup=true"
              className="group w-full py-5 rounded-2xl font-black text-base transition-all flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-900/40"
            >
              {plan.cta}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <p className="mt-6 text-center text-slate-500 text-[10px] font-bold uppercase tracking-widest">
              Sin contratos de permanencia • Cancela cuando quieras
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-slate-400 text-sm font-medium">
            ¿Eres una empresa de más de 500 empleados? <a href="#" className="text-blue-600 font-bold hover:underline">Solicita un despliegue personalizado</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;

