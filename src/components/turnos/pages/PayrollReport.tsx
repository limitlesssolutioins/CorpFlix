'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import styles from './PayrollReport.module.css';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

interface NoveltyForm {
  employeeId: string;
  absenceTypeCode: string;
  startDate: string;
  endDate: string;
  diagnosisCode?: string;
}

const PayrollReport: React.FC = () => {
  const { register, handleSubmit } = useForm<NoveltyForm>();
  const router = useRouter();
  
  const [employees, setEmployees] = useState<any[]>([]);
  const [types, setTypes] = useState<any[]>([]);

  useEffect(() => {
    axios.get('http://localhost:3000/employees').then(res => setEmployees(res.data));
    axios.get('http://localhost:3000/catalogs/absence-types').then(res => setTypes(res.data));
  }, []);

  const onSubmit = async (data: NoveltyForm) => {
    try {
      await axios.post('http://localhost:3000/absences', data);
      alert('Novedad reportada. El sistema ha verificado conflictos de turno.');
      router.push('/recursos-humanos/nomina');
    } catch (error) {
      console.error(error);
      alert('Error al reportar novedad');
    }
  };

  return (
    <div className={styles.container}>
       <button onClick={() => router.push('/recursos-humanos/nomina')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', gap: '0.5rem', marginBottom: '1rem', color: '#64748b' }}>
        <ArrowLeft size={20} /> Volver al Tablero
      </button>

      <div className={styles.card}>
        <h1 className={styles.title}>
          <AlertTriangle color="#ef4444" />
          Reportar Novedad
        </h1>
        <p style={{ marginBottom: '2rem', color: '#64748b' }}>
          Registra incapacidades, licencias o permisos. El sistema recalculará la nómina y verificará conflictos de turno automáticamente.
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.field}>
            <label>Colaborador</label>
            <select {...register('employeeId', { required: true })}>
              <option value="">Seleccione...</option>
              {employees.map(e => (
                <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label>Tipo de Novedad</label>
            <select {...register('absenceTypeCode', { required: true })}>
              <option value="">Seleccione...</option>
              {types.map(t => (
                <option key={t.code} value={t.code}>{t.name} ({t.code})</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className={styles.field}>
              <label>Desde</label>
              <input type="date" {...register('startDate', { required: true })} />
            </div>
            <div className={styles.field}>
              <label>Hasta (Inclusive)</label>
              <input type="date" {...register('endDate', { required: true })} />
            </div>
          </div>

          <div className={styles.field}>
             <label>Código Diagnóstico (Opcional)</label>
             <input {...register('diagnosisCode')} placeholder="CIE-10 (ej: A001)" />
          </div>

          <button type="submit" className={styles.submitBtn}>
            Registrar Novedad
          </button>
        </form>
      </div>
    </div>
  );
};

export default PayrollReport;