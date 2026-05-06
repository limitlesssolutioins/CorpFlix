'use client';

import { useState } from 'react';
import { Plus, Search, Mail, Phone, IdCard } from 'lucide-react';

export default function SeguridadSocialEmpleadosPage() {
    const [searchQuery, setSearchQuery] = useState('');

    const employees = [
        { id: 1, name: 'Carlos Martínez', cedula: '1234567890', position: 'Contador', email: 'carlos@example.com', phone: '300-111-2222', salary: 3500000 },
        { id: 2, name: 'Ana López', cedula: '9876543210', position: 'Asistente', email: 'ana@example.com', phone: '300-333-4444', salary: 2200000 }
    ];

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-slate-900">Empleados</h3>
                    <p className="text-sm text-slate-600">Gestiona empleados para liquidación de seguridad social</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-semibold">
                    <Plus size={20} />
                    Nuevo Empleado
                </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar empleados..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase">Nombre</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase">Cédula</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase">Cargo</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase">Salario</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase">Contacto</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {employees.map((emp) => (
                            <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-semibold text-slate-900">{emp.name}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1 text-slate-600">
                                        <IdCard size={14} />
                                        {emp.cedula}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-600">{emp.position}</td>
                                <td className="px-6 py-4 font-semibold text-emerald-600">
                                    ${emp.salary.toLocaleString('es-CO')}
                                </td>
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
                                    <button className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm">
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