'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import {
  FaBuilding,
  FaIdCard,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaSave,
  FaSpinner,
  FaCheckCircle,
  FaNetworkWired,
  FaImage,
  FaUpload,
  FaChevronDown,
  FaShieldAlt,
  FaFilePdf,
  FaExternalLinkAlt
} from 'react-icons/fa';

const CIUDADES_COLOMBIA = [
  'Bogotá D.C.', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Bucaramanga',
  'Cúcuta', 'Pereira', 'Ibagué', 'Santa Marta', 'Manizales', 'Bello', 'Pasto',
  'Villavicencio', 'Montería', 'Valledupar', 'Armenia', 'Buenaventura', 'Floridablanca',
  'Soacha', 'Itagüí', 'Soledad', 'Palmira', 'Neiva', 'Popayán', 'Barrancabermeja',
  'Sincelejo', 'Riohacha', 'Tunja', 'Dosquebradas', 'Envigado', 'Duitama',
  'Sogamoso', 'Quibdó', 'Florencia', 'Girón', 'Yopal', 'Apartadó', 'Turbo',
  'Maicao', 'Ipiales', 'Tumaco', 'Leticia', 'Arauca', 'Puerto Asís', 'Mocoa',
  'Mitú', 'Inírida', 'Puerto Carreño', 'San José del Guaviare',
];

interface CertificationItem {
  name: string;
  logoUrl: string;
  pdfUrl?: string;
}

interface PortfolioItem {
  title: string;
  description: string;
  imageUrl: string;
  pdfUrl?: string;
}

