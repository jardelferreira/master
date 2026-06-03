import { ProductFromStock } from "./product";

export type Stock = {
    id: number;
    uuid: string;
    project_id: number;
    sector_id: number;
    product_id: number;
    invoice_item_id: number;
    parent_id?: number;
    expires_at?: string;
    stock_location?: string;
    stock_quantity: string;
    active: boolean;
    is_patrimony: boolean;
    serial?: string;
    stock_image_path?: string;
    meta?: object;
    performed_at?: string;
    created_at: string;
    updated_at: string;
}

export type StockByProject = {
    project_id: number;
    product_id: number;
    total_quantity: number;
    product: ProductFromStock;
}
