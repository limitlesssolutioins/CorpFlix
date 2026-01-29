import React, { useEffect, useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  User,
  MapPin,
  Briefcase,
  FileBadge,
  MoreVertical,
  Eye,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getEmployeesAction, deleteEmployeeAction } from '@/actions/employee';
import { Employee } from '@/lib/json-db'; // Import the Employee interface

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchEmployees = async () => {
    try {
      const data = await getEmployeesAction();
      setEmployees(data);
      setFilteredEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Error al cargar empleados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Buscador en tiempo real
  useEffect(() => {
    const results = employees.filter(emp =>
      `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.identification.includes(searchTerm)
    );
    setFilteredEmployees(results);
  }, [searchTerm, employees]);

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`¿Eliminar a ${name}? Esta acción es irreversible.`)) {
      try {
        await deleteEmployeeAction(id);
        toast.success(`Empleado ${name} eliminado exitosamente.`);
        fetchEmployees(); // Refrescar la lista
      } catch (error) {
        console.error('Error al eliminar empleado:', error);
        toast.error('Error al eliminar. Puede que el empleado tenga datos asociados o no exista.');
      }
    }
  };

  const getContractColor = (type: string) => {
    switch (type) {
      case 'INDEFINIDO': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'FIJO': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'OBRA_LABOR': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'APRENDIZAJE': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Estilizado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Directorio de Personal</h1>
          <p className="text-slate-500 mt-1">Gestiona el talento humano y sus condiciones contractuales.</p>
        </div>
        <button
          onClick={() => router.push('/gestion-humana/employees/create')}
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-lg shadow-primary-500/20 transition-all"
        >
          <Plus size={20} />
          Vincular Colaborador
        </button>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre o identificación..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl border border-slate-200 transition-colors font-medium">
          <Filter size={18} />
          Filtros Avanzados
        </button>
      </div>

      {/* Tabla Pro */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Colaborador</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Cargo y Sede</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Contrato</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Estado</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                      Cargando personal...
                    </div>
                  </td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">
                    No se encontraron resultados para "{searchTerm}"
                  </td>
                </tr>
              ) : filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold text-sm border border-primary-200">
                        {emp.firstName[0]}{emp.lastName[0]}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                          {emp.firstName} {emp.lastName}
                        </p>
                        <p className="text-xs text-slate-500 font-medium">ID: {emp.identification}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-sm text-slate-700 font-medium">
                        <Briefcase size={14} className="text-slate-400" />
                        {emp.defaultPosition || 'No asignado'}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <MapPin size={14} />
                        {emp.defaultSite || 'Sede base'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${getContractColor(emp.contractType)}`}>
                      <FileBadge size={12} />
                      {emp.contractType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full ${emp.isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(225,29,72,0.5)]'}"></div>
                      <span className="text-sm font-bold text-slate-700">{emp.isActive ? 'Activo' : 'Inactivo'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => router.push(`/gestion-humana/employees/profile/${emp.id}`)}
                        className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                        title="Ver Perfil 360"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => router.push(`/gestion-humana/employees/edit/${emp.id}`)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Editar Datos"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(emp.id, `${emp.firstName} ${emp.lastName}`)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        title="Desvincular"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer de la tabla con contador */}
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-widest">
          <span>Mostrando {filteredEmployees.length} colaboradores</span>
          <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            <CheckCircle2 size={14} />
            Sincronizado con Nómina
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;