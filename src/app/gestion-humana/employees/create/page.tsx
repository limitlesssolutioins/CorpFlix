'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus, ArrowLeft, User, Briefcase, ShieldCheck } from 'lucide-react';
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
    const toastId = toast.loading('Guardando colaborador...');
    try {
      await createEmployeeAction(formData);
      toast.success('¡Colaborador vinculado exitosamente!', { id: toastId });

      const cType = formData.get('contractType') as string;
      if (cType === 'DOMESTICA') router.push('/gestion-humana/domesticas');
      else if (cType === 'INDEPENDIENTE') router.push('/gestion-humana/independientes');
      else router.push('/gestion-humana/employees');

    } catch (error) {
      console.error('Error al crear empleado:', error);
      toast.error('Error al vincular. Verifique los datos o si la identificación ya existe.', { id: toastId });
    }
  };

  const handleCancel = () => {
    if (defaultContract === 'DOMESTICA') router.push('/gestion-humana/domesticas');
    else if (defaultContract === 'INDEPENDIENTE') router.push('/gestion-humana/independientes');
    else router.push('/gestion-humana/employees');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
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

      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-200 shadow-xl">
        <form action={handleSubmit} className="space-y-12">
          
          {/* SECCIÓN 1: INFORMACIÓN PERSONAL */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><User size={20} /></div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Información Personal</h2>
                <p className="text-sm text-slate-500">Datos de contacto e identificación.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Nombres</label>
                <input type="text" name="firstName" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Apellidos</label>
                <input type="text" name="lastName" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Tipo Documento</label>
                <select name="documentType" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-bold">
                  <option value="CC">Cédula de Ciudadanía</option>
                  <option value="CE">Cédula de Extranjería</option>
                  <option value="PA">Pasaporte</option>
                  <option value="PE">Permiso Especial de Permanencia</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Identificación</label>
                <input type="text" name="identification" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-bold" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Ciudad Expedición</label>
                <input type="text" name="documentExpeditionCity" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Fecha Nacimiento</label>
                <input type="date" name="birthDate" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Género</label>
                <select name="gender" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium">
                  <option value="">Seleccione...</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                  <option value="O">Otro</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Grupo Sanguíneo</label>
                <input type="text" name="bloodType" placeholder="Ej: O+" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Teléfono</label>
                <input type="text" name="phone" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Correo Electrónico</label>
                <input type="email" name="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Dirección</label>
                <input type="text" name="address" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Ciudad Residencia</label>
                <input type="text" name="city" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium" />
              </div>
            </div>
          </section>

          {/* SECCIÓN 1.5: INFORMACIÓN BANCARIA Y CONTACTO */}
          <section className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* BANCO */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                  <h2 className="text-lg font-bold text-slate-700">Información Bancaria</h2>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Banco</label>
                    <input type="text" name="bankName" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Tipo Cuenta</label>
                      <select name="bankAccountType" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium">
                        <option value="Ahorros">Ahorros</option>
                        <option value="Corriente">Corriente</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Número Cuenta</label>
                      <input type="text" name="bankAccountNumber" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium" />
                    </div>
                  </div>
                </div>
              </div>
              {/* EMERGENCIA */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                  <h2 className="text-lg font-bold text-slate-700">Contacto de Emergencia</h2>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Nombre Contacto</label>
                    <input type="text" name="emergencyContactName" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Teléfono Contacto</label>
                    <input type="text" name="emergencyContactPhone" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECCIÓN 2: INFORMACIÓN LABORAL */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Briefcase size={20} /></div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Detalles Laborales</h2>
                <p className="text-sm text-slate-500">Configuración del contrato y remuneración.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Tipo de Contrato</label>
                <select name="contractType" required defaultValue={defaultContract} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-bold">
                  <option value="">Seleccione...</option>
                  <option value="INDEFINIDO">Término Indefinido</option>
                  <option value="FIJO">Término Fijo</option>
                  <option value="OBRA_LABOR">Obra o Labor</option>
                  <option value="APRENDIZAJE">Aprendizaje</option>
                  <option value="DOMESTICA">Servicio Doméstico</option>
                  <option value="INDEPENDIENTE">Prestación de Servicios</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Número de Contrato</label>
                <input type="text" name="contractNumber" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Cargo</label>
                <input type="text" name="defaultPosition" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Fecha Inicio</label>
                <input type="date" name="startDate" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Fecha Fin</label>
                <input type="date" name="contractEndDate" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium" />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <input type="checkbox" name="isIntegralSalary" id="isIntegralSalary" value="true" className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                <label htmlFor="isIntegralSalary" className="text-sm font-bold text-slate-700">¿Sueldo Integral?</label>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Sueldo Base ($)</label>
                <input type="number" name="salaryAmount" required step="any" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-black text-primary-600" />
              </div>
              <div className="md:col-span-2">
                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Sede Principal</label>
                 <input type="text" name="defaultSite" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium" />
              </div>
            </div>
          </section>

          {/* SECCIÓN 3: SEGURIDAD SOCIAL */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><ShieldCheck size={20} /></div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Seguridad Social y Parafiscales</h2>
                <p className="text-sm text-slate-500">Afiliaciones y tipos de cotizante.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Tipo de Cotizante</label>
                <input type="text" name="contributorType" placeholder="Ej: 01" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Subtipo Cotizante</label>
                <input type="text" name="contributorSubtype" placeholder="Ej: 00" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">EPS (Fondo Salud)</label>
                <input type="text" name="healthFund" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">% Salud (Empleado)</label>
                <input type="number" name="healthFundPercentage" defaultValue="4" step="0.01" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">AFP (Fondo Pensión)</label>
                <input type="text" name="pensionFund" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">% Pensión (Empleado)</label>
                <input type="number" name="pensionFundPercentage" defaultValue="4" step="0.01" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Fondo de Cesantías</label>
                <input type="text" name="severanceFund" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Caja Compensación</label>
                <input type="text" name="compensationFund" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">ARL</label>
                <input type="text" name="arl" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Clase Riesgo</label>
                <select name="riskClass" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-bold">
                  <option value="I">Clase I (0.522%)</option>
                  <option value="II">Clase II (1.044%)</option>
                  <option value="III">Clase III (2.436%)</option>
                  <option value="IV">Clase IV (4.350%)</option>
                  <option value="V">Clase V (6.960%)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Código CIIU</label>
                <input type="text" name="ciiuCode" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium" />
              </div>
            </div>
          </section>

          <div className="col-span-full flex justify-end gap-4 pt-8 border-t border-slate-100">
            <button
              type="button"
              onClick={handleCancel}
              className="px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold transition-all uppercase text-xs tracking-widest"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-10 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black shadow-lg shadow-primary-500/25 transition-all uppercase text-xs tracking-widest"
            >
              <Plus size={18} />
              Guardar Colaborador
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