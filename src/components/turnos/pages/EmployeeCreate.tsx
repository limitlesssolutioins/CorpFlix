import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
    ArrowLeft,
    Save,
    CalendarClock,
    User,
    Briefcase,
    DollarSign,
    ShieldCheck,
    CheckCircle2,
    Info,
    ChevronRight,
    ChevronLeft,
    Users,
    Wallet,
    MapPin,
    Stethoscope
} from 'lucide-react';
import { toast } from 'sonner';

interface FormData {
    firstName: string;
    lastName: string;
    identification: string;
    email: string;
    phone: string;
    contractType: string;
    salaryAmount: number;
    salaryScheme: string;
    startDate: string;
    epsEntity: string;
    arlEntity: string;
    pensionEntity: string;
    defaultSiteId: string;
    defaultPositionId: string;
    standardStartTime: string;
    standardEndTime: string;
    workDays: string[];
}

const EmployeeCreate: React.FC = () => {
    const [step, setStep] = useState(1);
    const { register, handleSubmit, setValue, trigger, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            salaryScheme: 'ORDINARIO',
            workDays: ['1', '2', '3', '4', '5']
        }
    });
    const router = useRouter();

    const [sites, setSites] = useState<any[]>([]);
    const [positions, setPositions] = useState<any[]>([]);
    const [scales, setScales] = useState<any[]>([]);
    const [ssData, setSsData] = useState<any>({ eps: [], arl: [], pension: [], contracts: [] });
    const [smlmv, setSmlmv] = useState<number>(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resSites, resPos, resSettings, resScales, resSS] = await Promise.all([
                    axios.get('/api/catalog/sites'),
                    axios.get('/api/catalog/positions'),
                    axios.get('/api/settings'),
                    axios.get('/api/settings/scales'),
                    axios.get('/api/catalog/constants')
                ]);
                setSites(resSites.data);
                setPositions(resPos.data);
                setSmlmv(Number(resSettings.data.smlmv));
                setScales(resScales.data);
                setSsData(resSS.data);
            } catch (e) { toast.error("Error al cargar catálogos base"); }
        };
        fetchData();
    }, []);

    const onSubmit = async (data: any) => {
        const toastId = toast.loading("Finalizando vinculación legal...");
        try {
            const payload = {
                ...data,
                salaryAmount: parseFloat(data.salaryAmount),
                startDate: new Date(data.startDate).toISOString(),
                workDays: data.workDays ? data.workDays.join(',') : null,
            };
            await axios.post('/api/employees', payload);
            toast.success("Colaborador vinculado exitosamente", { id: toastId });
            router.push('/turnos/employees');
        } catch (error) {
            toast.error("Error al registrar el contrato", { id: toastId });
        }
    };

    const handleNextStep = async () => {
        let fieldsToValidate: any[] = [];
        if (step === 1) fieldsToValidate = ['firstName', 'lastName', 'identification'];
        if (step === 2) fieldsToValidate = ['defaultSiteId', 'defaultPositionId', 'contractType', 'startDate', 'epsEntity', 'arlEntity', 'pensionEntity', 'salaryAmount'];

        const isStepValid = await trigger(fieldsToValidate as any);
        if (isStepValid) {
            setStep(s => s + 1);
        } else {
            toast.warning("Por favor complete los campos obligatorios del paso actual.");
        }
    };

    const prevStep = () => setStep(s => s - 1);

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
            <div className="flex items-center justify-between">
                <button onClick={() => router.push('/turnos/employees')} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold transition-all">
                    <ArrowLeft size={20} /> Directorio de Personal
                </button>
                <div className="text-right">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Vinculación de Talento</h1>
                    <p className="text-slate-500 text-xs font-black uppercase tracking-widest mt-1">Paso {step} de 3</p>
                </div>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center justify-center gap-4 mb-12">
                {[1, 2, 3].map(i => (
                    <React.Fragment key={i}>
                        <div className={`h-10 w-10 rounded-2xl flex items-center justify-center font-black transition-all ${step >= i ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' : 'bg-slate-100 text-slate-400'}`}>
                            {i}
                        </div>
                        {i < 3 && <div className={`h-1 w-8 rounded-full ${step > i ? 'bg-primary-600' : 'bg-slate-100'}`}></div>}
                    </React.Fragment>
                ))}
            </div>

            <form
                onSubmit={(e) => {
                    if (step < 3) { e.preventDefault(); handleNextStep(); }
                    else handleSubmit(onSubmit)(e);
                }}
                className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden"
            >
                {/* PASO 1: DATOS PERSONALES */}
                {step === 1 && (
                    <div className="p-10 space-y-8 animate-in slide-in-from-right-4 duration-300">
                        <div className="flex items-center gap-4">
                            <div className="h-14 w-14 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 shadow-inner">
                                <User size={28} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900">Información Personal</h3>
                                <p className="text-sm text-slate-500 font-medium">Datos básicos de identidad.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombres</label><input {...register('firstName', { required: true })} placeholder="Ej: Juan" className={`w-full p-4 bg-slate-50 border ${errors.firstName ? 'border-rose-500' : 'border-slate-200'} rounded-2xl font-bold outline-none`} /></div>
                            <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Apellidos</label><input {...register('lastName', { required: true })} placeholder="Ej: Pérez" className={`w-full p-4 bg-slate-50 border ${errors.lastName ? 'border-rose-500' : 'border-slate-200'} rounded-2xl font-bold outline-none`} /></div>
                            <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identificación</label><input {...register('identification', { required: true })} className={`w-full p-4 bg-slate-50 border ${errors.identification ? 'border-rose-500' : 'border-slate-200'} rounded-2xl font-black outline-none`} /></div>
                            <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Teléfono</label><input {...register('phone')} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none" /></div>
                            <div className="space-y-2 md:col-span-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label><input {...register('email')} type="email" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none" /></div>
                        </div>
                    </div>
                )}

                {/* PASO 2: CONTRATO */}
                {step === 2 && (
                    <div className="p-10 space-y-8 animate-in slide-in-from-right-4 duration-300">
                        <div className="flex items-center gap-4">
                            <div className="h-14 w-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
                                <Briefcase size={28} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900">Contratación y Salario</h3>
                                <p className="text-sm text-slate-500 font-medium">Configure los términos legales del vínculo.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sede</label><select {...register('defaultSiteId', { required: true })} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none">{sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
                            <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cargo</label><select {...register('defaultPositionId', { required: true })} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none">{positions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Salario Mensual</label>
                                <div className="flex gap-2">
                                    <input type="number" {...register('salaryAmount', { required: true })} className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-primary-600 outline-none" />
                                    <button type="button" onClick={() => setValue('salaryAmount', smlmv)} className="px-4 bg-emerald-50 text-emerald-700 rounded-xl text-[10px] font-black uppercase">SMLMV</button>
                                </div>
                            </div>
                            <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">EPS</label><select {...register('epsEntity', { required: true })} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none">{ssData.eps.map((e: any) => <option key={e} value={e}>{e}</option>)}</select></div>
                            <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ARL</label><select {...register('arlEntity', { required: true })} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none">{ssData.arl.map((a: any) => <option key={a} value={a}>{a}</option>)}</select></div>
                            <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pensión</label><select {...register('pensionEntity', { required: true })} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none">{ssData.pension.map((p: any) => <option key={p} value={p}>{p}</option>)}</select></div>
                            <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fecha Ingreso</label><input type="date" {...register('startDate', { required: true })} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none" /></div>
                        </div>
                    </div>
                )}

                {/* PASO 3: TURNOS */}
                {step === 3 && (
                    <div className="p-10 space-y-8 animate-in slide-in-from-right-4 duration-300">
                        <div className="flex items-center gap-4">
                            <div className="h-14 w-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 shadow-inner">
                                <CalendarClock size={28} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900">Configuración de Jornada</h3>
                                <p className="text-sm text-slate-500 font-medium">Defina el horario base para la generación automática.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hora Entrada</label><input type="time" {...register('standardStartTime')} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-black outline-none" /></div>
                                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hora Salida</label><input type="time" {...register('standardEndTime')} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-black outline-none" /></div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Días de Trabajo</label>
                                <div className="flex gap-2">
                                    {[{ v: '1', l: 'L' }, { v: '2', l: 'M' }, { v: '3', l: 'X' }, { v: '4', l: 'J' }, { v: '5', l: 'V' }, { v: '6', l: 'S' }, { v: '0', l: 'D' }].map(d => (
                                        <label key={d.v} className="flex-1 cursor-pointer">
                                            <input type="checkbox" value={d.v} {...register('workDays')} className="peer hidden" />
                                            <div className="h-12 flex items-center justify-center bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black text-slate-400 peer-checked:bg-amber-500 peer-checked:text-white transition-all">{d.l}</div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    {step > 1 ? (
                        <button type="button" onClick={prevStep} className="px-8 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-2">
                            <ChevronLeft size={18} /> Anterior
                        </button>
                    ) : <div />}

                    <div className="flex gap-4">
                        <button type="button" onClick={() => router.push('/turnos/employees')} className="px-8 py-4 text-slate-400 font-bold uppercase text-xs tracking-widest">Cancelar</button>
                        {step < 3 ? (
                            <button type="submit" className="px-10 py-4 bg-primary-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl flex items-center gap-2 hover:bg-primary-700 transition-all">
                                Siguiente <ChevronRight size={18} />
                            </button>
                        ) : (
                            <button type="submit" className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-black transition-all flex items-center gap-2">
                                <Save size={18} /> Finalizar Registro
                            </button>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EmployeeCreate;
