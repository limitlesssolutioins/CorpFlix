'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RedirectToMejora() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/mejora-continua/acciones');
    }, [router]);

    return (
        <div className="flex items-center justify-center py-20">
            <div className="text-center">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-500 font-bold">Redirigiendo a Gestión de Acciones unificada...</p>
            </div>
        </div>
    );
}
