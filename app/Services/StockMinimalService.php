<?php

namespace App\Services;

use App\Models\StockMinimal;

class StockMinimalService
{
    public function resolve(
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
}