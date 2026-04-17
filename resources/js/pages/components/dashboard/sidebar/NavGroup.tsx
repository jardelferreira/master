'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavItem } from '@/pages/components/dashboard/sidebar/NavItem';

function resolveActive(active?: string | string[]) {
    if (!active) return false;

    if (Array.isArray(active)) {
        return active.some((name) => route().current(name));
    }

    return route().current(active);
}

export function NavGroup({ group, collapsed, canShow }: any) {
    const containerRef = useRef<HTMLDivElement>(null);

    // 🔥 calcula corretamente
    const visibleChildren = useMemo(
        () => group.children.filter(canShow),
        [group.children, canShow]
    );

    const hasActiveChild = useMemo(
        () => visibleChildren.some((item: any) => resolveActive(item.active)),
        [visibleChildren]
    );

    const [open, setOpen] = useState(hasActiveChild);

    useEffect(() => {
        if (hasActiveChild) setOpen(true);
    }, [hasActiveChild]);

    // fechar ao clicar fora
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={containerRef} className="relative space-y-1 group">
            {/* Botão */}
            <button
                onClick={() => setOpen((v: boolean) => !v)}
                className={`flex w-full font-bold items-center justify-between rounded-md px-3 py-2 border transition ${
                    hasActiveChild
                        ? 'bg-core-50 text-core-700'
                        : 'text-blue-800 hover:bg-blue-100'
                }`}
            >
                <div className="flex items-center gap-3">
                    <group.icon className="h-5 w-5" />
                    {!collapsed && <span>{group.label}</span>}
                </div>

                {!collapsed && (
                    <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                            open ? 'rotate-180' : ''
                        }`}
                    />
                )}
            </button>

            {/* EXPANDIDO */}
            <AnimatePresence>
                {open && !collapsed && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="ml-6 space-y-1 overflow-hidden"
                    >
                        {visibleChildren.map((item: any, i: number) => (
                            <NavItem
                                key={i}
                                href={item.href}
                                label={item.label}
                                icon={item.icon}
                                collapsed={false}
                                active={resolveActive(item.active)}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* COLLAPSED (CSS hover, sem state) */}
            {collapsed && (
                <div className="absolute left-full top-0 z-50 ml-0 hidden w-56 rounded-xl border bg-white shadow-xl p-2 space-y-1 group-hover:block">
                    <div className="px-2 py-1 text-xs font-semibold text-gray-500">
                        {group.label}
                    </div>

                    {visibleChildren.map((item: any, i: number) => (
                        <NavItem
                            key={i}
                            href={item.href}
                            label={item.label}
                            icon={item.icon}
                            collapsed={false}
                            active={resolveActive(item.active)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}