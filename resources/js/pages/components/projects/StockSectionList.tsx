import { useState, useMemo } from "react";
import { ChevronDown, Search, SlidersHorizontal } from "lucide-react";
import StockItem from "./StockListItem";

export function StockSection({ stock, sectorsReal }: { stock: any[], sectorsReal: any[] }) {
    const [open, setOpen] = useState(true);
    const [sectorFilter, setSectorFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState<"all" | "in" | "out">("all");
    const [search, setSearch] = useState("");

    // Setores únicos extraídos do stock
    const sectors = useMemo(() => {
        const unique = Array.from(new Set(stock.map((i) => i.sector)));
        return unique;
    }, [stock]);

    const filtered = useMemo(() => {
        return stock.filter((item) => {
            const matchSector = sectorFilter === "all" || item.sector === sectorFilter;
            const matchType = typeFilter === "all" || item.type === typeFilter;
            const matchSearch =
                search === "" ||
                item.product.name.toLowerCase().includes(search.toLowerCase()) ||
                item.sector.toLowerCase().includes(search.toLowerCase());
            return matchSector && matchType && matchSearch;
        });
    }, [stock, sectorFilter, typeFilter, search]);

    const entries = filtered.filter((i) => i.type === "in").length;
    const exits = filtered.filter((i) => i.type === "out").length;

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

            {/* ── HEADER ── */}
            <div className="px-6 py-5 border-b border-slate-100">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-base font-semibold text-slate-800">
                            Movimentações
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Últimas entradas e saídas por setor
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 text-xs rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium transition">
                            + Nova entrada
                        </button>
                        <button
                            onClick={() => setOpen((v) => !v)}
                            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition"
                        >
                            <ChevronDown
                                size={16}
                                className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                            />
                        </button>
                    </div>
                </div>

                {/* ── FILTERS ── */}
                {open && (
                    <div className="mt-4 flex flex-wrap items-center gap-2">

                        {/* Search */}
                        <div className="relative flex-1 min-w-[160px]">
                            <Search
                                size={13}
                                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                type="text"
                                placeholder="Buscar produto ou setor…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition"
                            />
                        </div>

                        {/* Setor */}
                        <div className="relative">
                            <SlidersHorizontal
                                size={12}
                                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                            />
                            <select
                                value={sectorFilter}
                                onChange={(e) => setSectorFilter(e.target.value)}
                                className="pl-7 pr-6 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition cursor-pointer"
                            >
                                <option value="all">Todos setores</option>
                                {sectors.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>

                        {/* Tipo — toggle pills */}
                        <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100">
                            {(["all", "in", "out"] as const).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTypeFilter(t)}
                                    className={`px-3 py-1 text-xs rounded-md font-medium transition ${typeFilter === t
                                            ? "bg-white text-slate-800 shadow-sm"
                                            : "text-slate-500 hover:text-slate-700"
                                        }`}
                                >
                                    {t === "all" ? "Todos" : t === "in" ? "Entradas" : "Saídas"}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ── SUMMARY STRIP ── */}
            {open && (
                <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-4 text-xs text-slate-500">
                    <span>
                        <span className="font-medium text-slate-700">{filtered.length}</span> movimentações
                    </span>
                    <span className="text-slate-200">|</span>
                    <span className="text-emerald-600 font-medium">↑ {entries} entradas</span>
                    <span className="text-red-500 font-medium">↓ {exits} saídas</span>

                    {(sectorFilter !== "all" || typeFilter !== "all" || search !== "") && (
                        <>
                            <span className="text-slate-200">|</span>
                            <button
                                onClick={() => { setSectorFilter("all"); setTypeFilter("all"); setSearch(""); }}
                                className="text-blue-500 hover:text-blue-700 transition"
                            >
                                Limpar filtros
                            </button>
                        </>
                    )}
                </div>
            )}

            {/* ── LIST ── */}
            {open && (
                <div className="px-2 py-2">
                    {filtered.length === 0 ? (
                        <div className="py-12 text-center text-sm text-slate-400">
                            Nenhuma movimentação encontrada.
                        </div>
                    ) : (
                        filtered.map((item) => (
                            <StockItem key={item.id} item={item} />
                        ))
                    )}
                </div>
            )}
        </div>
    );
}