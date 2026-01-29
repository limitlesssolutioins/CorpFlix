'use client';

import { useState } from 'react';
import { Calculator, Save, AlertCircle } from 'lucide-react';

export default function DomesticasLiquidacionPage() {
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [workDays, setWorkDays] = useState('30');

    const salarioMinimo = 1423500;

    return (
        <div>
            <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900">Liquidación Personal Doméstico</h3>
                <p className="text-sm text-slate-600">Cálculo especial para empleados del servicio doméstico</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <h4 className="font-bold text-blue-900 mb-1">Información</h4>
                        <p className="text-sm text-blue-800">
                            Los empleados domésticos que trabajen menos de 4 horas diarias no están obligados a cotizar a seguridad social.
                            Salario mínimo 2024: ${salarioMinimo.toLocaleString('es-CO')}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Empleado</label>
                    <select
                        value={selectedEmployee}
                        onChange={(e) => setSelectedEmployee(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    >
                        <option value="">Seleccione un empleado...</option>
                        <option value="1">Rosa Hernández</option>
                        <option value="2">Gloria Ramírez</option>
                    </select>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Días Trabajados</label>
                    <input
                        type="number"
                        value={workDays}
                        onChange={(e) => setWorkDays(e.target.value)}
                        min="1"
                        max="30"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
                <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Calculator className="text-rose-600" size={20} />
                    Detalle de Liquidación
                </h4>

                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <span className="text-sm font-semibold text-slate-700">Salario Base</span>
                        <span className="text-lg font-black text-slate-900">${salarioMinimo.toLocaleString('es-CO')}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-rose-50 rounded-lg">
                        <div>
                            <div className="text-sm font-semibold text-slate-700">Auxilio de Transporte</div>
                            <div className="text-xs text-slate-600">Para salarios inferiores a 2 SMMLV</div>
                        </div>
                        <span className="text-lg font-black text-rose-900">$200,000</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                        <div>
                            <div className="text-sm font-semibold text-slate-700">Prima de Servicios</div>
                            <div className="text-xs text-slate-600">Proporcional (mes trabajado)</div>
                        </div>
                        <span className="text-lg font-black text-emerald-900">$118,625</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div>
                            <div className="text-sm font-semibold text-slate-700">Cesantías</div>
                            <div className="text-xs text-slate-600">8.33% mensual</div>
                        </div>
                        <span className="text-lg font-black text-blue-900">$118,625</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <div>
                            <div className="text-sm font-semibold text-slate-700">Intereses sobre Cesantías</div>
                            <div className="text-xs text-slate-600">12% anual</div>
                        </div>
                        <span className="text-lg font-black text-purple-900">$14,235</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <div>
                            <div className="text-sm font-semibold text-slate-700">Vacaciones</div>
                            <div className="text-xs text-slate-600">Proporcional mensual</div>
                        </div>
                        <span className="text-lg font-black text-orange-900">$59,313</span>
                    </div>
                </div>

                <button className="mt-6 flex items-center gap-2 px-6 py-3 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-colors font-semibold w-full justify-center">
                    <Save size={20} />
                    Guardar Liquidación
                </button>
            </div>

            <div className="bg-gradient-to-r from-rose-50 to-rose-100 rounded-xl border-2 border-rose-300 p-6">
                <h4 className="font-bold text-rose-900 mb-3">Total a Pagar</h4>
                <div className="text-4xl font-black text-rose-900">$1,934,298</div>
                <p className="text-sm text-rose-700 mt-1">Incluye salario, auxilio de transporte y prestaciones sociales</p>
            </div>
        </div>
    );
}
