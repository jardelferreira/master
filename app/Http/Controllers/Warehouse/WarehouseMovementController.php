<?php

namespace App\Http\Controllers\Warehouse;

use App\Enum\StockMovementTypeEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreWarehouseMovementRequest;
use App\Models\Project;
use App\Models\Sector;
use App\Models\Stock;
use App\Models\StockMovement;
use App\Services\StockMovementService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class WarehouseMovementController extends Controller
{
    public function __construct(
        private StockMovementService $stockMovementService
    ) {
    }

    public function index(Project $project): Response
    {
        $movements = StockMovement::query()
            ->where('project_id', $project->id)
            ->with([
                'product:id,name,unit',
                'user:id,name',
                'stock:id,sector_id',
                'stock.sector:id,name',
            ])
            ->latest('performed_at')
            ->get()
            ->map(function (StockMovement $movement) {
                return [
                    'id' => $movement->id,
                    'type' => $movement->type,
                    'direction' => $movement->direction,
                    'quantity' => (float) $movement->quantity,
                    'performed_at' => $movement->performed_at?->toDateTimeString(),

                    'product' => [
                        'id' => $movement->product->id,
                        'name' => $movement->product->name,
                        'unit' => $movement->product->unit?->label(),
                    ],

                    'sector' => $movement->stock?->sector ? [
                        'id' => $movement->stock->sector->id,
                        'name' => $movement->stock->sector->name,
                    ] : null,

                    'user' => $movement->user ? [
                        'id' => $movement->user->id,
                        'name' => $movement->user->name,
                    ] : null,

                    'notes' => $movement->notes,
                ];
            });

        return Inertia::render('warehouse/Movements', [
            'project' => [
                'id' => $project->id,
                'name' => $project->name,
            ],

            'movements' => $movements,
        ]);
    }

    public function store(
        StoreWarehouseMovementRequest $request,
        Project $project
    ): RedirectResponse {
        $stock = Stock::findOrFail($request->stock_id);
        
        abort_unless(
            $stock->project_id === $project->id,
            404
        );

        $userId = Auth::user()->id;

        match ($request->type) {
            StockMovementTypeEnum::CONSUMPTION->value =>
                $this->stockMovementService->consume(
                    stock: $stock,
                    quantity: (float) $request->quantity,
                    userId: $userId,
                    notes: $request->notes
                ),

            StockMovementTypeEnum::LOSS->value =>
                $this->stockMovementService->loss(
                    stock: $stock,
                    quantity: (float) $request->quantity,
                    userId: $userId,
                    notes: $request->notes
                ),

            StockMovementTypeEnum::RETURN->value =>
                $this->stockMovementService->returnToStock(
                    stock: $stock,
                    quantity: (float) $request->quantity,
                    userId: $userId,
                    notes: $request->notes
                ),

            StockMovementTypeEnum::ADJUST->value =>
                $this->stockMovementService->adjust(
                    stock: $stock,
                    newQuantity: (float) $request->new_quantity,
                    userId: $userId,
                    notes: $request->notes
                ),

            StockMovementTypeEnum::ASSIGNMENT->value =>
                $this->stockMovementService->assignToUser(
                    stock: $stock,
                    quantity: (float) $request->quantity,
                    destinationUserId: (int) $request->destination_user_id,
                    userId: $userId,
                    notes: $request->notes
                ),

            StockMovementTypeEnum::TRANSFER->value =>
                $this->stockMovementService->transfer(
                    source: $stock,
                    sector: Sector::findOrFail(
                        $request->destination_stock_id
                    ),
                    quantity: (float) $request->quantity,
                    userId: $userId,
                    notes: $request->notes
                ),
        };

        return back()->with(
            'success',
            'Movimentação registrada com sucesso.'
        );
    }
}