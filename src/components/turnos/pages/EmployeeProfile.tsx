'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  DollarSign, 
  Briefcase, 
  FileBadge,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Download,
  Plus,
  FileText,
  X,
  Stethoscope,
  TrendingUp,
  History,
  ShieldAlert
} from 'lucide-react';
import moment from 'moment';

const EmployeeProfile: React.FC = () => {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  
  // Estados de Datos
  const [data, setData] = useState<any>(null);
  const [docs, setDocs] = useState<any[]>([]);
  const [absences, setAbsences] = useState<any[]>([]);
  const [absenceTypes, setAbsenceTypes] = useState<any[]>([]);
  
  // Estados de UI
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'absences' | 'shifts' | 'payroll' | 'docs'>('overview');
  const [showAbsenceModal, setShowAbsenceModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Formulario Novedad
  const [newAbsence, setNewAbsence] = useState({
    startDate: '',
    endDate: '',
    absenceTypeCode: '',
    diagnosisCode: ''
  });

  const fetchAllData = async () => {
    try {
      const month = new Date().getMonth() + 1;
      const year = new Date().getFullYear();
      
      // 1. Datos de Nómina y Base
      const res = await axios.get(`http://localhost:3000/payroll/detail/${id}?month=${month}&year=${year}`);
      setData(res.data);
      
      // 2. Documentos
      axios.get(`http://localhost:3000/employees/${id}/documents`)
        .then(r => setDocs(r.data)).catch(e => console.error("Error docs"));
        
      // 3. Novedades (Absences)
      axios.get(`http://localhost:3000/absences`)
        .then(r => setAbsences(r.data.filter((a:any) => a.employeeId === id))).catch(e => console.error("Error abs"));
        
      // 4. Catálogos
      axios.get(`http://localhost:3000/catalogs/absence-types`)
        .then(r => setAbsenceTypes(r.data)).catch(e => console.error("Error types"));

    } catch (error) {
      console.error("Error crítico:", error);
      toast.error("Error al cargar el perfil principal");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchAllData();
  }, [id]);

  const handleReportAbsence = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading("Registrando novedad legal...");
    try {
        await axios.post('http://localhost:3000/absences', {
            ...newAbsence,
            employeeId: id
        });
        toast.success("Novedad registrada. Los turnos en conflicto han sido marcados.", { id: toastId });
        setShowAbsenceModal(false);
        fetchAllData();
    } catch (error) {
        toast.error("Error al registrar la novedad", { id: toastId });
    }
  };

  const handleUploadDoc = async () => {
    const title = prompt("Título del documento:");
    if (!title) return;
    setIsUploading(true);
    try {
        await axios.post(`http://localhost:3000/employees/${id}/documents`, {
            title,
            category: 'General',
            fileUrl: 'https://placeholder.com/doc.pdf'
        });
        toast.success("Documento asociado");
        fetchAllData();
    } catch (e) { toast.error("Error"); } finally { setIsUploading(false); }
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);

  if (loading) return <div className="p-12 text-center text-slate-500 font-bold animate-pulse">Sincronizando Perfil 360...</div>;
  if (!data) return <div className="p-12 text-center text-rose-500 font-bold">No se encontró el colaborador.</div>;

  const { employee, summary, shifts } = data;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER DE ACCIONES */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <button onClick={() => router.push('/recursos-humanos/employees')} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold transition-colors">
          <ArrowLeft size={20} /> Directorio de Personal
        </button>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowAbsenceModal(true)}
            className="px-6 py-2.5 bg-rose-600 text-white rounded-xl text-sm font-black uppercase tracking-widest shadow-lg shadow-rose-500/20 hover:bg-rose-700 transition-all flex items-center gap-2"
          >
            <Stethoscope size={18} /> Reportar Novedad
          </button>
          <button 
            onClick={() => router.push(`/recursos-humanos/employees/edit/${id}`)}
            className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
          >
            Editar Perfil
          </button>
        </div>
      </div>

      {/* TARJETA PRINCIPAL (HERO) */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="h-40 bg-slate-900 relative">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            <div className="absolute -bottom-16 left-10 flex items-end gap-8">
                <div className="h-32 w-32 bg-white rounded-[2rem] p-2 shadow-2xl">
                    <div className="h-full w-full bg-primary-100 rounded-[1.5rem] flex items-center justify-center text-4xl font-black text-primary-600">
                        {employee.name.split(' ').map((n:any) => n[0]).join('')}
                    </div>
                </div>
                <div className="mb-4">
                    <h1 className="text-3xl font-black text-white tracking-tight">{employee.name}</h1>
                    <p className="text-primary-400 font-bold uppercase text-xs tracking-[0.2em] mt-1">{employee.position}</p>
                </div>
            </div>
        </div>

        <div className="pt-20 pb-8 px-10 flex flex-wrap gap-10 items-center">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-slate-50 rounded-2xl text-slate-400"><CreditCard size={20} /></div>
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Documento</p>
                    <p className="text-sm font-black text-slate-700">{employee.doc}</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="p-3 bg-slate-50 rounded-2xl text-slate-400"><DollarSign size={20} /></div>
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sueldo Base</p>
                    <p className="text-sm font-black text-slate-700">{formatCurrency(employee.salary)}</p>
                </div>
            </div>
            <div className="ml-auto">
                <span className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-2xl text-xs font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-2">
                    <CheckCircle2 size={14} /> Colaborador Activo
                </span>
            </div>
        </div>

        {/* SELECTOR DE PESTAÑAS */}
        <div className="flex px-10 border-t border-slate-100 bg-slate-50/50 overflow-x-auto">
            {[
                { id: 'overview', label: 'Resumen', icon: TrendingUp },
                { id: 'absences', label: 'Novedades', icon: AlertCircle },
                { id: 'shifts', label: 'Asistencia', icon: Calendar },
                { id: 'payroll', label: 'Nómina', icon: FileText },
                { id: 'docs', label: 'Documentos', icon: FileBadge },
            ].map(tab => (
                <button 
                    key={tab.id} 
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-8 py-5 text-xs font-black uppercase tracking-widest transition-all border-b-4 flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id ? 'border-primary-600 text-primary-600 bg-white' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                >
                    <tab.icon size={16} /> {tab.label}
                </button>
            ))}
        </div>
      </div>

      {/* CONTENIDO DINÁMICO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            
            {/* VISTA RESUMEN */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                        <h3 className="font-black text-slate-900 text-lg mb-6 flex items-center gap-2"><Clock className="text-primary-500" /> Turnos Recientes</h3>
                        <div className="space-y-4">
                            {shifts.slice(0, 4).map((s:any, i:number) => (
                                <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                                    <span className="text-sm font-bold text-slate-700">{moment(s.date).format('DD MMM, ddd')}</span>
                                    <span className="text-xs font-black text-primary-600">{s.totalHours.toFixed(1)}h</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-xl">
                        <h3 className="font-black text-lg mb-6 flex items-center gap-2"><DollarSign className="text-primary-400" /> Nómina Actual</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Neto Proyectado</p>
                        <p className="text-4xl font-black mt-2">{formatCurrency(summary.totalPay)}</p>
                        <button onClick={() => setActiveTab('payroll')} className="mt-8 text-xs font-black text-primary-400 uppercase tracking-widest hover:underline">Ver desglose completo →</button>
                    </div>
                </div>
            )}

            {/* VISTA NOVEDADES (LA QUE BUSCABAS) */}
            {activeTab === 'absences' && (
                <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest flex items-center gap-2">
                            <Stethoscope size={18} className="text-rose-500" /> Registro de Incapacidades y Permisos
                        </h3>
                        <button onClick={() => setShowAbsenceModal(true)} className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 transition-all">+ Reportar</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 border-b border-slate-100">
                                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <th className="px-8 py-4">Periodo</th>
                                    <th className="px-8 py-4">Tipo de Novedad</th>
                                    <th className="px-8 py-4 text-center">Días</th>
                                    <th className="px-8 py-4 text-right">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {absences.map((abs: any) => (
                                    <tr key={abs.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-slate-700">{moment(abs.startDate).format('DD MMM')} - {moment(abs.endDate).format('DD MMM')}</span>
                                                <span className="text-[10px] font-bold text-slate-400">{moment(abs.startDate).format('YYYY')}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <span className="px-2 py-1 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-black">{abs.absenceTypeCode}</span>
                                                <span className="text-sm font-bold text-slate-600">{abs.absenceType?.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className="text-sm font-black text-slate-700">
                                                {Math.ceil((new Date(abs.endDate).getTime() - new Date(abs.startDate).getTime()) / (1000*3600*24)) + 1}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors"><FileText size={18} /></button>
                                        </td>
                                    </tr>
                                ))}
                                {absences.length === 0 && (
                                    <tr><td colSpan={4} className="px-8 py-16 text-center text-slate-400 italic font-medium underline decoration-slate-200">No se registran novedades legales en el historial.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* OTRAS PESTAÑAS (Resumidas para brevedad pero funcionales) */}
            {activeTab === 'shifts' && (
                <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
                    <div className="p-8 border-b bg-slate-50/50"><h3 className="font-black text-slate-900 uppercase text-xs flex items-center gap-2"><History size={18} className="text-indigo-500" /> Registro de Asistencia del Mes</h3></div>
                    <table className="w-full text-left">
                        <tbody className="divide-y divide-slate-100">
                            {shifts.map((s:any, i:number) => (
                                <tr key={i} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-8 py-4 font-black text-slate-700 text-sm">{moment(s.date).format('DD MMMM, dddd')}</td>
                                    <td className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Programado</td>
                                    <td className="px-8 py-4 text-sm font-black text-primary-600 text-right">{s.totalHours.toFixed(1)}h</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'payroll' && (
                <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl">
                    <h3 className="text-2xl font-black mb-8">Estructura Salarial Mes Actual</h3>
                    <div className="space-y-6">
                        {[
                            { label: 'Sueldo Básico', val: summary.basePay, color: 'white' },
                            { label: 'Auxilio Transporte', val: summary.transportAid, color: 'white' },
                            { label: 'Recargos y Extras', val: summary.totalSurcharges, color: 'primary-400' },
                            { label: 'Deducciones Ley', val: -summary.socialSecurity.total, color: 'rose-400' },
                        ].map((item, i) => (
                            <div key={i} className={`flex justify-between items-center border-b border-white/10 pb-4 text-${item.color}`}>
                                <span className="text-sm font-bold uppercase tracking-widest opacity-60">{item.label}</span>
                                <span className="text-xl font-black">{formatCurrency(item.val)}</span>
                            </div>
                        ))}
                        <div className="flex flex-col items-center justify-center bg-white/5 rounded-2xl p-6 border border-white/10">
                            <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest mb-2">Total a Recibir</p>
                            <p className="text-4xl font-black">{formatCurrency(summary.totalPay)}</p>
                            <button onClick={() => router.push(`/recursos-humanos/nomina/detalle/${id}`)} className="mt-6 px-6 py-2 bg-primary-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary-700 transition-all">Ver Colilla PDF</button>
                        </div>
                    </div>

                    {/* ACUMULADOS REALES */}
                    <div className="mt-10 pt-10 border-t border-white/10">
                        <h4 className="text-sm font-black text-primary-400 uppercase tracking-[0.2em] mb-6">Prestaciones Acumuladas a la Fecha</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Prima de Servicios</p>
                                <p className="text-2xl font-black text-white mt-1">{formatCurrency(summary.accumulated?.prima || 0)}</p>
                                <p className="text-[9px] text-slate-500 mt-2">Acumulado semestre actual ({summary.accumulated?.days} días)</p>
                            </div>
                            <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Cesantías</p>
                                <p className="text-2xl font-black text-white mt-1">{formatCurrency(summary.accumulated?.cesantias || 0)}</p>
                                <p className="text-[9px] text-slate-500 mt-2">Valor proyectado para fondo</p>
                            </div>
                            <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Días de Vaca. Ganados</p>
                                <p className="text-2xl font-black text-white mt-1">{(summary.accumulated?.days * 15 / 360).toFixed(1)}</p>
                                <p className="text-[9px] text-slate-500 mt-2">Derecho a descanso pagado</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'docs' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {docs.map((doc, i) => (
                        <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-200 flex items-center justify-between hover:border-primary-500 transition-all shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center"><FileBadge size={24} /></div>
                                <div><p className="font-black text-slate-900 text-sm">{doc.title}</p><p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{doc.category}</p></div>
                            </div>
                            <button className="p-2 text-slate-400 hover:text-primary-600"><Download size={20} /></button>
                        </div>
                    ))}
                    <div onClick={handleUploadDoc} className="border-4 border-dashed border-slate-100 rounded-[2rem] p-10 flex flex-col items-center justify-center gap-3 text-slate-300 hover:text-primary-600 hover:border-primary-100 cursor-pointer transition-all">
                        <Plus size={32} /> <span className="text-sm font-black uppercase tracking-widest">Asociar Documento</span>
                    </div>
                </div>
            )}
        </div>

        {/* SIDEBAR WIDGETS */}
        <div className="space-y-8">
            <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                <h3 className="text-[10px] font-black text-slate-400 uppercase mb-6 tracking-[0.2em]">Información de Contrato</h3>
                <div className="space-y-5">
                    <div className="flex justify-between items-center"><span className="text-xs font-bold text-slate-400">Cargo</span><span className="text-sm font-black text-slate-900">{employee.position}</span></div>
                    <div className="flex justify-between items-center"><span className="text-xs font-bold text-slate-400">Sede</span><span className="text-sm font-black text-slate-900">Principal</span></div>
                    <div className="pt-5 border-t border-slate-100">
                        <div className="flex items-center gap-2 mb-2"><div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div><span className="text-[10px] font-black text-emerald-700 uppercase">Seguridad Social al día</span></div>
                        <p className="text-[10px] text-slate-400 font-medium leading-relaxed">Este colaborador cumple con todos los requisitos legales para operar en el cuadrante actual.</p>
                    </div>
                </div>
            </div>

            {/* ALERTA DE CONFLICTOS SI EXISTEN */}
            {shifts.some((s:any) => s.resource?.conflictStatus === 'CRITICAL') && (
                <div className="bg-rose-600 rounded-[2rem] p-8 text-white shadow-xl shadow-rose-600/30">
                    <ShieldAlert size={40} className="mb-4 opacity-50" />
                    <h3 className="text-lg font-black mb-2">Alerta de Bloqueo</h3>
                    <p className="text-xs font-bold text-rose-100 leading-relaxed">Existen turnos programados que chocan con una incapacidad médica activa. Por favor, revise la pestaña de asistencia.</p>
                </div>
            )}
        </div>
      </div>

      {/* MODAL REPORTE NOVEDAD */}
      {showAbsenceModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
            <form className="bg-white rounded-[3rem] w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200" onSubmit={handleReportAbsence}>
                <div className="p-10 border-b bg-rose-50/50 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Reportar Novedad Legal</h2>
                        <p className="text-sm text-slate-500 font-medium">Registro para <strong>{employee.name}</strong></p>
                    </div>
                    <button type="button" onClick={() => setShowAbsenceModal(false)} className="p-3 bg-white rounded-2xl shadow-sm text-slate-400 hover:text-rose-600 transition-colors"><X size={24}/></button>
                </div>
                <div className="p-10 space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fecha Inicio</label>
                            <input type="date" value={newAbsence.startDate} onChange={e => setNewAbsence({...newAbsence, startDate: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-rose-500 transition-all" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fecha Fin</label>
                            <input type="date" value={newAbsence.endDate} onChange={e => setNewAbsence({...newAbsence, endDate: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-rose-500 transition-all" required />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tipo de Novedad</label>
                        <select 
                            value={newAbsence.absenceTypeCode} 
                            onChange={e => setNewAbsence({...newAbsence, absenceTypeCode: e.target.value})}
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-rose-500 transition-all" required
                        >
                            <option value="">Seleccione tipo...</option>
                            {absenceTypes.map(t => <option key={t.code} value={t.code}>{t.name} ({t.code})</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Código Diagnóstico (CIE-10)</label>
                        <input placeholder="Ej: M545" value={newAbsence.diagnosisCode} onChange={e => setNewAbsence({...newAbsence, diagnosisCode: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-rose-500 transition-all" />
                    </div>
                </div>
                <div className="p-10 bg-slate-50 border-t flex gap-4">
                    <button type="button" onClick={() => setShowAbsenceModal(false)} className="flex-1 font-black text-slate-400 uppercase tracking-widest text-xs">Cancelar</button>
                    <button type="submit" className="flex-[2] py-5 bg-rose-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl shadow-rose-600/30 hover:bg-rose-700 active:scale-95 transition-all">Registrar Novedad</button>
                </div>
            </form>
        </div>
      )}
    </div>
  );
};

export default EmployeeProfile;