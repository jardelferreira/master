import { Head, useForm } from "@inertiajs/react";
import { useState, useCallback, useMemo } from "react";
import DashboardLayout from "@/pages/layouts/dashboard/DashboardLayout";
import { PageContainer } from "@/pages/components/PageContainer";
import { PageCard } from "@/pages/components/PageCard";

// ─── Types ────────────────────────────────────────────────────────────────────

type Product = {
    id: number;
    name: string;
    unit: string;
};

type Invoice = {
    id: number;
    number: string;
    series: string;
};

type ItemRow = {
    _key: string;
    product_id: string;
    product_name: string;
    unit: string;
    description: string;
    ca_number: string;
    quantity: string;
    unit_price: string;
    discount: string;
    tax: string;
};

type Props = {
    invoice: Invoice;
    products: Product[];
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const makeKey = () => Math.random().toString(36).slice(2);

const emptyRow = (): ItemRow => ({
    _key: makeKey(),
    product_id: "",
    product_name: "",
    unit: "",
    description: "",
    ca_number: "",
    quantity: "",
    unit_price: "",
    discount: "0",
    tax: "0",
});

const fmt = (n: number) =>
    n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function calcTotal(row: ItemRow): number {
    const qty      = parseFloat(row.quantity)   || 0;
    const price    = parseFloat(row.unit_price) || 0;
    const discount = parseFloat(row.discount)   || 0;
    const tax      = parseFloat(row.tax)        || 0;
    return qty * price - discount + tax;
}

// ─── Primitives ───────────────────────────────────────────────────────────────

const inputBase =
    "w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-100";

const selectBase = `${inputBase} cursor-pointer appearance-none`;

function Field({
    label,
    required,
    error,
    hint,
    children,
    className = "",
}: {
    label: string;
    required?: boolean;
    error?: string;
    hint?: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                {label}
                {required && <span className="ml-0.5 text-red-500">*</span>}
            </label>
            {children}
            {hint && !error && (
                <p className="text-[11px] text-slate-400">{hint}</p>
            )}
            {error && (
                <p className="text-xs font-medium text-red-600">{error}</p>
            )}
        </div>
    );
}

function SelectWrapper({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative">
            {children}
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    );
}

function Spinner() {
    return (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
    );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-slate-400">
            {children}
        </p>
    );
}

function Divider() {
    return <hr className="border-slate-100" />;
}

// ─── Item Row ─────────────────────────────────────────────────────────────────

