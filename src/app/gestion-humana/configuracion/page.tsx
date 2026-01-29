'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface ExtraOption {
  id: string;
  name: string;
  factor: number;
}

interface DomesticPayrollConfig {
  salarioBase: number;
  auxilioTransporte: number;
  prestaciones: string;
}

interface SeguridadSocialOption {
  id: string;
  name: string;
  format: string;
}

interface PayrollConfig {
  extras: ExtraOption[];
  domesticas: {
    jornadaNormal: DomesticPayrollConfig;
    jornadaParcial: DomesticPayrollConfig;
  };
  seguridadSocial: {
    operadorDefault: string;
    opcionesArchivosPlanos: SeguridadSocialOption[];
  };
}

export default function ConfiguracionPage() {
  const [config, setConfig] = useState<PayrollConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/gestion/payroll-config');
      if (!response.ok) {
        throw new Error(`Error fetching config: ${response.statusText}`);
      }
      const data: PayrollConfig = await response.json();
      setConfig(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch configuration');
      toast.error(err.message || 'Failed to fetch configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, category: string, index?: number, field?: string) => {
    if (!config) return;

    let updatedConfig = { ...config };

    if (category === 'extras' && index !== undefined && field) {
      updatedConfig.extras[index] = {
        ...updatedConfig.extras[index],
        [field]: field === 'factor' ? parseFloat(e.target.value) : e.target.value,
      };
    } else if (category === 'domesticas' && field) {
      const subCategory = e.target.name.includes('jornadaNormal') ? 'jornadaNormal' : 'jornadaParcial';
      updatedConfig.domesticas[subCategory] = {
        ...updatedConfig.domesticas[subCategory],
        [field]: field === 'salarioBase' || field === 'auxilioTransporte' ? parseFloat(e.target.value) : e.target.value,
      };
    } else if (category === 'seguridadSocial' && field) {
      if (field === 'operadorDefault') {
        updatedConfig.seguridadSocial.operadorDefault = e.target.value;
      } else if (index !== undefined) {
        updatedConfig.seguridadSocial.opcionesArchivosPlanos[index] = {
          ...updatedConfig.seguridadSocial.opcionesArchivosPlanos[index],
          [field]: e.target.value,
        };
      }
    }
    setConfig(updatedConfig);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;

    try {
      const response = await fetch('/api/gestion/payroll-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error(`Error updating config: ${response.statusText}`);
      }

      toast.success('Configuración actualizada exitosamente!');
      // Optionally refetch or redirect
      router.refresh(); // Refresh current route to show latest data
    } catch (err: any) {
      setError(err.message || 'Failed to update configuration');
      toast.error(err.message || 'Failed to update configuration');
    }
  };

  if (loading) return <p>Cargando configuración...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!config) return <p>No hay configuración disponible.</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-slate-800">Configuración de Nómina</h1>

      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-blue-600">Liquidación de Extras</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {config.extras.map((extra, index) => (
            <div key={extra.id} className="p-4 border rounded-md bg-slate-50">
              <label className="block text-slate-700 text-sm font-bold mb-2" htmlFor={`extra-name-${index}`}>
                Nombre:
              </label>
              <input
                type="text"
                id={`extra-name-${index}`}
                name="name"
                value={extra.name}
                onChange={(e) => handleChange(e, 'extras', index, 'name')}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <label className="block text-slate-700 text-sm font-bold mt-4 mb-2" htmlFor={`extra-factor-${index}`}>
                Factor:
              </label>
              <input
                type="number"
                id={`extra-factor-${index}`}
                name="factor"
                step="0.01"
                value={extra.factor}
                onChange={(e) => handleChange(e, 'extras', index, 'factor')}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-semibold mb-4 text-blue-600">Liquidación de Domésticas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-4 border rounded-md bg-slate-50">
            <h3 className="text-xl font-medium mb-3 text-slate-700">Jornada Normal</h3>
            <label className="block text-slate-700 text-sm font-bold mb-2" htmlFor="domestica-normal-salario">
              Salario Base:
            </label>
            <input
              type="number"
              id="domestica-normal-salario"
              name="jornadaNormalSalarioBase"
              value={config.domesticas.jornadaNormal.salarioBase}
              onChange={(e) => handleChange(e, 'domesticas', undefined, 'salarioBase')}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <label className="block text-slate-700 text-sm font-bold mt-4 mb-2" htmlFor="domestica-normal-transporte">
              Auxilio Transporte:
            </label>
            <input
              type="number"
              id="domestica-normal-transporte"
              name="jornadaNormalAuxilioTransporte"
              value={config.domesticas.jornadaNormal.auxilioTransporte}
              onChange={(e) => handleChange(e, 'domesticas', undefined, 'auxilioTransporte')}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <label className="block text-slate-700 text-sm font-bold mt-4 mb-2" htmlFor="domestica-normal-prestaciones">
              Prestaciones:
            </label>
            <input
              type="text"
              id="domestica-normal-prestaciones"
              name="jornadaNormalPrestaciones"
              value={config.domesticas.jornadaNormal.prestaciones}
              onChange={(e) => handleChange(e, 'domesticas', undefined, 'prestaciones')}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="p-4 border rounded-md bg-slate-50">
            <h3 className="text-xl font-medium mb-3 text-slate-700">Jornada Parcial</h3>
            <label className="block text-slate-700 text-sm font-bold mb-2" htmlFor="domestica-parcial-salario">
              Salario Base:
            </label>
            <input
              type="number"
              id="domestica-parcial-salario"
              name="jornadaParcialSalarioBase"
              value={config.domesticas.jornadaParcial.salarioBase}
              onChange={(e) => handleChange(e, 'domesticas', undefined, 'salarioBase')}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <label className="block text-slate-700 text-sm font-bold mt-4 mb-2" htmlFor="domestica-parcial-transporte">
              Auxilio Transporte:
            </label>
            <input
              type="number"
              id="domestica-parcial-transporte"
              name="jornadaParcialAuxilioTransporte"
              value={config.domesticas.jornadaParcial.auxilioTransporte}
              onChange={(e) => handleChange(e, 'domesticas', undefined, 'auxilioTransporte')}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <label className="block text-slate-700 text-sm font-bold mt-4 mb-2" htmlFor="domestica-parcial-prestaciones">
              Prestaciones:
            </label>
            <input
              type="text"
              id="domestica-parcial-prestaciones"
              name="jornadaParcialPrestaciones"
              value={config.domesticas.jornadaParcial.prestaciones}
              onChange={(e) => handleChange(e, 'domesticas', undefined, 'prestaciones')}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-4 text-blue-600">Seguridad Social</h2>
        <div className="mb-8 p-4 border rounded-md bg-slate-50">
          <label className="block text-slate-700 text-sm font-bold mb-2" htmlFor="operador-default">
            Operador por Defecto:
          </label>
          <select
            id="operador-default"
            name="operadorDefault"
            value={config.seguridadSocial.operadorDefault}
            onChange={(e) => handleChange(e, 'seguridadSocial', undefined, 'operadorDefault')}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
          >
            {config.seguridadSocial.opcionesArchivosPlanos.map((option) => (
              <option key={option.id} value={option.name}>
                {option.name}
              </option>
            ))}
          </select>

          <h3 className="text-xl font-medium mb-3 text-slate-700">Opciones de Archivos Planos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {config.seguridadSocial.opcionesArchivosPlanos.map((option, index) => (
              <div key={option.id} className="p-3 border rounded-md bg-slate-100">
                <label className="block text-slate-700 text-sm font-bold mb-2" htmlFor={`ss-option-name-${index}`}>
                  Nombre:
                </label>
                <input
                  type="text"
                  id={`ss-option-name-${index}`}
                  name="name"
                  value={option.name}
                  onChange={(e) => handleChange(e, 'seguridadSocial', index, 'name')}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                <label className="block text-slate-700 text-sm font-bold mt-4 mb-2" htmlFor={`ss-option-format-${index}`}>
                  Formato (Identificador Interno):
                </label>
                <input
                  type="text"
                  id={`ss-option-format-${index}`}
                  name="format"
                  value={option.format}
                  onChange={(e) => handleChange(e, 'seguridadSocial', index, 'format')}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition-colors"
        >
          Guardar Configuración
        </button>
      </form>
    </div>
  );
}