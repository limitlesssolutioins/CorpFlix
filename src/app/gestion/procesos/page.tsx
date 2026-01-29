'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
    FaPlus,
    FaSitemap,
    FaArrowRight,
    FaUserTie,
    FaCogs,
    FaTrash,
    FaRobot,
    FaChessKing,
    FaRocket,
    FaHandsHelping,
    FaChartPie,
    FaMagic,
    FaPen,
    FaSave
} from 'react-icons/fa';
import { ProcessGeneratorModal, Process } from '@/components/ProcessGeneratorModal';
import { ManualProcessModal } from '@/components/ManualProcessModal';
import { ProcessAIWizard } from '@/components/ProcessAIWizard';

export default function ProcesosPage() {
    const router = useRouter();
    const [processes, setProcesses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
    const [isManualOpen, setIsManualOpen] = useState(false);
    const [manualType, setManualType] = useState<string>('MISIONAL');

    // AI Wizard State
    const [wizardOpen, setWizardOpen] = useState(false);
    const [wizardType, setWizardType] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        fetchProcesses();
    }, []);

    const fetchProcesses = async () => {
        try {
            const res = await axios.get('/api/gestion/procesos');
            const localProcesses = JSON.parse(localStorage.getItem('processes') || '[]');
            const apiProcesses = res.data || [];
            const combined = [...apiProcesses, ...localProcesses.filter((lp: any) => !apiProcesses.find((ap: any) => ap.id === lp.id))];
            setProcesses(combined);
        } catch (error) {
            toast.error('Error cargando procesos');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`¿Eliminar proceso "${name}"?`)) return;

        try {
            // Try deleting from API
            await axios.delete(`/api/gestion/procesos?id=${id}`);
        } catch (error) {
            console.warn('Could not delete from API, might be local only');
        }

        const newLocal = processes.filter(p => p.id !== id);
        // Update local storage to ensure sync
        const currentLocalStorage = JSON.parse(localStorage.getItem('processes') || '[]');
        const newLocalStorage = currentLocalStorage.filter((p: any) => p.id !== id);

        localStorage.setItem('processes', JSON.stringify(newLocalStorage));
        setProcesses(newLocal);
        toast.success('Proceso eliminado');
    };

    const handleGeneratorComplete = async (newProcesses: Process[]) => {
        try {
            await axios.post('/api/gestion/procesos', newProcesses);
            toast.success(`${newProcesses.length} procesos creados correctamente`);
            setIsGeneratorOpen(false);
            fetchProcesses();
        } catch (error) {
            console.error(error);
            toast.error('Error al guardar procesos generados');
        }
    };

    const handleManualSave = async (process: Process) => {
        try {
            await axios.post('/api/gestion/procesos', process);
            toast.success(`Proceso "${process.nombre}" creado`);
            setIsManualOpen(false);
            fetchProcesses();
        } catch (error) {
            toast.error('Error al crear proceso');
        }
    };

    const handleUpdate = async (updatedProcess: Process) => {
        try {
            await axios.put('/api/gestion/procesos', updatedProcess);
            toast.success('Proceso actualizado');
            fetchProcesses();
        } catch (error) {
            toast.error('Error al actualizar proceso');
        }
    };

    const openManualModal = (type: string) => {
        setManualType(type);
        setIsManualOpen(true);
    };

    const handleWizardGenerate = async (answers: Record<string, string>) => {
        setIsGenerating(true);
        try {
            // We can get the company description from local context or a generic one if not set
            const companyInfo = JSON.parse(localStorage.getItem('company_context') || '{"description": "Empresa en crecimiento"}');

            const res = await axios.post('/api/generate-process-list', {
                type: wizardType,
                context: companyInfo.description,
                answers,
                existingProcesses: processes.filter(p => p.tipo === wizardType)
            });

            if (res.data && Array.isArray(res.data)) {
                const newProcesses = res.data.map(p => ({
                    ...p,
                    // Guardamos el tipo específico para facilitar el filtrado
                    tipo: wizardType,
                    id: `IA-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
                }));

                await axios.post('/api/gestion/procesos', newProcesses);
                toast.success(`${newProcesses.length} procesos generados y guardados`);
                setWizardOpen(false);
                fetchProcesses();
            }
        } catch (error) {
            toast.error('Error al generar procesos con IA');
        } finally {
            setIsGenerating(false);
        }
    };

    const groupedProcesses = {
        ESTRATEGICO: processes.filter(p => p.tipo === 'ESTRATÉGICO' || p.tipo === 'ESTRATEGICO' || p.tipo?.startsWith('ESTRATÉGICO_')),
        MISIONAL: processes.filter(p => p.tipo === 'MISIONAL' || p.tipo?.startsWith('MISIONAL_')),
        APOYO: processes.filter(p => p.tipo === 'APOYO' || p.tipo?.startsWith('APOYO_')),
        EVALUACION: processes.filter(p => p.tipo === 'EVALUACIÓN' || p.tipo === 'EVALUACION' || p.tipo?.startsWith('EVALUACION_')),
        OTROS: processes.filter(p => !['ESTRATÉGICO', 'ESTRATEGICO', 'MISIONAL', 'APOYO', 'EVALUACIÓN', 'EVALUACION'].includes(p.tipo) && !p.tipo?.includes('_'))
    };

    // Helper filters for Strategic
    const strategicPlanning = groupedProcesses.ESTRATEGICO.filter(p =>
        p.tipo === 'ESTRATÉGICO_PLANIFICACION' ||
        p.nombre.toLowerCase().includes('planif') ||
        p.nombre.toLowerCase().includes('estrateg') ||
        p.nombre.toLowerCase().includes('calidad') ||
        p.nombre.toLowerCase().includes('rumbo') ||
        p.nombre.toLowerCase().includes('direccionamiento')
    );

    const strategicManagement = groupedProcesses.ESTRATEGICO.filter(p =>
        p.tipo === 'ESTRATÉGICO_GERENCIAL' ||
        p.nombre.toLowerCase().includes('geren') ||
        p.nombre.toLowerCase().includes('directiv') ||
        p.nombre.toLowerCase().includes('revis') ||
        p.nombre.toLowerCase().includes('decision') ||
        p.nombre.toLowerCase().includes('comit') ||
        p.nombre.toLowerCase().includes('rendicion')
    );

    const strategicAdditional = groupedProcesses.ESTRATEGICO.filter(p =>
        !strategicPlanning.includes(p) && !strategicManagement.includes(p)
    );

    // Helper filters for Misional (5 columns)
    const misionalComercial = groupedProcesses.MISIONAL.filter(p =>
        p.tipo === 'MISIONAL_COMERCIAL' ||
        (p.tipo === 'MISIONAL' && (p.nombre.toLowerCase().includes('comercial') || p.nombre.toLowerCase().includes('venta')))
    );
    const misionalCompras = groupedProcesses.MISIONAL.filter(p =>
        p.tipo === 'MISIONAL_COMPRAS' ||
        (p.tipo === 'MISIONAL' && (p.nombre.toLowerCase().includes('compra') || p.nombre.toLowerCase().includes('proveedor')))
    );
    const misionalOperativo = groupedProcesses.MISIONAL.filter(p =>
        p.tipo === 'MISIONAL_OPERATIVO' ||
        (p.tipo === 'MISIONAL' && (p.nombre.toLowerCase().includes('operati') || p.nombre.toLowerCase().includes('produccion') || p.nombre.toLowerCase().includes('servicio')))
    );
    const misionalAlmacenamiento = groupedProcesses.MISIONAL.filter(p =>
        p.tipo === 'MISIONAL_ALMACENAMIENTO' ||
        (p.tipo === 'MISIONAL' && (p.nombre.toLowerCase().includes('almacen') || p.nombre.toLowerCase().includes('bodega') || p.nombre.toLowerCase().includes('inventario')))
    );
    const misionalFinanzas = groupedProcesses.MISIONAL.filter(p =>
        p.tipo === 'MISIONAL_FINANZAS' ||
        (p.tipo === 'MISIONAL' && (p.nombre.toLowerCase().includes('finan') || p.nombre.toLowerCase().includes('contab') || p.nombre.toLowerCase().includes('tesoreria')))
    );

    const misionalAdditional = groupedProcesses.MISIONAL.filter(p =>
        !misionalComercial.includes(p) &&
        !misionalCompras.includes(p) &&
        !misionalOperativo.includes(p) &&
        !misionalAlmacenamiento.includes(p) &&
        !misionalFinanzas.includes(p)
    );

    // Helper filters for Apoyo (2 columns)
    const apoyoRRHH = groupedProcesses.APOYO.filter(p => p.tipo === 'APOYO_RRHH' || p.nombre.toLowerCase().includes('humano') || p.nombre.toLowerCase().includes('talento') || p.nombre.toLowerCase().includes('personal'));
    const apoyoMantenimiento = groupedProcesses.APOYO.filter(p => p.tipo === 'APOYO_MANTENIMIENTO' || p.nombre.toLowerCase().includes('mantenimiento') || p.nombre.toLowerCase().includes('infraestructura'));

    const apoyoAdditional = groupedProcesses.APOYO.filter(p =>
        !apoyoRRHH.includes(p) &&
        !apoyoMantenimiento.includes(p)
    );

    // Helper filters for Evaluacion (2 columns)
    const evaluacionAuditoria = groupedProcesses.EVALUACION.filter(p => p.tipo === 'EVALUACION_AUDITORIA' || p.nombre.toLowerCase().includes('auditoria'));
    const evaluacionMejora = groupedProcesses.EVALUACION.filter(p => p.tipo === 'EVALUACION_MEJORA' || p.nombre.toLowerCase().includes('mejora') || p.nombre.toLowerCase().includes('continua'));

    const evaluacionAdditional = groupedProcesses.EVALUACION.filter(p =>
        !evaluacionAuditoria.includes(p) &&
        !evaluacionMejora.includes(p)
    );

    const ProcessCard = ({ proc }: { proc: any }) => {
        const [isEditing, setIsEditing] = useState(false);
        const [editData, setEditData] = useState({ name: proc.name || proc.nombre, description: proc.descripcion });

        const saveChanges = async () => {
            if (editData.name !== (proc.name || proc.nombre) || editData.description !== proc.descripcion) {
                await handleUpdate({ ...proc, nombre: editData.name, descripcion: editData.description });
            }
            setIsEditing(false);
        };

        return (
            <div key={proc.id} className="bg-gradient-to-br from-white to-slate-50 p-5 rounded-2xl border-2 border-slate-200 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 relative group">
                {isEditing ? (
                    <div className="space-y-3">
                        <input
                            value={editData.name}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                            className="w-full text-sm font-black text-slate-900 border-b-2 border-blue-500 outline-none pb-1 bg-transparent"
                            autoFocus
                        />
                        <textarea
                            value={editData.description}
                            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                            className="w-full text-xs text-slate-600 border-2 rounded-lg p-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 h-24 custom-scrollbar resize-none transition-all"
                        />
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setIsEditing(false)} className="text-xs text-slate-400 font-bold px-2 py-1 hover:text-slate-600 transition-colors">Cancelar</button>
                            <button onClick={saveChanges} className="text-xs bg-gradient-to-br from-blue-500 to-blue-600 text-white px-3 py-1 rounded-lg font-bold flex items-center gap-1 shadow-sm hover:shadow-md hover:from-blue-600 hover:to-blue-700 transition-all">
                                <FaSave /> Guardar
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-start mb-3">
                            <h4 className="font-black text-slate-900 text-sm leading-tight pr-14 uppercase tracking-tight">{proc.name || proc.nombre}</h4>
                            <div className="absolute top-5 right-5 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="text-slate-300 hover:text-blue-500 transition-colors p-1 hover:bg-blue-50 rounded"
                                    title="Editar Nombre/Descripción"
                                >
                                    <FaPen size={12} />
                                </button>
                                <button
                                    onClick={() => handleDelete(proc.id, proc.name || proc.nombre)}
                                    className="text-slate-300 hover:text-red-500 transition-colors p-1 hover:bg-red-50 rounded"
                                    title="Eliminar"
                                >
                                    <FaTrash size={12} />
                                </button>
                            </div>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap min-h-[1.5rem]">
                            {proc.descripcion || 'Sin descripción...'}
                        </p>
                    </>
                )}
            </div>
        );
    };

    const Section = ({ title, icon: Icon, colorClass, items, type }: { title: string, icon: any, colorClass: string, items: any[], type?: string }) => (
        <div className="flex flex-col gap-4 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
            <div className={`flex items-center gap-3 ${colorClass}`}>
                <div className="p-2 rounded-lg bg-white shadow-sm">
                    <Icon size={16} />
                </div>
                <h3 className="font-black uppercase tracking-tight text-sm">{title}</h3>
                <span className="ml-3 text-[10px] font-bold bg-white px-2 py-1 rounded-full text-slate-500 border border-slate-200">{items.length}</span>

                {type && (
                    <button
                        onClick={() => { setWizardType(type); setWizardOpen(true); }}
                        className="ml-auto flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-black hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm"
                    >
                        <FaMagic /> CONSULTAR IA
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {items.map(proc => <ProcessCard key={proc.id} proc={proc} />)}
                {items.length === 0 && (
                    <div className="col-span-full py-8 text-center border-2 border-dashed border-slate-200 rounded-xl">
                        <p className="text-xs text-slate-400 font-medium">No hay procesos registrados</p>
                    </div>
                )}
            </div>
        </div>
    );

    if (loading) return <div className="p-8 flex items-center justify-center"><div className="animate-spin text-slate-400"><FaCogs size={24} /></div></div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">

            <ProcessGeneratorModal
                isOpen={isGeneratorOpen}
                onClose={() => setIsGeneratorOpen(false)}
                onComplete={handleGeneratorComplete}
            />

            <ManualProcessModal
                isOpen={isManualOpen}
                onClose={() => setIsManualOpen(false)}
                onSave={handleManualSave}
                initialType={manualType}
            />

            {/* Process Map Layout */}
            <div className="space-y-8">

                {/* SECCIÓN ESTRATÉGICA UNIFICADA */}
                <div className="bg-gradient-to-br from-white via-purple-50/20 to-purple-50/30 p-8 rounded-[2.5rem] border-2 border-purple-100 shadow-lg shadow-purple-100/50 hover:shadow-xl transition-shadow duration-300 space-y-6">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3 text-purple-700">
                            <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-md">
                                <FaChessKing size={20} />
                            </div>
                            <div>
                                <h2 className="font-black uppercase tracking-tight text-lg">Procesos Estratégico</h2>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nivel de Gestión y Planeación</p>
                            </div>
                        </div>
                        <button
                            onClick={() => openManualModal('ESTRATÉGICO')}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-white to-purple-50 border-2 border-purple-200 text-purple-700 rounded-xl text-xs font-black shadow-sm hover:shadow-md hover:from-purple-50 hover:to-purple-100 transition-all"
                        >
                            <FaPlus /> CREAR
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative">
                        {/* Divisor Vertical */}
                        <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 -translate-x-1/2"></div>

                        {/* Columna 1: Planificación */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                    <h3 className="font-black text-xs uppercase text-slate-600 tracking-wider">Proceso 1</h3>
                                    <span className="text-[10px] font-bold bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">{strategicPlanning.length}</span>
                                </div>
                                <button
                                    onClick={() => { setWizardType('ESTRATÉGICO_PLANIFICACION'); setWizardOpen(true); }}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-purple-600 hover:border-purple-500 transition-all shadow-sm"
                                >
                                    <FaMagic /> IA PLANIFICA
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {strategicPlanning.map(proc => <ProcessCard key={proc.id} proc={proc} />)}
                                {strategicPlanning.length === 0 && <p className="text-[10px] text-slate-400 italic py-4">No hay procesos</p>}
                            </div>
                        </div>

                        {/* Columna 2: Gerencial */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                    <h3 className="font-black text-xs uppercase text-slate-600 tracking-wider">Proceso 2</h3>
                                    <span className="text-[10px] font-bold bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">{strategicManagement.length}</span>
                                </div>
                                <button
                                    onClick={() => { setWizardType('ESTRATÉGICO_GERENCIAL'); setWizardOpen(true); }}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-indigo-600 hover:border-indigo-500 transition-all shadow-sm"
                                >
                                    <FaMagic /> IA GERENCIA
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {strategicManagement.map(proc => <ProcessCard key={proc.id} proc={proc} />)}
                                {strategicManagement.length === 0 && <p className="text-[10px] text-slate-400 italic py-4">No hay procesos</p>}
                            </div>
                        </div>
                    </div>

                    {/* Procesos Adicionales Estratégicos (Manuales) */}
                    {strategicAdditional.length > 0 && (
                        <div className="mt-8 pt-6 border-t border-slate-200">
                            <h3 className="font-black text-xs uppercase text-slate-500 tracking-wider mb-4 flex items-center gap-2">
                                <FaPlus size={10} /> Procesos Adicionales
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {strategicAdditional.map(proc => <ProcessCard key={proc.id} proc={proc} />)}
                            </div>
                        </div>
                    )}
                </div>

                {/* SECCIÓN MISIONAL UNIFICADA */}
                <div className="bg-gradient-to-br from-white via-blue-50/20 to-blue-50/30 p-8 rounded-[2.5rem] border-2 border-blue-100 shadow-lg shadow-blue-100/50 hover:shadow-xl transition-shadow duration-300 space-y-6">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3 text-blue-700">
                            <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md">
                                <FaRocket size={20} />
                            </div>
                            <div>
                                <h2 className="font-black uppercase tracking-tight text-lg">Procesos Misionales</h2>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cadena de Valor y Operación</p>
                            </div>
                        </div>
                        <button
                            onClick={() => openManualModal('MISIONAL')}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-white to-blue-50 border-2 border-blue-200 text-blue-700 rounded-xl text-xs font-black shadow-sm hover:shadow-md hover:from-blue-50 hover:to-blue-100 transition-all"
                        >
                            <FaPlus /> CREAR
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {[{

                            title: 'Proceso 1',

                            items: misionalComercial,

                            type: 'MISIONAL_COMERCIAL'

                        },

                        {

                            title: 'Proceso 2',

                            items: misionalCompras,

                            type: 'MISIONAL_COMPRAS'

                        },

                        {

                            title: 'Proceso 3',

                            items: misionalOperativo,

                            type: 'MISIONAL_OPERATIVO'

                        },

                        {

                            title: 'Proceso 4',

                            items: misionalAlmacenamiento,

                            type: 'MISIONAL_ALMACENAMIENTO'

                        },

                        {

                            title: 'Proceso 5',

                            items: misionalFinanzas,

                            type: 'MISIONAL_FINANZAS'

                        }].map((col, idx) => (

                            <div key={idx} className="space-y-4">

                                <div className="flex items-center justify-between pb-2 border-b border-slate-100">

                                    <div className="flex items-center gap-2">

                                        <h3 className="font-black text-xs uppercase text-slate-600 tracking-wider">{col.title}</h3>

                                        <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full">{col.items.length}</span>

                                    </div>

                                    <button

                                        onClick={() => { setWizardType(col.type); setWizardOpen(true); }}

                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"

                                        title={`Generar ${col.title}`}

                                    >

                                        <FaMagic size={10} />

                                    </button>

                                </div>

                                <div className="space-y-3">

                                    {col.items.map(proc => <ProcessCard key={proc.id} proc={proc} />)}

                                </div>

                            </div>

                        ))}

                    </div>



                    {/* Procesos Adicionales Misionales */}

                    {misionalAdditional.length > 0 && (

                        <div className="mt-8 pt-6 border-t border-slate-200">

                            <h3 className="font-black text-xs uppercase text-slate-500 tracking-wider mb-4 flex items-center gap-2">

                                <FaPlus size={10} /> Procesos Adicionales

                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

                                {misionalAdditional.map(proc => <ProcessCard key={proc.id} proc={proc} />)}

                            </div>

                        </div>

                    )}

                </div>



                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* SECCIÓN APOYO */}

                    <div className="bg-gradient-to-br from-white via-orange-50/20 to-orange-50/30 p-8 rounded-[2.5rem] border-2 border-orange-100 shadow-lg shadow-orange-100/50 hover:shadow-xl transition-shadow duration-300 space-y-6">

                        <div className="flex items-center justify-between">

                            <div className="flex items-center gap-3 text-orange-700">

                                <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-md">

                                    <FaHandsHelping size={20} />

                                </div>

                                <div>

                                    <h2 className="font-black uppercase tracking-tight text-lg">Procesos de Apoyo</h2>

                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recursos y Soporte</p>

                                </div>

                            </div>

                            <button

                                onClick={() => openManualModal('APOYO')}

                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-white to-orange-50 border-2 border-orange-200 text-orange-700 rounded-xl text-xs font-black shadow-sm hover:shadow-md hover:from-orange-50 hover:to-orange-100 transition-all"

                            >

                                <FaPlus /> CREAR

                            </button>

                        </div>

                        <div className="grid grid-cols-2 gap-6">

                            {[{

                                title: 'Proceso 1',

                                items: apoyoRRHH,

                                type: 'APOYO_RRHH'

                            },

                            {

                                title: 'Proceso 2',

                                items: apoyoMantenimiento,

                                type: 'APOYO_MANTENIMIENTO'

                            }].map((col, idx) => (

                                <div key={idx} className="space-y-4">

                                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">

                                        <h3 className="font-black text-xs uppercase text-slate-600 tracking-wider">{col.title}</h3>

                                        <button onClick={() => { setWizardType(col.type); setWizardOpen(true); }} className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-lg"><FaMagic size={10} /></button>

                                    </div>

                                    <div className="space-y-3">

                                        {col.items.map(proc => <ProcessCard key={proc.id} proc={proc} />)}

                                    </div>

                                </div>

                            ))}

                        </div>



                        {/* Procesos Adicionales Apoyo */}

                        {apoyoAdditional.length > 0 && (

                            <div className="mt-8 pt-6 border-t border-slate-200">

                                <h3 className="font-black text-xs uppercase text-slate-500 tracking-wider mb-4 flex items-center gap-2">

                                    <FaPlus size={10} /> Procesos Adicionales

                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    {apoyoAdditional.map(proc => <ProcessCard key={proc.id} proc={proc} />)}

                                </div>

                            </div>

                        )}

                    </div>



                    {/* SECCIÓN EVALUACIÓN */}



                    <div className="bg-gradient-to-br from-white via-emerald-50/20 to-emerald-50/30 p-8 rounded-[2.5rem] border-2 border-emerald-100 shadow-lg shadow-emerald-100/50 hover:shadow-xl transition-shadow duration-300 space-y-6">



                        <div className="flex items-center justify-between">



                            <div className="flex items-center gap-3 text-emerald-700">



                                <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-md">



                                    <FaChartPie size={20} />



                                </div>



                                <div>



                                    <h2 className="font-black uppercase tracking-tight text-lg">Evaluación y Mejora</h2>



                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Medición y Mejora</p>



                                </div>



                            </div>



                            <button



                                onClick={() => openManualModal('EVALUACIÓN')}



                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-white to-emerald-50 border-2 border-emerald-200 text-emerald-700 rounded-xl text-xs font-black shadow-sm hover:shadow-md hover:from-emerald-50 hover:to-emerald-100 transition-all"



                            >



                                <FaPlus /> CREAR



                            </button>



                        </div>



                        <div className="grid grid-cols-2 gap-6">

                            {[{

                                title: 'Proceso 1',

                                items: evaluacionAuditoria,

                                type: 'EVALUACION_AUDITORIA'

                            },

                            {

                                title: 'Proceso 2',

                                items: evaluacionMejora,

                                type: 'EVALUACION_MEJORA'

                            }].map((col, idx) => (

                                <div key={idx} className="space-y-4">

                                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">

                                        <h3 className="font-black text-xs uppercase text-slate-600 tracking-wider">{col.title}</h3>

                                        <button onClick={() => { setWizardType(col.type); setWizardOpen(true); }} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg"><FaMagic size={10} /></button>

                                    </div>

                                    <div className="space-y-3">

                                        {col.items.map(proc => <ProcessCard key={proc.id} proc={proc} />)}

                                    </div>

                                </div>

                            ))}

                        </div>



                        {/* Procesos Adicionales Evaluación */}

                        {evaluacionAdditional.length > 0 && (

                            <div className="mt-8 pt-6 border-t border-slate-200">

                                <h3 className="font-black text-xs uppercase text-slate-500 tracking-wider mb-4 flex items-center gap-2">

                                    <FaPlus size={10} /> Procesos Adicionales

                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    {evaluacionAdditional.map(proc => <ProcessCard key={proc.id} proc={proc} />)}

                                </div>

                            </div>

                        )}

                    </div>

                </div>

                {groupedProcesses.OTROS.length > 0 && (
                    <Section
                        title="Otros Procesos"
                        icon={FaCogs}
                        colorClass="text-slate-600"
                        items={groupedProcesses.OTROS}
                    />
                )}

            </div>

            <ProcessAIWizard
                isOpen={wizardOpen}
                onClose={() => setWizardOpen(false)}
                type={wizardType}
                onGenerate={handleWizardGenerate}
                isGenerating={isGenerating}
            />
        </div>
    );
}