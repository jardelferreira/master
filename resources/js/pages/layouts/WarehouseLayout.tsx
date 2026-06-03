import { PropsWithChildren } from 'react';
import FlashMessage from '@/components/alerts/SweetAlertFlashMessage';

import WarehouseHeader from '@/pages/components/warehouse/WarehouseHeader';
import WarehouseSidebar from '@/pages/components/warehouse/WarehouseSidebar';

export default function WarehouseLayout({
    children,
}: PropsWithChildren) {
    return (
        <div className="flex min-h-screen bg-gradient-to-b from-gray-200 to-gray-100">
            <WarehouseSidebar />

            <div className="flex flex-1 flex-col">
                <WarehouseHeader />
                <FlashMessage />

                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}