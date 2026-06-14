<?php

namespace App\Http\Controllers\Admin;

use App\Enum\ProductUnitEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductShowResource;
use App\Models\Category;
use App\Models\Product;
use App\Models\Project;
use App\Models\Sector;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(): Response
    {
        $products = Product::query()
            ->with(['category'])
            ->withCount([
                'invoiceItems',
                'stocks',
                'stockMovements',
                'stockMinimals',
            ])
            ->withSum('stocks', 'stock_quantity')
            ->get()
            ->map(fn(Product $product) => [
                'id' => $product->id,
                'uuid' => $product->uuid,
                'name' => $product->name,
                'slug' => $product->slug,
                'description' => $product->description,
                'sku' => $product->sku,
                'active' => $product->active,

                'unit' => $product->unit ? [
                    'value' => $product->unit->value,
                    'label' => $product->unit->label(),
                ] : null,

                'stock_quantity' => (float) ($product->stocks_sum_stock_quantity ?? 0),

                'invoice_items_count' => $product->invoice_items_count,
                'stocks_count' => $product->stocks_count,
                'stock_movements_count' => $product->stock_movements_count,
                'stock_minimals_count' => $product->stock_minimals_count,

                'category' => $product->category ? [
                    'id' => $product->category->id,
                    'name' => $product->category->name,
                ] : null,

                'created_at' => $product->created_at?->toISOString(),
                'updated_at' => $product->updated_at?->toISOString(),
                'deleted_at' => $product->deleted_at?->toISOString(),
            ]);

        $categories = Category::query()
            ->active()
            ->orderBy('name')
            ->get(['id', 'name']);

        $units = collect(ProductUnitEnum::cases())
            ->map(fn(ProductUnitEnum $unit) => [
                'value' => $unit->value,
                'label' => $unit->label(),
            ])
            ->values();

        return Inertia::render('dashboard/products/Index', [
            'products' => $products,
            'categories' => $categories,
            'units' => $units,
        ]);
    }

    public function show(Product $product): Response
    {
        $product->load([
            'category',
            'invoiceItems',
            'stocks',
            'stockMovements',
            'stockMinimals.project',
            'stockMinimals.sector',
        ]);

        $categories = Category::query()
            ->active()
            ->orderBy('name')
            ->get(['id', 'name']);
        $projects = Project::query()
            ->orderBy('name')
            ->get(['id', 'name']);

        $sectors = Sector::query()
            ->orderBy('name')
            ->get(['id', 'name', 'project_id']);

        $units = collect(ProductUnitEnum::cases())
            ->map(fn(ProductUnitEnum $unit) => [
                'value' => $unit->value,
                'label' => $unit->label(),
            ])
            ->values();

        return Inertia::render(
            'dashboard/products/Show',
            array_merge(
                (new ProductShowResource($product))->toArray(request()),
                [
                    'categories' => $categories,
                    'units' => $units,
                    'projects' => $projects,
                    'sectors' => $sectors,
                ]
            )
        );
    }

    public function store(StoreProductRequest $request): RedirectResponse
    {
        Product::create([
            'name' => $request->name,
            'description' => $request->description,
            'sku' => $request->sku,
            'category_id' => $request->category_id,
            'unit' => $request->unit,
            'active' => $request->boolean('active'),
        ]);

        return back()->with(
            'success',
            'Produto cadastrado com sucesso.'
        );
    }

    public function update(
        UpdateProductRequest $request,
        Product $product
    ): RedirectResponse {
        $product->update([
            'name' => $request->name,
            'description' => $request->description,
            'sku' => $request->sku,
            'category_id' => $request->category_id,
            'unit' => $request->unit,
            'active' => $request->boolean('active'),
        ]);

        return back()->with(
            'success',
            'Produto atualizado com sucesso.'
        );
    }

    public function destroy(Product $product): RedirectResponse
    {
        if (
            $product->invoiceItems()->exists() ||
            $product->stocks()->exists() ||
            $product->stockMovements()->exists() ||
            $product->stockMinimals()->exists()
        ) {
            return back()->with(
                'error',
                'Não é possível excluir um produto com vínculos operacionais.'
            );
        }

        $product->delete();

        return back()->with(
            'success',
            'Produto removido com sucesso.'
        );
    }

    public function toggleStatus(Product $product): RedirectResponse
    {
        $product->update([
            'active' => ! $product->active,
        ]);

        return back()->with(
            'success',
            'Status do produto atualizado.'
        );
    }

    public function search(Request $request)
    {
        return Product::query()
            ->where(
                'name',
                'ilike',
                "%{$request->q}%"
            )
            ->orderBy('name','ASC')
            ->limit(20)
            ->get([
                'id',
                'name',
                'unit',
            ]);
    }
}
