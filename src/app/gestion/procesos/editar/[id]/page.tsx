'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ProcessForm from '@/components/ProcessForm';
import { Process } from '../../page';

const EditProcessPage = () => {
  const router = useRouter();
  const params = useParams();
  const { id: encodedId } = params;
  const storageKey = 'processesData';

  const [process, setProcess] = useState<Process | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (encodedId) {
      const id = decodeURIComponent(encodedId as string);
      const storedData = localStorage.getItem(storageKey);

      if (storedData) {
        const processes: Process[] = JSON.parse(storedData);
        const processToEdit = processes.find(p => p.id === id);

        if (processToEdit) {
          setProcess(processToEdit);
        } else {
          setNotFound(true);
        }
      } else {
        setNotFound(true);
      }
    }
    setIsLoading(false);
  }, [encodedId]);

  const handleSave = (updatedProcessData: Process) => {
    const id = decodeURIComponent(encodedId as string);
    const storedData = localStorage.getItem(storageKey);
    let processes: Process[] = storedData ? JSON.parse(storedData) : [];
    processes = processes.map(p => (p.id === id ? updatedProcessData : p));
    localStorage.setItem(storageKey, JSON.stringify(processes));

    alert('Proceso actualizado con éxito.');
    router.push('/gestion/procesos');
  };

  if (isLoading) {
    return <div className="text-center p-8">Cargando proceso...</div>;
  }

  if (notFound) {
    return <div className="module-container text-center p-8 text-red-500">Error: Proceso no encontrado.</div>;
  }

  return (
    <div className="module-container">
      <h1 className="module-title">Editar Proceso</h1>
      <p className="module-description">Actualice los detalles de este proceso.</p>
      {process && <ProcessForm process={process} onSave={handleSave} />}
    </div>
  );
};

export default EditProcessPage;
