import { Sidebar } from '@/pages/components/dashboard/Sidebar';
import { buildWarehouseNavigation } from '@/pages/config/buildWarehouseNavigation';
import { usePage } from '@inertiajs/react';

export default function WarehouseSidebar() {
    const { projects } = usePage().props as any;

    const navigation =
        buildWarehouseNavigation(projects);

    return <Sidebar navigation={navigation as any} />;
}