'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import styles from './PayrollDetail.module.css';
import { ArrowLeft, Printer, CheckCircle2 } from 'lucide-react';
import moment from 'moment';
import { toast } from 'sonner';

const PayrollDetail: React.FC = () => {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [payrollRes, configRes] = await Promise.all([
                axios.get(`http://localhost:3000/payroll/detail/${id}?month=${month}&year=${year}`),
                axios.get(`http://localhost:3000/settings`)
            ]);
            setData(payrollRes.data);
            setConfig(configRes.data);
        } catch (err) {
            console.error(err);
            toast.error("Error al cargar datos");
        } finally {
            setLoading(false);
        }
    };
    if (id) fetchData();
  }, [id, month, year]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="p-8 text-slate-500 font-medium">Cargando comprobante...</div>;
  if (!data || !config) return <div className="p-8 text-rose-500">No se encontró información.</div>;

  return (
    <div className={styles.container}>
      <div className={`${styles.header} no-print`}>
        <button onClick={() => router.push('/recursos-humanos/nomina')} className="flex items-center gap-2 text-slate-400 hover:text-slate-800 transition-colors font-bold">
          <ArrowLeft size={20} /> Volver a Nómina
        </button>
        <button 
            onClick={handlePrint}
            className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-black hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg"
        >
            <Printer size={18} /> GENERAR PDF OFICIAL
        </button>
      </div>

      <div className={styles.paper}>
        {/* CABECERA FORMAL DINÁMICA */}
        <div className={styles.docHeader}>
          <div className={styles.companyInfo}>
            <div className="flex items-center gap-3 mb-3">
                {config.logoUrl ? (
                    <img src={config.logoUrl} alt="Logo" className="h-12 w-auto object-contain" />
                ) : (
                    <div className="h-10 w-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-sm">
                        {config.companyName.substring(0,2).toUpperCase()}
                    </div>
                )}
                <h2 className="m-0 leading-none text-slate-900 font-black uppercase tracking-tighter">{config.companyName}</h2>
            </div>
            <p className="text-xs font-black text-slate-500 m-0 uppercase tracking-widest">{config.idType}: {config.nit}</p>
            <p className="text-[10px] font-bold text-slate-400 m-0 uppercase">{config.address} • {config.city}</p>
          </div>
          <div className={styles.empInfo}>
            <div className="bg-slate-100 px-3 py-1 rounded-md mb-2 inline-block">
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Comprobante Individual de Pago</span>
            </div>
            <h3 className="m-0 text-slate-900 font-black">{data.employee.name}</h3>
            <p className="text-xs font-bold text-slate-500 m-0 uppercase">C.C. {data.employee.doc} • {data.employee.position}</p>
            <p className="text-xs font-bold text-primary-600 mt-1 uppercase tracking-tighter">Periodo: {moment(`${year}-${String(month).padStart(2, '0')}-01`).format('MMMM YYYY')}</p>
          </div>
        </div>

        {/* CUERPO DEL COMPROBANTE */}
        <div className={styles.grid}>
          <div>
            <div className={styles.sectionTitle}>Percepciones / Ingresos</div>
            <div className={styles.row}>
              <span className="font-medium text-slate-600 text-xs uppercase">Sueldo Básico ({data.summary.daysWorked.toFixed(1)} días)</span>
              <span className="font-bold text-slate-900">${Math.round(data.summary.basePay).toLocaleString()}</span>
            </div>
            <div className={styles.row}>
              <span className="font-medium text-slate-600 text-xs uppercase">Auxilio de Transporte</span>
              <span className="font-bold text-slate-900">${Math.round(data.summary.transportAid).toLocaleString()}</span>
            </div>
            <div className={styles.row}>
              <span className="font-medium text-slate-600 text-xs uppercase">Recargos y Horas Extra</span>
              <span className="font-bold text-slate-900">${Math.round(data.summary.totalSurcharges).toLocaleString()}</span>
            </div>
            <div className={styles.totalRow}>
              <span className="uppercase text-xs font-black">Total Devengado</span>
              <span className="text-emerald-700 font-black text-lg">${Math.round(data.summary.totalDevengado).toLocaleString()}</span>
            </div>
          </div>

          <div>
            <div className={styles.sectionTitle}>Deducciones de Ley</div>
            <div className={styles.row}>
              <span className="font-medium text-slate-600 text-xs uppercase">Aporte Salud (4%)</span>
              <span className="font-bold text-slate-900">${Math.round(data.summary.socialSecurity.health).toLocaleString()}</span>
            </div>
            <div className={styles.row}>
              <span className="font-medium text-slate-600 text-xs uppercase">Aporte Pensión (4%)</span>
              <span className="font-bold text-slate-900">${Math.round(data.summary.socialSecurity.pension).toLocaleString()}</span>
            </div>
            <div className={styles.totalRow}>
              <span className="uppercase text-xs font-black">Total Deducciones</span>
              <span className="text-rose-600 font-black text-lg">${Math.round(data.summary.socialSecurity.total).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* SECCIÓN PRESTACIONES SOCIALES & LIQUIDACIÓN */}
        <div className="mt-8 pt-8 border-t border-slate-200">
            <div className="flex items-center justify-between mb-4">
                <div className={styles.sectionTitle} style={{marginBottom: 0}}>Prestaciones Sociales & Liquidación</div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-3 py-1 rounded-full">Informativo</span>
            </div>
            
            <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="col-span-2">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="pb-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Concepto</th>
                                    <th className="pb-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Provisión Mes (Empresa)</th>
                                    <th className="pb-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right text-indigo-600">Acumulado (Empleado)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <tr className="group hover:bg-white transition-colors">
                                    <td className="py-3 text-xs font-bold text-slate-700">Cesantías</td>
                                    <td className="py-3 text-xs font-medium text-right text-slate-500">${Math.round(data.summary.provisions?.cesantias || 0).toLocaleString()}</td>
                                    <td className="py-3 text-xs font-black text-right text-slate-900">${Math.round(data.summary.accumulated?.cesantias || 0).toLocaleString()}</td>
                                </tr>
                                <tr className="group hover:bg-white transition-colors">
                                    <td className="py-3 text-xs font-bold text-slate-700">Intereses Cesantías</td>
                                    <td className="py-3 text-xs font-medium text-right text-slate-500">${Math.round(data.summary.provisions?.intereses || 0).toLocaleString()}</td>
                                    <td className="py-3 text-xs font-black text-right text-slate-900">${Math.round(data.summary.accumulated?.intereses || 0).toLocaleString()}</td>
                                </tr>
                                <tr className="group hover:bg-white transition-colors">
                                    <td className="py-3 text-xs font-bold text-slate-700">Prima de Servicios</td>
                                    <td className="py-3 text-xs font-medium text-right text-slate-500">${Math.round(data.summary.provisions?.prima || 0).toLocaleString()}</td>
                                    <td className="py-3 text-xs font-black text-right text-slate-900">${Math.round(data.summary.accumulated?.prima || 0).toLocaleString()}</td>
                                </tr>
                                <tr className="group hover:bg-white transition-colors">
                                    <td className="py-3 text-xs font-bold text-slate-700">Vacaciones</td>
                                    <td className="py-3 text-xs font-medium text-right text-slate-500">${Math.round(data.summary.provisions?.vacaciones || 0).toLocaleString()}</td>
                                    <td className="py-3 text-xs font-black text-right text-slate-900">${Math.round(data.summary.accumulated?.vacaciones || 0).toLocaleString()}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    {/* TARJETA DE LIQUIDACIÓN ESTIMADA */}
                    <div className="bg-white p-5 rounded-2xl border border-indigo-100 shadow-lg shadow-indigo-100/50 flex flex-col justify-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-50 rounded-bl-[4rem] -mr-10 -mt-10 z-0"></div>
                        <div className="relative z-10">
                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Valor de Liquidación Hoy</p>
                            <p className="text-[9px] text-slate-400 font-medium mb-3 leading-tight">Incluye sueldo neto pendiente + prestaciones acumuladas.</p>
                            <div className="text-3xl font-black text-indigo-900 tracking-tight">
                                ${Math.round((data.summary.totalPay || 0) + (data.summary.accumulated?.total || 0)).toLocaleString()}
                            </div>
                            <div className="mt-4 pt-3 border-t border-indigo-50 flex items-center justify-between">
                                <span className="text-[9px] font-bold text-slate-500 uppercase">Días Acumulados</span>
                                <span className="text-xs font-black text-indigo-600">{data.summary.accumulated?.daysTotal || 0} días</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="mt-8 bg-slate-900 p-8 rounded-[2rem] flex justify-between items-center text-white shadow-xl">
            <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-400">Total Neto a Recibir</p>
                <p className="text-4xl font-black mt-1"> ${Math.round(data.summary.totalPay).toLocaleString()}</p>
            </div>
            <div className="text-right flex flex-col items-end">
                <CheckCircle2 size={40} className="text-emerald-400 mb-2" />
                <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Validado por TurnoFlow</span>
            </div>
        </div>

        {/* DETALLE DE JORNADAS */}
        <div className={styles.sectionTitle}>Desglose de Turnos Procesados</div>
        <table className={styles.detailTable}>
            <thead>
                <tr>
                    <th className="rounded-tl-lg">Fecha</th>
                    <th>Horas</th>
                    <th>Ordinarias</th>
                    <th>Conceptos Adicionales</th>
                    <th className="text-right rounded-tr-lg">Monto Adicional</th>
                </tr>
            </thead>
            <tbody>
                {data.shifts.map((s: any, idx: number) => (
                    <tr key={idx}>
                        <td className="font-black text-slate-700">{moment(s.date).format('DD MMM, ddd')}</td>
                        <td className="font-medium">{s.totalHours.toFixed(1)}h</td>
                        <td className="text-slate-500">{(s.breakdown?.ordinary || 0).toFixed(1)}</td>
                        <td>
                            <div className="flex flex-wrap gap-1">
                                {(s.breakdown?.night || 0) > 0 && <span className="bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-black text-[9px] uppercase">Nocturno</span>}
                                {(s.breakdown?.sundayDay || 0) > 0 && <span className="bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded font-black text-[9px] uppercase">Dominical</span>}
                                {(s.breakdown?.extraOrdinary || 0) > 0 && <span className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-black text-[9px] uppercase">Extra</span>}
                            </div>
                        </td>
                        <td className="font-black text-right text-slate-900">
                            {s.moneyValue > 0 ? `$${Math.round(s.moneyValue).toLocaleString()}` : '-'}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>

        {/* SECCIÓN DE FIRMAS */}
        <div className="mt-24 grid grid-cols-2 gap-20">
            <div className="border-t-2 border-slate-900 pt-4 text-center">
                <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Firma del Empleador</p>
                <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">{config.companyName}</p>
            </div>
            <div className="border-t-2 border-slate-900 pt-4 text-center">
                <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Firma del Trabajador</p>
                <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">C.C. {data.employee.doc}</p>
            </div>
        </div>

        {/* PIE DE PÁGINA */}
        <div className="mt-16 pt-8 border-t border-slate-100 text-center">
            <p className="text-[9px] text-slate-400 leading-relaxed italic max-w-2xl mx-auto font-medium">
                Este comprobante de pago tiene validez administrativa para la empresa {config.companyName}. 
                Generado automáticamente bajo el cumplimiento de la ley laboral colombiana vigente.
            </p>
        </div>
      </div>
    </div>
  );
};

export default PayrollDetail;