import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, 
  Download, 
  Building2, 
  Users, 
  FileText, 
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/es';
import { toast } from 'sonner';

moment.locale('es');

const SocialSecurityPage: React.FC = () => {
  const [report, setReport] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchReport();
  }, [month, year]);

  const fetchReport = async () => {
    setLoading(true);
    try {
        const res = await axios.get(`http://localhost:3000/social-security/report?month=${month}&year=${year}`);
        setReport(res.data);
    } catch (err) {
        console.error(err);
        toast.error("Error al cargar reporte de seguridad social");
    } finally {
        setLoading(false);
    }
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);

  const handleExportPila = async () => {
    try {
        const res = await axios.get(`http://localhost:3000/social-security/export-pila?month=${month}&year=${year}`, {
            responseType: 'blob'
        });
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `PILA_${year}_${String(month).padStart(2,'0')}.txt`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success("Archivo plano generado exitosamente");
    } catch (err) {
        toast.error("Error al exportar PILA");
    }
  };

  const totalEmployerCost = report.reduce((acc, row) => acc + row.employer.total, 0);
  const totalEmployeeCost = report.reduce((acc, row) => acc + row.employee.total, 0);
  const totalParafiscales = report.reduce((acc, row) => acc + row.employer.caja + row.employer.icbf + row.employer.sena, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Seguridad Social (PILA)</h1>
          <p className="text-slate-500 mt-1 font-medium">Gestión de aportes a Salud, Pensión y Parafiscales.</p>
        </div>
        <div className="flex items-center gap-3">
            <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden">
                <select value={month} onChange={e => setMonth(Number(e.target.value))} className="px-3 py-2 text-sm font-bold text-slate-700 bg-transparent outline-none border-r border-slate-100">
                    {Array.from({length: 12}, (_, i) => i + 1).map(m => <option key={m} value={m}>{moment().month(m-1).format('MMMM')}</option>)}
                </select>
                <input type="number" value={year} onChange={e => setYear(Number(e.target.value))} className="w-20 px-3 py-2 text-sm font-bold text-slate-700 bg-transparent outline-none" />
            </div>
            <button onClick={handleExportPila} className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-black hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-all">
                <FileText size={18} /> EXPORTAR PLANO
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <ShieldCheck size={120} className="text-emerald-900" />
            </div>
            <p className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-1">Aporte Total Empresa</p>
            <p className="text-3xl font-black text-emerald-900">{formatCurrency(totalEmployerCost)}</p>
            <p className="mt-4 text-[10px] font-bold text-emerald-700 uppercase tracking-tight">Incluye Salud, Pensión, ARL y Parafiscales</p>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
            <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Users size={24} /></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Deducciones Nómina</span>
            </div>
            <p className="text-2xl font-black text-slate-900">{formatCurrency(totalEmployeeCost)}</p>
            <p className="mt-1 text-xs font-medium text-slate-500">Aporte a cargo de empleados (8%)</p>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
            <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Building2 size={24} /></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Parafiscales</span>
            </div>
            <p className="text-2xl font-black text-slate-900">{formatCurrency(totalParafiscales)}</p>
            <p className="mt-1 text-xs font-medium text-slate-500">Cajas de Compensación, ICBF, SENA</p>
        </div>
      </div>

      {/* DETALLE */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest">Planilla Integrada de Autoliquidación</h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Periodo: {moment().month(month-1).format('MMMM')} {year}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Empleado</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">IBC</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right text-rose-500">Salud (Total)</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right text-indigo-500">Pensión (Total)</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right text-emerald-600">ARL</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right text-amber-600">Parafiscales</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Total Aporte</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={7} className="px-8 py-16 text-center text-slate-400 italic font-medium">Calculando aportes de seguridad social...</td></tr>
              ) : report.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                        <span className="font-bold text-slate-900 text-xs">{row.employee.name}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{row.employee.doc}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-slate-600 text-xs">{formatCurrency(row.ibc)}</td>
                  
                  <td className="px-6 py-4 text-right">
                    <div className="flex flex-col items-end">
                        <span className="font-bold text-slate-900 text-xs">{formatCurrency(row.employee.health + row.employer.health)}</span>
                        <span className="text-[9px] text-slate-400">Pat: {formatCurrency(row.employer.health)}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex flex-col items-end">
                        <span className="font-bold text-slate-900 text-xs">{formatCurrency(row.employee.pension + row.employer.pension)}</span>
                        <span className="text-[9px] text-slate-400">Pat: {formatCurrency(row.employer.pension)}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right font-bold text-emerald-700 text-xs">{formatCurrency(row.employer.arl)}</td>
                  <td className="px-6 py-4 text-right font-bold text-amber-700 text-xs">{formatCurrency(row.employer.caja + row.employer.icbf + row.employer.sena)}</td>
                  
                  <td className="px-6 py-4 text-right">
                    <span className="font-black text-slate-900 text-sm">
                        {formatCurrency(row.employee.total + row.employer.total)}
                    </span>
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

export default SocialSecurityPage;
