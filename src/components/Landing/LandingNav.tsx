'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const LandingNav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true); // default to true initially
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };

    const handleResize = () => {
      // Use 1024px as the standard laptop/desktop threshold to avoid crowding
      setIsDesktop(window.innerWidth >= 1024);
    };

    // Initialize states
    handleScroll();
    handleResize();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const activeDesktop = isMounted ? isDesktop : true;

  return (
    <nav 
      style={{ zIndex: 9999 }}
      className={`fixed top-0 left-0 right-0 transition-all duration-300 py-3.5 ${
        isScrolled 
          ? 'bg-slate-950/85 backdrop-blur-md border-b border-white/5 shadow-lg shadow-slate-950/20' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <img 
            src="/ISOLOGO.png" 
            alt="Lidus" 
            className="h-8 w-auto transition-all duration-300 group-hover:scale-105" 
          />
          <span className="text-xl font-black tracking-tight text-white group-hover:text-blue-400 transition-colors">
            LIDUS
          </span>
        </Link>

        {/* Desktop Menu - Highly adaptive with no wrapping and responsive spacing */}
        {activeDesktop && (
          <div className="flex items-center gap-3 lg:gap-6 xl:gap-8 flex-nowrap">
            <a 
              href="#features" 
              className="text-slate-300 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest whitespace-nowrap shrink-0 py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-500 after:transition-all hover:after:w-full"
            >
              Características
            </a>
            <a 
              href="#ai" 
              className="text-slate-300 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest whitespace-nowrap shrink-0 py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-500 after:transition-all hover:after:w-full"
            >
              IA
            </a>
            <a 
              href="#pricing" 
              className="text-slate-300 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest whitespace-nowrap shrink-0 py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-500 after:transition-all hover:after:w-full"
            >
              Planes
            </a>
            
            <div className="w-px h-4 bg-white/10 shrink-0 mx-1" />
            
            <Link 
              href="/login" 
              className="text-slate-300 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest whitespace-nowrap shrink-0"
            >
              Ingresar
            </Link>

            <Link 
              href="/login?signup=true" 
              className="text-slate-300 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest border border-white/10 hover:border-white/20 rounded-xl px-4 py-2 bg-white/5 transition-all whitespace-nowrap shrink-0 hidden xl:inline-block"
            >
              Solicitar Demo
            </Link>
            
            <Link 
              href="/login?signup=true" 
              className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 whitespace-nowrap shrink-0"
            >
              Empezar Gratis
            </Link>
          </div>
        )}

        {/* Mobile Menu Button - Shown under 1024px to guarantee clean UI */}
        {!activeDesktop && (
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-slate-300 hover:text-white p-2 hover:bg-white/5 rounded-xl transition-all shrink-0"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={20} className="stroke-[2.5]" /> : <Menu size={20} className="stroke-[2.5]" />}
          </button>
        )}
      </div>

      {/* Mobile Dropdown */}
      {!activeDesktop && isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-slate-950/95 backdrop-blur-xl border-b border-white/10 py-6 px-6 flex flex-col gap-5 shadow-2xl transition-all duration-300">
          <a 
            href="#features" 
            onClick={() => setIsMobileMenuOpen(false)} 
            className="text-slate-200 hover:text-white text-base font-semibold transition-colors py-1"
          >
            Características
          </a>
          <a 
            href="#ai" 
            onClick={() => setIsMobileMenuOpen(false)} 
            className="text-slate-200 hover:text-white text-base font-semibold transition-colors py-1"
          >
            IA (SGSST)
          </a>
          <a 
            href="#pricing" 
            onClick={() => setIsMobileMenuOpen(false)} 
            className="text-slate-200 hover:text-white text-base font-semibold transition-colors py-1"
          >
            Planes
          </a>
          <div className="h-px bg-white/10 w-full my-1" />
          <Link 
            href="/login" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full text-center py-3 text-slate-200 border border-white/10 rounded-xl font-bold hover:bg-white/5 transition-all text-sm"
          >
            Ingresar
          </Link>
          <Link 
            href="/login?signup=true" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full text-center py-3 text-slate-200 border border-white/10 rounded-xl font-bold hover:bg-white/5 transition-all text-sm"
          >
            Solicitar Demo
          </Link>
          <Link 
            href="/login?signup=true" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full text-center py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-500 hover:to-indigo-500 transition-all text-sm shadow-lg shadow-blue-500/25"
          >
            Empezar Gratis
          </Link>
        </div>
      )}
    </nav>
  );
};

export default LandingNav;
