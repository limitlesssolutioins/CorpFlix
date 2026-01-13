
interface CompanySummaryProps {
  summary: string;
  logoUrl: string;
  nit: string;
  direccion: string;
  telefono: string;
  email: string;
  website: string;
}

const CompanySummary = ({ summary, logoUrl, nit, direccion, telefono, email, website }: CompanySummaryProps) => {
  return (
    <section className="company-summary">
      <div className="summary-logo">
        <img src={logoUrl || '/logo.png'} alt="Company Logo" className="company-logo" />
      </div>
      <div className="summary-details">
        <p className="summary-text">{summary || 'Resumen de la empresa no disponible.'}</p>
        <ul className="contact-info">
          <li><strong>NIT:</strong> {nit}</li>
          <li><strong>Dirección:</strong> {direccion}</li>
          <li><strong>Teléfono:</strong> {telefono}</li>
          <li><strong>Email:</strong> {email}</li>
          <li><strong>Website:</strong> <a href={`https://${website}`} target="_blank" rel="noopener noreferrer">{website}</a></li>
        </ul>
      </div>
    </section>
  );
};

export default CompanySummary;