export default function AdminGeneralPage() {
  const [settings, setSettings] = useState({
    nombreEmpresa: '',
    nit: '',
    sectorActividad: '',
    resumenEjecutivo: '',
    direccion: '',
    ciudad: '',
    telefono: '',
    email: '',
    sitioWeb: '',
    logoUrl: '',
    certificaciones: [] as CertificationItem[],
    portafolio: [] as PortfolioItem[]
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState<string | null>(null);
  const [logoTimestamp, setLogoTimestamp] = useState(Date.now());
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Data policy state
  const [policy, setPolicy] = useState({ pdfUrl: '', textContent: '', version: '1', updatedAt: '' });
  const [savingPolicy, setSavingPolicy] = useState(false);
  const [uploadingPolicyPdf, setUploadingPolicyPdf] = useState(false);

  useEffect(() => {
    fetchSettings();
    fetchPolicy();
  }, []);

  const fetchPolicy = async () => {
    try {
      const res = await axios.get('/api/platform/data-policy');
      setPolicy(res.data);
    } catch { /* ignore */ }
  };

  const handleSavePolicy = async () => {
    setSavingPolicy(true);
    try {
      const res = await axios.post('/api/platform/data-policy', {
        pdfUrl: policy.pdfUrl,
        textContent: policy.textContent,
      });
      setPolicy(res.data);
      toast.success('Política de datos guardada correctamente');
    } catch {
      toast.error('Error al guardar la política');
    } finally {
      setSavingPolicy(false);
    }
  };

  const handlePolicyPdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploadingPolicyPdf(true);
    try {
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      const res = await axios.post('/api/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setPolicy(prev => ({ ...prev, pdfUrl: res.data.url }));
      toast.success('PDF subido correctamente');
    } catch {
      toast.error('Error al subir el PDF');
    } finally {
      setUploadingPolicyPdf(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await axios.get('/api/admin/general');
      const incoming = res.data || {};
      setSettings(prev => ({
        ...prev,
        ...incoming,
        certificaciones: Array.isArray(incoming.certificaciones) ? incoming.certificaciones : prev.certificaciones,
        portafolio: Array.isArray(incoming.portafolio) ? incoming.portafolio : prev.portafolio
      }));
    } catch (error) {
      toast.error('Error al cargar configuración');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const res = await axios.post('/api/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const nextSettings = { ...settings, logoUrl: res.data.url as string };
      setSettings(nextSettings);
      setLogoTimestamp(Date.now());
      await axios.post('/api/admin/general', nextSettings);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      toast.success('Logo subido correctamente');
    } catch (error) {
      console.error(error);
      toast.error('Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const handlePdfUpload = async (file: File, type: 'cert' | 'port', index: number) => {
    const key = `${type}-${index}`;
    setUploadingPdf(key);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await axios.post('/api/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const pdfUrl = res.data.url as string;
      if (type === 'cert') {
        setSettings(prev => {
          const next = [...prev.certificaciones];
          next[index] = { ...next[index], pdfUrl };
          return { ...prev, certificaciones: next };
        });
      } else {
        setSettings(prev => {
          const next = [...prev.portafolio];
          next[index] = { ...next[index], pdfUrl };
          return { ...prev, portafolio: next };
        });
      }
      toast.success('PDF subido correctamente');
    } catch {
      toast.error('Error al subir el PDF');
    } finally {
      setUploadingPdf(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      const payload = {
        ...settings,
        certificaciones: settings.certificaciones.filter((cert) => cert.name.trim() || cert.logoUrl.trim()),
        portafolio: settings.portafolio.filter((item) => item.title.trim() || item.description.trim() || item.imageUrl.trim())
      };
      await axios.post('/api/admin/general', payload);
      setSettings(payload);
      toast.success('Configuración guardada exitosamente', {
        description: 'El perfil corporativo ha sido actualizado.'
      });
    } catch (error) {
      toast.error('Error al guardar cambios');
    } finally {
      setSaving(false);
    }
  };

  const updateCertification = (index: number, field: keyof CertificationItem, value: string) => {
    setSettings(prev => {
      const next = [...prev.certificaciones];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, certificaciones: next };
    });
  };

  const addCertification = () => {
    setSettings(prev => ({
      ...prev,
      certificaciones: [...prev.certificaciones, { name: '', logoUrl: '' }]
    }));
  };

  const removeCertification = (index: number) => {
    setSettings(prev => ({
      ...prev,
      certificaciones: prev.certificaciones.filter((_, i) => i !== index)
    }));
  };

  const updatePortfolio = (index: number, field: keyof PortfolioItem, value: string) => {
    setSettings(prev => {
      const next = [...prev.portafolio];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, portafolio: next };
    });
  };

  const addPortfolio = () => {
    setSettings(prev => ({
      ...prev,
      portafolio: [...prev.portafolio, { title: '', description: '', imageUrl: '' }]
    }));
  };

  const removePortfolio = (index: number) => {
    setSettings(prev => ({
      ...prev,
      portafolio: prev.portafolio.filter((_, i) => i !== index)
    }));
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-slate-400">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
        <p className="font-medium animate-pulse">Cargando identidad corporativa...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 text-white p-12 shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <FaBuilding className="text-9xl transform rotate-12" />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-widest mb-4 border border-blue-500/30">
            <FaNetworkWired size={12} />
            Administración Central
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Identidad Corporativa
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl font-medium leading-relaxed">
            Gestione la información pública de su organización, incluyendo el logotipo oficial que aparecerá en toda la plataforma.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna Izquierda: Datos Principales */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Tarjeta: Logo e Identidad Visual */}
          <div className="bg-white p-8 rounded-[2rem] shadow-lg shadow-slate-200/50 border border-slate-100 relative group overflow-hidden transition-all hover:shadow-xl">
             <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 transform origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />
             
             <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
               <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                 <FaImage size={20} />
               </div>
               Logotipo Oficial
             </h2>

             <div className="flex items-center gap-8">
                {/* Preview Area */}
                <div className="w-40 h-40 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center relative overflow-hidden group/image">
                  {settings.logoUrl ? (
                    <img
                      key={logoTimestamp}
                      src={`${settings.logoUrl}?t=${logoTimestamp}`}
                      alt="Logo Preview"
                      className="w-full h-full object-contain p-2"
                      onError={(e) => { (e.target as HTMLImageElement).src = ''; }}
                    />
                  ) : (
                    <FaImage className="text-slate-300 text-3xl" />
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                      <FaSpinner className="animate-spin text-indigo-600" />
                    </div>
                  )}
                </div>

                {/* Upload Actions */}
                <div className="flex-1">
                  <p className="text-sm text-slate-500 font-medium mb-4">
                    Suba una imagen en formato PNG o JPG. Se recomienda un tamaño mínimo de 200x200 px con fondo transparente.
                  </p>
                  <input 
                    type="file" 
                    accept="image/*" 
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <button 
                    type="button"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3 bg-indigo-50 text-indigo-700 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-100 transition-colors"
                  >
                    <FaUpload />
                    {settings.logoUrl ? 'Cambiar Logo' : 'Subir Imagen'}
                  </button>
                </div>
             </div>
          </div>

          {/* Tarjeta: Resumen Ejecutivo */}
          <div className="bg-white p-8 rounded-[2rem] shadow-lg shadow-slate-200/50 border border-slate-100 relative group overflow-hidden transition-all hover:shadow-xl">
            <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500 transform origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />

            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <div className="p-3 bg-cyan-50 text-cyan-600 rounded-xl">
                <FaBuilding size={20} />
              </div>
              Resumen Ejecutivo del Perfil
            </h2>

            <textarea
              className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-medium text-slate-700 outline-none focus:bg-white focus:border-cyan-500 transition-all placeholder:text-slate-300 shadow-sm"
              placeholder="Escribe aqui el resumen ejecutivo que se mostrara en el perfil corporativo..."
              rows={5}
              value={settings.resumenEjecutivo}
              onChange={e => setSettings({ ...settings, resumenEjecutivo: e.target.value })}
            />
            <p className="text-xs text-slate-400 mt-3">
              Este texto es independiente de la mision y la vision de Planeacion Estrategica.
            </p>
          </div>

          {/* Tarjeta: Certificaciones */}
          <div className="bg-white p-8 rounded-[2rem] shadow-lg shadow-slate-200/50 border border-slate-100 relative group overflow-hidden transition-all hover:shadow-xl">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 transform origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />

            <div className="flex items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                  <FaCheckCircle size={20} />
                </div>
                Certificaciones
              </h2>
              <button
                type="button"
                onClick={addCertification}
                className="px-4 py-2 rounded-xl bg-amber-50 text-amber-700 font-bold hover:bg-amber-100 transition-colors"
              >
                Agregar
              </button>
            </div>

            <div className="space-y-4">
              {settings.certificaciones.length === 0 && (
                <p className="text-sm text-slate-400">No hay certificaciones agregadas.</p>
              )}
              {settings.certificaciones.map((cert, index) => (
                <div key={`cert-${index}`} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    <input
                      type="text"
                      placeholder="Nombre (ej. ISO 9001)"
                      value={cert.name}
                      onChange={e => updateCertification(index, 'name', e.target.value)}
                      className="md:col-span-5 px-4 py-3 rounded-xl border border-slate-300 bg-white outline-none focus:border-amber-500"
                    />
                    <input
                      type="text"
                      placeholder="URL logo (ej. /uploads/logo.png)"
                      value={cert.logoUrl}
                      onChange={e => updateCertification(index, 'logoUrl', e.target.value)}
                      className="md:col-span-6 px-4 py-3 rounded-xl border border-slate-300 bg-white outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeCertification(index)}
                      className="md:col-span-1 px-3 py-3 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors"
                    >
                      X
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-xl font-bold text-xs cursor-pointer hover:bg-amber-100 transition-colors">
                      <FaUpload size={11} />
                      {uploadingPdf === `cert-${index}` ? 'Subiendo...' : cert.pdfUrl ? 'Cambiar PDF' : 'Subir PDF'}
                      <input
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        disabled={uploadingPdf === `cert-${index}`}
                        onChange={e => e.target.files?.[0] && handlePdfUpload(e.target.files[0], 'cert', index)}
                      />
                    </label>
                    {cert.pdfUrl && (
                      <a href={cert.pdfUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1">
                        Ver PDF
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tarjeta: Tratamiento de Datos Personales */}
          <div className="bg-white p-8 rounded-[2rem] shadow-lg shadow-slate-200/50 border border-slate-100 relative group overflow-hidden transition-all hover:shadow-xl">
            <div className="absolute top-0 left-0 w-1 h-full bg-violet-500 transform origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />

            <h2 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-3">
              <div className="p-3 bg-violet-50 text-violet-600 rounded-xl">
                <FaShieldAlt size={20} />
              </div>
              Tratamiento de Datos Personales
            </h2>
            <p className="text-xs text-slate-400 font-medium mb-6 ml-14">
              Esta política se mostrará a los usuarios antes de iniciar sesión. Versión actual: <span className="font-black text-violet-600">v{policy.version}</span>
              {policy.updatedAt && <> · Actualizada: {new Date(policy.updatedAt).toLocaleDateString('es-CO')}</>}
            </p>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Contenido de la Política
                </label>
                <textarea
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-medium text-slate-700 outline-none focus:bg-white focus:border-violet-500 transition-all placeholder:text-slate-300 shadow-sm text-sm"
                  placeholder="Escribe aquí la política de tratamiento de datos personales y seguridad de la información que los usuarios deberán aceptar antes de ingresar..."
                  rows={8}
                  value={policy.textContent}
                  onChange={e => setPolicy(prev => ({ ...prev, textContent: e.target.value }))}
                />
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                <label className="flex items-center gap-2 px-4 py-2.5 bg-violet-50 text-violet-700 rounded-xl font-bold text-sm cursor-pointer hover:bg-violet-100 transition-colors">
                  <FaFilePdf />
                  {uploadingPolicyPdf ? 'Subiendo...' : policy.pdfUrl ? 'Cambiar PDF' : 'Subir PDF de la Política'}
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    disabled={uploadingPolicyPdf}
                    onChange={handlePolicyPdfUpload}
                  />
                </label>
                {policy.pdfUrl && (
                  <a
                    href={policy.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 font-bold hover:underline"
                  >
                    <FaExternalLinkAlt size={12} /> Ver PDF actual
                  </a>
                )}
              </div>

              <button
                type="button"
                onClick={handleSavePolicy}
                disabled={savingPolicy}
                className="flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 disabled:opacity-50 transition-all shadow-md"
              >
                {savingPolicy ? <FaSpinner className="animate-spin" /> : <FaSave />}
                {savingPolicy ? 'Guardando...' : 'Guardar Política'}
              </button>
            </div>
          </div>

          {/* Tarjeta: Portafolio de Servicios */}
          <div className="bg-white p-8 rounded-[2rem] shadow-lg shadow-slate-200/50 border border-slate-100 relative group overflow-hidden transition-all hover:shadow-xl">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 transform origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />

            <div className="flex items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <FaGlobe size={20} />
                </div>
                Portafolio de Servicios
              </h2>
              <button
                type="button"
                onClick={addPortfolio}
                className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 font-bold hover:bg-emerald-100 transition-colors"
              >
                Agregar
              </button>
            </div>

            <div className="space-y-4">
              {settings.portafolio.length === 0 && (
                <p className="text-sm text-slate-400">No hay servicios agregados.</p>
              )}
              {settings.portafolio.map((item, index) => (
                <div key={`port-${index}`} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    <input
                      type="text"
                      placeholder="Título del servicio"
                      value={item.title}
                      onChange={e => updatePortfolio(index, 'title', e.target.value)}
                      className="md:col-span-5 px-4 py-3 rounded-xl border border-slate-300 bg-white outline-none focus:border-emerald-500"
                    />
                    <input
                      type="text"
                      placeholder="URL imagen (opcional)"
                      value={item.imageUrl}
                      onChange={e => updatePortfolio(index, 'imageUrl', e.target.value)}
                      className="md:col-span-6 px-4 py-3 rounded-xl border border-slate-300 bg-white outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => removePortfolio(index)}
                      className="md:col-span-1 px-3 py-3 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors"
                    >
                      X
                    </button>
                  </div>
                  <textarea
                    placeholder="Descripción del servicio"
                    value={item.description}
                    onChange={e => updatePortfolio(index, 'description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white outline-none focus:border-emerald-500"
                  />
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl font-bold text-xs cursor-pointer hover:bg-emerald-100 transition-colors">
                      <FaUpload size={11} />
                      {uploadingPdf === `port-${index}` ? 'Subiendo...' : item.pdfUrl ? 'Cambiar PDF' : 'Subir PDF'}
                      <input
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        disabled={uploadingPdf === `port-${index}`}
                        onChange={e => e.target.files?.[0] && handlePdfUpload(e.target.files[0], 'port', index)}
                      />
                    </label>
                    {item.pdfUrl && (
                      <a href={item.pdfUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-600 font-bold hover:underline">
                        Ver PDF
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Tarjeta: Información Legal */}
          <div className="bg-white p-8 rounded-[2rem] shadow-lg shadow-slate-200/50 border border-slate-100 relative group overflow-hidden transition-all hover:shadow-xl">
             <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 transform origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />
             
             <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
               <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                 <FaIdCard size={20} />
               </div>
               Registro Legal
             </h2>

             <div className="space-y-6">
               <div className="group/input">
                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1 group-focus-within/input:text-blue-600 transition-colors">
                   Razón Social / Nombre
                 </label>
                 <div className="relative">
                   <FaBuilding className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-blue-500 transition-colors" />
                   <input 
                      type="text"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-500 transition-all placeholder:text-slate-300 shadow-sm"
                      placeholder="Ej. LIDUS S.A.S."
                      value={settings.nombreEmpresa}
                      onChange={e => setSettings({...settings, nombreEmpresa: e.target.value})}
                   />
                 </div>
               </div>

               <div className="group/input">
                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1 group-focus-within/input:text-blue-600 transition-colors">
                   NIT / Identificación Tributaria
                 </label>
                 <div className="relative">
                   <FaIdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-blue-500 transition-colors" />
                   <input 
                      type="text"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-500 transition-all placeholder:text-slate-300 shadow-sm"
                      placeholder="Ej. 900.123.456-7"
                      value={settings.nit}
                      onChange={e => setSettings({...settings, nit: e.target.value})}
                   />
                 </div>
               </div>

               <div className="group/input">
                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1 group-focus-within/input:text-blue-600 transition-colors">
                   Sector / Actividad Económica
                 </label>
                 <div className="relative">
                   <FaBuilding className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-blue-500 transition-colors" />
                   <textarea 
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-500 transition-all placeholder:text-slate-300 shadow-sm"
                      placeholder="Ej. Desarrollo de software a medida y consultoría tecnológica"
                      rows={2}
                      value={settings.sectorActividad}
                      onChange={e => setSettings({...settings, sectorActividad: e.target.value})}
                   />
                 </div>
               </div>
             </div>
          </div>

          {/* Tarjeta: Ubicación */}
          <div className="bg-white p-8 rounded-[2rem] shadow-lg shadow-slate-200/50 border border-slate-100 relative group overflow-hidden transition-all hover:shadow-xl">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 transform origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />
            
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
               <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                 <FaMapMarkerAlt size={20} />
               </div>
               Ubicación Física
             </h2>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group/input md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1 group-focus-within/input:text-emerald-600 transition-colors">
                    Dirección Principal
                  </label>
                  <input 
                      type="text"
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:bg-white focus:border-emerald-500 transition-all placeholder:text-slate-300 shadow-sm"
                      placeholder="Calle 123 # 45 - 67"
                      value={settings.direccion}
                      onChange={e => setSettings({...settings, direccion: e.target.value})}
                   />
                </div>

                <div className="group/input">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1 group-focus-within/input:text-emerald-600 transition-colors">
                    Ciudad / Municipio
                  </label>
                  <div className="relative">
                    <select
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:bg-white focus:border-emerald-500 transition-all appearance-none shadow-sm"
                      value={settings.ciudad}
                      onChange={e => setSettings({...settings, ciudad: e.target.value})}
                    >
                      <option value="">Seleccionar ciudad...</option>
                      {CIUDADES_COLOMBIA.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* Columna Derecha: Contacto y Guardar */}
        <div className="space-y-8">
           <div className="bg-white p-8 rounded-[2rem] shadow-lg shadow-slate-200/50 border border-slate-100 relative group overflow-hidden transition-all hover:shadow-xl">
             <div className="absolute top-0 left-0 w-1 h-full bg-purple-500 transform origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />
             
             <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
               <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                 <FaGlobe size={20} />
               </div>
               Canales Digitales
             </h2>

             <div className="space-y-6">
               <div className="group/input">
                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Teléfono / PBX</label>
                 <div className="relative">
                    <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input 
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-medium text-slate-700 focus:border-purple-500 outline-none transition-all"
                      value={settings.telefono}
                      onChange={e => setSettings({...settings, telefono: e.target.value})}
                    />
                 </div>
               </div>

               <div className="group/input">
                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Correo Electrónico</label>
                 <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input 
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-medium text-slate-700 focus:border-purple-500 outline-none transition-all"
                      value={settings.email}
                      onChange={e => setSettings({...settings, email: e.target.value})}
                    />
                 </div>
               </div>

               <div className="group/input">
                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Sitio Web</label>
                 <div className="relative">
                    <FaGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input 
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-medium text-slate-700 focus:border-purple-500 outline-none transition-all"
                      value={settings.sitioWeb}
                      onChange={e => setSettings({...settings, sitioWeb: e.target.value})}
                    />
                 </div>
               </div>
             </div>
           </div>

           {/* Botón de Guardar (Floating Action) */}
           <div className="sticky bottom-6 z-20">
             <button 
              type="submit"
              disabled={saving}
              className={`w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-2xl shadow-blue-500/30 transition-all transform active:scale-95 ${
                saving 
                  ? 'bg-slate-800 text-slate-400 cursor-wait' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-1'
              }`}
             >
               {saving ? (
                 <>
                   <FaSpinner className="animate-spin" />
                   Guardando...
                 </>
               ) : (
                 <>
                   <FaCheckCircle />
                   Guardar Cambios
                 </>
               )}
             </button>
           </div>
        </div>

      </form>
    </div>
  );
}

