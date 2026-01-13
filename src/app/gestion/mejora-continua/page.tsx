'use client';

import { useState, useEffect } from 'react';
import { FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

// Interfaces
interface Action {
  id: number;
  name: string;
  description: string;
  responsible: string;
  status: 'Abierta' | 'En Progreso' | 'Cerrada';
  type: 'Mejora' | 'Correctiva' | 'Preventiva';
}

// Edit Action Modal Component
const EditActionModal = ({ action, onSave, onClose }: { action: Action; onSave: (action: Action) => void; onClose: () => void; }) => {
  const [editedAction, setEditedAction] = useState<Action>(action);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedAction(prev => ({ ...prev, [name]: value as any }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedAction);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full relative">
        <h2 className="text-xl font-bold mb-4">Editar Acción</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nombre</label>
            <input type="text" name="name" value={editedAction.name} onChange={handleChange} className="form-input" />
          </div>
          <div className="form-group">
            <label className="form-label">Descripción</label>
            <textarea name="description" value={editedAction.description} onChange={handleChange} className="form-input" rows={3} />
          </div>
          <div className="form-group">
            <label className="form-label">Responsable</label>
            <input type="text" name="responsible" value={editedAction.responsible} onChange={handleChange} className="form-input" />
          </div>
          <div className="form-group">
            <label className="form-label">Estado</label>
            <select name="status" value={editedAction.status} onChange={handleChange} className="form-input">
              <option value="Abierta">Abierta</option>
              <option value="En Progreso">En Progreso</option>
              <option value="Cerrada">Cerrada</option>
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

const MejoraContinuaPage = () => {
  const [activeTab, setActiveTab] = useState('plan');
  const [allActions, setAllActions] = useState<Action[]>([]);
  
  // State for forms and modals
  const [showAddActionForm, setShowAddActionForm] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<Action | null>(null);

  // State for new action form
  const [newActionName, setNewActionName] = useState('');
  const [newActionDescription, setNewActionDescription] = useState('');
  const [newActionResponsible, setNewActionResponsible] = useState('');
  const [newActionType, setNewActionType] = useState<Action['type']>('Mejora');

  // State for filters
  const [filterStatus, setFilterStatus] = useState<'Todos' | 'Abierta' | 'En Progreso' | 'Cerrada'>('Todos');
  const [filterType, setFilterType] = useState<'Todos' | 'Mejora' | 'Correctiva' | 'Preventiva'>('Todos');

  const actionTypes = {
    Mejora: 'improvementActions',
    Correctiva: 'correctiveActions',
    Preventiva: 'preventiveActions',
  };

  const loadActions = () => {
    let loadedActions: Action[] = [];
    Object.entries(actionTypes).forEach(([typeName, storageKey]) => {
      const storedData = localStorage.getItem(storageKey);
      if (storedData) {
        const parsedActions = JSON.parse(storedData).map((a: any) => ({ ...a, type: typeName as Action['type'] }));
        loadedActions = [...loadedActions, ...parsedActions];
      }
    });
    setAllActions(loadedActions.sort((a, b) => a.id - b.id));
  };

  useEffect(() => {
    loadActions();
  }, []);

  const handleAddAction = () => {
    if (!newActionName.trim() || !newActionDescription.trim() || !newActionResponsible.trim()) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    const storageKey = actionTypes[newActionType];
    const currentActions = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const nextId = (currentActions.reduce((max: number, a: Action) => (a.id > max ? a.id : max), 0) || 0) + 1;

    const newAction: Omit<Action, 'type'> = {
      id: nextId,
      name: newActionName,
      description: newActionDescription,
      responsible: newActionResponsible,
      status: 'Abierta',
    };

    localStorage.setItem(storageKey, JSON.stringify([...currentActions, newAction]));
    
    // Reset form and state
    setNewActionName('');
    setNewActionDescription('');
    setNewActionResponsible('');
    setShowAddActionForm(false);
    loadActions();
    alert(`Acción de ${newActionType} agregada.`);
  };

  const handleEditAction = (action: Action) => {
    setCurrentAction(action);
    setIsEditModalOpen(true);
  };

  const handleSaveEditedAction = (updatedAction: Action) => {
    const storageKey = actionTypes[updatedAction.type];
    const currentActions = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const updatedActions = currentActions.map((a: Action) => a.id === updatedAction.id ? updatedAction : a);
    localStorage.setItem(storageKey, JSON.stringify(updatedActions));

    setIsEditModalOpen(false);
    setCurrentAction(null);
    loadActions();
    alert(`Acción actualizada.`);
  };

  const handleDeleteAction = (actionToDel: Action) => {
    if (confirm(`¿Está seguro de eliminar la acción "${actionToDel.name}"?`)) {
      const storageKey = actionTypes[actionToDel.type];
      const currentActions = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const updatedActions = currentActions.filter((a: Action) => a.id !== actionToDel.id);
      localStorage.setItem(storageKey, JSON.stringify(updatedActions));
      loadActions();
      alert('Acción eliminada.');
    }
  };

  const getStatusClass = (status: Action['status']) => {
    if (status === 'Abierta') return 'bg-red-100 text-red-800';
    if (status === 'En Progreso') return 'bg-yellow-100 text-yellow-800';
    if (status === 'Cerrada') return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: Action['status']) => {
    if (status === 'Abierta') return <FaTimesCircle className="inline mr-1" />;
    if (status === 'En Progreso') return <FaHourglassHalf className="inline mr-1" />;
    if (status === 'Cerrada') return <FaCheckCircle className="inline mr-1" />;
    return null;
  };

  const filteredActions = allActions.filter(action => {
    const statusMatch = filterStatus === 'Todos' || action.status === filterStatus;
    const typeMatch = filterType === 'Todos' || action.type === filterType;
    return statusMatch && typeMatch;
  });

  return (
    <div className="module-container">
      <h1 className="module-title">Módulo: Mejora Continua</h1>
      <p className="module-description">Gestión integrada de acciones de mejora, correctivas, preventivas y su plan de seguimiento.</p>

      <div className="flex border-b border-gray-200 mb-6">
        <button onClick={() => setActiveTab('plan')} className={`tab-button ${activeTab === 'plan' ? 'active' : ''}`}>
          Plan de Mejoramiento
        </button>
        <button onClick={() => setActiveTab('gestionar')} className={`tab-button ${activeTab === 'gestionar' ? 'active' : ''}`}>
          Gestionar Acciones
        </button>
      </div>

      {/* TAB: PLAN DE MEJORAMIENTO */}
      {activeTab === 'plan' && (
        <div id="plan-mejoramiento">
          <div className="form-section mb-8">
            <h3 className="form-title">Filtros del Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label htmlFor="filterStatus" className="form-label">Filtrar por Estado</label>
                <select id="filterStatus" className="form-input" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)}>
                  <option value="Todos">Todos</option>
                  <option value="Abierta">Abierta</option>
                  <option value="En Progreso">En Progreso</option>
                  <option value="Cerrada">Cerrada</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="filterType" className="form-label">Filtrar por Tipo</label>
                <select id="filterType" className="form-input" value={filterType} onChange={(e) => setFilterType(e.target.value as any)}>
                  <option value="Todos">Todos</option>
                  <option value="Mejora">Mejora</option>
                  <option value="Correctiva">Correctiva</option>
                  <option value="Preventiva">Preventiva</option>
                </select>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredActions.map((action) => (
              <div key={action.id} className={`p-4 border rounded-lg shadow-md ${getStatusClass(action.status)}`}>
                <h4 className="font-bold text-lg">[{action.type}] {action.name}</h4>
                <p className="text-sm my-2">{action.description}</p>
                <p className="text-sm font-semibold">Responsable: {action.responsible}</p>
                <p className="text-sm font-semibold">Estado: {action.status}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: GESTIONAR ACCIONES */}
      {activeTab === 'gestionar' && (
        <div id="gestionar-acciones">
          <div className="flex justify-end mb-6">
            <button onClick={() => setShowAddActionForm(!showAddActionForm)} className="feature-button">
              <FaPlus className="mr-2" /> {showAddActionForm ? 'Ocultar Formulario' : 'Agregar Nueva Acción'}
            </button>
          </div>

          {showAddActionForm && (
            <div className="form-section mb-8">
              <h2 className="form-title">Agregar Nueva Acción</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Tipo de Acción</label>
                  <select value={newActionType} onChange={(e) => setNewActionType(e.target.value as any)} className="form-input">
                    <option value="Mejora">Mejora</option>
                    <option value="Correctiva">Correctiva</option>
                    <option value="Preventiva">Preventiva</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Nombre</label>
                  <input type="text" value={newActionName} onChange={(e) => setNewActionName(e.target.value)} className="form-input" />
                </div>
                <div className="form-group md:col-span-2">
                  <label className="form-label">Descripción</label>
                  <textarea value={newActionDescription} onChange={(e) => setNewActionDescription(e.target.value)} className="form-input" rows={3} />
                </div>
                <div className="form-group">
                  <label className="form-label">Responsable</label>
                  <input type="text" value={newActionResponsible} onChange={(e) => setNewActionResponsible(e.target.value)} className="form-input" />
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-4">
                <button onClick={() => setShowAddActionForm(false)} className="button-secondary">Cancelar</button>
                <button onClick={handleAddAction} className="feature-button">Guardar Acción</button>
              </div>
            </div>
          )}

          <div className="form-section">
            <h2 className="form-title">Todas las Acciones</h2>
            <div className="space-y-4">
              {allActions.map(action => (
                <div key={action.id} className="p-4 border rounded-lg shadow-md flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg">[{action.type}] {action.name}</h3>
                    <p className="text-sm text-gray-600">Responsable: {action.responsible} - Estado: <span className={`font-semibold ${getStatusClass(action.status)}`}>{action.status}</span></p>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => handleEditAction(action)} className="text-blue-600 hover:text-blue-800"><FaEdit /> Editar</button>
                    <button onClick={() => handleDeleteAction(action)} className="text-red-600 hover:text-red-800"><FaTrash /> Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && currentAction && (
        <EditActionModal 
          action={currentAction} 
          onSave={handleSaveEditedAction} 
          onClose={() => setIsEditModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default MejoraContinuaPage;