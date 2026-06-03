<?php

namespace App\Http\Resources;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryShowResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        /** @var Category $category */
        $category = $this->resource;

        $breadcrumbs = $this->buildBreadcrumbs($category);

        return [
            'category' => [
                'id' => $category->id,
                'uuid' => $category->uuid,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
                'active' => $category->active,
                'meta' => $category->meta,

                'parent' => $category->parent ? [
                    'id' => $category->parent->id,
                    'name' => $category->parent->name,
                    'slug' => $category->parent->slug,
                ] : null,

                'created_at' => $category->created_at?->toISOString(),
                'updated_at' => $category->updated_at?->toISOString(),
                'deleted_at' => $category->deleted_at?->toISOString(),
            ],

            'stats' => [
                'total_children' => $category->children->count(),
                'total_products' => $category->products->count(),
                'is_root' => $category->isRoot(),
                'has_children' => $category->hasChildren(),
            ],

            'breadcrumbs' => $breadcrumbs,

            'children' => $category->children->map(fn (Category $child) => [
                'id' => $child->id,
                'uuid' => $child->uuid,
                'name' => $child->name,
                'slug' => $child->slug,
                'active' => $child->active,
                'children_count' => $child->children()->count(),
                'products_count' => $child->products()->count(),
            ]),

            'products' => $category->products->map(fn ($product) => [
                'id' => $product->id,
                'name' => $product->name,
                'sku' => $product->sku,
                'active' => $product->active,
            ]),
        ];
    }

    protected function buildBreadcrumbs(Category $category): array
    {
        $items = [];
        $current = $category;

        while ($current) {
            $items[] = [
                'id' => $current->id,
                'name' => $current->name,
                'slug' => $current->slug,
            ];

            $current = $current->parent;
        }

        return array_reverse($items);
    }
}