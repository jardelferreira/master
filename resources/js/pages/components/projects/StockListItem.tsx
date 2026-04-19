import { ArrowUpRight, ArrowDownLeft } from "lucide-react";

export default function StockItem({ item }: { item: any }) {
    const isEntry = item.type === "in";

    return (
        <div className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-slate-50 transition group">
            {/* LEFT */}
            <div className="flex items-center gap-3">
                <div
                    className={`
                        flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg
                        ${isEntry
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-red-50 text-red-500"}
                    `}
                >
                    {isEntry
                        ? <ArrowUpRight size={15} strokeWidth={2.5} />
                        : <ArrowDownLeft size={15} strokeWidth={2.5} />}
                </div>

                <div>
                    <p className="text-sm font-medium text-slate-800 leading-tight">
                        {item.product.name}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs text-slate-400">{item.date}</span>
                        <span className="text-slate-200">·</span>
                        <span className="text-xs px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-600 font-medium">
                            {item.sector}
                        </span>
                    </div>
                </div>
            </div>

            {/* RIGHT */}
            <div className="text-right">
                <span
                    className={`text-sm font-semibold tabular-nums ${isEntry ? "text-emerald-600" : "text-red-500"
                        }`}
                >
                    {isEntry ? "+" : "−"}{item.quantity}
                </span>
                <p className="text-xs text-slate-400 mt-0.5">
                    {isEntry ? "entrada" : "saída"}
                </p>
            </div>
        </div>
    );
}