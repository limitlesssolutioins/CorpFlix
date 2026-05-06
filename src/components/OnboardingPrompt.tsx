'use client';

import React from 'react';
import { FaRocket, FaArrowRight, FaMagic, FaBuilding } from 'react-icons/fa';
import Link from 'next/link';

interface OnboardingPromptProps {
  companyName?: string;
}

const OnboardingPrompt = ({ companyName }: OnboardingPromptProps) => {
  const isDefault = !companyName || companyName === 'Lidus Default' || companyName === 'LIDUS';

  if (!isDefault) return null;

  return (
    <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-1000">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-1 shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <FaRocket className="text-9xl transform rotate-12" />
        </div>
        
        <div className="bg-white/5 backdrop-blur-2xl rounded-[2.3rem] p-8 md:p-12 border border-white/10 flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-xl shadow-blue-900/20 shrink-0">
            <FaBuilding className="text-4xl text-blue-600" />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-400/20 text-blue-100 text-[10px] font-black uppercase tracking-widest mb-4 border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-300 animate-pulse" />
              Configuración Pendiente
            </div>
            <h2 className="text-3xl font-black text-white mb-2 tracking-tight">¡Bienvenido a LIDUS!</h2>
            <p className="text-blue-100 text-lg font-medium opacity-90 max-w-xl leading-relaxed">
              Tu perfil corporativo aún está usando datos genéricos. Para personalizar tu experiencia y habilitar todas las herramientas de IA, necesitamos la información básica de tu empresa.
            </p>
          </div>
          
          <div className="shrink-0">
            <Link 
              href="/onboarding"
              className="group px-8 py-5 bg-white text-blue-700 rounded-2xl font-black text-lg flex items-center gap-3 shadow-xl hover:shadow-2xl hover:bg-blue-50 transition-all transform hover:-translate-y-1 active:scale-95"
            >
              Comenzar Configuración
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPrompt;
