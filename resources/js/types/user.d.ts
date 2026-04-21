export type User = {
    id: number;
    uuid: string;
    name: string;
    email: string;
    created_at: string;
    active: boolean;
    email_verified_at: string | null;
};

export type UsersPageProps = PageProps & {
    users: User[];
    emailVerificationEnabled: boolean;
};

// types/models.ts

export type UserBase = {
    id: number;
    name: string;
    email: string;
};

export type AuthUser = UserBase & {
    updated_at: string;
    email_verified_at: string | null;
};

export type SimpleUser = UserBase;