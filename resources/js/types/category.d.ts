export type CategoryParent = {
    id: number;
    name: string;
};

export type CategoryBreadcrumb = {
    id: number;
    name: string;
    slug: string;
};

export type CategoryChild = {
    id: number;
    uuid: string;
    name: string;
    slug: string;
    active: boolean;
    children_count: number;
    products_count: number;
};

export type CategoryProduct = {
    id: number;
    name: string;
    sku?: string | null;
    active: boolean;
};

export type Category = {
    id: number;
    uuid: string;
    name: string;
    slug: string;
    description?: string | null;
    active: boolean;

    products_count?: number;
    children_count?: number;

    parent?: CategoryParent | null;

    meta?: Record<string, unknown> | null;

    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
};

export type CategoryStats = {
    total_children: number;
    total_products: number;
    is_root: boolean;
    has_children: boolean;
};

export type CategoryShowData = {
    category: Category;
    stats: CategoryStats;
    breadcrumbs: CategoryBreadcrumb[];
    children: CategoryChild[];
    products: CategoryProduct[];
};