'use client';

import { useState, useEffect, useRef } from 'react'; // ← removido useMemo
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavItem } from '@/pages/components/dashboard/sidebar/NavItem';
import { isActive } from '@/utils/navigationControls';
import { usePage } from '@inertiajs/react'; // ← adicionado

export function NavGroup({ group, collapsed, canShow }: any) {
    const containerRef = useRef<HTMLDivElement>(null);

    // usePage() faz o componente reagir a cada navegação do Inertia,
    // garantindo que isActive() seja recalculado com a rota atual.
    usePage();

    // Sem useMemo: recalcula a cada render (que agora é acionado pelo usePage)
    const visibleChildren = group.children.filter(canShow);

    const hasActiveChild = visibleChildren.some((item: any) =>
        isActive(item.active)
    );

    const [open, setOpen] = useState(hasActiveChild);

    useEffect(() => {
        setOpen(hasActiveChild);
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
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={containerRef} className="relative space-y-1 group">
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
                        className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
                    />
                )}
            </button>

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
                                active={isActive(item.active)} // ← agora atualiza
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

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
                            active={isActive(item.active)} // ← agora atualiza
                        />
                    ))}
                </div>
            )}
        </div>
    );
}