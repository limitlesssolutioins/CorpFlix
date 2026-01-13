
'use client';

import { useState, useEffect } from 'react';

interface Risk {
  id: number;
  name: string;
  description: string;
  probability: 'Baja' | 'Media' | 'Alta';
  impact: 'Bajo' | 'Medio' | 'Alto';
}

interface RiskManagementProps {
  riskType: string;
  storageKey: string;
}

const RiskManagement = ({ riskType, storageKey }: RiskManagementProps) => {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [newRiskName, setNewRiskName] = useState('');
  const [newRiskDescription, setNewRiskDescription] = useState('');
  const [newRiskProbability, setNewRiskProbability] = useState<'Baja' | 'Media' | 'Alta'>('Baja');
  const [newRiskImpact, setNewRiskImpact] = useState<'Bajo' | 'Medio' | 'Alto'>('Bajo');
  const [nextId, setNextId] = useState(1);

  useEffect(() => {
    const storedRisks = localStorage.getItem(storageKey);
    if (storedRisks) {
      const parsedRisks: Risk[] = JSON.parse(storedRisks);
      setRisks(parsedRisks);
      const maxId = parsedRisks.reduce((max, r) => (r.id > max ? r.id : max), 0);
      setNextId(maxId + 1);
    }
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(risks));
  }, [risks, storageKey]);

  const handleAddRisk = () => {
    if (newRiskName.trim() && newRiskDescription.trim()) {
      const newRisk: Risk = {
        id: nextId,
        name: newRiskName,
        description: newRiskDescription,
        probability: newRiskProbability,
        impact: newRiskImpact,
      };
      setRisks([...risks, newRisk]);
      setNextId(nextId + 1);
      setNewRiskName('');
      setNewRiskDescription('');
      setNewRiskProbability('Baja');
      setNewRiskImpact('Bajo');
      alert(`Riesgo "${newRiskName}" agregado a ${riskType}.`);
    } else {
      alert('Por favor, complete todos los campos del riesgo.');
    }
  };

  return (
    <div className="module-container">
      <h1 className="module-title">{riskType}</h1>
      <p className="module-description">Gestione los riesgos de tipo {riskType.toLowerCase()}.</p>

      <div className="form-section mb-8">
        <h2 className="form-title">Agregar Nuevo Riesgo</h2>
        <div className="form-group">
          <label htmlFor="riskName" className="form-label">Nombre del Riesgo</label>
          <input
            type="text"
            id="riskName"
            className="form-input"
            value={newRiskName}
            onChange={(e) => setNewRiskName(e.target.value)}
            placeholder="Ej: Fuga de información"
          />
        </div>
        <div className="form-group">
          <label htmlFor="riskDescription" className="form-label">Descripción del Riesgo</label>
          <textarea
            id="riskDescription"
            className="form-input"
            value={newRiskDescription}
            onChange={(e) => setNewRiskDescription(e.target.value)}
            placeholder="Describa el riesgo en detalle"
          />
        </div>
        <div className="form-group">
          <label htmlFor="riskProbability" className="form-label">Probabilidad</label>
          <select
            id="riskProbability"
            className="form-input"
            value={newRiskProbability}
            onChange={(e) => setNewRiskProbability(e.target.value as 'Baja' | 'Media' | 'Alta')}
          >
            <option value="Baja">Baja</option>
            <option value="Media">Media</option>
            <option value="Alta">Alta</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="riskImpact" className="form-label">Impacto</label>
          <select
            id="riskImpact"
            className="form-input"
            value={newRiskImpact}
            onChange={(e) => setNewRiskImpact(e.target.value as 'Bajo' | 'Medio' | 'Alto')}
          >
            <option value="Bajo">Bajo</option>
            <option value="Medio">Medio</option>
            <option value="Alto">Alto</option>
          </select>
        </div>
        <button onClick={handleAddRisk} className="feature-button">Agregar Riesgo</button>
      </div>

      <div className="form-section">
        <h2 className="form-title">Listado de Riesgos</h2>
        {risks.length === 0 ? (
          <p>No hay riesgos registrados aún.</p>
        ) : (
          <ul className="list-disc pl-5">
            {risks.map((risk) => (
              <li key={risk.id} className="mb-2">
                <strong>{risk.name}</strong>: {risk.description} (Probabilidad: {risk.probability}, Impacto: {risk.impact})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RiskManagement;
