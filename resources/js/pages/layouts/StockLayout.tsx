import { PropsWithChildren } from 'react';
import FlashMessage from '@/components/alerts/SweetAlertFlashMessage';

import WarehouseHeader from '@/pages/components/warehouse/WarehouseHeader';
import StockSidebar from '../components/public-stock/StockSidebar';
import StockConsultaHeader from '../components/warehouse/StockConsultaHeader';

export default function StockLayout({
    children,
}: PropsWithChildren) {
    return (
        <div className="flex min-h-screen bg-gradient-to-b from-gray-200 to-gray-100">
            <StockSidebar />

            <div className="flex flex-1 flex-col">
                <StockConsultaHeader />
                <FlashMessage />

                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}