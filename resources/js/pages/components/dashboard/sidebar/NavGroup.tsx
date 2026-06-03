'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { isActive } from '@/utils/navigationControls';
import { usePage } from '@inertiajs/react';
import { NavNode } from '@/pages/components/dashboard/sidebar/NavNode';

export function NavGroup({
    group,
    collapsed,
    canShow,
}: any) {
    const containerRef = useRef<HTMLDivElement>(null);

    usePage();

    const visibleChildren = group.children.filter(canShow);

    const hasActiveChild = visibleChildren.some(
        (item: any) =>
            item.type === 'link'
                ? isActive(item.active)
                : hasActiveRecursive(item),
    );

    const [open, setOpen] = useState<boolean>(hasActiveChild);

    useEffect(() => {
        setOpen(hasActiveChild);
    }, [hasActiveChild]);

    useEffect(() => {
        const handleClickOutside = (
            e: MouseEvent,
        ) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(
                    e.target as Node,
                )
            ) {
                setOpen(false);
            }
        };

        document.addEventListener(
            'mousedown',
            handleClickOutside,
        );

        return () =>
            document.removeEventListener(
                'mousedown',
                handleClickOutside,
            );
    }, []);

    return (
        <div
            ref={containerRef}
            className="relative space-y-1 group"
        >
            <button
                onClick={() =>
                    setOpen((v) => !v)
                }
                className={`flex w-full items-center justify-between rounded-md border px-3 py-2 font-bold transition ${
                    hasActiveChild
                        ? 'bg-core-50 text-core-700'
                        : 'text-blue-800 hover:bg-blue-100'
                }`}
            >
                <div className="flex items-center gap-3">
                    <group.icon className="h-5 w-5" />

                    {!collapsed && (
                        <span>{group.label}</span>
                    )}
                </div>

                {!collapsed && (
                    <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                            open
                                ? 'rotate-180'
                                : ''
                        }`}
                    />
                )}
            </button>

            <AnimatePresence>
                {open && !collapsed && (
                    <motion.div
                        initial={{
                            height: 0,
                            opacity: 0,
                        }}
                        animate={{
                            height: 'auto',
                            opacity: 1,
                        }}
                        exit={{
                            height: 0,
                            opacity: 0,
                        }}
                        className="ml-6 space-y-1 overflow-hidden"
                    >
                        {visibleChildren.map(
                            (
                                item: any,
                                i: number,
                            ) => (
                                <NavNode
                                    key={`${i}-${item.label}`}
                                    item={item}
                                    collapsed={false}
                                    canShow={canShow}
                                />
                            ),
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {collapsed && (
                <div className="absolute left-full top-0 z-50 ml-0 hidden w-64 rounded-xl border bg-white p-2 shadow-xl space-y-1 group-hover:block">
                    <div className="px-2 py-1 text-xs font-semibold text-gray-500">
                        {group.label}
                    </div>

                    {visibleChildren.map(
                        (
                            item: any,
                            i: number,
                        ) => (
                            <NavNode
                                key={`${i}-${item.label}`}
                                item={item}
                                collapsed={false}
                                canShow={canShow}
                            />
                        ),
                    )}
                </div>
            )}
        </div>
    );
}

function hasActiveRecursive(
    item: any,
): boolean {
    if (item.type === 'link') {
        return isActive(item.active);
    }

    return item.children.some(
        (child: any) =>
            child.type === 'link'
                ? isActive(child.active)
                : hasActiveRecursive(child),
    );
}