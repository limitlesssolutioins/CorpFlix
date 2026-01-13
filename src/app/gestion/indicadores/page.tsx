'use client';

import { useState, useEffect } from 'react';
import IndicatorChart from '@/components/IndicatorChart';
import { FaCheckCircle, FaExclamationCircle, FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';

interface Measurement {
  id: number;
  date: string;
  value: number;
}

interface Indicator {
  id: number;
  name: string;
  description: string;
  unit: string;
  goal: number;
  measurements: Measurement[];
}

const IndicadoresPage = () => {
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [nextIndicatorId, setNextIndicatorId] = useState(1);

  const [newIndicatorName, setNewIndicatorName] = useState('');
  const [newIndicatorDesc, setNewIndicatorDesc] = useState('');
  const [newIndicatorUnit, setNewIndicatorUnit] = useState('');
  const [newIndicatorGoal, setNewIndicatorGoal] = useState('');

  const [measurementValue, setMeasurementValue] = useState('');
  const [measurementDate, setMeasurementDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedIndicator, setSelectedIndicator] = useState<string>('');

  const [showCreateIndicatorForm, setShowCreateIndicatorForm] = useState(false);
  const [showRegisterMeasurementForm, setShowRegisterMeasurementForm] = useState(false);

  const storageKey = 'kpiData';

  useEffect(() => {
    const storedData = localStorage.getItem(storageKey);
    if (storedData) {
      const parsed: Indicator[] = JSON.parse(storedData);
      setIndicators(parsed);
      setNextIndicatorId((parsed.reduce((max: number, i: Indicator) => (i.id > max ? i.id : max), 0) || 0) + 1);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(indicators));
  }, [indicators]);

  const handleAddIndicator = () => {
    if (newIndicatorName.trim() && newIndicatorUnit.trim() && newIndicatorGoal.trim()) {
      const newIndicator: Indicator = {
        id: nextIndicatorId,
        name: newIndicatorName,
        description: newIndicatorDesc,
        unit: newIndicatorUnit,
        goal: parseFloat(newIndicatorGoal),
        measurements: [],
      };
      setIndicators([...indicators, newIndicator]);
      setNextIndicatorId(nextIndicatorId + 1);
      setNewIndicatorName('');
      setNewIndicatorDesc('');
      setNewIndicatorUnit('');
      setNewIndicatorGoal('');
      alert('Indicador creado con éxito.');
      setShowCreateIndicatorForm(false); // Close form after creation
    } else {
      alert('Por favor, complete el nombre, la unidad y la meta del indicador.');
    }
  };

  const handleAddMeasurement = () => {
    if (selectedIndicator && measurementValue.trim()) {
      const indicatorId = parseInt(selectedIndicator);
      const updatedIndicators = indicators.map(indicator => {
        if (indicator.id === indicatorId) {
          const nextMeasurementId = (indicator.measurements.reduce((max, m) => (m.id > max ? m.id : max), 0) || 0) + 1;
          const newMeasurement: Measurement = {
            id: nextMeasurementId,
            date: measurementDate,
            value: parseFloat(measurementValue),
          };
          return { ...indicator, measurements: [...indicator.measurements, newMeasurement] };
        }
        return indicator;
      });
      setIndicators(updatedIndicators);
      setMeasurementValue('');
      setSelectedIndicator('');
      alert('Medición agregada.');
      setShowRegisterMeasurementForm(false); // Close form after creation
    } else {
      alert('Por favor, seleccione un indicador e ingrese un valor.');
    }
  };

  const handleDeleteIndicator = (id: number, name: string) => {
    if (confirm(`¿Está seguro de que desea eliminar el indicador "${name}"? Esta acción no se puede deshacer.`)) {
      const updatedIndicators = indicators.filter(indicator => indicator.id !== id);
      setIndicators(updatedIndicators);
      alert(`El indicador "${name}" ha sido eliminado.`);
    }
  };

  const handleIndicatorChange = (id: number, field: keyof Indicator, value: string | number) => {
    setIndicators(prevIndicators =>
      prevIndicators.map(indicator =>
        indicator.id === id ? { ...indicator, [field]: value } : indicator
      )
    );
  };

  const getIndicatorStatus = (indicator: Indicator) => {
    if (indicator.measurements.length === 0) return 'no-data';
    const lastValue = indicator.measurements[indicator.measurements.length - 1].value;
    if (lastValue >= indicator.goal) return 'on-target';
    return 'below-target';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-target': return <FaCheckCircle className="text-green-500" title="En Meta" />;
      case 'below-target': return <FaExclamationCircle className="text-red-500" title="Bajo Meta" />;
      default: return <FaMinus className="text-gray-400" title="Sin Datos" />;
    }
  };

  const indicatorsOnTarget = indicators.filter(ind => getIndicatorStatus(ind) === 'on-target').length;
  const indicatorsBelowTarget = indicators.filter(ind => getIndicatorStatus(ind) === 'below-target').length;
  const indicatorsNoData = indicators.filter(ind => getIndicatorStatus(ind) === 'no-data').length;

  return (
    <div className="module-container">
      <h1 className="module-title">Módulo: Indicadores de Gestión (KPIs)</h1>
      <p className="module-description">Defina, mida y analice los indicadores clave para el éxito de su organización.</p>

      <div className="form-section mb-8">
        <h2 className="form-title">Resumen de Indicadores</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-4 border rounded-lg bg-green-50 flex items-center justify-center">
            <FaCheckCircle className="text-green-600 mr-2 text-2xl" />
            <span className="text-lg font-semibold">{indicatorsOnTarget} En Meta</span>
          </div>
          <div className="p-4 border rounded-lg bg-red-50 flex items-center justify-center">
            <FaExclamationCircle className="text-red-600 mr-2 text-2xl" />
            <span className="text-lg font-semibold">{indicatorsBelowTarget} Bajo Meta</span>
          </div>
          <div className="p-4 border rounded-lg bg-gray-50 flex items-center justify-center">
            <FaMinus className="text-gray-600 mr-2 text-2xl" />
            <span className="text-lg font-semibold">{indicatorsNoData} Sin Datos</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-4 mb-8">
        <button onClick={() => setShowCreateIndicatorForm(true)} className="feature-button">Crear Nuevo Indicador</button>
        <button onClick={() => setShowRegisterMeasurementForm(true)} className="feature-button">Registrar Medición</button>
      </div>

      {showCreateIndicatorForm && (
        <div className="form-section mb-8">
          <h2 className="form-title">Crear Nuevo Indicador</h2>
          <div className="form-group">
            <label htmlFor="indicatorName" className="form-label">Nombre del Indicador</label>
            <input type="text" id="indicatorName" className="form-input" value={newIndicatorName} onChange={e => setNewIndicatorName(e.target.value)} placeholder="Ej: Tasa de Retención de Clientes" />
          </div>
          <div className="form-group">
            <label htmlFor="indicatorDesc" className="form-label">Descripción</label>
            <textarea id="indicatorDesc" className="form-input" value={newIndicatorDesc} onChange={e => setNewIndicatorDesc(e.target.value)} placeholder="Cómo se calcula y qué representa" />
          </div>
          <div className="form-group">
            <label htmlFor="indicatorUnit" className="form-label">Unidad</label>
            <input type="text" id="indicatorUnit" className="form-input" value={newIndicatorUnit} onChange={e => setNewIndicatorUnit(e.target.value)} placeholder="Ej: %" />
          </div>
          <div className="form-group">
            <label htmlFor="indicatorGoal" className="form-label">Meta</label>
            <input type="number" id="indicatorGoal" className="form-input" value={newIndicatorGoal} onChange={e => setNewIndicatorGoal(e.target.value)} placeholder="Ej: 95" />
          </div>
          <div className="flex justify-end space-x-4 mt-4">
            <button type="button" onClick={() => setShowCreateIndicatorForm(false)} className="button-secondary">Cancelar</button>
            <button onClick={handleAddIndicator} className="feature-button">Crear Indicador</button>
          </div>
        </div>
      )}

      {showRegisterMeasurementForm && (
        <div className="form-section mb-8">
          <h2 className="form-title">Registrar Medición</h2>
          <div className="form-group">
            <label htmlFor="indicatorSelect" className="form-label">Seleccionar Indicador</label>
            <select id="indicatorSelect" className="form-input" value={selectedIndicator} onChange={e => setSelectedIndicator(e.target.value)}>
              <option value="">-- Elija un indicador --</option>
              {indicators.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="measurementValue" className="form-label">Valor</label>
            <input type="number" id="measurementValue" className="form-input" value={measurementValue} onChange={e => setMeasurementValue(e.target.value)} placeholder="Ej: 96.5" />
          </div>
          <div className="form-group">
            <label htmlFor="measurementDate" className="form-label">Fecha de Medición</label>
            <input type="date" id="measurementDate" className="form-input" value={measurementDate} onChange={e => setMeasurementDate(e.target.value)} />
          </div>
          <div className="flex justify-end space-x-4 mt-4">
            <button type="button" onClick={() => setShowRegisterMeasurementForm(false)} className="button-secondary">Cancelar</button>
            <button onClick={handleAddMeasurement} className="feature-button">Registrar Medición</button>
          </div>
        </div>
      )}

      <div className="form-section mt-8">
        <h2 className="form-title">Panel de Indicadores</h2>
        {indicators.length === 0 ? <p>No hay indicadores definidos.</p> : (
          <div className="space-y-6">
            <IndicatorChart indicators={indicators} />

            <h3 className="font-bold text-xl mb-2">Detalle de Indicadores:</h3>
            {indicators.map(indicator => {
              const status = getIndicatorStatus(indicator);
              const statusClass = status === 'on-target' ? 'border-green-500' : status === 'below-target' ? 'border-red-500' : 'border-gray-300';
              const lastValue = indicator.measurements.length > 0 ? indicator.measurements[indicator.measurements.length - 1].value : null;
              const progress = lastValue !== null ? (lastValue / indicator.goal) * 100 : 0;

              return (
                <div key={indicator.id} className={`p-4 border-l-4 ${statusClass} rounded-lg shadow-md`}>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-lg">
                      <input 
                        type="text" 
                        value={indicator.name} 
                        onChange={(e) => handleIndicatorChange(indicator.id, 'name', e.target.value)} 
                        className="font-bold text-lg border-b border-gray-300 focus:border-blue-500 outline-none"
                      />
                    </h4>
                    {getStatusIcon(status)}
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    <textarea 
                      value={indicator.description} 
                      onChange={(e) => handleIndicatorChange(indicator.id, 'description', e.target.value)} 
                      className="w-full text-sm text-gray-600 border-b border-gray-300 focus:border-blue-500 outline-none resize-none"
                      rows={2}
                    />
                  </p>
                  <p className="mb-4">
                    <strong>Meta:</strong> 
                    <input 
                      type="number" 
                      value={indicator.goal} 
                      onChange={(e) => handleIndicatorChange(indicator.id, 'goal', parseFloat(e.target.value))} 
                      className="inline-block border-b border-gray-300 focus:border-blue-500 outline-none w-20 text-right"
                    /> 
                    <input 
                      type="text" 
                      value={indicator.unit} 
                      onChange={(e) => handleIndicatorChange(indicator.id, 'unit', e.target.value)} 
                      className="inline-block border-b border-gray-300 focus:border-blue-500 outline-none w-12 ml-1"
                    />
                  </p>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <div 
                      className="h-2.5 rounded-full"
                      style={{ width: `${Math.min(100, progress)}%`, backgroundColor: status === 'on-target' ? '#4CAF50' : '#f44336' }}
                    ></div>
                  </div>

                  <button 
                    onClick={() => handleDeleteIndicator(indicator.id, indicator.name)} 
                    className="text-red-500 hover:text-red-700 text-sm mt-2"
                  >
                    Eliminar Indicador
                  </button>
                  
                  <h5 className="font-semibold mt-6">Historial de Mediciones:</h5>
                  {indicator.measurements.length > 0 ? (
                    <ul className="list-disc pl-5 mt-2">
                      {indicator.measurements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(m => (
                        <li key={m.id}>{new Date(m.date).toLocaleDateString()}: <strong>{m.value} {indicator.unit}</strong></li>
                      ))}
                    </ul>
                  ) : <p className="text-sm">No hay mediciones registradas.</p>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default IndicadoresPage;