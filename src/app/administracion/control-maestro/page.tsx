'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '@/lib/socketContext';
import { 
    Plus, 
    Settings, 
    ChevronRight, 
    Folder, 
    FileText, 
    List, 
    CheckCircle, 
    Trash2, 
    Edit2, 
    Save, 
    X,
    Layout,
    Globe,
    Shield,
    ArrowRight,
    Headset,
    MessageSquare,
    Clock,
    User,
    Send,
    Ticket,
    Users,
    CreditCard,
    Building2,
    Lock,
    LogOut,
    Check,
    Tags
} from 'lucide-react';
import { toast } from 'sonner';

// --- Interfaces ---
interface Standard {
    id: number; code: string; name: string; fullName: string; category: string; color: string; description: string;
}
interface Chapter {
    id: number; standardId: number; chapterNumber: string; title: string;
}
interface Requirement {
    id: number; chapterId: number; code: string; title: string; isAuditable: boolean; weight: number;
}
interface Variable {
    id: number; text: string; order: number;
}

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

interface CompanyData {
    id: string;
    name: string;
    nit: string;
    status: string;
    createdAt: string;
    users: any[];
    subscription: {
        plan: string;
        estado: string;
        fechaFin: string | null;
    };
    profile?: {
        nombreEmpresa?: string;
        nit?: string;
        sectorActividad?: string;
        direccion?: string;
        ciudad?: string;
        telefono?: string;
        email?: string;
        sitioWeb?: string;
    } | null;
}

interface Category {
    id: number;
    name: string;
}

const ADMIN_TOKEN = 'lidus_admin_super_secret_token_2026';

