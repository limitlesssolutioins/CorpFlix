'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Users, Shield, FileText, ArrowLeft } from 'lucide-react';

export default function SeguridadSocialLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const subTabs = [
        { name: 'Empleados', href: '/gestion-humana/seguridad-social', icon: Users, exact: true },
        { name: 'Aportes', href: '/gestion-humana/seguridad-social/aportes', icon: Shield },
        { name: 'PILA', href: '/gestion-humana/seguridad-social/pila', icon: FileText },
        { name: 'Reportes', href: '/gestion-humana/seguridad-social/reportes', icon: FileText }
    ];

    const isActive = (href: string, exact?: boolean) => {
        if (exact) return pathname === href;
        return pathname.startsWith(href);
    };

    return (
        <div>
            <div className="mb-6">
                <Link href="/gestion-humana" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold mb-4 transition-colors">
                    <ArrowLeft size={20} />
                    Volver a Gestión Humana
                </Link>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Liquidación Seguridad Social</h2>
                <p className="text-slate-600">Gestión de aportes a salud, pensión, ARL y parafiscales</p>
            </div>

            {/* Sub-tabs */}
            <div className="bg-white rounded-xl border border-slate-200 p-1 mb-6 inline-flex gap-1">
                {subTabs.map((tab) => (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${isActive(tab.href, tab.exact)
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'text-slate-600 hover:bg-slate-100'
                            }`}
                    >
                        <tab.icon size={16} />
                        {tab.name}
                    </Link>
                ))}
            </div>

            <div>{children}</div>
        </div>
    );
}
