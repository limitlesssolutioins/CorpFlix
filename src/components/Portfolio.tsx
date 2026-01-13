import Image from 'next/image';

interface PortfolioItem {
  title: string;
  description: string;
  imageUrl: string;
}

interface PortfolioProps {
  portfolio: PortfolioItem[];
}

export default function Portfolio({ portfolio }: PortfolioProps) {
  return (
    <section className="portfolio-section">
      <h2 className="portfolio-title">Nuestro Portafolio</h2>
      <div className="portfolio-grid">
        {portfolio.map((item) => (
          <div key={item.title} className="portfolio-item">
            <Image src={item.imageUrl} alt={item.title} width={400} height={250} className="portfolio-item-image" />
            <div className="portfolio-item-content">
              <h3 className="portfolio-item-title">{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}