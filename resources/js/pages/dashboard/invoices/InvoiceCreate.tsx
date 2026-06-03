import { Head, useForm } from "@inertiajs/react";
import { useMemo } from "react";
import DashboardLayout from "@/pages/layouts/dashboard/DashboardLayout";
import { PageContainer } from "@/pages/components/PageContainer";
import { PageCard } from "@/pages/components/PageCard";

type Sector = {
    id: number;
    name: string;
};

type Project = {
    id: number;
    name: string;
    sectors: Sector[];
};

type Provider = {
    id: number;
    name: string;
    trade_name: string;
};

type EnumOption = {
    value: string;
    label: string;
};

type Props = {
    projects: Project[];
    providers: Provider[];
    types: EnumOption[];
    status: EnumOption[];
};

export default function InvoiceCreate({
    projects,
    providers,
    types,
    status,
}: Props) {
    const { data, setData, post, processing, errors } = useForm({
        project_id: "",
        sector_id: "",
        provider_id: "",
        type: "",
        number: "",
        series: "",
        total: "",
        issued_at: "",
        due_at: "",
        status: status.find((s) => s.value === "completed")?.value ?? "",
    });

    const selectedProject = useMemo(
        () => projects.find((p) => p.id === Number(data.project_id)),
        [data.project_id, projects]
    );

    const sectors = selectedProject?.sectors ?? [];

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(route("admin.invoices.store"));
    }

    // ─── Field components ────────────────────────────────────────────────────

    const Field = ({
        label,
        required,
        error,
        children,
    }: {
        label: string;
        required?: boolean;
        error?: string;
        children: React.ReactNode;
    }) => (
        <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-widest ">
                {label}
                {required && <span className="ml-0.5 text-red-500">*</span>}
            </label>
            {children}
            {error && (
                <p className="text-xs font-medium text-red-600">{error}</p>
            )}
        </div>
    );

    const inputBase =
        "w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium  placeholder: transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:";

    const selectBase = `${inputBase} cursor-pointer appearance-none`;

    // ─── Render ──────────────────────────────────────────────────────────────

    return (
        <>
            <Head title="Nova Nota Fiscal" />

            <PageContainer>
                <PageCard>
                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                        {/* ── Header ── */}
                        <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                                    {/* Document icon */}
                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-base font-bold ">
                                        Nova Nota Fiscal
                                    </h1>
                                    <p className="text-xs font-medium ">
                                        Preencha os dados para registrar a nota
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ── Form ── */}
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-8 p-6">

                                {/* Grupo: Vínculo */}
                                <div>
                                    <p className="mb-4 text-[11px] font-bold uppercase tracking-widest ">
                                        Vínculo
                                    </p>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <Field label="Projeto" required error={errors.project_id}>
                                            <div className="relative">
                                                <select
                                                    value={data.project_id}
                                                    onChange={(e) => {
                                                        setData("project_id", e.target.value);
                                                        setData("sector_id", "");
                                                    }}
                                                    className={selectBase}
                                                >
                                                    <option value="">Selecione um projeto</option>
                                                    {projects.map((p) => (
                                                        <option key={p.id} value={p.id}>
                                                            {p.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronIcon />
                                            </div>
                                        </Field>

                                        <Field label="Setor" required error={errors.sector_id}>
                                            <div className="relative">
                                                <select
                                                    value={data.sector_id}
                                                    onChange={(e) => setData("sector_id", e.target.value)}
                                                    disabled={!data.project_id}
                                                    className={selectBase}
                                                >
                                                    <option value="">
                                                        {data.project_id
                                                            ? "Selecione o setor"
                                                            : "Selecione um projeto primeiro"}
                                                    </option>
                                                    {sectors.map((s) => (
                                                        <option key={s.id} value={s.id}>
                                                            {s.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronIcon disabled={!data.project_id} />
                                            </div>
                                        </Field>

                                        <Field label="Fornecedor" required error={errors.provider_id}>
                                            <div className="relative">
                                                <select
                                                    value={data.provider_id}
                                                    onChange={(e) => setData("provider_id", e.target.value)}
                                                    className={selectBase}
                                                >
                                                    <option value="">Selecione o fornecedor</option>
                                                    {providers.map((p) => (
                                                        <option key={p.id} value={p.id}>
                                                            {p.trade_name ?? p.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronIcon />
                                            </div>
                                        </Field>
                                    </div>
                                </div>

                                <Divider />

                                {/* Grupo: Identificação */}
                                <div>
                                    <p className="mb-4 text-[11px] font-bold uppercase tracking-widest ">
                                        Identificação
                                    </p>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                        <Field label="Número" required error={errors.number}>
                                            <input
                                                value={data.number}
                                                onChange={(e) => setData("number", e.target.value)}
                                                placeholder="Ex: 000123"
                                                className={inputBase}
                                            />
                                        </Field>

                                        <Field label="Série" error={errors.series}>
                                            <input
                                                value={data.series}
                                                onChange={(e) => setData("series", e.target.value)}
                                                placeholder="Ex: 001"
                                                className={inputBase}
                                            />
                                        </Field>

                                        <Field label="Tipo" required error={errors.type}>
                                            <div className="relative">
                                                <select
                                                    value={data.type}
                                                    onChange={(e) => setData("type", e.target.value)}
                                                    className={selectBase}
                                                >
                                                    <option value="">Selecione</option>
                                                    {types.map((t) => (
                                                        <option key={t.value} value={t.value}>
                                                            {t.label}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronIcon />
                                            </div>
                                        </Field>
                                    </div>
                                </div>

                                <Divider />

                                {/* Grupo: Valores e datas */}
                                <div>
                                    <p className="mb-4 text-[11px] font-bold uppercase tracking-widest ">
                                        Valores e Datas
                                    </p>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                        <Field label="Total (R$)" required error={errors.total}>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={data.total}
                                                onChange={(e) => setData("total", e.target.value)}
                                                placeholder="0,00"
                                                className={inputBase}
                                            />
                                        </Field>

                                        <Field label="Data de Emissão" required error={errors.issued_at}>
                                            <input
                                                type="datetime-local"
                                                value={data.issued_at}
                                                onChange={(e) => setData("issued_at", e.target.value)}
                                                className={inputBase}
                                            />
                                        </Field>

                                        <Field label="Vencimento" error={errors.due_at}>
                                            <input
                                                type="date"
                                                value={data.due_at}
                                                onChange={(e) => setData("due_at", e.target.value)}
                                                className={inputBase}
                                            />
                                        </Field>
                                    </div>
                                </div>

                                <Divider />

                                {/* Grupo: Status */}
                                <div>
                                    <p className="mb-4 text-[11px] font-bold uppercase tracking-widest ">
                                        Status Inicial
                                    </p>
                                    <div className="max-w-xs">
                                        <Field label="Status" error={errors.status}>
                                            <div className="relative">
                                                <select
                                                    value={data.status}
                                                    onChange={(e) => setData("status", e.target.value)}
                                                    className={selectBase}
                                                >
                                                    {status.map((s) => (
                                                        <option key={s.value} value={s.value}>
                                                            {s.label}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronIcon />
                                            </div>
                                        </Field>
                                    </div>
                                </div>

                            </div>

                            {/* ── Footer / Actions ── */}
                            <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
                                <p className="text-xs font-medium ">
                                    Campos com <span className="text-red-500">*</span> são obrigatórios
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => window.history.back()}
                                        className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold  transition hover:border-slate-400 hover:bg-slate-50 active:scale-[0.98]"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {processing ? (
                                            <>
                                                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                                </svg>
                                                Salvando…
                                            </>
                                        ) : (
                                            "Criar Nota"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </section>
                </PageCard>
            </PageContainer>
        </>
    );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function ChevronIcon({ disabled }: { disabled?: boolean }) {
    return (
        <div
            className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${
                disabled ? "" : ""
            }`}
        >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
        </div>
    );
}

function Divider() {
    return <hr className="border-slate-100" />;
}

// ─── Layout ──────────────────────────────────────────────────────────────────

InvoiceCreate.layout = (page: React.ReactNode) => (
    <DashboardLayout>{page}</DashboardLayout>
);