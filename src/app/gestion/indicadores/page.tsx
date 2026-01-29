'use client';

import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import {
  FaMagic,
  FaPlus,
  FaTrash,
  FaChartLine,
  FaHistory,
  FaCalculator,
  FaChevronDown,
  FaChevronUp,
  FaSearch,
  FaArrowRight,
  FaSmile,
  FaMeh,
  FaFrown,
  FaDatabase,
  FaEquals
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
  const [searchTerm, setSearchSearchTerm] = useState('');
  const [expandedFormula, setExpandedFormula] = useState<string | null>(null);

  // Calculadora state
  const [useCalc, setUseCalc] = useState(false);
  const [calcNum, setCalcNum] = useState<number>(0);
  const [calcDen, setCalcDen] = useState<number>(1);
  const [selectedKpiId, setSelectedKpiId] = useState('');

  useEffect(() => {
    fetchIndicators();
  }, []);

  const fetchIndicators = async () => {
    try {
      const res = await axios.get('/api/gestion/indicadores');
      setIndicators(res.data || []);
    } catch (error) {
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
        toast.success('¡Listo! Indicadores generados exitosamente', { id: toastId });
        fetchIndicators();
      }
    } catch (error: any) {
      toast.error('Error al generar con IA');
    } finally {
      setGeneratingIA(false);
    }
  };

  const handleAddMeasurement = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const periodo = formData.get('periodo') as string;
    let valor = parseFloat(formData.get('valor') as string);

    if (useCalc) {
      valor = parseFloat(((calcNum / calcDen) * 100).toFixed(2));
    }

    const indicator = indicators.find(i => i.id === selectedKpiId);
    if (!indicator) return;

    const updatedIndicator = {
      ...indicator,
      datos: [...indicator.datos, { periodo, valor }]
    };

    try {
      await axios.put('/api/gestion/indicadores', updatedIndicator);
      toast.success(`Dato de ${valor}${indicator.unidad} registrado`);
      setShowMeasureForm(false);
      setUseCalc(false);
      fetchIndicators();
    } catch (error) {
      toast.error('Error al guardar');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Quieres eliminar este indicador permanentemente?')) return;
    const toastId = toast.loading('Eliminando...');
    try {
      await axios.delete(`/api/gestion/indicadores?id=${id}`);
      toast.success('Indicador eliminado', { id: toastId });
      fetchIndicators();
    } catch (error) {
      toast.error('No se pudo eliminar', { id: toastId });
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newIndicator: Indicator = {
      id: Date.now().toString(),
      nombre: formData.get('nombre') as string,
      descripcion: formData.get('descripcion') as string,
      formula: formData.get('formula') as string,
      fuente: formData.get('fuente') as string || undefined,
      unidad: formData.get('unidad') as string,
      meta: parseFloat(formData.get('meta') as string),
      frecuencia: 'Mensual',
      datos: []
    };

    const toastId = toast.loading('Creando indicador...');
    try {
      await axios.post('/api/gestion/indicadores', [newIndicator]);
      toast.success('¡KPI creado exitosamente!', { id: toastId });
      setShowCreateForm(false);
      fetchIndicators();
    } catch (error) {
      toast.error('Error al crear indicador', { id: toastId });
    }
  };

  const toggleFormula = (id: string) => {
    setExpandedFormula(expandedFormula === id ? null : id);
  };

  const getKpiStatus = (ind: Indicator) => {
    if (ind.datos.length === 0) return { color: 'slate', icon: FaMeh };
    const last = ind.datos[ind.datos.length - 1].valor;
    return last >= ind.meta ? { color: 'emerald', icon: FaSmile } : { color: 'rose', icon: FaFrown };
  };

  const filteredIndicators = indicators.filter(i => i.nombre.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return <div className="p-20 text-center text-slate-400 font-bold">Cargando tablero...</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">

      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-gradient-to-br from-white via-indigo-50/10 to-indigo-50/20 p-8 rounded-[2.5rem] border-2 border-indigo-100 shadow-lg shadow-indigo-100/50 hover:shadow-xl transition-shadow duration-300">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Indicadores</h1>
          <p className="text-slate-500 font-medium">Mide el éxito de tu estrategia.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={generateWithIA} className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:from-indigo-600 hover:to-indigo-700 shadow-lg shadow-indigo-200 hover:shadow-xl transition-all flex items-center gap-2">
            <FaMagic /> Sugerencias IA
          </button>
          <button onClick={() => setShowCreateForm(true)} className="bg-gradient-to-br from-slate-800 to-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:from-slate-700 hover:to-slate-800 shadow-xl hover:shadow-2xl transition-all flex items-center gap-2">
            <FaPlus /> Crear KPI
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Lista Lateral */}
        <div className="lg:col-span-4 space-y-6">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
            <input
              placeholder="Buscar..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-50 shadow-sm"
              value={searchTerm}
              onChange={e => setSearchSearchTerm(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            {filteredIndicators.map(ind => {
              const status = getKpiStatus(ind);
              return (
                <div key={ind.id} className="bg-gradient-to-br from-white to-slate-50 rounded-3xl border-2 border-slate-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group">
                  <div className={`h-2 w-full bg-gradient-to-r ${status.color === 'emerald' ? 'from-emerald-500 to-emerald-600' : status.color === 'rose' ? 'from-rose-500 to-rose-600' : 'from-slate-400 to-slate-500'}`} />
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-2 rounded-xl ${status.color === 'emerald' ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' : status.color === 'rose' ? 'bg-gradient-to-br from-rose-500 to-rose-600' : 'bg-gradient-to-br from-slate-400 to-slate-500'} text-white shadow-sm`}>
                        <status.icon size={20} />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setSelectedKpiId(ind.id); setShowMeasureForm(true); }}
                          className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 shadow-sm hover:shadow-md transition-all"
                          title="Registrar Dato"
                        >
                          <FaPlus size={12} />
                        </button>
                        <button
                          onClick={() => handleDelete(ind.id)}
                          className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          title="Eliminar"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </div>

                    <h4 className="font-black text-sm text-slate-900 uppercase mb-2">{ind.nombre}</h4>

                    {ind.fuente && (
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase mb-3">
                        <FaDatabase size={10} className="text-indigo-400" /> Fuente: <span className="text-slate-600">{ind.fuente}</span>
                      </div>
                    )}

                    <p className="text-xs text-slate-500 mb-4 line-clamp-2">{ind.descripcion}</p>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <span className="text-[10px] font-black text-slate-400 uppercase">Meta: {ind.meta}{ind.unidad}</span>
                      <button onClick={() => toggleFormula(ind.id)} className="text-[10px] font-black text-indigo-600 hover:text-indigo-700 uppercase flex items-center gap-1 transition-colors">
                        <FaCalculator /> Fórmula
                      </button>
                    </div>

                    {expandedFormula === ind.id && (
                      <div className="mt-4 p-4 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl animate-in zoom-in duration-200 shadow-lg">
                        <code className="text-xs text-emerald-400 font-mono block break-all">{ind.formula}</code>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Gráfico y Análisis */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-gradient-to-br from-white to-slate-50/50 p-8 rounded-[3rem] border-2 border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300 min-h-[500px]">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-8">Evolución de Metas</h2>
            <IndicatorChart indicators={indicators.map(i => ({
              name: i.nombre,
              goal: i.meta,
              unit: i.unidad,
              measurements: i.datos.map(d => ({ date: d.periodo, value: d.valor }))
            }))} />
          </div>
        </div>
      </div>

      {/* MODAL REGISTRO CON CALCULADORA */}
      {showMeasureForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <form onSubmit={handleAddMeasurement} className="bg-gradient-to-br from-white to-slate-50 rounded-[2.5rem] p-10 max-w-lg w-full shadow-2xl space-y-6 border-2 border-slate-200">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight text-center">Registrar Dato</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Indicador</label>
                <select name="indicatorId" value={selectedKpiId} onChange={e => setSelectedKpiId(e.target.value)} required className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all">
                  <option value="">Selecciona...</option>
                  {indicators.map(i => <option key={i.id} value={i.id}>{i.nombre}</option>)}
                </select>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 p-6 rounded-[2rem] border-2 border-indigo-200 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black text-indigo-900 uppercase">¿Usar calculadora?</label>
                  <button type="button" onClick={() => setUseCalc(!useCalc)} className={`w-12 h-6 rounded-full transition-all relative shadow-sm ${useCalc ? 'bg-gradient-to-r from-indigo-500 to-indigo-600' : 'bg-slate-300'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${useCalc ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>

                {useCalc ? (
                  <div className="space-y-3 animate-in fade-in duration-300">
                    <div className="grid grid-cols-1 gap-2">
                      <input type="number" placeholder="Numerador (ej: Clientes Satisfechos)" className="w-full p-3 bg-white border-2 border-indigo-200 rounded-xl text-sm font-bold outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all" onChange={e => setCalcNum(parseFloat(e.target.value))} />
                      <div className="h-px bg-indigo-300 w-1/2 mx-auto" />
                      <input type="number" placeholder="Denominador (ej: Total Encuestas)" className="w-full p-3 bg-white border-2 border-indigo-200 rounded-xl text-sm font-bold outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all" onChange={e => setCalcDen(parseFloat(e.target.value) || 1)} />
                    </div>
                    <div className="flex items-center justify-center gap-2 text-indigo-700 font-black bg-white/50 py-2 rounded-lg">
                      <FaEquals size={12} />
                      <span className="text-lg">{((calcNum / calcDen) * 100).toFixed(2)}%</span>
                    </div>
                  </div>
                ) : (
                  <input name="valor" type="number" step="0.01" placeholder="Ingresa el valor directo" className="w-full p-4 bg-white border-2 border-indigo-200 rounded-2xl text-sm font-bold outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all" />
                )}
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Periodo (Mes/Año)</label>
                <input name="periodo" placeholder="Ej: Feb 2026" required className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all" />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowMeasureForm(false)} className="flex-1 py-4 text-slate-400 hover:text-slate-600 font-black text-xs uppercase tracking-widest transition-colors">Cerrar</button>
              <button type="submit" className="flex-1 py-4 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:from-indigo-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all">Guardar</button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL CREAR (Simplificado) */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <form onSubmit={handleCreate} className="bg-gradient-to-br from-white to-slate-50 rounded-[2.5rem] p-10 max-w-lg w-full shadow-2xl space-y-6 border-2 border-slate-200">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Nuevo Indicador</h2>
            <div className="space-y-4">
              <input name="nombre" required placeholder="Nombre del KPI" className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all" />
              <input name="fuente" placeholder="Fuente de información (ej: CRM, Excel)" className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all" />
              <textarea name="descripcion" required placeholder="¿Qué mide?" className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all" rows={2} />
              <input name="formula" required placeholder="Fórmula" className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all" />
              <div className="grid grid-cols-2 gap-4">
                <input name="meta" type="number" step="0.01" placeholder="Meta" className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all" />
                <input name="unidad" placeholder="Unidad (%)" className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all" />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowCreateForm(false)} className="flex-1 py-4 text-slate-400 hover:text-slate-600 font-black text-xs uppercase tracking-widest transition-colors">Cancelar</button>
              <button type="submit" className="flex-1 py-4 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:from-slate-700 hover:to-slate-800 shadow-xl hover:shadow-2xl transition-all">Guardar KPI</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}