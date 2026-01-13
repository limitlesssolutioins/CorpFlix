
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

// Helper to generate random colors for the chart
const getRandomColor = () => {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  return `rgb(${r}, ${g}, ${b})`;
};

const IndicatorChart = ({ indicators }: IndicatorChartProps) => {
  // Ensure indicators is an array before processing
  if (!Array.isArray(indicators) || indicators.length === 0) {
    return <div className="text-center text-gray-500">No hay datos de indicadores para mostrar.</div>;
  }

  // Collect all unique dates from all indicators and sort them
  const allDates = [...new Set(indicators.flatMap(ind => (ind.measurements || []).map(m => m.date)))];
  allDates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  const labels = allDates.map(date => new Date(date).toLocaleDateString());

  const datasets = indicators.flatMap(indicator => {
    // Safe-guard against missing measurements
    const measurements = Array.isArray(indicator.measurements) ? indicator.measurements : [];
    const color = getRandomColor();

    // Create a map of date to value for quick lookup
    const valueMap = new Map(measurements.map(m => [m.date, m.value]));

    // For each date in the master list, find the corresponding value or use null
    const dataPoints = allDates.map(date => valueMap.get(date) || null);

    return [
      {
        label: `${indicator.name} (${indicator.unit})`,
        data: dataPoints,
        borderColor: color,
        backgroundColor: color + '80', // Add alpha for background
        tension: 0.1,
        spanGaps: true, // Draw line even if there are null data points
      },
      {
        label: `Meta - ${indicator.name}`,
        data: Array(allDates.length).fill(indicator.goal),
        borderColor: color,
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false,
      },
    ];
  });

  const data = { labels, datasets };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Evolución de Indicadores Clave',
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Line options={options} data={data} />;
};

export default IndicatorChart;
