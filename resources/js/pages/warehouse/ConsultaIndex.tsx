import { Head, router, usePage } from '@inertiajs/react';
import { Search, ChevronRight, Package, Inbox } from 'lucide-react';
import { useState, useMemo } from 'react';
import ConsultaLayout from '../layouts/ConsultaLayout';

// ─── Types ───────────────────────────────────────────────────────────────────

type Project = {
    id: number;
    name: string;
    initials: string | null;
    description: string | null;
};

type Props = {
    user: { name: string };
    projects: Project[];
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ConsultaIndex() {
    const { user, projects } = usePage<Props>().props;

    const [search, setSearch] = useState('');

    const filtered = useMemo(
        () =>
            projects.filter((p) =>
                p.name.toLowerCase().includes(search.toLowerCase()),
            ),
        [projects, search],
    );

    function goToProject(project: Project) {
        router.visit(
            route('stock.projects.estoque', project.id),
        );
    }

    return (
        <>
            <Head title="Consulta de Estoque" />

            <div className="space-y-8">

                {/* ── Saudação ───────────────────────────────────────────── */}
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-400">
                        Bem-vindo
                    </p>
                    <h1 className="mt-1 text-3xl font-bold tracking-tight text-white md:text-4xl">
                        {firstName(user.name)}
                    </h1>
                    <p className="mt-2 text-sm text-white/40">
                        Selecione um projeto para consultar o estoque.
                    </p>
                </div>

                {/* ── Busca ──────────────────────────────────────────────── */}
                {projects.length > 4 && (
                    <div className="relative">
                        <Search
                            size={15}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                        />
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar projeto..."
                            className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder-white/25 outline-none transition focus:border-violet-500/50 focus:bg-white/8 sm:max-w-xs"
                        />
                    </div>
                )}

                {/* ── Lista de projetos ──────────────────────────────────── */}
                {filtered.length === 0 ? (
                    <EmptyState hasSearch={search !== ''} />
                ) : (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {filtered.map((project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                onClick={() => goToProject(project)}
                            />
                        ))}
                    </div>
                )}

                {/* Contador */}
                {filtered.length > 0 && (
                    <p className="text-xs text-white/25">
                        {filtered.length}{' '}
                        projeto{filtered.length !== 1 ? 's' : ''} disponíve{filtered.length !== 1 ? 'is' : 'l'}
                    </p>
                )}
            </div>
        </>
    );
}

ConsultaIndex.layout = (page: React.ReactNode) => (
    <ConsultaLayout>{page}</ConsultaLayout>
);

// ─── Project card ─────────────────────────────────────────────────────────────

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
                group relative w-full overflow-hidden rounded-2xl
                border border-white/8 bg-white/4
                p-5 text-left
                transition
                hover:border-violet-500/40 hover:bg-violet-500/8
                active:scale-[0.98]
            "
        >
            {/* Glow no hover */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 ring-1 ring-violet-500/30 transition group-hover:opacity-100" />

            <div className="flex items-start justify-between gap-3">
                {/* Initials avatar */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-sm font-bold text-violet-300">
                    {initials(project)}
                </div>

                <ChevronRight
                    size={16}
                    className="mt-0.5 shrink-0 text-white/20 transition group-hover:translate-x-0.5 group-hover:text-violet-400"
                />
            </div>

            <div className="mt-4">
                <h2 className="font-semibold leading-snug text-white/90 group-hover:text-white">
                    {project.name}
                </h2>

                {project.description ? (
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/35">
                        {project.description}
                    </p>
                ) : (
                    <p className="mt-1 text-xs text-white/20">
                        Consultar estoque →
                    </p>
                )}
            </div>

            {/* Accent line bottom */}
            <div className="absolute bottom-0 left-5 right-5 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent opacity-0 transition group-hover:opacity-100" />
        </button>
    );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ hasSearch }: { hasSearch: boolean }) {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-white/20">
                {hasSearch ? <Search size={20} /> : <Inbox size={20} />}
            </div>

            <p className="mt-4 text-sm font-medium text-white/40">
                {hasSearch
                    ? 'Nenhum projeto encontrado'
                    : 'Nenhum projeto disponível'}
            </p>

            <p className="mt-1 text-xs text-white/20">
                {hasSearch
                    ? 'Tente um termo diferente'
                    : 'Você ainda não tem acesso a projetos'}
            </p>
        </div>
    );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function firstName(name: string): string {
    return name.split(' ')[0] ?? name;
}

function initials(project: Project): string {
    if (project.initials) return project.initials.slice(0, 2).toUpperCase();
    return project.name.slice(0, 2).toUpperCase();
}