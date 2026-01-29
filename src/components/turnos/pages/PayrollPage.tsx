'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import moment from 'moment';
import 'moment/locale/es';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

moment.locale('es');

import { 
  Eye, 
  Download, 
  DollarSign, 
  ArrowUpRight,
  Printer,
  Info,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { generatePayrollReportAction } from '@/actions/payroll';

interface PayrollPageProps {
  title?: string;
}

const PayrollPage: React.FC<PayrollPageProps> = ({ title = "Nómina y Liquidación" }) => {
  const router = useRouter();
  const [report, setReport] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [period, setPeriod] = useState<'1' | '2' | 'full'>('full');

  const [showHelper, setShowHelper] = useState<string | null>(null);

  useEffect(() => {
    fetchPayroll();
  }, [month, year, period]);

  const fetchPayroll = async () => {
    setLoading(true);
    try {
        const data = await generatePayrollReportAction(month, year, period);
        setReport(data);
    } catch (err) {
        console.error(err);
        toast.error("Error al calcular nómina");
    } finally {
        setLoading(false);
    }
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);

  const handleExportExcel = () => {
    if (report.length === 0) return;
    const dataToExport = report.map(row => ({
      'Empleado': row.employeeName,
      'Periodo': row.periodLabel,
      'Días': row.daysWorked,
      'Sueldo Base': Math.round(row.basePay),
      'Recargos': Math.round(row.surchargeTotal),
      'Transporte': Math.round(row.transportAid),
      'Deducciones': Math.round(row.socialSecurity?.total || 0),
      'Neto': Math.round(row.totalPay)
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Nómina");
    XLSX.writeFile(workbook, `Nomina_${period}_${month}_${year}.xlsx`);
  };

  const totalPayroll = report.reduce((acc, row) => acc + row.totalPay, 0);
  const totalDeductions = report.reduce((acc, row) => acc + (row.socialSecurity?.total || 0), 0);
  const totalProvisions = report.reduce((acc, row) => acc + (row.provisions?.total || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h1>
          <p className="text-slate-500 mt-1 font-medium">Gestión de pagos mensuales y quincenales según ley.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleExportExcel} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors">
            <Download size={18} /> Excel
          </button>
          <button onClick={() => router.push('/recursos-humanos/nomina/consolidado')} className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 shadow-lg transition-all">
            <Printer size={18} /> Reporte Gerencial
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Selector de Periodo */}
        <div className="bg-primary-600 p-6 rounded-[2rem] text-white shadow-xl shadow-primary-500/20">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-4">Control de Tiempo</p>
          <div className="space-y-3">
            <select value={period} onChange={e => setPeriod(e.target.value as any)} className="w-full bg-primary-700 text-white border-none rounded-xl p-3 text-xs font-black outline-none appearance-none">
                <option value="full">MES COMPLETO (30 DÍAS)</option>
                <option value="1">1RA QUINCENA (DÍA 1-15)</option>
                <option value="2">2DA QUINCENA (DÍA 16-30)</option>
            </select>
            <div className="flex gap-2">
                <select value={month} onChange={e => setMonth(Number(e.target.value))} className="bg-primary-700 text-white border-none rounded-xl p-3 text-xs font-black outline-none flex-1">
                    {Array.from({length: 12}, (_, i) => i + 1).map(m => <option key={m} value={m}>{moment().month(m-1).format('MMMM')}</option>)}
                </select>
                <input type="number" value={year} onChange={e => setYear(Number(e.target.value))} className="bg-primary-700 text-white border-none rounded-xl p-3 text-xs font-black outline-none w-20" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Neto a Pagar</p>
          <p className="text-2xl font-black text-slate-900">{formatCurrency(totalPayroll)}</p>
          <div className="mt-4 flex items-center gap-2 text-emerald-600 text-[10px] font-black uppercase">
            <CheckCircle2 size={14} /> Listo para Dispersión
          </div>
        </div>

        {/* Info de Provisiones */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm group">
          <div className="flex justify-between items-start mb-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Provisiones Sociales</p>
            <button onMouseEnter={() => setShowHelper('prov')} onMouseLeave={() => setShowHelper(null)} className="text-slate-300 hover:text-primary-500"><Info size={16}/></button>
          </div>
          <p className="text-2xl font-black text-indigo-600">{formatCurrency(totalProvisions)}</p>
          {showHelper === 'prov' && (
            <div className="absolute top-full left-0 right-0 mt-2 z-20 p-4 bg-slate-900 text-white text-[10px] rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-2">
                <strong>¿Qué es esto?</strong> Son ahorros obligatorios (Prima, Cesantías, Vacaciones) que la empresa debe guardar para pagarte después. No es dinero que recibes hoy, sino un "colchón" legal.
            </div>
          )}
          <p className="mt-4 text-[9px] text-slate-400 font-bold leading-tight uppercase tracking-tighter">Ahorro proyectado para pagos de Junio/Diciembre y retiro.</p>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Seguridad Social aportada</p>
          <p className="text-2xl font-black text-rose-600">{formatCurrency(totalDeductions)}</p>
          <p className="mt-4 text-[9px] text-slate-400 font-bold leading-tight uppercase tracking-tighter">Aportes a Salud y Pensión realizados por los colaboradores.</p>
        </div>
      </div>

      {/* COSTO TOTAL CON EXPLICACIÓN */}
      <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-slate-900/40 relative group">
        <div className="flex items-center gap-6">
            <div className="h-16 w-16 bg-primary-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20 text-white">
                <DollarSign size={32} />
            </div>
            <div>
                <div className="flex items-center gap-2">
                    <p className="text-xs font-black text-primary-400 uppercase tracking-[0.2em]">Pasivo Laboral Total (Costo Empresa)</p>
                    <button onMouseEnter={() => setShowHelper('pasivo')} onMouseLeave={() => setShowHelper(null)} className="text-white/20 hover:text-white transition-colors"><Info size={14}/></button>
                </div>
                <p className="text-4xl font-black">{formatCurrency(totalPayroll + totalDeductions + totalProvisions)}</p>
            </div>
        </div>
        <div className="text-right">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Estado de Liquidez</p>
            <div className="px-4 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-xl text-[10px] font-black border border-emerald-500/30">OPERACIÓN CUBIERTA</div>
        </div>
        
        {showHelper === 'pasivo' && (
            <div className="absolute bottom-full left-10 mb-4 z-20 p-6 bg-white text-slate-900 text-xs rounded-[2rem] shadow-2xl border border-slate-100 max-w-sm animate-in zoom-in-95 duration-200">
                <div className="h-8 w-8 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mb-3"><ShieldCheck size={20}/></div>
                <strong>El Pasivo Laboral</strong> es la suma total de lo que la empresa "debe" por tener empleados. Incluye el sueldo de hoy, los impuestos de salud/pensión y el ahorro de las prestaciones (Prima/Cesantías). Es el costo real de tu equipo.
            </div>
        )}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Modo</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Colaborador</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Días</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Sueldo Base</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-amber-600">Recargos</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-indigo-600">Provisiones</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-rose-600">Deducciones</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Neto {period === 'full' ? 'Mes' : 'Quincena'}</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={9} className="px-8 py-16 text-center text-slate-400 italic font-medium">Recalculando valores legales para el periodo...</td></tr>
              ) : report.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5 text-center">
                    <span className="px-2 py-1 bg-slate-100 rounded text-[9px] font-black text-slate-500 uppercase">{row.periodLabel}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div><p className="font-black text-slate-900 text-sm">{row.employeeName}</p><p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{row.contractType}</p></div>
                  </td>
                  <td className="px-8 py-5 text-center font-black text-slate-700">{row.daysWorked.toFixed(1)}</td>
                  <td className="px-8 py-5 font-bold text-slate-600 text-sm">{formatCurrency(row.basePay)}</td>
                  <td className="px-8 py-5 font-black text-amber-600">+{formatCurrency(row.surchargeTotal)}</td>
                  <td className="px-8 py-5 font-bold text-indigo-600">{formatCurrency(row.provisions?.total || 0)}</td>
                  <td className="px-8 py-5 font-black text-rose-500">-{formatCurrency(row.socialSecurity?.total || 0)}</td>
                  <td className="px-8 py-5"><div className="flex items-center gap-2"><span className="text-lg font-black text-slate-900">{formatCurrency(row.totalPay)}</span><ArrowUpRight size={14} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-all" /></div></td>
                  <td className="px-8 py-5 text-right"><button onClick={() => router.push(`/gestion-humana/nomina/detalle/${row.employeeId}?period=${period}`)} className="p-2 text-slate-300 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all" title="Ver Detalle Quincenal"><Eye size={20} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PayrollPage;