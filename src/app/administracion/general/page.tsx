'use client';

import { useState, useEffect } from 'react';

interface CompanyInfo {
  name: string;
  summary: string;
  logoUrl: string; // Will store data URL
  razonSocial: string;
  nit: string;
  direccion: string;
  telefono: string;
  email: string;
  website: string;
  actividadComercial: string;
}

const GeneralPage = () => {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: '',
    summary: '',
    logoUrl: '/logo.png', // Default logo
    razonSocial: '',
    nit: '',
    direccion: '',
    telefono: '',
    email: '',
    website: '',
    actividadComercial: '',
  });

  const storageKey = 'companyGeneralInfo';

  useEffect(() => {
    const storedData = localStorage.getItem(storageKey);
    if (storedData) {
      setCompanyInfo(JSON.parse(storedData));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCompanyInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setCompanyInfo(prev => ({ ...prev, logoUrl: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    localStorage.setItem(storageKey, JSON.stringify(companyInfo));
    alert('Información de la empresa guardada con éxito.');
  };

  return (
    <div className="module-container">
      <div className="module-content-card">
        <h1 className="module-title">Administración General</h1>
        <p className="module-description">Configure la información básica y la identidad de su empresa.</p>

        <div className="form-grid">
          {/* Sección de Información General */}
          <div className="form-section-card full-width">
            <h2 className="form-section-title">Datos Generales de la Empresa</h2>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name" className="form-label">Nombre Comercial</label>
                <input type="text" id="name" name="name" value={companyInfo.name} onChange={handleChange} className="form-input" placeholder="Nombre público de la empresa" />
              </div>
              <div className="form-group">
                <label htmlFor="razonSocial" className="form-label">Razón Social</label>
                <input type="text" id="razonSocial" name="razonSocial" value={companyInfo.razonSocial} onChange={handleChange} className="form-input" />
              </div>
              <div className="form-group">
                <label htmlFor="nit" className="form-label">NIT</label>
                <input type="text" id="nit" name="nit" value={companyInfo.nit} onChange={handleChange} className="form-input" />
              </div>
              <div className="form-group">
                <label htmlFor="actividadComercial" className="form-label">Actividad Comercial</label>
                <textarea id="actividadComercial" name="actividadComercial" value={companyInfo.actividadComercial} onChange={handleChange} className="form-textarea" />
              </div>
            </div>
          </div>

          {/* Sección de Contacto */}
          <div className="form-section-card">
            <h2 className="form-section-title">Información de Contacto</h2>
            <div className="form-group">
              <label htmlFor="direccion" className="form-label">Dirección</label>
              <input type="text" id="direccion" name="direccion" value={companyInfo.direccion} onChange={handleChange} className="form-input" />
            </div>
            <div className="form-group">
              <label htmlFor="telefono" className="form-label">Teléfono</label>
              <input type="text" id="telefono" name="telefono" value={companyInfo.telefono} onChange={handleChange} className="form-input" />
            </div>
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input type="email" id="email" name="email" value={companyInfo.email} onChange={handleChange} className="form-input" />
            </div>
            <div className="form-group">
              <label htmlFor="website" className="form-label">Sitio Web</label>
              <input type="text" id="website" name="website" value={companyInfo.website} onChange={handleChange} className="form-input" placeholder="www.ejemplo.com" />
            </div>
          </div>

          {/* Sección de Logo y Resumen */}
          <div className="form-section-card">
            <h2 className="form-section-title">Identidad y Resumen</h2>
            <div className="form-group">
              <label htmlFor="logo" className="form-label">Logo de la Empresa</label>
              <input type="file" id="logo" name="logo" accept="image/*" onChange={handleFileChange} className="form-input" />
              {companyInfo.logoUrl && (
                <div className="logo-preview-container">
                  <img src={companyInfo.logoUrl} alt="Logo Preview" className="logo-preview-image" />
                  <span className="logo-preview-text">Previsualización del logo</span>
                </div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="summary" className="form-label">Resumen de la Empresa</label>
              <textarea id="summary" name="summary" value={companyInfo.summary} onChange={handleChange} className="form-textarea" placeholder="Un breve resumen sobre la empresa" />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button onClick={handleSave} className="feature-button">Guardar Cambios</button>
        </div>
      </div>
    </div>
  );
};

export default GeneralPage;