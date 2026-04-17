// resources/js/components/ui/PageCard.tsx
import React from 'react';

export function PageCard({ children }: { children: React.ReactNode }) {
    return (
        <section className="rounded-[28px] border border-slate-200 bg-white/90 p-3 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur">
            {children}
        </section>
    );
}