export function PageHeader({
    title,
    description,
    actions,
}: {
    title: string;
    description?: string;
    actions?: React.ReactNode;
}) {
    return (
        <div className="flex items-center justify-between bg-white shadow-sm p-4 m-2 rounded-2xl">
            <div>
                <h1 className="text-xl font-semibold text-slate-900">
                    {title}
                </h1>
                {description && (
                    <p className="text-sm text-slate-500">{description}</p>
                )}
            </div>

            <div className="flex gap-2">{actions}</div>
        </div>
    );
}