'use client';

import { useState, useEffect } from 'react';
import { 
    Plus, Search, Home, IdCard, Calculator, Users, Printer, 
    ShieldCheck, DollarSign, ArrowRight, Smartphone, Mail, AlertCircle, Info, Sparkles,
    FileMinus, Calendar, Building2, Download
} from 'lucide-react';
import { 
    calculateShiftColombian, 
    calculateDecreto2616, 
    calculateDescansoDominical, 
    calculatePrestaciones,
    calculateLiquidacionContrato,
    SMLMV_2026,
    AUX_TRANSPORTE_2026
} from '@/lib/payroll-calculator';

type Tab = 'directorio' | 'liquidacion' | 'seguridad-social';
type Mode = 'nomina' | 'contrato' | 'vacaciones';

export default function DomesticasProfesionalPage() {
    const [activeTab, setActiveTab] = useState<Tab>('directorio');
    const [calcMode, setCalcMode] = useState<Mode>('nomina');
    const [searchQuery, setSearchQuery] = useState('');
    
    // Configuración dinámica desde RRHH
    const [hrConfig, setHrConfig] = useState<any>(null);
    const [ssResult, setSsResult] = useState<any>(null);
    const [diasSS, setDiasSS] = useState<number>(30);
    const [employees, setEmployees] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch config
        fetch('/api/gestion/payroll-config')
            .then(res => res.json())
            .then(data => setHrConfig(data))
            .catch(() => setHrConfig({ company: { name: 'Mi Empresa', nit: '000.000' } }));

        // Fetch employees and filter domesticas
        fetch('/api/employees')
            .then(res => res.json())
            .then(data => {
                const domesticas = data.filter((emp: any) => emp.contractType === 'DOMESTICA');
                setEmployees(domesticas);
            })
            .catch(err => console.error('Error fetching domesticas:', err))
            .finally(() => setLoading(false));
    }, []);

    // --- State para Liquidación Profesional ---
    const [liqData, setLiqData] = useState({
        nombre: '', tipo: 'mes' as 'mes' | 'dias', salarioBase: 1300000, diasTrabajados: 30, esInterna: false,
        hasExtras: false, startTime: '08:00', endTime: '19:00', breakMinutes: 60, isSundayOrHoliday: false, weeklyHours: 44,
        liquidarPrima: false, liquidarCesantias: false, diasPrestaciones: 180, diasDisfrutados: 15,
        fechaIngreso: '2025-01-01', fechaRetiro: new Date().toISOString().split('T')[0], causaIndemnizacion: false, diasPendientesVacaciones: 0
    });

    const [liqResult, setLiqResult] = useState<any>(null);

    const handleLiquidar = (e: React.FormEvent) => {
        e.preventDefault();
        if (calcMode === 'nomina') liquidarNomina();
        else if (calcMode === 'contrato') liquidarFinContrato();
        else liquidarSoloVacaciones();
    };

    const liquidarNomina = () => {
        let subtotalSalario = 0, extrasAmount = 0, auxTrans = 0, descansoDominical = 0;
        if (liqData.tipo === 'dias') {
            subtotalSalario = liqData.salarioBase * liqData.diasTrabajados;
            descansoDominical = calculateDescansoDominical(liqData.salarioBase, liqData.diasTrabajados);
            if (!liqData.esInterna) auxTrans = (AUX_TRANSPORTE_2026 / 30) * liqData.diasTrabajados;
        } else {
            subtotalSalario = liqData.salarioBase;
            if (liqData.salarioBase <= (SMLMV_2026 * 2) && !liqData.esInterna) auxTrans = AUX_TRANSPORTE_2026;
        }
        if (liqData.hasExtras) {
            const calc = calculateShiftColombian({
                salary: liqData.tipo === 'dias' ? (liqData.salarioBase * 30) : liqData.salarioBase,
                weeklyHours: liqData.weeklyHours, startTime: liqData.startTime, endTime: liqData.endTime,
                breakMinutes: liqData.breakMinutes, isSundayOrHoliday: liqData.isSundayOrHoliday
            });
            extrasAmount = calc.totalAmount - (calc.hourlyRate * calc.totalHours);
        }
        let salud = 0, pension = 0;
        if (liqData.tipo === 'dias') {
            const ss = calculateDecreto2616(liqData.diasTrabajados, SMLMV_2026);
            pension = ss.pensionDeduccionEmpleado;
            salud = ss.saludDeduccionEmpleadoCompleto; 
        } else {
            salud = subtotalSalario * 0.04;
            pension = subtotalSalario * 0.04;
        }
        let prima = 0, cesantias = 0, intereses = 0;
        if (liqData.liquidarPrima || liqData.liquidarCesantias) {
            const pres = calculatePrestaciones(liqData.tipo === 'dias' ? (liqData.salarioBase * 30) : liqData.salarioBase, auxTrans, liqData.diasPrestaciones);
            if (liqData.liquidarPrima) prima = pres.prima;
            if (liqData.liquidarCesantias) { cesantias = pres.cesantias; intereses = pres.interesesCesantias; }
        }
        const totalDevengado = subtotalSalario + descansoDominical + extrasAmount + auxTrans + prima + cesantias + intereses;
        setLiqResult({ mode: 'nomina', subtotalSalario, descansoDominical, extrasAmount, auxTrans, salud, pension, prima, cesantias, intereses, neto: totalDevengado - (salud+pension), totalDevengado });
    };

    const liquidarFinContrato = () => {
        const res = calculateLiquidacionContrato(liqData.salarioBase, liqData.esInterna ? 0 : AUX_TRANSPORTE_2026, new Date(liqData.fechaIngreso), new Date(liqData.fechaRetiro), liqData.diasPendientesVacaciones, liqData.causaIndemnizacion);
        setLiqResult({ mode: 'contrato', ...res, neto: res.total });
    };

    const liquidarSoloVacaciones = () => {
        const totalVacaciones = (liqData.salarioBase / 30) * liqData.diasDisfrutados;
        setLiqResult({ mode: 'vacaciones', subtotalSalario: totalVacaciones, neto: totalVacaciones, dias: liqData.diasDisfrutados });
    };

    const handleCalcularSS = (e: React.FormEvent) => {
        e.preventDefault();
        const res = calculateDecreto2616(diasSS, SMLMV_2026);
        setSsResult(res);
    };

    if (!hrConfig) return <div className="p-10 text-center font-bold text-slate-400 animate-pulse">Iniciando motor de nómina...</div>;

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden border-b border-slate-200 pb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white overflow-hidden shadow-lg shadow-slate-200">
                        <Building2 size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">{hrConfig.company.name}</h2>
                        <p className="text-slate-500 font-medium text-xs">NIT: {hrConfig.company.nit} • Gestión Humana Doméstica</p>
                    </div>
                </div>
                <div className="flex gap-2 bg-slate-100 p-1 rounded-2xl">
                     <button onClick={() => setActiveTab('directorio')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'directorio' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Directorio</button>
                     <button onClick={() => { setActiveTab('liquidacion'); setCalcMode('nomina'); }} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'liquidacion' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Liquidación</button>
                     <button onClick={() => setActiveTab('seguridad-social')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'seguridad-social' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Seg. Social</button>
                </div>
            </header>

            <main className="min-h-[60vh]">
                {activeTab === 'directorio' && (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <div className="flex justify-between items-center"><h3 className="text-lg font-bold text-slate-800">Directorio de Empleadas</h3><button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-rose-600 transition-colors">+ Nueva Registro</button></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {employees.map(emp => (
                                <div key={emp.id} className="bg-white rounded-[2rem] border border-slate-200 p-6 hover:shadow-xl transition-all group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-rose-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110" />
                                    <h4 className="text-xl font-black text-slate-900 mb-1">{emp.firstName} {emp.lastName}</h4>
                                    <p className="text-xs text-slate-400 font-bold mb-6 tracking-widest uppercase">CC {emp.identification} • {emp.defaultPosition || 'Doméstica'}</p>
                                    <div className="grid grid-cols-2 gap-2 mt-4 relative">
                                        <button onClick={() => { setLiqData({...liqData, nombre: `${emp.firstName} ${emp.lastName}`, salarioBase: emp.salaryAmount, tipo: (emp.defaultPosition || '').includes('Días') ? 'dias' : 'mes'}); setCalcMode('nomina'); setActiveTab('liquidacion'); }} className="py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black hover:bg-rose-600 transition-colors">PAGAR</button>
                                        <button onClick={() => { setLiqData({...liqData, nombre: `${emp.firstName} ${emp.lastName}`, salarioBase: emp.salaryAmount, fechaIngreso: emp.startDate || '2025-01-01'}); setCalcMode('contrato'); setActiveTab('liquidacion'); }} className="py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors">LIQUIDAR</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'liquidacion' && (
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 animate-in fade-in duration-500">
                        <div className="xl:col-span-5 space-y-4 print:hidden">
                            <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl">
                                {(['nomina', 'vacaciones', 'contrato'] as Mode[]).map(m => <button key={m} onClick={() => setCalcMode(m)} className={`flex-1 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${calcMode === m ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}>{m.toUpperCase()}</button>)}
                            </div>
                            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                                <div className="p-6 bg-slate-900 text-white flex items-center justify-between"><h3 className="text-xl font-black flex items-center gap-2"><Sparkles className="text-rose-400" /> {calcMode.toUpperCase()}</h3></div>
                                <form onSubmit={handleLiquidar} className="p-8 space-y-6">
                                    <div><label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Nombre Completo</label><input type="text" required value={liqData.nombre} onChange={(e) => setLiqData({...liqData, nombre: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold" /></div>
                                    <div><label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Salario Base ($)</label><input type="number" required value={liqData.salarioBase} onChange={(e) => setLiqData({...liqData, salarioBase: Number(e.target.value)})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold" /></div>
                                    {calcMode === 'nomina' && (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                {(['mes', 'dias'] as const).map(t => <div key={t} onClick={() => setLiqData({...liqData, tipo: t})} className={`cursor-pointer p-4 rounded-xl border-2 text-center transition-all ${liqData.tipo === t ? 'border-rose-500 bg-rose-50' : 'border-slate-50'}`}><span className="text-xs font-black uppercase tracking-widest">{t === 'mes' ? 'Mensual' : 'Por Días'}</span></div>)}
                                            </div>
                                            {liqData.tipo === 'dias' && <input type="number" placeholder="Días laborados" required value={liqData.diasTrabajados} onChange={(e) => setLiqData({...liqData, diasTrabajados: Number(e.target.value)})} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold" />}
                                            <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl cursor-pointer"><input type="checkbox" checked={liqData.hasExtras} onChange={(e) => setLiqData({...liqData, hasExtras: e.target.checked})} className="w-5 h-5 text-rose-600 rounded" /><span className="text-xs font-bold text-slate-700 uppercase tracking-tight">Incluir Horas Extras / Recargos</span></label>
                                        </div>
                                    )}
                                    {calcMode === 'contrato' && <div className="grid grid-cols-2 gap-4"><div><label className="text-[10px] font-black text-slate-400 uppercase">Ingreso</label><input type="date" value={liqData.fechaIngreso} onChange={(e) => setLiqData({...liqData, fechaIngreso: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold" /></div><div><label className="text-[10px] font-black text-slate-400 uppercase">Retiro</label><input type="date" value={liqData.fechaRetiro} onChange={(e) => setLiqData({...liqData, fechaRetiro: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold" /></div></div>}
                                    <button type="submit" className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl shadow-lg active:scale-[0.98]">GENERAR DOCUMENTO</button>
                                </form>
                            </div>
                        </div>

                        <div className="xl:col-span-7">
                            {liqResult ? (
                                <div className="space-y-6">
                                    <div className="flex gap-3 print:hidden">
                                        <button onClick={() => window.print()} className="flex-1 py-3 bg-white border border-slate-200 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm"><Printer size={18}/> Imprimir PDF</button>
                                        <button className="flex-1 py-3 bg-[#25D366] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20"><Smartphone size={18}/> Enviar WhatsApp</button>
                                    </div>
                                    <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 md:p-14 shadow-2xl relative overflow-hidden" id="payslip-area">
                                        <div className="flex justify-between items-start mb-12 border-b border-slate-100 pb-10">
                                            <div className="flex items-center gap-5">
                                                <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-2xl uppercase tracking-tighter">{hrConfig.company.name.substring(0,2)}</div>
                                                <div><h3 className="text-2xl font-black text-slate-900 leading-none">{hrConfig.company.name}</h3><p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">SOPORTE DE PAGO LEGAL</p></div>
                                            </div>
                                            <div className="text-right"><p className="text-[10px] font-black text-slate-400 uppercase mb-1">Fecha Emisión</p><p className="font-bold text-slate-900">{new Date().toLocaleDateString('es-CO')}</p></div>
                                        </div>
                                        <div className="bg-slate-50 p-6 rounded-3xl grid grid-cols-2 gap-4 mb-10 border border-slate-100">
                                            <div><p className="text-[10px] font-black text-slate-400 uppercase mb-1">Nombre Empleada</p><p className="font-bold text-slate-900">{liqData.nombre}</p></div>
                                            <div className="text-right"><p className="text-[10px] font-black text-slate-400 uppercase mb-1">Modo Liquidación</p><p className="font-bold text-rose-600 uppercase text-xs tracking-widest">{calcMode}</p></div>
                                        </div>
                                        <table className="w-full text-left mb-12 text-sm md:text-base">
                                            <thead className="border-b-2 border-slate-900 text-[10px] font-black uppercase text-slate-500 tracking-widest"><tr><th className="py-3">Descripción Concepto</th><th className="py-3 text-right">Devengos (+)</th><th className="py-3 text-right">Deducciones (-)</th></tr></thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {calcMode === 'nomina' && (
                                                    <>
                                                        <tr><td className="py-4 font-medium text-slate-700">Sueldo Base {liqData.tipo === 'dias' ? `(${liqData.diasTrabajados} días)` : ''}</td><td className="text-right font-bold text-slate-900">${liqResult.subtotalSalario.toLocaleString('es-CO')}</td><td></td></tr>
                                                        {liqResult.descansoDominical > 0 && <tr><td className="py-4 text-slate-600">Descanso Proporcional</td><td className="text-right font-bold">${liqResult.descansoDominical.toLocaleString('es-CO')}</td><td></td></tr>}
                                                        {liqResult.auxTrans > 0 && <tr><td className="py-4 italic">Auxilio de Transporte</td><td className="text-right font-bold">${liqResult.auxTrans.toLocaleString('es-CO')}</td><td></td></tr>}
                                                        {liqResult.extrasAmount > 0 && <tr><td className="py-4">Recargos y Horas Extras</td><td className="text-right font-bold text-emerald-600">+${liqResult.extrasAmount.toLocaleString('es-CO')}</td><td></td></tr>}
                                                        <tr><td className="py-4 text-slate-400">Seguridad Social (Aportes)</td><td></td><td className="text-right font-bold text-rose-600">-${(liqResult.salud + liqResult.pension).toLocaleString('es-CO')}</td></tr>
                                                    </>
                                                )}
                                                {calcMode === 'vacaciones' && <tr><td className="py-4 font-black">Pago de Vacaciones ({liqResult.dias} días)</td><td className="text-right font-black text-slate-900">${liqResult.neto.toLocaleString('es-CO')}</td><td></td></tr>}
                                                {calcMode === 'contrato' && (
                                                    <>
                                                        <tr><td className="py-4">Prestaciones Sociales (Prima/Ces)</td><td className="text-right font-bold">${(liqResult.prima + liqResult.cesantias + liqResult.interesesCesantias).toLocaleString('es-CO')}</td><td></td></tr>
                                                        <tr><td className="py-4">Vacaciones Proporcionales</td><td className="text-right font-bold">${liqResult.vacaciones.toLocaleString('es-CO')}</td><td></td></tr>
                                                        {liqResult.indemnizacion > 0 && <tr><td className="py-4 font-black text-rose-600 tracking-tighter">Indemnización Despido</td><td className="text-right font-black text-rose-600">+${liqResult.indemnizacion.toLocaleString('es-CO')}</td><td></td></tr>}
                                                    </>
                                                )}
                                            </tbody>
                                        </table>
                                        <div className="bg-slate-900 rounded-[2rem] p-10 text-white flex justify-between items-center shadow-2xl relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full -mr-16 -mt-16 pointer-events-none" />
                                            <div><p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">TOTAL NETO PAGADO</p><p className="text-sm text-slate-500 font-medium">Consignación / Efectivo</p></div>
                                            <span className="text-5xl font-black tracking-tighter">${liqResult.neto.toLocaleString('es-CO', {maximumFractionDigits: 0})}</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 text-center p-12 print:hidden"><Calculator className="text-slate-300 mb-6" size={60} /><h4 className="text-2xl font-bold text-slate-800 italic">Esperando datos de liquidación...</h4></div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'seguridad-social' && (
                    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
                        <div className="bg-white rounded-[3rem] border border-slate-200 p-12 shadow-xl relative overflow-hidden" id="payslip-area">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-bl-full -mr-20 -mt-20 pointer-events-none" />
                            <div className="flex justify-between items-start mb-12 border-b border-slate-100 pb-8 relative">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20"><ShieldCheck size={32} /></div>
                                    <div><h4 className="text-3xl font-black text-slate-900 tracking-tight">Proyección de Aportes PILA</h4><p className="text-slate-500 font-medium text-sm mt-1 uppercase tracking-widest">Generado por {hrConfig.company.name}</p></div>
                                </div>
                                <button onClick={() => window.print()} className="print:hidden p-3 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"><Printer size={20}/></button>
                            </div>
                            
                            <form onSubmit={handleCalcularSS} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 bg-slate-50 p-6 rounded-3xl border border-slate-100 print:hidden relative">
                                <div><label className="text-[10px] font-black text-slate-500 uppercase block mb-2 tracking-widest">Días laborados en el mes</label><input type="number" required min="1" max="31" value={diasSS} onChange={(e) => setDiasSS(Number(e.target.value))} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-black outline-none focus:ring-2 focus:ring-emerald-500 transition-all" /></div>
                                <div className="flex items-end"><button type="submit" className="w-full py-3.5 bg-emerald-600 text-white font-black rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 uppercase tracking-widest text-xs">Calcular Aportes</button></div>
                            </form>

                            {ssResult && (
                                <div className="space-y-6 animate-in zoom-in-95 relative">
                                    <div className="p-8 border-2 border-emerald-100 rounded-[2rem] bg-emerald-50/30">
                                        <div className="flex justify-between items-center border-b border-emerald-100 pb-4 mb-6"><span className="text-xs font-black text-emerald-800 uppercase tracking-widest">Concepto Patronal</span><span className="text-xs font-black text-emerald-800 uppercase tracking-widest">Valor Mensual</span></div>
                                        <div className="space-y-5">
                                            <div className="flex justify-between items-center"><span className="text-slate-700 font-bold">Pensión (12% Empleador)</span><span className="font-black text-slate-900 text-lg">${ssResult.pensionAporteEmpleador.toLocaleString('es-CO')}</span></div>
                                            <div className="flex justify-between items-center"><span className="text-slate-700 font-bold">Caja Compensación (4%)</span><span className="font-black text-slate-900 text-lg">${ssResult.cajaCompensacion.toLocaleString('es-CO')}</span></div>
                                            <div className="flex justify-between items-center"><span className="text-slate-700 font-bold">ARL (Riesgo I - 0.522%)</span><span className="font-black text-slate-900 text-lg">${ssResult.arl.toLocaleString('es-CO')}</span></div>
                                            <div className="flex justify-between items-center opacity-50"><span className="text-slate-500 font-medium">Salud (8.5% Empleador)</span><span className="font-bold text-slate-400 text-sm">Exento (Ley 1607)</span></div>
                                        </div>
                                        <div className="mt-10 pt-8 border-t-2 border-slate-900 flex justify-between items-center">
                                            <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Base de Cotización (IBC)</p><p className="text-xl font-bold text-slate-800">${ssResult.ibc.toLocaleString('es-CO')}</p></div>
                                            <div className="text-right"><p className="text-xs font-black text-slate-900 uppercase tracking-widest mb-2">Total a Pagar en PILA</p><p className="text-5xl font-black text-emerald-600 tracking-tighter">${(ssResult.pensionAporteTotal + ssResult.cajaCompensacion + ssResult.arl).toLocaleString('es-CO')}</p></div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 p-6 bg-blue-50 border border-blue-100 rounded-3xl"><Info className="text-blue-600 shrink-0 mt-1" /><p className="text-blue-800 text-xs leading-relaxed font-medium">Este cálculo se basa en el <b>Decreto 2616</b>. Los aportes se fraccionan por semanas trabajadas para reducir el costo legal. Asegúrese de realizar el pago a través de un operador (Aportes en Línea, SOI, etc).</p></div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
            <style jsx global>{` @media print { body * { visibility: hidden; } #payslip-area, #payslip-area * { visibility: visible; } #payslip-area { position: absolute; left: 0; top: 0; width: 100%; border: none !important; box-shadow: none !important; } } `}</style>
        </div>
    );
}