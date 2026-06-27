interface Props {
    label: string;
    value?: React.ReactNode;
}

export default function InfoRow({
    label,
    value,
}: Props) {
    return (
        <div className="flex items-center justify-between border-b border-base-200 py-2 last:border-b-0">

            <span className="text-sm text-slate-500">
                {label}
            </span>

            <span className="text-sm font-medium text-slate-900">
                {value ?? '-'}
            </span>

        </div>
    );
}