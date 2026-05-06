import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  UserMinus, 
  Calendar, 
  Search, 
  Calculator, 
  FileCheck2,
  AlertTriangle,
  ArrowRight,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner';
import moment from 'moment';

const SettlementPage: React.FC = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmp, setSelectedEmp] = useState<string>('');
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [cause, setCause] = useState('VOLUNTARY');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:3000/employees').then(res => setEmployees(res.data));
  }, []);

  const handleSimulate = async () => {
    if (!selectedEmp) return toast.error("Seleccione un empleado");
    setLoading(true);
    try {
        const res = await axios.get(`http://localhost:3000/settlements/simulate/${selectedEmp}?date=${date}&cause=${cause}`);
        setResult(res.data);
        toast.success("Liquidación calculada correctamente");
    } catch (err) {
        toast.error("Error al calcular liquidación");
    } finally {
        setLoading(false);
    }
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Liquidación de Contratos</h1>
          <p className="text-slate-500 mt-1 font-medium">Cálculo definitivo de prestaciones y finiquito laboral.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* PANEL DE CONTROL */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 h-fit">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                <UserMinus size={18} className="text-rose-500"/> Parámetros de Retiro
            </h3>
            
            <div className="space-y-5">
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Colaborador</label>
                    <div className="relative">
                        <select 
                            value={selectedEmp} 
                            onChange={e => setSelectedEmp(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="">-- Seleccionar --</option>
                            {employees.map(e => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Fecha de Terminación</label>
                    <input 
                        type="date" 
                        value={date} 
                        onChange={e => setDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>

                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Motivo de Retiro</label>
                    <div className="grid grid-cols-2 gap-2">
                        <button 
                            onClick={() => setCause('VOLUNTARY')}
                            className={`p-3 rounded-xl text-xs font-black uppercase transition-all ${cause === 'VOLUNTARY' ? 'bg-emerald-100 text-emerald-700 ring-2 ring-emerald-500' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                        >
                            Renuncia Voluntaria
                        </button>
                        <button 
                            onClick={() => setCause('UNJUSTIFIED')}
                            className={`p-3 rounded-xl text-xs font-black uppercase transition-all ${cause === 'UNJUSTIFIED' ? 'bg-rose-100 text-rose-700 ring-2 ring-rose-500' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                        >
                            Despido Injustificado
                        </button>
                    </div>
                </div>

                <button 
                    onClick={handleSimulate}
                    disabled={loading}
                    className="w-full py-4 bg-slate-900 text-white rounded-xl font-black text-sm hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2 mt-4"
                >
                    {loading ? 'Calculando...' : <><Calculator size={18} /> CALCULAR LIQUIDACIÓN</>}
                </button>
            </div>
        </div>

        {/* RESULTADOS */}
        <div className="lg:col-span-2">
            {!result ? (
                <div className="h-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center text-slate-400 p-10">
                    <FileCheck2 size={48} className="mb-4 opacity-50"/>
                    <p className="font-bold text-sm">Configure los parámetros para visualizar la liquidación</p>
                </div>
            ) : (
                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total a Pagar</p>
                            <p className="text-4xl font-black">{formatCurrency(result.total)}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-lg">{result.employee.name}</p>
                            <p className="text-xs font-medium text-slate-400 opacity-80 uppercase tracking-wider">{result.employee.doc}</p>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="grid grid-cols-2 gap-8 mb-8">
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Datos Base</p>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-500 font-medium">Salario Base Liquidación</span>
                                        <span className="font-bold text-slate-900">{formatCurrency(result.params.baseSalary)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-500 font-medium">Fecha Inicio</span>
                                        <span className="font-bold text-slate-900">{moment(result.employee.startDate).format('DD MMM YYYY')}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-500 font-medium">Fecha Terminación</span>
                                        <span className="font-bold text-slate-900">{moment(result.employee.terminationDate).format('DD MMM YYYY')}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-500 font-medium">Días Trabajados Total</span>
                                        <span className="font-bold text-slate-900">{result.params.daysTotal} días</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-2">Detalle de Conceptos</p>
                                
                                <ResultRow label="Salarios Pendientes" value={result.concepts.unpaidWages + result.concepts.unpaidTransport} />
                                <ResultRow label={`Cesantías (${result.params.daysForCesantias} días)`} value={result.concepts.cesantias} />
                                <ResultRow label="Intereses de Cesantías" value={result.concepts.interesesCesantias} />
                                <ResultRow label={`Prima de Servicios (${result.params.daysForPrima} días)`} value={result.concepts.prima} />
                                <ResultRow label="Vacaciones Pendientes" value={result.concepts.vacaciones} />
                                
                                {result.concepts.indemnification > 0 && (
                                    <div className="mt-4 pt-4 border-t border-dashed border-slate-200">
                                        <ResultRow label="Indemnización Despido" value={result.concepts.indemnification} highlight />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end pt-6 border-t border-slate-100">
                             <button onClick={() => window.print()} className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-900 text-slate-900 rounded-xl text-sm font-black hover:bg-slate-50 transition-colors">
                                <FileCheck2 size={18} /> IMPRIMIR LIQUIDACIÓN
                             </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

const ResultRow = ({ label, value, highlight = false }: { label: string, value: number, highlight?: boolean }) => (
    <div className={`flex justify-between items-center p-3 rounded-xl ${highlight ? 'bg-rose-50 text-rose-700' : 'hover:bg-slate-50 text-slate-700'}`}>
        <span className={`text-xs ${highlight ? 'font-black' : 'font-bold'}`}>{label}</span>
        <span className={`font-black ${highlight ? 'text-lg' : 'text-sm'}`}>
            {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value)}
        </span>
    </div>
);

export default SettlementPage;
