import { redirect } from 'next/navigation';

export default function StandardDashboardRedirect({ params }: { params: { standard: string } }) {
    redirect(`/auditoria/${params.standard}/auditorias`);
}
