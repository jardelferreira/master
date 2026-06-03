import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { formatQuantity } from "@/utils/formatValues";

export function StockMovementItem({ item }: { item: any }) {
  const isEntry = item.display_type === "in";

  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-slate-50 transition group">
      
      {/* LEFT */}
      <div className="flex items-center gap-3">
        
        {/* ICON */}
        <div
          className={`w-9 h-9 flex items-center justify-center rounded-xl ${
            isEntry
              ? "bg-emerald-50 text-emerald-600"
              : "bg-red-50 text-red-500"
          }`}
        >
          {isEntry ? (
            <ArrowUpRight size={16} strokeWidth={2.5} />
          ) : (
            <ArrowDownLeft size={16} strokeWidth={2.5} />
          )}
        </div>

        {/* INFO */}
        <div>
          <p className="text-sm font-medium text-slate-800">
            {item.product.name}
          </p>

          <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
            <span>{item.performed_at_human}</span>
            <span>•</span>
            <span className="px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-600 font-medium">
              {item.sector.name}
            </span>

            {item.user && (
              <>
                <span>•</span>
                <span>{item.user.name}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="text-right">
        <span
          className={`text-sm font-semibold tabular-nums ${
            isEntry ? "text-emerald-600" : "text-red-500"
          }`}
        >
          {isEntry ? "+" : "−"}
          {formatQuantity(item.quantity, 1)} {item.product.unit}
        </span>

        <p className="text-xs text-slate-400 mt-0.5">
          {item.label}
        </p>
      </div>
    </div>
  );
}