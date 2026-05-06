'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, Download, TrendingUp, AlertCircle, CheckCircle2, BarChart3, PieChart } from 'lucide-react';

interface Audit {
    id: number;
    audit_code: string;
    audit_date: string;
    auditor_name: string;
    scope: string;
    status: string;
}

interface Finding {
    id: number;
    chapter_number: string;
    chapter_title: string;
    requirement_code: string;
    requirement_title: string;
    finding_type_name: string;
    finding_color: string;
    finding_description: string;
    evidence: string;
}

export default function ReportesPage() {
    const [audits, setAudits] = useState<Audit[]>([]);
    const [selectedAuditId, setSelectedAuditId] = useState<number | null>(null);
    const [selectedAudit, setSelectedAudit] = useState<Audit | null>(null);
    const [findings, setFindings] = useState<Finding[]>([]);
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [loadingReport, setLoadingReport] = useState(false);

    useEffect(() => {
        fetchAudits();
        fetchDashboardData();
    }, []);

    useEffect(() => {
        if (selectedAuditId) {
            fetchAuditReport(selectedAuditId);
        }
    }, [selectedAuditId]);

    const fetchAudits = async () => {
        try {
            const response = await fetch('/api/auditoria/audits?status=COMPLETED');
            const data = await response.json();
            setAudits(data);
        } catch (error) {
            console.error('Error fetching audits:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDashboardData = async () => {
        try {
            const response = await fetch('/api/auditoria/dashboard');
            const data = await response.json();
            setDashboardData(data);
        } catch (error) {
            console.error('Error fetching dashboard:', error);
        }
    };

    const fetchAuditReport = async (auditId: number) => {
        setLoadingReport(true);
        try {
            // Get audit info
            const auditResponse = await fetch(`/api/auditoria/audits`);
            const auditsData = await auditResponse.json();
            const audit = auditsData.find((a: Audit) => a.id === auditId);
            setSelectedAudit(audit || null);

            // Get findings
            const findingsResponse = await fetch(`/api/auditoria/findings?audit_id=${auditId}`);
            const findingsData = await findingsResponse.json();
            setFindings(findingsData);
        } catch (error) {
            console.error('Error fetching audit report:', error);
        } finally {
            setLoadingReport(false);
        }
    };

    const calculateAuditStats = () => {
        if (!findings.length) return null;

        const conformities = findings.filter(f => f.finding_type_name === 'CONFORMIDAD').length;
        const observations = findings.filter(f => f.finding_type_name === 'OBSERVACIÓN').length;
        const ncMenor = findings.filter(f => f.finding_type_name === 'NO CONFORMIDAD MENOR').length;
        const ncMayor = findings.filter(f => f.finding_type_name === 'NO CONFORMIDAD MAYOR').length;
        const total = findings.length;
        const compliancePercent = total > 0 ? Math.round((conformities / total) * 100) : 0;

        return { conformities, observations, ncMenor, ncMayor, total, compliancePercent };
    };

    const groupFindingsByChapter = () => {
        const grouped: Record<string, Finding[]> = {};
        findings.forEach(finding => {
            const key = `${finding.chapter_number}. ${finding.chapter_title}`;
            if (!grouped[key]) {
                grouped[key] = [];
            }
            grouped[key].push(finding);
        });
        return grouped;
    };

    const handleExport = () => {
        alert('🚧 Funcionalidad de exportación en desarrollo.\nSe generará un informe en Excel/PDF con todos los detalles de la auditoría.');
    };

    const stats = calculateAuditStats();
    const groupedFindings = groupFindingsByChapter();

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <Link
                    href="/auditoria"
                    className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold mb-4 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Volver al Dashboard
                </Link>
                <h1 className="text-3xl font-black text-slate-900 mb-2">Reportes de Auditoría</h1>
                <p className="text-slate-600">
                    Genera informes detallados y análisis de cumplimiento ISO 9001
                </p>
            </div>

            {/* Audit Selector */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-8">
                <div className="flex items-center gap-4">
                    <FileText className="w-6 h-6 text-blue-600" />
                    <div className="flex-1">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Seleccionar Auditoría para Informe Detallado</label>
                        <select
                            value={selectedAuditId || ''}
                            onChange={(e) => setSelectedAuditId(Number(e.target.value))}
                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Selecciona una auditoría completada...</option>
                            {audits.map((audit) => (
                                <option key={audit.id} value={audit.id}>
                                    {audit.audit_code} - {new Date(audit.audit_date).toLocaleDateString('es-ES')} - {audit.auditor_name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Individual Audit Report */}
            {selectedAuditId && selectedAudit && (
                <div className="space-y-6 mb-8">
                    {/* Report Header */}
                    <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 border border-blue-200 shadow-sm">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 mb-2">Informe de Auditoría</h2>
                                <p className="text-lg font-bold text-blue-600">{selectedAudit.audit_code}</p>
                            </div>
                            <button
                                onClick={handleExport}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold shadow-sm"
                            >
                                <Download size={20} />
                                Exportar Informe
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Fecha</div>
                                <div className="text-sm font-semibold text-slate-900">{new Date(selectedAudit.audit_date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                            </div>
                            <div>
                                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Auditor</div>
                                <div className="text-sm font-semibold text-slate-900">{selectedAudit.auditor_name}</div>
                            </div>
                            <div>
                                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Alcance</div>
                                <div className="text-sm font-semibold text-slate-900">{selectedAudit.scope || 'Sistema completo'}</div>
                            </div>
                        </div>
                    </div>

                    {loadingReport ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <>
                            {/* Executive Summary */}
                            {stats && (
                                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                        <BarChart3 className="w-6 h-6 text-blue-600" />
                                        Resumen Ejecutivo
                                    </h3>

                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                                        <div className="bg-slate-50 rounded-xl p-4 text-center">
                                            <div className="text-3xl font-black text-slate-900">{stats.total}</div>
                                            <div className="text-xs text-slate-600 mt-1 font-semibold">Total Hallazgos</div>
                                        </div>
                                        <div className="bg-green-50 rounded-xl p-4 text-center">
                                            <div className="text-3xl font-black text-green-600">{stats.conformities}</div>
                                            <div className="text-xs text-green-700 mt-1 font-semibold">Conformidades</div>
                                        </div>
                                        <div className="bg-yellow-50 rounded-xl p-4 text-center">
                                            <div className="text-3xl font-black text-yellow-600">{stats.observations}</div>
                                            <div className="text-xs text-yellow-700 mt-1 font-semibold">Observaciones</div>
                                        </div>
                                        <div className="bg-orange-50 rounded-xl p-4 text-center">
                                            <div className="text-3xl font-black text-orange-600">{stats.ncMenor}</div>
                                            <div className="text-xs text-orange-700 mt-1 font-semibold">NC Menores</div>
                                        </div>
                                        <div className="bg-red-50 rounded-xl p-4 text-center">
                                            <div className="text-3xl font-black text-red-600">{stats.ncMayor}</div>
                                            <div className="text-xs text-red-700 mt-1 font-semibold">NC Mayores</div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-300">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-sm font-bold text-blue-900 mb-1">Porcentaje de Cumplimiento</div>
                                                <div className="text-4xl font-black text-blue-600">{stats.compliancePercent}%</div>
                                            </div>
                                            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center border-4 border-blue-600">
                                                <span className="text-2xl font-black text-blue-600">{stats.compliancePercent}%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Findings by Chapter */}
                            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                                <h3 className="text-xl font-bold text-slate-900 mb-6">Hallazgos por Capítulo ISO 9001</h3>

                                {Object.entries(groupedFindings).length === 0 ? (
                                    <p className="text-slate-500 text-center py-8">No se han registrado hallazgos para esta auditoría</p>
                                ) : (
                                    <div className="space-y-6">
                                        {Object.entries(groupedFindings).map(([chapter, chapterFindings]) => (
                                            <div key={chapter} className="border border-slate-200 rounded-xl p-4">
                                                <h4 className="font-bold text-slate-900 mb-4">{chapter}</h4>
                                                <div className="space-y-3">
                                                    {chapterFindings.map((finding) => (
                                                        <div key={finding.id} className="pl-4 border-l-4" style={{ borderColor: finding.finding_color }}>
                                                            <div className="flex items-start gap-3">
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <span
                                                                            className="inline-block px-2 py-1 rounded text-xs font-bold text-white"
                                                                            style={{ backgroundColor: finding.finding_color }}
                                                                        >
                                                                            {finding.finding_type_name}
                                                                        </span>
                                                                        <span className="text-xs font-mono text-slate-500">{finding.requirement_code}</span>
                                                                    </div>
                                                                    <p className="text-sm font-semibold text-slate-700 mb-1">{finding.requirement_title}</p>
                                                                    {finding.finding_description && (
                                                                        <p className="text-sm text-slate-600"><strong>Descripción:</strong> {finding.finding_description}</p>
                                                                    )}
                                                                    {finding.evidence && (
                                                                        <p className="text-sm text-slate-600 mt-1"><strong>Evidencia:</strong> {finding.evidence}</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Consolidated Reports Section */}
            {dashboardData && (
                <div className="space-y-6">
                    <div className="border-t-2 border-slate-200 pt-8">
                        <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
                            <TrendingUp className="w-7 h-7 text-blue-600" />
                            Reportes Consolidados
                        </h2>
                    </div>

                    {/* Overall Compliance */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Cumplimiento General por Capítulo</h3>
                        <div className="space-y-3">
                            {dashboardData.complianceByChapter?.map((chapter: any) => {
                                const percent = chapter.total_requirements > 0
                                    ? Math.round((chapter.conformities / chapter.total_requirements) * 100)
                                    : 0;

                                return (
                                    <div key={chapter.chapter_number} className="flex items-center gap-4">
                                        <div className="w-2/5">
                                            <span className="text-sm font-semibold text-slate-900">{chapter.chapter_number}. {chapter.chapter_title}</span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 bg-slate-200 rounded-full h-3">
                                                    <div
                                                        className={`h-3 rounded-full transition-all ${percent >= 80 ? 'bg-green-600' : percent >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                        style={{ width: `${percent}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-black text-slate-900 w-12 text-right">{percent}%</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-6 border border-green-200 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <CheckCircle2 className="w-8 h-8 text-green-600" />
                                <h3 className="text-lg font-bold text-slate-900">Auditorías del Año</h3>
                            </div>
                            <div className="text-4xl font-black text-green-600 mb-2">{dashboardData.auditsThisYear || 0}</div>
                            <p className="text-sm text-slate-600">De {dashboardData.totalAudits || 0} totales</p>
                        </div>

                        <div className="bg-gradient-to-br from-yellow-50 to-white rounded-2xl p-6 border border-yellow-200 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <PieChart className="w-8 h-8 text-yellow-600" />
                                <h3 className="text-lg font-bold text-slate-900">Total de Hallazgos</h3>
                            </div>
                            <div className="text-4xl font-black text-yellow-600 mb-2">{dashboardData.totalFindings || 0}</div>
                            <p className="text-sm text-slate-600">{dashboardData.nonConformities || 0} no conformidades</p>
                        </div>

                        <div className="bg-gradient-to-br from-orange-50 to-white rounded-2xl p-6 border border-orange-200 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <AlertCircle className="w-8 h-8 text-orange-600" />
                                <h3 className="text-lg font-bold text-slate-900">Acciones Pendientes</h3>
                            </div>
                            <div className="text-4xl font-black text-orange-600 mb-2">{dashboardData.openActions || 0}</div>
                            <p className="text-sm text-slate-600">{dashboardData.overdueActions || 0} vencidas</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
