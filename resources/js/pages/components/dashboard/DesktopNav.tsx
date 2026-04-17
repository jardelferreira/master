import { Link } from '@inertiajs/react';
import { NavItemProps } from '@/types/navigation';

export default function DesktopNav({ items }: NavItemProps) {
    return (
        <nav className="hidden items-center gap-6 md:flex">
            {items.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm font-medium text-base-600 transition hover:text-base-800"
                >
                    {item.label}
                </Link>
            ))}
        </nav>
    );
}
