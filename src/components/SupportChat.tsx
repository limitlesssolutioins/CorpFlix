'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '@/lib/socketContext';
import { MessageCircle, X, Send, Bot, User, Sparkles, Minus } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ia' | 'agent';
  timestamp: number;
}

export default function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: '¡Hola! Soy Lidia, tu asistente de LIDUS. ¿En qué puedo ayudarte hoy?', sender: 'ia', timestamp: Date.now() }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const { socket, emit } = useSocket();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (!socket) return;

    socket.on('new-message', (data: any) => {
      setMessages(prev => [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        text: data.text,
        sender: data.sender,
        timestamp: Date.now()
      }]);
    });

    return () => {
      socket.off('new-message');
    };
  }, [socket]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    try {
      // 1. Enviar vía WebSocket para sincronización (opcional si es multi-agente)
      // emit('send-message', { text: currentInput, sender: 'user' });

      // 2. Llamar a la API de IA
      const res = await fetch('/api/support/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: currentInput,
          history: messages.slice(-5).map(m => ({ role: m.sender === 'user' ? 'user' : 'model', content: m.text }))
        })
      });

      const data = await res.json();
      
      if (data.reply) {
        const iaMsg: Message = {
          id: (Date.now() + 1).toString(),
          text: data.reply,
          sender: 'ia',
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, iaMsg]);
      }
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-[100] group"
      >
        <MessageCircle size={28} className="group-hover:rotate-12 transition-transform" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full animate-pulse" />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 w-[380px] bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-[100] transition-all flex flex-col ${isMinimized ? 'h-16' : 'h-[550px]'}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <Bot size={22} className="text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm">Soporte Inteligente</h3>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-white/70 font-bold uppercase tracking-widest">Lidia AI Activa</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setIsMinimized(!isMinimized)} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white">
            {isMinimized ? <Sparkles size={16} /> : <Minus size={16} />}
          </button>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-white">
            <X size={18} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  msg.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white/5 text-slate-200 border border-white/5 rounded-tl-none'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    {msg.sender === 'user' ? <User size={12} className="opacity-50" /> : <Bot size={12} className="text-blue-400" />}
                    <span className="text-[10px] font-black uppercase opacity-40">
                      {msg.sender === 'user' ? 'Tú' : msg.sender === 'ia' ? 'Lidia AI' : 'Asesor Lidus'}
                    </span>
                  </div>
                  <p className="leading-relaxed font-medium">{msg.text}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/5 p-3 rounded-2xl border border-white/5 flex gap-1">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-4 border-t border-white/5 bg-white/[0.02]">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Escribe tu duda aquí..."
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-blue-500 transition-all pr-12"
              />
              <button 
                type="submit"
                disabled={!input.trim() || isTyping}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-all active:scale-95"
              >
                <Send size={16} />
              </button>
            </div>
            <p className="text-[9px] text-slate-500 text-center mt-3 font-bold uppercase tracking-widest">
              Lidus AI puede cometer errores. Verifica la información.
            </p>
          </form>
        </>
      )}
    </div>
  );
}
