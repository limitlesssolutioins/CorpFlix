'use client';

import React, { useState, useEffect } from 'react';
import { useSocket } from '@/lib/socketContext';
import { FileText, Sparkles, Loader2, Download, CheckCircle2 } from 'lucide-react';

export default function ReportAIWizard() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [result, setResult] = useState<any>(null);
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on('progress-update', (data: any) => {
      setProgress(data.progress);
      setMessage(data.message);
      
      if (data.progress === 100) {
        setResult(data.data);
        setTimeout(() => setIsProcessing(false), 1000);
      }
    });

    return () => {
      socket.off('progress-update');
    };
  }, [socket]);

  const startGeneration = async () => {
    setIsProcessing(true);
    setProgress(0);
    setMessage('Iniciando...');
    setResult(null);

    try {
      await fetch('/api/support/generate-report', { method: 'POST' });
    } catch (error) {
      console.error('Error starting report:', error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 mb-8 overflow-hidden relative group">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
        <Sparkles size={80} className="text-blue-600" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <FileText size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">Analista Estratégico IA</h3>
            <p className="text-sm text-slate-500 font-medium">Genera reportes ejecutivos basados en tus datos reales.</p>
          </div>
        </div>

        {!isProcessing && !result && (
          <button 
            onClick={startGeneration}
            className="mt-4 px-6 py-3 bg-slate-900 hover:bg-black text-white rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95"
          >
            <Sparkles size={18} className="text-blue-400" />
            Generar Reporte con IA
          </button>
        )}

        {isProcessing && (
          <div className="mt-6 space-y-4">
            <div className="flex justify-between items-end mb-1">
              <span className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                <Loader2 size={14} className="animate-spin" />
                {message}
              </span>
              <span className="text-xs font-black text-slate-400">{progress}%</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500 shadow-[0_0_15px_rgba(37,99,235,0.4)]" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {result && !isProcessing && (
          <div className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center gap-3 text-emerald-700 mb-3">
              <CheckCircle2 size={20} />
              <span className="font-bold text-sm">¡Reporte Generado con éxito!</span>
            </div>
            <div className="text-sm text-slate-600 mb-4 line-clamp-3 italic">
              "{result.reportText}"
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-all">
                <Download size={14} />
                Descargar PDF
              </button>
              <button 
                onClick={() => setResult(null)}
                className="px-4 py-2 bg-white text-slate-400 hover:text-slate-600 rounded-lg text-xs font-bold transition-all"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
