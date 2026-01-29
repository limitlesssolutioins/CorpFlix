import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Users,
  Layers,
  Zap,
  Plus,
  Trash2,
  UserPlus,
  X,
  ChevronRight,
  Clock,
  Calendar,
  CheckCircle2,
  Settings2
} from 'lucide-react';

const SchedulerPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'teams' | 'patterns' | 'wizard'>('wizard');
  const [teams, setTeams] = useState<any[]>([]);
  const [patterns, setPatterns] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);

  // Wizard State
  const [wizTeam, setWizTeam] = useState('');
  const [wizPattern, setWizPattern] = useState('');
  const [wizStart, setWizStart] = useState('');
  const [wizEnd, setWizEnd] = useState('');

  // Team Management State
  const [newTeamName, setNewTeamName] = useState('');
  const [manageTeamId, setManageTeamId] = useState<string | null>(null);

  // Pattern Builder State
  const [newPatternName, setNewPatternName] = useState('');
  const [patternDays, setPatternDays] = useState<{ type: string, start: string, end: string }[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const t = await axios.get('/api/scheduler/teams');
      const p = await axios.get('/api/scheduler/patterns');
      const e = await axios.get('/api/employees');
      setTeams(t.data);
      setPatterns(p.data);
      setEmployees(e.data);
    } catch (e) { console.error(e); }
  };

  const handleGenerate = async () => {
    if (!wizTeam || !wizPattern || !wizStart || !wizEnd) return;
    try {
      await axios.post('/api/scheduler/generate', {
        teamId: wizTeam,
        patternId: wizPattern,
        startDate: wizStart,
        endDate: wizEnd
      });
      alert('Programación generada con éxito');
    } catch (error) {
      alert('Error al generar programación.');
    }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName) return;
    await axios.post('/api/scheduler/teams', { name: newTeamName });
    setNewTeamName('');
    fetchData();
  };

  const savePattern = async () => {
    if (!newPatternName || patternDays.length === 0) return;
    await axios.post('/api/scheduler/patterns', {
      name: newPatternName,
      description: `${patternDays.length} días de ciclo`,
      sequence: patternDays
    });
    setNewPatternName('');
    setPatternDays([]);
    fetchData();
  };

  const handleNotify = () => {
    alert("🚀 Enviando notificaciones de turnos a todo el equipo vía WhatsApp...\n\nCada colaborador recibirá su horario personalizado para el periodo seleccionado.");
  };

  const TabButton = ({ id, label, icon: Icon }: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all border-b-2 ${activeTab === id
          ? 'border-primary-600 text-primary-600 bg-primary-50/30'
          : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
        }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
          <Zap className="text-primary-600" fill="currentColor" size={32} />
          Programador
        </h1>
        <p className="text-slate-500 mt-2">Carga masiva de turnos y gestión de cuadrillas operativas.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-200 bg-slate-50/50">
          <TabButton id="wizard" label="Asistente de Carga" icon={Zap} />
          <TabButton id="teams" label="Gestión de Equipos" icon={Users} />
          <TabButton id="patterns" label="Patrones de Turnos" icon={Layers} />
        </div>

        <div className="p-8">
          {/* --- WIZARD --- */}
          {activeTab === 'wizard' && (
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center p-3 bg-primary-100 text-primary-600 rounded-full mb-2">
                  <Zap size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Generación Automática</h3>
                <p className="text-sm text-slate-500">Aplica un patrón de turnos a un equipo completo en segundos.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Equipo de Trabajo</label>
                  <select
                    value={wizTeam}
                    onChange={e => setWizTeam(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  >
                    <option value="">Seleccione un equipo</option>
                    {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Patrón de Rotación</label>
                  <select
                    value={wizPattern}
                    onChange={e => setWizPattern(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  >
                    <option value="">Seleccione un patrón</option>
                    {patterns.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Fecha Inicio</label>
                  <input
                    type="date"
                    value={wizStart}
                    onChange={e => setWizStart(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Fecha Fin</label>
                  <input
                    type="date"
                    value={wizEnd}
                    onChange={e => setWizEnd(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={!wizTeam || !wizPattern || !wizStart || !wizEnd}
                className="w-full py-4 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 text-white rounded-xl font-bold shadow-lg shadow-primary-500/30 transition-all flex items-center justify-center gap-2"
              >
                <Zap size={20} />
                Procesar Programación Inteligente
              </button>

              <button
                onClick={handleNotify}
                className="w-full py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
              >
                Notificar al Personal (WhatsApp)
              </button>
            </div>
          )}

          {/* --- TEAMS --- */}
          {activeTab === 'teams' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <form onSubmit={handleCreateTeam} className="flex gap-2">
                  <input
                    placeholder="Nombre del nuevo equipo..."
                    value={newTeamName}
                    onChange={e => setNewTeamName(e.target.value)}
                    className="flex-1 p-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button type="submit" className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors">
                    <Plus size={20} />
                    Crear
                  </button>
                </form>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {teams.map(t => (
                    <div key={t.id} className="p-5 bg-white border border-slate-200 rounded-2xl hover:border-primary-500 transition-all group">
                      <div className="flex justify-between items-start mb-4">
                        <div className="h-12 w-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                          <Users size={24} />
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => setManageTeamId(t.id)}
                            className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          >
                            <Settings2 size={18} />
                          </button>
                          <button
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      <h4 className="font-bold text-slate-900 text-lg">{t.name}</h4>
                      <p className="text-sm text-slate-500 mt-1">{t.employees.length} Integrantes asignados</p>
                      <div className="mt-4 flex -space-x-2">
                        {[...Array(Math.min(t.employees.length, 5))].map((_, i) => (
                          <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                            {t.employees[i]?.firstName[0]}
                          </div>
                        ))}
                        {t.employees.length > 5 && (
                          <div className="h-8 w-8 rounded-full border-2 border-white bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white">
                            +{t.employees.length - 5}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* PANEL GESTIÓN MIEMBROS */}
              <div className={`bg-slate-50 rounded-2xl p-6 border-2 border-dashed ${manageTeamId ? 'border-primary-200' : 'border-slate-200'} transition-all`}>
                {manageTeamId ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-slate-900">Integrantes</h3>
                      <button onClick={() => setManageTeamId(null)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                    </div>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Añadir al equipo</p>
                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                      {employees.map(emp => (
                        <div key={emp.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                          <span className="text-sm font-medium text-slate-700">{emp.firstName} {emp.lastName}</span>
                          <button
                            onClick={() => emp.teamId === manageTeamId ? null : null}
                            className={`p-1.5 rounded-lg ${emp.teamId === manageTeamId ? 'text-rose-500 hover:bg-rose-50' : 'text-primary-600 hover:bg-primary-50'}`}
                          >
                            {emp.teamId === manageTeamId ? <X size={18} /> : <Plus size={18} />}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-3 opacity-50">
                    <UserPlus size={48} className="text-slate-300" />
                    <p className="text-sm font-medium text-slate-500">Selecciona un equipo para<br />gestionar sus miembros</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* --- PATTERNS --- */}
          {activeTab === 'patterns' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="p-6 bg-slate-900 rounded-3xl text-white shadow-xl">
                  <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
                    <Layers size={24} className="text-primary-400" />
                    Constructor de Patrones
                  </h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nombre Comercial</label>
                      <input
                        placeholder="Ej: Rotativo 2x2x2"
                        value={newPatternName}
                        onChange={e => setNewPatternName(e.target.value)}
                        className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Configuración del Ciclo</label>
                      <div className="space-y-2">
                        {patternDays.map((day, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-3 bg-slate-800/50 rounded-xl border border-slate-700 group">
                            <span className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-400">{idx + 1}</span>
                            <select
                              value={day.type}
                              onChange={e => {
                                const n = [...patternDays];
                                n[idx].type = e.target.value;
                                setPatternDays(n);
                              }}
                              className="bg-transparent text-sm font-bold outline-none"
                            >
                              <option value="D">Laboral</option>
                              <option value="R">Descanso</option>
                            </select>
                            {day.type === 'D' && (
                              <div className="flex items-center gap-2 ml-auto">
                                <Clock size={14} className="text-slate-500" />
                                <input type="time" value={day.start} className="bg-transparent text-xs" />
                                <span className="text-slate-600">-</span>
                                <input type="time" value={day.end} className="bg-transparent text-xs" />
                              </div>
                            )}
                            <button onClick={() => setPatternDays(patternDays.filter((_, i) => i !== idx))} className="ml-auto p-1.5 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all"><X size={16} /></button>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => setPatternDays([...patternDays, { type: 'D', start: '06:00', end: '14:00' }])}
                        className="w-full py-3 border-2 border-dashed border-slate-700 rounded-xl text-sm font-bold text-slate-400 hover:border-primary-500 hover:text-primary-400 transition-all flex items-center justify-center gap-2"
                      >
                        <Plus size={18} /> Añadir día al ciclo
                      </button>
                    </div>

                    <button
                      onClick={savePattern}
                      className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold shadow-lg shadow-primary-500/20 transition-all"
                    >
                      Guardar Patrón Maestro
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="font-bold text-slate-900 flex items-center justify-between">
                  Patrones Registrados
                  <span className="text-xs px-2 py-1 bg-slate-100 rounded-full text-slate-500">{patterns.length}</span>
                </h3>
                <div className="space-y-4">
                  {patterns.map(p => {
                    const seq = JSON.parse(p.sequence);
                    return (
                      <div key={p.id} className="p-5 bg-white border border-slate-200 rounded-2xl hover:shadow-md transition-shadow relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-bold text-slate-800">{p.name}</h4>
                          <button className="text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={16} /></button>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {seq.map((s: any, i: number) => (
                            <div key={i} className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter ${s.type === 'R' ? 'bg-slate-100 text-slate-400' : 'bg-primary-50 text-primary-600'}`}>
                              {s.type === 'R' ? 'OFF' : 'ON'}
                            </div>
                          ))}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-4 uppercase font-bold tracking-widest flex items-center gap-1">
                          <Calendar size={10} /> Ciclo de {seq.length} días
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchedulerPage;
