'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { FaSpinner, FaCopy, FaTrash } from 'react-icons/fa';
import { BrainCircuit, Activity, Link as LinkIcon, CheckCircle, Search } from 'lucide-react';

export default function SaludMentalAdminPage() {
  const [activeTab, setActiveTab] = useState<'links' | 'results'>('links');
  const [loading, setLoading] = useState(false);
  const [evaluaciones, setEvaluaciones] = useState<any[]>([]);
  const [respuestas, setRespuestas] = useState<any[]>([]);

  // Form state
  const [employeeId, setEmployeeId] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [formulario, setFormulario] = useState<'A' | 'B'>('A');

  useEffect(() => {
    if (activeTab === 'links') fetchEvaluaciones();
    if (activeTab === 'results') fetchRespuestas();
  }, [activeTab]);

  const fetchEvaluaciones = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/gestion/salud-mental/evaluaciones');
      setEvaluaciones(res.data || []);
    } catch (error) {
      toast.error('Error al cargar evaluaciones');
    } finally {
      setLoading(false);
    }
  };

  const fetchRespuestas = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/gestion/salud-mental');
      setRespuestas(res.data || []);
    } catch (error) {
      toast.error('Error al cargar resultados');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateLink = async () => {
    if (!employeeId || !employeeName) {
      toast.error('Debe ingresar identificación y nombre del empleado');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/gestion/salud-mental/evaluaciones', {
        empleadoId: employeeId,
        empleadoNombre: employeeName,
        formulario
      });
      toast.success('Enlace generado correctamente');
      setEmployeeId('');
      setEmployeeName('');
      fetchEvaluaciones();
    } catch (error) {
      toast.error('Error al generar enlace');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLink = async (token: string) => {
    if (!confirm('¿Estás seguro de eliminar este enlace? Esta acción no se puede deshacer.')) return;
    try {
      await axios.delete(`/api/gestion/salud-mental/evaluaciones?token=${token}`);
      toast.success('Enlace eliminado correctamente');
      fetchEvaluaciones();
    } catch (error) {
      toast.error('Error al eliminar enlace');
    }
  };

  const copyToClipboard = (token: string) => {
    const url = `${window.location.origin}/evaluacion-psicosocial/${token}`;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url)
        .then(() => toast.success('Enlace copiado al portapapeles'))
        .catch(() => fallbackCopy(url));
    } else {
      fallbackCopy(url);
    }
  };

  const fallbackCopy = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      toast.success('Enlace copiado al portapapeles');
    } catch (err) {
      toast.error('Error al copiar. Por favor seleccione el enlace y cópielo manualmente.');
    }
    textArea.remove();
  };

  const getRiskColor = (risk: string) => {
    if (risk === 'Muy Alto') return 'text-red-500 bg-red-500/10 border-red-500/20';
    if (risk === 'Alto') return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
    if (risk === 'Medio') return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
    if (risk === 'Bajo') return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Riesgo Psicosocial</h1>
          <p className="text-slate-500 font-medium italic">Gestión de Evaluaciones y Resultados</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('links')}
            className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${activeTab === 'links' ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
          >
            Generar Enlaces
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${activeTab === 'results' ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
          >
            Resultados
          </button>
        </div>
      </div>

      {activeTab === 'links' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Nueva Evaluación</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="col-span-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Identificación</label>
                <input
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="Ej. 1020304050"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                />
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nombre Completo</label>
                <input
                  type="text"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  placeholder="Ej. Juan Pérez"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Formulario</label>
                <select
                  value={formulario}
                  onChange={(e) => setFormulario(e.target.value as 'A' | 'B')}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                >
                  <option value="A">Forma A (Jefes/Profesionales)</option>
                  <option value="B">Forma B (Operativos/Auxiliares)</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleGenerateLink}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-sm disabled:opacity-50"
              >
                {loading ? <FaSpinner className="animate-spin" /> : <LinkIcon className="w-4 h-4" />}
                Generar Enlace
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Fecha</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Empleado</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Forma</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Estado</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {evaluaciones.sort((a,b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()).map(ev => (
                  <tr key={ev.token} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-600">
                      {new Date(ev.fechaCreacion).toLocaleDateString('es-CO')}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-900">{ev.empleadoNombre}</p>
                      <p className="text-xs text-slate-500 font-mono">{ev.empleadoId}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-700 text-center">
                      {ev.formulario}
                    </td>
                    <td className="px-6 py-4">
                      {ev.estado === 'COMPLETADO' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full text-xs font-bold border border-emerald-200">
                          <CheckCircle className="w-3 h-3" /> Completado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full text-xs font-bold border border-orange-200">
                          <Activity className="w-3 h-3" /> Pendiente
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 max-w-xs">
                        <input 
                          type="text" 
                          readOnly 
                          value={`${window.location.origin}/evaluacion-psicosocial/${ev.token}`}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-500 font-mono focus:outline-none"
                          onClick={(e) => (e.target as HTMLInputElement).select()}
                        />
                        <button
                          onClick={() => copyToClipboard(ev.token)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors shrink-0"
                          title="Copiar Enlace"
                        >
                          <FaCopy className="w-4 h-4" />
                        </button>
                        {ev.estado !== 'COMPLETADO' && (
                          <button
                            onClick={() => handleDeleteLink(ev.token)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                            title="Eliminar Enlace"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {evaluaciones.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      No hay enlaces generados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'results' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
             <div className="p-12 flex justify-center">
               <FaSpinner className="animate-spin text-3xl text-slate-300" />
             </div>
          ) : respuestas.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-semibold">No hay resultados guardados</p>
              <p className="text-sm">Comparte enlaces con los empleados para empezar a ver resultados.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Fecha</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Empleado</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest text-center">Intralaboral</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest text-center">Extralaboral</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest text-center">Estrés</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {respuestas.sort((a,b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()).map(res => (
                    <tr key={res.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 text-sm font-medium text-slate-600">
                        {new Date(res.fecha).toLocaleDateString('es-CO')}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-900">{res.empleadoNombre}</p>
                        <p className="text-xs text-slate-500 font-mono">{res.empleadoId}</p>
                        <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">FORMA {res.formulario}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getRiskColor(res.nivelRiesgoIntra)}`}>
                          {res.nivelRiesgoIntra}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getRiskColor(res.nivelRiesgoExtra)}`}>
                          {res.nivelRiesgoExtra}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getRiskColor(res.nivelRiesgoEstres)}`}>
                          {res.nivelRiesgoEstres}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
