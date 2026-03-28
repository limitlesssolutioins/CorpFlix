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
  ShieldCheck,
  Plus,
  X,
  PlusCircle
} from 'lucide-react';
import { generatePayrollReportAction, addPayrollNoveltyAction } from '@/actions/payroll';

interface PayrollPageProps {
  title?: string;
}

const PayrollPage: React.FC<PayrollPageProps> = ({ title = "Gestión de Nómina" }) => {
  const router = useRouter();
  const [report, setReport] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [period, setPeriod] = useState<'1' | '2' | 'full'>('1'); // Default to 1st quincena as requested
  const [excludeSS, setExcludeSS] = useState(false);

  const [showHelper, setShowHelper] = useState<string | null>(null);
  const [selectedPayroll, setSelectedPayroll] = useState<any | null>(null);
  const [isNoveltyModalOpen, setIsNoveltyModalOpen] = useState(false);
  
  // Novelty form state
  const [noveltyConcept, setNoveltyConcept] = useState('');
  const [noveltyAmount, setNoveltyAmount] = useState(0);
  const [noveltyType, setNoveltyType] = useState<'EARNING' | 'DEDUCTION'>('EARNING');
  const [isWageForming, setIsWageForming] = useState(true);

  useEffect(() => {
    fetchPayroll();
  }, [month, year, period]);

  const fetchPayroll = async (force: boolean = false) => {
    setLoading(true);
    try {
        const data = await generatePayrollReportAction(month, year, period, excludeSS, force);
        setReport(data);
    } catch (err) {
        console.error(err);
        toast.error("Error al calcular nómina");
    } finally {
        setLoading(false);
    }
  };

  const handleExcludeSSToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setExcludeSS(checked);
    // Auto-recalculate immediately
    generatePayrollReportAction(month, year, period, checked, true).then(data => setReport(data));
  };

  const handleAddNovelty = async () => {
    if (!selectedPayroll || !noveltyConcept || noveltyAmount <= 0) {
      toast.error("Por favor complete todos los campos");
      return;
    }

    try {
      await addPayrollNoveltyAction(selectedPayroll.id, noveltyConcept, noveltyAmount, noveltyType, isWageForming);
      toast.success("Novedad agregada exitosamente");
      setIsNoveltyModalOpen(false);
      setNoveltyConcept('');
      setNoveltyAmount(0);
      setIsWageForming(true);
      fetchPayroll();
    } catch (error) {
      toast.error("Error al agregar novedad");
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
      'Aux Transporte': Math.round(row.transportAid),
      'Otros Devengos': Math.round(row.otherEarnings),
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
          <p className="text-slate-500 mt-1 font-medium italic">Liquida la nómina de tus colaboradores de forma profesional.</p>
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
        {/* Selector de Periodo - Rediseñado según requerimiento */}
        <div className="bg-slate-900 p-6 rounded-[2rem] text-white shadow-xl shadow-slate-200">
          <p className="text-[10px] font-black uppercase tracking-widest text-primary-400 mb-4">Parámetros de Liquidación</p>
          <div className="space-y-4">
            <div className="flex bg-slate-800 p-1 rounded-xl">
                <button 
                    onClick={() => setPeriod('1')} 
                    className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all ${period !== 'full' ? 'bg-primary-500 text-white' : 'text-slate-400'}`}
                >
                    QUINCENAL
                </button>
                <button 
                    onClick={() => setPeriod('full')} 
                    className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all ${period === 'full' ? 'bg-primary-500 text-white' : 'text-slate-400'}`}
                >
                    MENSUAL
                </button>
            </div>

            {period !== 'full' && (
                <select value={period} onChange={e => setPeriod(e.target.value as any)} className="w-full bg-slate-800 text-white border-none rounded-xl p-3 text-xs font-black outline-none appearance-none cursor-pointer">
                    <option value="1">1RA QUINCENA (DÍAS 1-15)</option>
                    <option value="2">2DA QUINCENA (DÍAS 16-30)</option>
                </select>
            )}

            <div className="flex gap-2">
                <select value={month} onChange={e => setMonth(Number(e.target.value))} className="bg-slate-800 text-white border-none rounded-xl p-3 text-xs font-black outline-none flex-1 appearance-none uppercase">
                    {Array.from({length: 12}, (_, i) => i + 1).map(m => <option key={m} value={m}>{moment().month(m-1).format('MMMM')}</option>)}
                </select>
                <input type="number" value={year} onChange={e => setYear(Number(e.target.value))} className="bg-slate-800 text-white border-none rounded-xl p-3 text-xs font-black outline-none w-20" />
            </div>

            <label className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl cursor-pointer border border-slate-700/50 hover:bg-slate-800 transition-colors">
                <input 
                    type="checkbox" 
                    checked={excludeSS} 
                    onChange={handleExcludeSSToggle} 
                    className="w-4 h-4 text-primary-500 rounded bg-slate-900 border-slate-700 focus:ring-primary-500 focus:ring-offset-slate-900" 
                />
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-tight">Excluir Salud y Pensión <br/><span className="text-[8px] text-slate-500 font-bold">(No aplicar deducciones de ley)</span></span>
            </label>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Neto a Dispersar</p>
          <p className="text-2xl font-black text-slate-900">{formatCurrency(totalPayroll)}</p>
          <div className="mt-4 flex items-center gap-2 text-emerald-600 text-[10px] font-black uppercase">
            <CheckCircle2 size={14} /> Cálculo Legal Validado
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm group">
          <div className="flex justify-between items-start mb-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Provisiones (Ahorro)</p>
            <button onMouseEnter={() => setShowHelper('prov')} onMouseLeave={() => setShowHelper(null)} className="text-slate-300 hover:text-primary-500"><Info size={16}/></button>
          </div>
          <p className="text-2xl font-black text-indigo-600">{formatCurrency(totalProvisions)}</p>
          <p className="mt-4 text-[9px] text-slate-400 font-bold leading-tight uppercase tracking-tighter">Reserva para Prima, Cesantías e Intereses.</p>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Seguridad Social (Aportes)</p>
          <p className="text-2xl font-black text-rose-600">{formatCurrency(totalDeductions)}</p>
          <p className="mt-4 text-[9px] text-slate-400 font-bold leading-tight uppercase tracking-tighter">Retenciones de Salud y Pensión de los colaboradores.</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2"><DollarSign className="text-primary-500" size={20} /> Detalle de Liquidación {period === 'full' ? 'Mensual' : `Quincenal (${period})`}</h2>
            <div className="px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-200">
                {moment().month(month-1).format('MMMM')} {year}
            </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-200">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Colaborador</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Días</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Salario Base</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-indigo-600">Aux. Transporte</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-amber-600">Novedades (+)</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-rose-600">Deducciones (-)</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest font-black">Neto a Pagar</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={8} className="px-8 py-16 text-center text-slate-400 italic font-medium">Recalculando valores legales para el periodo...</td></tr>
              ) : report.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div><p className="font-black text-slate-900 text-sm">{row.employeeName}</p><p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{row.contractType}</p></div>
                  </td>
                  <td className="px-8 py-5 text-center font-black text-slate-700">{row.daysWorked}</td>
                  <td className="px-8 py-5 font-bold text-slate-600 text-sm">{formatCurrency(row.basePay)}</td>
                  <td className="px-8 py-5 font-black text-indigo-500">{formatCurrency(row.transportAid)}</td>
                  <td className="px-8 py-5 font-black text-amber-600">
                    <div className="flex items-center gap-2">
                        +{formatCurrency(row.otherEarnings)}
                        <button 
                            onClick={() => { setSelectedPayroll(row); setIsNoveltyModalOpen(true); }}
                            className="p-1 text-slate-300 hover:text-amber-500 transition-colors"
                            title="Añadir Novedad"
                        >
                            <PlusCircle size={16} />
                        </button>
                    </div>
                  </td>
                  <td className="px-8 py-5 font-black text-rose-500">-{formatCurrency(row.socialSecurity?.total || 0)}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-black text-slate-900">{formatCurrency(row.totalPay)}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right flex items-center gap-2">
                    <button 
                        onClick={() => { setSelectedPayroll(row); setIsNoveltyModalOpen(true); }}
                        className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase hover:bg-primary-500 hover:text-white transition-all shadow-sm"
                    >
                        Añadir Novedad
                    </button>
                    <button onClick={() => router.push(`/gestion-humana/nomina/detalle/${row.employeeId}?period=${period}`)} className="p-2 text-slate-300 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all" title="Ver Detalle"><Eye size={20} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE NOVEDADES */}
      {isNoveltyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-black">Añadir Novedad</h3>
                    <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-widest">{selectedPayroll?.employeeName}</p>
                </div>
                <button onClick={() => setIsNoveltyModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={20}/></button>
            </div>
            
            <div className="p-8 space-y-6">
                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Tipo de Novedad</label>
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                        <button 
                            onClick={() => setNoveltyType('EARNING')} 
                            className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all ${noveltyType === 'EARNING' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}
                        >
                            DEVENGADO (+)
                        </button>
                        <button 
                            onClick={() => setNoveltyType('DEDUCTION')} 
                            className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all ${noveltyType === 'DEDUCTION' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-400'}`}
                        >
                            DEDUCCIÓN (-)
                        </button>
                    </div>
                </div>

                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Concepto / Descripción</label>
                    <input 
                        type="text" 
                        placeholder="Ej: Bonificación, Comisión, Préstamo..."
                        value={noveltyConcept}
                        onChange={e => setNoveltyConcept(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold focus:ring-2 focus:ring-primary-500 transition-all"
                    />
                </div>

                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Monto ($)</label>
                    <input 
                        type="number" 
                        value={noveltyAmount}
                        onChange={e => setNoveltyAmount(Number(e.target.value))}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-black text-xl focus:ring-2 focus:ring-primary-500 transition-all"
                    />
                </div>

                <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl cursor-pointer border border-slate-100 hover:bg-slate-100 transition-colors">
                    <input 
                        type="checkbox" 
                        checked={isWageForming} 
                        onChange={e => setIsWageForming(e.target.checked)} 
                        className="w-5 h-5 text-primary-600 rounded bg-white border-slate-300 focus:ring-primary-500" 
                    />
                    <div>
                        <span className="text-xs font-black text-slate-700 uppercase tracking-widest block">Constituye Salario</span>
                        <span className="text-[9px] font-bold text-slate-400 leading-tight block mt-0.5">Activa esta opción si el valor debe sumarse para el cálculo de Primas, Cesantías y Vacaciones.</span>
                    </div>
                </label>

                <div className="pt-4 flex gap-3">
                    <button 
                        onClick={() => setIsNoveltyModalOpen(false)}
                        className="flex-1 py-4 bg-slate-100 text-slate-500 font-black rounded-2xl hover:bg-slate-200 transition-all"
                    >
                        CANCELAR
                    </button>
                    <button 
                        onClick={handleAddNovelty}
                        className="flex-[2] py-4 bg-primary-600 text-white font-black rounded-2xl shadow-lg shadow-primary-500/30 hover:bg-primary-700 active:scale-95 transition-all"
                    >
                        GUARDAR NOVEDAD
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollPage;