'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Interfaces
interface Measurement {
  date: string;
  value: number;
}

interface Indicator {
  name: string;
  measurements: Measurement[];
  goal: number;
  unit: string;
}

interface IndicatorChartProps {
  indicators: Indicator[];
}

const getRandomColor = (idx: number) => {
  const colors = [
    'rgb(79, 70, 229)',  // indigo-600
    'rgb(16, 185, 129)', // emerald-500
    'rgb(244, 63, 94)',  // rose-500
    'rgb(245, 158, 11)', // amber-500
    'rgb(6, 182, 212)',  // cyan-500
    'rgb(139, 92, 246)', // purple-500
  ];
  return colors[idx % colors.length];
};

const IndicatorChart = ({ indicators }: IndicatorChartProps) => {
  if (!Array.isArray(indicators) || indicators.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-slate-300 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
        <p className="text-sm font-bold uppercase tracking-widest">No hay datos para graficar</p>
      </div>
    );
  }

  // Collect all unique dates
  let allDates = [...new Set(indicators.flatMap(ind => (ind.measurements || []).map(m => m.date)))];
  
  // If no dates exist, use a placeholder to show the Meta
  const hasData = allDates.length > 0;
  if (!hasData) {
    allDates = ['Inicio'];
  } else {
    allDates.sort((a, b) => {
      const timeA = new Date(a).getTime();
      const timeB = new Date(b).getTime();
      if (!isNaN(timeA) && !isNaN(timeB)) return timeA - timeB;
      return a.localeCompare(b);
    });
  }

  const labels = allDates.map(date => {
    if (!hasData) return date;
    const d = new Date(date);
    return isNaN(d.getTime()) ? date : d.toLocaleDateString('es-CO', { month: 'short', year: '2-digit' });
  });

  const datasets = indicators.flatMap((indicator, idx) => {
    const measurements = Array.isArray(indicator.measurements) ? indicator.measurements : [];
    const color = getRandomColor(idx);
    const valueMap = new Map(measurements.map(m => [m.date, m.value]));

    // Get data points safely handling 0
    const dataPoints = allDates.map(date => {
        if (!hasData) return null;
        return valueMap.has(date) ? valueMap.get(date) : null;
    });

    return [
      {
        label: `${indicator.name || 'Indicador'} (${indicator.unit || ''})`,
        data: dataPoints,
        borderColor: color,
        backgroundColor: color.replace('rgb', 'rgba').replace(')', ', 0.1)'),
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        spanGaps: true,
      },
      {
        label: `Meta: ${indicator.goal}${indicator.unit || ''}`,
        data: Array(allDates.length).fill(indicator.goal),
        borderColor: color.replace('rgb', 'rgba').replace(')', ', 0.3)'),
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false,
      },
    ];
  });

  const data = { labels, datasets };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          boxWidth: 6,
          font: { size: 10, weight: 'bold' as any },
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        padding: 12,
        titleFont: { size: 12, weight: 'bold' as any },
        bodyFont: { size: 12 },
        cornerRadius: 8,
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: { font: { size: 10, weight: 'bold' as any } }
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 10, weight: 'bold' as any } }
      },
    },
  };

  return (
    <div className="h-[400px] w-full">
      <Line options={options} data={data} />
    </div>
  );
};

export default IndicatorChart;