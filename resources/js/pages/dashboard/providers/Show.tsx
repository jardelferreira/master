import { Head, usePage, router } from "@inertiajs/react";
import DashboardLayout from "@/pages/layouts/dashboard/DashboardLayout";
import { PageContainer } from "@/pages/components/PageContainer";
import { formatCurrency } from "@/utils/formatValues";
import { useState } from "react";
import {
    Building2,
    Mail,
    Phone,
    Globe,
    MapPin,
    User,
    FileText,
    Hash,
    CheckCircle,
    XCircle,
    DollarSign,
    RotateCcw,
    ChevronDown,
    ChevronUp,
    Plus,
    Pencil,
    ArrowUpRight,
} from "lucide-react";
import type { PageProps } from "@/types/inertia";
import type { Provider } from "@/pages/dashboard/providers/Index";
import ProviderFormModal from "@/pages/components/providers/ProviderFormModal";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type StatusBadgeShape = { value: string; label: string; color: string };

type InvoiceSummary = {
    id: number;
    number: string;
    series: string;
    type: { value: string; label: string };
    status: StatusBadgeShape;
    total: number;
    taxes: number;
    discount: number;
    issued_at: string | null;
    due_at: string | null;
    paid_at: string | null;
    project: { id: number; name?: string } | null;
    sector: { id: number; name?: string } | null;
    items_count: number;
};

type ProviderStats = {
    total_invoices: number;
    total_value: number;
    paid_value: number;
    pending_value: number;
};

type ProviderShowPageProps = PageProps & {
    provider: Provider;
    invoices: InvoiceSummary[];
    stats: ProviderStats;
};

// ─────────────────────────────────────────────────────────────────────────────
// Design tokens (espelha InvoiceShow)
// ─────────────────────────────────────────────────────────────────────────────

const tk = {
    card: "bg-white border border-blue-100 rounded-2xl shadow-sm",
    cardBlue: "bg-white border border-blue-600 rounded-2xl shadow-sm",
    sectionTitle:
        "text-[11px] font-bold uppercase tracking-widest text-blue-800",
    textPrimary: "text-zinc-900",
    textSecondary: "text-zinc-500",
    textTertiary: "text-zinc-400",
    divider: "border-t border-zinc-100",
};

const BASE_BTN =
    "inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl transition active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer";

