'use client';

import { FileText, Download, AlertCircle } from 'lucide-react';

export default function SeguridadSocialPILAPage() {
    return (
        <div>
            <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900">Generar Archivo PILA</h3>
                <p className="text-sm text-slate-600">Planilla Integrada de Liquidación de Aportes</p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <h4 className="font-bold text-yellow-900 mb-1">Importante</h4>
                        <p className="text-sm text-yellow-800">
                            Verifica que todos los empleados tengan sus datos completos antes de generar el archivo PILA.
                            El archivo debe enviarse antes del día 10 de cada mes.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Período de Liquidación</label>
                    <input
                        type="month"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Tipo de Planilla</label>
                    <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                        <option>E - Empleados dependientes</option>
                        <option>I - Independientes</option>
                        <option>K - Estudiantes</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
                <h4 className="font-bold text-slate-900 mb-4">Resumen Pre-Generación</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                        <div className="text-2xl font-black text-slate-900">0</div>
                        <div className="text-xs text-slate-600 mt-1">Empleados</div>
                    </div>
                    <div className="text-center p-4 bg-emerald-50 rounded-lg">
                        <div className="text-2xl font-black text-emerald-900">$0</div>
                        <div className="text-xs text-emerald-700 mt-1">Total Aportes</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-black text-blue-900">$0</div>
                        <div className="text-xs text-blue-700 mt-1">Base Cotización</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-black text-purple-900">$0</div>
                        <div className="text-xs text-purple-700 mt-1">Parafiscales</div>
                    </div>
                </div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-bold text-lg">
                <Download size={24} />
                Generar Archivo PILA (.txt)
            </button>
        </div>
    );
}
