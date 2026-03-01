'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';

const CIUDADES_COLOMBIA = [
  'Bogotá D.C.', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Bucaramanga',
  'Cúcuta', 'Pereira', 'Ibagué', 'Santa Marta', 'Manizales', 'Bello', 'Pasto',
  'Villavicencio', 'Montería', 'Valledupar', 'Armenia', 'Buenaventura', 'Floridablanca',
  'Soacha', 'Itagüí', 'Soledad', 'Palmira', 'Neiva', 'Popayán', 'Barrancabermeja',
  'Sincelejo', 'Riohacha', 'Tunja', 'Dosquebradas', 'Envigado', 'Duitama',
  'Sogamoso', 'Quibdó', 'Florencia', 'Girón', 'Yopal', 'Apartadó', 'Turbo',
  'Maicao', 'Ipiales', 'Tumaco', 'Leticia', 'Arauca', 'Puerto Asís', 'Mocoa',
];

const STEPS = [
  { id: 'empresa',    label: 'Empresa',    emoji: '🏢' },
  { id: 'logo',       label: 'Logo',       emoji: '🎨' },
  { id: 'descripcion',label: 'Descripción',emoji: '📝' },
  { id: 'ubicacion',  label: 'Ubicación',  emoji: '📍' },
  { id: 'contacto',   label: 'Contacto',   emoji: '📞' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [logoTimestamp, setLogoTimestamp] = useState(Date.now());

  const [data, setData] = useState({
    nombreEmpresa: '',
    nit: '',
    sectorActividad: '',
    logoUrl: '',
    resumenEjecutivo: '',
    direccion: '',
    ciudad: '',
    telefono: '',
    email: '',
    sitioWeb: '',
  });

  useEffect(() => {
    axios.get('/api/admin/general').then(res => {
      const d = res.data || {};
      setData(prev => ({
        ...prev,
        nombreEmpresa:    d.nombreEmpresa    || prev.nombreEmpresa,
        nit:              d.nit              || prev.nit,
        sectorActividad:  d.sectorActividad  || prev.sectorActividad,
        logoUrl:          d.logoUrl          || prev.logoUrl,
        resumenEjecutivo: d.resumenEjecutivo || prev.resumenEjecutivo,
        direccion:        d.direccion        || prev.direccion,
        ciudad:           d.ciudad           || prev.ciudad,
        telefono:         d.telefono         || prev.telefono,
        email:            d.email            || prev.email,
        sitioWeb:         d.sitioWeb         || prev.sitioWeb,
      }));
    }).catch(() => {});
  }, []);

  const update = (field: keyof typeof data, value: string) =>
    setData(prev => ({ ...prev, [field]: value }));

  const saveStep = async () => {
    try {
      await axios.post('/api/admin/general', data);
    } catch { /* ignore, will retry on next step */ }
  };

  const next = async () => {
    await saveStep();
    setStep(s => s + 1);
  };

  const back = () => setStep(s => s - 1);

  const finish = async () => {
    setSaving(true);
    try {
      await axios.post('/api/admin/general', data);
      toast.success('¡Perfil corporativo completado!');
      router.push('/');
    } catch {
      toast.error('Error al guardar. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  const skip = () => router.push('/');

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      const res = await axios.post('/api/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      update('logoUrl', res.data.url);
      setLogoTimestamp(Date.now());
      toast.success('Logo subido correctamente');
    } catch {
      toast.error('Error al subir el logo');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const progress = ((step) / STEPS.length) * 100;
  const isLastStep = step === STEPS.length - 1;
  const isDone = step === STEPS.length;

  return (
    <div className="fixed inset-0 z-[300] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col overflow-hidden">

      {/* Progress bar top */}
      <div className="h-1 bg-slate-700 flex-shrink-0">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
          style={{ width: `${isDone ? 100 : progress}%` }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-8 py-5 flex-shrink-0">
        <div className="flex items-center gap-3">
          <img src="/ISOLOGO.png" alt="Lidus" className="h-8 w-auto" />
          <img src="/TEXTO.png" alt="LIDUS" className="h-5 w-auto" />
        </div>

        {/* Step pills */}
        {!isDone && (
          <div className="hidden md:flex items-center gap-2">
            {STEPS.map((s, i) => (
              <div
                key={s.id}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  i === step
                    ? 'bg-blue-600 text-white'
                    : i < step
                    ? 'bg-slate-600 text-slate-300'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                <span>{s.emoji}</span>
                <span>{s.label}</span>
                {i < step && <span className="text-emerald-400">✓</span>}
              </div>
            ))}
          </div>
        )}

        <button
          onClick={skip}
          className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
        >
          Completar después →
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-xl">

          {/* ── DONE screen ── */}
          {isDone && (
            <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-7xl mb-4">🎉</div>
              <h1 className="text-4xl font-black text-white">¡Todo listo!</h1>
              <p className="text-slate-400 text-lg font-medium">
                El perfil de <span className="text-white font-bold">{data.nombreEmpresa}</span> está completo.
                Puedes editarlo en cualquier momento desde <strong className="text-blue-400">Administración → General</strong>.
              </p>
              <div className="bg-slate-800/60 rounded-2xl p-6 text-left space-y-2 border border-slate-700">
                {data.logoUrl && (
                  <div className="flex justify-center mb-4">
                    <img src={`${data.logoUrl}?t=${logoTimestamp}`} alt="Logo" className="h-16 object-contain rounded-xl" />
                  </div>
                )}
                <Row label="Empresa"  value={data.nombreEmpresa} />
                <Row label="NIT"      value={data.nit} />
                <Row label="Sector"   value={data.sectorActividad} />
                <Row label="Ciudad"   value={data.ciudad} />
                <Row label="Email"    value={data.email} />
              </div>
              <button
                onClick={finish}
                disabled={saving}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-lg shadow-2xl shadow-blue-500/30 hover:from-blue-700 hover:to-indigo-700 transition-all hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {saving ? (
                  <><Spinner /> Guardando...</>
                ) : (
                  <>Ir al Dashboard →</>
                )}
              </button>
            </div>
          )}

          {/* ── STEP 0: Empresa ── */}
          {step === 0 && (
            <StepCard
              emoji="🏢"
              title="Datos de la empresa"
              subtitle="Empecemos con la información básica de identificación."
            >
              <Field label="Razón Social / Nombre *">
                <input
                  className={inputCls}
                  placeholder="Ej: Empresa S.A.S."
                  value={data.nombreEmpresa}
                  onChange={e => update('nombreEmpresa', e.target.value)}
                  autoFocus
                />
              </Field>
              <Field label="NIT / Identificación Tributaria">
                <input
                  className={inputCls}
                  placeholder="Ej: 900.123.456-7"
                  value={data.nit}
                  onChange={e => update('nit', e.target.value)}
                />
              </Field>
              <Field label="Sector / Actividad Económica">
                <textarea
                  className={inputCls}
                  placeholder="Ej: Desarrollo de software a medida y consultoría tecnológica"
                  rows={3}
                  value={data.sectorActividad}
                  onChange={e => update('sectorActividad', e.target.value)}
                />
              </Field>
              <StepActions onNext={next} onSkip={skip} canNext={data.nombreEmpresa.trim().length > 1} />
            </StepCard>
          )}

          {/* ── STEP 1: Logo ── */}
          {step === 1 && (
            <StepCard
              emoji="🎨"
              title="Logotipo oficial"
              subtitle="Sube el logo de tu empresa. Aparecerá en todo el perfil corporativo."
            >
              <div
                className="flex flex-col items-center justify-center gap-4 p-10 rounded-2xl border-2 border-dashed border-slate-600 hover:border-blue-500 transition-colors cursor-pointer bg-slate-800/40"
                onClick={() => fileInputRef.current?.click()}
              >
                {uploading ? (
                  <><Spinner className="text-blue-400 text-3xl" /><p className="text-slate-400 text-sm">Subiendo...</p></>
                ) : data.logoUrl ? (
                  <>
                    <img
                      key={logoTimestamp}
                      src={`${data.logoUrl}?t=${logoTimestamp}`}
                      alt="Logo"
                      className="h-28 object-contain rounded-xl"
                    />
                    <p className="text-blue-400 text-sm font-bold">Clic para cambiar</p>
                  </>
                ) : (
                  <>
                    <div className="text-5xl">🖼️</div>
                    <div className="text-center">
                      <p className="text-white font-bold">Clic para subir tu logo</p>
                      <p className="text-slate-400 text-xs mt-1">PNG, JPG · Fondo transparente recomendado</p>
                    </div>
                  </>
                )}
              </div>
              <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleLogoUpload} />
              <StepActions onNext={next} onBack={back} onSkip={skip} nextLabel={data.logoUrl ? 'Continuar' : 'Omitir por ahora'} canNext />
            </StepCard>
          )}

          {/* ── STEP 2: Descripción ── */}
          {step === 2 && (
            <StepCard
              emoji="📝"
              title="¿Quiénes son?"
              subtitle="Escribe un resumen ejecutivo de tu empresa. Se mostrará en el perfil corporativo."
            >
              <Field label="Resumen Ejecutivo">
                <textarea
                  className={`${inputCls} resize-none`}
                  placeholder="Describe brevemente a qué se dedica tu empresa, cuáles son sus valores y qué la diferencia en el mercado..."
                  rows={7}
                  value={data.resumenEjecutivo}
                  onChange={e => update('resumenEjecutivo', e.target.value)}
                  autoFocus
                />
                <p className="text-slate-500 text-xs mt-1">{data.resumenEjecutivo.length} caracteres</p>
              </Field>
              <StepActions onNext={next} onBack={back} onSkip={skip} canNext />
            </StepCard>
          )}

          {/* ── STEP 3: Ubicación ── */}
          {step === 3 && (
            <StepCard
              emoji="📍"
              title="Ubicación de la empresa"
              subtitle="¿Dónde está ubicada tu sede principal?"
            >
              <Field label="Dirección Principal">
                <input
                  className={inputCls}
                  placeholder="Calle 123 # 45 - 67"
                  value={data.direccion}
                  onChange={e => update('direccion', e.target.value)}
                  autoFocus
                />
              </Field>
              <Field label="Ciudad / Municipio">
                <select
                  className={`${inputCls} appearance-none`}
                  value={data.ciudad}
                  onChange={e => update('ciudad', e.target.value)}
                >
                  <option value="">Seleccionar ciudad...</option>
                  {CIUDADES_COLOMBIA.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <StepActions onNext={next} onBack={back} onSkip={skip} canNext />
            </StepCard>
          )}

          {/* ── STEP 4: Contacto ── */}
          {step === 4 && (
            <StepCard
              emoji="📞"
              title="Canales de contacto"
              subtitle="¿Cómo pueden comunicarse con tu empresa?"
            >
              <Field label="Teléfono / PBX">
                <input
                  className={inputCls}
                  placeholder="+57 601 123 4567"
                  value={data.telefono}
                  onChange={e => update('telefono', e.target.value)}
                  autoFocus
                />
              </Field>
              <Field label="Correo Electrónico">
                <input
                  type="email"
                  className={inputCls}
                  placeholder="info@empresa.com"
                  value={data.email}
                  onChange={e => update('email', e.target.value)}
                />
              </Field>
              <Field label="Sitio Web">
                <input
                  type="url"
                  className={inputCls}
                  placeholder="https://www.empresa.com"
                  value={data.sitioWeb}
                  onChange={e => update('sitioWeb', e.target.value)}
                />
              </Field>
              <StepActions
                onNext={() => { saveStep(); setStep(STEPS.length); }}
                onBack={back}
                onSkip={skip}
                nextLabel="Finalizar ✓"
                canNext
              />
            </StepCard>
          )}

        </div>
      </div>

      {/* Mobile step counter */}
      {!isDone && (
        <div className="md:hidden text-center pb-4 text-slate-500 text-xs font-medium">
          Paso {step + 1} de {STEPS.length} · {STEPS[step]?.label}
        </div>
      )}
    </div>
  );
}

/* ── Helpers ── */

const inputCls = `w-full px-4 py-3 bg-slate-800 border-2 border-slate-700 rounded-xl text-white placeholder:text-slate-500
  focus:border-blue-500 focus:outline-none transition-all font-medium`;

function StepCard({ emoji, title, subtitle, children }: {
  emoji: string; title: string; subtitle: string; children: React.ReactNode;
}) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-400 space-y-6">
      <div className="text-center">
        <div className="text-5xl mb-3">{emoji}</div>
        <h2 className="text-3xl font-black text-white">{title}</h2>
        <p className="text-slate-400 mt-2 font-medium">{subtitle}</p>
      </div>
      <div className="bg-slate-800/50 backdrop-blur rounded-3xl p-6 border border-slate-700/50 space-y-4">
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</label>
      {children}
    </div>
  );
}

function StepActions({ onNext, onBack, onSkip, nextLabel = 'Continuar →', canNext }: {
  onNext: () => void;
  onBack?: () => void;
  onSkip?: () => void;
  nextLabel?: string;
  canNext: boolean;
}) {
  return (
    <div className="flex gap-3 pt-2">
      {onBack && (
        <button
          onClick={onBack}
          className="px-5 py-3 rounded-xl border-2 border-slate-700 text-slate-300 font-bold hover:bg-slate-700 transition-all"
        >
          ← Atrás
        </button>
      )}
      <button
        onClick={onNext}
        disabled={!canNext}
        className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black transition-all hover:-translate-y-0.5 shadow-lg shadow-blue-500/20"
      >
        {nextLabel}
      </button>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex justify-between items-center text-sm py-1">
      <span className="text-slate-400 font-medium">{label}</span>
      <span className="text-white font-bold truncate max-w-[60%] text-right">{value}</span>
    </div>
  );
}

function Spinner({ className = '' }: { className?: string }) {
  return (
    <svg className={`animate-spin h-5 w-5 ${className}`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}
