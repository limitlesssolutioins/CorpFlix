'use client';

import { useState } from 'react';
import { Plus, Search, FileText, IdCard, Calculator, Users, Printer } from 'lucide-react';

const SMLMV = 1300000;

export default function IndependientesPage() {
    const [activeTab, setActiveTab] = useState<'directorio' | 'calculadora'>('directorio');
    const [searchQuery, setSearchQuery] = useState('');

    const contractors = [
        { id: 1, name: 'Carlos Mendoza', cedula: '80123456', position: 'Consultor IT', contract: 'Prestación de Servicios', phone: '300-111-2222', monthlyFee: 4500000, riskLevel: 1 },
        { id: 2, name: 'Ana Silva', cedula: '42987654', position: 'Diseñadora', contract: 'Prestación de Servicios', phone: '300-333-4444', monthlyFee: 2800000, riskLevel: 2 }
    ];

    // Calculadora State
    const [calcData, setCalcData] = useState({
        nombre: '',
        ingresoMensual: 4500000,
        nivelRiesgo: 1,
        pagaArlEmpresa: false // Si el riesgo es 4 o 5, suele pagarlo la empresa contratante.
    });

    const [calcResult, setCalcResult] = useState<any>(null);

    const handleCalcular = (e: React.FormEvent) => {
        e.preventDefault();
        
        const ingreso = calcData.ingresoMensual;
        
        // El IBC (Ingreso Base de Cotización) para independientes en Colombia es el 40% del ingreso
        let ibc = ingreso * 0.4;
        
        // El IBC no puede ser inferior a 1 SMLMV
        if (ibc < SMLMV) {
            ibc = SMLMV;
        }

        // Porcentajes de cotización para independientes
        const salud = ibc * 0.125;
        const pension = ibc * 0.16;

        // Porcentajes ARL según nivel de riesgo
        const arlRates: Record<number, number> = {
            1: 0.00522,
            2: 0.01044,
            3: 0.02436,
            4: 0.04350,
            5: 0.06960
        };

        const porcentajeArl = arlRates[calcData.nivelRiesgo] || 0.00522;
        const arl = ibc * porcentajeArl;

        const totalPagarContratista = salud + pension + (calcData.pagaArlEmpresa ? 0 : arl);

        setCalcResult({
            ingresoTotal: ingreso,
            ibc: ibc,
            salud,
            pension,
            arl,
            porcentajeArl: porcentajeArl * 100,
            totalAportes: totalPagarContratista,
            netoRecibido: ingreso - totalPagarContratista
        });
    };

    return (
        <div className="pb-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 print:hidden">
                <div>
                    <h3 className="text-xl font-bold text-slate-900">Contratistas Independientes</h3>
                    <p className="text-sm text-slate-600">Directorio y cálculo de aportes a seguridad social (Planilla PILA)</p>
                </div>
                {activeTab === 'directorio' && (
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-semibold">
                        <Plus size={20} />
                        Nuevo Contratista
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 mb-6 print:hidden">
                <button
                    onClick={() => setActiveTab('directorio')}
                    className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${
                        activeTab === 'directorio'
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                >
                    <Users size={18} />
                    Directorio
                </button>
                <button
                    onClick={() => setActiveTab('calculadora')}
                    className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${
                        activeTab === 'calculadora'
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                >
                    <Calculator size={18} />
                    Calculadora PILA
                </button>
            </div>

            {/* Content: Directorio */}
            {activeTab === 'directorio' && (
                <div className="space-y-6 print:hidden">
                    <div className="bg-white rounded-xl border border-slate-200 p-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Buscar contratistas..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {contractors.map((emp) => (
                            <div key={emp.id} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow border-t-4 border-t-indigo-500">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-lg">{emp.name}</h4>
                                        <div className="flex items-center gap-1 text-sm text-slate-600 mt-1">
                                            <IdCard size={14} />
                                            CC: {emp.cedula}
                                        </div>
                                    </div>
                                    <div className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold">
                                        Riesgo {emp.riskLevel}
                                    </div>
                                </div>

                                <div className="space-y-2 mb-4 text-sm text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <FileText size={14} className="text-indigo-500" />
                                        {emp.position}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span>📞</span>
                                        {emp.phone}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-200">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600">Honorarios Base</span>
                                        <span className="text-lg font-black text-slate-800">
                                            ${emp.monthlyFee.toLocaleString('es-CO')}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        setCalcData({
                                            ...calcData,
                                            nombre: emp.name,
                                            ingresoMensual: emp.monthlyFee,
                                            nivelRiesgo: emp.riskLevel,
                                            pagaArlEmpresa: emp.riskLevel >= 4
                                        });
                                        setActiveTab('calculadora');
                                        setCalcResult(null);
                                    }}
                                    className="w-full mt-4 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors font-semibold text-sm"
                                >
                                    Calcular Seguridad Social
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Content: Calculadora */}
            {activeTab === 'calculadora' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Formulario */}
                    <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm print:hidden">
                        <form onSubmit={handleCalcular} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Contratista</label>
                                <input
                                    type="text"
                                    required
                                    value={calcData.nombre}
                                    onChange={(e) => setCalcData({ ...calcData, nombre: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Honorarios Mensuales (Sin IVA)</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    value={calcData.ingresoMensual}
                                    onChange={(e) => setCalcData({ ...calcData, ingresoMensual: Number(e.target.value) })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                                <p className="text-xs text-slate-500 mt-1">El IBC se calculará sobre el 40% de este valor.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Nivel de Riesgo (ARL)</label>
                                    <select
                                        value={calcData.nivelRiesgo}
                                        onChange={(e) => setCalcData({ ...calcData, nivelRiesgo: Number(e.target.value) })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    >
                                        <option value="1">Riesgo I (0.522%)</option>
                                        <option value="2">Riesgo II (1.044%)</option>
                                        <option value="3">Riesgo III (2.436%)</option>
                                        <option value="4">Riesgo IV (4.350%)</option>
                                        <option value="5">Riesgo V (6.960%)</option>
                                    </select>
                                </div>
                                <div className="flex items-end pb-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={calcData.pagaArlEmpresa}
                                            onChange={(e) => setCalcData({ ...calcData, pagaArlEmpresa: e.target.checked })}
                                            className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                                        />
                                        <span className="text-xs font-medium text-slate-700 leading-tight">Empresa Paga ARL (Obligatorio en IV/V)</span>
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors mt-4"
                            >
                                Calcular Planilla
                            </button>
                        </form>
                    </div>

                    {/* Reporte de Aportes */}
                    <div className="lg:col-span-8">
                        {calcResult ? (
                            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm relative" id="payslip-area">
                                
                                <div className="absolute top-8 right-8 print:hidden">
                                     <button
                                        onClick={() => window.print()}
                                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors font-semibold text-sm"
                                    >
                                        <Printer size={16} />
                                        Imprimir
                                    </button>
                                </div>

                                <div className="text-center mb-8 border-b border-slate-200 pb-6">
                                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Proyección Seguridad Social</h2>
                                    <p className="text-slate-500 mt-1">Trabajadores Independientes (Planilla PILA)</p>
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                    <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 col-span-2">
                                        <p className="text-xs font-bold text-indigo-500 uppercase">Contratista</p>
                                        <p className="text-lg font-semibold text-indigo-900">{calcData.nombre || 'No especificado'}</p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-xl">
                                        <p className="text-xs font-bold text-slate-500 uppercase">Honorarios Mes</p>
                                        <p className="text-lg font-semibold text-slate-900">
                                            ${calcResult.ingresoTotal.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                                        </p>
                                    </div>
                                    <div className="bg-slate-900 p-4 rounded-xl text-white">
                                        <p className="text-xs font-bold text-slate-400 uppercase">Base Cotización (IBC 40%)</p>
                                        <p className="text-lg font-semibold">
                                            ${calcResult.ibc.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                                        </p>
                                    </div>
                                </div>

                                <table className="w-full text-left mb-6">
                                    <thead>
                                        <tr className="border-b-2 border-slate-800 text-slate-900 text-sm">
                                            <th className="py-2 font-bold uppercase">Entidad / Concepto</th>
                                            <th className="py-2 font-bold uppercase text-center">% Aplicado</th>
                                            <th className="py-2 font-bold uppercase text-right">Valor a Pagar</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-slate-700">
                                        <tr>
                                            <td className="py-4 font-medium">EPS - Salud</td>
                                            <td className="py-4 text-center font-mono text-sm bg-slate-50">12.5%</td>
                                            <td className="py-4 text-right font-semibold">
                                                ${calcResult.salud.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-4 font-medium">AFP - Pensión</td>
                                            <td className="py-4 text-center font-mono text-sm bg-slate-50">16.0%</td>
                                            <td className="py-4 text-right font-semibold">
                                                ${calcResult.pension.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                                            </td>
                                        </tr>
                                        <tr className={calcData.pagaArlEmpresa ? 'opacity-50' : ''}>
                                            <td className="py-4 font-medium">
                                                ARL Riesgo {calcData.nivelRiesgo}
                                                {calcData.pagaArlEmpresa && <span className="block text-xs text-rose-500">*Asumido por Empresa Contratante</span>}
                                            </td>
                                            <td className="py-4 text-center font-mono text-sm bg-slate-50">
                                                {calcResult.porcentajeArl.toFixed(3)}%
                                            </td>
                                            <td className="py-4 text-right font-semibold">
                                                ${calcData.pagaArlEmpresa ? '0' : calcResult.arl.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                                            </td>
                                        </tr>
                                    </tbody>
                                    <tfoot>
                                        <tr className="border-t-2 border-slate-800">
                                            <td colSpan={2} className="py-4 px-2 font-bold text-slate-900 uppercase">
                                                Total Planilla a Pagar (Contratista)
                                            </td>
                                            <td className="py-4 px-2 text-right text-2xl font-black text-indigo-600">
                                                ${calcResult.totalAportes.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>

                                <div className="mt-8 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex justify-between items-center">
                                    <div>
                                        <p className="text-sm font-bold text-emerald-800 uppercase">Ingreso Neto Estimado</p>
                                        <p className="text-xs text-emerald-600">Después de pagar seguridad social (Honorarios - Total Planilla)</p>
                                    </div>
                                    <div className="text-2xl font-black text-emerald-700">
                                        ${calcResult.netoRecibido.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 print:hidden text-center p-6">
                                <FileText size={48} className="text-slate-300 mb-4" />
                                <h4 className="text-lg font-semibold text-slate-600">Proyección Planilla PILA</h4>
                                <p className="text-slate-500 mt-2 max-w-sm">
                                    Ingresa los honorarios y el nivel de riesgo para calcular los aportes a Salud, Pensión y ARL que el contratista debe realizar por ley.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Estilos para impresión */}
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