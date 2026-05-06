'use client';

import React, { useState } from 'react';
import { 
  FaChartPie, 
  FaCheckCircle, 
  FaListAlt, 
  FaCalculator, 
  FaChartLine, 
  FaBuilding,
  FaMoneyBillWave,
  FaExclamationCircle,
  FaArrowRight,
  FaSpinner
} from 'react-icons/fa';

export const FinanceDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'qualitative' | 'quantitative' | 'results'>('qualitative');
  const [loading, setLoading] = useState(false);

  // --- Estado Cualitativo (Modelo de Madurez) ---
  const [qualitative, setQualitative] = useState([
    { id: 'accounting', label: 'Contabilidad (NIIF)', icon: FaListAlt, level: 0, desc: 'Estandarización de registros bajo normativa internacional.' },
    { id: 'taxes', label: 'Gestión de Impuestos', icon: FaCheckCircle, level: 0, desc: 'Eficiencia en planeación tributaria y cumplimiento legal.' },
    { id: 'banking', label: 'Ecosistema Bancario', icon: FaBuilding, level: 0, desc: 'Integración de herramientas digitales y conciliación.' },
    { id: 'costs', label: 'Control de Costos', icon: FaCalculator, level: 0, desc: 'Precisión en el cálculo de márgenes por producto/servicio.' },
    { id: 'budget', label: 'Presupuesto Operativo', icon: FaChartPie, level: 0, desc: 'Capacidad de planeación y control de desviaciones.' },
    { id: 'statements', label: 'Información Financiera', icon: FaListAlt, level: 0, desc: 'Calidad y frecuencia de la reportería para socios.' },
    { id: 'statutes', label: 'Gobernanza Legal', icon: FaCheckCircle, level: 0, desc: 'Solidez de la estructura societaria y actas.' },
    { id: 'treasury', label: 'Gestión de Tesorería', icon: FaMoneyBillWave, level: 0, desc: 'Control de flujo de caja y gestión de liquidez diaria.' },
  ]);

  const maturityLevels = [
    { value: 0, label: 'Inexistente', color: 'bg-slate-200' },
    { value: 33, label: 'Inicial', color: 'bg-orange-400' },
    { value: 66, label: 'En Proceso', color: 'bg-blue-500' },
    { value: 100, label: 'Optimizado', color: 'bg-emerald-500' },
  ];

  const globalHealthScore = Math.round(qualitative.reduce((acc, item) => acc + item.level, 0) / qualitative.length);

  // --- Calificación y Concepto ---
  const getHealthStatus = (score: number) => {
    if (score < 30) return { label: 'Crítico', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', concept: 'La estructura financiera es informal y de alto riesgo. Se requiere intervención inmediata en procesos contables y de control.' };
    if (score < 60) return { label: 'Bajo', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100', concept: 'Existen bases financieras pero son insuficientes para la toma de decisiones estratégicas. Falta estandarización.' };
    if (score < 85) return { label: 'Aceptable', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', concept: 'La empresa tiene procesos definidos y controlados. Se recomienda automatizar y optimizar la gestión de costos y presupuestos.' };
    return { label: 'Excelente', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', concept: 'Estructura financiera sólida y optimizada. La información es confiable, oportuna y sirve como motor de crecimiento.' };
  };

  const healthStatus = getHealthStatus(globalHealthScore);

  // --- Estado Cuantitativo (3 años) ---
  const [years, setYears] = useState(['2023', '2024', '2025']);
  const [quantitativeData, setQuantitativeData] = useState<Record<string, any>>({
    '2023': { sales: 0, costs: 0, grossProfit: 0, opProfit: 0, currentAssets: 0, currentLiabilities: 0 },
    '2024': { sales: 0, costs: 0, grossProfit: 0, opProfit: 0, currentAssets: 0, currentLiabilities: 0 },
    '2025': { sales: 0, costs: 0, grossProfit: 0, opProfit: 0, currentAssets: 0, currentLiabilities: 0 },
  });

  const updateMaturity = (id: string, level: number) => {
    setQualitative(prev => prev.map(item => item.id === id ? { ...item, level } : item));
  };

  const updateQuantitative = (year: string, field: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setQuantitativeData(prev => ({
      ...prev,
      [year]: { ...prev[year], [field]: numValue }
    }));
  };

  // --- Cálculos de Ratios ---
  const calculateRatios = (year: string) => {
    const d = quantitativeData[year];
    const liquidity = d.currentLiabilities > 0 ? (d.currentAssets / d.currentLiabilities).toFixed(2) : '0.00';
    const grossMargin = d.sales > 0 ? ((d.grossProfit / d.sales) * 100).toFixed(1) : '0.0';
    const opMargin = d.sales > 0 ? ((d.opProfit / d.sales) * 100).toFixed(1) : '0.0';
    return { liquidity, grossMargin, opMargin };
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-10 opacity-10">
          <FaMoneyBillWave className="text-9xl rotate-12" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-4xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 uppercase tracking-tight">Diagnóstico Financiero</h2>
            <p className="text-slate-400 font-medium max-w-2xl leading-relaxed italic">
              Evalúe la salud financiera de su organización desde una perspectiva cualitativa y cuantitativa para la toma de decisiones estratégicas.
            </p>
          </div>
          <a 
            href="/administracion/suscripcion" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all hover:scale-105 shadow-lg"
          >
            <FaMoneyBillWave />
            Suscripción
          </a>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex bg-white p-2 rounded-2xl shadow-lg border border-slate-100 max-w-3xl mx-auto">
        {[
          { id: 'qualitative', label: '1. Diagnóstico Cualitativo', icon: FaListAlt },
          { id: 'quantitative', label: '2. Análisis Cuantitativo', icon: FaChartLine },
          { id: 'results', label: '3. Resultados y Ratios', icon: FaCalculator },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
              activeTab === tab.id 
                ? 'bg-slate-900 text-white shadow-xl scale-105' 
                : 'text-slate-400 hover:bg-slate-50'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-10">
        {/* --- PANEL CUALITATIVO --- */}
        {activeTab === 'qualitative' && (
          <div className="space-y-10">
            {/* Health Score Banner */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl flex flex-col md:flex-row items-center gap-8">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={364.4} strokeDashoffset={364.4 - (364.4 * globalHealthScore) / 100} className="text-indigo-600 transition-all duration-1000" />
                </svg>
                <span className="absolute text-2xl font-black text-slate-900">{globalHealthScore}%</span>
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-3 mb-2 flex-wrap justify-center md:justify-start">
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Índice de Salud Operativa</h3>
                  <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${healthStatus.bg} ${healthStatus.color} ${healthStatus.border}`}>
                    Calificación: {healthStatus.label}
                  </div>
                </div>
                <p className="text-sm text-slate-600 font-bold mb-3 italic leading-relaxed">
                  "{healthStatus.concept}"
                </p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                   {maturityLevels.map(ml => (
                     <div key={ml.value} className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-100 bg-slate-50">
                        <div className={`w-2 h-2 rounded-full ${ml.color}`} />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{ml.label}</span>
                     </div>
                   ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {qualitative.map((item) => (
                <div key={item.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all group overflow-hidden relative">
                  <div className={`absolute top-0 left-0 w-full h-1 transition-all ${
                    item.level === 0 ? 'bg-slate-200' : 
                    item.level === 33 ? 'bg-orange-400' : 
                    item.level === 66 ? 'bg-blue-500' : 'bg-emerald-500'
                  }`} />
                  
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      <item.icon size={20} />
                    </div>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{item.level}%</span>
                  </div>

                  <h4 className="font-black text-slate-800 mb-2 uppercase text-[11px] tracking-wider">{item.label}</h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed mb-6 h-8">{item.desc}</p>
                  
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between gap-1">
                      {maturityLevels.map((lvl) => (
                        <button 
                          key={lvl.value}
                          onClick={() => updateMaturity(item.id, lvl.value)}
                          className={`flex-1 h-8 rounded-lg transition-all border-2 ${
                            item.level === lvl.value 
                              ? `${lvl.color} border-transparent shadow-inner` 
                              : 'bg-white border-slate-50 hover:border-slate-200'
                          }`}
                          title={lvl.label}
                        />
                      ))}
                    </div>
                    <span className="text-[9px] font-black text-slate-400 uppercase text-center tracking-tighter">
                      Nivel: {maturityLevels.find(l => l.value === item.level)?.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- PANEL CUANTITATIVO --- */}
        {activeTab === 'quantitative' && (
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Variable Financiera</th>
                    {years.map(y => (
                      <th key={y} className="p-4 text-center text-sm font-black text-slate-900 uppercase">{y}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[
                    { id: 'sales', label: 'Ingresos por Ventas' },
                    { id: 'costs', label: 'Costo de Ventas' },
                    { id: 'grossProfit', label: 'Utilidad Bruta' },
                    { id: 'opProfit', label: 'Utilidad Operacional' },
                    { id: 'currentAssets', label: 'Activos Corrientes' },
                    { id: 'currentLiabilities', label: 'Pasivos Corrientes' },
                  ].map((row) => (
                    <tr key={row.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                        <span className="text-sm font-bold text-slate-600">{row.label}</span>
                      </td>
                      {years.map(y => (
                        <td key={y} className="p-2">
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold">$</span>
                            <input 
                              type="number"
                              className="w-full pl-8 pr-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl text-center font-black text-slate-700 outline-none focus:bg-white focus:border-indigo-500 transition-all"
                              value={quantitativeData[y][row.id]}
                              onChange={(e) => updateQuantitative(y, row.id, e.target.value)}
                            />
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-8 p-6 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center gap-4">
               <FaExclamationCircle className="text-indigo-600 shrink-0" size={20} />
               <p className="text-xs text-indigo-700 font-medium leading-relaxed">
                 Asegúrese de ingresar valores anuales consolidados. Los resultados de liquidez y rentabilidad se calcularán automáticamente en la siguiente pestaña.
               </p>
            </div>
          </div>
        )}

        {/* --- PANEL DE RESULTADOS --- */}
        {activeTab === 'results' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {years.map(y => {
                const ratios = calculateRatios(y);
                const isLiquidityHealthy = parseFloat(ratios.liquidity) >= 1.2;
                
                return (
                  <div key={y} className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-xl transition-all hover:scale-[1.02]">
                    <div className="bg-slate-900 p-6 text-white text-center">
                      <h4 className="text-2xl font-black uppercase tracking-tight">Año {y}</h4>
                    </div>
                    <div className="p-8 space-y-6">
                      {/* Ratio Liquidez */}
                      <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ratio de Liquidez</p>
                          <h5 className="text-3xl font-black text-slate-900">{ratios.liquidity}</h5>
                        </div>
                        <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${isLiquidityHealthy ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                          {isLiquidityHealthy ? 'Saludable' : 'En Riesgo'}
                        </div>
                      </div>

                      {/* Márgenes */}
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase mb-2">
                            <span>Margen Bruto</span>
                            <span>{ratios.grossMargin}%</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, parseFloat(ratios.grossMargin))}%` }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase mb-2">
                            <span>Margen Operativo</span>
                            <span>{ratios.opMargin}%</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, parseFloat(ratios.opMargin))}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Benchmarking & AI Insights (Placeholder for next step) */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-10 text-white shadow-2xl relative group overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-20 transform translate-x-1/4 -translate-y-1/4">
                <FaChartLine size={200} />
              </div>
              <div className="relative z-10">
                <h4 className="text-3xl font-black mb-4 uppercase tracking-tighter">Comparativa de Mercado e Insights IA</h4>
                <p className="text-indigo-100 font-medium max-w-2xl leading-relaxed mb-8">
                  Nuestra IA analizará sus márgenes actuales frente a los promedios del mercado para su sector y actividad, detectando ineficiencias y oportunidades de crecimiento.
                </p>
                <button 
                  onClick={() => {/* Integración IA */}}
                  className="px-8 py-4 bg-white text-indigo-700 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center gap-3 hover:bg-indigo-50 transition-all hover:-translate-y-1 shadow-xl"
                >
                  Generar Análisis Estratégico IA <FaArrowRight />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};