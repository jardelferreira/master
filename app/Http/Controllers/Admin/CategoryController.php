<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryShowResource;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(): Response
    {
        $categories = Category::query()
            ->with(['parent'])
            ->withCount(['products', 'children'])
            ->latest()
            ->get()
            ->map(fn(Category $category) => [
                'id' => $category->id,
                'uuid' => $category->uuid,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
                'active' => $category->active,
                'products_count' => $category->products_count,
                'children_count' => $category->children_count,

                'parent' => $category->parent ? [
                    'id' => $category->parent->id,
                    'name' => $category->parent->name,
                ] : null,

                'created_at' => $category->created_at?->toISOString(),
                'updated_at' => $category->updated_at?->toISOString(),
                'deleted_at' => $category->deleted_at?->toISOString(),
            ]);

        $parents = Category::query()
            ->orderBy('name')
            ->get(['id', 'name', 'parent_id']);

        return Inertia::render('dashboard/categories/Index', [
            'categories' => $categories,
            'parents' => $parents,
        ]);
    }

    public function show(Category $category): Response
    {
        $category->load([
            'parentRecursive',
            'childrenRecursive',
            'products',
        ]);

        $parents = Category::query()
            ->orderBy('name')
            ->get(['id', 'name', 'parent_id']);

        return Inertia::render(
            'dashboard/categories/Show',
            array_merge(
                (new CategoryShowResource($category))->toArray(request()),
                [
                    'parents' => $parents,
                ]
            )
        );
    }

    public function store(StoreCategoryRequest $request): RedirectResponse
    {
        Category::create([
            'name' => $request->name,
            'description' => $request->description,
            'parent_id' => $request->parent_id,
            'active' => $request->boolean('active'),
        ]);

        return back()->with('success', 'Categoria cadastrada com sucesso.');
    }

    public function update(UpdateCategoryRequest $request, Category $category): RedirectResponse
    {
        $category->update([
            'name' => $request->name,
            'description' => $request->description,
            'parent_id' => $request->parent_id,
            'active' => $request->boolean('active'),
        ]);

        return back()->with('success', 'Categoria atualizada com sucesso.');
    }

    public function destroy(Category $category): RedirectResponse
    {
        if ($category->products()->exists()) {
            return back()->with('error', 'Não é possível excluir uma categoria com produtos vinculados.');
        }

        if ($category->children()->exists()) {
            return back()->with('error', 'Não é possível excluir uma categoria que possui subcategorias.');
        }

        $category->delete();

        return back()->with('success', 'Categoria removida com sucesso.');
    }

    public function toggleStatus(Category $category): RedirectResponse
    {
        $category->update([
            'active' => ! $category->active,
        ]);

        return back()->with('success', 'Status da categoria atualizado.');
    }
}
