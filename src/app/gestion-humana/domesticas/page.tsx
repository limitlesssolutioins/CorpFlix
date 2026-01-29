'use client';

import { useState } from 'react';
import { Plus, Search, Home, IdCard } from 'lucide-react';

export default function DomesticasEmpleadosPage() {
    const [searchQuery, setSearchQuery] = useState('');

    const employees = [
        { id: 1, name: 'Rosa Hernández', cedula: '52123456', position: 'Empleada Doméstica', address: 'Calle 45 #12-34', phone: '300-555-6666', salary: 1423500 },
        { id: 2, name: 'Gloria Ramírez', cedula: '52987654', position: 'Empleada Doméstica', address: 'Carrera 78 #90-12', phone: '300-777-8888', salary: 1423500 }
    ];

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-slate-900">Empleados Domésticos</h3>
                    <p className="text-sm text-slate-600">Gestiona el personal del servicio doméstico</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-colors font-semibold">
                    <Plus size={20} />
                    Nuevo Empleado
                </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <div className="px-3 py-1 bg-rose-100 text-rose-700 rounded-lg text-xs font-bold">
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
                                <span className="text-sm text-slate-600">Salario Mensual</span>
                                <span className="text-lg font-black text-rose-600">
                                    ${emp.salary.toLocaleString('es-CO')}
                                </span>
                            </div>
                        </div>

                        <button className="w-full mt-4 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-semibold text-sm">
                            Ver Detalles
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}