'use client';

import { Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    name: 'Básico',
    price: '199k',
    description: 'Para Pymes que inician su digitalización.',
    features: [
      'Gestión de hasta 20 empleados',
      'Turnos y Asistencia básica',
      'Gestión de Procesos (BPM)',
      'Soporte por Ticket',
    ],
    cta: 'Comenzar ahora',
    popular: false,
  },
  {
    name: 'Profesional',
    price: '499k',
    description: 'Control total y automatización inteligente.',
    features: [
      'Empleados ilimitados',
      'Nómina y Prestaciones',
      'Asistente IA (Gemini)',
      'Matrices de Riesgo ISO',
      'Dashboard Estratégico',
      'Soporte Prioritario',
    ],
    cta: 'Ir a Profesional',
    popular: true,
  },
  {
    name: 'Corporativo',
    price: '999k',
    description: 'Para grandes empresas con múltiples sedes.',
    features: [
      'Todo lo del plan Profesional',
      'Multi-tenant / Multi-empresa',
      'API de integración',
      'Salud Mental Avanzada',
      'Account Manager dedicado',
      'Seguridad Enterprise (SSO)',
    ],
    cta: 'Contactar Ventas',
    popular: false,
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-16 md:py-24 bg-white w-full flex flex-col items-center">
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-20">
          <h2 className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-4">Planes & Suscripciones</h2>
          <p className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-6">
            Crece con nosotros.
          </p>
          <p className="text-base text-slate-500 leading-relaxed font-medium">
            Escalabilidad real. Empieza con lo esencial y desbloquea potencia a medida que tu equipo evoluciona.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative p-8 md:p-10 rounded-[2.5rem] border transition-all duration-500 flex flex-col ${
                plan.popular 
                  ? 'border-slate-800 shadow-2xl shadow-slate-200/50 md:scale-105 z-10 bg-slate-950 text-white' 
                  : 'border-slate-100 bg-slate-50/50 text-slate-900 hover:border-slate-200 hover:bg-white'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em]">
                  Más Popular
                </div>
              )}
              
              <div className="mb-8 md:mb-10">
                <h3 className={`text-lg font-bold mb-4 ${plan.popular ? 'text-blue-500' : 'text-slate-900'}`}>{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl md:text-4xl font-black tracking-tighter">$ {plan.price}</span>
                  <span className={`text-xs font-bold ${plan.popular ? 'text-slate-500' : 'text-slate-400'}`}>/ mes</span>
                </div>
                <p className={`mt-6 text-xs leading-relaxed font-medium ${plan.popular ? 'text-slate-400' : 'text-slate-500'}`}>
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-4 mb-10 md:mb-12 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className={`shrink-0 mt-0.5 ${plan.popular ? 'text-blue-500' : 'text-blue-600'}`} size={16} />
                    <span className={`text-xs font-bold ${plan.popular ? 'text-slate-300' : 'text-slate-600'}`}>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link 
                href="/login?signup=true"
                className={`group w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                  plan.popular
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-900/20'
                    : 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-950 hover:text-white shadow-sm'
                }`}
              >
                {plan.cta}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-12 md:mt-16 text-center">
          <p className="text-slate-400 text-sm font-medium">
            ¿Necesitas algo a medida? <a href="#" className="text-blue-600 font-bold hover:underline">Habla con un asesor experto</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
