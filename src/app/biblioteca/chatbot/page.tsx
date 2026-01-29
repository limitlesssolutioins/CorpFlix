'use client';

import Link from 'next/link';
import { ArrowLeft, MessageSquare, Sparkles, FileText, Zap } from 'lucide-react';

export default function ChatbotPage() {
    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <Link
                    href="/biblioteca"
                    className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold mb-4 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Volver a Biblioteca
                </Link>
                <h1 className="text-3xl font-black text-slate-900 mb-2">Chatbot Asesor Inteligente</h1>
                <p className="text-slate-600">
                    Asistente basado en IA que responde preguntas sobre tu documentación
                </p>
            </div>

            {/* Placeholder Content */}
            <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-emerald-50 rounded-2xl p-12 border-2 border-dashed border-purple-300 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-10 h-10 text-white" />
                </div>

                <h2 className="text-2xl font-black text-slate-900 mb-4">Próximamente: Chatbot Asesor con IA</h2>
                <p className="text-lg text-slate-700 mb-8 max-w-2xl mx-auto">
                    Estamos trabajando en un asistente inteligente que utilizará tecnología RAG (Retrieval Augmented Generation)
                    para responder tus preguntas basándose en todos los documentos de la biblioteca.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 border border-slate-200">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <MessageSquare className="w-6 h-6 text-purple-600" />
                        </div>
                        <h3 className="font-bold text-slate-900 mb-2">Preguntas en Lenguaje Natural</h3>
                        <p className="text-sm text-slate-600">
                            Haz preguntas como si estuvieras hablando con un experto
                        </p>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-slate-200">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="font-bold text-slate-900 mb-2">Respuestas Contextualizadas</h3>
                        <p className="text-sm text-slate-600">
                            Respuestas basadas en tus documentos con citas precisas
                        </p>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-slate-200">
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <Zap className="w-6 h-6 text-emerald-600" />
                        </div>
                        <h3 className="font-bold text-slate-900 mb-2">Respuestas Instantáneas</h3>
                        <p className="text-sm text-slate-600">
                            Encuentra información en segundos sin buscar manualmente
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-slate-200 max-w-2xl mx-auto text-left">
                    <h3 className="font-bold text-slate-900 mb-3">Ejemplos de Preguntas:</h3>
                    <ul className="space-y-2 text-sm text-slate-700">
                        <li className="flex items-start gap-2">
                            <span className="text-purple-600 font-bold">•</span>
                            <span>"¿Cuáles son los requisitos del capítulo 7 de ISO 9001?"</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-purple-600 font-bold">•</span>
                            <span>"¿Cómo se realiza el procedimiento de control de documentos?"</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-purple-600 font-bold">•</span>
                            <span>"Muéstrame la política de calidad actualizada"</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-purple-600 font-bold">•</span>
                            <span>"¿Qué formatos debo usar para auditorías internas?"</span>
                        </li>
                    </ul>
                </div>

                <div className="mt-8">
                    <div className="inline-block px-6 py-3 bg-slate-200 text-slate-600 rounded-xl font-bold cursor-not-allowed">
                        <MessageSquare className="w-5 h-5 inline mr-2" />
                        Función en Desarrollo
                    </div>
                </div>
            </div>

            {/* Tech Info */}
            <div className="mt-8 bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-3">Tecnología Planificada:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
                    <div>
                        <span className="font-semibold text-slate-900">RAG (Retrieval Augmented Generation):</span> Combina búsqueda semántica con generación de respuestas
                    </div>
                    <div>
                        <span className="font-semibold text-slate-900">Vector Database:</span> Embeddings para búsqueda por similitud semántica
                    </div>
                    <div>
                        <span className="font-semibold text-slate-900">LLM Integration:</span> OpenAI GPT-4 o modelos similares
                    </div>
                    <div>
                        <span className="font-semibold text-slate-900">Document Processing:</span> Extracción y chunk de texto de PDFs/Word
                    </div>
                </div>
            </div>
        </div>
    );
}