function ItemRowForm({
    row,
    index,
    products,
    onChange,
    onRemove,
    canRemove,
    errors,
}: {
    row: ItemRow;
    index: number;
    products: Product[];
    onChange: (key: string, field: keyof ItemRow, value: string) => void;
    onRemove: (key: string) => void;
    canRemove: boolean;
    errors: Record<string, string>;
}) {
    const set = (field: keyof ItemRow) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
            onChange(row._key, field, e.target.value);

    const err = (field: string) => errors[`items.${index}.${field}`];

    const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value;
        onChange(row._key, "product_id", id);
        const product = products.find((p) => p.id === Number(id));
        if (product) {
            onChange(row._key, "product_name", product.name);
            onChange(row._key, "unit", product.unit);
        } else {
            onChange(row._key, "product_name", "");
            onChange(row._key, "unit", "");
        }
    };

    const total = calcTotal(row);
    const hasValues = !!(row.quantity && row.unit_price);

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* ── Row Header ── */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-3">
                <div className="flex items-center gap-2.5">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-600 text-[11px] font-bold text-white">
                        {index + 1}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {row.product_name || "Novo item"}
                    </span>
                    {row.unit && (
                        <span className="rounded-md bg-slate-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            {row.unit}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    {hasValues && total > 0 && (
                        <span className="text-xs font-bold text-slate-700">
                            {fmt(total)}
                        </span>
                    )}
                    {canRemove && (
                        <button
                            type="button"
                            onClick={() => onRemove(row._key)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-400 transition hover:bg-red-100 hover:text-red-600"
                            title="Remover item"
                        >
                            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* ── Row Fields ── */}
            <div className="space-y-5 p-5">

                {/* Produto */}
                <Field label="Produto" required error={err("product_id")}>
                    <SelectWrapper>
                        <select
                            value={row.product_id}
                            onChange={handleProductChange}
                            className={selectBase}
                        >
                            <option value="">Selecione um produto</option>
                            {products.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                    </SelectWrapper>
                </Field>

                {/* Descrição */}
                <Field
                    label="Descrição"
                    required
                    error={err("description")}
                    hint="Descreva o item conforme consta na nota fiscal"
                >
                    <input
                        value={row.description}
                        onChange={set("description")}
                        placeholder="Ex: Capacete de segurança classe A"
                        className={inputBase}
                    />
                </Field>

                <Divider />

                {/* Quantidade + Preço + CA */}
                <div>
                    <SectionTitle>Quantidade e valores</SectionTitle>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                        <Field label="Quantidade" required error={err("quantity")}>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={row.quantity}
                                onChange={set("quantity")}
                                placeholder="0"
                                className={inputBase}
                            />
                        </Field>

                        <Field label="Preço unitário" required error={err("unit_price")}>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={row.unit_price}
                                onChange={set("unit_price")}
                                placeholder="0,00"
                                className={inputBase}
                            />
                        </Field>

                        <Field label="Nº CA" error={err("ca_number")} hint="Certificado de aprovação">
                            <input
                                value={row.ca_number}
                                onChange={set("ca_number")}
                                placeholder="Opcional"
                                className={inputBase}
                            />
                        </Field>
                    </div>
                </div>

                {/* Desconto + Impostos */}
                <div>
                    <SectionTitle>Ajustes fiscais</SectionTitle>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Field label="Desconto (R$)" error={err("discount")}>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={row.discount}
                                onChange={set("discount")}
                                placeholder="0,00"
                                className={inputBase}
                            />
                        </Field>

                        <Field label="Impostos (R$)" error={err("tax")}>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={row.tax}
                                onChange={set("tax")}
                                placeholder="0,00"
                                className={inputBase}
                            />
                        </Field>
                    </div>
                </div>

                {/* Subtotal inline */}
                {hasValues && total > 0 && (
                    <div className="flex items-center justify-end gap-2 rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5">
                        <span className="text-xs font-medium text-slate-400">Subtotal</span>
                        <span className="text-sm font-bold text-slate-700">{fmt(total)}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InvoiceItemsCreate({ invoice, products }: Props) {
    const [rows, setRows] = useState<ItemRow[]>([emptyRow()]);

    const { post, processing, errors, transform } = useForm<{
        items: Omit<ItemRow, "_key">[];
    }>({ items: [] });

    const updateRow = useCallback((key: string, field: keyof ItemRow, value: string) => {
        setRows((prev) =>
            prev.map((r) => (r._key === key ? { ...r, [field]: value } : r))
        );
    }, []);

    const addRow = () => setRows((prev) => [...prev, emptyRow()]);

    const removeRow = (key: string) =>
        setRows((prev) => prev.filter((r) => r._key !== key));

    const grandTotal = useMemo(
        () => rows.reduce((acc, r) => acc + calcTotal(r), 0),
        [rows]
    );

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        transform(() => ({
            items: rows.map(({ _key, ...rest }) => rest),
        }));
        post(route("admin.invoices.items.store", invoice.id));
    }

    return (
        <>
            <Head title={`Itens — NF ${invoice.number}`} />

            <PageContainer>
                <PageCard>
                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                        {/* ── Header ── */}
                        <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-base font-bold text-slate-800">
                                        Itens da Nota Fiscal
                                    </h1>
                                    <p className="text-xs font-medium text-slate-500">
                                        NF {invoice.number} · Série {invoice.series}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ── Form ── */}
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4 p-6">

                                {rows.map((row, index) => (
                                    <ItemRowForm
                                        key={row._key}
                                        row={row}
                                        index={index}
                                        products={products}
                                        onChange={updateRow}
                                        onRemove={removeRow}
                                        canRemove={rows.length > 1}
                                        errors={errors as Record<string, string>}
                                    />
                                ))}

                                <button
                                    type="button"
                                    onClick={addRow}
                                    className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 py-3.5 text-sm font-semibold text-slate-400 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"
                                >
                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                    </svg>
                                    Adicionar outro item
                                </button>

                            </div>

                            {/* ── Footer ── */}
                            <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
                                <div className="flex flex-col gap-0.5">
                                    <p className="text-xs font-medium text-slate-400">
                                        Campos com <span className="text-red-500">*</span> são obrigatórios
                                    </p>
                                    {grandTotal > 0 && (
                                        <p className="text-xs font-semibold text-slate-600">
                                            Total:{" "}
                                            <span className="text-blue-600">{fmt(grandTotal)}</span>
                                            {" · "}
                                            {rows.length} {rows.length === 1 ? "item" : "itens"}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => window.history.back()}
                                        className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-400 hover:bg-slate-50 active:scale-[0.98]"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {processing ? (
                                            <>
                                                <Spinner />
                                                Salvando…
                                            </>
                                        ) : (
                                            `Salvar ${rows.length} ${rows.length === 1 ? "item" : "itens"}`
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

// ─── Layout ───────────────────────────────────────────────────────────────────

InvoiceItemsCreate.layout = (page: React.ReactNode) => (
    <DashboardLayout>{page}</DashboardLayout>
);