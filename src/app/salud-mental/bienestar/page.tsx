'use client';

import React from 'react';
import { HeartHandshake, Zap, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BienestarAccionPage() {
  const router = useRouter();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <HeartHandshake className="text-emerald-600" size={32} />
            Centro de Acción
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Cápsulas de prevención, pausas cognitivas y rutas S.O.S.</p>
        </div>
        <button onClick={() => router.push('/salud-mental')} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors">
          Volver al Inicio
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm text-center hover:-translate-y-1 transition-transform">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen size={24} />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">Cápsulas de Resiliencia</h3>
          <p className="text-slate-500 text-sm">Contenido corto (audiolibros, guías rápidas) sobre manejo de estrés.</p>
        </div>
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm text-center hover:-translate-y-1 transition-transform">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Zap size={24} />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">Pausas Cognitivas</h3>
          <p className="text-slate-500 text-sm">Ejercicios de 2 minutos para descansar la mente durante el trabajo.</p>
        </div>
      </div>
    </div>
  );
}
