'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ArrowLeft, Printer, Building2, Clock, Calendar, FileCheck2 } from 'lucide-react';
import { toast } from 'sonner';
import moment from 'moment';
import styles from './PayrollDetail.module.css';

const PreBillingReport: React.FC = () => {
  const router = useRouter();
  const [report, setReport] = useState<any[]>([]);
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
            const [reportRes, configRes] = await Promise.all([
                axios.get(`http://localhost:3000/shifts/pre-billing?month=${month}&year=${year}`),
                axios.get(`http://localhost:3000/settings`)
            ]);
            setReport(reportRes.data);
            setConfig(configRes.data);
        } catch (err) {
            console.error(err);
            toast.error("Error al generar reporte");
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, [month, year]);

  return (
    <div className={styles.container}>
      <div className={`${styles.header} no-print`}>
        <button onClick={() => router.push('/recursos-humanos/nomina')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold">
          <ArrowLeft size={20} /> Volver
        </button>
        <button 
          onClick={() => window.print()}
          className="bg-primary-600 text-white px-6 py-2.5 rounded-xl text-sm font-black hover:bg-primary-700 transition-all flex items-center gap-2 shadow-lg"
        >
          <Printer size={18} /> GENERAR SOPORTE DE FACTURACIÓN (PDF)
        </button>
      </div>

      <div className={styles.paper}>
        {/* CABECERA MAESTRA */}
        <div className="flex justify-between items-center border-b-4 border-slate-900 pb-8 mb-8">
            <div className="flex items-center gap-4">
                {config?.logoUrl ? (
                    <img src={config.logoUrl} alt="Logo" className="h-16 w-auto object-contain" />
                ) : (
                    <div className="h-12 w-12 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black">TF</div>
                )}
                <div>
                    <h1 className="text-xl font-black m-0 text-slate-900 uppercase">{config?.companyName}</h1>
                    <p className="text-[10px] font-bold text-slate-400 m-0 uppercase">{config?.idType}: {config?.nit}</p>
                </div>
            </div>
            <div className="text-right">
                <span className="bg-slate-100 px-4 py-2 rounded-xl text-xs font-black text-slate-600 uppercase tracking-widest">
                    Reporte de Horas Hombre
                </span>
                <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase">Periodo: {moment(`${year}-${String(month).padStart(2, '0')}-01`).format('MMMM YYYY')}</p>
            </div>
        </div>

        <div className="mb-10">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Resumen de Servicios por Sede</h2>
            <p className="text-sm text-slate-500 font-medium mt-1">Este documento certifica las horas de servicio prestadas en cada instalación para fines de facturación comercial.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <p className="col-span-full text-center py-12 text-slate-400 italic">Calculando métricas de servicio...</p>
          ) : report.map((row, idx) => (
            <div key={idx} className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 flex flex-col justify-between group hover:bg-white hover:border-primary-500 transition-all hover:shadow-xl">
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-white rounded-2xl text-primary-600 shadow-sm border border-slate-100 group-hover:bg-primary-600 group-hover:text-white transition-all">
                  <Building2 size={28} />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Horas Prestadas</p>
                  <p className="text-4xl font-black text-slate-900">
                    {row.totalHours.toFixed(1)}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-xl mb-2">{row.siteName}</h3>
                <div className="flex items-center gap-6 mt-6 pt-6 border-t border-slate-200">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-400 uppercase">Jornadas</span>
                        <span className="text-sm font-bold text-slate-700">{row.shiftCount} Turnos</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-400 uppercase">Promedio</span>
                        <span className="text-sm font-bold text-slate-700">{(row.totalHours / row.shiftCount).toFixed(1)} h/jornada</span>
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* PIE DE PÁGINA COMERCIAL */}
        <div className="mt-20 p-8 bg-slate-900 rounded-[2.5rem] text-white relative overflow-hidden">
            <FileCheck2 size={100} className="absolute -right-4 -bottom-4 opacity-10 rotate-12" />
            <div className="max-w-xl relative">
                <h4 className="text-lg font-black mb-2 flex items-center gap-2">
                    <FileCheck2 size={20} className="text-primary-400" />
                    Certificación de Servicio
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                    Las horas aquí detalladas corresponden a los registros de asistencia validados por el departamento de recursos humanos de **{config?.companyName}**. 
                    Este reporte sirve como anexo técnico legal para el proceso de facturación del periodo seleccionado.
                </p>
            </div>
        </div>

        <div className="mt-12 text-center">
            <p className="text-[9px] text-slate-400 uppercase font-black tracking-[0.3em]">Generado digitalmente por TurnoFlow Enterprise</p>
        </div>
      </div>
    </div>
  );
};

export default PreBillingReport;
