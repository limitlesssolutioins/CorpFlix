'use client';

import { useState } from 'react';
import { Calculator, Save, Download, FileSpreadsheet, TrendingUp, AlertTriangle } from 'lucide-react';

export default function ProyeccionRentaPage() {
  const [ingresos, setIngresos] = useState(0);
  const [costos, setCostos] = useState(0);
  const [gastosAdministrativos, setGastosAdministrativos] = useState(0);
  const [gastosVentas, setGastosVentas] = useState(0);
  const [gastosFinancieros, setGastosFinancieros] = useState(0);
  const [deducciones, setDeducciones] = useState(0);
  const [rentasExentas, setRentasExentas] = useState(0);
  
  // Tasa de renta en Colombia para PJ (aprox 35%)
  const TASA_RENTA = 0.35;

  const utilidadBruta = ingresos - costos;
  const utilidadOperacional = utilidadBruta - gastosAdministrativos - gastosVentas;
  const utilidadAntesImpuestos = utilidadOperacional - gastosFinancieros;
  const rentaLiquida = utilidadAntesImpuestos - deducciones - rentasExentas;
  const impuestoRenta = rentaLiquida > 0 ? rentaLiquida * TASA_RENTA : 0;
  const utilidadNeta = utilidadAntesImpuestos - impuestoRenta;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Proyección de Renta</h1>
          <p className="text-slate-500 font-medium italic">Estados Financieros y Cálculo de Impuesto</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm font-bold bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 rounded-xl transition-all flex items-center gap-2">
            <Save className="w-4 h-4" /> Guardar Escenario
          </button>
          <button className="px-4 py-2 text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm rounded-xl transition-all flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4" /> Exportar a Excel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Formulario de Entradas */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-500" />
              Datos Financieros (COP)
            </h2>
            
            <div className="space-y-6">
              {/* Ingresos y Costos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Ingresos Operacionales</label>
                  <input
                    type="number"
                    value={ingresos || ''}
                    onChange={(e) => setIngresos(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Costo de Ventas</label>
                  <input
                    type="number"
                    value={costos || ''}
                    onChange={(e) => setCostos(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Gastos */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Gastos Admin.</label>
                  <input
                    type="number"
                    value={gastosAdministrativos || ''}
                    onChange={(e) => setGastosAdministrativos(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Gastos de Ventas</label>
                  <input
                    type="number"
                    value={gastosVentas || ''}
                    onChange={(e) => setGastosVentas(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Gastos Financieros</label>
                  <input
                    type="number"
                    value={gastosFinancieros || ''}
                    onChange={(e) => setGastosFinancieros(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Conciliación Fiscal */}
              <div className="pt-6 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">Ajustes Fiscales</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Deducciones Especiales</label>
                    <input
                      type="number"
                      value={deducciones || ''}
                      onChange={(e) => setDeducciones(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Rentas Exentas</label>
                    <input
                      type="number"
                      value={rentasExentas || ''}
                      onChange={(e) => setRentasExentas(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resumen / Estado de Resultados */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 rounded-2xl p-6 shadow-md text-white">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-100">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Estado de Resultados
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-700">
                <span className="text-slate-400 text-sm">Ingresos</span>
                <span className="font-medium text-emerald-400">{formatCurrency(ingresos)}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-700">
                <span className="text-slate-400 text-sm">Costos</span>
                <span className="font-medium text-rose-400">-{formatCurrency(costos)}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-700">
                <span className="text-slate-300 font-bold text-sm">Utilidad Bruta</span>
                <span className="font-bold">{formatCurrency(utilidadBruta)}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-700">
                <span className="text-slate-400 text-sm">Gastos de Operación</span>
                <span className="font-medium text-rose-400">-{formatCurrency(gastosAdministrativos + gastosVentas)}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-700">
                <span className="text-slate-300 font-bold text-sm">Utilidad Operacional</span>
                <span className="font-bold">{formatCurrency(utilidadOperacional)}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-700">
                <span className="text-slate-400 text-sm">Gastos Financieros</span>
                <span className="font-medium text-rose-400">-{formatCurrency(gastosFinancieros)}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b-2 border-slate-600">
                <span className="text-slate-100 font-black text-sm uppercase">Utilidad Antes Imptos</span>
                <span className="font-black text-lg">{formatCurrency(utilidadAntesImpuestos)}</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-slate-800 rounded-xl space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Conciliación Fiscal</h3>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Renta Líquida</span>
                <span className="font-medium">{formatCurrency(rentaLiquida)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Impuesto Renta (35%)</span>
                <span className="font-bold text-rose-400">-{formatCurrency(impuestoRenta)}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-slate-700 mt-2">
                <span className="text-white font-black text-base">UTILIDAD NETA</span>
                <span className="font-black text-xl text-emerald-400">{formatCurrency(utilidadNeta)}</span>
              </div>
            </div>
            
            {utilidadAntesImpuestos < 0 && (
              <div className="mt-4 flex items-start gap-2 p-3 bg-rose-500/20 rounded-lg border border-rose-500/30">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                <p className="text-xs text-rose-200">La compañía proyecta pérdida. Verifique la viabilidad financiera o el reconocimiento de renta presuntiva.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
