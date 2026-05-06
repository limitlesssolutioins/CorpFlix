'use client';

import { Download, FileText } from 'lucide-react';

export default function SeguridadSocialReportesPage() {
    return (
        <div>
            <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900">Reportes de Seguridad Social</h3>
                <p className="text-sm text-slate-600">Informes y análisis de aportes</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                    { title: 'Certificado de Ingresos y Retenciones', description: 'Certificado individual por empleado' },
                    { title: 'Resumen Mensual de Aportes', description: 'Consolidado de todos los aportes del mes' },
                    { title: 'Histórico de Pagos PILA', description: 'Registro de planillas enviadas' },
                    { title: 'Proyección Anual de Aportes', description: 'Estimación de costos anuales' }
                ].map((report, idx) => (
                    <div key={idx} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
                        <FileText className="w-8 h-8 text-emerald-600 mb-3" />
                        <h4 className="font-bold text-slate-900 mb-2">{report.title}</h4>
                        <p className="text-sm text-slate-600 mb-4">{report.description}</p>
                        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold text-sm">
                            <Download size={16} />
                            Generar Reporte
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
