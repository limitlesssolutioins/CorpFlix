'use client';

import React, { useState, useEffect } from 'react';
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
    Shield
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

export default function ControlMaestroPage() {
    const [standards, setStandards] = useState<Standard[]>([]);
    const [selectedStd, setSelectedStd] = useState<Standard | null>(null);
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [selectedChap, setSelectedChap] = useState<Chapter | null>(null);
    const [requirements, setRequirements] = useState<Requirement[]>([]);
    const [selectedReq, setSelectedReq] = useState<Requirement | null>(null);
    const [variables, setVariables] = useState<Variable[]>([]);
    
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState<'STANDARDS' | 'CHAPTERS' | 'REQUIREMENTS'>('STANDARDS');

    // Modals & Editing
    const [isStdModalOpen, setIsStdModalOpen] = useState(false);
    const [editingStd, setEditingStd] = useState<Partial<Standard> | null>(null);

    useEffect(() => {
        fetchStandards();
    }, []);

    const fetchStandards = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/audit-master/standards');
            setStandards(await res.json());
        } finally {
            setLoading(false);
        }
    };

    const fetchChapters = async (stdId: number) => {
        const res = await fetch(`/api/admin/audit-master/chapters?standardId=${stdId}`);
        setChapters(await res.json());
    };

    const fetchRequirements = async (chapId: number) => {
        const res = await fetch(`/api/admin/audit-master/requirements?chapterId=${chapId}`);
        setRequirements(await res.json());
    };

    const fetchVariables = async (reqId: number) => {
        const res = await fetch(`/api/admin/audit-master/variables?requirementId=${reqId}`);
        setVariables(await res.json());
    };

    const handleSelectStd = (std: Standard) => {
        setSelectedStd(std);
        setSelectedChap(null);
        setSelectedReq(null);
        fetchChapters(std.id);
        setView('CHAPTERS');
    };

    const handleSelectChap = (chap: Chapter) => {
        setSelectedChap(chap);
        setSelectedReq(null);
        fetchRequirements(chap.id);
        setView('REQUIREMENTS');
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
            toast.success('Norma guardada');
            setIsStdModalOpen(false);
            fetchStandards();
        }
    };

    const deleteStandard = async (id: number) => {
        if (!confirm('¿Seguro? Se borrará todo lo contenido en esta norma.')) return;
        await fetch(`/api/admin/audit-master/standards?id=${id}`, { method: 'DELETE' });
        fetchStandards();
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header Control Maestro */}
            <div className="bg-white border-b border-slate-200 px-8 py-6">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                            <Settings size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Control Maestro</h1>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Administración de Estructura de Auditoría</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => { setEditingStd({}); setIsStdModalOpen(true); }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20"
                        >
                            <Plus size={18} /> Nueva Norma
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 mt-10">
                
                {/* Breadcrumbs Navigation */}
                <div className="flex items-center gap-3 mb-8 bg-white/50 p-2 rounded-2xl border border-slate-200/50 w-fit">
                    <button 
                        onClick={() => { setView('STANDARDS'); setSelectedStd(null); setSelectedChap(null); }}
                        className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'STANDARDS' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Normas
                    </button>
                    {selectedStd && (
                        <>
                            <ChevronRight size={14} className="text-slate-300" />
                            <button 
                                onClick={() => { setView('CHAPTERS'); setSelectedChap(null); }}
                                className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'CHAPTERS' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                {selectedStd.code}
                            </button>
                        </>
                    )}
                    {selectedChap && (
                        <>
                            <ChevronRight size={14} className="text-slate-300" />
                            <button 
                                className="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-white text-blue-600 shadow-sm"
                            >
                                Cap. {selectedChap.chapterNumber}
                            </button>
                        </>
                    )}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* View: STANDARDS */}
                    {view === 'STANDARDS' && (
                        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {standards.map(std => (
                                <div key={std.id} className="group bg-white rounded-[2rem] border border-slate-100 p-6 hover:shadow-xl transition-all relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => { setEditingStd(std); setIsStdModalOpen(true); }} className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
                                            <Edit2 size={14} />
                                        </button>
                                        <button onClick={() => deleteStandard(std.id)} className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-red-600 hover:text-white transition-all">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg" style={{ backgroundColor: std.color }}>
                                        <Folder size={28} />
                                    </div>
                                    <div className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: std.color }}>{std.category}</div>
                                    <h3 className="text-lg font-black text-slate-900 leading-tight mb-4">{std.name}</h3>
                                    <p className="text-xs text-slate-500 font-medium line-clamp-2 mb-6">{std.description}</p>
                                    <button 
                                        onClick={() => handleSelectStd(std)}
                                        className="w-full py-3 bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                                    >
                                        Gestionar Estructura <ArrowRight size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* View: CHAPTERS */}
                    {view === 'CHAPTERS' && selectedStd && (
                        <div className="lg:col-span-12 bg-white rounded-[2.5rem] border border-slate-100 p-10">
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900">Capítulos de {selectedStd.name}</h2>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Estructura de la Norma</p>
                                </div>
                                <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2">
                                    <Plus size={18} /> Añadir Capítulo
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {chapters.map(chap => (
                                    <div key={chap.id} className="p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-lg transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center font-black text-slate-400 text-sm">
                                                {chap.chapterNumber}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">{chap.title}</h4>
                                                <p className="text-[10px] font-bold text-slate-400">Requisitos asociados</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleSelectChap(chap)}
                                            className="p-3 bg-white text-slate-400 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm"
                                        >
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* View: REQUIREMENTS */}
                    {view === 'REQUIREMENTS' && selectedChap && (
                        <div className="lg:col-span-12 bg-white rounded-[2.5rem] border border-slate-100 p-10">
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900">Capítulo {selectedChap.chapterNumber}</h2>
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">{selectedChap.title}</h3>
                                </div>
                                <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2">
                                    <Plus size={18} /> Nuevo Requisito
                                </button>
                            </div>
                            <div className="space-y-3">
                                {requirements.map(req => (
                                    <div key={req.id} className="p-5 bg-slate-50 rounded-[1.2rem] border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-md transition-all">
                                        <div className="flex items-center gap-5">
                                            <div className="w-16 font-black text-blue-600 text-xs">{req.code}</div>
                                            <div>
                                                <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight">{req.title}</h4>
                                                <div className="flex gap-3 mt-1">
                                                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${req.isAuditable ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
                                                        {req.isAuditable ? 'Auditable' : 'Informativo'}
                                                    </span>
                                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Peso: {req.weight}%</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="p-2 text-slate-300 hover:text-blue-600 transition-colors"><Edit2 size={16} /></button>
                                            <button className="p-2 text-slate-300 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Modal: Standard Edit */}
            {isStdModalOpen && (
                <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">{editingStd?.id ? 'Editar Norma' : 'Nueva Norma'}</h2>
                            <button onClick={() => setIsStdModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-all"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSaveStandard} className="p-10 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Código (Ej: ISO9001)</label>
                                    <input 
                                        required 
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-blue-500" 
                                        value={editingStd?.code || ''}
                                        onChange={e => setEditingStd({...editingStd, code: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Color</label>
                                    <input 
                                        type="color" 
                                        className="w-full h-[46px] p-1 bg-slate-50 border border-slate-200 rounded-xl outline-none" 
                                        value={editingStd?.color || '#3b82f6'}
                                        onChange={e => setEditingStd({...editingStd, color: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Nombre Corto</label>
                                <input 
                                    required 
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-blue-500" 
                                    value={editingStd?.name || ''}
                                    onChange={e => setEditingStd({...editingStd, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Categoría</label>
                                <input 
                                    required 
                                    placeholder="Ej: Calidad, Seguridad y Salud..."
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-blue-500" 
                                    value={editingStd?.category || ''}
                                    onChange={e => setEditingStd({...editingStd, category: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Descripción</label>
                                <textarea 
                                    rows={3}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-blue-500 resize-none" 
                                    value={editingStd?.description || ''}
                                    onChange={e => setEditingStd({...editingStd, description: e.target.value})}
                                />
                            </div>
                            <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">
                                Guardar Norma Maestro
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
