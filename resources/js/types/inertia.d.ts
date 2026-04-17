import { PageProps as InertiaPageProps } from '@inertiajs/core';
import type { SweetAlertFlashPayload } from '@/types/alert';
// import {Tenant} from './tenant.d'

export interface PageProps extends InertiaPageProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            email_verified_at: string | null;
            img_url: string | null;
        };
        emailVerificationEnabled: boolean;
        permissions: string[];
        // roles: string[],
        // tenant: Tenant | null
    };
    flash?: SweetAlertFlashPayload;
}
