<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStockMinimalRequest;
use App\Http\Requests\UpdateStockMinimalRequest;
use App\Models\Sector;
use App\Models\StockMinimal;
use Illuminate\Http\RedirectResponse;

class StockMinimalController extends Controller
{
    public function store(
        StoreStockMinimalRequest $request
    ): RedirectResponse {
        $projectId = $request->project_id;
        $sectorId = $request->sector_id;

        /*
        |--------------------------------------------------------------------------
        | Se setor informado e projeto vazio, inferimos automaticamente
        |--------------------------------------------------------------------------
        */
        if ($sectorId && ! $projectId) {
            $sector = Sector::findOrFail($sectorId);
            $projectId = $sector->project_id;
        }

        StockMinimal::create([
            'product_id' => $request->product_id,
            'project_id' => $projectId,
            'sector_id' => $sectorId,
            'min_quantity' => $request->min_quantity,
        ]);

        return back()->with(
            'success',
            'Configuração de estoque mínimo criada com sucesso.'
        );
    }

    public function update(
        UpdateStockMinimalRequest $request,
        StockMinimal $stockMinimal
    ): RedirectResponse {
        $projectId = $request->project_id;
        $sectorId = $request->sector_id;

        if ($sectorId && ! $projectId) {
            $sector = Sector::findOrFail($sectorId);
            $projectId = $sector->project_id;
        }

        $stockMinimal->update([
            'project_id' => $projectId,
            'sector_id' => $sectorId,
            'min_quantity' => $request->min_quantity,
        ]);

        return back()->with(
            'success',
            'Configuração de estoque mínimo atualizada com sucesso.'
        );
    }

    public function destroy(
        StockMinimal $stockMinimal
    ): RedirectResponse {
        $stockMinimal->delete();

        return back()->with(
            'success',
            'Configuração removida com sucesso.'
        );
    }
}
