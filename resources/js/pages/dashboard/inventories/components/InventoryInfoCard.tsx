import {
    Calendar,
    FolderKanban,
    Package,
    ShieldCheck,
    User,
} from 'lucide-react';

import Card from '@/components/shared/card/Card';
import CardBody from '@/components/shared/card/CardBody';
import CardHeader from '@/components/shared/card/CardHeader';

import InventoryStatusBadge from './InventoryStatusBadge';

interface Inventory {
    status: any;
    project: any;
    sector: any;
    blind_count: boolean;

    due_date: string | null;

    created_at: {
        formatted: string | null;
    };

    finished_at: {
        formatted: string | null;
    };

    approved_at: {
        formatted: string | null;
    };

    creator: any;
    approver: any;
}

interface Props {
    inventory: Inventory;
}

function Item({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
}) {
    return (
        <div className="flex items-start gap-3 rounded-lg border border-base-200 p-4">

            <div className="mt-0.5 text-core-600">
                {icon}
            </div>

            <div className="min-w-0 flex-1">

                <p className="text-xs font-medium uppercase tracking-wide text-base-500">
                    {label}
                </p>

                <div className="mt-1 font-medium text-base-900">
                    {value}
                </div>

            </div>

        </div>
    );
}

export default function InventoryInfoCard({
    inventory,
}: Props) {
    return (
        <Card>

            <CardHeader>

                <h2 className="text-lg font-semibold">
                    Informações Gerais
                </h2>

            </CardHeader>

            <CardBody>

                <div className="grid gap-4 md:grid-cols-2">

                    <Item
                        icon={<ShieldCheck size={18} />}
                        label="Status"
                        value={
                            <InventoryStatusBadge
                                status={inventory.status}
                            />
                        }
                    />

                    <Item
                        icon={<Calendar size={18} />}
                        label="Prazo"
                        value={
                            inventory.due_date ??
                            '-'
                        }
                    />

                    <Item
                        icon={<FolderKanban size={18} />}
                        label="Projeto"
                        value={inventory.project.name}
                    />

                    <Item
                        icon={<Package size={18} />}
                        label="Setor"
                        value={inventory.sector.name}
                    />

                    <Item
                        icon={<User size={18} />}
                        label="Criado por"
                        value={
                            inventory.creator?.name ??
                            '-'
                        }
                    />

                    <Item
                        icon={<Calendar size={18} />}
                        label="Criado em"
                        value={
                            inventory.created_at
                                .formatted ?? '-'
                        }
                    />

                    <Item
                        icon={<User size={18} />}
                        label="Aprovado por"
                        value={
                            inventory.approver?.name ??
                            '-'
                        }
                    />

                    <Item
                        icon={<Calendar size={18} />}
                        label="Aprovado em"
                        value={
                            inventory.approved_at
                                .formatted ?? '-'
                        }
                    />

                    <Item
                        icon={<Package size={18} />}
                        label="Inventário Cego"
                        value={
                            inventory.blind_count
                                ? 'Sim'
                                : 'Não'
                        }
                    />

                    <Item
                        icon={<Calendar size={18} />}
                        label="Finalizado em"
                        value={
                            inventory.finished_at
                                .formatted ?? '-'
                        }
                    />

                </div>

            </CardBody>

        </Card>
    );
}