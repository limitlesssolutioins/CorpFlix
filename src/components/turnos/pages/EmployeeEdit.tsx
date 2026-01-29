'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import styles from './EmployeeCreate.module.css'; // Reusamos estilos
import { ArrowLeft, Save, CalendarClock } from 'lucide-react';

interface FormData {
  firstName: string;
  lastName: string;
  identification: string;
  email: string;
  contractType: string;
  salaryAmount: number;
  salaryScheme: string;
  startDate: string;
  epsEntity: string;
  arlEntity: string;
  pensionEntity: string;
  defaultSiteId: string;
  defaultPositionId: string;
  // Campos de Horario
  standardStartTime: string;
  standardEndTime: string;
  standardStartTime2: string;
  standardEndTime2: string;
  workDays: string[]; 
}

const EmployeeEdit: React.FC = () => {
  const params = useParams();
  const id = params?.id as string;
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>();
  const router = useRouter();
  const [sites, setSites] = useState<{id: string, name: string}[]>([]);
  const [positions, setPositions] = useState<{id: string, name: string}[]>([]);
  const [scales, setScales] = useState<{id: string, name: string, amount: string}[]>([]);
  const [smlmv, setSmlmv] = useState<number>(0);

  useEffect(() => {
    // 1. Cargar catálogos
    axios.get('http://localhost:3000/catalogs/sites').then(res => setSites(res.data));
    axios.get('http://localhost:3000/catalogs/positions').then(res => setPositions(res.data));
    axios.get('http://localhost:3000/settings').then(res => setSmlmv(Number(res.data.smlmv)));
    axios.get('http://localhost:3000/settings/scales').then(res => setScales(res.data));

    // 2. Cargar datos del empleado
    if (id) {
      axios.get(`http://localhost:3000/employees/${id}`).then(res => {
        const emp = res.data;
        setValue('firstName', emp.firstName);
        setValue('lastName', emp.lastName);
        setValue('identification', emp.identification);
        setValue('email', emp.email);
        setValue('contractType', emp.contractType);
        setValue('salaryAmount', parseFloat(emp.salaryAmount));
        setValue('salaryScheme', emp.salaryScheme);
        setValue('epsEntity', emp.epsEntity);
        setValue('arlEntity', emp.arlEntity);
        setValue('pensionEntity', emp.pensionEntity);
        setValue('defaultSiteId', emp.defaultSiteId);
        setValue('defaultPositionId', emp.defaultPositionId);
        
        if(emp.startDate) {
          setValue('startDate', new Date(emp.startDate).toISOString().split('T')[0]);
        }

        // Cargar Horario
        setValue('standardStartTime', emp.standardStartTime);
        setValue('standardEndTime', emp.standardEndTime);
        setValue('standardStartTime2', emp.standardStartTime2);
        setValue('standardEndTime2', emp.standardEndTime2);
        if(emp.workDays) {
            setValue('workDays', emp.workDays.split(','));
        }
      });
    }
  }, [id, setValue]);

  const handleUseSmlmv = () => {
    if (smlmv > 0) setValue('salaryAmount', smlmv);
  };

  const handleScaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const scaleId = e.target.value;
    const selected = scales.find(s => s.id === scaleId);
    if(selected) setValue('salaryAmount', Number(selected.amount));
  };

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        ...data,
        salaryAmount: parseFloat(data.salaryAmount),
        startDate: new Date(data.startDate).toISOString(),
        workDays: data.workDays ? data.workDays.join(',') : null,
        standardStartTime: data.standardStartTime || null,
        standardEndTime: data.standardEndTime || null,
        standardStartTime2: data.standardStartTime2 || null,
        standardEndTime2: data.standardEndTime2 || null,
      };
      
      await axios.patch(`http://localhost:3000/employees/${id}`, payload);
      alert('Empleado actualizado con éxito');
      router.push('/recursos-humanos/employees');
    } catch (error) {
      console.error('Error al actualizar:', error);
      alert('Error al actualizar los datos.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => router.push('/recursos-humanos/employees')} className={styles.cancelBtn} style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <ArrowLeft size={18} /> Volver
        </button>
        <h1>Editar Colaborador</h1>
        <p>Modifica la información contractual o salarial.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.formCard}>
        <h3 className={styles.sectionTitle}>Información Personal</h3>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label>Nombres *</label>
            <input {...register('firstName', { required: true })} />
          </div>
          <div className={styles.field}>
            <label>Apellidos *</label>
            <input {...register('lastName', { required: true })} />
          </div>
          <div className={styles.field}>
            <label>Identificación *</label>
            <input {...register('identification', { required: true })} />
          </div>
          <div className={styles.field}>
            <label>Correo Electrónico</label>
            <input {...register('email')} type="email" />
          </div>
        </div>

        <h3 className={styles.sectionTitle}>Contratación y Sede</h3>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label>Sede Principal *</label>
            <select {...register('defaultSiteId', { required: true })}>
              <option value="">Seleccione...</option>
              {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className={styles.field}>
            <label>Cargo Base *</label>
            <select {...register('defaultPositionId', { required: true })}>
              <option value="">Seleccione...</option>
              {positions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className={styles.field}>
            <label>Tipo de Contrato *</label>
            <select {...register('contractType', { required: true })}>
              <option value="INDEFINIDO">Término Indefinido</option>
              <option value="FIJO">Término Fijo</option>
              <option value="OBRA_LABOR">Obra o Labor</option>
            </select>
          </div>
          <div className={styles.field}>
            <label>Fecha de Ingreso *</label>
            <input type="date" {...register('startDate', { required: true })} />
          </div>
        </div>

        <h3 className={styles.sectionTitle}>Salario y Seguridad Social</h3>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label>Salario Base *</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="number" {...register('salaryAmount', { required: true })} style={{ flex: 1 }} />
                <button type="button" onClick={handleUseSmlmv} title={`Usar SMLMV`} style={{ padding: '0 1rem', background: '#dbeafe', color: '#1e40af', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  SMLMV
                </button>
              </div>
              <select onChange={handleScaleChange} style={{ fontSize: '0.85rem', padding: '0.4rem', background: '#f0f9ff', color: '#0369a1', border: '1px dashed #0ea5e9' }}>
                  <option value="">-- Cargar Plantilla de Sueldo --</option>
                  {scales.map(s => (
                      <option key={s.id} value={s.id}>{s.name} - ${Number(s.amount).toLocaleString()}</option>
                  ))}
              </select>
            </div>
          </div>
          <div className={styles.field}>
            <label>Esquema Salarial *</label>
            <select {...register('salaryScheme', { required: true })}>
              <option value="ORDINARIO">Sueldo Ordinario</option>
              <option value="INTEGRAL">Sueldo Integral</option>
            </select>
          </div>
          <div className={styles.field}>
            <label>EPS *</label>
            <input {...register('epsEntity', { required: true })} />
          </div>
          <div className={styles.field}>
            <label>ARL *</label>
            <input {...register('arlEntity', { required: true })} />
          </div>
          <div className={styles.field}>
             <label>Fondo de Pensión *</label>
             <input {...register('pensionEntity', { required: true })} />
          </div>
        </div>

        {/* SECCIÓN 4: HORARIO AUTOMÁTICO */}
        <h3 className={styles.sectionTitle} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2563eb' }}>
            <CalendarClock /> Programación Automática
        </h3>
        <div style={{ background: '#eff6ff', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
            <div className={styles.grid}>
                <div className={styles.field}>
                    <label>Bloque 1 - Inicio</label>
                    <input type="time" {...register('standardStartTime')} />
                </div>
                <div className={styles.field}>
                    <label>Bloque 1 - Fin</label>
                    <input type="time" {...register('standardEndTime')} />
                </div>
            </div>

            <div className={styles.grid} style={{ marginTop: '-1rem' }}>
                <div className={styles.field}>
                    <label style={{ color: '#64748b' }}>Bloque 2 - Inicio (Opcional)</label>
                    <input type="time" {...register('standardStartTime2')} />
                </div>
                <div className={styles.field}>
                    <label style={{ color: '#64748b' }}>Bloque 2 - Fin (Opcional)</label>
                    <input type="time" {...register('standardEndTime2')} />
                </div>
            </div>

            <div className={styles.field}>
                <label style={{ marginBottom: '0.5rem', display: 'block' }}>Días Laborales</label>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {[
                        { val: '1', label: 'Lun' }, { val: '2', label: 'Mar' }, { val: '3', label: 'Mié' },
                        { val: '4', label: 'Jue' }, { val: '5', label: 'Vie' }, { val: '6', label: 'Sáb' }, { val: '0', label: 'Dom' },
                    ].map(day => (
                        <label key={day.val} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', background: 'white', padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                            <input type="checkbox" value={day.val} {...register('workDays')} />
                            {day.label}
                        </label>
                    ))}
                </div>
            </div>
        </div>

        <div className={styles.actions}>
          <button type="button" onClick={() => router.push('/recursos-humanos/employees')} className={styles.cancelBtn}>Cancelar</button>
          <button type="submit" className={styles.submitBtn}>
            <Save size={18} style={{ marginRight: '0.5rem' }} /> Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeEdit;
