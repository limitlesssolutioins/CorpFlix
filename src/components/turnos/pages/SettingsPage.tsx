import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import {
  Save,
  Settings,
  Layers,
  Plus,
  Trash2,
  ShieldCheck,
  DollarSign,
  Building2,
  ChevronRight,
  TrendingUp,
  MapPin,
  Wallet,
  Upload
} from 'lucide-react';
import { toast } from 'sonner';

interface ConfigForm {
  companyName: string;
  idType: string;
  nit: string;
  logoUrl: string;
  address: string;
  city: string;
  taxRegime: string;
  paymentFrequency: string;
  smlmv: number;
  transportAid: number;
  currentYear: number;
}

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'legal' | 'scales' | 'sites' | 'positions'>('legal');
  const [loading, setLoading] = useState(true);

  const [scales, setScales] = useState<any[]>([]);
  const [sites, setSites] = useState<any[]>([]);
  const [positions, setPositions] = useState<any[]>([]);

  const [newScale, setNewScale] = useState({ name: '', amount: '' });

  // Estados locales para los valores formateados de los inputs
  const [displaySmlmv, setDisplaySmlmv] = useState('');
  const [displayTransport, setDisplayTransport] = useState('');

  const { register, handleSubmit, reset, setValue } = useForm<ConfigForm>();

  // Helper para formatear miles
  const formatNumber = (num: string | number) => {
    const val = String(num).replace(/\D/g, '');
    return val.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const fetchConfig = async () => {
    try {
      const res = await axios.get('/api/settings');
      if (res.data) {
        const data = res.data;
        reset({
          ...data,
          smlmv: Number(data.smlmv),
          transportAid: Number(data.transportAid),
          currentYear: Number(data.currentYear)
        });
        setDisplaySmlmv(formatNumber(data.smlmv));
        setDisplayTransport(formatNumber(data.transportAid));
      }
    } catch (e) {
      console.error(e);
      toast.error("Error al cargar la configuración");
    }
  };

  const fetchData = async () => {
    try {
      const [sc, si, po] = await Promise.all([
        axios.get('/api/settings/scales'),
        axios.get('/api/catalog/sites'),
        axios.get('/api/catalog/positions')
      ]);
      setScales(sc.data);
      setSites(si.data);
      setPositions(po.data);
    } catch (e) { console.error("Error loading catalogs"); }
  };

  useEffect(() => {
    fetchConfig().then(() => setLoading(false));
    fetchData();
  }, [reset]);

  const onConfigSubmit = async (data: ConfigForm) => {
    const toastId = toast.loading("Guardando configuración...");
    try {
      await axios.patch('/api/settings', {
        ...data,
        smlmv: Number(data.smlmv),
        transportAid: Number(data.transportAid),
        currentYear: Number(data.currentYear)
      });
      toast.success("Información guardada correctamente", { id: toastId });
      await fetchConfig();
    } catch (error) {
      toast.error('Error al guardar', { id: toastId });
    }
  };

  const handleAddScale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScale.name || !newScale.amount) return;
    const rawAmount = newScale.amount.replace(/\./g, '');
    await axios.post('/api/settings/scales', { name: newScale.name, amount: parseFloat(rawAmount) });
    setNewScale({ name: '', amount: '' });
    fetchData();
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);

  if (loading) return <div className="p-12 text-center text-slate-500 font-bold animate-pulse">Sincronizando Perfil Maestro...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div>
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
          <div className="p-3 bg-slate-900 text-white rounded-2xl">
            <Settings size={24} />
          </div>
          Configuración Maestro
        </h1>
        <p className="text-slate-500 mt-2 font-medium">Gestión de la identidad corporativa y parámetros legales.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-72 space-y-2">
          {[
            { id: 'legal', label: 'Marco Legal', icon: ShieldCheck },
            { id: 'scales', label: 'Cargos y Sueldos', icon: Wallet },
            { id: 'sites', label: 'Sedes Operativas', icon: MapPin },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl text-sm font-black transition-all ${activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/30'
                  : 'text-slate-400 hover:bg-white border border-transparent hover:border-slate-200'
                }`}
            >
              <div className="flex items-center gap-3"><tab.icon size={18} />{tab.label}</div>
              <ChevronRight size={14} className={activeTab === tab.id ? 'opacity-100 translate-x-0' : 'opacity-0'} />
            </button>
          ))}
        </aside>

        <main className="flex-1">
          <form onSubmit={handleSubmit(onConfigSubmit)}>
            
            {activeTab === 'legal' && (
              <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-8 border-b bg-slate-50/50 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Parámetros de Ley</h3>
                    <p className="text-sm text-slate-500 font-medium">Configuración de valores monetarios vigentes.</p>
                  </div>
                  <ShieldCheck className="text-slate-200" size={40} />
                </div>
                <div className="p-10 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Salario Mínimo (SMLMV)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400">$</span>
                        <input
                          type="text"
                          value={displaySmlmv}
                          onChange={(e) => {
                            const raw = e.target.value.replace(/\D/g, '');
                            setDisplaySmlmv(formatNumber(raw));
                            setValue('smlmv', Number(raw));
                          }}
                          className="w-full p-4 pl-8 bg-slate-50 border border-slate-200 rounded-2xl font-black text-slate-900 outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Auxilio de Transporte</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400">$</span>
                        <input
                          type="text"
                          value={displayTransport}
                          onChange={(e) => {
                            const raw = e.target.value.replace(/\D/g, '');
                            setDisplayTransport(formatNumber(raw));
                            setValue('transportAid', Number(raw));
                          }}
                          className="w-full p-4 pl-8 bg-slate-50 border border-slate-200 rounded-2xl font-black text-slate-900 outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="pt-8 border-t flex justify-end">
                    <button type="submit" className="px-10 py-4 bg-slate-900 text-white rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl flex items-center gap-3">
                      <Save size={20} /> Actualizar Parámetros
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'scales' && (
              <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-8 border-b bg-slate-50/50 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Sueldos por Cargo</h3>
                    <p className="text-sm text-slate-500 font-medium">Asigne sueldos base para cada rol operativo.</p>
                  </div>
                  <Wallet className="text-slate-200" size={40} />
                </div>
                <div className="p-10 space-y-8">
                  <form onSubmit={handleAddScale} className="bg-slate-50 p-6 rounded-3xl border border-slate-200 flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 space-y-2 w-full">
                      <label className="text-[10px] font-black text-slate-400 uppercase">Nombre del Cargo</label>
                      <input placeholder="Ej: Guarda 24h" value={newScale.name} onChange={e => setNewScale({ ...newScale, name: e.target.value })} className="w-full p-3 bg-white border rounded-xl font-bold outline-none" />
                    </div>
                    <div className="w-full md:w-48 space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase">Monto Mensual</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                        <input
                          type="text"
                          value={newScale.amount}
                          onChange={e => setNewScale({ ...newScale, amount: formatNumber(e.target.value) })}
                          className="w-full p-3 pl-6 bg-white border rounded-xl font-bold outline-none"
                        />
                      </div>
                    </div>
                    <button type="submit" className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2"><Plus size={20} /> Agregar</button>
                  </form>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {scales.map(scale => (
                      <div key={scale.id} className="p-5 bg-white border border-slate-200 rounded-2xl flex justify-between items-center hover:border-primary-500 transition-all">
                        <div><p className="font-black text-slate-900 text-sm">{scale.name}</p><p className="text-xs font-bold text-primary-600">{formatCurrency(scale.amount)}</p></div>
                        <button onClick={() => { if (confirm('¿Borrar?')) axios.delete(`/api/settings/scales/${scale.id}`).then(fetchData) }} className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 size={18} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </form>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;