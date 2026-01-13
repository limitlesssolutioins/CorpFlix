
'use client';

import { useState, useEffect } from 'react';
import RiskMatrix from '@/components/RiskMatrix';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

// Interface for a single risk
interface Risk {
  id: number;
  name: string;
  description: string;
  probability: 'Baja' | 'Media' | 'Alta';
  impact: 'Bajo' | 'Medio' | 'Alto';
  type: string; // To know which category it belongs to
}

// Edit Risk Modal Component
interface EditRiskModalProps {
  risk: Risk;
  onSave: (risk: Risk) => void;
  onClose: () => void;
}

const EditRiskModal = ({ risk, onSave, onClose }: EditRiskModalProps) => {
  const [editedRisk, setEditedRisk] = useState<Risk>(risk);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedRisk(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedRisk);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full relative">
        <h2 className="text-xl font-bold mb-4">Editar Riesgo</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="editName" className="form-label">Nombre</label>
            <input type="text" id="editName" name="name" value={editedRisk.name} onChange={handleChange} className="form-input" />
          </div>
          <div className="form-group">
            <label htmlFor="editDescription" className="form-label">Descripción</label>
            <textarea id="editDescription" name="description" value={editedRisk.description} onChange={handleChange} className="form-input" rows={3} />
          </div>
          <div className="form-group">
            <label htmlFor="editProbability" className="form-label">Probabilidad</label>
            <select id="editProbability" name="probability" value={editedRisk.probability} onChange={handleChange} className="form-input">
              <option value="Baja">Baja</option>
              <option value="Media">Media</option>
              <option value="Alta">Alta</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="editImpact" className="form-label">Impacto</label>
            <select id="editImpact" name="impact" value={editedRisk.impact} onChange={handleChange} className="form-input">
              <option value="Bajo">Bajo</option>
              <option value="Medio">Medio</option>
              <option value="Alto">Alto</option>
            </select>
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button type="button" onClick={onClose} className="button-secondary">Cancelar</button>
            <button type="submit" className="feature-button">Guardar Cambios</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const RiesgosPage = () => {
  const riskCategories = [
    { key: 'corporateRisks', name: 'Corporativos' },
    { key: 'healthSafetyRisks', name: 'Seguridad y Salud' },
    { key: 'environmentalRisks', name: 'Ambientales' },
    { key: 'financialRisks', name: 'Financieros' },
    { key: 'organizationalRisks', name: 'Organizacionales' },
  ];

  const [allRisks, setAllRisks] = useState<Risk[]>([]);
  const [activeTab, setActiveTab] = useState(riskCategories[0].key);

  const [newRiskName, setNewRiskName] = useState('');
  const [newRiskDescription, setNewRiskDescription] = useState('');
  const [newRiskProbability, setNewRiskProbability] = useState<'Baja' | 'Media' | 'Alta'>('Baja');
  const [newRiskImpact, setNewRiskImpact] = useState<'Bajo' | 'Medio' | 'Alto'>('Bajo');
  const [nextId, setNextId] = useState(1);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentRisk, setCurrentRisk] = useState<Risk | null>(null);
  const [showAddRiskForm, setShowAddRiskForm] = useState(false);
  const [showRiskList, setShowRiskList] = useState(true);
  const [matrixFilter, setMatrixFilter] = useState<{ impact: Risk['impact'] | null; probability: Risk['probability'] | null }>({ impact: null, probability: null });

  // Load all risks from localStorage
  useEffect(() => {
    let loadedRisks: Risk[] = [];
    let maxId = 0;
    riskCategories.forEach(({ key, name: typeName }) => {
      const storedData = localStorage.getItem(key);
      if (storedData) {
        const parsedRisks = JSON.parse(storedData).map((risk: any) => ({ ...risk, type: typeName }));
        loadedRisks = [...loadedRisks, ...parsedRisks];
        maxId = Math.max(maxId, ...parsedRisks.map((r: Risk) => r.id));
      }
    });
    setAllRisks(loadedRisks);
    setNextId(maxId + 1);
  }, []);

  // Save risks to their respective localStorage keys
  useEffect(() => {
    riskCategories.forEach(({ key, name: typeName }) => {
      const risksForCategory = allRisks.filter(risk => risk.type === typeName);
      localStorage.setItem(key, JSON.stringify(risksForCategory));
    });
  }, [allRisks]);

  const handleAddRisk = () => {
    if (newRiskName.trim() && newRiskDescription.trim()) {
      const newRisk: Risk = {
        id: nextId,
        name: newRiskName,
        description: newRiskDescription,
        probability: newRiskProbability,
        impact: newRiskImpact,
        type: riskCategories.find(cat => cat.key === activeTab)?.name || 'Desconocido',
      };
      setAllRisks(prevRisks => [...prevRisks, newRisk]);
      setNextId(nextId + 1);
      setNewRiskName('');
      setNewRiskDescription('');
      setNewRiskProbability('Baja');
      setNewRiskImpact('Bajo');
      alert(`Riesgo "${newRiskName}" agregado a ${newRisk.type}.`);
      setShowAddRiskForm(false); // Close form after adding
    } else {
      alert('Por favor, complete todos los campos del riesgo.');
    }
  };

  const handleDeleteRisk = (id: number, type: string, name: string) => {
    if (confirm(`¿Está seguro de que desea eliminar el riesgo "${name}" de la categoría ${type}? Esta acción no se puede deshacer.`)) {
      setAllRisks(prevRisks => prevRisks.filter(risk => !(risk.id === id && risk.type === type)));
      alert(`El riesgo "${name}" ha sido eliminado.`);
    }
  };

  const handleEditRisk = (risk: Risk) => {
    setCurrentRisk(risk);
    setIsEditModalOpen(true);
  };

  const handleSaveEditedRisk = (updatedRisk: Risk) => {
    setAllRisks(prevRisks =>
      prevRisks.map(risk => (risk.id === updatedRisk.id && risk.type === updatedRisk.type ? updatedRisk : risk))
    );
    setIsEditModalOpen(false);
    setCurrentRisk(null);
    alert(`Riesgo "${updatedRisk.name}" actualizado.`);
  };

  const getRiskLevelClass = (probability: Risk['probability'], impact: Risk['impact']) => {
    const levels = {
      Baja: 1, Media: 2, Alta: 3,
      Bajo: 1, Medio: 2, Alto: 3,
    };
    const probValue = levels[probability];
    const impValue = levels[impact];

    const score = probValue * impValue;

    if (score >= 6) return 'bg-red-500 text-white'; // High risk
    if (score >= 3) return 'bg-yellow-500 text-gray-800'; // Medium risk
    return 'bg-green-500 text-white'; // Low risk
  };

  const handleMatrixCellClick = (impact: Risk['impact'], probability: Risk['probability']) => {
    setMatrixFilter({ impact, probability });
    setShowRiskList(true); // Ensure list is visible when filtered
  };

  const handleClearMatrixFilter = () => {
    setMatrixFilter({ impact: null, probability: null });
  };

  const risksForActiveTab = allRisks.filter(risk => {
    const categoryMatch = risk.type === (riskCategories.find(cat => cat.key === activeTab)?.name || risk.type);
    const matrixImpactMatch = matrixFilter.impact ? risk.impact === matrixFilter.impact : true;
    const matrixProbabilityMatch = matrixFilter.probability ? risk.probability === matrixFilter.probability : true;
    return categoryMatch && matrixImpactMatch && matrixProbabilityMatch;
  });

  return (
    <div className="module-container">
      <h1 className="module-title">Módulo: Gestión de Riesgos</h1>
      <p className="module-description">
        Identifique, evalúe y visualice los riesgos de toda la organización en una matriz centralizada para una toma de decisiones informada.
      </p>
      
      <RiskMatrix risks={allRisks} onCellClick={handleMatrixCellClick} />

      <div className="form-section mt-8">
        <h2 className="form-title">Gestionar Riesgos por Categoría</h2>
        <div className="flex border-b border-gray-200 mb-4">
          {riskCategories.map(category => (
            <button
              key={category.key}
              className={`py-2 px-4 -mb-px border-b-2 ${activeTab === category.key ? 'border-blue-500 text-blue-600 font-semibold' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab(category.key)}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="flex justify-end space-x-4 mb-6">
          <button onClick={() => setShowAddRiskForm(!showAddRiskForm)} className="feature-button">
            <FaPlus className="mr-2" /> {showAddRiskForm ? 'Ocultar Formulario' : 'Agregar Nuevo Riesgo'}
          </button>
          <button onClick={() => setShowRiskList(!showRiskList)} className="feature-button">
            {showRiskList ? 'Ocultar Lista' : 'Mostrar Lista'}
          </button>
          {matrixFilter.impact && matrixFilter.probability && (
            <button onClick={handleClearMatrixFilter} className="button-secondary">
              Limpiar Filtro Matriz
            </button>
          )}
        </div>

        {showAddRiskForm && (
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Agregar Nuevo Riesgo ({riskCategories.find(cat => cat.key === activeTab)?.name})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  rows={3}
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
            </div>
            <div className="flex justify-end space-x-4 mt-4">
              <button type="button" onClick={() => setShowAddRiskForm(false)} className="button-secondary">Cancelar</button>
              <button onClick={handleAddRisk} className="feature-button">Agregar Riesgo</button>
            </div>
          </div>
        )}

        {showRiskList && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Riesgos de la Categoría ({riskCategories.find(cat => cat.key === activeTab)?.name})</h3>
            {risksForActiveTab.length === 0 ? (
              <p>No hay riesgos registrados en esta categoría.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {risksForActiveTab.map(risk => (
                  <div key={risk.id} className={`p-4 border rounded-lg shadow-md ${getRiskLevelClass(risk.probability, risk.impact)}`}>
                    <h4 className="font-bold text-lg mb-2">{risk.name}</h4>
                    <p className="text-sm mb-2">{risk.description}</p>
                    <p className="text-sm">Probabilidad: {risk.probability}</p>
                    <p className="text-sm">Impacto: {risk.impact}</p>
                    <div className="flex justify-end space-x-2 mt-4">
                      <button onClick={() => handleEditRisk(risk)} className="text-blue-700 hover:text-blue-900">
                        <FaEdit /> Editar
                      </button>
                      <button onClick={() => handleDeleteRisk(risk.id, risk.type, risk.name)} className="text-red-700 hover:text-red-900">
                        <FaTrash /> Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Risk Modal */}
      {isEditModalOpen && currentRisk && (
        <EditRiskModal
          risk={currentRisk}
          onSave={handleSaveEditedRisk}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
};

export default RiesgosPage;
