'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    CalendarCheck,
    Clock,
    DollarSign,
    Shield,
    BarChart3,
    Settings
} from 'lucide-react';

export default function GestionHumanaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    // Reestructuración Profesional de la Navegación
    const navItems = [
        { name: 'Liquidación Extras', href: '/gestion-humana/extras', icon: Clock, category: 'Nómina' },
        { name: 'Seguridad Social', href: '/gestion-humana/seguridad-social', icon: Shield, category: 'Nómina' },
        { name: 'Personal Doméstico', href: '/gestion-humana/domesticas', icon: Users, category: 'Nómina' },
    ];

    const isActive = (href: string) => pathname === href;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Top Navigation Bar */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="px-8 py-4">
                    <div className="mb-4">
                        <h1 className="text-2xl font-black text-slate-900">Gestión Humana</h1>
                        <p className="text-sm text-slate-500 font-medium">Planificación, Nómina y Analítica</p>
                    </div>

                    {/* Horizontal Tab Navigation */}
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${isActive(item.href)
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'text-slate-600 hover:bg-slate-100'
                                    }`}
                            >
                                <item.icon size={16} />
                                <span>{item.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="p-8">
                {children}
            </main>
        </div>
    );
}
