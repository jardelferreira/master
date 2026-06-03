import { Head, router, usePage } from '@inertiajs/react';
import { Warehouse, ArrowRight } from 'lucide-react';

type Project = {
    id: number;
    uuid: string;
    name: string;
};

type WarehouseIndexProps = {
    projects: Project[];
};

export default function WarehouseIndex() {
    const { projects } = usePage<WarehouseIndexProps>().props;

    return (
        <>
            <Head title="Warehouse" />

            <div className="min-h-screen bg-slate-50">
                <div className="mx-auto max-w-7xl px-6 py-10">
                    {/* Header */}
                    <div className="mb-10">
                        <div className="flex items-center gap-3">
                            <div className="rounded-2xl bg-blue-600 p-3 text-white shadow-lg">
                                <Warehouse size={24} />
                            </div>

                            <div>
                                <h1 className="text-3xl font-bold text-slate-900">
                                    Warehouse
                                </h1>

                                <p className="mt-1 text-sm text-slate-500">
                                    Selecione o projeto para operar o estoque.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Empty */}
                    {projects.length === 0 && (
                        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                            <Warehouse
                                size={40}
                                className="mx-auto text-slate-300"
                            />

                            <h2 className="mt-4 text-lg font-semibold text-slate-800">
                                Nenhum projeto disponível
                            </h2>

                            <p className="mt-2 text-sm text-slate-500">
                                Você não possui acesso a projetos no warehouse.
                            </p>
                        </div>
                    )}

                    {/* Projects */}
                    {projects.length > 0 && (
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {projects.map((project) => (
                                <button
                                    key={project.id}
                                    onClick={() =>
                                        router.visit(
                                            route(
                                                'warehouse.projects.show',
                                                project.id,
                                            ),
                                        )
                                    }
                                    className="group rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                                                Projeto
                                            </p>

                                            <h3 className="mt-2 text-xl font-semibold text-slate-900">
                                                {project.name}
                                            </h3>
                                        </div>

                                        <div className="rounded-2xl bg-slate-100 p-3 text-slate-500 transition group-hover:bg-blue-50 group-hover:text-blue-600">
                                            <ArrowRight size={18} />
                                        </div>
                                    </div>

                                    <div className="mt-8">
                                        <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                            Acessar warehouse
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}