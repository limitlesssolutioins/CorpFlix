'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface Category {
  id: number;
  code: string;
  name: string;
}

interface GenerationSummary {
  createdRisks: number;
  createdAssessments: number;
  createdControls: number;
  createdActionPlans: number;
}

export default function RiesgosAsistenteIAPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<GenerationSummary | null>(null);

  const [companyName, setCompanyName] = useState('');
  const [sector, setSector] = useState('');
  const [processes, setProcesses] = useState('');
  const [concerns, setConcerns] = useState('');
  const [responsibleArea, setResponsibleArea] = useState('');
  const [risksPerCategory, setRisksPerCategory] = useState(3);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/riesgos/categories');
      const data = await res.json();
      setCategories(data || []);
      if (Array.isArray(data) && data.length > 0) {
        setSelectedCategories(data.slice(0, 2).map((c: Category) => c.code));
      }
    } catch (e) {
      setError('No se pudieron cargar las categorias de riesgo');
    } finally {
      setLoadingCategories(false);
    }
  };

  const toggleCategory = (code: string) => {
    setSelectedCategories((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const handleGenerate = async () => {
    setError('');
    setResult(null);

    if (selectedCategories.length === 0) {
      setError('Selecciona al menos una categoria');
      return;
    }

    setGenerating(true);
    try {
      const res = await fetch('/api/riesgos/generate-matrix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          sector,
          processes,
          concerns,
          responsibleArea,
          selectedCategories,
          risksPerCategory
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'No se pudo generar la matriz');
      }

      setResult(data.summary || null);
    } catch (e: any) {
      setError(e?.message || 'Error al generar la matriz con IA');
    } finally {
      setGenerating(false);
    }
  };

  if (loadingCategories) {
    return (
      <div className="flex items-center justify-center min-h-[350px]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <Link
          href="/riesgos"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          Volver al Dashboard
        </Link>
        <h1 className="text-3xl font-black text-slate-900 mb-2">Asistente IA de Matriz de Riesgos</h1>
        <p className="text-slate-600">
          Responde preguntas simples y la IA generara riesgos, evaluaciones, controles y planes de accion.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Nombre de la empresa</label>
            <input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Ej: Limitless Solutions"
              className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Sector o actividad</label>
            <input
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              placeholder="Ej: Desarrollo de software"
              className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Procesos o areas clave</label>
          <textarea
            value={processes}
            onChange={(e) => setProcesses(e.target.value)}
            rows={3}
            placeholder="Ej: Ventas, desarrollo, soporte, facturacion, gestion humana..."
            className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Principales preocupaciones</label>
          <textarea
            value={concerns}
            onChange={(e) => setConcerns(e.target.value)}
            rows={3}
            placeholder="Ej: fuga de informacion, retrasos, alta rotacion, incumplimientos legales..."
            className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Area responsable</label>
            <input
              value={responsibleArea}
              onChange={(e) => setResponsibleArea(e.target.value)}
              placeholder="Ej: Coordinacion HSEQ"
              className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Riesgos por categoria</label>
            <input
              type="number"
              min={1}
              max={8}
              value={risksPerCategory}
              onChange={(e) => setRisksPerCategory(Number(e.target.value))}
              className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-3">Categorias de riesgo a generar</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {categories.map((cat) => {
              const selected = selectedCategories.includes(cat.code);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.code)}
                  className={`text-left px-4 py-3 rounded-xl border-2 transition-colors ${
                    selected
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="font-bold">{cat.name}</span>
                  <span className="ml-2 text-xs font-mono">{cat.code}</span>
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 flex items-start gap-2 text-red-700">
            <AlertCircle size={18} className="mt-0.5" />
            <span className="text-sm font-semibold">{error}</span>
          </div>
        )}

        {result && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-900">
            <div className="flex items-center gap-2 font-bold mb-2">
              <CheckCircle2 size={18} />
              Generacion completada
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div><strong>{result.createdRisks}</strong> riesgos</div>
              <div><strong>{result.createdAssessments}</strong> evaluaciones</div>
              <div><strong>{result.createdControls}</strong> controles</div>
              <div><strong>{result.createdActionPlans}</strong> planes</div>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleGenerate}
          disabled={generating}
          className="w-full py-4 rounded-xl bg-blue-600 text-white font-black hover:bg-blue-700 disabled:opacity-60 flex items-center justify-center gap-2 transition-colors"
        >
          {generating ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
          {generating ? 'Generando matriz con IA...' : 'Generar Matriz de Riesgos con IA'}
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/riesgos/catalogo" className="px-4 py-2 bg-slate-100 rounded-xl font-semibold text-slate-700 hover:bg-slate-200">
          Ver Catalogo
        </Link>
        <Link href="/riesgos/evaluacion" className="px-4 py-2 bg-slate-100 rounded-xl font-semibold text-slate-700 hover:bg-slate-200">
          Ver Evaluaciones
        </Link>
        <Link href="/riesgos/planes-accion" className="px-4 py-2 bg-slate-100 rounded-xl font-semibold text-slate-700 hover:bg-slate-200">
          Ver Planes de Accion
        </Link>
      </div>
    </div>
  );
}
