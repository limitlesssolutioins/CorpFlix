
import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import { toast } from 'sonner';
import {
  Plus,
  Trash2,
  Wand2,
  Clock,
  AlertCircle,
  Search,
  CheckCircle2,
  X,
  Info,
  ShieldAlert,
  ArrowRight,
  ChevronRight
} from 'lucide-react';

import 'moment/locale/es';
moment.locale('es');
const localizer = momentLocalizer(moment);

interface ShiftEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: any;
}

const ShiftsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'calendar' | 'roster'>('roster');
  const [events, setEvents] = useState<ShiftEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<ShiftEvent[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [genModalOpen, setGenModalOpen] = useState(false);
  const [conflictModalOpen, setConflictModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ShiftEvent | null>(null);

  const [employees, setEmployees] = useState<any[]>([]);
  const [sites, setSites] = useState<any[]>([]);
  const [positions, setPositions] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [absences, setAbsences] = useState<any[]>([]);

  const [filterTeam, setFilterTeam] = useState('');
  const [filterSite, setFilterSite] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [formEmployee, setFormEmployee] = useState('');
  const [formSite, setFormSite] = useState('');
  const [formPosition, setFormPosition] = useState('');
  const [formStart, setFormStart] = useState('');
  const [formEnd, setFormEnd] = useState('');

  const [genMonth, setGenMonth] = useState(new Date().getMonth() + 1);
  const [genYear, setGenYear] = useState(new Date().getFullYear());
  const [genEmployee, setGenEmployee] = useState('');

  const fetchShifts = async () => {
    try {
      const res = await axios.get('/api/shifts');
      const mappedEvents = res.data.map((s: any) => ({
        id: s.id,
        title: `${s.employee.firstName}`,
        start: new Date(s.startTime),
        end: new Date(s.endTime),
        resource: s,
      }));
      setEvents(mappedEvents);
    } catch (error) { console.error(error); }
  };

  useEffect(() => {
    fetchShifts();
    axios.get('/api/employees').then(r => setEmployees(r.data));
    axios.get('/api/catalog/sites').then(r => setSites(r.data));
    axios.get('/api/catalog/positions').then(r => setPositions(r.data));
    axios.get('/api/scheduler/teams').then(r => setTeams(r.data));
    axios.get('/api/absences').then(r => setAbsences(r.data));
  }, []);

  useEffect(() => {
    let result = events;
    if (filterSite) result = result.filter(e => e.resource.siteId === filterSite);
    if (filterTeam) {
      const teamMemberIds = employees.filter(emp => emp.teamId === filterTeam).map(emp => emp.id);
      result = result.filter(e => teamMemberIds.includes(e.resource.employeeId));
    }
    if (searchTerm) {
      result = result.filter(e =>
        e.resource.employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.resource.employee.lastName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredEvents(result);
  }, [events, filterSite, filterTeam, searchTerm, employees]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`¿Eliminar ${selectedIds.length} turnos seleccionados?`)) return;

    try {
      await axios.post('/api/shifts/bulk-delete', { ids: selectedIds });
      toast.success("Turnos eliminados");
      setSelectedIds([]);
      fetchShifts();
    } catch (e) { toast.error("Error al eliminar masivamente"); }
  };

  const handleSelectSlot = (slotInfo: { start: Date, end: Date }) => {
    setEditingEvent(null);
    setFormEmployee(''); setFormSite(''); setFormPosition('');
    setFormStart(moment(slotInfo.start).format('YYYY-MM-DDTHH:mm'));
    setFormEnd(moment(slotInfo.end).format('YYYY-MM-DDTHH:mm'));
    setModalOpen(true);
  };

  const handleSelectEvent = (event: ShiftEvent) => {
    setEditingEvent(event);
    if (event.resource.conflictStatus !== 'NONE') {
      setConflictModalOpen(true);
    } else {
      openEditModal(event);
    }
  };

  const openEditModal = (event: ShiftEvent) => {
    setFormEmployee(event.resource.employeeId);
    setFormSite(event.resource.siteId);
    setFormPosition(event.resource.positionId);
    setFormStart(moment(event.start).format('YYYY-MM-DDTHH:mm'));
    setFormEnd(moment(event.end).format('YYYY-MM-DDTHH:mm'));
    setConflictModalOpen(false);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      startTime: new Date(formStart), endTime: new Date(formEnd),
      employeeId: formEmployee, siteId: formSite, positionId: formPosition
    };
    try {
      if (editingEvent) await axios.patch(`/api/shifts/${editingEvent.id}`, payload);
      else await axios.post('/api/shifts', payload);
      toast.success("Turno actualizado");
      setModalOpen(false); fetchShifts();
    } catch (err) { toast.error('Error al guardar'); }
  };

  const handleAutoGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!genEmployee) return toast.error("Seleccione un empleado");
    const toastId = toast.loading("Procesando...");
    try {
      await axios.post(`/api/employees/${genEmployee}/generate-shifts`, { month: genMonth, year: genYear });
      toast.success("Turnos generados");
      setGenModalOpen(false); fetchShifts();
    } catch (error: any) {
      toast.error("El empleado no tiene horario base configurado.", { id: toastId });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2">
            <Clock className="text-primary-600" size={32} />
            Gestión de Turnos
          </h1>
          <p className="text-slate-500 mt-1 font-medium italic">Control operativo y cumplimiento legal.</p>
        </div>
        <div className="flex items-center gap-3">
          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-5 py-2.5 bg-rose-50 text-rose-600 rounded-xl font-bold hover:bg-rose-100 transition-all border border-rose-100"
            >
              <Trash2 size={18} />
              Borrar ({selectedIds.length})
            </button>
          )}
          <button onClick={() => setGenModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white rounded-xl font-bold shadow-lg shadow-amber-500/20 transition-all">
            <Wand2 size={18} /> Auto-Planificar
          </button>
          <button onClick={() => handleSelectSlot({ start: new Date(), end: new Date() })} className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl font-bold shadow-lg shadow-primary-500/20 transition-all">
            <Plus size={18} /> Nuevo Turno
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input type="text" placeholder="Buscar colaborador..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" />
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button onClick={() => setViewMode('calendar')} className={`px-4 py-1.5 rounded-lg text-xs font-bold ${viewMode === 'calendar' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500'}`}>Calendario</button>
          <button onClick={() => setViewMode('roster')} className={`px-4 py-1.5 rounded-lg text-xs font-bold ${viewMode === 'roster' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500'}`}>Cuadrante</button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[600px]">
          {viewMode === 'calendar' ? (
            <div className="p-4 h-full">
              <Calendar localizer={localizer} events={filteredEvents} selectable onSelectSlot={handleSelectSlot} onSelectEvent={handleSelectEvent} eventPropGetter={(e: any) => ({ style: { backgroundColor: e.resource.conflictStatus === 'CRITICAL' ? '#ef4444' : e.resource.conflictStatus === 'WARNING' ? '#f59e0b' : '#3b82f6', borderRadius: '8px' } })} style={{ height: '700px' }} messages={{ next: "Sig", previous: "Ant", today: "Hoy", month: "Mes", week: "Semana", day: "Día" }} />
            </div>
          ) : (
            <RosterView events={filteredEvents} employees={employees} onEventClick={handleSelectEvent} selectedIds={selectedIds} onToggleSelect={toggleSelect} absences={absences} />
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <AlertCircle size={20} className="text-amber-500" /> Monitor de Conflictos
            </h3>
            <div className="space-y-3">
              {filteredEvents.filter(e => e.resource.conflictStatus !== 'NONE').slice(0, 6).map(e => (
                <div key={e.id} onClick={() => handleSelectEvent(e)} className="p-3 rounded-xl border border-slate-700/50 bg-slate-800/50 hover:border-primary-500 transition-colors cursor-pointer group">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black uppercase text-slate-400">{moment(e.start).format('DD MMM')}</span>
                    <span className={`h-1.5 w-1.5 rounded-full ${e.resource.conflictStatus === 'CRITICAL' ? 'bg-rose-500 animate-pulse' : 'bg-amber-500'}`}></span>
                  </div>
                  <p className="text-xs font-bold text-slate-100">{e.resource.employee.firstName} {e.resource.employee.lastName}</p>
                  <p className="text-[9px] text-slate-500 mt-1 line-clamp-1 uppercase font-black">Click para resolver</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL AUTO-GENERAR */}
      {genModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <form className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden" onSubmit={handleAutoGenerate}>
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-amber-50/50">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2"><Wand2 className="text-amber-600" /> Auto-Planificar</h2>
              <button type="button" onClick={() => setGenModalOpen(false)}><X /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase">Colaborador</label>
                <select value={genEmployee} onChange={e => setGenEmployee(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none" required>
                  <option value="">Seleccione un colaborador...</option>
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>{e.firstName} {e.lastName} {!e.standardStartTime ? '(⚠️ Sin horario base)' : ''}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <select value={genMonth} onChange={e => setGenMonth(Number(e.target.value))} className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(m => <option key={m} value={m}>{moment().month(m - 1).format('MMMM')}</option>)}
                </select>
                <input type="number" value={genYear} onChange={e => setGenYear(Number(e.target.value))} className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold" />
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t flex gap-3">
              <button type="button" onClick={() => setGenModalOpen(false)} className="flex-1 font-bold text-slate-400">Cancelar</button>
              <button type="submit" className="flex-2 py-3 bg-amber-600 text-white rounded-xl font-bold shadow-lg shadow-amber-500/20">Generar Turnos</button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL CONFLICTOS */}
      {conflictModalOpen && editingEvent && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in zoom-in-95 duration-200">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200">
            <div className={`p-8 ${editingEvent.resource.conflictStatus === 'CRITICAL' ? 'bg-rose-50' : 'bg-amber-50'} flex flex-col items-center text-center relative`}>
              <button onClick={() => setConflictModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"><X size={24} /></button>
              <div className={`h-20 w-20 rounded-3xl ${editingEvent.resource.conflictStatus === 'CRITICAL' ? 'bg-rose-500' : 'bg-amber-500'} text-white flex items-center justify-center shadow-xl mb-6`}>
                <ShieldAlert size={40} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Resolución de Conflicto</h2>
              <p className="text-slate-500 mt-2 font-medium">Se ha detectado una anomalía en la programación de <strong>{editingEvent.resource.employee.firstName}</strong>.</p>
            </div>
            <div className="p-10 space-y-8">
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="p-2 bg-white rounded-lg text-primary-600 shadow-sm"><Info size={18} /></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Diagnóstico del Sistema</p>
                    <p className="text-sm font-bold text-slate-700 leading-relaxed mt-1">
                      {editingEvent.resource.conflicts?.[0]?.conflictMessage || 'Inconsistencia en el descanso legal o choque con novedad.'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <button onClick={() => openEditModal(editingEvent)} className="w-full p-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-between group">
                  <span>Reprogramar Horario Manualmente</span>
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button onClick={async () => {
                  if (confirm("¿Eliminar turno?")) {
                    await axios.delete(`/api/shifts/${editingEvent.id}`);
                    toast.success("Turno eliminado");
                    setConflictModalOpen(false); fetchShifts();
                  }
                }} className="w-full p-4 bg-rose-50 text-rose-600 rounded-2xl font-bold hover:bg-rose-100 transition-all flex items-center justify-between group">
                  <span>Eliminar Turno</span>
                  <X size={18} />
                </button>
                <button onClick={() => setConflictModalOpen(false)} className="w-full p-4 border border-slate-200 text-slate-500 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center justify-between">
                  <span>Mantener y Asumir Recargos</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDICIÓN */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <form className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden" onSubmit={handleSave}>
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-black text-slate-900">{editingEvent ? 'Editar Turno' : 'Nuevo Turno'}</h2>
              <button type="button" onClick={() => setModalOpen(false)}><X size={24} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <input type="datetime-local" value={formStart} onChange={e => setFormStart(e.target.value)} className="p-3 bg-slate-50 border rounded-xl font-bold outline-none" required />
                <input type="datetime-local" value={formEnd} onChange={e => setFormEnd(e.target.value)} className="p-3 bg-slate-50 border rounded-xl font-bold outline-none" required />
              </div>
              <select value={formEmployee} onChange={e => setFormEmployee(e.target.value)} className="w-full p-3 bg-slate-50 border rounded-xl font-bold outline-none" required>
                <option value="">Empleado...</option>
                {employees.map(e => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-4">
                <select value={formSite} onChange={e => setFormSite(e.target.value)} className="p-3 bg-slate-50 border rounded-xl font-bold outline-none" required>
                  <option value="">Sede...</option>
                  {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <select value={formPosition} onChange={e => setFormPosition(e.target.value)} className="p-3 bg-slate-50 border rounded-xl font-bold outline-none" required>
                  <option value="">Cargo...</option>
                  {positions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t flex justify-end gap-3">
              <button type="button" onClick={() => setModalOpen(false)} className="px-5 font-bold text-slate-500">Cancelar</button>
              <button type="submit" className="px-8 py-3 bg-primary-600 text-white rounded-xl font-bold shadow-lg shadow-primary-500/20">Guardar Turno</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

const RosterView = ({ events, employees, onEventClick, selectedIds, onToggleSelect, absences = [] }: any) => {
  const daysInMonth = moment().daysInMonth();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  return (
    <div className="h-[700px] overflow-auto">
      <table className="w-full border-separate border-spacing-0">
        <thead>
          <tr className="sticky top-0 z-20 bg-white">
            <th className="p-4 text-xs font-black text-slate-400 uppercase text-left border-b border-r sticky left-0 bg-white z-30 min-w-[200px]">Colaborador</th>
            {days.map(d => <th key={d} className="p-2 text-[10px] font-black text-slate-400 border-b min-w-[40px] text-center bg-slate-50/50">{d}<br />{moment().date(d).format('dd')}</th>)}
          </tr>
        </thead>
        <tbody>
          {employees.map((emp: any) => (
            <tr key={emp.id} className="hover:bg-slate-50 group">
              <td className="p-3 text-sm font-bold text-slate-700 border-b border-r sticky left-0 bg-white z-10 group-hover:bg-primary-50">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={events.filter((e: any) => e.resource.employeeId === emp.id).every((e: any) => selectedIds.includes(e.id)) && events.some((e: any) => e.resource.employeeId === emp.id)}
                    onChange={() => {
                      const empShiftIds = events.filter((e: any) => e.resource.employeeId === emp.id).map((e: any) => e.id);
                      empShiftIds.forEach((id: string) => onToggleSelect(id));
                    }}
                    className="rounded border-slate-300 text-primary-600 focus:ring-primary-500 h-4 w-4"
                  />
                  {emp.firstName} {emp.lastName}
                </div>
              </td>
              {days.map(d => {
                const shift = events.find((e: any) => e.resource.employeeId === emp.id && moment(e.start).date() === d);
                const dayDate = moment().date(d).startOf('day');

                const absence = absences.find((a: any) => {
                  const start = moment(a.startDate).startOf('day');
                  const end = moment(a.endDate).endOf('day');
                  return a.employeeId === emp.id && dayDate.isBetween(start, end, null, '[]');
                });

                return (
                  <td key={d} className="p-1 border-b">
                    {shift ? (
                      <div
                        onClick={(e) => {
                          if (e.shiftKey || e.ctrlKey) {
                            onToggleSelect(shift.id);
                          } else {
                            onEventClick(shift);
                          }
                        }}
                        className={`h-8 rounded-lg flex items-center justify-center text-[10px] font-black text-white cursor-pointer shadow-sm transition-all hover:scale-105 relative ${selectedIds.includes(shift.id) ? 'ring-2 ring-offset-2 ring-primary-600 scale-105' : ''} ${shift.resource.conflictStatus === 'CRITICAL' ? 'bg-rose-500 animate-pulse' : shift.start.getHours() >= 18 || shift.start.getHours() < 6 ? 'bg-indigo-900' : 'bg-primary-500'}`}
                      >
                        {moment(shift.start).format('HH')}
                        {selectedIds.includes(shift.id) && <div className="absolute -top-1 -right-1 h-3 w-3 bg-primary-600 rounded-full border border-white flex items-center justify-center"><CheckCircle2 size={8} /></div>}
                      </div>
                    ) : absence ? (
                      <div
                        className="h-8 rounded-lg bg-rose-100 border border-rose-200 flex items-center justify-center text-[9px] font-black text-rose-600 cursor-help"
                        title={`Incapacidad/Ausencia: ${absence.absenceTypeCode}`}
                      >
                        {absence.absenceTypeCode}
                      </div>
                    ) : <div className="h-8 bg-slate-50/50 rounded-lg"></div>}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShiftsPage;
