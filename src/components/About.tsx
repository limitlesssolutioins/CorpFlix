interface StrategicItem {
  id: number;
  text: string;
}

interface AboutProps {
  mission: string;
  vision: string;
  policies: StrategicItem[];
  objectives: StrategicItem[];
}

export default function About({ mission, vision, policies, objectives }: AboutProps) {
  return (
    <section className="about-section">
      <h2 className="about-title">Planeación Estratégica</h2>
      <div className="about-content">
        <div className="about-item">
          <h3 className="about-subtitle">Misión</h3>
          <p>{mission || 'No definida'}</p>
        </div>
        <div className="about-item">
          <h3 className="about-subtitle">Visión</h3>
          <p>{vision || 'No definida'}</p>
        </div>
      </div>
      <div className="strategic-lists">
        <div className="strategic-item-list">
          <h3 className="about-subtitle">Políticas</h3>
          <ul>
            {policies && policies.length > 0 ? (
              policies.map(policy => <li key={policy.id}>{policy.text}</li>)
            ) : (
              <li>No hay políticas definidas.</li>
            )}
          </ul>
        </div>
        <div className="strategic-item-list">
          <h3 className="about-subtitle">Objetivos Estratégicos</h3>
          <ul>
            {objectives && objectives.length > 0 ? (
              objectives.map(objective => <li key={objective.id}>{objective.text}</li>)
            ) : (
              <li>No hay objetivos definidos.</li>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}