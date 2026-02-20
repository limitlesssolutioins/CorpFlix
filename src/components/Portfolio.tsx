import { FaLayerGroup, FaArrowRight } from 'react-icons/fa';

interface PortfolioItem {
  title: string;
  description: string;
  imageUrl: string;
}

interface PortfolioProps {
  portfolio: PortfolioItem[];
}

const Portfolio = ({ portfolio }: PortfolioProps) => {
  return (
    <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50 h-full">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
          <FaLayerGroup size={20} />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900">Portafolio de Servicios</h3>
          <p className="text-sm text-slate-400 font-medium">Nuestras Soluciones Integrales</p>
        </div>
      </div>

      <div className="space-y-6">
        {portfolio.map((item, index) => (
          <div key={index} className="group p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-emerald-200 hover:shadow-lg transition-all cursor-default">
            {item.imageUrl && (
              <div className="mb-4 h-32 w-full overflow-hidden rounded-xl border border-slate-200 bg-white">
                <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
              </div>
            )}
            <h4 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
              {item.title}
            </h4>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              {item.description}
            </p>
            <div className="flex items-center gap-2 text-xs font-black text-emerald-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
              Ver Detalles <FaArrowRight />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Portfolio;
