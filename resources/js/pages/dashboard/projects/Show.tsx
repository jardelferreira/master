import { usePage } from "@inertiajs/react";
import Card from "@/pages/components/projects/Card";
import DashboardLayout from "@/pages/layouts/dashboard/DashboardLayout";
import { Package, Layers, DollarSign, AlertTriangle } from "lucide-react";
import { StockSection } from "@/pages/components/projects/StockSectionList";
import { stockMock } from "@/mocks/stockMock";

type Props = {
    project: { name: string };
    metrics: {
        total_products: number;
        total_stock: number;
        total_cost: number;
        low_stock: number;
    };
    stock_summary: any[];
};

export default function ProjectDashboard() {
    const { props } = usePage<Props>();
    const { project, metrics } = props;

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto p-6 space-y-6">

                {/* ── HEADER ── */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6 py-5">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            {/* ÍCONE DO PROJETO */}
                            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                                <Layers size={18} className="text-white" />
                            </div>

                            <div>
                                <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">
                                    Projeto
                                </p>
                                <h1 className="text-xl font-semibold text-slate-900 leading-tight">
                                    {project.name}
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button className="px-4 py-2 text-sm rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium transition">
                                Gerenciar
                            </button>
                            <button className="px-4 py-2 text-sm rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-medium transition">
                                Nova movimentação
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── KPIs ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <Card
                        title="Estoque total"
                        value={metrics.total_stock}
                        icon={<Package size={16} />}
                        variant="primary"
                    />
                    <Card
                        title="Produtos"
                        value={metrics.total_products}
                        icon={<Layers size={16} />}
                        variant="default"
                    />
                    <Card
                        title="Custo total"
                        value={`R$ ${metrics.total_cost.toLocaleString("pt-BR")}`}
                        icon={<DollarSign size={16} />}
                        variant="default"
                    />
                    <Card
                        title="Estoque baixo"
                        value={metrics.low_stock}
                        icon={<AlertTriangle size={16} />}
                        variant="warning"
                    />
                </div>

                {/* ── STOCK ── */}
                <StockSection stock={stockMock} />
            </div>
        </div>
    );
}

ProjectDashboard.layout = (page: React.ReactNode) => (
    <DashboardLayout>{page}</DashboardLayout>
);