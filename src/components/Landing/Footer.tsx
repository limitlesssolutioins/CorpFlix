'use client';

import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-500 py-24 border-t border-white/5 relative overflow-hidden w-full flex flex-col items-center">
      {/* Subtle glow in footer */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-2 mb-8 group cursor-pointer">
              <img src="/ISOLOGO.png" alt="Lidus" className="h-7 w-auto transition-transform group-hover:scale-110" />
              <span className="text-xl font-black tracking-tighter text-white">LIDUS</span>
            </div>
            <p className="text-sm leading-relaxed mb-8 font-medium">
              Empoderando el liderazgo corporativo a través de la integración, el desarrollo y la tecnología de vanguardia.
            </p>
            <div className="flex items-center gap-5">
              <a href="#" className="text-slate-600 hover:text-blue-500 transition-colors"><Facebook size={18} /></a>
              <a href="#" className="text-slate-600 hover:text-blue-500 transition-colors"><Twitter size={18} /></a>
              <a href="#" className="text-slate-600 hover:text-blue-500 transition-colors"><Linkedin size={18} /></a>
              <a href="#" className="text-slate-600 hover:text-blue-500 transition-colors"><Instagram size={18} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-8">Producto</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href="#features" className="hover:text-blue-500 transition-colors">Características</a></li>
              <li><a href="#ai" className="hover:text-blue-500 transition-colors">Tecnología IA</a></li>
              <li><a href="#pricing" className="hover:text-blue-500 transition-colors">Planes & Precios</a></li>
              <li><Link href="/login" className="hover:text-blue-500 transition-colors">Solicitar Demo</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-8">Compañía</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href="#" className="hover:text-blue-500 transition-colors">Sobre Nosotros</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Blog Corporativo</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Carreras</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Contacto</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-8">Contacto</h4>
            <ul className="space-y-5 text-sm font-medium">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-blue-500 shrink-0 mt-0.5" />
                <span>Bogotá, Colombia</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-blue-500 shrink-0" />
                <span>+57 (300) 123 4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-blue-500 shrink-0" />
                <span>contacto@lidus.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
            © 2026 LIDUS. UNA MARCA DE <a href="https://vijalmar.com" className="text-slate-400 hover:text-blue-500 transition-colors">VIJALMAR SAS</a>.
          </p>
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest">
            <a href="#" className="text-slate-600 hover:text-slate-400 transition-colors">Términos</a>
            <a href="#" className="text-slate-600 hover:text-slate-400 transition-colors">Privacidad</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
