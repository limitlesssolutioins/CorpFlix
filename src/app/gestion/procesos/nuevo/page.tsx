'use client';

import { useRouter } from 'next/navigation';
import ProcessForm from '@/components/ProcessForm';
import { Process } from '@/components/ProcessGeneratorModal';

const NewProcessPage = () => {
  const router = useRouter();
  const storageKey = 'processesData';

  const handleSave = (newProcessData: Omit<Process, 'id'>) => {
    const newProcess: Process = {
      ...newProcessData,
      id: new Date().toISOString(), // Simple unique ID
    };

    const storedData = localStorage.getItem(storageKey);
    const processes = storedData ? JSON.parse(storedData) : [];
    processes.push(newProcess);
    localStorage.setItem(storageKey, JSON.stringify(processes));

    alert('Proceso creado con éxito.');
    router.push('/gestion/procesos');
  };

  return (
    <div className="module-container">
      <h1 className="module-title">Crear Nuevo Proceso</h1>
      <p className="module-description">Complete los siguientes campos para caracterizar el nuevo proceso.</p>
      <ProcessForm onSave={handleSave} />
    </div>
  );
};

export default NewProcessPage;
