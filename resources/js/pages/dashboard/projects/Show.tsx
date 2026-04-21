import { usePage } from "@inertiajs/react";
import Card from "@/pages/components/projects/Card";
import DashboardLayout from "@/pages/layouts/dashboard/DashboardLayout";
import { Package, Layers, DollarSign, AlertTriangle, CirclePlus, User2, FileBox } from "lucide-react";
import { StockSection } from "@/pages/components/projects/StockSectionList";
import { stockMock } from "@/mocks/stockMock";
import { useState } from "react";
import CreateProjectModal from "@/pages/components/projects/CreateProjectModal";
import CreateSectorModal from "@/pages/components/sectors/CreateSectorModal";
import { SimpleUser } from "@/types/user";
import ProjectManageModal from "@/pages/components/projects/ProjectManageModal";
import { Sector } from "@/pages/components/projects/ProjectSectorsModal";

type Props = {
    project: { name: string, id: number, description: string, initials:string, sectors: any[],users: SimpleUser[] };
    users: SimpleUser[];
    sectors: Sector[];
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
    const { project, metrics, users,sectors } = props;
    const [createOpen, setCreateOpen] = useState(true)
    const [createModalOpen, setCreateModalOpen] = useState(false)
    const [managerModalOpen, setManagerModalOpen] = useState(false)

    const { url } = usePage();

    const params = new URLSearchParams(url.split('?')[1]);
    const modal = params.get('modal');
    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto p-6 space-y-6">

                 {/* ── HEADER ── */}
<div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6 py-5">
    <div className="flex items-center justify-between gap-4">

        {/* ESQUERDA */}
        <div className="flex items-center gap-4 min-w-0">

            {/* 🔥 BADGE COM INICIAIS */}
            <div
                className={`
                    flex items-center justify-center
                    rounded-2xl text-white font-semibold tracking-wide
                    px-4 h-12 min-w-[48px]
                    transition-all duration-300
                    ${project.initials
                        ? 'bg-blue-600 shadow-md shadow-blue-200'
                        : 'bg-slate-200 text-slate-400'}
                `}
            >
                <span className="whitespace-nowrap text-sm leading-tight">
                    {project.initials || '···'}
                </span>
            </div>

            {/* TEXTO */}
            <div className="min-w-0">

                {/* LABEL */}
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                    Projeto
                </p>

                {/* NOME */}
                <h1 className="text-lg font-semibold text-slate-900 leading-tight truncate">
                    {project.name}
                </h1>

                {/* 🔥 DESCRIÇÃO */}
                {project.description && (
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                        {project.description}
                    </p>
                )}

            </div>
        </div>

        {/* DIREITA */}
        <div className="flex items-center gap-2 flex-shrink-0">

            <button
                onClick={() => setManagerModalOpen(true)}
                className="
                    px-4 py-2 text-sm rounded-xl cursor-pointer
                    border border-slate-200 text-slate-600
                    hover:bg-slate-50 font-medium transition
                "
            >
                Gerenciar
            </button>

            <button
                onClick={() => setCreateModalOpen(true)}
                className="
                    px-4 py-2 text-sm rounded-xl cursor-pointer
                    bg-blue-600 text-white hover:bg-blue-700
                    font-medium transition
                    inline-flex items-center gap-2
                "
            >
                <CirclePlus />
                Novo Setor
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
                    <Card
                        title="Setores"
                        value={project.sectors.length}
                        icon={<Layers size={16} />}
                        variant="green"
                    />
                    <Card
                        title="Usuários"
                        value={project.users.length}
                        icon={<User2 size={16} />}
                        variant="primary"
                    />
                    <Card
                        title="Notas"
                        value={59}
                        icon={<FileBox size={16} />}
                        variant="danger"
                    />
                    <Card
                        title="Estoque baixo"
                        value={metrics.low_stock}
                        icon={<AlertTriangle size={16} />}
                        variant="warning"
                    />
                </div>

                {/* ── STOCK ── */}
                <StockSection stock={stockMock} sectorsReal={project.sectors} />
                {modal === 'create' &&
                    <CreateProjectModal open={createOpen} onClose={() => setCreateOpen(false)}></CreateProjectModal>
                }
                <CreateSectorModal open={createModalOpen} onClose={() => setCreateModalOpen(false)} projectId={project.id}></CreateSectorModal>
                <ProjectManageModal
                open={managerModalOpen}
                onClose={() => setManagerModalOpen(false)}
                project={project}
                users={users}
                ></ProjectManageModal>
            </div>
        </div>
    );
}

ProjectDashboard.layout = (page: React.ReactNode) => (
    <DashboardLayout>{page}</DashboardLayout>
);