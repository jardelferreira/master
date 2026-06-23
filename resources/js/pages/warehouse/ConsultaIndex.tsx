// resources/js/pages/warehouse/ConsultaIndex.tsx

import { Head, router, usePage } from '@inertiajs/react';
import { Search, ChevronRight, FolderOpen } from 'lucide-react';
import { useMemo, useState } from 'react';
import ConsultaLayout from '../layouts/ConsultaLayout';

type Project = {
    id: number;
    name: string;
    initials: string | null;
    description: string | null;
};

type Props = {
    user: {
        name: string;
    };
    projects: Project[];
};

export default function ConsultaIndex() {
    const { user, projects } = usePage<Props>().props;

    const [search, setSearch] = useState('');

    const filtered = useMemo(
        () =>
            projects.filter((project) =>
                project.name.toLowerCase().includes(search.toLowerCase()),
            ),
        [projects, search],
    );

    function goToProject(project: Project) {
        router.visit(route('stock.projects.estoque', project.id));
    }

    return (
        <>
            <Head title="Consulta de Estoque" />

            <div className="max-w-7xl mx-auto p-6 space-y-6">

                {/* HEADER */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6 py-5">
                    <div className="flex items-center justify-between gap-4">

                        <div>
                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                                Consulta de Estoque
                            </p>

                            <h1 className="text-2xl font-semibold text-slate-900 mt-1">
                                Olá, {firstName(user.name)}
                            </h1>

                            <p className="text-sm text-slate-500 mt-1">
                                Selecione um projeto para consultar o estoque.
                            </p>
                        </div>

                        <div className="hidden md:flex items-center justify-center h-12 w-12 rounded-xl bg-blue-50 text-blue-600">
                            <FolderOpen size={22} />
                        </div>
                    </div>
                </div>

                {/* BUSCA */}
                {projects.length > 4 && (
                    <div className="relative max-w-xl">
                        <Search
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar projeto..."
                            className="
                                w-full
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                py-3
                                pl-10
                                pr-4
                                text-sm
                                shadow-sm
                                outline-none
                                transition
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-100
                            "
                        />
                    </div>
                )}

                {/* LISTA */}
                {filtered.length === 0 ? (
                    <EmptyState hasSearch={search !== ''} />
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {filtered.map((project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                onClick={() => goToProject(project)}
                            />
                        ))}
                    </div>
                )}

                {/* CONTADOR */}
                {filtered.length > 0 && (
                    <p className="text-sm text-slate-500">
                        {filtered.length}{' '}
                        projeto{filtered.length !== 1 ? 's' : ''} disponível
                        {filtered.length !== 1 ? 'eis' : ''}
                    </p>
                )}
            </div>
        </>
    );
}

ConsultaIndex.layout = (page: React.ReactNode) => (
    <ConsultaLayout>{page}</ConsultaLayout>
);

function ProjectCard({
    project,
    onClick,
}: {
    project: Project;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="
                group
                w-full
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                text-left
                shadow-sm
                transition-all
                hover:border-blue-300
                hover:shadow-md
            "
        >
            <div className="flex items-start justify-between gap-3">

                <div
                    className="
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-xl
                        bg-blue-100
                        text-sm
                        font-semibold
                        text-blue-700
                    "
                >
                    {initials(project)}
                </div>

                <ChevronRight
                    size={18}
                    className="
                        text-slate-400
                        transition-transform
                        group-hover:translate-x-1
                    "
                />
            </div>

            <div className="mt-4">
                <h2 className="font-semibold text-slate-900">
                    {project.name}
                </h2>

                {project.description ? (
                    <p className="mt-2 text-sm text-slate-500 line-clamp-2">
                        {project.description}
                    </p>
                ) : (
                    <p className="mt-2 text-sm text-slate-400">
                        Consultar estoque
                    </p>
                )}
            </div>
        </button>
    );
}

function EmptyState({ hasSearch }: { hasSearch: boolean }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm py-16">
            <div className="flex flex-col items-center text-center px-6">

                <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                    <Search size={20} className="text-slate-400" />
                </div>

                <h3 className="mt-4 font-medium text-slate-900">
                    {hasSearch
                        ? 'Nenhum projeto encontrado'
                        : 'Nenhum projeto disponível'}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                    {hasSearch
                        ? 'Tente utilizar outro termo de busca.'
                        : 'Você ainda não possui acesso a projetos.'}
                </p>
            </div>
        </div>
    );
}

function firstName(name: string): string {
    return name.split(' ')[0] ?? name;
}

function initials(project: Project): string {
    if (project.initials) {
        return project.initials.slice(0, 2).toUpperCase();
    }

    return project.name.slice(0, 2).toUpperCase();
}