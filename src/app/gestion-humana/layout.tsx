'use client';

export default function GestionHumanaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Main Content: Se elimina la barra de navegación superior duplicada */}
            <main className="p-8 animate-in fade-in duration-500">
                {children}
            </main>
        </div>
    );
}
