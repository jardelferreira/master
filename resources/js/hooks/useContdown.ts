import { useEffect, useState } from 'react';

export function useCountdown(initial: number | null) {
    const [time, setTime] = useState<number | null>(initial);

    useEffect(() => {
        if (!time || time <= 0) return;

        const interval = setInterval(() => {
            setTime((prev) => (prev ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(interval);
    }, [time]);

    return time;
}