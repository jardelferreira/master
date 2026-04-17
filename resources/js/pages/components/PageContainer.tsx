// resources/js/components/ui/PageContainer.tsx
import React from 'react';

export function PageContainer({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative overflow-hidden px-6 py-8 sm:px-8">
            <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-6">
                {children}
            </div>
        </div>
    );
}