import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Independientes - Gestión Humana',
    description: 'Gestión y cálculo de seguridad social para contratistas',
};

export default function IndependientesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}