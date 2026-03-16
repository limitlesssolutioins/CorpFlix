'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const router = useRouter();
  const [wizardStep, setWizardStep] = useState(1);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const [policyAccepted, setPolicyAccepted] = useState(false);

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

  const updateWizard = (field: keyof typeof wizardData, value: string) => {
    setWizardData(prev => ({ ...prev, [field]: value }));
  };

  async function createCompanyWizard(e: React.FormEvent) {
    e.preventDefault();
    if (!wizardData.name.trim() || !policyAccepted) return;
    
    setCreating(true);
    setError('');

    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(wizardData),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Error al crear empresa');
        setCreating(false);
        return;
      }

      router.push('/');
    } catch {
      setError('Error de conexión');
      setCreating(false);
    }
  }

  const canProceedStep1 = wizardData.name.trim().length > 1;
  const canProceedStep2 = true;
  const canSubmit = wizardData.name.trim().length > 1 && policyAccepted;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <img src="/ISOLOGO.png" alt="Lidus" className="h-14 w-auto" />
            <img src="/TEXTO.png" alt="LIDUS" className="h-10 w-auto" />
          </div>
          <p className="text-slate-400 mt-2 text-sm">Comencemos configurando tu empresa</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {error && (
            <div className="bg-red-50 border-b border-red-200 px-4 py-3 text-sm text-red-700 text-center font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={createCompanyWizard}>
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5 text-white">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-black text-base uppercase tracking-wide">Registro de Empresa</h3>
              </div>
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
                      placeholder="Opcional"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-sm font-bold transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                      Sector o Actividad
                    </label>
                    <input
                      type="text"
                      value={wizardData.sectorActividad}
                      onChange={e => updateWizard('sectorActividad', e.target.value)}
                      placeholder="Ej: Tecnología, Salud, etc."
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-sm font-bold transition-all"
                    />
                  </div>
                </>
              )}

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
                      placeholder="Opcional"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-sm font-bold transition-all"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                      Ciudad principal
                    </label>
                    <input
                      type="text"
                      value={wizardData.ciudad}
                      onChange={e => updateWizard('ciudad', e.target.value)}
                      placeholder="Ej: Bogotá D.C."
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-sm font-bold transition-all"
                    />
                  </div>
                </>
              )}

              {wizardStep === 3 && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                      Teléfono de Contacto
                    </label>
                    <input
                      type="tel"
                      value={wizardData.telefono}
                      onChange={e => updateWizard('telefono', e.target.value)}
                      placeholder="Opcional"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-sm font-bold transition-all"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                      Email Corporativo
                    </label>
                    <input
                      type="email"
                      value={wizardData.email}
                      onChange={e => updateWizard('email', e.target.value)}
                      placeholder="Opcional"
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
                      placeholder="Ej: https://miempresa.com"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-sm font-bold transition-all"
                    />
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border-2 border-slate-100 cursor-pointer hover:border-blue-200 transition-colors">
                      <div className="pt-0.5">
                        <input
                          type="checkbox"
                          checked={policyAccepted}
                          onChange={(e) => setPolicyAccepted(e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                        />
                      </div>
                      <div className="flex-1 text-xs text-slate-600">
                        He leído y acepto la <a href="/api/platform/data-policy" target="_blank" className="text-blue-600 font-bold hover:underline">Política de Tratamiento de Datos Personales</a> de LIDUS.
                      </div>
                    </label>
                  </div>
                </>
              )}
            </div>

            <div className="bg-gray-50 p-4 border-t border-gray-100 flex gap-3">
              {wizardStep > 1 && (
                <button
                  type="button"
                  onClick={() => setWizardStep(s => s - 1)}
                  className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition-colors text-sm"
                >
                  Volver
                </button>
              )}
              
              {wizardStep < 3 ? (
                <button
                  type="button"
                  onClick={() => setWizardStep(s => s + 1)}
                  disabled={wizardStep === 1 ? !canProceedStep1 : !canProceedStep2}
                  className="flex-1 bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Continuar
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!canSubmit || creating}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                >
                  {creating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Finalizando...
                    </>
                  ) : (
                    'Finalizar y Acceder'
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
