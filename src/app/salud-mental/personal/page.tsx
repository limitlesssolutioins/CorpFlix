'use client';

import React from 'react';
import { Users, AlertCircle, BarChart4 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PersonalMentalHealthPage() {
  const router = useRouter();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Users className="text-purple-600" size={32} />
            Bienestar Personal
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Evaluaciones Extralaborales y estado de ánimo general (Datos Anonimizados).</p>
        </div>
        <button onClick={() => router.push('/salud-mental')} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors">
          Volver al Inicio
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 p-12 text-center shadow-sm">
        <div className="w-20 h-20 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Módulo en Construcción</h2>
        <p className="text-slate-500 max-w-md mx-auto">
          Próximamente podrás visualizar aquí los resultados de las encuestas extralaborales y el Mood Tracker de tus empleados.
        </p>
      </div>
    </div>
  );
}
