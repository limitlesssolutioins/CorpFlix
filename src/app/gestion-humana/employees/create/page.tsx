'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { createEmployeeAction } from '@/actions/employee';

function CreateEmployeeForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [defaultContract, setDefaultContract] = useState('');

  useEffect(() => {
    const typeQuery = searchParams.get('type');
    if (typeQuery) setDefaultContract(typeQuery);
  }, [searchParams]);

  const handleSubmit = async (formData: FormData) => {
    const toastId = toast.loading('Guardando...');
    try {
      await createEmployeeAction(formData);
      toast.success('Empleado vinculado exitosamente!', { id: toastId });
      
      const cType = formData.get('contractType') as string;
      if (cType === 'DOMESTICA') router.push('/gestion-humana/domesticas');
      else if (cType === 'INDEPENDIENTE') router.push('/gestion-humana/independientes');
      else router.push('/gestion-humana/employees');
      
    } catch (error) {
      console.error('Error al crear empleado:', error);
      toast.error('Error al vincular empleado. Es posible que la cédula ya exista.', { id: toastId });
    }
  };

  const handleCancel = () => {
    if (defaultContract === 'DOMESTICA') router.push('/gestion-humana/domesticas');
    else if (defaultContract === 'INDEPENDIENTE') router.push('/gestion-humana/independientes');
    else router.push('/gestion-humana/employees');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleCancel}
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          title="Volver"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Vincular Nuevo Colaborador</h1>
      </div>

      <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-lg">
        <form action={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-full pb-4 mb-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800">Información Personal</h2>
            <p className="text-sm text-slate-500">Detalles básicos del nuevo colaborador.</p>
          </div>

          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-1">Nombres</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
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
              className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 transition-all"
            />
          </div>
          <div>
            <label htmlFor="salaryAmount" className="block text-sm font-medium text-slate-700 mb-1">Salario Base u Honorarios</label>
            <input
              type="number"
              id="salaryAmount"
              name="salaryAmount"
              required
              min="0"
              step="any"
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
              value={defaultContract}
              onChange={(e) => setDefaultContract(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 transition-all"
            >
              <option value="">Seleccione...</option>
              <option value="INDEFINIDO">Indefinido</option>
              <option value="FIJO">Fijo</option>
              <option value="OBRA_LABOR">Obra o Labor</option>
              <option value="APRENDIZAJE">Aprendizaje</option>
              <option value="DOMESTICA">Servicio Doméstico</option>
              <option value="INDEPENDIENTE">Independiente / Prestación de Servicios</option>
            </select>
          </div>
          <div>
            <label htmlFor="defaultPosition" className="block text-sm font-medium text-slate-700 mb-1">Cargo Principal</label>
            <input
              type="text"
              id="defaultPosition"
              name="defaultPosition"
              className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 transition-all"
            />
          </div>
          <div>
            <label htmlFor="defaultSite" className="block text-sm font-medium text-slate-700 mb-1">Sede Principal</label>
            <input
              type="text"
              id="defaultSite"
              name="defaultSite"
              className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 transition-all"
            />
          </div>

          <div className="col-span-full flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-lg shadow-primary-500/20 transition-all"
            >
              <Plus size={20} />
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CreateEmployeePage() {
  return (
    <Suspense fallback={<div className="p-10 text-center font-bold text-slate-400">Cargando formulario...</div>}>
      <CreateEmployeeForm />
    </Suspense>
  );
}