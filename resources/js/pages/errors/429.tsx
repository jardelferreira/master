'use client';

import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import ErrorLayout from '@/pages/layouts/ErrorLayout';
import { ErrorCard } from '@/components/ErrorCard';

export default function Error429({ retryAfter }: { retryAfter: number }) {
    const [time, setTime] = useState(retryAfter);

    useEffect(() => {
        if (time <= 0) return;

        const interval = setInterval(() => {
            setTime((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [time]);

    useEffect(() => {
        if (time === 0) {
            setTimeout(() => router.reload(), 500);
        }
    }, [time]);

    const progress = (time / retryAfter) * 100;

    return (
        <ErrorLayout>
            <ErrorCard
                code="429"
                title="Muitas tentativas"
                description="Aguarde antes de tentar novamente."
            >
                <div className="mt-6">
                    <div className="text-4xl font-bold text-blue-600">
                        {time}s
                    </div>

                    <div className="mt-4 h-2 w-full rounded-full bg-gray-200">
                        <div
                            className="h-full bg-blue-600 transition-all duration-1000"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <button
                        onClick={() => router.reload()}
                        disabled={time > 0}
                        className={`mt-6 w-full rounded-md px-4 py-2 text-sm font-medium ${
                            time > 0
                                ? 'bg-gray-200 text-gray-400'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                    >
                        Tentar novamente
                    </button>
                </div>
            </ErrorCard>
        </ErrorLayout>
    );
}