'use client';

import { useState, useEffect } from 'react';
import { 
    Plus, Search, FileText, IdCard, Calculator, Users, Printer, 
    ShieldCheck, DollarSign, ArrowRight, Smartphone, Mail, Briefcase, Sparkles, Building2
} from 'lucide-react';

import { useRouter } from 'next/navigation';

const SMLMV_2026 = 1300000;

type Tab = 'directorio' | 'liquidacion' | 'seguridad-social';

export default function IndependientesProfesionalPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>('directorio');
    const [searchQuery, setSearchQuery] = useState('');
    
    // Datos dinámicos de la empresa
    const [company, setCompany] = useState<any>({
        name: 'Cargando...',
        nit: '...',
        logo: null
    });
    
    const [contractors, setContractors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/companies/current')
            .then(res => res.json())
            .then(data => {
                if (data.company) {
                    setCompany({
                        name: data.company.name || 'Empresa No Definida',
                        nit: data.company.nit || 'Sin NIT',
                        logo: data.company.logo
                    });
                }
            })
            .catch(() => {
                setCompany({ name: 'Mi Empresa', nit: 'Sin NIT', logo: null });
            });

        fetch('/api/employees')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const independientes = data.filter((emp: any) => emp.contractType === 'INDEPENDIENTE');
                    setContractors(independientes);
                } else {
                    console.error('Expected an array of contractors, got:', data);
                    setContractors([]);
                }
            })
            .catch(err => console.error('Error fetching independientes:', err))
            .finally(() => setLoading(false));
    }, []);

    // --- State para Liquidación de Honorarios ---
    const [liqData, setLiqData] = useState({
        nombre: '',
        honorarios: 4500000,
        mes: new Date().toLocaleDateString('es-CO', {month: 'long'}),
        retencion: false
    });

    const [liqResult, setLiqResult] = useState<any>(null);

    const handleLiquidar = (e: React.FormEvent) => {
        e.preventDefault();
        const honorarios = liqData.honorarios;
        let retencion = liqData.retencion && honorarios > 4000000 ? honorarios * 0.10 : 0;
        setLiqResult({ honorarios, retencion, neto: honorarios - retencion, mes: liqData.mes });
    };

    // --- State para Seguridad Social (PILA) ---
    const [pilaData, setPilaData] = useState({ ingreso: 4500000, nivelRiesgo: 1, pagaArlEmpresa: false });
    const [pilaResult, setPilaResult] = useState<any>(null);

    const handleCalcularPila = (e: React.FormEvent) => {
        e.preventDefault();
        const ingreso = pilaData.ingreso;
        let ibc = Math.max(ingreso * 0.4, SMLMV_2026);
        const arlRates: Record<number, number> = { 1: 0.00522, 2: 0.01044, 3: 0.02436, 4: 0.04350, 5: 0.06960 };
        const arl = ibc * (arlRates[pilaData.nivelRiesgo] || 0.00522);
        setPilaResult({ ibc, salud: ibc * 0.125, pension: ibc * 0.16, arl, total: (ibc * 0.285) + (pilaData.pagaArlEmpresa ? 0 : arl), porcentajeArl: (arlRates[pilaData.nivelRiesgo] * 100).toFixed(3) });
    };

    const handleShareWhatsApp = () => {
        if (!liqResult) return;
        const msg = `Hola ${liqData.nombre}, tu Cuenta de Cobro por ${liqData.mes} está lista.\n*Valor: $${liqResult.neto.toLocaleString('es-CO')}*\n\nAtentamente, ${company.name}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header Profesional Marca Blanca */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden border-b border-slate-200 pb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white overflow-hidden shadow-lg shadow-slate-200">
                        {company.logo ? <img src={company.logo} alt="Logo" className="w-full h-full object-cover" /> : <Building2 size={24} />}
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">{company.name}</h2>
                        <p className="text-slate-500 font-medium text-xs">NIT: {company.nit} • Gestión de Contratistas</p>
                    </div>
                </div>
                <div className="flex gap-2">
                     <button onClick={() => setActiveTab('directorio')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'directorio' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>Directorio</button>
                     <button onClick={() => setActiveTab('liquidacion')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'liquidacion' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>Cobro</button>
                     <button onClick={() => setActiveTab('seguridad-social')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'seguridad-social' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>PILA</button>
                </div>
            </header>

            <main className="min-h-[60vh]">
                {activeTab === 'directorio' && (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Briefcase className="text-indigo-500" size={20} /> Contratistas Activos</h3>
                            <button onClick={() => router.push('/gestion-humana/employees/create')} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-indigo-600 transition-colors"><Plus size={16}/> Nuevo Contratista</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {contractors.map(con => (
                                <div key={con.id} className="group bg-white rounded-3xl border border-slate-200 p-6 hover:shadow-xl transition-all relative overflow-hidden border-t-4 border-t-indigo-500">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors"><Briefcase size={24} /></div>
                                        <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-black uppercase">Contratista</span>
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-900">{con.firstName} {con.lastName}</h4>
                                    <p className="text-xs text-slate-500 mb-6">CC {con.identification} • {con.defaultPosition || 'Independiente'}</p>
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                        <p className="text-lg font-black text-slate-900">${(con.salaryAmount || 0).toLocaleString('es-CO')}</p>
                                        <button onClick={() => { setLiqData({...liqData, nombre: `${con.firstName} ${con.lastName}`, honorarios: con.salaryAmount || 0}); setActiveTab('liquidacion'); }} className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-2 hover:bg-indigo-600 transition-colors">Cobrar <ArrowRight size={14}/></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'liquidacion' && (
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 animate-in fade-in duration-500">
                        <div className="xl:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden h-fit">
                            <div className="p-6 bg-slate-900 text-white"><h3 className="text-xl font-black flex items-center gap-2"><Sparkles className="text-indigo-400" /> Liquidar Honorarios</h3></div>
                            <form onSubmit={handleLiquidar} className="p-6 space-y-6">
                                <div><label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Nombre Contratista</label><input type="text" required value={liqData.nombre} onChange={(e) => setLiqData({...liqData, nombre: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold" /></div>
                                <div><label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Valor a Cobrar ($)</label><input type="number" required value={liqData.honorarios} onChange={(e) => setLiqData({...liqData, honorarios: Number(e.target.value)})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold" /></div>
                                <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors"><span className="text-xs font-bold text-slate-700">Aplicar Retención (10%)</span><input type="checkbox" checked={liqData.retencion} onChange={(e) => setLiqData({...liqData, retencion: e.target.checked})} className="w-5 h-5 text-indigo-600 rounded" /></label>
                                <button type="submit" className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-lg active:scale-[0.98]">GENERAR</button>
                            </form>
                        </div>
                        <div className="xl:col-span-8">
                            {liqResult ? (
                                <div className="space-y-6">
                                    <div className="flex gap-3 print:hidden"><button onClick={() => window.print()} className="flex-1 py-3 bg-white border border-slate-200 rounded-xl font-bold flex items-center justify-center gap-2"><Printer size={18}/> PDF</button><button onClick={handleShareWhatsApp} className="flex-1 py-3 bg-[#25D366] text-white rounded-xl font-bold flex items-center justify-center gap-2"><Smartphone size={18}/> WhatsApp</button></div>
                                    <div className="bg-white rounded-[2rem] border border-slate-200 p-10 md:p-14 shadow-2xl relative overflow-hidden" id="payslip-area">
                                        <div className="flex justify-between items-start mb-12 border-b border-slate-100 pb-10">
                                            <div className="flex items-center gap-5">
                                                <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl uppercase">{company.name.substring(0,2)}</div>
                                                <div><h3 className="text-2xl font-black text-slate-900 leading-none">{company.name}</h3><p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">CUENTA DE COBRO SOPORTE</p></div>
                                            </div>
                                        </div>
                                        <div className="space-y-8 mb-16 text-slate-800 leading-relaxed text-lg">
                                            <p>De acuerdo al contrato de prestación de servicios, el suscrito <b>{liqData.nombre}</b>, presenta para pago la suma de:</p>
                                            <div className="p-8 bg-slate-900 text-white rounded-3xl shadow-xl flex justify-between items-end">
                                                <div><p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-2">Total Neto a Recibir</p><p className="text-5xl font-black tracking-tighter">${liqResult.neto.toLocaleString('es-CO')}</p></div>
                                                <div className="text-right text-xs text-slate-400">Mes: {liqResult.mes}</div>
                                            </div>
                                        </div>
                                        <div className="mt-32 border-t-2 border-slate-900 pt-4 max-w-xs text-center"><p className="text-sm font-bold text-slate-900">{liqData.nombre}</p><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Firma del Contratista</p></div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 text-center p-12 print:hidden"><FileText className="text-slate-300 mb-6" size={60} /><h4 className="text-2xl font-bold text-slate-800">Generador de Documentos</h4><p className="text-slate-500 mt-2 max-w-sm">Liquida y genera la cuenta de cobro legal en segundos.</p></div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'seguridad-social' && (
                    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
                        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-xl relative overflow-hidden">
                            <div className="flex items-center gap-6 mb-10"><div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg"><ShieldCheck size={32} /></div><div><h4 className="text-3xl font-black text-slate-900 tracking-tight">Proyección PILA (40%)</h4><p className="text-slate-500 font-medium">Cálculo de aportes para contratistas</p></div></div>
                            <form onSubmit={handleCalcularPila} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                <div><label className="text-xs font-bold text-slate-500 block mb-2">Ingreso Mensual</label><input type="number" required value={pilaData.ingreso} onChange={(e) => setPilaData({...pilaData, ingreso: Number(e.target.value)})} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold outline-none" /></div>
                                <div className="flex items-end"><button type="submit" className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all">CALCULAR APORTES</button></div>
                            </form>
                            {pilaResult && (
                                <div className="space-y-4 animate-in zoom-in-95">
                                    <div className="flex justify-between p-5 border-b"><span>Salud (12.5%)</span><span className="font-bold">${pilaResult.salud.toLocaleString('es-CO')}</span></div>
                                    <div className="flex justify-between p-5 border-b"><span>Pensión (16%)</span><span className="font-bold">${pilaResult.pension.toLocaleString('es-CO')}</span></div>
                                    <div className="flex justify-between p-5 border-b"><span>ARL (Riesgo {pilaData.nivelRiesgo})</span><span className="font-bold">${pilaResult.arl.toLocaleString('es-CO')}</span></div>
                                    <div className="flex justify-between p-6 bg-slate-900 text-white rounded-2xl shadow-xl"><span className="text-xl font-black">TOTAL PLANILLA</span><span className="text-3xl font-black text-emerald-400">${pilaResult.total.toLocaleString('es-CO')}</span></div>
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