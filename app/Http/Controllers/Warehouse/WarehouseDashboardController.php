<?php

namespace App\Http\Controllers\Warehouse;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Stock;
use App\Models\StockMovement;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class WarehouseDashboardController extends Controller
{
    public function index(): Response
    {
        $projects = Project::query()
            ->orderBy('name')
            ->get()
            ->map(fn(Project $project) => [
                'id' => $project->id,
                'uuid' => $project->uuid,
                'name' => $project->name,
            ]);

        return Inertia::render('warehouse/Index', [
            'projects' => $projects,
        ]);
    }

    public function show(Project $project): Response
    {
        $stocks = Stock::query()
            ->where('project_id', $project->id)
            ->where('stock_quantity', '>', 0)
            ->count();

        $criticalStocks = Stock::query()
            ->where('project_id', $project->id)
            ->where('stock_quantity', '>', 0)
            ->with('product.stockMinimals')
            ->get()
            ->filter(function ($stock) {
                $minimal = $stock->product
                    ->stockMinimals
                    ->firstWhere('project_id', $stock->project_id);

                return $minimal
                    && $stock->stock_quantity <= $minimal->min_quantity;
            })
            ->count();

        $movementsToday = StockMovement::query()
            ->where('project_id', $project->id)
            ->whereDate('performed_at', today())
            ->count();

        $recentMovements = StockMovement::query()
            ->where('project_id', $project->id)
            ->with([
                'product:id,name',
                'user:id,name',
            ])
            ->latest('performed_at')
            ->limit(10)
            ->get()
            ->map(fn($movement) => [
                'id' => $movement->id,
                'type' => $movement->type,
                'direction' => $movement->direction,
                'quantity' => (float) $movement->quantity,
                'performed_at' => $movement->performed_at?->toISOString(),

                'product' => [
                    'id' => $movement->product->id,
                    'name' => $movement->product->name,
                ],

                'user' => $movement->user ? [
                    'id' => $movement->user->id,
                    'name' => $movement->user->name,
                ] : null,
            ]);

        return Inertia::render('warehouse/Dashboard', [
            'project' => [
                'id' => $project->id,
                'uuid' => $project->uuid,
                'name' => $project->name,
            ],

            'stats' => [
                'stocks_count' => $stocks,
                'critical_count' => $criticalStocks,
                'movements_today' => $movementsToday,
            ],

            'recent_movements' => $recentMovements,
        ]);
    }

    public function users(Project $project): JsonResponse
    {
       $users = User::all();

        return response()->json($users);
    }
}
