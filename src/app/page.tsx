
'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import CompanySummary from '@/components/CompanySummary';
import About from '@/components/About';
import Dashboard from '@/components/Dashboard'; // Import the new Dashboard
import companyData from '@/data/company.json'; // Fallback data

import Certifications from '@/components/Certifications';
import Portfolio from '@/components/Portfolio';

// Interfaces
interface CompanyInfo {
  name: string;
  summary: string;
  logoUrl: string;
  razonSocial: string;
  nit: string;
  direccion: string;
  telefono: string;
  email: string;
  website: string;
  actividadComercial: string;
}

interface StrategicItem {
  id: number;
  text: string;
}

interface StrategicData {
  mission: string;
  vision: string;
  policies: StrategicItem[];
  objectives: StrategicItem[];
}

export default function Home() {
  const [info, setInfo] = useState<CompanyInfo>({
    name: companyData.name,
    summary: companyData.summary,
    logoUrl: companyData.logoUrl,
    razonSocial: companyData.companyInfo.razonSocial,
    nit: companyData.companyInfo.nit,
    direccion: companyData.companyInfo.direccion,
    telefono: companyData.companyInfo.telefono,
    email: companyData.companyInfo.email,
    website: companyData.companyInfo.website,
    actividadComercial: companyData.companyInfo.actividadComercial,
  });
  const [strategic, setStrategic] = useState<StrategicData>({ 
    mission: companyData.mission, 
    vision: companyData.vision,
    policies: [],
    objectives: [],
  });

  useEffect(() => {
    const generalInfo = localStorage.getItem('companyGeneralInfo');
    if (generalInfo) {
      setInfo(JSON.parse(generalInfo));
    }

    const strategicData = localStorage.getItem('strategicPlanningData');
    if (strategicData) {
      setStrategic(JSON.parse(strategicData));
    }
  }, []);

  return (
    <div className="company-profile-card">
      <Header name={info.name} />
      <div className="company-profile-content">
        <CompanySummary {...info} />
        
        <About 
          mission={strategic.mission} 
          vision={strategic.vision} 
          policies={strategic.policies} 
          objectives={strategic.objectives} 
        />

        <Certifications certifications={companyData.certifications} />
        <Portfolio portfolio={companyData.portfolio} />

        <Dashboard />
      </div>
    </div>
  );
}
