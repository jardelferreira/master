<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\StoreInventoryRequest;
use App\Http\Resources\Inventory\InventoryItemShowResource;
use App\Http\Resources\Inventory\InventoryShowResource;
use App\Models\Inventory;
use App\Models\InventoryItem;
use App\Models\Project;
use App\Models\Stock;
use App\Services\InventoryService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class InventoryController extends BaseController
{
    public function index()
    {
        $inventories = Inventory::query()
            ->with([
                'project:id,name',
                'creator:id,name',
            ])
            ->withCount('items')
            ->latest()
            ->get();

        return Inertia::render(
            'dashboard/inventories/Index',
            [
                'inventories' => $inventories,
            ]
        );
    }

    public function show(Inventory $inventory)
    {
        $inventory->load([
            'project',
            'creator',
            'approver',
            'users',
            'items.stock.product',
            'items.stock.sector',
            'items.countedBy',
        ]);

        return Inertia::render(
            'dashboard/inventories/Show',
            [
                'inventory' => InventoryShowResource::make($inventory)->resolve(),
            ]
        );
    }

    public function create()
    {
        return Inertia::render(
            'dashboard/inventories/Create',
            [
                'projects' => Project::query()
                    ->select('id', 'name')
                    ->orderBy('name')
                    ->get(),
            ]
        );
    }

    public function store(
        StoreInventoryRequest $request,
        InventoryService $inventoryService,
    ) {
        $inventory = $inventoryService->create(
            data: $request->validated(),
            createdBy: Auth::id(),
        );

        return redirect()
            ->route(
                'admin.inventories.show',
                $inventory
            )
            ->with(
                'success',
                'Inventário criado com sucesso.'
            );
    }

    public function finish(
        Inventory $inventory,
        InventoryService $service,
    ) {
        $service->finish($inventory);
        
        return redirect()
            ->route(
                'admin.inventories.show',
                $inventory
            )
            ->with(
                'feedback',
                'Inventário finalizado com sucesso.'
            );
    }

    public function cancel(
        Inventory $inventory,
        InventoryService $service,
    ) {
        $service->cancel($inventory);

        return redirect()
            ->route(
                'admin.inventories.show',
                $inventory
            )
            ->with(
                'success',
                'Inventário cancelado.'
            );
    }

    public function approve(
        Inventory $inventory,
        InventoryService $service,
    ) {
        $service->approve(
            inventory: $inventory,
            approvedBy: Auth::user(),
        );

        return redirect()
            ->route(
                'admin.inventories.show',
                $inventory
            )
            ->with(
                'success',
                'Inventário aprovado com sucesso.'
            );
    }

    /*
    |--------------------------------------------------------------------------
    | Endpoints auxiliares (usados pelo Create.tsx via axios)
    |--------------------------------------------------------------------------
    */

    public function users(Project $project)
    {
        return response()->json(
            $project->users()->select('users.id', 'users.name')->get()
        );
    }

    /**
     * Retorna todos os stocks ativos do projeto,
     * com produto e setor — sem filtrar por setor.
     */
    public function stocks(Project $project)
    {
        return response()->json(
            Stock::query()
                ->with([
                    'product:id,name,sku,unit',
                    'sector:id,name',
                ])
                ->where('project_id', $project->id)
                ->where('active', true)
                ->orderBy('sector_id')
                ->get()
        );
    }

    public function item(InventoryItem $inventoryItem)
    {
        $inventoryItem->load([
            'inventory',
            'stock.project',
            'stock.sector',
            'stock.product.category',
            'stock.invoice.provider',
            'countedBy',
        ]);

        return InventoryItemShowResource::make($inventoryItem);
    }

    public function updateItem(
        Request $request,
        InventoryItem $inventoryItem,
    ) {
        if(!$inventoryItem->inventory->isOpen()){
           return response()->json([
           'success' => false,
           'message' => "O inventário não está aberto." 
           ]);
        }
        $validated = $request->validate([
            'counted_quantity' => ['required', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string'],
        ]);

        $inventoryItem->fill([
            'counted_quantity' => $validated['counted_quantity'],
            'notes' => $validated['notes'] ?? null,
            'counted_at' => now(),
            'counted_by' => Auth::id(),
        ]);

        $inventoryItem->difference =
            $inventoryItem->counted_quantity -
            $inventoryItem->system_quantity;

        $inventoryItem->save();

        $inventoryItem->load([
            'stock.product.category',
            'stock.project',
            'stock.sector',
            'countedBy',
        ]);

        $inventory = $inventoryItem->inventory->fresh(['items']);

        return response()->json([
            'data' => [
                'success' => true,
                'item' => InventoryItemShowResource::make($inventoryItem)->resolve(),
                'statistics' => [
                    'items'       => $inventory->items->count(),
                    'counted'     => $inventory->items->filter->hasBeenCounted()->count(),
                    'pending'     => $inventory->items->reject->hasBeenCounted()->count(),
                    'adjustments' => $inventory->items->filter->needsAdjustment()->count(),
                ],
                'status' => [
                    'value'       => $inventory->status->value,
                    'label'       => $inventory->status->label(),
                    'badge'       => $inventory->status->badgeClass(),
                    'permissions' => $inventory->status->permissions(),
                ],
            ],
        ]);
    }
}