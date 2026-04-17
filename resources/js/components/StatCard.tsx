type Props = {
    title: string;
    value: string;
    trend?: string;
};

export function StatCard({ title, value, trend }: Props) {
    const positive = trend?.startsWith('+');

    return (
        <div className="rounded-xl border border-base-200 bg-white p-5 shadow-sm">
            <div className="mb-2 text-sm text-base-600">{title}</div>

            <div className="flex items-end justify-between">
                <span className="text-2xl font-semibold text-base-800">
                    {value}
                </span>

                {trend && (
                    <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                            positive
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                        } `}
                    >
                        {trend}
                    </span>
                )}
            </div>
        </div>
    );
}
