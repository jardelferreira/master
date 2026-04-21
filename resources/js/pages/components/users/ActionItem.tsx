export default function ActionItem({ icon: Icon, label, description, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition text-left"
        >
            <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Icon size={16} />
            </div>

            <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">
                    {label}
                </p>
                <p className="text-xs text-slate-400">
                    {description}
                </p>
            </div>
        </button>
    );
}