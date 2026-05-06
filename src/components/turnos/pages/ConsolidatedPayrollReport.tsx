'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Printer, TrendingUp, DollarSign, Users, FileText } from 'lucide-react';
import moment from 'moment';
import styles from './PayrollDetail.module.css';
import { toast } from 'sonner';

const ConsolidatedPayrollReport: React.FC = () => {
  const router = useRouter();
  const [report, setReport] = useState<any[]>([]);
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [reportRes, configRes] = await Promise.all([
                axios.get(`http://localhost:3000/payroll/calculate?month=${month}&year=${year}`),
                axios.get(`http://localhost:3000/settings`)
            ]);
            setReport(reportRes.data);
            setConfig(configRes.data);
        } catch (err) {
            console.error(err);
            toast.error("Error al sincronizar reporte maestro");
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, [month, year]);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);

  const totalNeto = report.reduce((acc, r) => acc + r.totalPay, 0);
  const totalEmpresa = report.reduce((acc, r) => acc + (r.costoTotalEmpresa || 0), 0);

  if (loading) return <div className="p-12 text-center text-slate-500 font-black animate-pulse uppercase tracking-[0.3em]">Generando Informe Gerencial...</div>;
  if (!config) return <div className="p-12 text-center text-rose-500 font-bold">Error de configuración.</div>;

  return (
    <div className={styles.container}>
      <div className={`${styles.header} no-print`}>
        <button onClick={() => router.push('/recursos-humanos/nomina')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold transition-all">
          <ArrowLeft size={20} /> Volver al Panel
        </button>
        <button 
            onClick={() => window.print()}
            className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-2xl shadow-slate-900/30"
        >
            <Printer size={18} /> Exportar como PDF Oficial
        </button>
      </div>

      <div className={styles.paper} style={{ maxWidth: '1100px' }}>
        {/* ENCABEZADO GERENCIAL DINÁMICO */}
        <div className="flex justify-between items-center border-b-8 border-slate-900 pb-10 mb-10">
            <div className="flex items-center gap-6">
                {config.logoUrl ? (
                    <img src={config.logoUrl} alt="Logo" className="h-20 w-auto object-contain" />
                ) : (
                    <div className="h-16 w-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white font-black text-2xl">
                        {config.companyName.substring(0,2).toUpperCase()}
                    </div>
                )}
                <div>
                    <h1 className="text-3xl font-black m-0 tracking-tighter text-slate-900 uppercase leading-none">{config.companyName}</h1>
                    <p className="text-sm font-black text-primary-600 m-0 mt-2 uppercase tracking-[0.2em] opacity-60">Informe Consolidado de Pre-Liquidación</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">{config.idType}: {config.nit} • {config.address}, {config.city}</p>
                </div>
            </div>
            <div className="text-right">
                <div className="bg-slate-100 p-4 rounded-[1.5rem] border border-slate-200">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Periodo de Análisis</p>
                    <p className="text-lg font-black text-slate-900 uppercase leading-none">
                        {moment(`${year}-${String(month).padStart(2, '0')}-01`).format('MMMM YYYY')}
                    </p>
                </div>
            </div>
        </div>

        {/* RESUMEN DE PROYECCIÓN */}
        <div className="grid grid-cols-3 gap-8 mb-12">
            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Fuerza Laboral</p>
                <div className="flex items-center justify-between">
                    <span className="text-3xl font-black text-slate-900">{report.length}</span>
                    <Users className="text-slate-300" size={28} />
                </div>
                <p className="text-[9px] font-bold text-slate-400 mt-3 uppercase">Colaboradores activos en el periodo</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Neto a Dispersar</p>
                <div className="flex items-center justify-between text-emerald-600">
                    <span className="text-2xl font-black">{formatCurrency(totalNeto)}</span>
                    <DollarSign size={28} />
                </div>
                <p className="text-[9px] font-bold text-slate-400 mt-3 uppercase">Total proyectado para transferencia</p>
            </div>
            <div className="bg-slate-900 p-6 rounded-[2rem] text-white shadow-2xl shadow-slate-900/40">
                <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest mb-3">Pasivo Laboral Total</p>
                <div className="flex items-center justify-between">
                    <span className="text-2xl font-black">{formatCurrency(totalEmpresa)}</span>
                    <TrendingUp className="text-primary-400" size={28} />
                </div>
                <p className="text-[9px] font-bold text-slate-500 mt-3 uppercase">Costo Real de operación empresa</p>
            </div>
        </div>

        {/* TABLA DE DETALLE */}
        <table className="w-full border-collapse">
            <thead>
                <tr className="bg-slate-900 text-white">
                    <th className="p-4 text-[10px] font-black uppercase text-left rounded-tl-[1.5rem]">Colaborador</th>
                    <th className="p-4 text-[10px] font-black uppercase text-center">Días</th>
                    <th className="p-4 text-[10px] font-black uppercase text-right">Devengado</th>
                    <th className="p-4 text-[10px] font-black uppercase text-right">Deducciones</th>
                    <th className="p-4 text-[10px] font-black uppercase text-right">Provisiones</th>
                    <th className="p-4 text-[10px] font-black uppercase text-right rounded-tr-[1.5rem]">Neto Proyectado</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 border-x border-b border-slate-100 rounded-b-[1.5rem] overflow-hidden">
                {report.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="p-5">
                            <p className="text-sm font-black text-slate-800 m-0">{row.employeeName}</p>
                            <p className="text-[9px] font-black text-slate-400 m-0 uppercase tracking-tighter">{row.contractType}</p>
                        </td>
                        <td className="p-5 text-center text-sm font-black text-slate-600">{row.daysWorked.toFixed(1)}</td>
                        <td className="p-5 text-right text-sm font-bold text-slate-700">{formatCurrency(row.totalDevengado)}</td>
                        <td className="p-5 text-right text-sm font-bold text-rose-600">-{formatCurrency(row.socialSecurity.total)}</td>
                        <td className="p-5 text-right text-sm font-bold text-indigo-600">+{formatCurrency(row.provisions.total)}</td>
                        <td className="p-5 text-right">
                            <span className="text-sm font-black text-slate-900 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                                {formatCurrency(row.totalPay)}
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>

        {/* SECCIÓN DE CIERRE Y FIRMAS */}
        <div className="mt-24 grid grid-cols-3 gap-12">
            <div className="border-t-4 border-slate-900 pt-4 text-center">
                <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Preparado por:</p>
                <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">Analista Administrativo</p>
            </div>
            <div className="border-t-4 border-slate-900 pt-4 text-center">
                <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Revisado por:</p>
                <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">Control Interno</p>
            </div>
            <div className="border-t-4 border-slate-900 pt-4 text-center">
                <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Autorizado por:</p>
                <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">Representante Legal</p>
            </div>
        </div>

        {/* PIE DE PÁGINA */}
        <div className="mt-20 pt-8 border-t border-slate-100 text-center">
            <p className="text-[9px] text-slate-400 leading-relaxed italic max-w-2xl mx-auto font-medium">
                Este reporte consolidado es propiedad de {config.companyName}. Generado el {moment().format('LL')} 
                bajo los parámetros del Perfil Maestro de TurnoFlow. La información aquí contenida es confidencial y para uso interno administrativo.
            </p>
        </div>
      </div>
    </div>
  );
};

export default ConsolidatedPayrollReport;