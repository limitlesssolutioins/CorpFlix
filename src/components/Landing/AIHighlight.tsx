'use client';

import { Sparkles, CheckCircle2 } from 'lucide-react';

const AIHighlight = () => {
  return (
    <section id="ai" className="py-16 md:py-24 bg-slate-950 overflow-hidden relative w-full flex flex-col items-center">
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-[500px] h-full bg-blue-600/5 blur-[120px] -rotate-12 translate-x-1/2" />
      
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative group">
              {/* Glass Card */}
              <div className="absolute -inset-4 bg-blue-500/10 rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />
              <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-14 shadow-2xl overflow-hidden">
                <div className="flex items-center gap-4 mb-8 md:mb-12">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
                    <Sparkles size={20} className="md:size-24" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-base md:text-lg tracking-tight">Lidus Assistant</h4>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Powered by Gemini AI</p>
                  </div>
                </div>

                <div className="space-y-4 md:space-y-5">
                  <div className="bg-slate-900/50 p-5 md:p-6 rounded-2xl border border-white/5">
                    <p className="text-[11px] md:text-xs text-slate-400 font-medium italic">"Analizando cumplimiento normativo..."</p>
                  </div>
                  <div className="bg-blue-600/10 p-5 md:p-6 rounded-2xl border border-blue-500/20">
                    <p className="text-xs md:text-sm text-blue-100/90 leading-relaxed font-medium">
                      Diagnóstico completado. Se requiere actualizar la matriz de riesgos del área operativa. ¿Generar propuesta?
                    </p>
                  </div>
                </div>

                <div className="mt-10 md:mt-14 grid grid-cols-2 gap-6 md:gap-8">
                  <div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1 md:mb-2">Automatización</span>
                    <span className="text-2xl md:text-3xl font-black text-white tracking-tighter">100%</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1 md:mb-2">Integración</span>
                    <span className="text-2xl md:text-3xl font-black text-white tracking-tighter">Real</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 text-center lg:text-left">
            <h2 className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-4">Potenciado con IA</h2>
            <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6 md:mb-8 leading-tight">
              Decisiones inteligentes <br className="hidden md:block" /> en tiempo real.
            </h3>
            <p className="text-base md:text-lg text-slate-400 mb-8 md:mb-12 leading-relaxed font-medium">
              Lidus AI integra el poder de la inteligencia artificial generativa para transformar la gestión de tu empresa, automatizando lo complejo y permitiéndote enfocar en lo estratégico.
            </p>
            
            <ul className="space-y-5 md:space-y-6 text-left inline-block lg:block">
              {[
                'Generación de procesos y diagramas automáticos.',
                'Matrices de riesgo y planes de acción por IA.',
                'Diagnósticos psicosociales con análisis profundo.',
                'Soporte técnico con IA experta en tu normativa.'
              ].map((text, i) => (
                <li key={i} className="flex items-center gap-4 group">
                  <div className="w-6 h-6 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shrink-0">
                    <CheckCircle2 size={14} className="md:size-16" />
                  </div>
                  <span className="text-slate-300 font-semibold tracking-tight text-sm md:text-base">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIHighlight;
