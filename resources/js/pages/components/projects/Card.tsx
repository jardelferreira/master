import { useRef, useEffect, useState } from "react";
import { MoreVertical } from "lucide-react";

type CardProps = {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    variant?: "default" | "primary" | "danger" | "warning";
    trend?: { value: number; label: string };
};

export default function Card({
    title,
    value,
    icon,
    variant = "default",
    trend,
}: CardProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const styles = {
        default: {
            border: "border-slate-200",
            icon: "bg-slate-100 text-slate-500",
            badge: "bg-slate-100 text-slate-600",
        },
        primary: {
            border: "border-blue-200",
            icon: "bg-blue-100 text-blue-600",
            badge: "bg-blue-50 text-blue-700",
        },
        danger: {
            border: "border-red-200",
            icon: "bg-red-100 text-red-500",
            badge: "bg-red-50 text-red-600",
        },
        warning: {
            border: "border-amber-200",
            icon: "bg-amber-100 text-amber-500",
            badge: "bg-amber-50 text-amber-600",
        },
    };

    const s = styles[variant];

    return (
        <div ref={ref} className="relative">
            <div
                className={`
                    group relative bg-white rounded-2xl p-5
                    border ${s.border}
                    shadow-sm hover:shadow-md
                    transition-all duration-200
                    hover:-translate-y-0.5
                `}
            >
                <div className="flex items-start justify-between">
                    {/* ICON */}
                    {icon && (
                        <div className={`p-2 rounded-xl ${s.icon}`}>
                            {icon}
                        </div>
                    )}

                    <button
                        onClick={() => setOpen((p) => !p)}
                        className="p-1 rounded-lg text-slate-300 hover:text-slate-500 hover:bg-slate-100 transition opacity-0 group-hover:opacity-100"
                    >
                        <MoreVertical size={15} />
                    </button>
                </div>

                <div className="mt-4">
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">
                        {title}
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-slate-800 tracking-tight">
                        {value}
                    </p>
                </div>

                {trend && (
                    <div className={`mt-3 inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${s.badge}`}>
                        <span>{trend.value > 0 ? "↑" : "↓"} {Math.abs(trend.value)}%</span>
                        <span className="opacity-70">{trend.label}</span>
                    </div>
                )}
            </div>

            {open && (
                <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl shadow-lg border border-slate-100 z-50 overflow-hidden">
                    <button className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition">
                        Ver detalhes
                    </button>
                    <button className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition">
                        Nova ação
                    </button>
                    <div className="border-t border-slate-100" />
                    <button className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition">
                        Remover
                    </button>
                </div>
            )}
        </div>
    );
}