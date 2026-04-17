'use client';

import { ReactNode } from 'react';

export default function ErrorLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            
            {/* background glow */}
            <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-200 blur-3xl opacity-30" />
            <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-indigo-200 blur-3xl opacity-30" />

            <div className="relative z-10 w-full max-w-md">
                {children}
            </div>
        </div>
    );
}