export default function ControlMaestroStandalone() {
    // Authentication State
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    // Active Dashboard Tab
    const [activeTab, setActiveTab] = useState<'audit' | 'support' | 'companies'>('companies');

    // Tab 1: Audit Master State
    const [standards, setStandards] = useState<Standard[]>([]);
    const [selectedStd, setSelectedStd] = useState<Standard | null>(null);
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [selectedChap, setSelectedChap] = useState<Chapter | null>(null);
    const [requirements, setRequirements] = useState<Requirement[]>([]);
    const [selectedReq, setSelectedReq] = useState<Requirement | null>(null);
    const [variables, setVariables] = useState<Variable[]>([]);
    const [auditLoading, setAuditLoading] = useState(false);
    const [auditView, setAuditView] = useState<'STANDARDS' | 'CHAPTERS' | 'REQUIREMENTS'>('STANDARDS');
    const [isStdModalOpen, setIsStdModalOpen] = useState(false);
    const [editingStd, setEditingStd] = useState<Partial<Standard> | null>(null);

    // Categories State
    const [categories, setCategories] = useState<Category[]>([]);
    const [isCatModalOpen, setIsCatModalOpen] = useState(false);
    const [newCatName, setNewCatName] = useState('');
    const [editingCatId, setEditingCatId] = useState<number | null>(null);
    const [editingCatName, setEditingCatName] = useState('');

    // Tab 2: Support State
    const { socket, isConnected } = useSocket();
    const [tickets, setTickets] = useState<any[]>([]);
    const [pendingRequests, setPendingRequests] = useState<ChatRequest[]>([]);
    const [activeChat, setActiveChat] = useState<ActiveChat | null>(null);
    const [chatInput, setChatInput] = useState('');
    const [supportActiveTab, setSupportActiveTab] = useState<'chats' | 'tickets'>('chats');

    // Tab 3: Companies & Subscriptions State
    const [companies, setCompanies] = useState<CompanyData[]>([]);
    const [loadingCompanies, setLoadingCompanies] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<CompanyData | null>(null);
    const [editingSub, setEditingSub] = useState({ plan: 'Mensual Total', estado: 'ACTIVO', fechaFin: '' });
    const [isSubModalOpen, setIsSubModalOpen] = useState(false);
    const [expandedOnboardings, setExpandedOnboardings] = useState<Record<string, boolean>>({});

    // --- CHECK AUTH ON MOUNT ---
    useEffect(() => {
        const storedToken = localStorage.getItem('control_maestro_session');
        if (storedToken === ADMIN_TOKEN) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    // --- FETCH DATA WHEN AUTHENTICATED ---
    useEffect(() => {
        if (isAuthenticated) {
            fetchCategories();
            fetchStandards();
            fetchTickets();
            fetchCompanies();
        }
    }, [isAuthenticated]);

    // --- SOCKETS FOR LIVE SUPPORT ---
    useEffect(() => {
        if (!isAuthenticated || !socket || !isConnected) return;

        socket.emit('join-saas-admins');

        const handleHumanRequested = (data: any) => {
            setPendingRequests(prev => {
                if (prev.some(r => r.userId === data.userId)) return prev;
                return [...prev, { ...data, timestamp: Date.now() }];
            });
            toast.info(`Nueva solicitud de soporte: ${data.userName}`);
        };

        const handleNewSaasMessage = (data: any) => {
            if (data.sender === 'user') {
                setActiveChat(prev => {
                    if (!prev || prev.userId !== data.userId) return prev;
                    return {
                        ...prev,
                        messages: [...prev.messages, { text: data.text, sender: 'user', timestamp: Date.now() }]
                    };
                });
            }
        };

        socket.on('human-requested', handleHumanRequested);
        socket.on('new-saas-message', handleNewSaasMessage);

        return () => {
            socket.off('human-requested', handleHumanRequested);
            socket.off('new-saas-message', handleNewSaasMessage);
        };
    }, [socket, isConnected, isAuthenticated]);

    // --- LOGIN HANDLER ---
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (loginEmail === 'soporte@lidus.co' && loginPassword === 'LidusSoporte2026!') {
            localStorage.setItem('control_maestro_session', ADMIN_TOKEN);
            setIsAuthenticated(true);
            setLoginError('');
            toast.success('Sesión de Soporte Permanente iniciada');
        } else {
            setLoginError('Usuario o contraseña de administrador incorrectos.');
            toast.error('Credenciales de Soporte denegadas');
        }
    };

    // --- LOGOUT HANDLER ---
    const handleLogout = () => {
        localStorage.removeItem('control_maestro_session');
        setIsAuthenticated(false);
        toast.info('Sesión cerrada');
    };

    // --- CATEGORIES CRUD ACTIONS ---
    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/admin/audit-master/categories');
            if (res.ok) {
                setCategories(await res.json());
            }
        } catch (e) {
            console.error('Error fetching categories', e);
        }
    };

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCatName.trim()) return;

        try {
            const res = await fetch('/api/admin/audit-master/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newCatName.trim() })
            });
            if (res.ok) {
                toast.success('Categoría creada exitosamente');
                setNewCatName('');
                fetchCategories();
                fetchStandards(); // Refresh grouping
            } else {
                const data = await res.json();
                toast.error(data.error || 'Error al crear categoría');
            }
        } catch (e) {
            toast.error('Error de red');
        }
    };

    const handleUpdateCategory = async (id: number) => {
        if (!editingCatName.trim()) return;

        try {
            const res = await fetch('/api/admin/audit-master/categories', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, name: editingCatName.trim() })
            });
            if (res.ok) {
                toast.success('Categoría actualizada');
                setEditingCatId(null);
                setEditingCatName('');
                fetchCategories();
                fetchStandards(); // Refresh grouping
            } else {
                toast.error('Error al actualizar');
            }
        } catch (e) {
            toast.error('Error de red');
        }
    };

    const handleDeleteCategory = async (id: number) => {
        if (!confirm('¿Seguro que deseas eliminar esta categoría? Las normas asociadas quedarán sin categorizar.')) return;

        try {
            const res = await fetch(`/api/admin/audit-master/categories?id=${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                toast.success('Categoría eliminada');
                fetchCategories();
                fetchStandards(); // Refresh grouping
            } else {
                toast.error('Error al eliminar');
            }
        } catch (e) {
            toast.error('Error de red');
        }
    };

    // --- TAB 1: AUDIT MASTER DATA FETCHERS & ACTIONS ---
    const fetchStandards = async () => {
        setAuditLoading(true);
        try {
            const res = await fetch('/api/admin/audit-master/standards');
            if (res.ok) setStandards(await res.json());
        } finally {
            setAuditLoading(false);
        }
    };

    const fetchChapters = async (stdId: number) => {
        const res = await fetch(`/api/admin/audit-master/chapters?standardId=${stdId}`);
        if (res.ok) setChapters(await res.json());
    };

    const fetchRequirements = async (chapId: number) => {
        const res = await fetch(`/api/admin/audit-master/requirements?chapterId=${chapId}`);
        if (res.ok) setRequirements(await res.json());
    };

    const handleSelectStd = (std: Standard) => {
        setSelectedStd(std);
        setSelectedChap(null);
        setSelectedReq(null);
        fetchChapters(std.id);
        setAuditView('CHAPTERS');
    };

    const handleSelectChap = (chap: Chapter) => {
        setSelectedChap(chap);
        setSelectedReq(null);
        fetchRequirements(chap.id);
        setAuditView('REQUIREMENTS');
    };

    const handleSaveStandard = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = editingStd?.id ? 'PUT' : 'POST';
        const res = await fetch('/api/admin/audit-master/standards', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editingStd)
        });
        if (res.ok) {
            toast.success('Norma guardada exitosamente');
            setIsStdModalOpen(false);
            fetchStandards();
        } else {
            toast.error('Error al guardar la norma');
        }
    };

    const deleteStandard = async (id: number) => {
        if (!confirm('¿Seguro? Se borrará todo lo contenido en esta norma.')) return;
        const res = await fetch(`/api/admin/audit-master/standards?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
            toast.success('Norma eliminada');
            fetchStandards();
        }
    };

    // --- TAB 2: SUPPORT ACTIONS ---
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
            agentName: 'Soporte Permanente' 
        });
        setPendingRequests(prev => prev.filter(r => r.userId !== req.userId));
        setActiveChat({ ...req, messages: [] });
        toast.success(`Chat activo con ${req.userName}`);
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

    // --- TAB 3: COMPANIES & SUBSCRIPTIONS FETCHERS & ACTIONS ---
    const fetchCompanies = async () => {
        setLoadingCompanies(true);
        try {
            const res = await fetch('/api/admin/control-maestro/companies', {
                headers: { 'x-admin-token': ADMIN_TOKEN }
            });
            if (res.ok) {
                setCompanies(await res.json());
            }
        } catch (e) {
            console.error('Error fetching companies', e);
            toast.error('Error al obtener la lista de clientes');
        } finally {
            setLoadingCompanies(false);
        }
    };

    const openSubscriptionModal = (company: CompanyData) => {
        setSelectedCompany(company);
        setEditingSub({
            plan: company.subscription?.plan || 'Mensual Total',
            estado: company.subscription?.estado || 'ACTIVO',
            fechaFin: company.subscription?.fechaFin ? company.subscription.fechaFin.substring(0, 10) : ''
        });
        setIsSubModalOpen(true);
    };

    const handleUpdateSubscription = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCompany) return;

        try {
            const res = await fetch('/api/admin/control-maestro/companies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-token': ADMIN_TOKEN
                },
                body: JSON.stringify({
                    companyId: selectedCompany.id,
                    plan: editingSub.plan,
                    estado: editingSub.estado,
                    fechaFin: editingSub.fechaFin || null
                })
            });

            if (res.ok) {
                toast.success('Suscripción actualizada exitosamente');
                setIsSubModalOpen(false);
                fetchCompanies();
            } else {
                toast.error('Error al actualizar la suscripción');
            }
        } catch (e) {
            console.error(e);
            toast.error('Error de red al actualizar');
        }
    };

    // Grouping standards dynamically by category
    const groupedStandards = categories.reduce((acc, cat) => {
        const stdsInCat = standards.filter(std => std.category === cat.name);
        if (stdsInCat.length > 0) {
            acc.push({ category: cat.name, standards: stdsInCat });
        }
        return acc;
    }, [] as { category: string; standards: Standard[] }[]);

    // Include uncategorized standards
    const uncategorizedStandards = standards.filter(std => !std.category || !categories.some(c => c.name === std.category));
    if (uncategorizedStandards.length > 0) {
        groupedStandards.push({ category: 'Sin Categorizar / Otras', standards: uncategorizedStandards });
    }

    // --- LOADING RENDER WHILE AUTH CHECK ---
    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 text-xs font-black uppercase tracking-widest mt-4">Verificando Credenciales de Soporte...</p>
            </div>
        );
    }

    // --- LOGIN SCREEN RENDER ---
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col lg:flex-row">
                {/* Brand Showcase */}
                <div className="hidden lg:flex lg:w-1/2 bg-blue-600 p-20 flex-col justify-between relative overflow-hidden select-none">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-700 to-indigo-900 opacity-90 z-0"></div>
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/10 blur-3xl"></div>
                    
                    <div className="z-10 flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-xl shadow-blue-900/30 font-black">
                            L
                        </div>
                        <span className="text-white text-xl font-black tracking-widest uppercase">LIDUS SOPORTE</span>
                    </div>

                    <div className="z-10">
                        <p className="text-blue-200 text-xs font-black uppercase tracking-widest mb-2">Portal de Administración</p>
                        <h1 className="text-white text-5xl font-black tracking-tight leading-none mb-6">Soporte Permanente & Control Maestro</h1>
                        <p className="text-blue-100/80 text-sm max-w-md font-medium leading-relaxed">
                            Accede al centro de comando definitivo de Lidus para administrar la estructura del sistema de auditoría, dar respuesta en vivo a chats de clientes, y gestionar suscripciones empresariales de manera aislada y ultra segura.
                        </p>
                    </div>

                    <div className="z-10 text-xs text-blue-200/50 font-medium">
                        Limitless Solutions © 2026. Todos los derechos reservados.
                    </div>
                </div>

                {/* Login Form Form */}
                <div className="flex-1 flex items-center justify-center p-8 bg-slate-950">
                    <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-500">
                        <div className="text-center lg:text-left">
                            <div className="lg:hidden mx-auto w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 font-black shadow-lg shadow-blue-500/20">L</div>
                            <h2 className="text-white text-3xl font-black tracking-tight">Iniciar Sesión de Comando</h2>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mt-2">Introduce tus credenciales maestras exclusivas de soporte</p>
                        </div>

                        {loginError && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold text-center">
                                {loginError}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-5">
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Email Administrador</label>
                                <input 
                                    type="email"
                                    required
                                    placeholder="soporte@lidus.co"
                                    className="w-full p-4 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm font-bold placeholder-slate-600 outline-none focus:border-blue-500 transition-all"
                                    value={loginEmail}
                                    onChange={e => setLoginEmail(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Contraseña de Seguridad</label>
                                <div className="relative">
                                    <input 
                                        type="password"
                                        required
                                        placeholder="••••••••••••"
                                        className="w-full p-4 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm font-bold placeholder-slate-700 outline-none focus:border-blue-500 transition-all"
                                        value={loginPassword}
                                        onChange={e => setLoginPassword(e.target.value)}
                                    />
                                    <Lock size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600" />
                                </div>
                            </div>

                            <button 
                                type="submit"
                                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-blue-500/20"
                            >
                                Ingresar al Panel Maestro
                            </button>
                        </form>

                        <div className="pt-4 border-t border-slate-900 flex justify-center">
                            <button 
                                onClick={() => window.location.href = '/dashboard'}
                                className="text-slate-500 hover:text-slate-300 text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-colors"
                            >
                                <ArrowRight size={14} className="rotate-180" /> Regresar a Lidus
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- MAIN COMMAND CENTER DASHBOARD RENDER ---
    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col">
            
            {/* Top Command Bar */}
            <header className="bg-slate-900 border-b border-slate-800/80 px-8 py-5 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/20">
                        L
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg font-black tracking-tight uppercase">Soporte & Control Maestro</h1>
                            <span className="bg-blue-950 text-blue-400 text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-blue-900">
                                Soporte Permanente
                            </span>
                        </div>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Limitless Solutions Support Center</p>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                    <button 
                        onClick={() => setActiveTab('companies')}
                        className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'companies' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        <Building2 size={12} /> Clientes & Suscripciones
                    </button>
                    <button 
                        onClick={() => setActiveTab('support')}
                        className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 relative ${activeTab === 'support' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        <Headset size={12} /> Soporte en Vivo
                        {pendingRequests.length > 0 && (
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                        )}
                    </button>
                    <button 
                        onClick={() => setActiveTab('audit')}
                        className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'audit' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        <Settings size={12} /> Estructura Auditoría
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => window.location.href = '/dashboard'}
                        className="text-slate-400 hover:text-white text-xs font-bold uppercase tracking-wider bg-slate-950 border border-slate-800 px-4 py-2 rounded-lg transition-colors"
                    >
                        Ir a la plataforma
                    </button>
                    <button 
                        onClick={handleLogout}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2.5 rounded-xl transition-all"
                        title="Cerrar Sesión Maestro"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </header>

            {/* Dashboard Workspace */}
            <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
                
                {/* 🏢 TAB: COMPANIES & SUBSCRIPTIONS */}
                {activeTab === 'companies' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <div>
                            <h2 className="text-2xl font-black tracking-tight">Directorio de Clientes Activos</h2>
                            <p className="text-slate-500 text-xs mt-1 font-medium">Visualiza empresas dadas de alta, sus usuarios asociados y sus planes de facturación actuales.</p>
                        </div>

                        {loadingCompanies ? (
                            <div className="py-20 flex flex-col items-center justify-center">
                                <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-4">Consultando empresas y usuarios...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6">
                                {companies.map(comp => (
                                    <div key={comp.id} className="bg-slate-900 border border-slate-800/80 rounded-[1.8rem] p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-slate-700 transition-all">
                                        <div className="space-y-4 max-w-md">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-slate-850 border border-slate-800 rounded-2xl flex items-center justify-center text-blue-400">
                                                    <Building2 size={20} />
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-slate-100 text-lg">{comp.name}</h3>
                                                    <p className="text-slate-500 text-[10px] font-bold tracking-wider">NIT: {comp.nit} • ID: {comp.id}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <h4 className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-1">Usuarios ({comp.users.length})</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {comp.users.length === 0 ? (
                                                        <span className="text-slate-600 text-xs italic">Sin usuarios creados</span>
                                                    ) : (
                                                        comp.users.map(u => (
                                                            <div key={u.id} className="px-3 py-1 bg-slate-950 border border-slate-850/80 rounded-lg text-xs font-semibold text-slate-300 flex items-center gap-2">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                                {u.email} <span className="text-[9px] uppercase text-slate-500 font-bold">({u.role})</span>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </div>

                                            {/* Onboarding Profile collapsible */}
                                            <div className="pt-2">
                                                {comp.profile ? (
                                                    <>
                                                        <button 
                                                            onClick={() => setExpandedOnboardings(prev => ({ ...prev, [comp.id]: !prev[comp.id] }))}
                                                            className="text-[9px] font-black uppercase text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors outline-none"
                                                        >
                                                            {expandedOnboardings[comp.id] ? 'Ocultar Ficha Onboarding' : 'Ver Ficha Onboarding'}
                                                            <ChevronRight size={10} className={`transform transition-transform ${expandedOnboardings[comp.id] ? 'rotate-90' : ''}`} />
                                                        </button>
                                                        
                                                        {expandedOnboardings[comp.id] && (
                                                            <div className="mt-3 p-4 bg-slate-950/50 rounded-2xl border border-slate-850/70 grid grid-cols-2 gap-x-6 gap-y-3 text-[11px] animate-in fade-in slide-in-from-top-2 duration-200">
                                                                <div className="space-y-0.5">
                                                                    <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest">Sector Actividad</span>
                                                                    <span className="font-bold text-slate-300">{comp.profile.sectorActividad || 'No especificado'}</span>
                                                                </div>
                                                                <div className="space-y-0.5">
                                                                    <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest">Ciudad</span>
                                                                    <span className="font-bold text-slate-300">{comp.profile.ciudad || 'No especificada'}</span>
                                                                </div>
                                                                <div className="space-y-0.5 col-span-2 border-t border-slate-850/40 pt-1.5">
                                                                    <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest">Dirección</span>
                                                                    <span className="font-bold text-slate-300">{comp.profile.direccion || 'No especificada'}</span>
                                                                </div>
                                                                <div className="space-y-0.5 border-t border-slate-850/40 pt-1.5">
                                                                    <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest">Teléfono</span>
                                                                    <span className="font-bold text-slate-300">{comp.profile.telefono || 'No especificado'}</span>
                                                                </div>
                                                                <div className="space-y-0.5 border-t border-slate-850/40 pt-1.5">
                                                                    <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest">Email Corporativo</span>
                                                                    <span className="font-bold text-slate-300">{comp.profile.email || 'No especificado'}</span>
                                                                </div>
                                                                {comp.profile.sitioWeb && (
                                                                    <div className="space-y-0.5 col-span-2 border-t border-slate-850/40 pt-1.5">
                                                                        <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest">Sitio Web</span>
                                                                        <a 
                                                                            href={comp.profile.sitioWeb.startsWith('http') ? comp.profile.sitioWeb : `https://${comp.profile.sitioWeb}`} 
                                                                            target="_blank" 
                                                                            rel="noopener noreferrer" 
                                                                            className="font-bold text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                                                                        >
                                                                            {comp.profile.sitioWeb}
                                                                        </a>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </>
                                                ) : (
                                                    <span className="text-[8px] font-black uppercase text-slate-600 italic tracking-wider">Perfil Onboarding Pendiente</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Subscription details */}
                                        <div className="bg-slate-950/60 border border-slate-850 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center gap-6 lg:min-w-[400px]">
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <CreditCard size={14} className="text-blue-500" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Suscripción</span>
                                                </div>
                                                <p className="font-black text-sm text-slate-100">{comp.subscription?.plan || 'Mensual Total'}</p>
                                                <div className="flex items-center gap-1.5">
                                                    <span className={`w-1.5 h-1.5 rounded-full ${comp.subscription?.estado === 'ACTIVO' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                                                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-wide">
                                                        {comp.subscription?.estado || 'ACTIVO'} {comp.subscription?.fechaFin && `(Hasta: ${new Date(comp.subscription.fechaFin).toLocaleDateString()})`}
                                                    </p>
                                                </div>
                                            </div>

                                            <button 
                                                onClick={() => openSubscriptionModal(comp)}
                                                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                                            >
                                                Ajustar Licencia
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* 🎧 TAB: SUPPORT CHANNEL */}
                {activeTab === 'support' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-black tracking-tight">Centro de Soporte en Vivo</h2>
                                <p className="text-slate-500 text-xs mt-1 font-medium">Asiste de forma permanente e interactúa con tus usuarios de Lidus por WebSockets o atiende sus tickets.</p>
                            </div>
                            <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
                                <button 
                                    onClick={() => setSupportActiveTab('chats')}
                                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${supportActiveTab === 'chats' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                                >
                                    Chats Activos ({pendingRequests.length})
                                </button>
                                <button 
                                    onClick={() => { setSupportActiveTab('tickets'); fetchTickets(); }}
                                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${supportActiveTab === 'tickets' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                                >
                                    Tickets Fallback ({tickets.length})
                                </button>
                            </div>
                        </div>

                        {supportActiveTab === 'chats' && (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                {/* Queue list */}
                                <div className="lg:col-span-4 bg-slate-900 border border-slate-800/80 rounded-[1.8rem] flex flex-col h-[550px]">
                                    <div className="p-5 border-b border-slate-800 bg-slate-900/50">
                                        <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                            <Clock size={14} className="text-amber-500 animate-pulse" /> Solicitudes en espera
                                        </h3>
                                    </div>
                                    <div className="p-4 flex-1 overflow-y-auto space-y-3">
                                        {pendingRequests.length === 0 ? (
                                            <div className="text-center text-slate-500 py-16">
                                                <MessageSquare size={32} className="mx-auto mb-2 opacity-30 text-blue-400" />
                                                <p className="text-xs font-bold uppercase tracking-wider">Sin solicitudes activas</p>
                                                <p className="text-[10px] text-slate-600 mt-1 font-medium">Los usuarios del chat IA de Lidus aparecerán aquí cuando pidan hablar con un humano.</p>
                                            </div>
                                        ) : (
                                            pendingRequests.map(req => (
                                                <div key={req.userId} className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex items-center justify-between gap-4">
                                                    <div className="min-w-0">
                                                        <p className="font-black text-slate-200 text-xs truncate">{req.userName}</p>
                                                        <p className="text-[9px] text-slate-500 font-bold truncate">Empresa: {req.companyId}</p>
                                                    </div>
                                                    <button 
                                                        onClick={() => acceptChat(req)}
                                                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[9px] font-black uppercase tracking-widest rounded-lg transition-all"
                                                    >
                                                        Atender
                                                    </button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Live interaction window */}
                                <div className="lg:col-span-8 bg-slate-900 border border-slate-800/80 rounded-[1.8rem] flex flex-col h-[550px] overflow-hidden">
                                    {activeChat ? (
                                        <>
                                            <div className="p-4 border-b border-slate-850 bg-slate-950/40 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 bg-blue-950 text-blue-400 rounded-xl flex items-center justify-center">
                                                        <User size={18} />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-black text-sm text-slate-200 leading-none">{activeChat.userName}</h3>
                                                        <p className="text-[9px] text-slate-500 font-bold mt-1">CLIENTE ID: {activeChat.companyId}</p>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => setActiveChat(null)} 
                                                    className="p-1.5 bg-slate-950 border border-slate-850 text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-all"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>

                                            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-950/30">
                                                {activeChat.messages.map((m, i) => (
                                                    <div key={i} className={`flex ${m.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
                                                        <div className={`max-w-[70%] p-3 px-4 rounded-[1.3rem] text-xs font-semibold ${
                                                            m.sender === 'agent' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-900 border border-slate-800 text-slate-300 rounded-tl-none'
                                                        }`}>
                                                            {m.text}
                                                        </div>
                                                    </div>
                                                ))}
                                                {activeChat.messages.length === 0 && (
                                                    <div className="text-center text-slate-500 mt-20 text-xs font-medium">
                                                        Canal de Soporte Permanente establecido. Escribe tu saludo para iniciar.
                                                    </div>
                                                )}
                                            </div>

                                            <form onSubmit={sendChatMessage} className="p-4 border-t border-slate-850 bg-slate-900/50">
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={chatInput}
                                                        onChange={e => setChatInput(e.target.value)}
                                                        placeholder="Escribe el mensaje de ayuda de Lidus..."
                                                        className="w-full pl-4 pr-12 py-3.5 bg-slate-950 border border-slate-850 rounded-xl text-xs font-bold text-white outline-none focus:border-blue-500 transition-all"
                                                    />
                                                    <button 
                                                        type="submit"
                                                        disabled={!chatInput.trim()}
                                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-40 transition-all"
                                                    >
                                                        <Send size={14} />
                                                    </button>
                                                </div>
                                            </form>
                                        </>
                                    ) : (
                                        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8 text-center">
                                            <MessageSquare size={48} className="mb-4 opacity-10 text-blue-500" />
                                            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Canal Desconectado</p>
                                            <p className="text-[10px] text-slate-600 max-w-sm mt-1.5 font-medium">Selecciona un usuario de la bandeja de espera a la izquierda para iniciar soporte bidireccional mediante sockets en vivo.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {supportActiveTab === 'tickets' && (
                            <div className="bg-slate-900 border border-slate-800/85 rounded-[1.8rem] overflow-hidden">
                                <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
                                    <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                        <Ticket size={16} className="text-blue-500" /> Historial de Tickets Fallback
                                    </h3>
                                    <button onClick={fetchTickets} className="text-[10px] font-black uppercase text-blue-400 hover:text-blue-300">Actualizar</button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-950 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-850">
                                                <th className="p-4 pl-6">Código</th>
                                                <th className="p-4">Empresa</th>
                                                <th className="p-4">Asunto</th>
                                                <th className="p-4">Estado</th>
                                                <th className="p-4 pr-6">Fecha de Envío</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-850/60 text-xs">
                                            {tickets.length === 0 ? (
                                                <tr>
                                                    <td colSpan={5} className="p-10 text-center text-slate-600 font-semibold">No se han registrado tickets fallback globales.</td>
                                                </tr>
                                            ) : (
                                                tickets.map(t => (
                                                    <tr key={t.id} className="hover:bg-slate-950/20 transition-all">
                                                        <td className="p-4 pl-6 font-black text-slate-400">{t.ticket_code}</td>
                                                        <td className="p-4 text-slate-500">{t.company_id}</td>
                                                        <td className="p-4 text-slate-200 font-bold max-w-xs truncate">{t.subject}</td>
                                                        <td className="p-4">
                                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                                                t.status === 'OPEN' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                            }`}>
                                                                {t.status}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 pr-6 text-slate-500 font-bold">
                                                            {t.created_at && !isNaN(new Date(t.created_at).getTime())
                                                                ? new Date(t.created_at).toLocaleDateString()
                                                                : 'N/A'}
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* 📋 TAB: AUDIT STANDARDS STRUCTURING */}
                {activeTab === 'audit' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        {/* Header Audit Structuring */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900 border border-slate-800/80 p-6 rounded-[1.8rem] gap-4">
                            <div>
                                <h2 className="text-xl font-black tracking-tight">Estructurador Maestro de Auditorías</h2>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">Configuración Estándar para Normas de Certificación</p>
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setIsCatModalOpen(true)}
                                    className="bg-slate-950 border border-slate-800 text-slate-300 hover:text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all"
                                >
                                    <Tags size={16} /> Gestionar Categorías
                                </button>
                                <button 
                                    onClick={() => { setEditingStd({}); setIsStdModalOpen(true); }}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all"
                                >
                                    <Plus size={16} /> Nueva Norma
                                </button>
                            </div>
                        </div>

                        {/* Breadcrumbs Navigation */}
                        <div className="flex items-center gap-2 bg-slate-900/60 p-2 rounded-xl border border-slate-850/80 w-fit">
                            <button 
                                onClick={() => { setAuditView('STANDARDS'); setSelectedStd(null); setSelectedChap(null); }}
                                className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${auditView === 'STANDARDS' ? 'bg-slate-800 text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                Normas
                            </button>
                            {selectedStd && (
                                <>
                                    <ChevronRight size={12} className="text-slate-700" />
                                    <button 
                                        onClick={() => { setAuditView('CHAPTERS'); setSelectedChap(null); }}
                                        className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${auditView === 'CHAPTERS' ? 'bg-slate-800 text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
                                    >
                                        {selectedStd.code}
                                    </button>
                                </>
                            )}
                            {selectedChap && (
                                <>
                                    <ChevronRight size={12} className="text-slate-700" />
                                    <button 
                                        className="px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest bg-slate-800 text-blue-400"
                                    >
                                        Cap. {selectedChap.chapterNumber}
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Audit Structure View Grid */}
                        <div className="grid grid-cols-1 gap-6">
                            
                            {/* Grouped Standards Listing */}
                            {auditView === 'STANDARDS' && (
                                <div className="space-y-12">
                                    {groupedStandards.map(group => (
                                        <div key={group.category} className="space-y-5">
                                            <div className="flex items-center gap-3 border-b border-slate-850 pb-2.5">
                                                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-lg shadow-blue-500/20"></span>
                                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-300 leading-none">{group.category}</h3>
                                                <span className="text-[9px] bg-slate-900 border border-slate-850 text-slate-500 px-2.5 py-0.5 rounded-full font-bold">
                                                    {group.standards.length} {group.standards.length === 1 ? 'norma' : 'normas'}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                                {group.standards.map(std => (
                                                    <div key={std.id} className="group bg-slate-900 rounded-[1.8rem] border border-slate-850/80 p-6 hover:border-slate-700 transition-all relative overflow-hidden flex flex-col justify-between">
                                                        <div className="absolute top-0 right-0 p-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button onClick={() => { setEditingStd(std); setIsStdModalOpen(true); }} className="p-2 bg-slate-800 hover:bg-blue-600 rounded-lg text-slate-300 hover:text-white transition-all">
                                                                <Edit2 size={12} />
                                                            </button>
                                                            <button onClick={() => deleteStandard(std.id)} className="p-2 bg-slate-800 hover:bg-red-600 rounded-lg text-slate-300 hover:text-white transition-all">
                                                                <Trash2 size={12} />
                                                            </button>
                                                        </div>
                                                        <div>
                                                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6 shadow-md" style={{ backgroundColor: std.color }}>
                                                                <Folder size={24} />
                                                            </div>
                                                            <div className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: std.color }}>{std.category}</div>
                                                            <h3 className="text-base font-black text-slate-100 leading-tight mb-2">{std.name}</h3>
                                                            <p className="text-xs text-slate-500 font-medium line-clamp-2 mb-6">{std.description}</p>
                                                        </div>
                                                        <button 
                                                            onClick={() => handleSelectStd(std)}
                                                            className="w-full py-3 bg-slate-950 hover:bg-blue-600 hover:text-white text-slate-300 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-slate-850"
                                                        >
                                                            Configurar Estructura <ArrowRight size={12} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Chapters Listing */}
                            {auditView === 'CHAPTERS' && selectedStd && (
                                <div className="bg-slate-900 rounded-[1.8rem] border border-slate-850 p-8 space-y-8">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h2 className="text-xl font-black text-slate-100">Capítulos de {selectedStd.name}</h2>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Niveles de Norma</p>
                                        </div>
                                        <button className="bg-slate-800 text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2">
                                            <Plus size={14} /> Añadir Capítulo
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {chapters.map(chap => (
                                            <div key={chap.id} className="p-5 bg-slate-950 rounded-2xl border border-slate-850 flex items-center justify-between group hover:border-slate-700 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-9 h-9 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center font-black text-slate-400 text-xs">
                                                        {chap.chapterNumber}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xs font-black text-slate-200 uppercase tracking-tight">{chap.title}</h4>
                                                        <p className="text-[9px] font-bold text-slate-600">Requisitos contenidos</p>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => handleSelectChap(chap)}
                                                    className="p-2.5 bg-slate-900 border border-slate-850 text-slate-500 rounded-xl group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 transition-all"
                                                >
                                                    <ChevronRight size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Requirements Listing */}
                            {auditView === 'REQUIREMENTS' && selectedChap && (
                                <div className="bg-slate-900 rounded-[1.8rem] border border-slate-850 p-8 space-y-8">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h2 className="text-xl font-black text-slate-100">Capítulo {selectedChap.chapterNumber}</h2>
                                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">{selectedChap.title}</h3>
                                        </div>
                                        <button className="bg-slate-800 text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2">
                                            <Plus size={14} /> Nuevo Requisito
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        {requirements.map(req => (
                                            <div key={req.id} className="p-4 bg-slate-950 rounded-xl border border-slate-850 flex items-center justify-between group hover:border-slate-700 transition-all">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-16 font-black text-blue-500 text-xs">{req.code}</div>
                                                    <div>
                                                        <h4 className="text-xs font-black text-slate-200 uppercase tracking-tight">{req.title}</h4>
                                                        <div className="flex gap-3 mt-1.5">
                                                            <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${req.isAuditable ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-500'}`}>
                                                                {req.isAuditable ? 'Auditable' : 'Informativo'}
                                                            </span>
                                                            <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Peso: {req.weight}%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button className="p-2 text-slate-600 hover:text-blue-500 transition-colors"><Edit2 size={14} /></button>
                                                    <button className="p-2 text-slate-600 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                )}

            </main>

            {/* --- MODAL: EDIT AUDIT STANDARD --- */}
            {isStdModalOpen && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="px-8 py-6 border-b border-slate-850 flex justify-between items-center bg-slate-950/25">
                            <h2 className="text-lg font-black text-slate-200 tracking-tight">{editingStd?.id ? 'Editar Norma Maestro' : 'Nueva Norma Maestro'}</h2>
                            <button onClick={() => setIsStdModalOpen(false)} className="p-2 hover:bg-slate-800 rounded-xl transition-all text-slate-400 hover:text-white"><X size={18} /></button>
                        </div>
                        <form onSubmit={handleSaveStandard} className="p-8 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Código (Ej: ISO9001)</label>
                                    <input 
                                        required 
                                        className="w-full p-3 bg-slate-950 border border-slate-850 rounded-xl text-xs font-bold text-white outline-none focus:border-blue-500 transition-all" 
                                        value={editingStd?.code || ''}
                                        onChange={e => setEditingStd({...editingStd, code: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Color Identificador</label>
                                    <input 
                                        type="color" 
                                        className="w-full h-[40px] p-1 bg-slate-950 border border-slate-200 rounded-xl outline-none" 
                                        value={editingStd?.color || '#3b82f6'}
                                        onChange={e => setEditingStd({...editingStd, color: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Nombre Corto</label>
                                <input 
                                    required 
                                    className="w-full p-3 bg-slate-950 border border-slate-850 rounded-xl text-xs font-bold text-white outline-none focus:border-blue-500 transition-all" 
                                    value={editingStd?.name || ''}
                                    onChange={e => setEditingStd({...editingStd, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Categoría General</label>
                                <select 
                                    required 
                                    className="w-full p-3 bg-slate-950 border border-slate-850 rounded-xl text-xs font-bold text-white outline-none focus:border-blue-500 transition-all" 
                                    value={editingStd?.category || ''}
                                    onChange={e => setEditingStd({...editingStd, category: e.target.value})}
                                >
                                    <option value="">Selecciona una categoría...</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Descripción</label>
                                <textarea 
                                    rows={3}
                                    className="w-full p-3 bg-slate-950 border border-slate-850 rounded-xl text-xs font-bold text-white outline-none focus:border-blue-500 transition-all resize-none" 
                                    value={editingStd?.description || ''}
                                    onChange={e => setEditingStd({...editingStd, description: e.target.value})}
                                />
                            </div>
                            <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black uppercase tracking-widest text-[9px] shadow-lg shadow-blue-500/20 transition-all">
                                Guardar Norma de Auditoría
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* --- MODAL: EDIT COMPANY SUBSCRIPTION --- */}
            {isSubModalOpen && selectedCompany && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="px-8 py-6 border-b border-slate-850 flex justify-between items-center bg-slate-950/25">
                            <div>
                                <h2 className="text-base font-black text-slate-200 tracking-tight">Licenciar Empresa</h2>
                                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{selectedCompany.name}</p>
                            </div>
                            <button onClick={() => setIsSubModalOpen(false)} className="p-2 hover:bg-slate-800 rounded-xl transition-all text-slate-400 hover:text-white"><X size={18} /></button>
                        </div>
                        <form onSubmit={handleUpdateSubscription} className="p-8 space-y-5">
                            <div>
                                <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Nivel del Plan de Suscripción</label>
                                <select 
                                    className="w-full p-3 bg-slate-950 border border-slate-850 rounded-xl text-xs font-bold text-white outline-none focus:border-blue-500 transition-all"
                                    value={editingSub.plan}
                                    onChange={e => setEditingSub({...editingSub, plan: e.target.value})}
                                >
                                    <option value="Mensual Total">Mensual Total (Acceso Completo)</option>
                                    <option value="SaaS Básico">SaaS Básico (SST & Gestión Humana)</option>
                                    <option value="SaaS Premium">SaaS Premium (Estrategia, SST & Calidad)</option>
                                    <option value="Demo Lidus">Plan Demo Limitado</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Estado de Licenciamiento</label>
                                <select 
                                    className="w-full p-3 bg-slate-950 border border-slate-850 rounded-xl text-xs font-bold text-white outline-none focus:border-blue-500 transition-all"
                                    value={editingSub.estado}
                                    onChange={e => setEditingSub({...editingSub, estado: e.target.value})}
                                >
                                    <option value="ACTIVO">ACTIVO (Acceso Autorizado)</option>
                                    <option value="INACTIVO">INACTIVO (Acceso Bloqueado)</option>
                                    <option value="VENCIDO">VENCIDO (Requiere Pago)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Fecha de Expiración (Opcional)</label>
                                <input 
                                    type="date"
                                    className="w-full p-3 bg-slate-950 border border-slate-850 rounded-xl text-xs font-bold text-white outline-none focus:border-blue-500 transition-all"
                                    value={editingSub.fechaFin}
                                    onChange={e => setEditingSub({...editingSub, fechaFin: e.target.value})}
                                />
                            </div>

                            <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black uppercase tracking-widest text-[9px] shadow-lg shadow-blue-500/20 transition-all">
                                Guardar Configuración de Plan
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* --- MODAL: CATEGORY MANAGEMENT --- */}
            {isCatModalOpen && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="px-8 py-6 border-b border-slate-850 flex justify-between items-center bg-slate-950/25">
                            <h2 className="text-lg font-black text-slate-200 tracking-tight flex items-center gap-2">
                                <Tags size={20} className="text-blue-500" /> Administrar Categorías
                            </h2>
                            <button onClick={() => setIsCatModalOpen(false)} className="p-2 hover:bg-slate-800 rounded-xl transition-all text-slate-400 hover:text-white"><X size={18} /></button>
                        </div>
                        <div className="p-8 space-y-6">
                            {/* Create Form */}
                            <form onSubmit={handleCreateCategory} className="flex gap-2">
                                <input 
                                    required 
                                    placeholder="Nueva Categoría (ej: Seguridad Vial)"
                                    className="flex-1 p-3 bg-slate-950 border border-slate-850 rounded-xl text-xs font-bold text-white outline-none focus:border-blue-500 transition-all" 
                                    value={newCatName}
                                    onChange={e => setNewCatName(e.target.value)}
                                />
                                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 rounded-xl font-black uppercase tracking-widest text-[9px] transition-all flex items-center gap-1">
                                    <Plus size={14} /> Crear
                                </button>
                            </form>

                            {/* Categories List */}
                            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                                {categories.length === 0 ? (
                                    <p className="text-center text-slate-500 text-xs italic py-8">No hay categorías registradas.</p>
                                ) : (
                                    categories.map(cat => (
                                        <div key={cat.id} className="p-3 bg-slate-950 border border-slate-850 rounded-xl flex items-center justify-between gap-4 transition-all">
                                            {editingCatId === cat.id ? (
                                                <div className="flex-1 flex gap-2">
                                                    <input 
                                                        required 
                                                        className="flex-1 p-1 px-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-bold text-white outline-none focus:border-blue-500 transition-all" 
                                                        value={editingCatName}
                                                        onChange={e => setEditingCatName(e.target.value)}
                                                    />
                                                    <button 
                                                        onClick={() => handleUpdateCategory(cat.id)}
                                                        className="p-1.5 bg-emerald-600/15 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-600 hover:text-white rounded-lg transition-all"
                                                    >
                                                        <Check size={14} />
                                                    </button>
                                                    <button 
                                                        onClick={() => { setEditingCatId(null); setEditingCatName(''); }}
                                                        className="p-1.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-lg transition-all"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <span className="text-xs font-bold text-slate-200">{cat.name}</span>
                                                    <div className="flex gap-1.5">
                                                        <button 
                                                            onClick={() => { setEditingCatId(cat.id); setEditingCatName(cat.name); }}
                                                            className="p-1.5 bg-slate-900 border border-slate-850 text-slate-400 hover:text-white rounded-lg transition-all"
                                                        >
                                                            <Edit2 size={12} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteCategory(cat.id)}
                                                            className="p-1.5 bg-slate-900 border border-slate-850 text-slate-400 hover:text-red-400 hover:border-red-500/20 rounded-lg transition-all"
                                                        >
                                                            <Trash2 size={12} />
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
