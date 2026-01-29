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
  FaUpload
} from 'react-icons/fa';

export default function AdminGeneralPage() {
  const [settings, setSettings] = useState({
    nombreEmpresa: '',
    nit: '',
    sectorActividad: '',
    direccion: '',
    ciudad: '',
    telefono: '',
    email: '',
    sitioWeb: '',
    logoUrl: '' // Nuevo campo
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get('/api/admin/general');
      setSettings(prev => ({ ...prev, ...res.data })); // Merge con defaults
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
      
      setSettings(prev => ({ ...prev, logoUrl: res.data.url }));
      toast.success('Logo subido correctamente');
    } catch (error) {
      console.error(error);
      toast.error('Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      await axios.post('/api/admin/general', settings);
      toast.success('Configuración guardada exitosamente', {
        description: 'El perfil corporativo ha sido actualizado.'
      });
    } catch (error) {
      toast.error('Error al guardar cambios');
    } finally {
      setSaving(false);
    }
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
                <div className="w-32 h-32 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center relative overflow-hidden group/image">
                  {settings.logoUrl ? (
                    <img src={settings.logoUrl} alt="Logo Preview" className="w-full h-full object-contain p-2" />
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
                  <input 
                      type="text"
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:bg-white focus:border-emerald-500 transition-all placeholder:text-slate-300 shadow-sm"
                      placeholder="Ej. Bogotá D.C."
                      value={settings.ciudad}
                      onChange={e => setSettings({...settings, ciudad: e.target.value})}
                   />
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
