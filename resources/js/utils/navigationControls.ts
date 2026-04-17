export function isActive(active?: string | string[]): boolean {
    if (!active) return false;

    const current = route().current();

    if (!current) return false;

    const patterns = Array.isArray(active) ? active : [active];

    return patterns.some((pattern) => {
        if (pattern.endsWith('.*')) {
            const base = pattern.replace('.*', '');
            return current.startsWith(base);
        }

        return current === pattern;
    });
}
