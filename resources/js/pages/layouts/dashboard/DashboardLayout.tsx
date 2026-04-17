import { PropsWithChildren, useState } from 'react';
import Header from '@/pages/components/dashboard/Header';
import { Sidebar } from '@/pages/components/dashboard/Sidebar';
import { navigation } from '@/pages/config/SidebarDashboard';
import FlashMessage from '@/components/alerts/SweetAlertFlashMessage';

export default function DashboardLayout({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen bg-gradient-to-b to-blue-100 from-blue-200 ">
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
