export function isActive(active?: any): boolean {
    if (!active) return false;

    const name = route().current();
    const params = route().params || {};

    if (!name) return false;

    // 🔥 função
    if (typeof active === 'function') {
        return active({ name, params });
    }

    const patterns = Array.isArray(active) ? active : [active];

    return patterns.some((pattern) => {
        if (pattern.endsWith('.*')) {
            const base = pattern.replace('.*', '');
            return name.startsWith(base);
        }

        return name === pattern;
    });
}