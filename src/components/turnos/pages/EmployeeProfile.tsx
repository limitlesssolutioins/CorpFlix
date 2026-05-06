'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { 
  ArrowLeft, Calendar, Clock, DollarSign, Briefcase, FileBadge,
  AlertCircle, CheckCircle2, ChevronRight, CreditCard, Download,
  Plus, FileText, X, Stethoscope, TrendingUp, History, ShieldAlert,
  MapPin, Phone, Mail, Home, Building, Landmark, User, HeartPulse,
  Award, AlertTriangle, Search
} from 'lucide-react';
import moment from 'moment';
import 'moment/locale/es';

import { 
    getEmployeeByIdAction, 
    getEmployeeSalaryHistoryAction,
    getEmployeePositionHistoryAction,
    getEmployeeDisciplinaryRecordsAction,
    getEmployeePerformanceEvaluationsAction
} from '@/actions/employee';
import { getEmployeeAttendanceLogsAction, getActiveAttendanceLogAction, clockInAction, clockOutAction } from '@/actions/attendance';

moment.locale('es');

const EmployeeProfile: React.FC = () => {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  
  // Datos
  const [employee, setEmployee] = useState<any>(null);
  const [salaryHistory, setSalaryHistory] = useState<any[]>([]);
  const [positionHistory, setPositionHistory] = useState<any[]>([]);
  const [disciplinary, setDisciplinary] = useState<any[]>([]);
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [activeLog, setActiveLog] = useState<any>(null);
  
  // UI
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'labor' | 'history' | 'attendance' | 'docs'>('overview');

  const fetchData = async () => {
    try {
      const emp = await getEmployeeByIdAction(id);
      if (!emp) {
        toast.error("Colaborador no encontrado");
        return;
      }
      setEmployee(emp);

      // Fetch parallel history
      const [salaries, positions, disc, evals, logs, currentLog] = await Promise.all([
        getEmployeeSalaryHistoryAction(id),
        getEmployeePositionHistoryAction(id),
        getEmployeeDisciplinaryRecordsAction(id),
        getEmployeePerformanceEvaluationsAction(id),
        getEmployeeAttendanceLogsAction(id),
        getActiveAttendanceLogAction(id)
      ]);

      setSalaryHistory(salaries);
      setPositionHistory(positions);
      setDisciplinary(disc);
      setEvaluations(evals);
      setAttendance(logs);
      setActiveLog(currentLog);

    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Error al sincronizar el expediente");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const handleClockToggle = async () => {
    try {
        if (activeLog) {
            await clockOutAction(id, activeLog.id);
            toast.success("Salida registrada");
        } else {
            // Get location if possible
            let lat, lon;
            try {
                const pos = await new Promise<GeolocationPosition>((res, rej) => navigator.geolocation.getCurrentPosition(res, rej));
                lat = pos.coords.latitude;
                lon = pos.coords.longitude;
            } catch (e) {
                console.warn("Location denied");
            }
            await clockInAction(id, lat, lon, lat ? 'GPS' : 'MANUAL');
            toast.success("Entrada registrada");
        }
        fetchData();
    } catch (e) {
        toast.error("Error al registrar asistencia");
    }
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-bold">Sincronizando Expediente 360...</p>
    </div>
  );
  
  if (!employee) return <div className="p-12 text-center text-rose-500 font-bold">No se encontró el colaborador.</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <button onClick={() => router.push('/gestion-humana/employees')} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold transition-colors">
          <ArrowLeft size={20} /> Directorio de Personal
        </button>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleClockToggle}
            className={`px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest shadow-lg transition-all flex items-center gap-2 ${activeLog ? 'bg-rose-100 text-rose-700 hover:bg-rose-200' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/20'}`}
          >
            <Clock size={18} /> {activeLog ? 'Registrar Salida' : 'Registrar Entrada'}
          </button>
          <button 
            onClick={() => router.push(`/gestion-humana/employees/edit/${id}`)}
            className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
          >
            Editar Expediente
          </button>
        </div>
      </div>

      {/* HERO CARD */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="h-44 bg-gradient-to-r from-slate-900 to-slate-800 relative">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            <div className="absolute -bottom-16 left-10 flex items-end gap-8">
                <div className="h-32 w-32 bg-white rounded-[2rem] p-2 shadow-2xl">
                    <div className="h-full w-full bg-primary-100 rounded-[1.5rem] flex items-center justify-center text-4xl font-black text-primary-600">
                        {employee.firstName[0]}{employee.lastName[0]}
                    </div>
                </div>
                <div className="mb-4">
                    <h1 className="text-3xl font-black text-white tracking-tight">{employee.firstName} {employee.lastName}</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-primary-400 font-bold uppercase text-xs tracking-[0.2em]">{employee.positionName || 'Cargo no asignado'}</p>
                        <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
                        <p className="text-slate-400 font-medium text-xs uppercase tracking-widest">{employee.teamName || 'Sin área'}</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="pt-20 pb-8 px-10 flex flex-wrap gap-8 items-center border-b border-slate-100">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 rounded-2xl text-blue-500"><CreditCard size={20} /></div>
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Documento</p>
                    <p className="text-sm font-black text-slate-700">{employee.documentType} {employee.identification}</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-500"><Landmark size={20} /></div>
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contrato</p>
                    <p className="text-sm font-black text-slate-700">{employee.contractType}</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="p-3 bg-violet-50 rounded-2xl text-violet-500"><DollarSign size={20} /></div>
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sueldo Base</p>
                    <p className="text-sm font-black text-slate-700">{formatCurrency(employee.salaryAmount)}</p>
                </div>
            </div>
            <div className="ml-auto">
                <span className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest border flex items-center gap-2 ${employee.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                    {employee.isActive ? <CheckCircle2 size={14} /> : <X size={14} />} 
                    {employee.isActive ? 'Activo' : 'Inactivo'}
                </span>
            </div>
        </div>

        {/* TABS */}
        <div className="flex px-10 bg-slate-50/50 overflow-x-auto">
            {[
                { id: 'overview', label: 'Personal', icon: User },
                { id: 'labor', label: 'Laboral / Nómina', icon: Briefcase },
                { id: 'history', label: 'Historial', icon: History },
                { id: 'attendance', label: 'Asistencia', icon: Calendar },
                { id: 'docs', label: 'Expediente Digital', icon: FileBadge },
            ].map(tab => (
                <button 
                    key={tab.id} 
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-6 py-5 text-xs font-black uppercase tracking-widest transition-all border-b-2 relative ${activeTab === tab.id ? 'text-primary-600 border-primary-600 bg-white' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
                >
                    <tab.icon size={16} />
                    {tab.label}
                </button>
            ))}
        </div>

        <div className="p-10">
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <User size={18} className="text-primary-500" /> Información Básica
                            </h3>
                            <div className="grid grid-cols-2 gap-y-6">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nacimiento</p>
                                    <p className="text-sm font-bold text-slate-700">{employee.birthDate ? moment(employee.birthDate).format('LL') : 'No registrado'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Género / Sangre</p>
                                    <p className="text-sm font-bold text-slate-700">{employee.gender || '-'} / {employee.bloodType || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ciudad Expedición</p>
                                    <p className="text-sm font-bold text-slate-700">{employee.documentExpeditionCity || 'No registrado'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Celular</p>
                                    <p className="text-sm font-bold text-slate-700 flex items-center gap-1"><Phone size={14} className="text-slate-300" /> {employee.phone}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</p>
                                    <p className="text-sm font-bold text-slate-700 flex items-center gap-1"><Mail size={14} className="text-slate-300" /> {employee.email}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dirección</p>
                                    <p className="text-sm font-bold text-slate-700 flex items-center gap-1"><Home size={14} className="text-slate-300" /> {employee.address}, {employee.city}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Building size={18} className="text-primary-500" /> Información Bancaria
                            </h3>
                            <div className="bg-slate-50 rounded-[1.5rem] p-6 border border-slate-100 grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Banco</p>
                                    <p className="text-base font-black text-slate-800">{employee.bankName || 'Pendiente'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipo</p>
                                    <p className="text-sm font-bold text-slate-700">{employee.bankAccountType || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Número</p>
                                    <p className="text-sm font-bold text-slate-700 font-mono tracking-wider">{employee.bankAccountNumber || '****'}</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <ShieldAlert size={18} className="text-rose-500" /> Contacto de Emergencia
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nombre</p>
                                    <p className="text-sm font-bold text-slate-700">{employee.emergencyContactName || 'No registrado'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Teléfono</p>
                                    <p className="text-sm font-bold text-slate-700">{employee.emergencyContactPhone || '-'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'labor' && (
                <div className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 grid grid-cols-2 gap-8">
                            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Entidades de Seguridad Social</h4>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-slate-500">EPS</span>
                                        <span className="text-xs font-black text-slate-800 bg-blue-50 px-2 py-1 rounded-lg">{employee.healthFund || 'Pendiente'}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-slate-500">AFP (Pensión)</span>
                                        <span className="text-xs font-black text-slate-800 bg-indigo-50 px-2 py-1 rounded-lg">{employee.pensionFund || 'Pendiente'}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-slate-500">Cesantías</span>
                                        <span className="text-xs font-black text-slate-800 bg-slate-100 px-2 py-1 rounded-lg">{employee.severanceFund || 'Pendiente'}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-slate-500">ARL / Clase</span>
                                        <span className="text-xs font-black text-slate-800 bg-orange-50 px-2 py-1 rounded-lg">{employee.arl || '-'} / {employee.riskClass || 'I'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Información de Nómina</h4>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-slate-500">Sueldo Integral</span>
                                        <span className="text-xs font-black text-slate-800">{employee.isIntegralSalary ? 'Sí' : 'No'}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-slate-500">Centro de Costo</span>
                                        <span className="text-xs font-black text-slate-800">{employee.costCenter || 'No asignado'}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-slate-500">Grupo Nómina</span>
                                        <span className="text-xs font-black text-slate-800">{employee.payrollGroup || '-'}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-slate-500">Fecha Ingreso</span>
                                        <span className="text-xs font-black text-slate-800">{moment(employee.startDate).format('LL')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden group">
                             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><DollarSign size={80} /></div>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Salario Base Actual</p>
                             <h4 className="text-3xl font-black mb-6">{formatCurrency(employee.salaryAmount)}</h4>
                             <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-black uppercase tracking-widest transition-all">
                                 Ver Proyección de Nómina
                             </button>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'history' && (
                <div className="space-y-12">
                    {/* SALARIOS */}
                    <div>
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <TrendingUp size={18} className="text-emerald-500" /> Historial Salarial
                        </h3>
                        <div className="space-y-4">
                            {salaryHistory.length > 0 ? salaryHistory.map((s, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:shadow-md transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg font-black text-xs">+{Math.round((s.amount/employee.salaryAmount)*100)}%</div>
                                        <div>
                                            <p className="text-sm font-black text-slate-800">{formatCurrency(s.amount)}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">{s.reason || 'Ajuste anual'}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-slate-400">{moment(s.changeDate).format('MMMM YYYY')}</span>
                                </div>
                            )) : (
                                <p className="text-xs text-slate-400 italic">No hay registros previos de cambios salariales.</p>
                            )}
                        </div>
                    </div>
                    {/* SANCIONES */}
                    <div>
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <AlertTriangle size={18} className="text-rose-500" /> Registro Disciplinario
                        </h3>
                        <div className="space-y-4">
                            {disciplinary.length > 0 ? disciplinary.map((d, i) => (
                                <div key={i} className="p-4 bg-rose-50/30 border border-rose-100 rounded-2xl flex items-start gap-4">
                                    <div className="p-3 bg-rose-100 text-rose-600 rounded-xl"><AlertCircle size={20} /></div>
                                    <div className="flex-1">
                                        <div className="flex justify-between mb-1">
                                            <p className="text-sm font-black text-slate-800">{d.type}</p>
                                            <span className="text-[10px] font-black text-slate-400">{moment(d.incidentDate).format('LL')}</span>
                                        </div>
                                        <p className="text-xs text-slate-600 leading-relaxed">{d.description}</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-10 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                                    <CheckCircle2 size={32} className="mx-auto text-emerald-400 mb-2" />
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Sin antecedentes disciplinarios</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'attendance' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                            <Clock size={18} className="text-primary-500" /> Registros de Tiempo (Últimos 30 días)
                        </h3>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest">Exportar Excel</button>
                        </div>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Entrada</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Salida</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ubicación / Método</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Total Horas</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {attendance.map((log, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 text-xs font-bold text-slate-700">{moment(log.clockIn).format('ddd DD MMM')}</td>
                                        <td className="px-6 py-4 text-xs font-black text-slate-900">{moment(log.clockIn).format('HH:mm')}</td>
                                        <td className="px-6 py-4 text-xs font-black text-slate-900">{log.clockOut ? moment(log.clockOut).format('HH:mm') : '--:--'}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5">
                                                {log.method === 'GPS' ? <MapPin size={12} className="text-blue-500" /> : <User size={12} className="text-slate-400" />}
                                                <span className="text-[10px] font-bold text-slate-500 uppercase">{log.method}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {log.clockOut ? (
                                                <span className="text-xs font-black text-primary-600 bg-primary-50 px-2 py-1 rounded-lg">
                                                    {(moment.duration(moment(log.clockOut).diff(moment(log.clockIn))).asHours()).toFixed(1)}h
                                                </span>
                                            ) : (
                                                <span className="text-[10px] font-black text-rose-500 animate-pulse">EN TURNO</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'docs' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: 'Contrato Laboral', cat: 'CONTRACT', desc: 'Vigente y firmado', color: 'blue' },
                        { title: 'Soportes Seguridad Social', cat: 'SS', desc: 'EPS, ARL, Pensión', color: 'emerald' },
                        { title: 'Certificaciones Médicas', cat: 'MEDICAL', desc: 'Exámenes de ingreso/egreso', color: 'rose' },
                        { title: 'Formación y Cursos', cat: 'TRAINING', desc: 'Diplomas y certificados', color: 'violet' },
                        { title: 'Documento Identidad', cat: 'ID', desc: 'Copia CC/CE ampliada', color: 'orange' },
                        { title: 'Otrosí / Adendas', cat: 'ANNEX', desc: 'Modificaciones al contrato', color: 'slate' },
                    ].map((folder, i) => (
                        <div key={i} className="p-6 bg-white border border-slate-200 rounded-3xl hover:border-primary-500 hover:shadow-xl hover:shadow-primary-500/10 transition-all group cursor-pointer">
                            <div className={`w-12 h-12 bg-${folder.color}-50 text-${folder.color}-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <FileText size={24} />
                            </div>
                            <h4 className="text-sm font-black text-slate-800 mb-1">{folder.title}</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{folder.desc}</p>
                            <div className="mt-4 flex items-center justify-between pt-4 border-t border-slate-50">
                                <span className="text-[10px] font-black text-primary-600">Ver 0 archivos</span>
                                <button className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors"><Plus size={16} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
