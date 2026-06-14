// resources/js/components/ui/PageContainer.tsx
import React from 'react';

export function PageContainer({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative overflow-hidden p-4">
            <div className="relative flex w-full flex-col gap-6">
                {children}
            </div>
        </div>
    );
}