'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Settings, 
  ArrowLeft, 
  Save, 
  ShieldCheck, 
  Percent, 
  Building2,
  AlertCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const FinanceConfig: React.FC = () => {
  const router = useRouter();
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await axios.get('/api/finance/config');
      setConfig(res.data);
    } catch (error) {
      console.error("Error fetching config:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.post('/api/finance/config', config);
      toast.success("Configuración actualizada correctamente");
    } catch (error) {
      toast.error("Error al guardar la configuración");
    } finally {
      setSaving(false);
    }
  };

  const updateNested = (category: string, field: string, value: string) => {
    setConfig((prev: any) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: parseFloat(value) || 0
      }
    }));
  };

  if (loading) return <div className="p-8">Cargando parámetros...</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/financiero')}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft size={24} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Parámetros Financieros</h1>
            <p className="text-slate-500 font-medium italic">Configura las bases de cálculo para el sistema.</p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg disabled:opacity-50"
        >
          {saving ? "Guardando..." : "Guardar Cambios"}
          <Save size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Prestaciones Sociales */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <ShieldCheck size={20} className="text-emerald-500" />
            Carga Prestacional y Parafiscales
          </h3>
          <p className="text-sm text-slate-400 font-medium">Define los porcentajes que paga la empresa sobre el salario base.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(config.prestaciones_sociales).map(([key, value]: [string, any]) => (
              <div key={key}>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  {key.replace(/_/g, ' ')} (%)
                </label>
                <input 
                  type="number"
                  step="0.01"
                  value={value}
                  onChange={(e) => updateNested('prestaciones_sociales', key, e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          {/* Overheads e Impuestos */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Building2 size={20} className="text-blue-500" />
              Gastos de Operación (Overheads)
            </h3>
            <div className="space-y-4">
              {Object.entries(config.overheads).map(([key, value]: [string, any]) => (
                <div key={key}>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    {key.replace(/_/g, ' ')} (%)
                  </label>
                  <input 
                    type="number"
                    value={value}
                    onChange={(e) => updateNested('overheads', key, e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Percent size={20} className="text-purple-500" />
              Impuestos Base
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(config.impuestos).map(([key, value]: [string, any]) => (
                <div key={key}>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    {key.toUpperCase()} (%)
                  </label>
                  <input 
                    type="number"
                    value={value}
                    onChange={(e) => updateNested('impuestos', key, e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-700 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-amber-50 rounded-[1.5rem] border border-amber-100 flex gap-4">
            <AlertCircle className="text-amber-600 shrink-0" size={24} />
            <p className="text-sm text-amber-800 font-medium leading-relaxed">
              Cualquier cambio en estos porcentajes afectará inmediatamente los cálculos de las nuevas cotizaciones y el costo hora/hombre del sistema.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceConfig;