// ─────────────────────────────────────────────────────────────────────────────
// StatusBadge
// ─────────────────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: StatusBadgeShape }) {
    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${status.color}`}
        >
            {status.label}
        </span>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// InfoRow
// ─────────────────────────────────────────────────────────────────────────────

function InfoRow({
    icon,
    label,
    value,
    href,
}: {
    icon: React.ReactNode;
    label: string;
    value?: string | null;
    href?: string;
}) {
    return (
        <div className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                {icon}
            </span>
            <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    {label}
                </p>
                {href && value ? (
                    <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-blue-600 hover:underline break-words"
                    >
                        {value}
                    </a>
                ) : (
                    <p className="text-sm font-semibold text-zinc-800 break-words">
                        {value ?? "—"}
                    </p>
                )}
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// StatCard
// ─────────────────────────────────────────────────────────────────────────────

function StatCard({
    label,
    value,
    sub,
    color,
}: {
    label: string;
    value: string;
    sub?: string;
    color: string;
}) {
    return (
        <div className={`${tk.card} p-4 space-y-1`}>
            <p className={`text-[10px] font-bold uppercase tracking-widest ${color}`}>
                {label}
            </p>
            <p className="text-xl font-bold text-zinc-900">{value}</p>
            {sub && <p className="text-xs text-zinc-400">{sub}</p>}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// InvoiceRow — linha da tabela de notas
// ─────────────────────────────────────────────────────────────────────────────

function InvoiceRow({ invoice }: { invoice: InvoiceSummary }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <tr
                className="border-b border-zinc-100 hover:bg-blue-50/40 transition-colors cursor-pointer"
                onClick={() => setOpen((v) => !v)}
            >
                {/* Número / Tipo */}
                <td className="px-4 py-3">
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-zinc-900">
                            {invoice.number}/{invoice.series}
                        </span>
                        <span className="text-[11px] text-zinc-400">
                            {invoice.type.label}
                        </span>
                    </div>
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                    <StatusBadge status={invoice.status} />
                </td>

                {/* Projeto */}
                <td className="px-4 py-3 text-sm text-zinc-600">
                    {invoice.project?.name ?? "—"}
                </td>

                {/* Valor */}
                <td className="px-4 py-3 text-sm font-semibold text-zinc-900 text-right">
                    {formatCurrency(invoice.total)}
                </td>

                {/* Emissão */}
                <td className="px-4 py-3 text-xs text-zinc-500 text-right">
                    {invoice.issued_at
                        ? new Date(invoice.issued_at).toLocaleDateString("pt-BR")
                        : "—"}
                </td>

                {/* Expand + link */}
                <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                router.visit(route("admin.invoices.show", invoice.id));
                            }}
                            className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-600 transition"
                            title="Ver nota"
                        >
                            <ArrowUpRight size={14} />
                        </button>
                        <span className="text-zinc-400">
                            {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </span>
                    </div>
                </td>
            </tr>

            {/* Linha expandida */}
            {open && (
                <tr className="bg-blue-50/30">
                    <td colSpan={6} className="px-6 py-3">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-zinc-600">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-0.5">
                                    Setor
                                </p>
                                <p className="font-semibold">{invoice.sector?.name ?? "—"}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-0.5">
                                    Impostos
                                </p>
                                <p className="font-semibold">{formatCurrency(invoice.taxes)}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-0.5">
                                    Desconto
                                </p>
                                <p className="font-semibold">{formatCurrency(invoice.discount)}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-0.5">
                                    Vencimento
                                </p>
                                <p className="font-semibold">
                                    {invoice.due_at
                                        ? new Date(invoice.due_at).toLocaleDateString("pt-BR")
                                        : "—"}
                                </p>
                            </div>
                            {invoice.paid_at && (
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-0.5">
                                        Pago em
                                    </p>
                                    <p className="font-semibold text-emerald-700">
                                        {new Date(invoice.paid_at).toLocaleDateString("pt-BR")}
                                    </p>
                                </div>
                            )}
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-0.5">
                                    Itens
                                </p>
                                <p className="font-semibold">{invoice.items_count}</p>
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default function ProviderShow() {
    const { provider, invoices, stats } = usePage<ProviderShowPageProps>().props;
  console.log(invoices)
    const [editOpen, setEditOpen] = useState(false);

    const displayName = provider.trade_name || provider.name;

    return (
        <>
            <Head title={`Fornecedor · ${displayName}`} />

            <PageContainer>
                <div className="space-y-3">

                    {/* ── PAGE HEADER ──────────────────────────────────────── */}
                    <div className="bg-white border border-blue-200 rounded-2xl px-6 py-5 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-xl font-semibold text-zinc-900">
                                    {displayName}
                                </h1>
                                <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${
                                        provider.active
                                            ? "bg-emerald-500/20 text-emerald-700"
                                            : "bg-red-500/20 text-red-700"
                                    }`}
                                >
                                    {provider.active ? "Ativo" : "Inativo"}
                                </span>
                            </div>
                            {provider.trade_name && (
                                <p className="text-sm text-zinc-500">{provider.name}</p>
                            )}
                            {provider.document && (
                                <p className="text-sm font-mono text-zinc-400">
                                    {provider.document}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                            <button
                                onClick={() => setEditOpen(true)}
                                className={`${BASE_BTN} border border-blue-200 bg-white text-blue-700 hover:bg-blue-50`}
                            >
                                <Pencil size={14} />
                                Editar
                            </button>
                            <button
                                onClick={() => router.visit(route("admin.invoices.create"))}
                                className={`${BASE_BTN} bg-blue-600 text-white hover:bg-blue-700`}
                            >
                                <Plus size={14} />
                                Nova Nota
                            </button>
                        </div>
                    </div>

                    {/* ── STATS ────────────────────────────────────────────── */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <StatCard
                            label="Total de notas"
                            value={String(stats.total_invoices)}
                            color="text-blue-700"
                        />
                        <StatCard
                            label="Valor total"
                            value={formatCurrency(stats.total_value)}
                            color="text-zinc-500"
                        />
                        <StatCard
                            label="Valor pago"
                            value={formatCurrency(stats.paid_value)}
                            color="text-emerald-700"
                        />
                        <StatCard
                            label="Valor pendente"
                            value={formatCurrency(stats.pending_value)}
                            color="text-amber-700"
                        />
                    </div>

                    {/* ── BODY: notas (2/3) + perfil (1/3) ────────────────── */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">

                        {/* ── NOTAS ────────────────────────────────────────── */}
                        <div className="lg:col-span-2 space-y-3">
                            <p className={tk.sectionTitle}>
                                Notas fiscais ({invoices.length})
                            </p>

                            <div className={`${tk.card} overflow-hidden`}>
                                {invoices.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <FileText
                                            size={32}
                                            className="mx-auto mb-2 text-zinc-300"
                                        />
                                        <p className={`text-sm italic ${tk.textTertiary}`}>
                                            Nenhuma nota fiscal cadastrada para este fornecedor.
                                        </p>
                                    </div>
                                ) : (
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-zinc-100 bg-zinc-50/60">
                                                <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                                    Número
                                                </th>
                                                <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                                    Status
                                                </th>
                                                <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                                    Projeto
                                                </th>
                                                <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-right">
                                                    Valor
                                                </th>
                                                <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-right">
                                                    Emissão
                                                </th>
                                                <th className="px-4 py-2.5 w-20" />
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {invoices.map((inv) => (
                                                <InvoiceRow key={inv.id} invoice={inv} />
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>

                        {/* ── SIDEBAR: perfil ───────────────────────────────── */}
                        <div className="space-y-3">

                            {/* Dados do fornecedor */}
                            <div className={`${tk.cardBlue} p-4 space-y-3`}>
                                <p className={`${tk.sectionTitle} text-center`}>
                                    Perfil do fornecedor
                                </p>

                                <InfoRow
                                    icon={<Building2 size={14} />}
                                    label="Razão Social"
                                    value={provider.name}
                                />
                                {provider.trade_name && (
                                    <InfoRow
                                        icon={<Building2 size={14} />}
                                        label="Nome Fantasia"
                                        value={provider.trade_name}
                                    />
                                )}
                                <InfoRow
                                    icon={<Hash size={14} />}
                                    label="CNPJ / CPF"
                                    value={provider.document}
                                />
                                <InfoRow
                                    icon={<User size={14} />}
                                    label="Contato"
                                    value={provider.contact_name}
                                />

                                <div className={`pt-2 ${tk.divider}`} />

                                <InfoRow
                                    icon={<Mail size={14} />}
                                    label="E-mail"
                                    value={provider.email}
                                    href={provider.email ? `mailto:${provider.email}` : undefined}
                                />
                                <InfoRow
                                    icon={<Phone size={14} />}
                                    label="Telefone"
                                    value={provider.phone}
                                    href={provider.phone ? `tel:${provider.phone}` : undefined}
                                />
                                <InfoRow
                                    icon={<Globe size={14} />}
                                    label="Website"
                                    value={provider.website}
                                    href={provider.website ?? undefined}
                                />

                                <div className={`pt-2 ${tk.divider}`} />

                                <InfoRow
                                    icon={<MapPin size={14} />}
                                    label="Cidade / UF"
                                    value={
                                        [provider.city, provider.state]
                                            .filter(Boolean)
                                            .join(" / ") || null
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </PageContainer>

            {/* Modal de edição */}
            <ProviderFormModal
                open={editOpen}
                onClose={() => setEditOpen(false)}
                provider={provider}
            />
        </>
    );
}

ProviderShow.layout = (page: React.ReactNode) => (
    <DashboardLayout>{page}</DashboardLayout>
);