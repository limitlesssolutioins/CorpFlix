'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Company {
  id: string;
  name: string;
  createdAt: string;
}

const CIUDADES_COLOMBIA = [
  'Bogotá D.C.', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Bucaramanga',
  'Cúcuta', 'Pereira', 'Ibagué', 'Santa Marta', 'Manizales', 'Bello', 'Pasto',
  'Villavicencio', 'Montería', 'Valledupar', 'Armenia', 'Buenaventura', 'Floridablanca',
  'Soacha', 'Itagüí', 'Soledad', 'Palmira', 'Neiva', 'Popayán', 'Barrancabermeja',
  'Sincelejo', 'Riohacha', 'Tunja', 'Dosquebradas', 'Envigado', 'Duitama',
  'Sogamoso', 'Quibdó', 'Florencia', 'Girón', 'Yopal', 'Apartadó', 'Turbo',
];

export default function LoginPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [error, setError] = useState('');

  const [wizardData, setWizardData] = useState({
    name: '',
    nit: '',
    sectorActividad: '',
    direccion: '',
    ciudad: '',
    telefono: '',
    email: '',
    sitioWeb: '',
  });

  useEffect(() => {
    fetch('/api/companies')
      .then((r) => r.json())
      .then((data) => {
        setCompanies(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function selectCompany(companyId: string) {
    setSelecting(companyId);
    setError('');
    try {
      const res = await fetch('/api/companies/select', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId }),
      });
      if (res.ok) {
        router.push('/');
      } else {
        setError('Error al seleccionar empresa');
        setSelecting(null);
      }
    } catch {
      setError('Error de conexión');
      setSelecting(null);
    }
  }

  async function createCompanyWizard(e: React.FormEvent) {
    e.preventDefault();
    if (!wizardData.name.trim()) return;
    setCreating(true);
    setError('');
    try {
      // 1. Create the company
      const res = await fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: wizardData.name.trim() }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Error al crear empresa');
        setCreating(false);
        return;
      }
      const company = await res.json();

      // 2. Select the company (sets the cookie)
      const selectRes = await fetch('/api/companies/select', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId: company.id }),
      });
      if (!selectRes.ok) {
        setError('Error al iniciar sesión con la empresa');
        setCreating(false);
        return;
      }

      // 3. Save the extra details to admin/general
      await fetch('/api/admin/general', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombreEmpresa: wizardData.name.trim(),
          nit: wizardData.nit.trim(),
          sectorActividad: wizardData.sectorActividad.trim(),
          direccion: wizardData.direccion.trim(),
          ciudad: wizardData.ciudad,
          telefono: wizardData.telefono.trim(),
          email: wizardData.email.trim(),
          sitioWeb: wizardData.sitioWeb.trim(),
        }),
      });

      router.push('/');
    } catch {
      setError('Error de conexión');
    } finally {
      setCreating(false);
    }
  }

  const updateWizard = (field: keyof typeof wizardData, value: string) => {
    setWizardData(prev => ({ ...prev, [field]: value }));
  };

  const canProceedStep1 = wizardData.name.trim().length > 1;
  const canProceedStep2 = true; // Optional fields

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <img src="/ISOLOGO.png" alt="Lidus" className="h-14 w-auto" />
            <img src="/TEXTO.png" alt="LIDUS" className="h-10 w-auto" />
          </div>
          <p className="text-slate-400 mt-2 text-sm">Plataforma Integral de Gestión Organizacional</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {error && (
            <div className="bg-red-50 border-b border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {!showWizard ? (
            <div className="p-6">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : companies.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500 text-sm mb-1">No hay empresas registradas.</p>
                  <p className="text-gray-400 text-xs">Crea tu primera empresa para comenzar.</p>
                </div>
              ) : (
                <div className="space-y-2 mb-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                    Empresas disponibles
                  </p>
                  {companies.map((company) => (
                    <button
                      key={company.id}
                      onClick={() => selectCompany(company.id)}
                      disabled={!!selecting}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-left group disabled:opacity-60"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-700 font-black text-sm">
                            {company.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{company.name}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(company.createdAt).toLocaleDateString('es-CO', {
                              year: 'numeric', month: 'short', day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                      {selecting === company.id ? (
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {companies.length > 0 && (
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400">o</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
              )}

              <button
                onClick={() => { setShowWizard(true); setWizardStep(1); setError(''); }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition-all text-sm font-bold"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Registrar Nueva Empresa
              </button>
            </div>
          ) : (
            /* WIZARD */
            <form onSubmit={createCompanyWizard}>
              {/* Wizard Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5 text-white">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-black text-base uppercase tracking-wide">Registro de Empresa</h3>
                  <button
                    type="button"
                    onClick={() => { setShowWizard(false); setWizardStep(1); setError(''); }}
                    className="text-white/70 hover:text-white transition-colors text-lg font-black"
                  >
                    ×
                  </button>
                </div>
                {/* Steps indicator */}
                <div className="flex items-center gap-2">
                  {[1, 2, 3].map(s => (
                    <div key={s} className={`flex items-center gap-2 ${s < 3 ? 'flex-1' : ''}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 transition-all ${
                        wizardStep >= s ? 'bg-white text-blue-600 border-white' : 'bg-transparent text-white/60 border-white/40'
                      }`}>
                        {s}
                      </div>
                      {s < 3 && <div className={`flex-1 h-0.5 transition-all ${wizardStep > s ? 'bg-white' : 'bg-white/30'}`} />}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-white/70">Identificación</span>
                  <span className="text-[10px] text-white/70">Ubicación</span>
                  <span className="text-[10px] text-white/70">Contacto</span>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* Step 1: Basic Info */}
                {wizardStep === 1 && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                        Razón Social / Nombre <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={wizardData.name}
                        onChange={e => updateWizard('name', e.target.value)}
                        placeholder="Ej: Empresa S.A.S."
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-sm font-bold transition-all"
                        autoFocus
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                        NIT / Identificación Tributaria
                      </label>
                      <input
                        type="text"
                        value={wizardData.nit}
                        onChange={e => updateWizard('nit', e.target.value)}
                        placeholder="Ej: 900.123.456-7"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-sm font-bold transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                        Sector / Actividad Económica
                      </label>
                      <textarea
                        value={wizardData.sectorActividad}
                        onChange={e => updateWizard('sectorActividad', e.target.value)}
                        placeholder="Ej: Desarrollo de software a medida y consultoría tecnológica"
                        rows={2}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-sm font-bold transition-all resize-none"
                      />
                    </div>
                  </>
                )}

                {/* Step 2: Location */}
                {wizardStep === 2 && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                        Dirección Principal
                      </label>
                      <input
                        type="text"
                        value={wizardData.direccion}
                        onChange={e => updateWizard('direccion', e.target.value)}
                        placeholder="Calle 123 # 45 - 67"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-sm font-bold transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                        Ciudad / Municipio
                      </label>
                      <select
                        value={wizardData.ciudad}
                        onChange={e => updateWizard('ciudad', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-sm font-bold transition-all appearance-none bg-white"
                      >
                        <option value="">Seleccionar ciudad...</option>
                        {CIUDADES_COLOMBIA.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {/* Step 3: Contact */}
                {wizardStep === 3 && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                        Teléfono / PBX
                      </label>
                      <input
                        type="tel"
                        value={wizardData.telefono}
                        onChange={e => updateWizard('telefono', e.target.value)}
                        placeholder="Ej: +57 601 123 4567"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-sm font-bold transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                        Correo Electrónico
                      </label>
                      <input
                        type="email"
                        value={wizardData.email}
                        onChange={e => updateWizard('email', e.target.value)}
                        placeholder="info@empresa.com"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-sm font-bold transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                        Sitio Web
                      </label>
                      <input
                        type="url"
                        value={wizardData.sitioWeb}
                        onChange={e => updateWizard('sitioWeb', e.target.value)}
                        placeholder="https://www.empresa.com"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-sm font-bold transition-all"
                      />
                    </div>
                  </>
                )}

                {/* Navigation buttons */}
                <div className="flex gap-3 pt-2">
                  {wizardStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setWizardStep(s => s - 1)}
                      disabled={creating}
                      className="px-4 py-3 rounded-xl border-2 border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all"
                    >
                      Atrás
                    </button>
                  )}
                  {wizardStep < 3 ? (
                    <button
                      type="button"
                      onClick={() => setWizardStep(s => s + 1)}
                      disabled={wizardStep === 1 && !canProceedStep1}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-black py-3 rounded-xl transition-all"
                    >
                      Continuar →
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={creating || !wizardData.name.trim()}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-black py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      {creating ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : 'Crear Empresa y Entrar'}
                    </button>
                  )}
                </div>
              </div>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          LIDUS &copy; {new Date().getFullYear()} · Limitless Solutions
        </p>
      </div>
    </div>
  );
}
