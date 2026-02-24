'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import {
  FaMagic,
  FaPlus,
  FaTrash,
  FaSearch,
  FaSmile,
  FaMeh,
  FaFrown,
  FaChartLine,
} from 'react-icons/fa';
import IndicatorChart from '@/components/IndicatorChart';

interface Measurement {
  periodo: string;
  valor: number;
}

interface Indicator {
  id: string;
  nombre: string;
  descripcion: string;
  formula?: string;
  fuente?: string;
  unidad: string;
  meta: number;
  frecuencia: string;
  datos: Measurement[];
}

export default function IndicadoresPage() {
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingIA, setGeneratingIA] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showMeasureForm, setShowMeasureForm] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedKpiId, setSelectedKpiId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [useCalc, setUseCalc] = useState(false);
  const [calcNum, setCalcNum] = useState<number>(0);
  const [calcDen, setCalcDen] = useState<number>(1);

  useEffect(() => { fetchIndicators(); }, []);

  const fetchIndicators = async () => {
    try {
      const res = await axios.get('/api/gestion/indicadores');
      setIndicators(res.data || []);
    } catch {
      toast.error('Error al cargar indicadores');
    } finally {
      setLoading(false);
    }
  };

  const generateWithIA = async () => {
    setGeneratingIA(true);
    const toastId = toast.loading('La IA está diseñando tus métricas...');
    try {
      const context = JSON.parse(localStorage.getItem('company_context') || '{"description": "Empresa en crecimiento"}');
      const res = await axios.post('/api/generate-indicators', { context: context.description });
      if (res.data && Array.isArray(res.data)) {
        await axios.post('/api/gestion/indicadores', res.data);
        toast.success('¡Indicadores generados!', { id: toastId });
        fetchIndicators();
      }
    } catch {
      toast.error('Error al generar con IA', { id: toastId });
    } finally {
      setGeneratingIA(false);
    }
  };

  const handleAddMeasurement = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const periodo = formData.get('periodo') as string;
    let valor = parseFloat(formData.get('valor') as string);
    if (useCalc) valor = parseFloat(((calcNum / calcDen) * 100).toFixed(2));

    const indicator = indicators.find(i => i.id === selectedKpiId);
    if (!indicator) return;

    try {
      await axios.put('/api/gestion/indicadores', {
        ...indicator,
        datos: [...indicator.datos, { periodo, valor }],
      });
      toast.success(`Dato registrado: ${valor}${indicator.unidad}`);
      setShowMeasureForm(false);
      setUseCalc(false);
      fetchIndicators();
    } catch {
      toast.error('Error al guardar');
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('¿Eliminar este indicador?')) return;
    try {
      await axios.delete(`/api/gestion/indicadores?id=${id}`);
      toast.success('Indicador eliminado');
      if (selectedKpiId === id) setShowDetailModal(false);
      fetchIndicators();
    } catch {
      toast.error('No se pudo eliminar');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newIndicator: Indicator = {
      id: Date.now().toString(),
      nombre: formData.get('nombre') as string,
      descripcion: formData.get('descripcion') as string,
      unidad: formData.get('unidad') as string,
      meta: parseFloat(formData.get('meta') as string),
      frecuencia: 'Mensual',
      datos: [],
    };
    const toastId = toast.loading('Creando indicador...');
    try {
      await axios.post('/api/gestion/indicadores', [newIndicator]);
      toast.success('¡KPI creado!', { id: toastId });
      setShowCreateForm(false);
      fetchIndicators();
    } catch {
      toast.error('Error al crear', { id: toastId });
    }
  };

  const getStatus = (ind: Indicator) => {
    if (ind.datos.length === 0) return { color: 'slate', pct: 0, icon: FaMeh };
    const last = ind.datos[ind.datos.length - 1].valor;
    const pct = Math.min(Math.round((last / ind.meta) * 100), 100);
    if (last >= ind.meta) return { color: 'emerald', pct, icon: FaSmile };
    if (pct >= 70) return { color: 'amber', pct, icon: FaMeh };
    return { color: 'rose', pct, icon: FaFrown };
  };

  const openDetail = (id: string) => {
    setSelectedKpiId(id);
    setShowDetailModal(true);
  };

  const openMeasure = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedKpiId(id);
    setShowMeasureForm(true);
  };

  const selectedIndicator = indicators.find(i => i.id === selectedKpiId);
  const filtered = indicators.filter(i =>
    i.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-20 text-center text-slate-400 font-bold">Cargando tablero...</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-gradient-to-br from-white via-indigo-50/10 to-indigo-50/20 p-8 rounded-[2.5rem] border-2 border-indigo-100 shadow-lg shadow-indigo-100/50">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Indicadores</h1>
          <p className="text-slate-500 font-medium">Mide el éxito de tu estrategia.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={generateWithIA}
            disabled={generatingIA}
            className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:from-indigo-600 hover:to-indigo-700 shadow-lg shadow-indigo-200 hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <FaMagic /> {generatingIA ? 'Generando...' : 'Sugerencias IA'}
          </button>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-br from-slate-800 to-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:from-slate-700 hover:to-slate-800 shadow-xl hover:shadow-2xl transition-all flex items-center gap-2"
          >
            <FaPlus /> Nuevo KPI
          </button>
        </div>
      </div>

      {/* Search */}
      {indicators.length > 0 && (
        <div className="relative max-w-sm">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
          <input
            placeholder="Buscar KPI..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-50 shadow-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      {/* Empty state */}
      {indicators.length === 0 && (
        <div className="text-center py-24 space-y-4">
          <p className="text-slate-400 font-bold text-lg">Sin indicadores todavía</p>
          <p className="text-slate-300 text-sm">Usa "Sugerencias IA" para que la IA los diseñe, o crea uno manualmente.</p>
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map(ind => {
          const status = getStatus(ind);
          const lastVal = ind.datos.length > 0 ? ind.datos[ind.datos.length - 1].valor : null;

          const topBar = {
            emerald: 'from-emerald-500 to-emerald-600',
            amber: 'from-amber-500 to-amber-600',
            rose: 'from-rose-500 to-rose-600',
            slate: 'from-slate-300 to-slate-400',
          }[status.color];

          const barFill = {
            emerald: 'bg-emerald-500',
            amber: 'bg-amber-400',
            rose: 'bg-rose-500',
            slate: 'bg-slate-300',
          }[status.color];

          return (
            <div
              key={ind.id}
              onClick={() => openDetail(ind.id)}
              className="bg-white rounded-3xl border-2 border-slate-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer group"
            >
              <div className={`h-1.5 w-full bg-gradient-to-r ${topBar}`} />

              <div className="p-6 space-y-4">
                {/* Name + actions */}
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-black text-sm text-slate-900 uppercase leading-tight flex-1">{ind.nombre}</h4>
                  <div className="flex gap-1.5 shrink-0">
                    <button
                      onClick={(e) => openMeasure(ind.id, e)}
                      className="p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 shadow-sm transition-all"
                      title="Registrar dato"
                    >
                      <FaPlus size={10} />
                    </button>
                    <button
                      onClick={(e) => handleDelete(ind.id, e)}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      title="Eliminar"
                    >
                      <FaTrash size={10} />
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 line-clamp-2">{ind.descripcion}</p>

                {/* Value + progress */}
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-2xl font-black text-slate-900">
                      {lastVal !== null ? `${lastVal}${ind.unidad}` : '—'}
                    </span>
                    <span className="text-xs font-bold text-slate-400">Meta: {ind.meta}{ind.unidad}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barFill}`}
                      style={{ width: `${status.pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase">{status.pct}% de la meta</span>
                    <span className="text-[10px] font-bold text-indigo-400 flex items-center gap-1">
                      <FaChartLine size={8} /> Ver evolución
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* DETAIL MODAL */}
      {showDetailModal && selectedIndicator && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4"
          onClick={() => setShowDetailModal(false)}
        >
          <div
            className="bg-white rounded-[2.5rem] p-8 max-w-2xl w-full shadow-2xl space-y-6 border-2 border-slate-100 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-black text-slate-900 uppercase">{selectedIndicator.nombre}</h2>
                <p className="text-sm text-slate-400 mt-1">{selectedIndicator.descripcion}</p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-slate-300 hover:text-slate-500 font-black text-lg transition-colors ml-4 shrink-0"
              >
                ✕
              </button>
            </div>

            <IndicatorChart indicators={[{
              name: selectedIndicator.nombre,
              goal: selectedIndicator.meta,
              unit: selectedIndicator.unidad,
              measurements: selectedIndicator.datos.map(d => ({ date: d.periodo, value: d.valor })),
            }]} />

            {selectedIndicator.datos.length > 0 && (
              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Historial</h3>
                <div className="space-y-2 max-h-44 overflow-y-auto">
                  {[...selectedIndicator.datos].reverse().map((d, i) => (
                    <div key={i} className="flex justify-between items-center py-2 px-4 bg-slate-50 rounded-xl">
                      <span className="text-sm font-bold text-slate-600">{d.periodo}</span>
                      <span className={`text-sm font-black ${d.valor >= selectedIndicator.meta ? 'text-emerald-600' : 'text-rose-500'}`}>
                        {d.valor}{selectedIndicator.unidad}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => { setShowDetailModal(false); setShowMeasureForm(true); }}
              className="w-full py-4 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:from-indigo-600 hover:to-indigo-700 shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <FaPlus /> Registrar nuevo dato
            </button>
          </div>
        </div>
      )}

      {/* MEASURE MODAL */}
      {showMeasureForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <form onSubmit={handleAddMeasurement} className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl space-y-5 border-2 border-slate-100">
            <h2 className="text-xl font-black text-slate-900 tracking-tight text-center">Registrar Dato</h2>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Indicador</label>
              <select
                name="indicatorId"
                value={selectedKpiId}
                onChange={e => setSelectedKpiId(e.target.value)}
                required
                className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-indigo-400 transition-all"
              >
                <option value="">Selecciona...</option>
                {indicators.map(i => <option key={i.id} value={i.id}>{i.nombre}</option>)}
              </select>
            </div>

            <div className="bg-indigo-50 p-5 rounded-2xl border-2 border-indigo-100 space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black text-indigo-900 uppercase">Calcular % automático</label>
                <button
                  type="button"
                  onClick={() => setUseCalc(!useCalc)}
                  className={`w-12 h-6 rounded-full transition-all relative ${useCalc ? 'bg-indigo-500' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${useCalc ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
              {useCalc ? (
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Numerador"
                    className="w-full p-3 bg-white border-2 border-indigo-200 rounded-xl text-sm font-bold outline-none focus:border-indigo-400 transition-all"
                    onChange={e => setCalcNum(parseFloat(e.target.value) || 0)}
                  />
                  <div className="text-center text-indigo-300 font-black text-xs">÷</div>
                  <input
                    type="number"
                    placeholder="Denominador"
                    className="w-full p-3 bg-white border-2 border-indigo-200 rounded-xl text-sm font-bold outline-none focus:border-indigo-400 transition-all"
                    onChange={e => setCalcDen(parseFloat(e.target.value) || 1)}
                  />
                  <div className="text-center font-black text-indigo-700 text-lg bg-white/70 py-1.5 rounded-lg">
                    = {((calcNum / calcDen) * 100).toFixed(2)}%
                  </div>
                </div>
              ) : (
                <input
                  name="valor"
                  type="number"
                  step="0.01"
                  required
                  placeholder="Valor"
                  className="w-full p-4 bg-white border-2 border-indigo-200 rounded-2xl text-sm font-bold outline-none focus:border-indigo-400 transition-all"
                />
              )}
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Periodo</label>
              <input
                name="periodo"
                placeholder="Ej: Feb 2026"
                required
                className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-indigo-400 transition-all"
              />
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => { setShowMeasureForm(false); setUseCalc(false); }}
                className="flex-1 py-4 text-slate-400 hover:text-slate-600 font-black text-xs uppercase tracking-widest transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-4 bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 shadow-lg transition-all"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CREATE MODAL */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <form onSubmit={handleCreate} className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl space-y-4 border-2 border-slate-100">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Nuevo KPI</h2>
            <input
              name="nombre"
              required
              placeholder="Nombre del indicador"
              className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-indigo-400 transition-all"
            />
            <textarea
              name="descripcion"
              required
              placeholder="¿Qué mide?"
              className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-indigo-400 transition-all resize-none"
              rows={2}
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                name="meta"
                type="number"
                step="0.01"
                required
                placeholder="Meta"
                className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-indigo-400 transition-all"
              />
              <input
                name="unidad"
                required
                placeholder="Unidad (%, $…)"
                className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-indigo-400 transition-all"
              />
            </div>
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="flex-1 py-4 text-slate-400 hover:text-slate-600 font-black text-xs uppercase tracking-widest transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 shadow-xl transition-all"
              >
                Crear KPI
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
