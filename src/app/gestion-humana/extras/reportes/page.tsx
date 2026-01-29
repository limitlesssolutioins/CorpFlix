'use client';

import { Download, FileText } from 'lucide-react';

export default function ExtrasReportesPage() {
    return (
        <div>
            <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900">Reportes de Horas Extras</h3>
                <p className="text-sm text-slate-600">Genera informes y análisis de horas extras</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                    { title: 'Reporte Mensual', description: 'Consolidado de horas extras por mes' },
                    { title: 'Reporte por Empleado', description: 'Detalle individual de cada empleado' },
                    { title: 'Análisis de Costos', description: 'Costos totales de horas extras' },
                    { title: 'Histórico Anual', description: 'Resumen del año completo' }
                ].map((report, idx) => (
                    <div key={idx} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
                        <FileText className="w-8 h-8 text-blue-600 mb-3" />
                        <h4 className="font-bold text-slate-900 mb-2">{report.title}</h4>
                        <p className="text-sm text-slate-600 mb-4">{report.description}</p>
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm">
                            <Download size={16} />
                            Generar Reporte
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
