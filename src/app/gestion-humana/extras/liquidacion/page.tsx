'use client';

import { useState } from 'react';
import { Search, Calculator, Save } from 'lucide-react';

export default function ExtrasLiquidacionPage() {
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [period, setPeriod] = useState('');

    return (
        <div>
            <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900">Liquidación de Horas Extras</h3>
                <p className="text-sm text-slate-600">Calcula y procesa las horas extras del personal</p>
            </div>

            {/* Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Empleado</label>
                    <select
                        value={selectedEmployee}
                        onChange={(e) => setSelectedEmployee(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Seleccione un empleado...</option>
                        <option value="1">Juan Pérez - Operario</option>
                        <option value="2">María González - Supervisor</option>
                    </select>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Período</label>
                    <input
                        type="month"
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Calculation Form */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
                <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Calculator className="text-blue-600" size={20} />
                    Registro de Horas
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Horas Extras Diurnas</label>
                        <input type="number" placeholder="0" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Horas Extras Nocturnas</label>
                        <input type="number" placeholder="0" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Horas Dominicales</label>
                        <input type="number" placeholder="0" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                </div>

                <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold">
                    <Save size={20} />
                    Calcular y Guardar
                </button>
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border-2 border-blue-300 p-6">
                <h4 className="font-bold text-blue-900 mb-3">Resumen de Liquidación</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <div className="text-sm text-blue-700 mb-1">Total Horas Extras</div>
                        <div className="text-2xl font-black text-blue-900">0 hrs</div>
                    </div>
                    <div>
                        <div className="text-sm text-blue-700 mb-1">Valor a Pagar</div>
                        <div className="text-2xl font-black text-blue-900">$0</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
