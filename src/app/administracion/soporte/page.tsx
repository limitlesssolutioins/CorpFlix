'use client';

import React, { useState, useEffect } from 'react';
import { useSocket } from '@/lib/socketContext';
import { MessageSquare, Ticket, Clock, CheckCircle, User, Headset, X, Send } from 'lucide-react';

interface ChatRequest {
  companyId: string;
  userId: string;
  userName: string;
  socketId: string;
  timestamp: number;
}

interface ActiveChat extends ChatRequest {
  messages: { text: string; sender: 'user' | 'agent'; timestamp: number }[];
}

export default function SoporteDashboard() {
  const { socket, isConnected } = useSocket();
  const [tickets, setTickets] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<ChatRequest[]>([]);
  const [activeChat, setActiveChat] = useState<ActiveChat | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [activeTab, setActiveTab] = useState<'chats' | 'tickets'>('chats');

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.emit('join-saas-admins');

    socket.on('human-requested', (data: any) => {
      setPendingRequests(prev => [...prev, { ...data, timestamp: Date.now() }]);
    });

    socket.on('new-saas-message', (data: any) => {
      if (data.sender === 'user') {
        setActiveChat(prev => {
          if (!prev || prev.userId !== data.userId) return prev;
          return {
            ...prev,
            messages: [...prev.messages, { text: data.text, sender: 'user', timestamp: Date.now() }]
          };
        });
      }
    });

    return () => {
      socket.off('human-requested');
      socket.off('new-saas-message');
    };
  }, [socket, isConnected]);

  const fetchTickets = async () => {
    try {
      const res = await fetch('/api/support/saas-tickets');
      if (res.ok) {
        setTickets(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const acceptChat = (req: ChatRequest) => {
    socket?.emit('agent-accept', { 
      companyId: req.companyId, 
      userId: req.userId, 
      agentName: 'Soporte Limitless' 
    });
    setPendingRequests(prev => prev.filter(r => r.userId !== req.userId));
    setActiveChat({ ...req, messages: [] });
  };

  const sendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeChat || !socket) return;

    const msg = chatInput;
    setChatInput('');

    setActiveChat(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        messages: [...prev.messages, { text: msg, sender: 'agent', timestamp: Date.now() }]
      };
    });

    socket.emit('saas-chat-message', {
      companyId: activeChat.companyId,
      userId: activeChat.userId,
      text: msg,
      sender: 'agent'
    });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <Headset className="text-blue-600" /> Centro de Soporte Global
        </h1>
        <p className="text-slate-500 mt-2">Gestiona todas las solicitudes de soporte de tus empresas clientes.</p>
      </div>

      <div className="flex gap-4 mb-6 border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('chats')}
          className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'chats' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Chats en Vivo
          {pendingRequests.length > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          )}
          {activeTab === 'chats' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
        </button>
        <button 
          onClick={() => setActiveTab('tickets')}
          className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'tickets' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Tickets de Fallback
          {activeTab === 'tickets' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
        </button>
      </div>

      {activeTab === 'chats' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de Solicitudes */}
          <div className="col-span-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[600px]">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <Clock size={18} className="text-amber-500" /> En espera ({pendingRequests.length})
              </h3>
            </div>
            <div className="p-4 flex-1 overflow-y-auto space-y-3">
              {pendingRequests.length === 0 ? (
                <div className="text-center text-slate-400 py-10">
                  <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No hay clientes en espera</p>
                </div>
              ) : (
                pendingRequests.map(req => (
                  <div key={req.userId} className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-800 text-sm">{req.userName}</p>
                      <p className="text-xs text-slate-500">ID: {req.companyId}</p>
                    </div>
                    <button 
                      onClick={() => acceptChat(req)}
                      className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Atender
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Área de Chat Activo */}
          <div className="col-span-1 lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[600px]">
            {activeChat ? (
              <>
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                      <User size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">{activeChat.userName}</h3>
                      <p className="text-xs text-slate-500">{activeChat.companyId}</p>
                    </div>
                  </div>
                  <button onClick={() => setActiveChat(null)} className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
                    <X size={20} />
                  </button>
                </div>
                
                <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50">
                  {activeChat.messages.map((m, i) => (
                    <div key={i} className={`flex ${m.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${
                        m.sender === 'agent' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
                      }`}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                  {activeChat.messages.length === 0 && (
                    <div className="text-center text-slate-400 mt-10 text-sm">
                      Chat conectado. Escribe un mensaje para iniciar.
                    </div>
                  )}
                </div>

                <form onSubmit={sendChatMessage} className="p-4 border-t border-slate-100 bg-white">
                  <div className="relative">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                      placeholder="Escribe tu respuesta..."
                      className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    />
                    <button 
                      type="submit"
                      disabled={!chatInput.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                <MessageSquare size={48} className="mb-4 opacity-20" />
                <p>Selecciona un chat en espera para comenzar</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'tickets' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Ticket className="text-blue-600" /> Tickets de Fallback ({tickets.length})
            </h3>
            <button onClick={fetchTickets} className="text-sm text-blue-600 hover:text-blue-700 font-medium">Actualizar</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">Código</th>
                  <th className="p-4 font-semibold">Empresa</th>
                  <th className="p-4 font-semibold">Asunto</th>
                  <th className="p-4 font-semibold">Estado</th>
                  <th className="p-4 font-semibold">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">No hay tickets globales creados.</td>
                  </tr>
                ) : (
                  tickets.map(t => (
                    <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-medium text-slate-800">{t.ticket_code}</td>
                      <td className="p-4 text-slate-600">{t.company_id}</td>
                      <td className="p-4 text-slate-800 font-medium max-w-xs truncate">{t.subject}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          t.status === 'OPEN' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500">{new Date(t.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
