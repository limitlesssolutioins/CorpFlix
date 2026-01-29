import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  ShieldCheck, 
  User, 
  Calendar, 
  Activity, 
  Search,
  ArrowLeftRight,
  Database,
  History
} from 'lucide-react';
import moment from 'moment';

const AuditLogPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000/audit')
      .then(res => setLogs(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'UPDATE': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'DELETE': return 'bg-rose-50 text-rose-700 border-rose-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  const filteredLogs = logs.filter(log => 
    log.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.performedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <ShieldCheck className="text-primary-600" size={32} />
            Auditoría de Seguridad
          </h1>
          <p className="text-slate-500 mt-1 font-medium italic">Historial inmutable de todas las acciones realizadas en el sistema.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
            <div className="px-4 py-2 text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <History size={14} />
                Logs Activos: {logs.length}
            </div>
        </div>
      </div>

      {/* BLOQUE EXPLICATIVO */}
      <div className="bg-primary-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-primary-600/20 relative overflow-hidden">
        <ShieldCheck size={120} className="absolute -right-8 -bottom-8 opacity-10 rotate-12" />
        <div className="max-w-2xl relative">
            <h2 className="text-xl font-black mb-2 uppercase tracking-widest">¿Por qué es importante este módulo?</h2>
            <p className="text-primary-100 text-sm leading-relaxed font-medium">
                Este registro es la **memoria inmutable** de su empresa. Cada vez que alguien crea, edita o elimina un turno o un empleado, el sistema guarda rastro. Esto previene fraudes, protege contra la manipulación de horas extras y le da al gerente total control sobre quién está modificando la operación.
            </p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[300px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Filtrar por entidad, usuario o acción..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                />
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-8 py-4">Sello de Tiempo</th>
                <th className="px-8 py-4">Actor</th>
                <th className="px-8 py-4">Acción</th>
                <th className="px-8 py-4">Entidad</th>
                <th className="px-8 py-4">Identificador</th>
                <th className="px-8 py-4">Detalles Técnicos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={6} className="px-8 py-12 text-center text-slate-400 italic font-medium">Sincronizando con el servidor de seguridad...</td></tr>
              ) : filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-700">{moment(log.createdAt).format('DD MMM, YYYY')}</span>
                        <span className="text-[10px] font-bold text-slate-400">{moment(log.createdAt).format('HH:mm:ss')}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                            <User size={14} />
                        </div>
                        <span className="text-sm font-bold text-slate-600">{log.performedBy}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getActionColor(log.action)}`}>
                        {log.action}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase">
                        <Database size={14} />
                        {log.entity}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <code className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-500 font-mono">
                        {log.entityId.substring(0, 8)}...
                    </code>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-[11px] text-slate-400 font-medium max-w-xs truncate group-hover:max-w-none transition-all">
                        {log.details}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogPage;
