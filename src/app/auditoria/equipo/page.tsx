'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Pencil, Trash2, X, Save, Users } from 'lucide-react';

interface Auditor {
    id: number;
    name: string;
    email: string;
    role: string;
    area: string;
    phone: string;
    status: string;
}

const ROLES = ['Auditor Líder', 'Auditor', 'Observador', 'Experto Técnico'];

const emptyForm = { name: '', email: '', role: 'Auditor', area: '', phone: '', status: 'ACTIVE' };

export default function EquipoAuditorPage() {
    const [auditors, setAuditors] = useState<Auditor[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Auditor | null>(null);
    const [form, setForm] = useState({ ...emptyForm });
    const [saving, setSaving] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

    useEffect(() => { loadAuditors(); }, []);

    const loadAuditors = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/auditoria/auditors');
            const data = await res.json();
            setAuditors(Array.isArray(data) ? data : []);
        } catch { /* ignore */ }
        finally { setLoading(false); }
    };

    const openCreate = () => {
        setEditing(null);
        setForm({ ...emptyForm });
        setShowModal(true);
    };

    const openEdit = (a: Auditor) => {
        setEditing(a);
        setForm({ name: a.name, email: a.email || '', role: a.role || 'Auditor', area: a.area || '', phone: a.phone || '', status: a.status || 'ACTIVE' });
        setShowModal(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim()) return;
        setSaving(true);
        try {
            const method = editing ? 'PUT' : 'POST';
            const body = editing ? { id: editing.id, ...form } : form;
            const res = await fetch('/api/auditoria/auditors', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            if (res.ok) {
                setShowModal(false);
                await loadAuditors();
            } else {
                alert('Error al guardar');
            }
        } finally { setSaving(false); }
    };

    const handleDelete = async (id: number) => {
        const res = await fetch(`/api/auditoria/auditors?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
            setDeleteConfirm(null);
            await loadAuditors();
        } else {
            const data = await res.json();
            alert(data.error || 'No se puede eliminar');
            setDeleteConfirm(null);
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <Link href="/auditoria" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold mb-4 transition-colors">
                    <ArrowLeft size={20} /> Volver a Normas
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 mb-1">Equipo Auditor</h1>
                        <p className="text-slate-500 text-sm">Directorio global de auditores · {auditors.length} registrado{auditors.length !== 1 ? 's' : ''}</p>
                    </div>
                    <button
                        onClick={openCreate}
                        className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-700 transition-colors"
                    >
                        <Plus size={18} /> Nuevo Auditor
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-slate-400 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : auditors.length === 0 ? (
                <div className="bg-white rounded-2xl p-16 border-2 border-dashed border-slate-300 text-center">
                    <Users className="w-14 h-14 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-700 mb-2">Sin auditores registrados</h3>
                    <p className="text-slate-400 mb-5">Agrega los miembros del equipo auditor para asignarlos a auditorías</p>
                    <button onClick={openCreate} className="inline-flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-700">
                        <Plus size={18} /> Agregar Auditor
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50">
                                <th className="text-left px-5 py-3.5 font-bold text-slate-600 text-xs uppercase tracking-wide">Nombre</th>
                                <th className="text-left px-5 py-3.5 font-bold text-slate-600 text-xs uppercase tracking-wide">Rol</th>
                                <th className="text-left px-5 py-3.5 font-bold text-slate-600 text-xs uppercase tracking-wide hidden md:table-cell">Área</th>
                                <th className="text-left px-5 py-3.5 font-bold text-slate-600 text-xs uppercase tracking-wide hidden lg:table-cell">Email</th>
                                <th className="text-left px-5 py-3.5 font-bold text-slate-600 text-xs uppercase tracking-wide">Estado</th>
                                <th className="px-5 py-3.5" />
                            </tr>
                        </thead>
                        <tbody>
                            {auditors.map((a, i) => (
                                <tr key={a.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${i === auditors.length - 1 ? 'border-0' : ''}`}>
                                    <td className="px-5 py-3.5">
                                        <div className="font-semibold text-slate-900">{a.name}</div>
                                        {a.phone && <div className="text-xs text-slate-400 mt-0.5">{a.phone}</div>}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">{a.role || 'Auditor'}</span>
                                    </td>
                                    <td className="px-5 py-3.5 text-slate-600 hidden md:table-cell">{a.area || '—'}</td>
                                    <td className="px-5 py-3.5 text-slate-500 hidden lg:table-cell">{a.email || '—'}</td>
                                    <td className="px-5 py-3.5">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${a.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                            {a.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-1 justify-end">
                                            <button onClick={() => openEdit(a)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                                                <Pencil size={15} />
                                            </button>
                                            {deleteConfirm === a.id ? (
                                                <div className="flex items-center gap-1">
                                                    <button onClick={() => handleDelete(a.id)} className="px-2.5 py-1 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700">Eliminar</button>
                                                    <button onClick={() => setDeleteConfirm(null)} className="px-2.5 py-1 bg-slate-200 text-slate-700 rounded-lg text-xs font-bold">Cancelar</button>
                                                </div>
                                            ) : (
                                                <button onClick={() => setDeleteConfirm(a.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                    <Trash2 size={15} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
                            <h2 className="text-lg font-bold text-slate-900">{editing ? 'Editar Auditor' : 'Nuevo Auditor'}</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Nombre completo <span className="text-red-500">*</span></label>
                                <input type="text" required value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    placeholder="Ej. Juan García"
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Rol</label>
                                    <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm">
                                        {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Estado</label>
                                    <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm">
                                        <option value="ACTIVE">Activo</option>
                                        <option value="INACTIVE">Inactivo</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Área / Departamento</label>
                                <input type="text" value={form.area}
                                    onChange={e => setForm({ ...form, area: e.target.value })}
                                    placeholder="Ej. Calidad, RRHH, Producción..."
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Email</label>
                                    <input type="email" value={form.email}
                                        onChange={e => setForm({ ...form, email: e.target.value })}
                                        placeholder="email@empresa.com"
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Teléfono</label>
                                    <input type="tel" value={form.phone}
                                        onChange={e => setForm({ ...form, phone: e.target.value })}
                                        placeholder="+57 300 000 0000"
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 text-sm">
                                    Cancelar
                                </button>
                                <button type="submit" disabled={saving}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-700 disabled:opacity-50 text-sm">
                                    <Save size={16} />
                                    {saving ? 'Guardando...' : editing ? 'Guardar cambios' : 'Crear auditor'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
