'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, UserCog, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getEmployeeByIdAction, updateEmployeeAction } from '@/actions/employee';

interface EditEmployeePageProps {
  params: { id: string };
}

export default function EditEmployeePage({ params }: EditEmployeePageProps) {
  const router = useRouter();
  const { id } = params;
  const [employee, setEmployee] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const emp = await getEmployeeByIdAction(id);
        if (emp) {
          setEmployee(emp);
        } else {
          toast.error('Empleado no encontrado.');
          router.push('/gestion-humana/employees');
        }
      } catch (error) {
        console.error('Error al cargar empleado:', error);
        toast.error('Error al cargar los datos del empleado.');
        router.push('/gestion-humana/employees');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [id, router]);

  const handleSubmit = async (formData: FormData) => {
    try {
      await updateEmployeeAction(id, formData);
      toast.success('Empleado actualizado exitosamente!');
      router.push('/gestion-humana/employees');
    } catch (error) {
      console.error('Error al actualizar empleado:', error);
      toast.error('Error al actualizar el empleado.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-100px)] animate-in fade-in duration-500">
        <Loader2 size={48} className="animate-spin text-primary-500" />
        <p className="ml-4 text-xl font-medium text-slate-600">Cargando datos del empleado...</p>
      </div>
    );
  }

  if (!employee) {
    return null; // O mostrar un mensaje de error si no se encontró el empleado
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/gestion-humana/employees')}
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          title="Volver al directorio"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Editar Colaborador: {employee.firstName} {employee.lastName}</h1>
      </div>

      <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-lg">
        <form action={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-full pb-4 mb-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800">Información Personal</h2>
            <p className="text-sm text-slate-500">Actualiza los detalles básicos del colaborador.</p>
          </div>

          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-1">Nombres</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              defaultValue={employee.firstName}
              className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 transition-all"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-1">Apellidos</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              required
              defaultValue={employee.lastName}
              className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 transition-all"
            />
          </div>
          <div>
            <label htmlFor="identification" className="block text-sm font-medium text-slate-700 mb-1">Identificación</label>
            <input
              type="text"
              id="identification"
              name="identification"
              required
              defaultValue={employee.identification}
              className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 transition-all"
            />
          </div>
          <div>
            <label htmlFor="salaryAmount" className="block text-sm font-medium text-slate-700 mb-1">Salario Base</label>
            <input
              type="number"
              id="salaryAmount"
              name="salaryAmount"
              required
              min="0"
              step="any"
              defaultValue={employee.salaryAmount}
              className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 transition-all"
            />
          </div>

          <div className="col-span-full pb-4 mb-6 mt-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800">Detalles Contractuales</h2>
            <p className="text-sm text-slate-500">Información sobre el vínculo laboral.</p>
          </div>

          <div>
            <label htmlFor="contractType" className="block text-sm font-medium text-slate-700 mb-1">Tipo de Contrato</label>
            <select
              id="contractType"
              name="contractType"
              required
              defaultValue={employee.contractType}
              className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 transition-all"
            >
              <option value="">Seleccione...</option>
              <option value="INDEFINIDO">Indefinido</option>
              <option value="FIJO">Fijo</option>
              <option value="OBRA_LABOR">Obra o Labor</option>
              <option value="APRENDIZAJE">Aprendizaje</option>
            </select>
          </div>
          <div>
            <label htmlFor="defaultPosition" className="block text-sm font-medium text-slate-700 mb-1">Cargo Principal</label>
            <input
              type="text"
              id="defaultPosition"
              name="defaultPosition"
              defaultValue={employee.defaultPosition}
              className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 transition-all"
            />
          </div>
          <div>
            <label htmlFor="defaultSite" className="block text-sm font-medium text-slate-700 mb-1">Sede Principal</label>
            <input
              type="text"
              id="defaultSite"
              name="defaultSite"
              defaultValue={employee.defaultSite}
              className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 transition-all"
            />
          </div>

          <div className="col-span-full">
            <label htmlFor="isActive" className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                defaultChecked={employee.isActive}
                value="true" // Importante para que formData capture el valor cuando está checked
                className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              Colaborador Activo
            </label>
          </div>

          <div className="col-span-full flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={() => router.push('/gestion-humana/employees')}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all"
            >
              <UserCog size={20} />
              Actualizar Colaborador
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}