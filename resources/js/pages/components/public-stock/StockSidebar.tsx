import { Sidebar } from '@/pages/components/dashboard/Sidebar';
import { buildStockNavigation } from '@/pages/config/buildPublicStockNavigation';
import { usePage } from '@inertiajs/react';

export default function StockSidebar() {
    const { projects } = usePage().props as any;

    const navigation =
        buildStockNavigation(projects);

    return <Sidebar navigation={navigation as any} />;
}