import DashboardLayout from '@/pages/layouts/dashboard/DashboardLayout';
import type { ComponentType, ReactNode } from 'react';

import InventoryHeader from './components/InventoryHeader';
import InventoryInfoCard from './components/InventoryInfoCard';
import InventoryItemsTable from './components/InventoryItemsTable';
import InventoryStatistics from './components/InventoryStatistics';
import InventoryUsersCard from './components/InventoryUsersCard';

import { useState } from 'react';

import InventoryItemViewer from './components/InventoryItemViewer';

import PageSection from '@/components/shared/page/PageSection';
import { InventoryItemRow } from './components/Columns';
import FlashMessage from '@/components/alerts/SweetAlertFlashMessage';

const TypedDashboardLayout = DashboardLayout as ComponentType<{ title: string; children?: ReactNode }>;

interface Props {
    inventory: any;
}

export default function Show({
    inventory,
}: Props) {

    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
    const [items, setItems] = useState<InventoryItemRow[]>(inventory.items);
    const [statistics, setStatistics] = useState(inventory.statistics);
    const [status, setStatus] = useState(inventory.status);

    const handleCount = (item: InventoryItemRow) => {
        setSelectedItemId(item.id);
    };

    return (
        <TypedDashboardLayout
            title={inventory.name}
        >
            <div className="space-y-6">

                <InventoryHeader
                
                    inventory={{ ...inventory, status }}
                />
                <PageSection>

                    <InventoryStatistics
                        statistics={statistics}
                    />

                </PageSection>

                <PageSection>

                    <div className="grid gap-6 lg:grid-cols-3">

                        <div className="lg:col-span-2">

                            <InventoryInfoCard
                                inventory={inventory}
                            />

                        </div>

                        <div>

                            <InventoryUsersCard
                                inventory={inventory}
                            />

                        </div>

                    </div>

                </PageSection>

                <PageSection>

                    <InventoryItemsTable
                        items={items}
                        onCount={handleCount}
                    />

                </PageSection>

            </div>
            <InventoryItemViewer
                isOpen={selectedItemId !== null}
                inventoryItemId={selectedItemId}
                onClose={() => setSelectedItemId(null)}
                onSaved={({ item, statistics: newStatistics, status: newStatus }) => {
                    setItems(current =>
                        current.map(i => i.id === item.id ? item : i)
                    );
                    setStatistics(newStatistics);
                    setStatus(newStatus);
                }}
            />
        </TypedDashboardLayout>
    );
}