import { Head } from '@inertiajs/react';
import DashboardLayout from '@/pages/layouts/dashboard/DashboardLayout';
import { StatCard } from '@/components/StatCard';

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />
            {/* Cards */}
            <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard title="Usuários" value="3.782" trend="+11%" />

                <StatCard title="Certificados" value="5.359" trend="-9%" />

                <StatCard title="Empresas" value="128" trend="+4%" />

                <StatCard title="Cursos" value="42" trend="+2%" />
            </section>
        </>
    );
}

Dashboard.layout = (page: React.ReactNode) => (
    <DashboardLayout>{page}</DashboardLayout>
);
