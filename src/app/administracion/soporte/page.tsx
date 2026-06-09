'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SoporteRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/administracion/control-maestro');
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-500 gap-4">
      <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="font-black uppercase text-xs tracking-widest text-slate-500">Redireccionando al Panel de Soporte Permanente...</p>
    </div>
  );
}
