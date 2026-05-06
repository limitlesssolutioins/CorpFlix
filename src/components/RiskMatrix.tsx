'use client';

import React, { useMemo } from 'react';

// Interfaces
export interface Risk {
  id: string | number;
  nombre: string;
  categoria?: string;
  probability: number; // 1-5
  impact: number; // 1-5
  nivelRiesgo: number;
}

export interface ExtendedRisk extends Risk {
  descripcion: string;
  proceso: string;
  actividad?: string;
  causa?: string;
  consecuencia?: string;
  conversion?: number; // Conversion factor based on Excel logic
  controles: string;
  eficacia?: number; // 1-5
  probabilidadResidual: number;
  impactoResidual: number;
  nivelRiesgoResidual: number;
  planAccion?: string;
  
  // SST Specifics
  tipoActividad?: 'RUTINARIA' | 'NO RUTINARIA';
  expuestos?: {
    fijo: number;
    temporal: number;
    contratista: number;
    visitante: number;
  };

  // Environmental Specifics
  condicionOperacion?: 'NORMAL' | 'ANORMAL' | 'EMERGENCIA';
}

interface RiskMatrixProps {
  risks: Risk[] | ExtendedRisk[];
  onCellClick?: (impact: number, probability: number) => void;
}

const RiskMatrix = ({ risks, onCellClick }: RiskMatrixProps) => {
  const probabilityLevels = [1, 2, 3, 4, 5];
  const impactLevels = [5, 4, 3, 2, 1]; // Descending for Y-axis

  const matrixData = useMemo(() => {
    const grid: { [impact: number]: { [probability: number]: Risk[] } } = {};
    impactLevels.forEach(impact => {
      grid[impact] = {};
      probabilityLevels.forEach(probability => {
        grid[impact][probability] = [];
      });
    });

    risks.forEach(risk => {
      // Ensure values are within range 1-5
      const p = Math.min(Math.max(risk.probability, 1), 5);
      const i = Math.min(Math.max(risk.impact, 1), 5);
      
      if (grid[i] && grid[i][p]) {
        grid[i][p].push(risk);
      }
    });

    return grid;
  }, [risks]);

  const getCellColor = (impact: number, probability: number) => {
    const score = impact * probability;
    if (score >= 16) return 'bg-red-500 hover:bg-red-600 text-white'; // NO ACEPTABLE
    if (score >= 5) return 'bg-yellow-400 hover:bg-yellow-500 text-slate-900'; // DE ALERTA
    return 'bg-emerald-500 hover:bg-emerald-600 text-white'; // ACEPTABLE
  };

  const getLabel = (val: number, type: 'prob' | 'imp') => {
    const labels = type === 'prob' 
      ? ['Remota', 'Baja', 'Media', 'Alta', 'Muy Alta']
      : ['Insignificante', 'Baja', 'Media', 'Alta', 'Significativa'];
    return labels[val - 1];
  };

  return (
    <div className="risk-matrix-container my-8 overflow-x-auto">
      <h3 className="text-xl font-black text-slate-800 text-center mb-6">Mapa de Calor de Riesgos (Nivel Inherente)</h3>
      <div className="flex justify-center">
        <div className="relative">
          {/* Y-Axis Label */}
          <div className="absolute -left-12 top-1/2 -translate-y-1/2 -rotate-90 text-sm font-black text-slate-500 uppercase tracking-widest">
            Impacto / Consecuencia
          </div>
          
          <table className="border-separate border-spacing-1">
            <thead>
              <tr>
                <th className="w-12"></th>
                {probabilityLevels.map(p => (
                  <th key={p} className="p-2 text-[10px] font-bold text-slate-500 uppercase w-32">
                    {p}. {getLabel(p, 'prob')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {impactLevels.map(impact => (
                <tr key={impact}>
                  <td className="p-2 text-[10px] font-bold text-slate-500 uppercase text-right whitespace-nowrap">
                    {impact}. {getLabel(impact, 'imp')}
                  </td>
                  {probabilityLevels.map(probability => {
                    const cellRisks = matrixData[impact]?.[probability] || [];
                    const count = cellRisks.length;
                    return (
                      <td 
                        key={`${impact}-${probability}`}
                        className={`
                          w-32 h-24 rounded-lg border border-slate-200 transition-all duration-200 relative
                          ${getCellColor(impact, probability)}
                          ${onCellClick ? 'cursor-pointer transform hover:scale-105 shadow-sm' : ''}
                        `}
                        onClick={() => onCellClick && onCellClick(impact, probability)}
                        title={`Impacto: ${impact}, Probabilidad: ${probability}`}
                      >
                        <div className="flex items-center justify-center h-full flex-col">
                          {count > 0 && (
                            <>
                              <span className="text-2xl font-black">{count}</span>
                              <span className="text-[9px] font-bold uppercase opacity-80">Riesgos</span>
                            </>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          {/* X-Axis Label */}
          <div className="text-center mt-4 text-sm font-black text-slate-500 uppercase tracking-widest">
            Probabilidad
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-8">
        <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-emerald-500"></div>
            <span className="text-xs font-bold text-slate-600">Bajo (1-4)</span>
        </div>
        <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-400"></div>
            <span className="text-xs font-bold text-slate-600">Medio (5-15)</span>
        </div>
        <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500"></div>
            <span className="text-xs font-bold text-slate-600">Alto (16-25)</span>
        </div>
      </div>
    </div>
  );
};

export default RiskMatrix;
