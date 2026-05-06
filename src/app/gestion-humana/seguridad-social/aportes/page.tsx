'use client';

import { useState } from 'react';
import { Calculator, Save } from 'lucide-react';

export default function SeguridadSocialAportesPage() {
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [period, setPeriod] = useState('');

    return (
        <div>
            <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900">Cálculo de Aportes</h3>
                <p className="text-sm text-slate-600">Calcula aportes a salud, pensión, ARL y parafiscales</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Empleado</label>
                    <select
                        value={selectedEmployee}
                        onChange={(e) => setSelectedEmployee(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        <option value="">Seleccione un empleado...</option>
                        <option value="1">Carlos Martínez - $3,500,000</option>
                        <option value="2">Ana López - $2,200,000</option>
                    </select>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Período</label>
                    <input
                        type="month"
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
                <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Calculator className="text-emerald-600" size={20} />
                    Detalle de Aportes
                </h4>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 p-4 bg-emerald-50 rounded-lg">
                        <div>
                            <div className="text-sm font-semibold text-slate-700 mb-1">Salud (12.5%)</div>
                            <div className="text-xs text-slate-600">Empleador: 8.5% | Empleado: 4%</div>
                        </div>
                        <div className="text-right">
                            <div className="text-lg font-black text-emerald-900">$437,500</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
                        <div>
                            <div className="text-sm font-semibold text-slate-700 mb-1">Pensión (16%)</div>
                            <div className="text-xs text-slate-600">Empleador: 12% | Empleado: 4%</div>
                        </div>
                        <div className="text-right">
                            <div className="text-lg font-black text-blue-900">$560,000</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 p-4 bg-orange-50 rounded-lg">
                        <div>
                            <div className="text-sm font-semibold text-slate-700 mb-1">ARL (0.522%)</div>
                            <div className="text-xs text-slate-600">Empleador: 0.522%</div>
                        </div>
                        <div className="text-right">
                            <div className="text-lg font-black text-orange-900">$18,270</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 p-4 bg-purple-50 rounded-lg">
                        <div>
                            <div className="text-sm font-semibold text-slate-700 mb-1">Parafiscales (9%)</div>
                            <div className="text-xs text-slate-600">SENA: 2% | ICBF: 3% | Caja: 4%</div>
                        </div>
                        <div className="text-right">
                            <div className="text-lg font-black text-purple-900">$315,000</div>
                        </div>
                    </div>
                </div>

                <button className="mt-6 flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-semibold">
                    <Save size={20} />
                    Guardar Liquidación
                </button>
            </div>

            <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl border-2 border-emerald-300 p-6">
                <h4 className="font-bold text-emerald-900 mb-3">Total Aportes</h4>
                <div className="text-4xl font-black text-emerald-900">$1,330,770</div>
                <p className="text-sm text-emerald-700 mt-1">Empleador: $1,170,770 | Empleado: $280,000</p>
            </div>
        </div>
    );
}
