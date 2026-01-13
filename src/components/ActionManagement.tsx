
'use client';

import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaCheckCircle, FaHourglassHalf, FaTimesCircle } from 'react-icons/fa';

interface Action {
  id: number;
  name: string;
  description: string;
  responsible: string;
  status: 'Abierta' | 'En Progreso' | 'Cerrada';
}

interface ActionManagementProps {
  actionType: string;
  storageKey: string;
}

const ActionManagement = ({ actionType, storageKey }: ActionManagementProps) => {
  const [actions, setActions] = useState<Action[]>([]);
  const [newActionName, setNewActionName] = useState('');
  const [newActionDescription, setNewActionDescription] = useState('');
  const [newActionResponsible, setNewActionResponsible] = useState('');
  const [newActionStatus, setNewActionStatus] = useState<'Abierta' | 'En Progreso' | 'Cerrada'>('Abierta');
  const [nextId, setNextId] = useState(1);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<Action | null>(null);

  useEffect(() => {
    const storedActions = localStorage.getItem(storageKey);
    if (storedActions) {
      const parsedActions: Action[] = JSON.parse(storedActions);
      setActions(parsedActions);
      const maxId = parsedActions.reduce((max, a) => (a.id > max ? a.id : max), 0);
      setNextId(maxId + 1);
    }
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(actions));
  }, [actions, storageKey]);

  const handleAddAction = () => {
    if (newActionName.trim() && newActionDescription.trim() && newActionResponsible.trim()) {
      const newAction: Action = {
        id: nextId,
        name: newActionName,
        description: newActionDescription,
        responsible: newActionResponsible,
        status: newActionStatus,
      };
      setActions([...actions, newAction]);
      setNextId(nextId + 1);
      setNewActionName('');
      setNewActionDescription('');
      setNewActionResponsible('');
      setNewActionStatus('Abierta');
      alert(`Acción "${newActionName}" agregada a ${actionType}.`);
    } else {
      alert('Por favor, complete todos los campos de la acción.');
    }
  };

  const handleDeleteAction = (id: number, name: string) => {
    if (confirm(`¿Está seguro de que desea eliminar la acción "${name}"? Esta acción no se puede deshacer.`)) {
      const updatedActions = actions.filter(action => action.id !== id);
      setActions(updatedActions);
      alert(`La acción "${name}" ha sido eliminada.`);
    }
  };

  const handleEditAction = (action: Action) => {
    setCurrentAction(action);
    setIsEditModalOpen(true);
  };

  const handleSaveEditedAction = (updatedAction: Action) => {
    setActions(actions.map(action => (action.id === updatedAction.id ? updatedAction : action)));
    setIsEditModalOpen(false);
    setCurrentAction(null);
    alert(`Acción "${updatedAction.name}" actualizada.`);
  };

  const getStatusClass = (status: Action['status']) => {
    switch (status) {
      case 'Abierta': return 'bg-red-100 text-red-800';
      case 'En Progreso': return 'bg-yellow-100 text-yellow-800';
      case 'Cerrada': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Action['status']) => {
    switch (status) {
      case 'Abierta': return <FaTimesCircle className="inline mr-1" />;
      case 'En Progreso': return <FaHourglassHalf className="inline mr-1" />;
      case 'Cerrada': return <FaCheckCircle className="inline mr-1" />;
      default: return null;
    }
  };

  return (
    <div className="module-container">
      <h1 className="module-title">{actionType}</h1>
      <p className="module-description">Gestione las {actionType.toLowerCase()}.</p>

      <div className="form-section mb-8">
        <h2 className="form-title">Agregar Nueva Acción</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="actionName" className="form-label">Nombre de la Acción</label>
            <input
              type="text"
              id="actionName"
              className="form-input"
              value={newActionName}
              onChange={(e) => setNewActionName(e.target.value)}
              placeholder="Ej: Implementar nuevo software"
            />
          </div>
          <div className="form-group">
            <label htmlFor="actionResponsible" className="form-label">Responsable</label>
            <input
              type="text"
              id="actionResponsible"
              className="form-input"
              value={newActionResponsible}
              onChange={(e) => setNewActionResponsible(e.target.value)}
              placeholder="Ej: Juan Pérez"
            />
          </div>
          <div className="form-group md:col-span-2">
            <label htmlFor="actionDescription" className="form-label">Descripción</label>
            <textarea
              id="actionDescription"
              className="form-input"
              value={newActionDescription}
              onChange={(e) => setNewActionDescription(e.target.value)}
              placeholder="Describa la acción en detalle"
              rows={3}
            />
          </div>
          <div className="form-group">
            <label htmlFor="actionStatus" className="form-label">Estado Inicial</label>
            <select
              id="actionStatus"
              className="form-input"
              value={newActionStatus}
              onChange={(e) => setNewActionStatus(e.target.value as 'Abierta' | 'En Progreso' | 'Cerrada')}
            >
              <option value="Abierta">Abierta</option>
              <option value="En Progreso">En Progreso</option>
              <option value="Cerrada">Cerrada</option>
            </select>
          </div>
        </div>
        <button onClick={handleAddAction} className="feature-button mt-4">Agregar Acción</button>
      </div>

      <div className="form-section">
        <h2 className="form-title">Listado de Acciones</h2>
        {actions.length === 0 ? (
          <p>No hay acciones registradas aún.</p>
        ) : (
          <div classNameName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {actions.map((action) => (
              <div key={action.id} className="action-card">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{action.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusClass(action.status)}`}>
                    {getStatusIcon(action.status)} {action.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{action.description}</p>
                <p className="text-sm text-gray-500 mb-4">Responsable: {action.responsible}</p>
                <div className="flex justify-end space-x-2">
                  <button onClick={() => handleEditAction(action)} className="text-blue-500 hover:text-blue-700">
                    <FaEdit /> Editar
                  </button>
                  <button onClick={() => handleDeleteAction(action.id, action.name)} className="text-red-500 hover:text-red-700">
                    <FaTrash /> Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Action Modal */}
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

// Edit Action Modal Component
interface EditActionModalProps {
  action: Action;
  onSave: (action: Action) => void;
  onClose: () => void;
}

const EditActionModal = ({ action, onSave, onClose }: EditActionModalProps) => {
  const [editedAction, setEditedAction] = useState<Action>(action);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedAction(prev => ({ ...prev, [name]: value }));
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
            <label htmlFor="editName" className="form-label">Nombre</label>
            <input type="text" id="editName" name="name" value={editedAction.name} onChange={handleChange} className="form-input" />
          </div>
          <div className="form-group">
            <label htmlFor="editDescription" className="form-label">Descripción</label>
            <textarea id="editDescription" name="description" value={editedAction.description} onChange={handleChange} className="form-input" rows={3} />
          </div>
          <div className="form-group">
            <label htmlFor="editResponsible" className="form-label">Responsable</label>
            <input type="text" id="editResponsible" name="responsible" value={editedAction.responsible} onChange={handleChange} className="form-input" />
          </div>
          <div className="form-group">
            <label htmlFor="editStatus" className="form-label">Estado</label>
            <select id="editStatus" name="status" value={editedAction.status} onChange={handleChange} className="form-input">
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

export default ActionManagement;
