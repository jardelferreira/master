import {
    AlertTriangle,
    CheckCircle2,
    ClipboardCheck,
    Package,
} from 'lucide-react';

import KPI from '@/components/shared/kpi/Kpi';
import KPIGrid from '@/components/shared/kpi/KpiGrid';

interface Statistics {
    items: number;
    counted: number;
    pending: number;
    adjustments: number;
}

interface Props {
    statistics: Statistics;
}

export default function InventoryStatistics({
    statistics,
}: Props) {
    return (
        <KPIGrid columns={4}>
            <KPI
                title="Itens"
                value={statistics.items}
                description="Produtos do inventário"
                icon={<Package size={18} />}
            />

            <KPI
                title="Contados"
                value={statistics.counted}
                description="Itens conferidos"
                icon={<CheckCircle2 size={18} />}
            />

            <KPI
                title="Pendentes"
                value={statistics.pending}
                description="Aguardando conferência"
                icon={<ClipboardCheck size={18} />}
            />

            <KPI
                title="Ajustes"
                value={statistics.adjustments}
                description="Diferenças encontradas"
                icon={<AlertTriangle size={18} />}
            />
        </KPIGrid>
    );
}