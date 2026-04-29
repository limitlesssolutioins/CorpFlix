'use client';

import Link from 'next/link';
import { 
    Clock, Shield, Users, ArrowRight, UserPlus, 
    FileText, Wallet, Calendar, AlertCircle, 
    TrendingUp, BarChart3, Bell, Home, ChevronRight
} from 'lucide-react';

export default function GestionHumanaPage() {
    const mainModules = [
        {
            title: 'Directorio de Personal',
            description: 'Expediente integral 360°, contratos, documentos e historial laboral.',
            href: '/gestion-humana/employees',
            icon: Users,
            iconBg: 'from-blue-500 to-blue-600',
            textColor: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        {
            title: 'Nómina y Prestaciones',
            description: 'Cálculo de salarios, extras, recargos, seguridad social y liquidaciones.',
            href: '/gestion-humana/nomina',
            icon: Wallet,
            iconBg: 'from-emerald-500 to-emerald-600',
            textColor: 'text-emerald-600',
            bgColor: 'bg-emerald-50'
        },
        {
            title: 'Control de Asistencia',
            description: 'Registro de entrada/salida, GPS, turnos y reportes de horas trabajadas.',
            href: '/gestion-humana/asistencia',
            icon: Clock,
            iconBg: 'from-violet-500 to-violet-600',
            textColor: 'text-violet-600',
            bgColor: 'bg-violet-50'
        }
    ];

    const secondaryModules = [
        {
            title: 'Seguridad Social (PILA)',
            description: 'Gestión de aportes y planillas.',
            href: '/gestion-humana/seguridad-social',
            icon: Shield,
            color: 'text-slate-600'
        },
        {
            title: 'Personal Doméstico',
            description: 'Liquidación simplificada Ley 1595.',
            href: '/gestion-humana/domesticas',
            icon: Home,
            color: 'text-slate-600'
        },
        {
            title: 'Novedades y Ausencias',
            description: 'Incapacidades, vacaciones y licencias.',
            href: '/gestion-humana/asistencia',
            icon: AlertCircle,
            color: 'text-slate-600'
        }
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20">
            {/* Cabecera con Alertas Rápidas */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Gestión Humana</h2>
                    <p className="text-slate-500 font-medium">Control integral de talento, nómina y cumplimiento legal en Colombia.</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/gestion-humana/employees/create" className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20">
                        <UserPlus size={18} /> Vincular Colaborador
                    </Link>
                </div>
            </div>

            {/* Grid Principal */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {mainModules.map((module) => (
                    <Link
                        key={module.href}
                        href={module.href}
                        className="group bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm hover:shadow-2xl hover:border-slate-300 transition-all duration-500 relative overflow-hidden flex flex-col h-full"
                    >
                        <div className={`w-16 h-16 bg-gradient-to-br ${module.iconBg} rounded-[1.5rem] flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                            <module.icon className="w-8 h-8 text-white" />
                        </div>

                        <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{module.title}</h3>
                        <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-1">
                            {module.description}
                        </p>

                        <div className={`flex items-center gap-2 text-sm font-black uppercase tracking-widest ${module.textColor}`}>
                            Gestionar <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-500" />
                        </div>
                    </Link>
                ))}
            </div>

            {/* Módulos Secundarios / Herramientas */}
            <div className="bg-slate-50 rounded-[3rem] p-10 border border-slate-100">
                <div className="flex items-center gap-2 mb-8 ml-2">
                    <BarChart3 size={20} className="text-slate-400" />
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Herramientas y Cumplimiento</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {secondaryModules.map((m) => (
                        <Link key={m.title} href={m.href} className="bg-white p-6 rounded-[2rem] border border-slate-200/50 hover:border-primary-300 hover:shadow-xl transition-all flex items-center gap-4 group">
                            <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                <m.icon size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800">{m.title}</h4>
                                <p className="text-xs text-slate-500">{m.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Dashboard Inmediato (Alertas) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
                            <Bell size={20} className="text-rose-500" /> Próximos Vencimientos
                        </h3>
                        <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-widest">3 Alertas</span>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border-l-4 border-rose-500">
                            <div>
                                <p className="text-sm font-bold text-slate-800">Contrato Fijo - Juan Perez</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Vence en 15 días (Requiere pre-aviso)</p>
                            </div>
                            <ChevronRight size={16} className="text-slate-300" />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border-l-4 border-amber-500">
                            <div>
                                <p className="text-sm font-bold text-slate-800">Examen Médico - Maria Garcia</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Programar renovación Alturas</p>
                            </div>
                            <ChevronRight size={16} className="text-slate-300" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-primary-500/30 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10"><TrendingUp size={120} /></div>
                    <div>
                        <h3 className="text-xl font-black mb-2 tracking-tight">Resumen de Nómina</h3>
                        <p className="text-primary-100 text-sm font-medium opacity-80 uppercase tracking-widest">Abril 2026 - Mes Completo</p>
                    </div>
                    <div className="mt-8 flex items-baseline gap-2">
                        <h4 className="text-4xl font-black tracking-tight">$42.5M</h4>
                        <span className="text-xs font-bold text-primary-200">+3.2% vs mes anterior</span>
                    </div>
                    <div className="mt-8">
                        <Link href="/gestion-humana/nomina" className="w-full py-4 bg-white text-primary-600 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary-50 transition-all">
                             Ver Detalles <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}