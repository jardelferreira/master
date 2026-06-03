import { useMemo, useState } from "react";
import { ChevronDown, Search, SlidersHorizontal } from "lucide-react";
import { StockMovementItem } from "./StockMovementItem";

type Movement = {
  id: number;
  display_type: "in" | "out";
  label: string;
  quantity: number;

  product: { name: string; unit: string };
  sector: { name: string };
  user?: { name: string };

  performed_at: string;
  performed_at_human: string;
};

export function StockMovementSection({ movements }: { movements: Movement[] }) {
  const [open, setOpen] = useState(true);

  const [sectorFilter, setSectorFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "in" | "out">("all");
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "week">("all");
  const [search, setSearch] = useState("");

  // 🔹 setores únicos
  const sectors = useMemo(() => {
    return Array.from(new Set(movements.map((m) => m.sector?.name)));
  }, [movements]);

  // 🔹 filtro principal
  const filtered = useMemo(() => {
    return movements.filter((item) => {
      const matchSector =
        sectorFilter === "all" || item.sector?.name === sectorFilter;

      const matchType =
        typeFilter === "all" || item.display_type === typeFilter;

      const matchSearch =
        search === "" ||
        item.product.name.toLowerCase().includes(search.toLowerCase()) ||
        item.sector?.name.toLowerCase().includes(search.toLowerCase());

      // 🔥 filtro de data
      const now = new Date();
      const date = new Date(item.performed_at);

      let matchDate = true;

      if (dateFilter === "today") {
        matchDate = date.toDateString() === now.toDateString();
      }

      if (dateFilter === "week") {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        matchDate = date >= weekAgo;
      }

      return matchSector && matchType && matchSearch && matchDate;
    });
  }, [movements, sectorFilter, typeFilter, search, dateFilter]);

  const entries = filtered.filter((m) => m.display_type === "in").length;
  const exits = filtered.filter((m) => m.display_type === "out").length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

      {/* HEADER */}
      <div className="px-6 py-5 border-b border-slate-100">
        <div className="flex items-start justify-between gap-4">

          <div>
            <h2 className="text-base font-semibold text-slate-800">
              Movimentações
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Últimas movimentações do estoque
            </p>
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
          >
            <ChevronDown
              size={16}
              className={`${open ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {/* 🔍 FILTROS */}
        {open && (
          <div className="mt-4 flex flex-wrap gap-2">

            {/* search */}
            <div className="relative flex-1 min-w-[160px]">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar produto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50"
              />
            </div>

            {/* setor */}
            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className="text-xs rounded-lg border border-slate-200 px-2 py-1.5"
            >
              <option value="all">Todos setores</option>
              {sectors.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>

            {/* tipo */}
            <div className="flex bg-slate-100 rounded-lg p-1">
              {(["all", "in", "out"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-2 py-1 text-xs rounded ${
                    typeFilter === t ? "bg-white shadow" : ""
                  }`}
                >
                  {t === "all" ? "Todos" : t === "in" ? "Entradas" : "Saídas"}
                </button>
              ))}
            </div>

            {/* data */}
            <select
              value={dateFilter}
              onChange={(e) =>
                setDateFilter(e.target.value as any)
              }
              className="text-xs rounded-lg border border-slate-200 px-2 py-1.5"
            >
              <option value="all">Todo período</option>
              <option value="today">Hoje</option>
              <option value="week">Últimos 7 dias</option>
            </select>
          </div>
        )}
      </div>

      {/* SUMMARY */}
      {open && (
        <div className="px-6 py-2.5 bg-slate-50 border-b text-xs text-slate-500 flex gap-4">
          <span>
            <b>{filtered.length}</b> movimentações
          </span>
          <span>↑ {entries}</span>
          <span>↓ {exits}</span>
        </div>
      )}

      {/* LIST */}
      {open && (
        <div className="px-2 py-2">
          {filtered.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-400">
              Nenhuma movimentação encontrada.
            </div>
          ) : (
            filtered.map((item) => (
              <StockMovementItem key={item.id} item={item} />
            ))
          )}
        </div>
      )}
    </div>
  );
}