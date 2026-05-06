'use client';

import { useState, useEffect } from 'react';
import RiskManagement from '@/components/RiskManagement';
import { getRisksAction, saveRisksAction } from '@/actions/risks';
import { toast } from 'sonner';

export default function RiesgosPage() {
  const [risks, setRisks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRisks();
  }, []);

  const loadRisks = async () => {
    setLoading(true);
    const res = await getRisksAction();
    if (res.success) {
      setRisks(res.data);
    } else {
      toast.error('Error al cargar los riesgos');
    }
    setLoading(false);
  };

  const handleSave = async (updatedRisks: any[]) => {
    const res = await saveRisksAction(updatedRisks);
    if (res.success) {
      setRisks(updatedRisks);
      toast.success('Cambios guardados correctamente');
    } else {
      toast.error('Error al guardar los cambios');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Gestión Integral de Riesgos</h1>
        <p className="text-slate-600 max-w-3xl leading-relaxed">
          Identifique, analice y controle los riesgos estratégicos, operativos, financieros y de ciberseguridad 
          bajo la metodología ISO 31000. Utilice el mapa de calor para visualizar la criticidad y defina 
          controles para minimizar el riesgo residual.
        </p>
      </div>
      
      <RiskManagement 
        initialRisks={risks} 
        onSave={handleSave} 
      />
    </div>
  );
}