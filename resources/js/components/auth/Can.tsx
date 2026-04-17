// components/auth/Can.tsx
import { ReactNode } from 'react';
import { usePermission } from '@/hooks/usePermission';

type CanProps = {
    permissions?: string | string[];
    children: ReactNode;
};

export function Can({ permissions, children }: CanProps) {
    const { can,canAny } = usePermission();

    if (!permissions) return <>{children}</>;

    if (Array.isArray(permissions)) {
        if(!canAny(permissions)) return null
    } else {
        if (!can(permissions)) return null;
    }

    return <>{children}</>;
}