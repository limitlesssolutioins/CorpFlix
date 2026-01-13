
'use client';

import { useState, useEffect } from 'react';

interface StrategicObjective {
  id: number;
  text: string;
}

interface Policy {
  id: number;
  text: string;
}

interface StrategicData {
  mission: string;
  vision: string;
  policies: Policy[];
  objectives: StrategicObjective[];
  strengths: string; // New field for Strengths
  weaknesses: string; // New field for Weaknesses
  opportunities: string; // New field for Opportunities
  threats: string; // New field for Threats
  political: string; // New field for Political
  economic: string; // New field for Economic
  social: string; // New field for Social
  technological: string; // New field for Technological
  environmental: string; // New field for Environmental
  legal: string; // New field for Legal
}

const PlaneacionEstrategicaPage = () => {
  const [mission, setMission] = useState('');
  const [vision, setVision] = useState('');
  const [policies, setPolicies] = useState<Policy[]>([{ id: 1, text: '' }]);
  const [objectives, setObjectives] = useState<StrategicObjective[]>([{ id: 1, text: '' }]);
  const [strengths, setStrengths] = useState(''); // New state
  const [weaknesses, setWeaknesses] = useState(''); // New state
  const [opportunities, setOpportunities] = useState(''); // New state
  const [threats, setThreats] = useState(''); // New state
  const [political, setPolitical] = useState(''); // New state
  const [economic, setEconomic] = useState(''); // New state
  const [social, setSocial] = useState(''); // New state
  const [technological, setTechnological] = useState(''); // New state
  const [environmental, setEnvironmental] = useState(''); // New state
  const [legal, setLegal] = useState(''); // New state
  const [nextPolicyId, setNextPolicyId] = useState(2);
  const [nextObjectiveId, setNextObjectiveId] = useState(2);
  const [editMissionVision, setEditMissionVision] = useState(false); // New state for edit mode
  const [editSWOT, setEditSWOT] = useState(false); // New state for SWOT edit mode
  const [editPESTEL, setEditPESTEL] = useState(false); // New state for PESTEL edit mode
  const [editPolicies, setEditPolicies] = useState(false); // New state for Policies edit mode
  const [editObjectives, setEditObjectives] = useState(false); // New state for Objectives edit mode

  const storageKey = 'strategicPlanningData';

  useEffect(() => {
    const storedData = localStorage.getItem(storageKey);
    if (storedData) {
      const data: StrategicData = JSON.parse(storedData);
      setMission(data.mission || '');
      setVision(data.vision || '');
      setStrengths(data.strengths || ''); // Load SWOT
      setWeaknesses(data.weaknesses || ''); // Load SWOT
      setOpportunities(data.opportunities || ''); // Load SWOT
      setThreats(data.threats || ''); // Load SWOT
      setPolitical(data.political || ''); // Load PESTEL
      setEconomic(data.economic || ''); // Load PESTEL
      setSocial(data.social || ''); // Load PESTEL
      setTechnological(data.technological || ''); // Load PESTEL
      setEnvironmental(data.environmental || ''); // Load PESTEL
      setLegal(data.legal || ''); // Load PESTEL
      if (data.policies && data.policies.length > 0) {
        setPolicies(data.policies);
        setNextPolicyId(Math.max(...data.policies.map(p => p.id)) + 1);
      } else {
        setPolicies([{ id: 1, text: '' }]);
        setNextPolicyId(2);
      }
      if (data.objectives && data.objectives.length > 0) {
        setObjectives(data.objectives);
        setNextObjectiveId(Math.max(...data.objectives.map(o => o.id)) + 1);
      } else {
        setObjectives([{ id: 1, text: '' }]);
        setNextObjectiveId(2);
      }
    }
  }, []);

  const handleSave = () => {
    const dataToSave: StrategicData = {
      mission,
      vision,
      policies: policies.filter(p => p.text.trim() !== ''),
      objectives: objectives.filter(o => o.text.trim() !== ''),
      strengths, // Save SWOT
      weaknesses, // Save SWOT
      opportunities: opportunities, // Save SWOT
      threats: threats, // Save SWOT
      political: political, // Save PESTEL
      economic: economic, // Save PESTEL
      social: social, // Save PESTEL
      technological: technological, // Save PESTEL
      environmental: environmental, // Save PESTEL
      legal: legal, // Save PESTEL
    };
    localStorage.setItem(storageKey, JSON.stringify(dataToSave));
    alert('Datos de planeación estratégica guardados con éxito.');
  };

  // Handlers for Policies
  const handlePolicyChange = (id: number, text: string) => {
    setPolicies(policies.map(p => (p.id === id ? { ...p, text } : p)));
  };

  const addPolicy = () => {
    setPolicies([...policies, { id: nextPolicyId, text: '' }]);
    setNextPolicyId(nextPolicyId + 1);
  };

  const removePolicy = (id: number) => {
    setPolicies(policies.filter(p => p.id !== id));
  };

  // Handlers for Objectives
  const handleObjectiveChange = (id: number, text: string) => {
    setObjectives(objectives.map(o => (o.id === id ? { ...o, text } : o)));
  };

  const addObjective = () => {
    setObjectives([...objectives, { id: nextObjectiveId, text: '' }]);
    setNextObjectiveId(nextObjectiveId + 1);
  };

  const removeObjective = (id: number) => {
    setObjectives(objectives.filter(o => o.id !== id));
  };

  return (
    <div className="module-container">
      <div className="module-content-card">
        <h1 className="module-title">Módulo: Planeación Estratégica</h1>
        <p className="module-description">Defina la misión, visión, políticas y objetivos que guiarán a su organización.</p>

        {/* Sección de Misión y Visión */}
        <div className="form-section-card mb-8">
          <h2 className="form-section-title">Misión y Visión</h2>
          {editMissionVision ? (
            <div className="form-grid">
              <div className="form-group full-width">
                <label htmlFor="mission" className="form-label">Misión</label>
                <textarea
                  id="mission"
                  className="form-textarea"
                  rows={4}
                  value={mission}
                  onChange={(e) => setMission(e.target.value)}
                  placeholder="Describa la razón de ser de la organización..."
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="vision" className="form-label">Visión</label>
                <textarea
                  id="vision"
                  className="form-textarea"
                  rows={4}
                  value={vision}
                  onChange={(e) => setVision(e.target.value)}
                  placeholder="Describa a dónde quiere llegar la organización en el futuro..."
                />
              </div>
              <button onClick={() => setEditMissionVision(false)} className="feature-button mt-4">Guardar Misión y Visión</button>
            </div>
          ) : (
            <div>
              {mission || vision ? (
                <div className="space-y-4">
                  {mission && (
                    <div>
                      <h3 className="text-lg font-semibold">Misión:</h3>
                      <p className="text-gray-700">{mission}</p>
                    </div>
                  )}
                  {vision && (
                    <div>
                      <h3 className="text-lg font-semibold">Visión:</h3>
                      <p className="text-gray-700">{vision}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">No se ha definido la misión y visión.</p>
              )}
              <button
                onClick={() => setEditMissionVision(true)}
                className="feature-button mt-4"
              >
                {mission || vision ? 'Editar Misión y Visión' : 'Crear Misión y Visión'}
              </button>
            </div>
          )}
        </div>

        {/* Sección de Análisis FODA (SWOT) */}
        <div className="form-section-card mb-8">
          <h2 className="form-section-title">Análisis FODA</h2>
          {editSWOT ? (
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="strengths" className="form-label">Fortalezas</label>
                <textarea
                  id="strengths"
                  className="form-textarea"
                  rows={4}
                  value={strengths}
                  onChange={(e) => setStrengths(e.target.value)}
                  placeholder="Aspectos internos positivos de la organización..."
                />
              </div>
              <div className="form-group">
                <label htmlFor="weaknesses" className="form-label">Debilidades</label>
                <textarea
                  id="weaknesses"
                  className="form-textarea"
                  rows={4}
                  value={weaknesses}
                  onChange={(e) => setWeaknesses(e.target.value)}
                  placeholder="Aspectos internos negativos de la organización..."
                />
              </div>
              <div className="form-group">
                <label htmlFor="opportunities" className="form-label">Oportunidades</label>
                <textarea
                  id="opportunities"
                  className="form-textarea"
                  rows={4}
                  value={opportunities}
                  onChange={(e) => setOpportunities(e.target.value)}
                  placeholder="Factores externos positivos que la organización puede aprovechar..."
                />
              </div>
              <div className="form-group">
                <label htmlFor="threats" className="form-label">Amenazas</label>
                <textarea
                  id="threats"
                  className="form-textarea"
                  rows={4}
                  value={threats}
                  onChange={(e) => setThreats(e.target.value)}
                  placeholder="Factores externos negativos que pueden afectar a la organización..."
                />
              </div>
              <button onClick={() => setEditSWOT(false)} className="feature-button mt-4">Guardar Análisis FODA</button>
            </div>
          ) : (
            <div>
              {strengths || weaknesses || opportunities || threats ? (
                <div className="space-y-4">
                  {strengths && (
                    <div>
                      <h3 className="text-lg font-semibold">Fortalezas:</h3>
                      <p className="text-gray-700">{strengths}</p>
                    </div>
                  )}
                  {weaknesses && (
                    <div>
                      <h3 className="text-lg font-semibold">Debilidades:</h3>
                      <p className="text-gray-700">{weaknesses}</p>
                    </div>
                  )}
                  {opportunities && (
                    <div>
                      <h3 className="text-lg font-semibold">Oportunidades:</h3>
                      <p className="text-gray-700">{opportunities}</p>
                    </div>
                  )}
                  {threats && (
                    <div>
                      <h3 className="text-lg font-semibold">Amenazas:</h3>
                      <p className="text-gray-700">{threats}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">No se ha realizado el análisis FODA.</p>
              )}
              <button
                onClick={() => setEditSWOT(true)}
                className="feature-button mt-4"
              >
                {strengths || weaknesses || opportunities || threats ? 'Editar Análisis FODA' : 'Crear Análisis FODA'}
              </button>
            </div>
          )}
        </div>

        {/* Sección de Análisis PESTEL */}
        <div className="form-section-card mb-8">
          <h2 className="form-section-title">Análisis PESTEL</h2>
          {editPESTEL ? (
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="political" className="form-label">Político</label>
                <textarea
                  id="political"
                  className="form-textarea"
                  rows={4}
                  value={political}
                  onChange={(e) => setPolitical(e.target.value)}
                  placeholder="Factores relacionados con la política gubernamental, estabilidad, leyes, etc."
                />
              </div>
              <div className="form-group">
                <label htmlFor="economic" className="form-label">Económico</label>
                <textarea
                  id="economic"
                  className="form-textarea"
                  rows={4}
                  value={economic}
                  onChange={(e) => setEconomic(e.target.value)}
                  placeholder="Factores económicos como inflación, tasas de interés, crecimiento económico, etc."
                />
              </div>
              <div className="form-group">
                <label htmlFor="social" className="form-label">Social</label>
                <textarea
                  id="social"
                  className="form-textarea"
                  rows={4}
                  value={social}
                  onChange={(e) => setSocial(e.target.value)}
                  placeholder="Factores socioculturales como demografía, estilos de vida, valores culturales, etc."
                />
              </div>
              <div className="form-group">
                <label htmlFor="technological" className="form-label">Tecnológico</label>
                <textarea
                  id="technological"
                  className="form-textarea"
                  rows={4}
                  value={technological}
                  onChange={(e) => setTechnological(e.target.value)}
                  placeholder="Factores tecnológicos como innovación, automatización, desarrollo de nuevas tecnologías, etc."
                />
              </div>
              <div className="form-group">
                <label htmlFor="environmental" className="form-label">Ambiental</label>
                <textarea
                  id="environmental"
                  className="form-textarea"
                  rows={4}
                  value={environmental}
                  onChange={(e) => setEnvironmental(e.target.value)}
                  placeholder="Factores ambientales como regulaciones ecológicas, cambio climático, escasez de recursos, etc."
                />
              </div>
              <div className="form-group">
                <label htmlFor="legal" className="form-label">Legal</label>
                <textarea
                  id="legal"
                  className="form-textarea"
                  rows={4}
                  value={legal}
                  onChange={(e) => setLegal(e.target.value)}
                  placeholder="Factores legales como leyes laborales, derechos del consumidor, regulaciones de salud y seguridad, etc."
                />
              </div>
              <button onClick={() => setEditPESTEL(false)} className="feature-button mt-4">Guardar Análisis PESTEL</button>
            </div>
          ) : (
            <div>
              {political || economic || social || technological || environmental || legal ? (
                <div className="space-y-4">
                  {political && (
                    <div>
                      <h3 className="text-lg font-semibold">Político:</h3>
                      <p className="text-gray-700">{political}</p>
                    </div>
                  )}
                  {economic && (
                    <div>
                      <h3 className="text-lg font-semibold">Económico:</h3>
                      <p className="text-gray-700">{economic}</p>
                    </div>
                  )}
                  {social && (
                    <div>
                      <h3 className="text-lg font-semibold">Social:</h3>
                      <p className="text-gray-700">{social}</p>
                    </div>
                  )}
                  {technological && (
                    <div>
                      <h3 className="text-lg font-semibold">Tecnológico:</h3>
                      <p className="text-gray-700">{technological}</p>
                    </div>
                  )}
                  {environmental && (
                    <div>
                      <h3 className="text-lg font-semibold">Ambiental:</h3>
                      <p className="text-gray-700">{environmental}</p>
                    </div>
                  )}
                  {legal && (
                    <div>
                      <h3 className="text-lg font-semibold">Legal:</h3>
                      <p className="text-gray-700">{legal}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">No se ha realizado el análisis PESTEL.</p>
              )}
              <button
                onClick={() => setEditPESTEL(true)}
                className="feature-button mt-4"
              >
                {political || economic || social || technological || environmental || legal ? 'Editar Análisis PESTEL' : 'Crear Análisis PESTEL'}
              </button>
            </div>
          )}
        </div>

        {/* Sección de Políticas */}
        <div className="form-section-card mb-8">
          <h2 className="form-section-title">Políticas de la Organización</h2>
          {editPolicies ? (
            <div className="space-y-4">
              {policies.map(policy => (
                <div key={policy.id} className="flex items-center">
                  <input
                    type="text"
                    className="form-input flex-grow mr-2"
                    value={policy.text}
                    onChange={(e) => handlePolicyChange(policy.id, e.target.value)}
                    placeholder="Ej: Política de Calidad..."
                  />
                  <button onClick={() => removePolicy(policy.id)} className="button-danger">Eliminar</button>
                </div>
              ))}
              <button onClick={addPolicy} className="feature-button mt-4">Agregar Política</button>
              <button onClick={() => setEditPolicies(false)} className="feature-button mt-4">Guardar Políticas</button>
            </div>
          ) : (
            <div>
              {policies.length > 0 && policies[0].text.trim() !== '' ? (
                <ul className="list-disc list-inside space-y-2">
                  {policies.map(policy => (
                    policy.text.trim() !== '' && <li key={policy.id} className="text-gray-700">{policy.text}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No se han definido políticas.</p>
              )}
              <button
                onClick={() => setEditPolicies(true)}
                className="feature-button mt-4"
              >
                {policies.length > 0 && policies[0].text.trim() !== '' ? 'Editar Políticas' : 'Crear Políticas'}
              </button>
            </div>
          )}
        </div>

        {/* Sección de Objetivos Estratégicos */}
        <div className="form-section-card mb-8">
          <h2 className="form-section-title">Objetivos Estratégicos</h2>
          {editObjectives ? (
            <div className="space-y-4">
              {objectives.map(objective => (
                <div key={objective.id} className="flex items-center">
                  <input
                    type="text"
                    className="form-input flex-grow mr-2"
                    value={objective.text}
                    onChange={(e) => handleObjectiveChange(objective.id, e.target.value)}
                    placeholder="Ej: Incrementar la satisfacción del cliente en un 20%..."
                  />
                  <button onClick={() => removeObjective(objective.id)} className="button-danger">Eliminar</button>
                </div>
              ))}
              <button onClick={addObjective} className="feature-button mt-4">Agregar Objetivo</button>
              <button onClick={() => setEditObjectives(false)} className="feature-button mt-4">Guardar Objetivos</button>
            </div>
          ) : (
            <div>
              {objectives.length > 0 && objectives[0].text.trim() !== '' ? (
                <ul className="list-disc list-inside space-y-2">
                  {objectives.map(objective => (
                    objective.text.trim() !== '' && <li key={objective.id} className="text-gray-700">{objective.text}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No se han definido objetivos estratégicos.</p>
              )}
              <button
                onClick={() => setEditObjectives(true)}
                className="feature-button mt-4"
              >
                {objectives.length > 0 && objectives[0].text.trim() !== '' ? 'Editar Objetivos Estratégicos' : 'Crear Objetivos Estratégicos'}
              </button>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button onClick={handleSave} className="feature-button">Guardar Planeación Estratégica</button>
        </div>
      </div>
    </div>
  );
};

export default PlaneacionEstrategicaPage;
