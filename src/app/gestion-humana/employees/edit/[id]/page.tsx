'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, UserCog, Loader2, User, Briefcase, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { getEmployeeByIdAction, updateEmployeeAction } from '@/actions/employee';

interface EditEmployeePageProps {
  params: Promise<{ id: string }>;
}

export default function EditEmployeePage({ params }: EditEmployeePageProps) {
  const router = useRouter();
  const { id } = React.use(params);
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
    const toastId = toast.loading('Actualizando colaborador...');
    try {
      await updateEmployeeAction(id, formData);
      toast.success('¡Colaborador actualizado exitosamente!', { id: toastId });
      router.push('/gestion-humana/employees');
    } catch (error) {
      console.error('Error al actualizar empleado:', error);
      toast.error('Error al actualizar el empleado.', { id: toastId });
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

  if (!employee) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => router.push('/gestion-humana/employees')}
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          title="Volver"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Editar Colaborador: {employee.firstName} {employee.lastName}</h1>
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
                <input type="text" name="firstName" required defaultValue={employee.firstName} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Apellidos</label>
                <input type="text" name="lastName" required defaultValue={employee.lastName} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Identificación</label>
                <input type="text" name="identification" required defaultValue={employee.identification} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-bold" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Teléfono</label>
                <input type="text" name="phone" defaultValue={employee.phone} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Correo Electrónico</label>
                <input type="email" name="email" defaultValue={employee.email} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Dirección</label>
                <input type="text" name="address" defaultValue={employee.address} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium" />
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
                <select name="contractType" required defaultValue={employee.contractType} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-bold">
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
                <input type="text" name="contractNumber" defaultValue={employee.contractNumber} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Cargo Principal</label>
                <input type="text" name="defaultPosition" defaultValue={employee.defaultPositionId} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Fecha Inicio</label>
                <input type="date" name="startDate" required defaultValue={employee.startDate?.split('T')[0]} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Fecha Fin</label>
                <input type="date" name="contractEndDate" defaultValue={employee.contractEndDate?.split('T')[0]} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium" />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <input type="checkbox" name="isIntegralSalary" id="isIntegralSalary" value="true" defaultChecked={employee.isIntegralSalary === 1 || employee.isIntegralSalary === true} className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                <label htmlFor="isIntegralSalary" className="text-sm font-bold text-slate-700">¿Sueldo Integral?</label>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Sueldo Base ($)</label>
                <input type="number" name="salaryAmount" required step="any" defaultValue={employee.salaryAmount} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-black text-primary-600" />
              </div>
              <div className="md:col-span-2">
                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Sede Principal</label>
                 <input type="text" name="defaultSite" defaultValue={employee.defaultSiteId} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium" />
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
                <input type="text" name="contributorType" placeholder="Ej: 01" defaultValue={employee.contributorType || '01'} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Subtipo Cotizante</label>
                <input type="text" name="contributorSubtype" placeholder="Ej: 00" defaultValue={employee.contributorSubtype || '00'} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">EPS (Fondo Salud)</label>
                <input type="text" name="healthFund" defaultValue={employee.healthFund} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">% Salud (Empleado)</label>
                <input type="number" name="healthFundPercentage" defaultValue={employee.healthFundPercentage ?? 4} step="0.01" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">AFP (Fondo Pensión)</label>
                <input type="text" name="pensionFund" defaultValue={employee.pensionFund} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">% Pensión (Empleado)</label>
                <input type="number" name="pensionFundPercentage" defaultValue={employee.pensionFundPercentage ?? 4} step="0.01" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Fondo de Cesantías</label>
                <input type="text" name="severanceFund" defaultValue={employee.severanceFund} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Caja Compensación</label>
                <input type="text" name="compensationFund" defaultValue={employee.compensationFund} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">ARL</label>
                <input type="text" name="arl" defaultValue={employee.arl} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Clase Riesgo</label>
                <select name="riskClass" defaultValue={employee.riskClass || 'I'} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-bold">
                  <option value="I">Clase I (0.522%)</option>
                  <option value="II">Clase II (1.044%)</option>
                  <option value="III">Clase III (2.436%)</option>
                  <option value="IV">Clase IV (4.350%)</option>
                  <option value="V">Clase V (6.960%)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Código CIIU</label>
                <input type="text" name="ciiuCode" defaultValue={employee.ciiuCode} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium" />
              </div>
            </div>
          </section>

          <section className="pt-6 border-t border-slate-100">
            <label htmlFor="isActive" className="flex items-center gap-3 text-sm font-bold text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                defaultChecked={employee.isActive === 1 || employee.isActive === true}
                value="true"
                className="w-6 h-6 text-primary-600 border-slate-300 rounded focus:ring-primary-500 transition-all"
              />
              Mantener a este Colaborador Activo
            </label>
          </section>

          <div className="flex justify-end gap-4 pt-8 border-t border-slate-100">
            <button
              type="button"
              onClick={() => router.push('/gestion-humana/employees')}
              className="px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold transition-all uppercase text-xs tracking-widest"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-lg shadow-blue-500/25 transition-all uppercase text-xs tracking-widest"
            >
              <UserCog size={18} />
              Actualizar Colaborador
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}