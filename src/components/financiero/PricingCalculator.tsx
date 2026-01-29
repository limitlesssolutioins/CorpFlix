'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Calculator, 
  ArrowLeft, 
  Info, 
  TrendingUp, 
  DollarSign,
  Briefcase,
  Percent,
  RefreshCcw
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const PricingCalculator: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    baseSalary: 1300000,
    hours: 160,
    materialCosts: 0,
    desiredMargin: 30
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const calculate = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/finance/calculate', formData);
      setResult(res.data);
    } catch (error) {
      console.error("Error calculating pricing:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculate();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.push('/financiero')}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} className="text-slate-600" />
        </button>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Calculadora de Precios</h1>
          <p className="text-slate-500 font-medium italic">Simulador de rentabilidad por proyecto.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Briefcase size={20} className="text-blue-600" />
              Insumos de Cotización
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                  Salario Mensual Base (Personal)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input 
                    type="number"
                    name="baseSalary"
                    value={formData.baseSalary}
                    onChange={handleChange}
                    className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                  Horas Estimadas Proyecto
                </label>
                <input 
                  type="number"
                  name="hours"
                  value={formData.hours}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                  Costos de Materiales / Otros
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input 
                    type="number"
                    name="materialCosts"
                    value={formData.materialCosts}
                    onChange={handleChange}
                    className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                  Margen de Utilidad Deseado (%)
                </label>
                <div className="relative">
                  <input 
                    type="number"
                    name="desiredMargin"
                    value={formData.desiredMargin}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                </div>
              </div>
            </div>

            <button 
              onClick={calculate}
              disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100 disabled:opacity-50"
            >
              {loading ? <RefreshCcw className="animate-spin" size={20} /> : <Calculator size={20} />}
              Calcular Propuesta
            </button>
          </div>
        </div>

        {/* Resultados */}
        <div className="lg:col-span-2 space-y-6">
          {result && (
            <div className="animate-in fade-in zoom-in-95 duration-500 space-y-6">
              {/* Precio Sugerido */}
              <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Precio de Venta Sugerido</p>
                      <h2 className="text-6xl font-black tracking-tighter">
                        ${Math.round(result.sellPrice).toLocaleString()}
                      </h2>
                    </div>
                    <div className="px-4 py-2 bg-emerald-500 text-white rounded-full text-xs font-black flex items-center gap-1">
                      <TrendingUp size={14} />
                      UTILIDAD: ${Math.round(result.profit).toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-white/10">
                    <div>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Costo Total Operativo</p>
                      <p className="text-xl font-bold">${Math.round(result.totalCost).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Margen Real</p>
                      <p className="text-xl font-bold text-emerald-400">{result.marginPercentage}%</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Punto de Equilibrio</p>
                      <p className="text-xl font-bold">${Math.round(result.totalCost).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                <DollarSign size={200} className="absolute -bottom-10 -right-10 text-white/5" />
              </div>

              {/* Desglose de Costos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                  <h4 className="text-sm font-black text-slate-900 mb-6 flex items-center gap-2">
                    <Info size={16} className="text-blue-500" />
                    Desglose de Labor (Personal)
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span className="text-slate-500">Costo Hora/Hombre Real:</span>
                      <span className="text-slate-900 font-bold">${Math.round(result.laborDetails.hourlyCost).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span className="text-slate-500">Carga Prestacional:</span>
                      <span className="text-slate-900 font-bold">${Math.round(result.laborDetails.benefits).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span className="text-slate-500">Seguridad Social:</span>
                      <span className="text-slate-900 font-bold">${Math.round(result.laborDetails.socialSecurity).toLocaleString()}</span>
                    </div>
                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Subtotal Labor:</span>
                      <span className="text-lg font-black text-blue-600">${Math.round(result.directLaborCost).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                  <h4 className="text-sm font-black text-slate-900 mb-6 flex items-center gap-2">
                    <Percent size={16} className="text-purple-500" />
                    Gastos Administrativos (Overhead)
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span className="text-slate-500">Porcentaje Aplicado:</span>
                      <span className="text-slate-900 font-bold">15%</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span className="text-slate-500">Valor en Dinero:</span>
                      <span className="text-slate-900 font-bold">${Math.round(result.overheadAmount).toLocaleString()}</span>
                    </div>
                    <div className="mt-8 p-4 bg-purple-50 rounded-xl border border-purple-100">
                      <p className="text-[10px] text-purple-700 font-black uppercase tracking-widest leading-relaxed">
                        Nota: El overhead cubre los gastos fijos de la oficina central prorrateados por este proyecto.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PricingCalculator;
