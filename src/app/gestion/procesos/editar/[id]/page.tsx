'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ProcessForm from '@/components/ProcessForm';
import { Process } from '@/components/ProcessGeneratorModal';
import axios from 'axios';
import { toast } from 'sonner';

const EditProcessPage = () => {
  const router = useRouter();
  const params = useParams();
  const { id: encodedId } = params;

  const [process, setProcess] = useState<Process | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchProcess = async () => {
      if (!encodedId) return;
      
      const id = decodeURIComponent(encodedId as string);
      
      try {
        // Try fetching from API first
        const res = await axios.get('/api/gestion/procesos');
        const processes: Process[] = res.data || [];
        
        // Also check local storage for legacy/offline support
        const localData = localStorage.getItem('processes');
        const localProcesses: Process[] = localData ? JSON.parse(localData) : [];
        
        const allProcesses = [...processes, ...localProcesses.filter(lp => !processes.find(p => p.id === lp.id))];
        
        const found = allProcesses.find(p => p.id === id);
        
        if (found) {
          setProcess(found);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error(error);
        toast.error('Error cargando proceso');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProcess();
  }, [encodedId]);

  const handleSave = async (updatedProcessData: Process) => {
    try {
      // Optimistic update for local
      const localData = localStorage.getItem('processes');
      if (localData) {
        let localProcesses: Process[] = JSON.parse(localData);
        // If it exists locally, update it
        if (localProcesses.find(p => p.id === updatedProcessData.id)) {
            localProcesses = localProcesses.map(p => (p.id === updatedProcessData.id ? updatedProcessData : p));
            localStorage.setItem('processes', JSON.stringify(localProcesses));
        }
      }

      // API Update (We'll assume POST/PUT to the bulk endpoint or create a specific one, 
      // for now re-sending the whole list or just relying on the list endpoint might be tricky without a specific PUT endpoint.
      // But the user asked to "modelar", so let's assume we save to API via the list for now or add a PUT endpoint later.
      // Actually, the current API route only supports GET and POST (add). 
      // To update, we usually need a specific endpoint. 
      // I'll send it to POST for now which might duplicate or I need to fix the API to handle updates.
      // Let's rely on the fact that we are "overhauling".
      // I will implement a PUT in the API route.
      
      await axios.put('/api/gestion/procesos', updatedProcessData);
      
      toast.success('Proceso actualizado con éxito.');
      router.push('/gestion/procesos');
    } catch (error) {
      toast.error('Error guardando cambios');
    }
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
      <p className="module-description">Actualice los detalles y genere el contenido con IA.</p>
      {process && <ProcessForm process={process} onSave={handleSave} />}
    </div>
  );
};

export default EditProcessPage;
