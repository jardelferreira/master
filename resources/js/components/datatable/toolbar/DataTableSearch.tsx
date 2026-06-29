import { Search, X } from 'lucide-react';

interface Props {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
}

export function DataTableSearch({ value, onChange, placeholder }: Props) {
    return (
        <div className="relative w-full max-w-sm">
            <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-8 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />

            {value && (
                <button
                    type="button"
                    onClick={() => onChange('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded text-slate-400 hover:text-slate-600"
                    aria-label="Limpar busca"
                >
                    <X size={14} />
                </button>
            )}
        </div>
    );
}