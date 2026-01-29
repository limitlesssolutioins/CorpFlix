'use client';

import { useState } from 'react';
import { Plus, Search, Mail, Phone, Calendar } from 'lucide-react';

export default function ExtrasEmpleadosPage() {
    const [searchQuery, setSearchQuery] = useState('');

    // TODO: Fetch from API
    const employees = [
        { id: 1, name: 'Juan Pérez', position: 'Operario', email: 'juan@example.com', phone: '300-123-4567', hireDate: '2023-01-15' },
        { id: 2, name: 'María González', position: 'Supervisor', email: 'maria@example.com', phone: '300-987-6543', hireDate: '2022-06-20' }
    ];

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-slate-900">Empleados</h3>
                    <p className="text-sm text-slate-600">Gestiona los empleados para liquidación de horas extras</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold">
                    <Plus size={20} />
                    Nuevo Empleado
                </button>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar empleados..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Employee List */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase">Nombre</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase">Cargo</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase">Contacto</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase">Fecha Ingreso</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {employees.map((emp) => (
                            <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-semibold text-slate-900">{emp.name}</div>
                                </td>
                                <td className="px-6 py-4 text-slate-600">{emp.position}</td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1 text-sm text-slate-600">
                                        <div className="flex items-center gap-1">
                                            <Mail size={14} />
                                            {emp.email}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Phone size={14} />
                                            {emp.phone}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1 text-slate-600">
                                        <Calendar size={14} />
                                        {new Date(emp.hireDate).toLocaleDateString('es-ES')}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                                        Ver Detalles
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}