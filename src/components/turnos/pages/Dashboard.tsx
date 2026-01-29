import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  Users, Calendar, AlertTriangle, Clock,
  CheckCircle2, Zap, ArrowUpRight
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get('/api/dashboard/stats');
      setStats(res.data);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al conectar con la central de datos");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-slate-500 font-medium">Iniciando sistemas de analítica...</div>;

  // Safety check for stats
  if (!stats) return <div className="p-8 text-slate-500 font-medium">No hay datos disponibles</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Panel de Control Gerencial</h1>
          <p className="text-slate-500 mt-1 font-medium italic">Vigilancia del cumplimiento y costos operativos en tiempo real.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 shadow-sm">
            {new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Colaboradores', val: stats.totalEmployees || 0, icon: Users, color: 'blue' },
          { label: 'Turnos del Mes', val: stats.totalShifts || 0, icon: Calendar, color: 'emerald' },
          { label: 'Sedes Activas', val: stats.totalSites || 0, icon: Clock, color: 'purple' },
          { label: 'Novedades Pendientes', val: stats.activeAbsences || 0, icon: AlertTriangle, color: 'amber' },
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className={`h-12 w-12 rounded-2xl bg-${item.color}-50 text-${item.color}-600 flex items-center justify-center mb-4`}>
              <item.icon size={24} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{item.val}</p>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-black text-slate-900">Turnos Recientes</h3>
                <p className="text-sm text-slate-400 font-medium">Últimas asignaciones del sistema</p>
              </div>
              <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <Clock size={20} />
              </div>
            </div>
            <div className="space-y-3">
              {(stats.recentShifts || []).length > 0 ? (
                stats.recentShifts.slice(0, 5).map((shift: any) => (
                  <div key={shift.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-500 transition-all">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{shift.firstName} {shift.lastName}</p>
                        <p className="text-xs text-slate-500 mt-1">{shift.siteName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-600">
                          {new Date(shift.startTime).toLocaleDateString('es-CO')}
                        </p>
                        <p className="text-xs text-slate-400">
                          {new Date(shift.startTime).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center opacity-40">
                  <CheckCircle2 size={48} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-sm font-bold text-slate-400">No hay turnos registrados</p>
                  <p className="text-xs text-slate-400 mt-2">Comienza creando empleados y asignando turnos</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl">
            <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
              <Zap size={24} className="text-amber-400" />
            </div>
            <h3 className="text-xl font-black mb-2">Acciones Rápidas</h3>
            <p className="text-sm text-slate-400 mb-6">Gestiona tu operación</p>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/recursos-humanos/employees/create')}
                className="w-full p-4 bg-white/10 hover:bg-white/20 rounded-xl text-left font-bold transition-all flex items-center justify-between group"
              >
                <span>Nuevo Empleado</span>
                <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
              <button
                onClick={() => router.push('/recursos-humanos/shifts')}
                className="w-full p-4 bg-white/10 hover:bg-white/20 rounded-xl text-left font-bold transition-all flex items-center justify-between group"
              >
                <span>Gestionar Turnos</span>
                <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
              <button
                onClick={() => router.push('/recursos-humanos/scheduler')}
                className="w-full p-4 bg-white/10 hover:bg-white/20 rounded-xl text-left font-bold transition-all flex items-center justify-between group"
              >
                <span>Programador</span>
                <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
            <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
              <CheckCircle2 size={24} className="text-emerald-600" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">Estado del Sistema</h3>
            <p className="text-sm text-slate-500 mb-6">Todos los servicios operativos</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">Base de Datos</span>
                <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold">Activo</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">API Services</span>
                <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold">Activo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;