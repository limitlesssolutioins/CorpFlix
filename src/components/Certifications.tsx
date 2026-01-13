import Image from 'next/image';

interface Certification {
  name: string;
  logoUrl: string;
}

interface CertificationsProps {
  certifications: Certification[];
}

export default function Certifications({ certifications }: CertificationsProps) {
  return (
    <section className="certifications-section">
      <h2 className="certifications-title">Nuestras Certificaciones</h2>
      <div className="certifications-list">
        {certifications.map((cert) => (
          <div key={cert.name} className="certification-item">
            <Image src={cert.logoUrl} alt={`${cert.name} Logo`} width={100} height={100} />
            <p className="certification-name">{cert.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}