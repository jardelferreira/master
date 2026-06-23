<?php

namespace App\Http\Controllers\Warehouse;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\StockMovement;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class StockConsultaController extends Controller
{

    public function consultaIndex(): Response
    {

        // $user = Auth::guard('stock')->user();
        $user = Auth::user();

        $projects =
            Project::select('projects.id', 'projects.name', 'projects.initials', 'projects.description')
            ->orderBy('projects.name')
            ->get()
            ->map(fn($p) => [
                'id'          => $p->id,
                'name'        => $p->name,
                'initials'    => $p->initials,
                'description' => $p->description,
            ]);

        return Inertia::render('warehouse/ConsultaIndex', [
            'user'     => ['name' => $user->name],
            'projects' => $projects,
        ]);
    }

    /**
     * Exibe a página de consulta de estoque de um projeto.
     *
     * Retorna estoques agrupados por produto + setor, com:
     *   - quantidade total disponível
     *   - estoque mínimo configurado (se houver)
     *   - status (ok / critical / empty)
     */
    public function index(Request $request, Project $project)
    {
        // Estoques ativos do projeto, agrupados por produto + setor
        $stocks = $project->stocks()
            ->with([
                'product.stockMinimals',
                'sector:id,name',
            ])
            ->where('active', true)
            ->selectRaw('
                product_id,
                sector_id,
                MIN(id) as id,
                SUM(stock_quantity) as total_quantity
            ')
            ->groupBy('product_id', 'sector_id')
            ->get()
            ->map(function ($stock) use ($project) {
                $product = $stock->product;
                $minQty = $product->resolveLoadedMinStock(
                    projectId: $project->id,
                    sectorId: $stock->sector_id,
                );

                $status = match (true) {
                    $stock->total_quantity <= 0                              => 'empty',
                    $minQty !== null && $stock->total_quantity <= $minQty   => 'critical',
                    default                                                  => 'ok',
                };

                return [
                    'id'             => $stock->id,
                    'product_id'     => $product->id,
                    'product_name'   => $product->name,
                    'product_sku'    => $product->sku,
                    'product_unit'   => $product->unit?->value ?? null,
                    'sector_id'      => $stock->sector_id,
                    'sector_name'    => $stock->sector?->name,
                    'total_quantity' => (float) $stock->total_quantity,
                    'min_quantity'   => $minQty,
                    'status'         => $status,
                ];
            });

        // Setores únicos do projeto (para filtro)
        $sectors = $project->sectors()
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        return Inertia::render('warehouse/StockConsulta', [
            'project' => [
                'id'   => $project->id,
                'name' => $project->name,
            ],
            'stocks'  => $stocks,
            'sectors' => $sectors,
        ]);
    }

    /**
     * Retorna o histórico de movimentações de um produto específico no projeto.
     * Chamado via AJAX ao abrir o drawer de detalhes.
     */
    public function movements(Request $request, Project $project, int $productId)
    {
        $movements = StockMovement::query()
            ->with([
                'sector:id,name',
                'user:id,name',
                'employee:id,name',
                'team:id,name',
            ])
            ->where('project_id', $project->id)
            ->where('product_id', $productId)
            ->latest('performed_at')
            ->limit(50)
            ->get()
            ->map(fn($m) => [
                'id'           => $m->id,
                'type'         => $m->type?->value ?? $m->type,
                'type_label'   => $m->type?->label() ?? $m->type,
                'direction'    => $m->direction,
                'quantity'     => (float) $m->quantity,
                'balance_after' => $m->balance_after !== null ? (float) $m->balance_after : null,
                'performed_at' => $m->performed_at?->toISOString(),
                'notes'        => $m->notes,
                'sector'       => $m->sector?->name,
                'user'         => $m->user?->name,
                'employee'     => $m->employee?->name,
                'team'         => $m->team?->name,
            ]);

        return response()->json($movements);
    }
}
