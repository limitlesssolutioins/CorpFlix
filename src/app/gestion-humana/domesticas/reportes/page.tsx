'use client';

import { Download, FileText } from 'lucide-react';

export default function DomesticasReportesPage() {
    return (
        <div>
            <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900">Reportes Personal Doméstico</h3>
                <p className="text-sm text-slate-600">Informes y certificados para empleados domésticos</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                    { title: 'Certificado Laboral', description: 'Certificado de trabajo y salario' },
                    { title: 'Comprobante de Pago', description: 'Desprendible de nómina mensual' },
                    { title: 'Liquidación de Prestaciones', description: 'Detalle de cesantías, primas y vacaciones' },
                    { title: 'Histórico de Pagos', description: 'Registro completo de pagos realizados' }
                ].map((report, idx) => (
                    <div key={idx} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
                        <FileText className="w-8 h-8 text-rose-600 mb-3" />
                        <h4 className="font-bold text-slate-900 mb-2">{report.title}</h4>
                        <p className="text-sm text-slate-600 mb-4">{report.description}</p>
                        <button className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-semibold text-sm">
                            <Download size={16} />
                            Generar Reporte
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
