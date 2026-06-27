interface Props {
    status: {
        label: string;
        badge: string;
    };
}

export default function StatusBadge({
    status,
}: Props) {
    return (
        <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${status.badge}`}
        >
            {status.label}
        </span>
    );
}