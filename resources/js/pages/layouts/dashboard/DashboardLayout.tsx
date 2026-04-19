import { PropsWithChildren, useState } from 'react';
import Header from '@/pages/components/dashboard/Header';
import { Sidebar } from '@/pages/components/dashboard/Sidebar';
import { navigation } from '@/pages/config/SidebarDashboard';
import FlashMessage from '@/components/alerts/SweetAlertFlashMessage';
import { usePage } from '@inertiajs/react';
import { buildNavigation } from '@/pages/config/buildSidebarNavgation';

export default function DashboardLayout({ children }: PropsWithChildren) {
    const {props} = usePage();
    const navigation = buildNavigation(props?.projects || [] as any)
    return (
        <div className="flex min-h-screen bg-gradient-to-b to-gray-100 from-gray-200 ">
            <Sidebar navigation={navigation} />
            {/* Main */}
            <div className="flex flex-1 flex-col">
                <Header />
                <FlashMessage />
                {children}
            </div>
        </div>
    );
}
