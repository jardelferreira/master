<?php

namespace App\Http\Controllers\Warehouse;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Sector;
use App\Models\Stock;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class WarehouseStockController extends Controller
{
    public function index(Project $project): Response
    {
        $stocks = Stock::query()
            ->where('project_id', $project->id)
            ->where('stock_quantity', '>', 0)
            ->with([
                'product.stockMinimals',
                'sector:id,name',
            ])
            ->orderBy('product_id')
            ->orderByDesc('stock_quantity')
            ->get()
            ->map(function (Stock $stock) {
                $stockMinimals = $stock->product->stockMinimals;

                $sectorMinimal = $stock->sector_id
                    ? $stockMinimals->firstWhere(
                        'sector_id',
                        $stock->sector_id
                    )
                    : null;

                $projectMinimal = $stockMinimals->first(function ($item) use ($stock) {
                    return $item->project_id === $stock->project_id
                        && $item->sector_id === null;
                });

                $globalMinimal = $stockMinimals->first(function ($item) {
                    return $item->project_id === null
                        && $item->sector_id === null;
                });

                $minimal = $sectorMinimal
                    ?? $projectMinimal
                    ?? $globalMinimal;

                $minQuantity = $minimal
                    ? (float) $minimal->min_quantity
                    : null;

                $currentQuantity = (float) $stock->stock_quantity;

                $status = 'ok';

                if ($minQuantity !== null && $currentQuantity <= 0) {
                    $status = 'empty';
                } elseif (
                    $minQuantity !== null &&
                    $currentQuantity <= $minQuantity
                ) {
                    $status = 'critical';
                }

                return [
                    'id' => $stock->id,
                    'uuid' => $stock->uuid,
                    'project_id' => $stock->project_id,

                    'product' => [
                        'id' => $stock->product->id,
                        'name' => $stock->product->name,
                    ],

                    'sector' => $stock->sector ? [
                        'id' => $stock->sector->id,
                        'name' => $stock->sector->name,
                    ] : null,

                    'unit' => $stock->product->unit?->label(),

                    'stock_quantity' => $currentQuantity,
                    'min_quantity' => $minQuantity,
                    'status' => $status,
                ];
            });

        return Inertia::render('warehouse/Stocks', [
            'project' => [
                'id' => $project->id,
                'uuid' => $project->uuid,
                'name' => $project->name,
            ],
            'stocks' => $stocks,
            'users' => User::all(),
        ]);
    }

    public function transferOptions(
        Project $project,
        Stock $stock
    ) {
        abort_unless(
            $stock->project_id === $project->id,
            404
        );

        $stocks1 = Sector::where('id', '!=', $stock->sector_id)
            ->with([
                'project',
                'stocks' => fn($query) => $query
                    ->where('product_id', $stock->product_id),
            ])
            ->get()
            ->map(fn(Sector $sector) => [
                'id' => $sector->id,
                'project' => [
                    'id' => $sector->project->id,
                    'name' => $sector->project->name,
                ],
                'sector' => [
                    'id' => $sector->id,
                    'name' => $sector->name,
                ],
                'stock_quantity' => (float) (
                    $sector->stocks->sum('stock_quantity')
                ),
            ]);

        $stocks = Stock::query()
            ->where('product_id', $stock->product_id)
            ->where('id', '!=', $stock->id)
            ->where('stock_quantity', '>=', 0)
            ->with([
                'project:id,name',
                'sector:id,name',
            ])
            ->orderBy('project_id')
            ->get()
            ->map(fn(Stock $item) => [
                'id' => $item->id,

                'project' => [
                    'id' => $item->project->id,
                    'name' => $item->project->name,
                ],

                'sector' => $item->sector ? [
                    'id' => $item->sector->id,
                    'name' => $item->sector->name,
                ] : null,

                'stock_quantity' => (float) $item->stock_quantity,
            ]);

        return response()->json($stocks1);
    }
}
