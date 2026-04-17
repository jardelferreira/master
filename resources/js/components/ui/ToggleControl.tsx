'use client';

import { useState, useEffect, useRef } from 'react';

type ToggleUserProps = {
    initialValue: boolean;
    onChange: (value: boolean) => Promise<void> | void;
    disabled?: boolean;
};

export function ToggleUser({
    initialValue,
    onChange,
    disabled = false,
}: ToggleUserProps) {
    const [checked, setChecked] = useState(initialValue);
    const [loading, setLoading] = useState(false);

    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(() => {
        setChecked(initialValue);
    }, [initialValue]);

    const handleToggle = () => {
        if (disabled) return;
        const newValue = !checked;
        setChecked(newValue);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(async () => {
            try {
                setLoading(true);
                await onChange(newValue);
            } finally {
                setLoading(false);
            }
        }, 400); // debounce
    };

    return (
        <button
            role="switch"
            aria-checked={checked}
            onClick={handleToggle}
            disabled={disabled || loading}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all cursor-pointer ${checked ? 'bg-green-500' : 'bg-red-300'
                } ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'
                    }`}
            />

            {/* loading indicator */}
            {loading && (
                <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white">
                    ...
                </span>
            )}
        </button>
    );
}