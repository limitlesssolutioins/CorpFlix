'use client';

import React, { useMemo } from 'react';

// Interfaces
interface Risk {
  id: number;
  name: string;
  probability: 'Baja' | 'Media' | 'Alta';
  impact: 'Bajo' | 'Medio' | 'Alto';
  type?: string;
}

interface RiskMatrixProps {
  risks: Risk[];
  onCellClick?: (impact: Risk['impact'], probability: Risk['probability']) => void;
}

const RiskMatrix = ({ risks, onCellClick }: RiskMatrixProps) => {
  const probabilityLevels: ('Baja' | 'Media' | 'Alta')[] = ['Baja', 'Media', 'Alta'];
  const impactLevels: ('Bajo' | 'Medio' | 'Alto')[] = ['Bajo', 'Medio', 'Alto'];

  const matrixData = useMemo(() => {
    const grid: { [impact: string]: { [probability: string]: Risk[] } } = {};
    impactLevels.forEach(impact => {
      grid[impact] = {};
      probabilityLevels.forEach(probability => {
        grid[impact][probability] = [];
      });
    });

    risks.forEach(risk => {
      if (grid[risk.impact] && grid[risk.impact][risk.probability]) {
        grid[risk.impact][risk.probability].push(risk);
      }
    });

    return grid;
  }, [risks]);

  return (
    <div className="risk-matrix-container my-8">
      <h2 className="text-2xl font-bold text-center mb-4">Matriz de Riesgos</h2>
      <table className="w-full text-center border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Impacto / Probabilidad</th>
            {probabilityLevels.map(level => (
              <th key={level} className="border p-2">{level}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {impactLevels.map(impact => (
            <tr key={impact}>
              <td className="border p-2 font-semibold">{impact}</td>
              {probabilityLevels.map(probability => {
                const cellRisks = matrixData[impact]?.[probability] || [];
                return (
                  <td 
                    key={`${impact}-${probability}`}
                    className={`border p-4 ${onCellClick ? 'cursor-pointer' : ''}`}
                    onClick={() => onCellClick && onCellClick(impact, probability)}
                  >
                    {cellRisks.length} Riesgo(s)
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RiskMatrix;