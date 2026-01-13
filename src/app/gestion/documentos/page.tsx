'use client';

import { useState, useEffect } from 'react';
import { FaFilePdf, FaFileWord, FaFileExcel, FaFileImage, FaFileAlt, FaPlus, FaTrash, FaEdit, FaEye } from 'react-icons/fa';

// Interfaces
interface Document {
  id: number;
  name: string;
  fileName: string;
  type: 'A Mantener' | 'A Conservar' | 'Formato';
  relatedModule: string;
  fileDataUrl: string;
  fileType: string;
}

// Add/Edit Document Modal
const DocumentModal = ({ onSave, onClose, document }: { onSave: (doc: Omit<Document, 'id'>, file: File) => void; onClose: () => void; document?: Document }) => {
  const [name, setName] = useState(document?.name || '');
  const [type, setType] = useState<Document['type']>(document?.type || 'A Mantener');
  const [relatedModule, setRelatedModule] = useState(document?.relatedModule || 'General');
  const [file, setFile] = useState<File | null>(null);

  const modules = ['General', 'Planeación Estratégica', 'Procesos', 'Indicadores', 'Riesgos', 'Auditoría', 'Mejora Continua'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || (!file && !document)) {
      alert('Por favor, complete todos los campos y seleccione un archivo.');
      return;
    }
    onSave({ name, type, relatedModule, fileName: file?.name || document!.fileName, fileDataUrl: '', fileType: '' }, file!); // Pass file back to parent
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">{document ? 'Editar' : 'Nuevo'} Documento</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nombre del Documento</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-input" />
          </div>
          <div className="form-group">
            <label className="form-label">Tipo</label>
            <select value={type} onChange={(e) => setType(e.target.value as any)} className="form-input">
              <option value="A Mantener">A Mantener</option>
              <option value="A Conservar">A Conservar</option>
              <option value="Formato">Formato</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Módulo Relacionado</label>
            <select value={relatedModule} onChange={(e) => setRelatedModule(e.target.value)} className="form-input">
              {modules.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Archivo</label>
            <input type="file" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} className="form-input" />
            {document && <p className="text-sm text-gray-500 mt-1">Archivo actual: {document.fileName}</p>}
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button type="button" onClick={onClose} className="button-secondary">Cancelar</button>
            <button type="submit" className="feature-button">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DocumentosPage = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | undefined>(undefined);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('Todos');
  const [moduleFilter, setModuleFilter] = useState('Todos');

  const storageKey = 'unifiedDocuments';

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      setDocuments(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    let result = documents;
    if (searchTerm) {
      result = result.filter(doc => doc.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (typeFilter !== 'Todos') {
      result = result.filter(doc => doc.type === typeFilter);
    }
    if (moduleFilter !== 'Todos') {
      result = result.filter(doc => doc.relatedModule === moduleFilter);
    }
    setFilteredDocuments(result);
  }, [documents, searchTerm, typeFilter, moduleFilter]);

  const handleSave = (docData: Omit<Document, 'id'>, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const fileDataUrl = e.target?.result as string;
      let updatedDocuments;

      if (editingDocument) {
        updatedDocuments = documents.map(d => d.id === editingDocument.id ? { ...editingDocument, ...docData, fileDataUrl, fileType: file.type, fileName: file.name } : d);
      } else {
        const nextId = (documents.reduce((max, d) => (d.id > max ? d.id : max), 0) || 0) + 1;
        const newDocument: Document = { ...docData, id: nextId, fileDataUrl, fileType: file.type, fileName: file.name };
        updatedDocuments = [...documents, newDocument];
      }
      
      setDocuments(updatedDocuments);
      localStorage.setItem(storageKey, JSON.stringify(updatedDocuments));
      setIsModalOpen(false);
      setEditingDocument(undefined);
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Está seguro de eliminar este documento?')) {
      const updated = documents.filter(d => d.id !== id);
      setDocuments(updated);
      localStorage.setItem(storageKey, JSON.stringify(updated));
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FaFilePdf className="text-red-500" />;
    if (fileType.includes('word')) return <FaFileWord className="text-blue-500" />;
    if (fileType.includes('excel')) return <FaFileExcel className="text-green-500" />;
    if (fileType.startsWith('image')) return <FaFileImage className="text-purple-500" />;
    return <FaFileAlt className="text-gray-500" />;
  };

  return (
    <div className="module-container">
      <h1 className="module-title">Gestión Documental</h1>
      <p className="module-description">Repositorio central para todos los documentos de la organización.</p>

      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <input type="text" placeholder="Buscar por nombre..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="form-input" />
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="form-input">
            <option value="Todos">Todos los Tipos</option>
            <option value="A Mantener">A Mantener</option>
            <option value="A Conservar">A Conservar</option>
            <option value="Formato">Formato</option>
          </select>
          <select value={moduleFilter} onChange={e => setModuleFilter(e.target.value)} className="form-input">
            <option value="Todos">Todos los Módulos</option>
            <option value="General">General</option>
            <option value="Planeación Estratégica">Planeación Estratégica</option>
            <option value="Procesos">Procesos</option>
            <option value="Indicadores">Indicadores</option>
            <option value="Riesgos">Riesgos</option>
            <option value="Auditoría">Auditoría</option>
            <option value="Mejora Continua">Mejora Continua</option>
          </select>
        </div>
        <button onClick={() => { setEditingDocument(undefined); setIsModalOpen(true); }} className="feature-button">
          <FaPlus className="mr-2" /> Subir Documento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredDocuments.map(doc => (
          <div key={doc.id} className="p-4 border rounded-lg shadow-md bg-white">
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-3">{getFileIcon(doc.fileType)}</span>
              <h3 className="font-bold text-lg truncate">{doc.name}</h3>
            </div>
            <p className="text-sm text-gray-600"><strong>Tipo:</strong> {doc.type}</p>
            <p className="text-sm text-gray-600"><strong>Módulo:</strong> {doc.relatedModule}</p>
            <p className="text-sm text-gray-500 truncate"><strong>Archivo:</strong> {doc.fileName}</p>
            <div className="flex justify-end space-x-2 mt-4">
              <a href={doc.fileDataUrl} download={doc.fileName} className="text-blue-600 hover:text-blue-800"><FaEye /> Ver</a>
              <button onClick={() => { setEditingDocument(doc); setIsModalOpen(true); }} className="text-green-600 hover:text-green-800"><FaEdit /> Editar</button>
              <button onClick={() => handleDelete(doc.id)} className="text-red-600 hover:text-red-800"><FaTrash /> Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && <DocumentModal onSave={handleSave} onClose={() => setIsModalOpen(false)} document={editingDocument} />}
    </div>
  );
};

export default DocumentosPage;
