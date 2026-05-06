'use client';

import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaEye } from 'react-icons/fa';

// Interfaces
interface ChecklistItem {
  id: number;
  text: string;
}

interface Checklist {
  id: number;
  name: string;
  items: ChecklistItem[];
}

interface AuditReport {
  id: number;
  name: string;
  checklistId?: number;
  fileName: string;
  fileDataUrl?: string;
  fileType?: string;
}

// Edit Report Modal Component
interface EditReportModalProps {
  report: AuditReport;
  checklists: Checklist[]; // Pass available checklists for selection
  onSave: (report: AuditReport) => void;
  onClose: () => void;
}

const EditReportModal = ({ report, checklists, onSave, onClose }: EditReportModalProps) => {
  const [editedReport, setEditedReport] = useState<AuditReport>(report);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedReport(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedReport);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full relative">
        <h2 className="text-xl font-bold mb-4">Editar Informe de Auditoría</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="editReportName" className="form-label">Nombre del Informe</label>
            <input type="text" id="editReportName" name="name" value={editedReport.name} onChange={handleChange} className="form-input" />
          </div>
          <div className="form-group">
            <label htmlFor="editAssociatedChecklist" className="form-label">Lista de Chequeo Asociada</label>
            <select
              id="editAssociatedChecklist"
              name="checklistId"
              value={editedReport.checklistId || ''}
              onChange={handleChange}
              className="form-input"
            >
              <option value="">Ninguna</option>
              {checklists.map(cl => <option key={cl.id} value={cl.id}>{cl.name}</option>)}
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

// Edit Checklist Modal Component
interface EditChecklistModalProps {
  checklist: Checklist;
  onSave: (checklist: Checklist) => void;
  onClose: () => void;
}

const EditChecklistModal = ({ checklist, onSave, onClose }: EditChecklistModalProps) => {
  const [editedChecklist, setEditedChecklist] = useState<Checklist>(checklist);
  const [editedItems, setEditedItems] = useState<string[]>(checklist.items.map(item => item.text));

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedChecklist(prev => ({ ...prev, name: e.target.value }));
  };

  const handleItemChange = (index: number, value: string) => {
    const newItems = [...editedItems];
    newItems[index] = value;
    setEditedItems(newItems);
  };

  const addItem = () => setEditedItems([...editedItems, '']);
  const removeItem = (index: number) => setEditedItems(editedItems.filter((_, i) => i !== index));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedChecklist: Checklist = {
      ...editedChecklist,
      items: editedItems.filter(item => item.trim()).map((text, index) => ({ id: index, text })),
    };
    onSave(updatedChecklist);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full relative">
        <h2 className="text-xl font-bold mb-4">Editar Lista de Chequeo</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="editChecklistName" className="form-label">Nombre de la Lista</label>
            <input type="text" id="editChecklistName" className="form-input" value={editedChecklist.name} onChange={handleNameChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Ítems de la Lista</label>
            {editedItems.map((item, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  className="form-input flex-grow"
                  value={item}
                  onChange={(e) => handleItemChange(index, e.target.value)}
                  placeholder={`Ítem #${index + 1}`}
                />
                <button type="button" onClick={() => removeItem(index)} className="ml-2 text-red-500">Eliminar</button>
              </div>
            ))}
            <button type="button" onClick={addItem} className="feature-button-secondary mt-2">Agregar Ítem</button>
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

// View Checklist Modal Component
interface ViewChecklistModalProps {
  checklist: Checklist;
  onClose: () => void;
}

const ViewChecklistModal = ({ checklist, onClose }: ViewChecklistModalProps) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl font-bold">&times;</button>
        <h2 className="text-xl font-bold mb-4">Lista de Chequeo: {checklist.name}</h2>
        <ul className="list-disc pl-5">
          {checklist.items.length > 0 ? (
            checklist.items.map(item => <li key={item.id}>{item.text}</li>)
          ) : (
            <li>No hay ítems en esta lista de chequeo.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

const AuditoriaPage = () => {
  // State for Checklists
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [newChecklistName, setNewChecklistName] = useState('');
  const [checklistItems, setChecklistItems] = useState<string[]>(['']);
  const [nextChecklistId, setNextChecklistId] = useState(1);
  const [showAddChecklistForm, setShowAddChecklistForm] = useState(false);

  // State for Audit Reports
  const [reports, setReports] = useState<AuditReport[]>([]);
  const [newReportName, setNewReportName] = useState('');
  const [selectedChecklist, setSelectedChecklist] = useState<string>('');
  const [reportFile, setReportFile] = useState<File | null>(null);
  const [nextReportId, setNextReportId] = useState(1);
  const [showAddReportForm, setShowAddReportForm] = useState(false);

  // State for Preview Modal
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewContent, setPreviewContent] = useState<string | null>(null);
  const [previewFileType, setPreviewFileType] = useState<string | null>(null);

  // State for Edit/View Modals
  const [isEditChecklistModalOpen, setIsEditChecklistModalOpen] = useState(false);
  const [currentChecklist, setCurrentChecklist] = useState<Checklist | null>(null);
  const [isViewChecklistModalOpen, setIsViewChecklistModalOpen] = useState(false);
  const [isEditReportModalOpen, setIsEditReportModalOpen] = useState(false);
  const [currentReport, setCurrentReport] = useState<AuditReport | null>(null);

  const storageKeyChecklists = 'auditChecklists';
  const storageKeyReports = 'auditReports';

  // Load data from localStorage
  useEffect(() => {
    const storedChecklists = localStorage.getItem(storageKeyChecklists);
    if (storedChecklists) {
      const parsed = JSON.parse(storedChecklists);
      setChecklists(parsed);
      setNextChecklistId((parsed.reduce((max: number, c: Checklist) => (c.id > max ? c.id : max), 0) || 0) + 1);
    }
    const storedReports = localStorage.getItem(storageKeyReports);
    if (storedReports) {
      const parsed = JSON.parse(storedReports);
      setReports(parsed);
      setNextReportId((parsed.reduce((max: number, r: AuditReport) => (r.id > max ? r.id : max), 0) || 0) + 1);
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem(storageKeyChecklists, JSON.stringify(checklists));
  }, [checklists]);

  useEffect(() => {
    localStorage.setItem(storageKeyReports, JSON.stringify(reports));
  }, [reports]);

  // Checklist handlers
  const handleItemChange = (index: number, value: string) => {
    const newItems = [...checklistItems];
    newItems[index] = value;
    setChecklistItems(newItems);
  };

  const addItem = () => setChecklistItems([...checklistItems, '']);
  const removeItem = (index: number) => setChecklistItems(checklistItems.filter((_, i) => i !== index));

  const handleAddChecklist = () => {
    if (newChecklistName.trim() && checklistItems.some(item => item.trim())) {
      const newChecklist: Checklist = {
        id: nextChecklistId,
        name: newChecklistName,
        items: checklistItems.filter(item => item.trim()).map((text, index) => ({ id: index, text })),
      };
      setChecklists([...checklists, newChecklist]);
      setNextChecklistId(nextChecklistId + 1);
      setNewChecklistName('');
      setChecklistItems(['']);
      setShowAddChecklistForm(false);
      alert('Lista de chequeo creada.');
    } else {
      alert('Por favor, asigne un nombre y al menos un ítem a la lista.');
    }
  };

  const handleDeleteChecklist = (id: number, name: string) => {
    if (confirm(`¿Está seguro de que desea eliminar la lista de chequeo "${name}"? Esta acción no se puede deshacer.`)) {
      setChecklists(checklists.filter(cl => cl.id !== id));
      alert(`Lista de chequeo "${name}" eliminada.`);
    }
  };

  const handleEditChecklist = (checklist: Checklist) => {
    setCurrentChecklist(checklist);
    setIsEditChecklistModalOpen(true);
  };

  const handleSaveEditedChecklist = (updatedChecklist: Checklist) => {
    setChecklists(checklists.map(cl => (cl.id === updatedChecklist.id ? updatedChecklist : cl)));
    setIsEditChecklistModalOpen(false);
    setCurrentChecklist(null);
    alert(`Lista de chequeo "${updatedChecklist.name}" actualizada.`);
  };

  const handleViewChecklist = (checklist: Checklist) => {
    setCurrentChecklist(checklist);
    setIsViewChecklistModalOpen(true);
  };

  // Report handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReportFile(e.target.files[0]);
    }
  };

  const handleAddReport = () => {
    if (newReportName.trim() && reportFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newReport: AuditReport = {
          id: nextReportId,
          name: newReportName,
          checklistId: selectedChecklist ? parseInt(selectedChecklist) : undefined,
          fileName: reportFile.name,
          fileDataUrl: e.target?.result as string,
          fileType: reportFile.type,
        };
        setReports([...reports, newReport]);
        setNextReportId(nextReportId + 1);
        setNewReportName('');
        setSelectedChecklist('');
        setReportFile(null);
        setShowAddReportForm(false);
        const fileInput = document.getElementById('reportFile') as HTMLInputElement;
        if(fileInput) fileInput.value = '';
        alert('Informe de auditoría agregado.');
      };
      reader.readAsDataURL(reportFile);
    } else {
      alert('Por favor, asigne un nombre y seleccione un archivo para el informe.');
    }
  };

  const handleDeleteReport = (id: number, name: string) => {
    if (confirm(`¿Está seguro de que desea eliminar el informe "${name}"? Esta acción no se puede deshacer.`)) {
      setReports(reports.filter(rep => rep.id !== id));
      alert(`Informe "${name}" eliminado.`);
    }
  };

  const handleEditReport = (report: AuditReport) => {
    setCurrentReport(report);
    setIsEditReportModalOpen(true);
  };

  const handleSaveEditedReport = (updatedReport: AuditReport) => {
    setReports(reports.map(rep => (rep.id === updatedReport.id ? updatedReport : rep)));
    setIsEditReportModalOpen(false);
    setCurrentReport(null);
    alert(`Informe "${updatedReport.name}" actualizado.`);
  };

  // Preview handlers
  const handlePreview = (report: AuditReport) => {
    if (report.fileDataUrl && report.fileType) {
      setPreviewContent(report.fileDataUrl);
      setPreviewFileType(report.fileType);
      setShowPreviewModal(true);
    } else {
      alert('No hay previsualización disponible.');
    }
  };

  const closePreviewModal = () => {
    setShowPreviewModal(false);
    setPreviewContent(null);
    setPreviewFileType(null);
  };

  return (
    <div className="module-container">
      <h1 className="module-title">Módulo: Auditoría</h1>
      <p className="module-description">Gestione el ciclo completo de auditorías, desde la planificación y las listas de chequeo hasta el informe final.</p>

      <div className="flex justify-end space-x-4 mb-6">
        <button onClick={() => setShowAddChecklistForm(!showAddChecklistForm)} className="feature-button">
          <FaPlus className="mr-2" /> {showAddChecklistForm ? 'Ocultar Formulario' : 'Nueva Lista de Chequeo'}
        </button>
        <button onClick={() => setShowAddReportForm(!showAddReportForm)} className="feature-button">
          <FaPlus className="mr-2" /> {showAddReportForm ? 'Ocultar Formulario' : 'Subir Informe'}
        </button>
      </div>

      {/* Section for Checklists */}
      {showAddChecklistForm && (
        <div className="form-section mb-8">
          <h2 className="form-title">Crear Nueva Lista de Chequeo</h2>
          <div className="form-group">
            <label htmlFor="checklistName" className="form-label">Nombre de la Nueva Lista</label>
            <input
              type="text"
              id="checklistName"
              className="form-input"
              value={newChecklistName}
              onChange={(e) => setNewChecklistName(e.target.value)}
              placeholder="Ej: Checklist Auditoría Interna ISO 9001"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Ítems de la Lista</label>
            {checklistItems.map((item, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  className="form-input flex-grow"
                  value={item}
                  onChange={(e) => handleItemChange(index, e.target.value)}
                  placeholder={`Ítem #${index + 1}`}
                />
                <button onClick={() => removeItem(index)} className="ml-2 text-red-500">Eliminar</button>
              </div>
            ))}
            <button onClick={addItem} className="feature-button-secondary mt-2">Agregar Ítem</button>
          </div>
          <div className="flex justify-end space-x-4 mt-4">
            <button onClick={() => setShowAddChecklistForm(false)} className="button-secondary">Cancelar</button>
            <button onClick={handleAddChecklist} className="feature-button">Guardar Lista</button>
          </div>
        </div>
      )}

      {/* Section for Audit Reports */}
      {showAddReportForm && (
        <div className="form-section mb-8">
          <h2 className="form-title">Subir Nuevo Informe de Auditoría</h2>
          <div className="form-group">
            <label htmlFor="reportName" className="form-label">Nombre del Informe</label>
            <input
              type="text"
              id="reportName"
              className="form-input"
              value={newReportName}
              onChange={(e) => setNewReportName(e.target.value)}
              placeholder="Ej: Informe Auditoría Interna Q1"
            />
          </div>
          <div className="form-group">
            <label htmlFor="reportFile" className="form-label">Archivo del Informe</label>
            <input type="file" id="reportFile" className="form-input" onChange={handleFileChange} />
          </div>
          <div className="form-group">
            <label htmlFor="associatedChecklist" className="form-label">Lista de Chequeo Asociada (Opcional)</label>
            <select
              id="associatedChecklist"
              className="form-input"
              value={selectedChecklist}
              onChange={(e) => setSelectedChecklist(e.target.value)}
            >
              <option value="">Ninguna</option>
              {checklists.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="flex justify-end space-x-4 mt-4">
            <button onClick={() => setShowAddReportForm(false)} className="button-secondary">Cancelar</button>
            <button onClick={handleAddReport} className="feature-button">Subir Informe</button>
          </div>
        </div>
      )}

      {/* Display Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="form-section">
          <h2 className="form-title">Listas de Chequeo Guardadas</h2>
          {checklists.length === 0 ? <p>No hay listas guardadas.</p> : (
            <div className="space-y-4">
              {checklists.map(c => (
                <div key={c.id} className="p-4 border rounded-lg shadow-md">
                  <h3 className="font-bold text-lg mb-2">{c.name} ({c.items.length} ítems)</h3>
                  <div className="flex justify-end space-x-2">
                    <button onClick={() => handleViewChecklist(c)} className="text-gray-600 hover:text-gray-900">
                      <FaEye /> Ver
                    </button>
                    <button onClick={() => handleEditChecklist(c)} className="text-blue-600 hover:text-blue-800">
                      <FaEdit /> Editar
                    </button>
                    <button onClick={() => handleDeleteChecklist(c.id, c.name)} className="text-red-600 hover:text-red-800">
                      <FaTrash /> Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="form-section">
          <h2 className="form-title">Informes de Auditoría Subidos</h2>
          {reports.length === 0 ? <p>No hay informes subidos.</p> : (
            <div className="space-y-4">
              {reports.map(r => (
                <div key={r.id} className="p-4 border rounded-lg shadow-md">
                  <h3 className="font-bold text-lg mb-2">{r.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">Archivo: {r.fileName}</p>
                  {r.checklistId && (
                    <p className="text-sm text-gray-500">Lista asociada: {checklists.find(cl => cl.id === r.checklistId)?.name || 'Desconocida'}</p>
                  )}
                  <div className="flex justify-end space-x-2 mt-4">
                    <button onClick={() => handlePreview(r)} className="text-gray-600 hover:text-gray-900">
                      <FaEye /> Previsualizar
                    </button>
                    <button onClick={() => handleEditReport(r)} className="text-blue-600 hover:text-blue-800">
                      <FaEdit /> Editar
                    </button>
                    <button onClick={() => handleDeleteReport(r.id, r.name)} className="text-red-600 hover:text-red-800">
                      <FaTrash /> Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-auto relative">
            <button onClick={closePreviewModal} className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl font-bold">&times;</button>
            <h2 className="text-xl font-bold mb-4">Previsualización del Informe</h2>
            <div className="mt-4">
              {previewFileType?.startsWith('image/') && <img src={previewContent || ''} alt="Preview" className="max-w-full h-auto mx-auto" />}
              {previewFileType === 'application/pdf' && <iframe src={previewContent || ''} width="100%" height="500px" style={{ border: 'none' }}></iframe>}
              {previewFileType?.startsWith('text/') && <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-[400px]">{atob(previewContent?.split(',')[1] || '')}</pre>}
              {!previewFileType?.startsWith('image/') && !previewFileType?.startsWith('text/') && previewFileType !== 'application/pdf' && <p>Previsualización no soportada.</p>}
            </div>
          </div>
        </div>
      )}

      {/* Edit Checklist Modal */}
      {isEditChecklistModalOpen && currentChecklist && (
        <EditChecklistModal
          checklist={currentChecklist}
          onSave={handleSaveEditedChecklist}
          onClose={() => setIsEditChecklistModalOpen(false)}
        />
      )}

      {/* View Checklist Modal */}
      {isViewChecklistModalOpen && currentChecklist && (
        <ViewChecklistModal
          checklist={currentChecklist}
          onClose={() => setIsViewChecklistModalOpen(false)}
        />
      )}

      {/* Edit Report Modal */}
      {isEditReportModalOpen && currentReport && (
        <EditReportModal
          report={currentReport}
          checklists={checklists}
          onSave={handleSaveEditedReport}
          onClose={() => setIsEditReportModalOpen(false)}
        />
      )}
    </div>
  );
};

export default AuditoriaPage;