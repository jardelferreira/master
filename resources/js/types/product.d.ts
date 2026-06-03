export type ProductCategory = {
    id: number;
    name: string;
    slug?: string;
};

export type ProductUnit = {
    value: string;
    label: string;
};

export type ProductInvoiceItem = {
    id: number;
    invoice_id: number;
    quantity: number;
    approved_quantity: number;
    received_quantity: number;
};

export type ProductStockMinimal = {
    id: number;
    uuid: string;

    scope: 'global' | 'project' | 'sector';

    project?: {
        id: number;
        name: string;
    } | null;

    sector?: {
        id: number;
        name: string;
    } | null;

    min_quantity: number;

    created_at?: string | null;
    updated_at?: string | null;
};

export type Product = {
    id: number;
    uuid: string;
    name: string;
    slug: string;
    description?: string | null;
    sku?: string | null;
    active: boolean;

    unit?: ProductUnit | null;

    stock_quantity?: number;

    invoice_items_count?: number;
    stocks_count?: number;
    stock_movements_count?: number;
    stock_minimals_count?: number;

    category?: ProductCategory | null;

    meta?: Record<string, unknown> | null;

    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
};

export type ProductStats = {
    stock_quantity: number;
    invoice_items_count: number;
    stocks_count: number;
    stock_movements_count: number;
    stock_minimals_count: number;
    global_min_stock?: number | null;
};

export type ProductShowData = {
    product: Product;
    stats: ProductStats;
    invoice_items: ProductInvoiceItem[];
    stock_minimals: ProductStockMinimal[];
};

export type ProductSelectCategory = {
    id: number;
    name: string;
};

export type ProductSelectUnit = {
    value: string;
    label: string;
};

export type ProductFromStock = {
    id: number;
    name: string;
    unit: ProductUnit;
}