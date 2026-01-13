'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaPlus, FaTrash } from 'react-icons/fa';

import { Node, Edge } from 'reactflow';

// --- Data Structure for a Process ---
export interface Process {
  id: string;
  name: string;
  objective: string;
  scope: string;
  owner: string;
  nodes: Node[];
  edges: Edge[];
}

const ProcesosPage = () => {
  const [processes, setProcesses] = useState<Process[]>([]);
  const storageKey = 'processesData';

  useEffect(() => {
    const storedData = localStorage.getItem(storageKey);
    if (storedData) {
      setProcesses(JSON.parse(storedData));
    }
  }, []);

  const handleDelete = (id: string, name: string) => {
    if (confirm(`¿Está seguro de que desea eliminar el proceso "${name}"? Esta acción no se puede deshacer.`)) {
      const updatedProcesses = processes.filter(process => process.id !== id);
      localStorage.setItem(storageKey, JSON.stringify(updatedProcesses));
      setProcesses(updatedProcesses);
      alert(`El proceso "${name}" ha sido eliminado.`);
    }
  };

  return (
    <div className="module-container">
      <h1 className="module-title">Módulo: Gestión de Procesos</h1>
      <p className="module-description">
        Defina, visualice y gestione los procesos de su organización para estandarizar operaciones y fomentar la mejora continua.
      </p>

      <div className="flex justify-end mb-6">
        <Link href="/gestion/procesos/nuevo" className="feature-button">
          <FaPlus className="mr-2" />
          Crear Nuevo Proceso
        </Link>
      </div>

      <div className="process-list-container">
        <h2 className="text-2xl font-bold mb-4">Procesos Definidos</h2>
        {processes.length > 0 ? (
          <ul className="space-y-4">
            {processes.map(process => (
              <li key={process.id} className="process-list-item">
                <div className="process-info">
                  <h3 className="font-bold text-lg">{process.name}</h3>
                  <p className="text-sm text-gray-600">Responsable: {process.owner}</p>
                </div>
                <div className="process-actions">
                  <Link href={`/gestion/procesos/editar/${process.id}`} className="text-blue-500 hover:underline mr-4">Editar</Link>
                  <button 
                    onClick={() => handleDelete(process.id, process.name)} 
                    className="text-red-500 hover:text-red-700 flex items-center"
                  >
                    <FaTrash className="mr-1" /> Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-gray-500 py-8">
            <p>No hay procesos definidos todavía.</p>
            <p>Haga clic en "Crear Nuevo Proceso" para empezar.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcesosPage;