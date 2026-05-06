
'use client';

import { useState, useEffect } from 'react';

interface Document {
  id: number;
  name: string;
  fileName: string;
  processId?: number; // Optional: Link to a process
  type: 'mantener' | 'conservar' | 'formato';
}

interface Process {
  id: number;
  name: string;
}

const DocumentosAConservarPage = () => {
  const [documentName, setDocumentName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedProcess, setSelectedProcess] = useState<string>('');
  const [documentType, setDocumentType] = useState<'mantener' | 'conservar' | 'formato'>('conservar');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [nextId, setNextId] = useState(1);

  // Load processes from localStorage on component mount
  useEffect(() => {
    const storedProcesses = localStorage.getItem('processes');
    if (storedProcesses) {
      setProcesses(JSON.parse(storedProcesses));
    }
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleUpload = () => {
    if (documentName && selectedFile) {
      const newDocument: Document = {
        id: nextId,
        name: documentName,
        fileName: selectedFile.name,
        processId: selectedProcess ? parseInt(selectedProcess) : undefined,
        type: documentType,
      };
      setDocuments([...documents, newDocument]);
      setNextId(nextId + 1);
      setDocumentName('');
      setSelectedFile(null);
      setSelectedProcess('');
      setDocumentType('conservar'); // Reset to default
      // Clear the file input field
      const fileInput = document.getElementById('documentFile') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      alert(`Documento "${documentName}" (${selectedFile.name}) subido.`);
    } else {
      alert('Por favor, ingrese un nombre y seleccione un archivo.');
    }
  };

  return (
    <div className="module-container">
      <h1 className="module-title">Documentos a Conservar</h1>
      <p className="module-description">Gestione los documentos que deben ser conservados.</p>

      <div className="form-section">
        <h2 className="form-title">Subir Nuevo Documento</h2>
        <div className="form-group">
          <label htmlFor="documentName" className="form-label">Nombre del Documento</label>
          <input
            type="text"
            id="documentName"
            className="form-input"
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
            placeholder="Ej: Acta de Reunión"
          />
        </div>
        <div className="form-group">
          <label htmlFor="documentFile" className="form-label">Archivo a Subir</label>
          <input
            type="file"
            id="documentFile"
            className="form-input"
            onChange={handleFileChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="associatedProcess" className="form-label">Proceso Asociado (Opcional)</label>
          <select
            id="associatedProcess"
            className="form-input"
            value={selectedProcess}
            onChange={(e) => setSelectedProcess(e.target.value)}
          >
            <option value="">Seleccione un proceso</option>
            {processes.map((process) => (
              <option key={process.id} value={process.id}>
                {process.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="documentType" className="form-label">Tipo de Documento</label>
          <select
            id="documentType"
            className="form-input"
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value as 'mantener' | 'conservar' | 'formato')}
          >
            <option value="mantener">Documento a Mantener</option>
            <option value="conservar">Documento a Conservar</option>
            <option value="formato">Formato</option>
          </select>
        </div>
        <button onClick={handleUpload} className="feature-button">Subir Documento</button>
      </div>

      <div className="form-section mt-8">
        <h2 className="form-title">Documentos Conservados</h2>
        {documents.length === 0 ? (
          <p>No hay documentos conservados aún.</p>
        ) : (
          <ul className="list-disc pl-5">
            {documents.map((doc) => (
              <li key={doc.id} className="mb-2">
                <strong>{doc.name}</strong>: {doc.fileName}
                {doc.processId && (
                  <span> (Proceso: {processes.find(p => p.id === doc.processId)?.name || 'Desconocido'})</span>
                )}
                <span> (Tipo: {doc.type})</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DocumentosAConservarPage;
