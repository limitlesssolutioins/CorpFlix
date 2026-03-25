'use client';

import { useState } from 'react';
import { 
    Plus, Search, FileText, IdCard, Calculator, Users, Printer, 
    ShieldCheck, DollarSign, ArrowRight, Smartphone, Mail, Briefcase, Sparkles 
} from 'lucide-react';

const SMLMV_2026 = 1300000;

type Tab = 'directorio' | 'liquidacion' | 'seguridad-social';

export default function IndependientesProfesionalPage() {
    const [activeTab, setActiveTab] = useState<Tab>('directorio');
    const [searchQuery, setSearchQuery] = useState('');

    const contractors = [
        { id: 1, name: 'Carlos Mendoza', cedula: '80123456', position: 'Consultor IT', contract: 'Prestación de Servicios', monthlyFee: 4500000, riskLevel: 1 },
        { id: 2, name: 'Ana Silva', cedula: '42987654', position: 'Diseñadora', contract: 'Prestación de Servicios', monthlyFee: 2800000, riskLevel: 2 }
    ];

    // --- State para Liquidación de Honorarios ---
    const [liqData, setLiqData] = useState({
        nombre: '',
        honorarios: 4500000,
        mes: new Date().toLocaleDateString('es-CO', {month: 'long'}),
        retencion: false,
        nivelRiesgo: 1
    });

    const [liqResult, setLiqResult] = useState<any>(null);

    const handleLiquidar = (e: React.FormEvent) => {
        e.preventDefault();
        
        const honorarios = liqData.honorarios;
        let retencion = 0;
        
        // Retención en la fuente (simplificado para independientes)
        if (liqData.retencion && honorarios > 4000000) {
            retencion = honorarios * 0.10;
        }

        const neto = honorarios - retencion;

        setLiqResult({
            honorarios,
            retencion,
            neto,
            mes: liqData.mes
        });
    };

    // --- State para Seguridad Social (PILA) ---
    const [pilaData, setPilaData] = useState({
        ingreso: 4500000,
        nivelRiesgo: 1,
        pagaArlEmpresa: false
    });

    const [pilaResult, setPilaResult] = useState<any>(null);

    const handleCalcularPila = (e: React.FormEvent) => {
        e.preventDefault();
        const ingreso = pilaData.ingreso;
        let ibc = ingreso * 0.4;
        if (ibc < SMLMV_2026) ibc = SMLMV_2026;

        const salud = ibc * 0.125;
        const pension = ibc * 0.16;
        
        const arlRates: Record<number, number> = { 1: 0.00522, 2: 0.01044, 3: 0.02436, 4: 0.04350, 5: 0.06960 };
        const arl = ibc * (arlRates[pilaData.nivelRiesgo] || 0.00522);

        const total = salud + pension + (pilaData.pagaArlEmpresa ? 0 : arl);

        setPilaResult({
            ibc,
            salud,
            pension,
            arl,
            total,
            porcentajeArl: (arlRates[pilaData.nivelRiesgo] * 100).toFixed(3)
        });
    };

    const handleShareWhatsApp = () => {
        if (!liqResult) return;
        const text = `Hola ${liqData.nombre},\nTe comparto tu Cuenta de Cobro por los servicios de ${liqData.mes}.\n\n*Valor a transferir: $${liqResult.neto.toLocaleString('es-CO')}*\n\nDetalle:\n- Honorarios: $${liqResult.honorarios.toLocaleString('es-CO')}\n- Retenciones: $${liqResult.retencion.toLocaleString('es-CO')}\n\nGracias por tu gestión.`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header Profesional */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Contratistas Independientes</h2>
                    <p className="text-slate-500 font-medium">Gestión de Cuentas de Cobro y Seguridad Social sin enredos.</p>
                </div>
            </header>

            {/* Navegación por Pestañas */}
            <nav className="flex items-center gap-1 bg-slate-200/50 p-1.5 rounded-2xl w-fit print:hidden">
                {(['directorio', 'liquidacion', 'seguridad-social'] as Tab[]).map((t) => (
                    <button
                        key={t}
                        onClick={() => setActiveTab(t)}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold capitalize transition-all ${
                            activeTab === t 
                            ? 'bg-white text-indigo-600 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        {t === 'liquidacion' ? 'Cuenta de Cobro' : t.replace('-', ' ')}
                    </button>
                ))}
            </nav>

            <main className="min-h-[60vh]">
                {/* --- Pestaña: Directorio --- */}
                {activeTab === 'directorio' && (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Tarjeta de Agregar Rápido */}
                            <div 
                                onClick={() => setActiveTab('liquidacion')}
                                className="group cursor-pointer bg-indigo-50 border-2 border-dashed border-indigo-200 rounded-3xl p-6 hover:bg-indigo-100 transition-all flex flex-col items-center justify-center text-indigo-600 min-h-[280px]"
                            >
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                                    <Plus size={32} />
                                </div>
                                <h4 className="text-lg font-bold">Generar Cuenta de Cobro</h4>
                                <p className="text-sm text-indigo-500 text-center mt-2 px-4">Liquida el mes rápidamente sin guardar los datos previos.</p>
                            </div>

                            {contractors.map(con => (
                                <div key={con.id} className="group bg-white rounded-3xl border border-slate-200 p-6 hover:shadow-2xl hover:shadow-indigo-600/5 transition-all relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -mr-12 -mt-12 transition-all group-hover:scale-110" />
                                    
                                    <div className="relative">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                                                <Briefcase size={28} />
                                            </div>
                                            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                                Riesgo {con.riskLevel}
                                            </span>
                                        </div>
                                        
                                        <h4 className="text-xl font-bold text-slate-900 mb-1">{con.name}</h4>
                                        <p className="text-sm text-slate-500 flex items-center gap-1.5 mb-6">
                                            <IdCard size={14} className="text-indigo-500" /> CC {con.cedula}
                                        </p>

                                        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">Honorarios Mes</p>
                                                <p className="text-lg font-black text-slate-900">${con.monthlyFee.toLocaleString('es-CO')}</p>
                                            </div>
                                            <button 
                                                onClick={() => {
                                                    setLiqData({...liqData, nombre: con.name, honorarios: con.monthlyFee});
                                                    setPilaData({...pilaData, ingreso: con.monthlyFee, nivelRiesgo: con.riskLevel});
                                                    setActiveTab('liquidacion');
                                                }}
                                                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-sm flex items-center gap-2 hover:bg-indigo-600 transition-colors"
                                            >
                                                Cobrar <ArrowRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- Pestaña: Cuenta de Cobro --- */}
                {activeTab === 'liquidacion' && (
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 animate-in fade-in duration-500">
                        {/* WIZARD DE FORMULARIO */}
                        <div className="xl:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden print:hidden h-fit">
                            <div className="p-6 bg-slate-900 text-white">
                                <h3 className="text-xl font-black flex items-center gap-2">
                                    <Sparkles className="text-indigo-400" /> Asistente de Cobro
                                </h3>
                            </div>

                            <form onSubmit={handleLiquidar} className="p-6 space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block mb-1.5">Contratista a Pagar</label>
                                        <input type="text" required value={liqData.nombre} onChange={(e) => setLiqData({...liqData, nombre: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none font-medium transition-all" />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block mb-1.5">Honorarios del Mes ($)</label>
                                        <input type="number" required value={liqData.honorarios} onChange={(e) => setLiqData({...liqData, honorarios: Number(e.target.value)})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-900 transition-all" />
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors border border-slate-100" onClick={() => setLiqData({...liqData, retencion: !liqData.retencion})}>
                                        <div>
                                            <span className="block text-sm font-bold text-slate-700">Aplicar Retención (10%)</span>
                                            <span className="block text-[10px] text-slate-400 mt-0.5">ReteFuente por honorarios</span>
                                        </div>
                                        <input type="checkbox" checked={liqData.retencion} readOnly className="w-5 h-5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 pointer-events-none" />
                                    </div>
                                </div>
                                <button type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98]">
                                    GENERAR CUENTA
                                </button>
                            </form>
                        </div>

                        {/* RESULTADO VOLANTE */}
                        <div className="xl:col-span-8">
                            {liqResult ? (
                                <div className="space-y-6">
                                    <div className="flex flex-wrap items-center gap-3 print:hidden">
                                        <button onClick={() => window.print()} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-sm">
                                            <Printer size={18} /> Imprimir PDF
                                        </button>
                                        <button onClick={handleShareWhatsApp} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-xl font-bold hover:bg-[#20bd5a] transition-colors shadow-sm shadow-[#25D366]/20">
                                            <Smartphone size={18} /> Enviar WhatsApp
                                        </button>
                                    </div>

                                    <div className="bg-white rounded-[2rem] border border-slate-200 p-8 md:p-14 shadow-xl relative overflow-hidden" id="payslip-area">
                                        <div className="flex justify-between items-start mb-16 border-b border-slate-100 pb-10">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-2xl">LS</div>
                                                <div>
                                                    <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Cuenta de Cobro</h3>
                                                    <p className="text-xs font-bold text-slate-400 tracking-[0.2em] uppercase">Documento Soporte</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha</p>
                                                <p className="text-xl font-bold text-slate-900">{new Date().toLocaleDateString('es-CO', {day: 'numeric', month: 'long', year: 'numeric'})}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-8 mb-16 text-slate-800 leading-relaxed text-lg">
                                            <p>
                                                La empresa Limitless Solutions, NIT. 900.000.000-1, <b>DEBE A</b>:
                                            </p>
                                            <div className="p-6 bg-slate-50 rounded-2xl border-l-4 border-l-indigo-600 font-medium">
                                                <span className="font-black text-slate-900 text-xl block mb-2">{liqData.nombre}</span>
                                                Por concepto de servicios profesionales independientes prestados satisfactoriamente durante el mes de <b>{liqData.mes}</b>.
                                            </div>
                                        </div>

                                        <div className="bg-slate-900 text-white p-8 rounded-3xl space-y-4 shadow-xl">
                                            <div className="flex justify-between items-center text-slate-400 text-sm font-bold uppercase tracking-widest">
                                                <span>Subtotal Honorarios</span>
                                                <span>${liqResult.honorarios.toLocaleString('es-CO')}</span>
                                            </div>
                                            {liqResult.retencion > 0 && (
                                                <div className="flex justify-between items-center text-rose-400 text-sm font-bold uppercase tracking-widest">
                                                    <span>(-) Retención en la Fuente</span>
                                                    <span>- ${liqResult.retencion.toLocaleString('es-CO')}</span>
                                                </div>
                                            )}
                                            <div className="h-px bg-white/10 my-4" />
                                            <div className="flex justify-between items-end">
                                                <span className="text-sm font-black uppercase tracking-widest text-slate-400">Total a Pagar</span>
                                                <span className="text-5xl font-black tracking-tighter">${liqResult.neto.toLocaleString('es-CO')}</span>
                                            </div>
                                        </div>

                                        <div className="mt-32 text-center max-w-sm">
                                            <div className="w-full border-b-2 border-slate-300 mx-auto mb-4" />
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Firma del Contratista</p>
                                            <p className="text-sm font-bold text-slate-900 mt-2">{liqData.nombre}</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-center p-12 print:hidden">
                                    <FileText className="text-slate-300 mb-6" size={60} />
                                    <h4 className="text-2xl font-bold text-slate-800">Generador de Cuentas</h4>
                                    <p className="text-slate-500 mt-2 max-w-sm">Dile adiós a las plantillas de Word. Liquida en segundos y envía el PDF.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* --- Pestaña: Seguridad Social (PILA) --- */}
                {activeTab === 'seguridad-social' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
                        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm h-fit space-y-6 print:hidden">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
                                    <ShieldCheck size={20} />
                                </div>
                                <h4 className="font-bold text-slate-900 text-lg">Asistente PILA (40%)</h4>
                            </div>

                            <form onSubmit={handleCalcularPila} className="space-y-5">
                                <div>
                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block mb-1.5">Ingreso Bruto Mensual ($)</label>
                                    <input type="number" required value={pilaData.ingreso} onChange={(e) => setPilaData({...pilaData, ingreso: Number(e.target.value)})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-900 transition-all" />
                                    <p className="text-[10px] text-slate-400 mt-2">El IBC base de ley se extraerá automáticamente (40%).</p>
                                </div>
                                <div>
                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block mb-1.5">Riesgo Laboral (ARL)</label>
                                    <select value={pilaData.nivelRiesgo} onChange={(e) => setPilaData({...pilaData, nivelRiesgo: Number(e.target.value)})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-900">
                                        <option value="1">Riesgo I (Administrativo)</option>
                                        <option value="2">Riesgo II</option>
                                        <option value="3">Riesgo III (Operativo)</option>
                                        <option value="4">Riesgo IV (Alto)</option>
                                        <option value="5">Riesgo V (Máximo)</option>
                                    </select>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl cursor-pointer hover:bg-emerald-100 transition-colors" onClick={() => setPilaData({...pilaData, pagaArlEmpresa: !pilaData.pagaArlEmpresa})}>
                                    <span className="text-xs font-bold text-emerald-800">¿La Empresa asume la ARL?</span>
                                    <input type="checkbox" checked={pilaData.pagaArlEmpresa} readOnly className="w-5 h-5 text-emerald-600 border-slate-300 rounded pointer-events-none" />
                                </div>
                                <button type="submit" className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-lg transition-all active:scale-[0.98]">
                                    VER PROYECCIÓN PILA
                                </button>
                            </form>
                        </div>

                        <div className="lg:col-span-8">
                            {pilaResult ? (
                                <div className="bg-white rounded-3xl border border-slate-200 p-10 shadow-xl overflow-hidden relative">
                                    <div className="flex items-center gap-4 mb-10 border-b border-slate-100 pb-8">
                                        <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center">
                                            <Calculator size={32} />
                                        </div>
                                        <div>
                                            <h4 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Proyección de Aportes</h4>
                                            <p className="text-xs font-bold text-slate-400 tracking-widest uppercase mt-1">Obligación legal para Contratistas</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                        <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Base de Cotización (IBC)</p>
                                            <p className="text-3xl font-black text-slate-900">${pilaResult.ibc.toLocaleString('es-CO')}</p>
                                            {pilaResult.ibc === SMLMV_2026 && <p className="text-xs text-rose-500 font-bold mt-2">Se ajustó al Mínimo Legal (1 SMLMV)</p>}
                                        </div>
                                        <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-3xl">
                                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Costo Total Planilla</p>
                                            <p className="text-3xl font-black text-emerald-700">${pilaResult.total.toLocaleString('es-CO')}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center p-5 border border-slate-100 rounded-2xl bg-white">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black text-lg">S</div>
                                                <div>
                                                    <span className="font-bold text-slate-900 block text-lg">Salud (EPS)</span>
                                                    <span className="text-xs font-bold text-slate-400">Aporte del 12.5%</span>
                                                </div>
                                            </div>
                                            <span className="text-2xl font-black text-slate-900">${pilaResult.salud.toLocaleString('es-CO')}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-5 border border-slate-100 rounded-2xl bg-white">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center font-black text-lg">P</div>
                                                <div>
                                                    <span className="font-bold text-slate-900 block text-lg">Pensión (AFP)</span>
                                                    <span className="text-xs font-bold text-slate-400">Aporte del 16.0%</span>
                                                </div>
                                            </div>
                                            <span className="text-2xl font-black text-slate-900">${pilaResult.pension.toLocaleString('es-CO')}</span>
                                        </div>
                                        <div className={`flex justify-between items-center p-5 border border-slate-100 rounded-2xl bg-white transition-opacity ${pilaData.pagaArlEmpresa ? 'opacity-50' : ''}`}>
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-black text-lg">A</div>
                                                <div>
                                                    <span className="font-bold text-slate-900 block text-lg">Riesgos (ARL)</span>
                                                    <span className="text-xs font-bold text-slate-400">Aporte del {pilaResult.porcentajeArl}%</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-2xl font-black text-slate-900">${pilaData.pagaArlEmpresa ? '0' : pilaResult.arl.toLocaleString('es-CO')}</span>
                                                {pilaData.pagaArlEmpresa && <p className="text-[10px] font-bold text-rose-500 uppercase mt-1">Asumido por Empresa</p>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-center p-12">
                                    <ShieldCheck className="text-slate-300 mb-6" size={60} />
                                    <h4 className="text-2xl font-bold text-slate-800">Calculadora PILA</h4>
                                    <p className="text-slate-500 mt-2 max-w-sm">No te compliques con la norma. Te damos el desglose exacto que debes pagar en tu planilla este mes.</p>
                                </div>
                            )}
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
