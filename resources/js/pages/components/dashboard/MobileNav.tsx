import { Link } from '@inertiajs/react';
import { useState } from 'react';

type NavItem = {
    label: string;
    href: string;
};

type Props = {
    items: NavItem[];
};

export default function MobileNav({ items }: Props) {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative md:hidden">
            {/* Botão hamburger */}
            <button
                onClick={() => setOpen((v) => !v)}
                className="rounded-md p-2 hover:bg-base-100"
                aria-label="Abrir menu"
            >
                ☰
            </button>

            {open && (
                <div className="absolute top-full left-0 z-50 mt-2 w-48 rounded-md border border-base-200 bg-white shadow-lg">
                    {items.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="block px-4 py-2 text-sm text-base-700 hover:bg-base-100"
                            onClick={() => setOpen(false)}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
