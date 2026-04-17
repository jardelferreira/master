import { usePage } from '@inertiajs/react';

type AuthProps = {
    permissions?: string[];
    roles?: string[];
};

type PageProps = {
    auth?: AuthProps;
};

const SUPER_ADMIN_ROLE = 'super.admin';

export function usePermission() {
    const page = usePage<PageProps>();

    const permissions = page.props.auth?.permissions ?? [];
    const roles = page.props.auth?.roles ?? [];

    const isSuperAdmin = roles.includes(SUPER_ADMIN_ROLE);

    /**
     * Verifica se o usuário tem UMA permissão
     */
    function can(permission: string): boolean {
        if (isSuperAdmin) return true;
        return permissions.includes(permission);
    }

    /**
     * Verifica se o usuário tem PELO MENOS UMA das permissões (OR)
     * Ex: canAny(['users.manage', 'permissions.manage'])
     */
    function canAny(required: string[]): boolean {
        if (isSuperAdmin) return true;
        return required.some((p) => permissions.includes(p));
    }

    /**
     * Verifica se o usuário tem TODAS as permissões (AND)
     * Ex: canAll(['users.manage', 'permissions.manage'])
     */
    function canAll(required: string[]): boolean {
        if (isSuperAdmin) return true;
        return required.every((p) => permissions.includes(p));
    }

    return {
        can,
        canAny,
        canAll,
        isSuperAdmin,
        permissions,
        roles,
    };
}
