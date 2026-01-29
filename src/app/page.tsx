'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '@/components/Header';
import CompanySummary from '@/components/CompanySummary';
import About from '@/components/About';
import companyData from '@/data/company.json'; // Base data
import Certifications from '@/components/Certifications';
import Portfolio from '@/components/Portfolio';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  const [info, setInfo] = useState<any>(null);
  const [strategic, setStrategic] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [adminRes, gestionRes] = await Promise.all([
        axios.get('/api/admin/general'),
        axios.get('/api/gestion/planeacion')
      ]);

      setInfo(adminRes.data);
      setStrategic(gestionRes.data);
    } catch (error) {
      console.error("Error fetching corporate profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 bg-blue-600 rounded-xl mb-4"></div>
        <p className="text-slate-400 font-bold tracking-widest text-sm">CARGANDO PERFIL LIDUS...</p>
      </div>
    </div>
  );

  // Adaptación de datos
  const displayInfo = {
    name: info?.nombreEmpresa || companyData.name,
    summary: strategic?.mision || companyData.summary, // Usamos Misión como resumen inicial si existe
    logoUrl: companyData.logoUrl,
    razonSocial: info?.nombreEmpresa || companyData.companyInfo.razonSocial,
    nit: info?.nit || companyData.companyInfo.nit,
    direccion: info?.direccion || companyData.companyInfo.direccion,
    telefono: info?.telefono || companyData.companyInfo.telefono,
    email: info?.email || companyData.email,
    website: info?.sitioWeb || companyData.companyInfo.website,
    actividadComercial: companyData.companyInfo.actividadComercial,
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        <Header name={displayInfo.name} logoUrl={info?.logoUrl} />
        
        <CompanySummary {...displayInfo} />
        
        <About 
          mission={strategic?.mision || companyData.mission} 
          vision={strategic?.vision || companyData.vision} 
          policies={strategic?.politicas || []} // Nota: Verifica si en JSON es 'policies' o 'politicas'
          objectives={strategic?.objetivos || []}
          // FODA Data
          strengths={strategic?.strengths}
          weaknesses={strategic?.weaknesses}
          opportunities={strategic?.opportunities}
          threats={strategic?.threats}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <Certifications certifications={companyData.certifications} />
           <Portfolio portfolio={companyData.portfolio} />
        </div>

        <Dashboard />

      </div>
    </div>
  );
}
