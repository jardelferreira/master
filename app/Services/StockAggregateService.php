<?php

namespace App\Services;

use App\Models\Stock;
use App\Models\StockMinimal;
use Illuminate\Support\Facades\DB;

class StockAggregateService
{
    /*
    |--------------------------------------------------------------------------
    | TOTAL POR PRODUTO (com contexto opcional)
    |--------------------------------------------------------------------------
    */
    // Aplicação de cache futuramente
    // use Illuminate\Support\Facades\Cache;

    //     return Cache::remember(
    //         $this->cacheKey($productId, $projectId, $sectorId),
    //         60, // segundos
    //         function () use ($productId, $projectId, $sectorId) {

    //             return (float) Stock::query()
    //                 ->where('product_id', $productId)
    //                 ->when($projectId, fn($q) => $q->where('project_id', $projectId))
    //                 ->when($sectorId, fn($q) => $q->where('sector_id', $sectorId))
    //                 ->where('active', true)
    //                 ->sum('stock_quantity');
    //         }
    //     );
    public function getTotal(
        int $productId,
        ?int $projectId = null,
        ?int $sectorId = null
    ): float {
        return (float) Stock::query()
            ->where('product_id', $productId)
            ->when($projectId, fn($q) => $q->where('project_id', $projectId))
            ->when($sectorId, fn($q) => $q->where('sector_id', $sectorId))
            ->where('active', true)
            ->sum('stock_quantity');
    }

    /*
    |--------------------------------------------------------------------------
    | TOTAL AGRUPADO (dashboard)
    |--------------------------------------------------------------------------
    */
    public function getGroupedTotals(): \Illuminate\Support\Collection
    {
        return Stock::query()
            ->select([
                'product_id',
                'project_id',
                'sector_id',
                DB::raw('SUM(stock_quantity) as total'),
            ])
            ->where('active', true)
            ->groupBy('product_id', 'project_id', 'sector_id')
            ->get();
    }

    /*
    |--------------------------------------------------------------------------
    | BUSCAR MÍNIMO (com fallback)
    |--------------------------------------------------------------------------
    */
    public function getMinimal(
        int $productId,
        ?int $projectId = null,
        ?int $sectorId = null
    ): ?StockMinimal {

        return StockMinimal::query()
            ->where('product_id', $productId)
            ->where(function ($q) use ($projectId, $sectorId) {
                $q->where([
                    'project_id' => $projectId,
                    'sector_id' => $sectorId,
                ])
                ->orWhere(function ($q) use ($projectId) {
                    $q->where('project_id', $projectId)
                      ->whereNull('sector_id');
                })
                ->orWhere(function ($q) use ($sectorId) {
                    $q->whereNull('project_id')
                      ->where('sector_id', $sectorId);
                })
                ->orWhere(function ($q) {
                    $q->whereNull('project_id')
                      ->whereNull('sector_id');
                });
            })
            ->orderByRaw("
                CASE
                    WHEN project_id IS NOT NULL AND sector_id IS NOT NULL THEN 1
                    WHEN project_id IS NOT NULL THEN 2
                    WHEN sector_id IS NOT NULL THEN 3
                    ELSE 4
                END
            ")
            ->first();
    }

    /*
    |--------------------------------------------------------------------------
    | VERIFICAR ESTOQUE MÍNIMO
    |--------------------------------------------------------------------------
    */
    public function isLow(
        int $productId,
        ?int $projectId = null,
        ?int $sectorId = null
    ): bool {

        $total = $this->getTotal($productId, $projectId, $sectorId);

        $minimal = $this->getMinimal($productId, $projectId, $sectorId);

        if (!$minimal) {
            return false;
        }

        return $total <= $minimal->min_quantity;
    }

    /*
    |--------------------------------------------------------------------------
    | LISTAR PRODUTOS CRÍTICOS
    |--------------------------------------------------------------------------
    */
    public function getLowStock(): \Illuminate\Support\Collection
    {
        $totals = $this->getGroupedTotals();

        return $totals->filter(function ($row) {
            return $this->isLow(
                $row->product_id,
                $row->project_id,
                $row->sector_id
            );
        });
    }
}