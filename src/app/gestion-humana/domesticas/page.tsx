'use client';

import { useState } from 'react';
import { Plus, Search, Home, IdCard, Calculator, Users, Printer } from 'lucide-react';

const SMLMV = 1300000;
const AUX_TRANSPORTE = 162000;

export default function DomesticasEmpleadosPage() {
    const [activeTab, setActiveTab] = useState<'directorio' | 'calculadora'>('directorio');
    const [searchQuery, setSearchQuery] = useState('');

    const employees = [
        { id: 1, name: 'Rosa Hernández', cedula: '52123456', position: 'Interna', address: 'Calle 45 #12-34', phone: '300-555-6666', salary: 1300000 },
        { id: 2, name: 'Gloria Ramírez', cedula: '52987654', position: 'Por Días', address: 'Carrera 78 #90-12', phone: '300-777-8888', salary: 65000 } // Salario por día
    ];

    // Calculadora State
    const [calcData, setCalcData] = useState({
        nombre: '',
        tipo: 'mes', // 'mes' o 'dias'
        salarioBase: 1300000,
        diasTrabajados: 30, // Para tipo 'mes', o los días efectivos para 'dias'
        esInterna: false,
    });

    const [calcResult, setCalcResult] = useState<any>(null);

    const handleCalcular = (e: React.FormEvent) => {
        e.preventDefault();
        
        let totalDevengado = 0;
        let auxilioTransporte = 0;
        let salud = 0;
        let pension = 0;
        
        const isPorDias = calcData.tipo === 'dias';

        if (isPorDias) {
            // Cálculo por días (El salario base ingresado es el valor por día)
            totalDevengado = calcData.salarioBase * calcData.diasTrabajados;
            
            // Auxilio de transporte proporcional por los días trabajados
            // Si no es interna, tiene derecho al auxilio proporcional
            if (!calcData.esInterna) {
                auxilioTransporte = (AUX_TRANSPORTE / 30) * calcData.diasTrabajados;
            }

            // Aportes a salud y pensión por días son especiales (cotización por semanas),
            // pero para una colilla de pago básica descontamos el 4% del devengado (excluyendo aux. transporte)
            salud = totalDevengado * 0.04;
            pension = totalDevengado * 0.04;

        } else {
            // Cálculo mensual
            totalDevengado = calcData.salarioBase; // Asumimos mes completo (30 días)
            
            if (calcData.salarioBase <= (SMLMV * 2) && !calcData.esInterna) {
                auxilioTransporte = AUX_TRANSPORTE;
            }

            salud = calcData.salarioBase * 0.04;
            pension = calcData.salarioBase * 0.04;
        }

        const totalNeto = (totalDevengado + auxilioTransporte) - salud - pension;

        setCalcResult({
            salarioBase: totalDevengado,
            auxilioTransporte,
            salud,
            pension,
            totalDeducciones: salud + pension,
            totalNeto,
            periodo: isPorDias ? `${calcData.diasTrabajados} Días` : 'Mensual (30 Días)',
        });
    };

    return (
        <div className="pb-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 print:hidden">
                <div>
                    <h3 className="text-xl font-bold text-slate-900">Empleados Domésticos</h3>
                    <p className="text-sm text-slate-600">Gestión y liquidación del personal de servicio doméstico</p>
                </div>
                {activeTab === 'directorio' && (
                    <button className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-colors font-semibold">
                        <Plus size={20} />
                        Nuevo Empleado
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 mb-6 print:hidden">
                <button
                    onClick={() => setActiveTab('directorio')}
                    className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${
                        activeTab === 'directorio'
                            ? 'border-rose-600 text-rose-600'
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
                            ? 'border-rose-600 text-rose-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                >
                    <Calculator size={18} />
                    Calculadora Nómina
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
                                placeholder="Buscar empleados domésticos..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {employees.map((emp) => (
                            <div key={emp.id} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-lg">{emp.name}</h4>
                                        <div className="flex items-center gap-1 text-sm text-slate-600 mt-1">
                                            <IdCard size={14} />
                                            CC: {emp.cedula}
                                        </div>
                                    </div>
                                    <div className="px-3 py-1 bg-rose-50 text-rose-700 border border-rose-100 rounded-lg text-xs font-bold">
                                        {emp.position}
                                    </div>
                                </div>

                                <div className="space-y-2 mb-4 text-sm text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <Home size={14} />
                                        {emp.address}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span>📞</span>
                                        {emp.phone}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-200">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600">Salario / Tarifa</span>
                                        <span className="text-lg font-black text-slate-800">
                                            ${emp.salary.toLocaleString('es-CO')}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        setCalcData({
                                            ...calcData,
                                            nombre: emp.name,
                                            tipo: emp.position === 'Por Días' ? 'dias' : 'mes',
                                            salarioBase: emp.salary,
                                            esInterna: emp.position === 'Interna'
                                        });
                                        setActiveTab('calculadora');
                                        setCalcResult(null);
                                    }}
                                    className="w-full mt-4 px-4 py-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors font-semibold text-sm"
                                >
                                    Liquidar Nómina
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
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Empleada</label>
                                <input
                                    type="text"
                                    required
                                    value={calcData.nombre}
                                    onChange={(e) => setCalcData({ ...calcData, nombre: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Modalidad</label>
                                    <select
                                        value={calcData.tipo}
                                        onChange={(e) => setCalcData({ ...calcData, tipo: e.target.value as 'mes' | 'dias' })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                                    >
                                        <option value="mes">Mensual</option>
                                        <option value="dias">Por Días</option>
                                    </select>
                                </div>
                                <div className="flex items-end pb-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={calcData.esInterna}
                                            onChange={(e) => setCalcData({ ...calcData, esInterna: e.target.checked })}
                                            className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500"
                                        />
                                        <span className="text-sm font-medium text-slate-700">Trabajadora Interna</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    {calcData.tipo === 'dias' ? 'Valor por Día (Ej: $60.000)' : 'Salario Mensual'}
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    value={calcData.salarioBase}
                                    onChange={(e) => setCalcData({ ...calcData, salarioBase: Number(e.target.value) })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                                />
                            </div>

                            {calcData.tipo === 'dias' && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Días Trabajados en el Mes</label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        max="31"
                                        value={calcData.diasTrabajados}
                                        onChange={(e) => setCalcData({ ...calcData, diasTrabajados: Number(e.target.value) })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                                    />
                                </div>
                            )}

                            {calcData.esInterna && (
                                <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded">
                                    Nota: Las trabajadoras internas no reciben auxilio de transporte en dinero, ya que residen en el lugar de trabajo.
                                </p>
                            )}

                            <button
                                type="submit"
                                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg transition-colors mt-4"
                            >
                                Calcular Nómina
                            </button>
                        </form>
                    </div>

                    {/* Volante de Pago */}
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
                                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Comprobante de Pago</h2>
                                    <p className="text-slate-500 mt-1">Servicio Doméstico</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="bg-slate-50 p-4 rounded-xl">
                                        <p className="text-xs font-bold text-slate-500 uppercase">Empleado</p>
                                        <p className="text-lg font-semibold text-slate-900">{calcData.nombre || 'No especificado'}</p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-xl">
                                        <p className="text-xs font-bold text-slate-500 uppercase">Período / Días</p>
                                        <p className="text-lg font-semibold text-slate-900">{calcResult.periodo}</p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-xl">
                                        <p className="text-xs font-bold text-slate-500 uppercase">Modalidad</p>
                                        <p className="text-lg font-semibold text-slate-900">
                                            {calcData.tipo === 'mes' ? 'Mensual' : 'Por Días'}
                                            {calcData.esInterna ? ' (Interna)' : ' (Externa)'}
                                        </p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-xl">
                                        <p className="text-xs font-bold text-slate-500 uppercase">Fecha de Emisión</p>
                                        <p className="text-lg font-semibold text-slate-900">{new Date().toLocaleDateString('es-CO')}</p>
                                    </div>
                                </div>

                                <table className="w-full text-left mb-6">
                                    <thead>
                                        <tr className="border-b-2 border-slate-800 text-slate-900 text-sm">
                                            <th className="py-2 font-bold uppercase">Concepto</th>
                                            <th className="py-2 font-bold uppercase text-right">Devengos</th>
                                            <th className="py-2 font-bold uppercase text-right">Deducciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        <tr>
                                            <td className="py-3 text-slate-700">Salario Básico</td>
                                            <td className="py-3 text-right font-medium text-slate-900">
                                                ${calcResult.salarioBase.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                                            </td>
                                            <td className="py-3 text-right"></td>
                                        </tr>
                                        {calcResult.auxilioTransporte > 0 && (
                                            <tr>
                                                <td className="py-3 text-slate-700">Auxilio de Transporte</td>
                                                <td className="py-3 text-right font-medium text-slate-900">
                                                    ${calcResult.auxilioTransporte.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                                                </td>
                                                <td className="py-3 text-right"></td>
                                            </tr>
                                        )}
                                        <tr>
                                            <td className="py-3 text-slate-700">Aporte Salud (4%)</td>
                                            <td className="py-3 text-right"></td>
                                            <td className="py-3 text-right font-medium text-rose-600">
                                                ${calcResult.salud.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 text-slate-700">Aporte Pensión (4%)</td>
                                            <td className="py-3 text-right"></td>
                                            <td className="py-3 text-right font-medium text-rose-600">
                                                ${calcResult.pension.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                                            </td>
                                        </tr>
                                    </tbody>
                                    <tfoot>
                                        <tr className="border-t-2 border-slate-800 bg-slate-50">
                                            <td className="py-4 px-2 font-bold text-slate-900 uppercase">NETO A PAGAR</td>
                                            <td colSpan={2} className="py-4 px-2 text-right text-2xl font-black text-emerald-600">
                                                ${calcResult.totalNeto.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>

                                <div className="mt-12 pt-8 border-t border-slate-200 flex justify-between px-8">
                                    <div className="text-center w-48">
                                        <div className="border-b border-slate-400 mb-2 h-8"></div>
                                        <p className="text-xs text-slate-500 font-bold uppercase">Firma del Empleador</p>
                                    </div>
                                    <div className="text-center w-48">
                                        <div className="border-b border-slate-400 mb-2 h-8"></div>
                                        <p className="text-xs text-slate-500 font-bold uppercase">Firma del Empleado(a)</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 print:hidden text-center p-6">
                                <Calculator size={48} className="text-slate-300 mb-4" />
                                <h4 className="text-lg font-semibold text-slate-600">Calculadora de Servicio Doméstico</h4>
                                <p className="text-slate-500 mt-2 max-w-sm">
                                    Utiliza el formulario para calcular el pago mensual o por días, y generar el comprobante de nómina.
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