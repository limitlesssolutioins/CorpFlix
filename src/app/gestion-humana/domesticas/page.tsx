'use client';

import { useState, useEffect } from 'react';
import { 
    Plus, Search, Home, IdCard, Calculator, Users, Printer, 
    ShieldCheck, DollarSign, ArrowRight, Smartphone, Mail, AlertCircle, Info, Sparkles,
    FileMinus, Calendar, Building2
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
    
    // Simulación de datos de la empresa (Marca Blanca)
    const [company, setCompany] = useState({
        name: 'HOGAR FAMILIA RAMIREZ',
        nit: '900.123.456-7',
        logo: null // Si tuviera logo se mostraría
    });

    const employees = [
        { id: 1, name: 'Rosa Hernández', cedula: '52123456', position: 'Externa', address: 'Calle 45 #12-34', phone: '300-555-6666', salary: 1300000, start_date: '2025-01-15' },
        { id: 2, name: 'Gloria Ramírez', cedula: '52987654', position: 'Por Días', address: 'Carrera 78 #90-12', phone: '300-777-8888', salary: 65000, start_date: '2025-03-01' }
    ];

    // --- State para Liquidación Profesional ---
    const [liqData, setLiqData] = useState({
        nombre: '',
        tipo: 'mes' as 'mes' | 'dias',
        salarioBase: 1300000,
        diasTrabajados: 30,
        esInterna: false,
        
        // Extras
        hasExtras: false,
        startTime: '08:00',
        endTime: '19:00',
        breakMinutes: 60,
        isSundayOrHoliday: false,
        weeklyHours: 44,

        // Prestaciones en Nómina
        liquidarPrima: false,
        liquidarCesantias: false,
        diasPrestaciones: 180,

        // Modo Vacaciones
        diasDisfrutados: 15,
        periodoDesde: '',
        periodoHasta: '',

        // Modo Contrato
        fechaIngreso: '2025-01-01',
        fechaRetiro: new Date().toISOString().split('T')[0],
        causaIndemnizacion: false,
        diasPendientesVacaciones: 0
    });

    const [liqResult, setLiqResult] = useState<any>(null);

    const handleLiquidar = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (calcMode === 'nomina') {
            liquidarNomina();
        } else if (calcMode === 'contrato') {
            liquidarFinContrato();
        } else {
            liquidarSoloVacaciones();
        }
    };

    const liquidarNomina = () => {
        let subtotalSalario = 0;
        let extrasAmount = 0;
        let auxTrans = 0;
        let descansoDominical = 0;

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
                weeklyHours: liqData.weeklyHours,
                startTime: liqData.startTime,
                endTime: liqData.endTime,
                breakMinutes: liqData.breakMinutes,
                isSundayOrHoliday: liqData.isSundayOrHoliday
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
            if (liqData.liquidarCesantias) {
                cesantias = pres.cesantias;
                intereses = pres.interesesCesantias;
            }
        }

        const totalDevengado = subtotalSalario + descansoDominical + extrasAmount + auxTrans + prima + cesantias + intereses;
        const neto = totalDevengado - (salud + pension);

        setLiqResult({
            mode: 'nomina',
            subtotalSalario,
            descansoDominical,
            extrasAmount,
            auxTrans,
            salud,
            pension,
            prima,
            cesantias,
            intereses,
            neto,
            totalDevengado
        });
    };

    const liquidarFinContrato = () => {
        const res = calculateLiquidacionContrato(
            liqData.salarioBase,
            liqData.esInterna ? 0 : AUX_TRANSPORTE_2026,
            new Date(liqData.fechaIngreso),
            new Date(liqData.fechaRetiro),
            liqData.diasPendientesVacaciones,
            liqData.causaIndemnizacion
        );

        setLiqResult({
            mode: 'contrato',
            ...res,
            neto: res.total
        });
    };

    const liquidarSoloVacaciones = () => {
        // Las vacaciones se pagan sobre el salario base sin transporte
        const valorDia = liqData.salarioBase / 30;
        const totalVacaciones = valorDia * liqData.diasDisfrutados;

        setLiqResult({
            mode: 'vacaciones',
            subtotalSalario: totalVacaciones,
            neto: totalVacaciones,
            dias: liqData.diasDisfrutados
        });
    };

    const handleShareWhatsApp = () => {
        if (!liqResult) return;
        const msg = `Hola ${liqData.nombre}, tu liquidación de ${calcMode} está lista.\n*Valor Neto: $${liqResult.neto.toLocaleString('es-CO')}*\n\nGenerado por ${company.name}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header Profesional Marca Blanca */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                        <Building2 size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">{company.name}</h2>
                        <p className="text-slate-500 font-medium text-xs">NIT: {company.nit} • Gestión Humana</p>
                    </div>
                </div>
            </header>

            {/* Navegación Principal */}
            <nav className="flex items-center gap-1 bg-slate-200/50 p-1.5 rounded-2xl w-fit print:hidden">
                {(['directorio', 'liquidacion', 'seguridad-social'] as Tab[]).map((t) => (
                    <button
                        key={t}
                        onClick={() => setActiveTab(t)}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold capitalize transition-all ${
                            activeTab === t ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        {t.replace('-', ' ')}
                    </button>
                ))}
            </nav>

            <main className="min-h-[60vh]">
                {activeTab === 'directorio' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
                        <div onClick={() => { setCalcMode('nomina'); setActiveTab('liquidacion'); }} className="group cursor-pointer bg-rose-50 border-2 border-dashed border-rose-200 rounded-3xl p-6 hover:bg-rose-100 transition-all flex flex-col items-center justify-center text-rose-600 min-h-[250px]">
                            <Plus size={32} className="mb-4" />
                            <h4 className="text-lg font-bold">Nueva Liquidación</h4>
                            <p className="text-sm text-rose-500 text-center mt-2">Inicia un proceso rápido de pago o terminación.</p>
                        </div>

                        {employees.map(emp => (
                            <div key={emp.id} className="bg-white rounded-3xl border border-slate-200 p-6 hover:shadow-xl transition-all relative overflow-hidden">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                                        <Users size={24} />
                                    </div>
                                    <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-lg text-[10px] font-black uppercase">{emp.position}</span>
                                </div>
                                <h4 className="text-lg font-bold text-slate-900">{emp.name}</h4>
                                <p className="text-xs text-slate-500 mb-6">CC {emp.cedula} • Ingreso: {emp.start_date}</p>
                                
                                <div className="grid grid-cols-2 gap-2 mt-4">
                                    <button onClick={() => { setLiqData({...liqData, nombre: emp.name, salarioBase: emp.salary, tipo: emp.position === 'Por Días' ? 'dias' : 'mes'}); setCalcMode('nomina'); setActiveTab('liquidacion'); }} className="py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-rose-600 transition-colors">Nómina</button>
                                    <button onClick={() => { setLiqData({...liqData, nombre: emp.name, salarioBase: emp.salary, fechaIngreso: emp.start_date}); setCalcMode('contrato'); setActiveTab('liquidacion'); }} className="py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors">Fin Contrato</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'liquidacion' && (
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 animate-in fade-in duration-500">
                        {/* WIZARD IZQUIERDA */}
                        <div className="xl:col-span-5 space-y-4 print:hidden">
                            {/* Selector de Modo */}
                            <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl">
                                <button onClick={() => setCalcMode('nomina')} className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${calcMode === 'nomina' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>MENSUAL/DÍAS</button>
                                <button onClick={() => setCalcMode('vacaciones')} className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${calcMode === 'vacaciones' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>VACACIONES</button>
                                <button onClick={() => setCalcMode('contrato')} className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${calcMode === 'contrato' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>FIN CONTRATO</button>
                            </div>

                            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
                                    <h3 className="text-xl font-black flex items-center gap-2">
                                        <Sparkles className="text-rose-400" /> {calcMode.toUpperCase()}
                                    </h3>
                                    {calcMode === 'contrato' && <FileMinus className="text-rose-400" />}
                                </div>

                                <form onSubmit={handleLiquidar} className="p-6 space-y-6">
                                    {/* Campos Comunes */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Nombre Empleada</label>
                                            <input type="text" required value={liqData.nombre} onChange={(e) => setLiqData({...liqData, nombre: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Salario Base Mensual ($)</label>
                                            <input type="number" required value={liqData.salarioBase} onChange={(e) => setLiqData({...liqData, salarioBase: Number(e.target.value)})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold" />
                                        </div>
                                    </div>

                                    {/* Lógica Específica de Nómina */}
                                    {calcMode === 'nomina' && (
                                        <div className="space-y-4 animate-in zoom-in-95 duration-200">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div onClick={() => setLiqData({...liqData, tipo: 'mes'})} className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${liqData.tipo === 'mes' ? 'border-rose-500 bg-rose-50' : 'border-slate-100'}`}>
                                                    <span className="block text-xs font-black text-slate-900">Mensual</span>
                                                </div>
                                                <div onClick={() => setLiqData({...liqData, tipo: 'dias'})} className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${liqData.tipo === 'dias' ? 'border-rose-500 bg-rose-50' : 'border-slate-100'}`}>
                                                    <span className="block text-xs font-black text-slate-900">Por Días</span>
                                                </div>
                                            </div>
                                            {liqData.tipo === 'dias' && (
                                                <input type="number" placeholder="Días trabajados" required value={liqData.diasTrabajados} onChange={(e) => setLiqData({...liqData, diasTrabajados: Number(e.target.value)})} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold" />
                                            )}
                                            <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl cursor-pointer">
                                                <input type="checkbox" checked={liqData.hasExtras} onChange={(e) => setLiqData({...liqData, hasExtras: e.target.checked})} className="w-5 h-5 text-rose-600 rounded" />
                                                <span className="text-xs font-bold text-slate-700">Incluir Horas Extras / Festivos</span>
                                            </label>
                                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                                                <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500"><input type="checkbox" checked={liqData.liquidarPrima} onChange={(e) => setLiqData({...liqData, liquidarPrima: e.target.checked})} /> ¿Pagar Prima?</label>
                                                <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500"><input type="checkbox" checked={liqData.liquidarCesantias} onChange={(e) => setLiqData({...liqData, liquidarCesantias: e.target.checked})} /> ¿Pagar Cesantías?</label>
                                            </div>
                                        </div>
                                    )}

                                    {/* Lógica Específica de Vacaciones */}
                                    {calcMode === 'vacaciones' && (
                                        <div className="space-y-4 animate-in slide-in-from-top-2">
                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Días de descanso a pagar</label>
                                                <input type="number" required value={liqData.diasDisfrutados} onChange={(e) => setLiqData({...liqData, diasDisfrutados: Number(e.target.value)})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold" />
                                            </div>
                                            <p className="text-[10px] text-blue-600 bg-blue-50 p-3 rounded-lg">Nota: Las vacaciones se liquidan sobre el salario base sin incluir el auxilio de transporte.</p>
                                        </div>
                                    )}

                                    {/* Lógica Específica de Fin Contrato */}
                                    {calcMode === 'contrato' && (
                                        <div className="space-y-4 animate-in slide-in-from-top-2">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Fecha Ingreso</label>
                                                    <input type="date" value={liqData.fechaIngreso} onChange={(e) => setLiqData({...liqData, fechaIngreso: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Fecha Retiro</label>
                                                    <input type="date" value={liqData.fechaRetiro} onChange={(e) => setLiqData({...liqData, fechaRetiro: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-400 uppercase">Vacaciones Pendientes (Días)</label>
                                                <input type="number" value={liqData.diasPendientesVacaciones} onChange={(e) => setLiqData({...liqData, diasPendientesVacaciones: Number(e.target.value)})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold" />
                                            </div>
                                            <label className="flex items-center gap-3 p-4 bg-rose-50 text-rose-700 rounded-xl cursor-pointer">
                                                <input type="checkbox" checked={liqData.causaIndemnizacion} onChange={(e) => setLiqData({...liqData, causaIndemnizacion: e.target.checked})} className="w-5 h-5 text-rose-600" />
                                                <span className="text-xs font-black">¿Es despido sin justa causa?</span>
                                            </label>
                                        </div>
                                    )}

                                    <button type="submit" className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl shadow-lg active:scale-[0.98]">CALCULAR AHORA</button>
                                </form>
                            </div>
                        </div>

                        {/* RESULTADO VOLANTE DERECHA */}
                        <div className="xl:col-span-7">
                            {liqResult ? (
                                <div className="space-y-6">
                                    <div className="flex gap-3 print:hidden">
                                        <button onClick={() => window.print()} className="flex-1 py-3 bg-white border border-slate-200 rounded-xl font-bold flex items-center justify-center gap-2"><Printer size={18}/> PDF</button>
                                        <button onClick={handleShareWhatsApp} className="flex-1 py-3 bg-[#25D366] text-white rounded-xl font-bold flex items-center justify-center gap-2"><Smartphone size={18}/> WhatsApp</button>
                                    </div>

                                    <div className="bg-white rounded-[2rem] border border-slate-200 p-10 md:p-14 shadow-2xl relative overflow-hidden" id="payslip-area">
                                        {/* LOGO EMPRESA DINÁMICO */}
                                        <div className="flex justify-between items-start mb-12 border-b border-slate-100 pb-10">
                                            <div className="flex items-center gap-5">
                                                <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-2xl uppercase">
                                                    {company.name.substring(0,2)}
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl font-black text-slate-900 leading-none">{company.name}</h3>
                                                    <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">{calcMode === 'contrato' ? 'LIQUIDACIÓN DEFINITIVA' : 'VOLANTE DE PAGO'}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-slate-400 uppercase">Documento No.</p>
                                                <p className="text-lg font-bold text-slate-900">#{Math.floor(Math.random()*10000)}</p>
                                            </div>
                                        </div>

                                        <div className="bg-slate-50 p-6 rounded-3xl grid grid-cols-2 gap-4 mb-10 border border-slate-100">
                                            <div><p className="text-[10px] font-black text-slate-400 uppercase mb-1">Nombre Empleada</p><p className="font-bold text-slate-900">{liqData.nombre}</p></div>
                                            <div className="text-right"><p className="text-[10px] font-black text-slate-400 uppercase mb-1">Cédula</p><p className="font-bold text-slate-900">{liqData.nombre ? '52.XXX.XXX' : '---'}</p></div>
                                        </div>

                                        <table className="w-full text-left mb-12">
                                            <thead className="border-b-2 border-slate-900 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                                <tr><th className="py-3">Descripción</th><th className="py-3 text-right">Devengos</th><th className="py-3 text-right">Deducciones</th></tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50 text-sm">
                                                {calcMode === 'nomina' && (
                                                    <>
                                                        <tr><td className="py-4 font-medium text-slate-700">Sueldo Base {liqData.tipo === 'dias' ? `(${liqData.diasTrabajados} días)` : ''}</td><td className="text-right font-bold text-slate-900">${liqResult.subtotalSalario.toLocaleString('es-CO')}</td><td></td></tr>
                                                        {liqResult.descansoDominical > 0 && <tr><td className="py-4 font-medium text-slate-700">Descanso Dominical Prop.</td><td className="text-right font-bold text-slate-900">${liqResult.descansoDominical.toLocaleString('es-CO')}</td><td></td></tr>}
                                                        {liqResult.auxTrans > 0 && <tr><td className="py-4 font-medium text-slate-700 italic">Auxilio de Transporte</td><td className="text-right font-bold text-slate-900">${liqResult.auxTrans.toLocaleString('es-CO')}</td><td></td></tr>}
                                                        {liqResult.extrasAmount > 0 && <tr><td className="py-4 font-medium text-slate-700">Recargos / Extras</td><td className="text-right font-bold text-emerald-600">+${liqResult.extrasAmount.toLocaleString('es-CO')}</td><td></td></tr>}
                                                        {liqResult.prima > 0 && <tr><td className="py-4 font-bold text-orange-700">Prima de Servicios</td><td className="text-right font-black text-orange-600">+${liqResult.prima.toLocaleString('es-CO')}</td><td></td></tr>}
                                                        <tr><td className="py-4 text-slate-500">Seguridad Social (Salud/Pens)</td><td></td><td className="text-right font-bold text-rose-600">-${(liqResult.salud + liqResult.pension).toLocaleString('es-CO')}</td></tr>
                                                    </>
                                                )}
                                                {calcMode === 'vacaciones' && (
                                                    <tr><td className="py-4 font-bold text-slate-700">Pago Vacaciones ({liqResult.dias} días)</td><td className="text-right font-black text-slate-900">${liqResult.neto.toLocaleString('es-CO')}</td><td></td></tr>
                                                )}
                                                {calcMode === 'contrato' && (
                                                    <>
                                                        <tr><td className="py-4 font-medium text-slate-700">Prima Legal</td><td className="text-right font-bold text-slate-900">${liqResult.prima.toLocaleString('es-CO')}</td><td></td></tr>
                                                        <tr><td className="py-4 font-medium text-slate-700">Cesantías e Intereses</td><td className="text-right font-bold text-slate-900">${(liqResult.cesantias + liqResult.interesesCesantias).toLocaleString('es-CO')}</td><td></td></tr>
                                                        <tr><td className="py-4 font-medium text-slate-700">Vacaciones Compensadas</td><td className="text-right font-bold text-slate-900">${liqResult.vacaciones.toLocaleString('es-CO')}</td><td></td></tr>
                                                        {liqResult.indemnizacion > 0 && <tr><td className="py-4 font-black text-rose-600">Indemnización Despido</td><td className="text-right font-black text-rose-600">+${liqResult.indemnizacion.toLocaleString('es-CO')}</td><td></td></tr>}
                                                    </>
                                                )}
                                            </tbody>
                                        </table>

                                        <div className="bg-slate-900 rounded-[2rem] p-8 text-white flex justify-between items-center shadow-2xl">
                                            <span className="text-lg font-black uppercase tracking-widest text-slate-400">Total Neto</span>
                                            <span className="text-5xl font-black tracking-tighter">${liqResult.neto.toLocaleString('es-CO', {maximumFractionDigits: 0})}</span>
                                        </div>

                                        <div className="mt-20 pt-10 border-t border-slate-100 flex justify-between px-4">
                                            <div className="text-center w-56"><div className="border-b-2 border-slate-900 mb-2 h-10"></div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Firma Empleador</p></div>
                                            <div className="text-center w-56"><div className="border-b-2 border-slate-900 mb-2 h-10"></div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Firma Empleada</p></div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 text-center p-12 print:hidden">
                                    <Calculator className="text-slate-300 mb-6" size={60} />
                                    <h4 className="text-2xl font-bold text-slate-800">Cálculo de Liquidación</h4>
                                    <p className="text-slate-500 mt-2 max-w-sm">Selecciona el modo y completa el formulario para generar el documento legal.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'seguridad-social' && (
                    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
                        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-12 shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-bl-full -mr-20 -mt-20 pointer-events-none" />
                            <div className="flex items-center gap-6 mb-10">
                                <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg"><ShieldCheck size={32} /></div>
                                <div><h4 className="text-3xl font-black text-slate-900 tracking-tight">Seguridad Social Patronal</h4><p className="text-slate-500 font-medium">Costos adicionales para el empleador (Ley de Domésticas)</p></div>
                            </div>
                            <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl mb-10"><h5 className="font-bold text-blue-900 text-lg flex items-center gap-2"><Info size={20}/> Guía de Cotización</h5><p className="text-blue-700 text-sm mt-1 leading-relaxed">Recuerde que para empleadas domésticas el aporte a Caja de Compensación (4%) y ARL es obligatorio para que el empleador esté protegido legalmente ante cualquier accidente.</p></div>
                            <div className="p-8 border-2 border-slate-50 rounded-3xl bg-slate-50/30">
                                <div className="space-y-5">
                                    <div className="flex justify-between text-slate-600 font-bold uppercase text-[11px] tracking-widest border-b pb-3 mb-2"><span>Entidad</span><span>Valor Estimado (1 SMLMV)</span></div>
                                    <div className="flex justify-between items-center"><span className="text-slate-700 font-medium">Salud (8.5% Empleador)</span><span className="font-black text-slate-900">${(SMLMV_2026 * 0.085).toLocaleString('es-CO')}</span></div>
                                    <div className="flex justify-between items-center"><span className="text-slate-700 font-medium">Pensión (12% Empleador)</span><span className="font-black text-slate-900">${(SMLMV_2026 * 0.12).toLocaleString('es-CO')}</span></div>
                                    <div className="flex justify-between items-center"><span className="text-slate-700 font-medium">ARL (Riesgo I)</span><span className="font-black text-slate-900">${(SMLMV_2026 * 0.00522).toLocaleString('es-CO')}</span></div>
                                    <div className="flex justify-between items-center"><span className="text-slate-700 font-medium">Caja Compensación (4%)</span><span className="font-black text-slate-900">${(SMLMV_2026 * 0.04).toLocaleString('es-CO')}</span></div>
                                </div>
                                <div className="mt-8 pt-8 border-t-2 border-slate-900 flex justify-between items-center"><span className="text-xl font-black text-slate-900">COSTO MENSUAL PILA</span><span className="text-4xl font-black text-emerald-600">${(SMLMV_2026 * 0.25022).toLocaleString('es-CO')}</span></div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <style jsx global>{`
                @media print {
                    body * { visibility: hidden; }
                    #payslip-area, #payslip-area * { visibility: visible; }
                    #payslip-area {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        border: none !important;
                        box-shadow: none !important;
                    }
                }
            `}</style>
        </div>
    );
}