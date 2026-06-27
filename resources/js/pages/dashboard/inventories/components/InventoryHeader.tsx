import { PageHeader } from '@/pages/components/dashboard/PageHeader';

import InventoryActionButtons from './InventoryActionButtons';
import InventoryStatusBadge from './InventoryStatusBadge';

interface InventoryStatus {
    label: string;
    badge: string;
    permissions: {
        can_finish: boolean;
        can_cancel: boolean;
        can_approve: boolean;
    };
}

interface InventoryProject {
    name: string;
}

interface InventorySector {
    name: string;
}

interface Inventory {
    id: number;
    name: string;
    status: InventoryStatus;
    project: InventoryProject;
    sector: InventorySector;
}

interface Props {
    inventory: Inventory;
}

export default function InventoryHeader({
    inventory,
}: Props) {
    return (
        <PageHeader
            title={inventory.name}
            description={`${inventory.project.name} • ${inventory.sector.name}`}
            actions={
                <div className="flex items-center gap-3">
                    <InventoryStatusBadge
                        status={inventory.status}
                    />

                    <InventoryActionButtons
                        inventory={inventory}
                    />
                </div>
            }
        />
    );
}