import StatusBadge from "@/components/shared/info/StatusBadge";

interface InventoryStatus {
    label: string;
    badge: string;
}

interface Props {
    status: InventoryStatus;
}

export default function InventoryStatusBadge({ status }: Props) {
    return <StatusBadge status={status} />;
}