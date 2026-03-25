'use client';

import { useState } from 'react';
import { Calculator, Clock, Calendar, Printer, DollarSign } from 'lucide-react';
import { calculateShiftColombian, ShiftCalculationResult } from '@/lib/payroll-calculator';

export default function ExtrasEmpleadosPage() {
    const [formData, setFormData] = useState({
        nombre: '',
        cedula: '',
        salario: 1300000,
        weeklyHours: 44, // Default a 44 (actual). 42 a partir de Julio 2026.
        fecha: new Date().toISOString().split('T')[0],
        startTime: '08:00',
        endTime: '18:00',
        breakMinutes: 60,
        isSundayOrHoliday: false,
    });

    const [result, setResult] = useState<ShiftCalculationResult | null>(null);

    const handleCalculate = (e: React.FormEvent) => {
        e.preventDefault();
        const calculation = calculateShiftColombian({
            salary: Number(formData.salario),
            weeklyHours: Number(formData.weeklyHours),
            startTime: formData.startTime,
            endTime: formData.endTime,
            breakMinutes: Number(formData.breakMinutes),
            isSundayOrHoliday: formData.isSundayOrHoliday,
        });
        setResult(calculation);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="max-w-6xl mx-auto pb-10">
            {/* Header section (hidden on print) */}
            <div className="flex items-center justify-between mb-8 print:hidden">
                <div>
                    <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Calculator className="text-blue-600" />
                        Calculadora de Horas Extras
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                        Cálculo normativo colombiano (Ley 2101 de 2021)
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Panel de Configuración / Formulario */}
                <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm print:hidden">
                    <form onSubmit={handleCalculate} className="space-y-5">
                        <div className="space-y-4">
                            <h4 className="font-semibold text-slate-800 border-b pb-2">Datos del Empleado</h4>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Cédula</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.cedula}
                                        onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Salario Base</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.salario}
                                        onChange={(e) => setFormData({ ...formData, salario: Number(e.target.value) })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-2">
                            <h4 className="font-semibold text-slate-800 border-b pb-2">Jornada y Turno</h4>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Horas Semanales (Ley)</label>
                                <select
                                    value={formData.weeklyHours}
                                    onChange={(e) => setFormData({ ...formData, weeklyHours: Number(e.target.value) })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="46">46 horas (Hasta Jul 2024)</option>
                                    <option value="44">44 horas (Jul 2025 - Jul 2026)</option>
                                    <option value="42">42 horas (Desde Jul 2026)</option>
                                </select>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Hora Inicio</label>
                                    <input
                                        type="time"
                                        required
                                        value={formData.startTime}
                                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Hora Fin</label>
                                    <input
                                        type="time"
                                        required
                                        value={formData.endTime}
                                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Descanso (Min)</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.breakMinutes}
                                        onChange={(e) => setFormData({ ...formData, breakMinutes: Number(e.target.value) })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div className="flex items-end pb-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.isSundayOrHoliday}
                                            onChange={(e) => setFormData({ ...formData, isSundayOrHoliday: e.target.checked })}
                                            className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                                        />
                                        <span className="text-sm font-medium text-slate-700">Festivo / Dom</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors mt-4"
                        >
                            Calcular Turno
                        </button>
                    </form>
                </div>

                {/* Panel de Resultados / Volante */}
                <div className="lg:col-span-8">
                    {result ? (
                        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm" id="payslip-area">
                            {/* Header del Volante */}
                            <div className="flex justify-between items-start border-b border-slate-200 pb-6 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                                        LS
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900 uppercase">Limitless Solutions</h2>
                                        <p className="text-sm text-slate-500">Volante de Turno Individual</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-slate-800">Fecha del turno</p>
                                    <div className="flex items-center justify-end gap-1 text-slate-500 mt-1">
                                        <Calendar size={14} />
                                        <span>{new Date(formData.fecha).toLocaleDateString('es-CO')}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Datos del Empleado */}
                            <div className="grid grid-cols-2 gap-6 mb-8 bg-slate-50 p-4 rounded-xl">
                                <div>
                                    <p className="text-xs font-bold text-slate-500 uppercase">Empleado</p>
                                    <p className="text-lg font-semibold text-slate-900">{formData.nombre || 'No especificado'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-500 uppercase">Documento</p>
                                    <p className="text-lg font-semibold text-slate-900">CC {formData.cedula || '---'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-500 uppercase">Horario Ejecutado</p>
                                    <div className="flex items-center gap-2 text-slate-900 font-medium">
                                        <Clock size={16} className="text-blue-600" />
                                        {formData.startTime} - {formData.endTime}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-500 uppercase">Valor Hora Ordinaria</p>
                                    <p className="text-lg font-semibold text-slate-900">
                                        ${result.hourlyRate.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                                    </p>
                                </div>
                            </div>

                            {/* Tabla de Conceptos */}
                            <div className="mb-8">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b-2 border-slate-800 text-slate-900 text-sm">
                                            <th className="py-3 px-2 font-bold uppercase">Concepto</th>
                                            <th className="py-3 px-2 font-bold uppercase text-center">Horas</th>
                                            <th className="py-3 px-2 font-bold uppercase text-center">Factor</th>
                                            <th className="py-3 px-2 font-bold uppercase text-right">Total a Pagar</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-slate-700">
                                        {Object.values(result.breakdown).map((item, idx) => {
                                            if (item.hours === 0) return null;
                                            return (
                                                <tr key={idx}>
                                                    <td className="py-4 px-2 font-medium">{item.label}</td>
                                                    <td className="py-4 px-2 text-center">{item.hours.toFixed(2)}h</td>
                                                    <td className="py-4 px-2 text-center text-xs bg-slate-50 rounded font-mono">
                                                        x{item.multiplier.toFixed(2)}
                                                    </td>
                                                    <td className="py-4 px-2 text-right font-semibold text-slate-900">
                                                        ${item.amount.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                    <tfoot>
                                        <tr className="border-t-2 border-slate-800">
                                            <td colSpan={2} className="py-4 px-2 font-bold text-slate-900 uppercase">
                                                Total Devengado (Turno)
                                            </td>
                                            <td className="py-4 px-2 text-center font-bold text-slate-900">
                                                {result.totalHours.toFixed(2)}h Totales
                                            </td>
                                            <td className="py-4 px-2 text-right text-2xl font-black text-blue-600">
                                                ${result.totalAmount.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>

                            {/* Acciones */}
                            <div className="flex justify-end gap-4 print:hidden">
                                <button
                                    onClick={handlePrint}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-semibold"
                                >
                                    <Printer size={18} />
                                    Generar PDF / Imprimir
                                </button>
                            </div>

                        </div>
                    ) : (
                        <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 print:hidden text-center p-6">
                            <DollarSign size={48} className="text-slate-300 mb-4" />
                            <h4 className="text-lg font-semibold text-slate-600">Aún no hay cálculos</h4>
                            <p className="text-slate-500 mt-2 max-w-sm">
                                Ingresa los datos del empleado y su turno en el formulario de la izquierda para generar el volante de pago de horas extras detallado.
                            </p>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Estilos para impresión */}
            <style jsx global>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    #payslip-area, #payslip-area * {
                        visibility: visible;
                    }
                    #payslip-area {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        border: none;
                        box-shadow: none;
                    }
                }
            `}</style>
        </div>
    );
}