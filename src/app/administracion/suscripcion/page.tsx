'use client';

import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  CheckCircle, 
  Clock, 
  ShieldCheck, 
  Zap, 
  History,
  Plus,
  Trash2,
  XCircle,
  Wallet,
  Building2,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';

interface Card {
  id: string;
  brand: string;
  last4: string;
  expiry: string;
}

interface Payment {
  id: string;
  amount: number;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  type: string;
  method: string;
  reference: string;
  createdAt: string;
}

interface Subscription {
  plan: string;
  estado: 'ACTIVO' | 'INACTIVO' | 'EXPIRADO';
  fechaFin: string | null;
}

export default function SuscripcionPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddMethod, setShowAddMethod] = useState(false);
  const [methodType, setMethodType] = useState<'CARD' | 'PSE'>('CARD');
  const [cardNumber, setCardNumber] = useState('');

  const detectCardBrand = (number: string) => {
    const re = {
      visa: /^4/,
      mastercard: /^5[1-5]/,
      amex: /^3[47]/,
      discover: /^6(?:011|5)/,
    };
    if (re.visa.test(number)) return 'Visa';
    if (re.mastercard.test(number)) return 'Mastercard';
    if (re.amex.test(number)) return 'Amex';
    if (re.discover.test(number)) return 'Discover';
    return 'Generic';
  };

  const CardIcon = ({ brand, size = 20 }: { brand: string, size?: number }) => {
    switch (brand) {
      case 'Visa': return <span className="font-black italic text-blue-800" style={{ fontSize: size }}>VISA</span>;
      case 'Mastercard': return (
        <div className="flex -space-x-2">
          <div className="w-4 h-4 rounded-full bg-red-500 opacity-80"></div>
          <div className="w-4 h-4 rounded-full bg-amber-500 opacity-80"></div>
        </div>
      );
      case 'Amex': return <span className="font-black text-sky-600" style={{ fontSize: size }}>AMEX</span>;
      default: return <CreditCard size={size} />;
    }
  };

  const fetchPaymentData = async () => {
    try {
      const response = await fetch('/api/payments');
      const data = await response.json();
      setPayments(data.payments || []);
      setSubscription(data.subscription);
      setCards(data.cards || []);
    } catch (error) {
      toast.error('Error al sincronizar datos');
    }
  };

  useEffect(() => {
    fetchPaymentData();
  }, []);

  const handlePayment = async (method: 'PSE' | 'CARD') => {
    setLoading(true);
    const toastId = toast.loading(`Iniciando pago por ${method}...`);
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: 50000, 
          type: 'SUBSCRIPTION', 
          method: method, 
          description: 'Suscripción CorpFlix Business' 
        }),
      });
      const newPayment = await res.json();
      
      // Simulación de procesamiento
      setTimeout(async () => {
        await fetch('/api/payments/process', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentId: newPayment.id }),
        });
        toast.success('¡Suscripción activada con éxito!', { id: toastId });
        fetchPaymentData();
        setLoading(false);
        setShowAddMethod(false);
      }, 2000);
    } catch (error) {
      toast.error('Error en el proceso de pago', { id: toastId });
      setLoading(false);
    }
  };

  const cancelSub = async () => {
    if (!confirm('¿Estás seguro de cancelar tu suscripción?')) return;
    try {
      await fetch('/api/payments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'CANCEL' }),
      });
      toast.success('Suscripción cancelada');
      fetchPaymentData();
    } catch (error) {
      toast.error('Error al cancelar');
    }
  };

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const cardData = {
      brand: formData.get('brand'),
      number: formData.get('number'),
      expiry: formData.get('expiry'),
      holderName: formData.get('holderName'),
      idType: formData.get('idType'),
      idNumber: formData.get('idNumber'),
    };

    try {
      await fetch('/api/payments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cardData),
      });
      toast.success('Tarjeta guardada correctamente');
      setShowAddMethod(false);
      setCardNumber('');
      fetchPaymentData();
    } catch (error) {
      toast.error('Error al guardar tarjeta');
    }
  };

  const deleteCard = async (id: string) => {
    try {
      await fetch(`/api/payments?id=${id}`, { method: 'DELETE' });
      toast.success('Tarjeta eliminada');
      fetchPaymentData();
    } catch (error) {
      toast.error('Error al eliminar tarjeta');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 pb-20">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gestión de Suscripción</h1>
          <p className="text-slate-500 mt-1 font-medium">Configura tu plan y métodos de pago preferidos.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          {/* Card: Plan Actual */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl flex flex-col justify-between overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Zap size={100} fill="currentColor" />
            </div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${subscription?.estado === 'ACTIVO' ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white/40'}`}>
                  {subscription?.estado || 'INACTIVO'}
                </span>
                {subscription?.estado === 'ACTIVO' && (
                  <button onClick={cancelSub} className="text-[10px] font-black uppercase text-red-400 hover:text-red-300 transition-colors">
                    Cancelar
                  </button>
                )}
              </div>
              <h2 className="text-3xl font-black mb-1 tracking-tight">LIDUS PRO</h2>
              <div className="text-4xl font-black mb-8">$50.000 <span className="text-sm font-normal text-slate-500">/ mes</span></div>
              
              <div className="space-y-3 mb-10">
                <div className="flex items-center gap-3 text-xs text-slate-300 font-medium">
                  <CheckCircle size={14} className="text-blue-400" /> Recursos Humanos, Liquidacion de Nomina y Prestaciones Sociales, Liquidacion de Seguridad Social y Matriz de Turnos con IA.
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-300 font-medium">
                  <CheckCircle size={14} className="text-blue-400" /> Evaluación financiera, diagnóstico e implementación de buenas prácticas en administración financiera.
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-300 font-medium">
                  <CheckCircle size={14} className="text-blue-400" /> Planeacion Estrategia, Identificacion de Procesos, Analizis de Riesgos, Auditoria, Mejora Continua y Gestion Documental.
                </div>
              </div>
            </div>

            {subscription?.estado !== 'ACTIVO' && (
              <button onClick={() => setShowAddMethod(true)} className="relative z-10 w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-blue-500/20">
                Suscribirse Ahora
              </button>
            )}
            
            {subscription?.fechaFin && subscription.estado === 'ACTIVO' && (
               <div className="relative z-10 bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-3">
                  <Clock size={16} className="text-slate-400" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase leading-none mb-1">Próximo Cobro</p>
                    <p className="text-xs font-bold text-white">{new Date(subscription.fechaFin).toLocaleDateString('es-CO')}</p>
                  </div>
               </div>
            )}
          </div>

          {/* Gestión de Medios de Pago */}
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-50 text-slate-400 rounded-xl">
                  <Wallet size={20} />
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Métodos de Pago</h3>
              </div>
              <button 
                onClick={() => { setShowAddMethod(!showAddMethod); setMethodType('CARD'); }}
                className="flex items-center gap-2 text-[10px] font-black text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl transition-all border border-blue-50 uppercase tracking-widest"
              >
                {showAddMethod ? 'Cerrar' : <><Plus size={14} /> Gestionar</>}
              </button>
            </div>

            {showAddMethod ? (
              <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl mb-6 max-w-sm mx-auto">
                  <button 
                    onClick={() => setMethodType('CARD')}
                    className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${methodType === 'CARD' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Nueva Tarjeta
                  </button>
                  <button 
                    onClick={() => setMethodType('PSE')}
                    className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${methodType === 'PSE' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Pagar con PSE
                  </button>
                </div>

                {methodType === 'CARD' ? (
                  <form onSubmit={handleAddCard} className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 max-w-lg mx-auto">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="col-span-2">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Nombre en la tarjeta</label>
                        <input name="holderName" required placeholder="NOMBRE COMPLETO" className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-blue-500 uppercase" />
                      </div>
                      
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Tipo de ID</label>
                        <select name="idType" className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-blue-500">
                          <option value="CC">CC</option>
                          <option value="NIT">NIT</option>
                          <option value="CE">CE</option>
                          <option value="PP">Pasaporte</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Número de ID</label>
                        <input name="idNumber" required placeholder="12345678" className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-blue-500" />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 flex justify-between items-center">
                          <span>Número de Tarjeta</span>
                          <CardIcon brand={detectCardBrand(cardNumber)} size={16} />
                        </label>
                        <div className="relative">
                          <input 
                            name="number" 
                            required 
                            placeholder="0000 0000 0000 0000" 
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                            className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-blue-500" 
                          />
                          <input type="hidden" name="brand" value={detectCardBrand(cardNumber)} />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Expiración</label>
                        <input name="expiry" required placeholder="MM/YY" maxLength={5} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-blue-500 text-center" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">CVC</label>
                        <input name="cvc" required placeholder="000" maxLength={4} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-blue-500 text-center" />
                      </div>
                    </div>
                    <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all shadow-lg">
                      Guardar Tarjeta Segura
                    </button>
                  </form>
                ) : (
                  <div className="bg-slate-50 p-10 rounded-[2rem] border border-slate-100 text-center max-w-lg mx-auto">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-200 shadow-sm">
                      <Building2 className="text-blue-600" size={32} />
                    </div>
                    <h4 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Pago Instantáneo con PSE</h4>
                    <p className="text-xs text-slate-500 font-medium mb-8">Serás redirigido a la pasarela oficial para completar tu pago de forma segura.</p>
                    <button 
                      onClick={() => handlePayment('PSE')}
                      disabled={loading}
                      className="w-full py-4 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      Continuar a PSE <ArrowRight size={14} />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Opción PSE siempre disponible */}
                <div 
                  onClick={() => { setShowAddMethod(true); setMethodType('PSE'); }}
                  className="bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100 border-dashed flex justify-between items-center group cursor-pointer hover:bg-blue-50 transition-all"
                >
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-blue-200 text-blue-600">
                        <Building2 size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-blue-900 tracking-tighter">PSE Directo</p>
                        <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Banca en línea</p>
                      </div>
                   </div>
                   <ChevronRight size={18} className="text-blue-300 group-hover:translate-x-1 transition-transform" />
                </div>

                {/* Tarjetas Guardadas */}
                {cards.map((card) => (
                  <div key={card.id} className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex justify-between items-center group hover:border-blue-200 transition-all cursor-pointer" onClick={() => handlePayment('CARD')}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center shadow-sm">
                        <CardIcon brand={card.brand} size={14} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-800 tracking-tighter">•••• {card.last4}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Vence {card.expiry}</p>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteCard(card.id); }}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}

                {cards.length === 0 && (
                  <div 
                    onClick={() => { setShowAddMethod(true); setMethodType('CARD'); }}
                    className="p-6 border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center text-slate-300 hover:border-slate-200 transition-all cursor-pointer"
                  >
                    <Plus size={24} className="mb-1" />
                    <p className="text-[10px] font-black uppercase tracking-widest">Añadir Tarjeta</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Historial */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
             <div className="flex items-center gap-3">
                <History size={20} className="text-slate-400" />
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Historial de Transacciones</h3>
             </div>
             <ShieldCheck size={20} className="text-emerald-500 opacity-50" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Referencia</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Método</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Monto</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {payments.slice().reverse().map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-4 text-xs font-bold text-slate-500">{new Date(p.createdAt).toLocaleDateString('es-CO')}</td>
                    <td className="px-8 py-4 text-xs font-mono font-bold text-slate-800 tracking-tighter uppercase">{p.reference}</td>
                    <td className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase">{p.method}</td>
                    <td className="px-8 py-4 text-sm font-black text-slate-900 text-center">${p.amount.toLocaleString()}</td>
                    <td className="px-8 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${p.status === 'COMPLETED' ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
                        {p.status === 'COMPLETED' ? 'Exitoso' : 'Error'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}