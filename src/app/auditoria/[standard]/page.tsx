import { redirect } from 'next/navigation';

export default async function StandardDashboardRedirect({ params }: { params: Promise<{ standard: string }> }) {
    const { standard } = await params;
    redirect(`/auditoria/${standard}/auditorias`);
}
