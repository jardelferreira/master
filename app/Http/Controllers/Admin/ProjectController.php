<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Resources\StockMovementResource;
use App\Models\ApplicationArea;
use App\Models\Project;
use App\Models\Stock;
use App\Models\StockMovement;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\View\Components\App;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProjectRequest $request)
    {
        Project::create($request->all());

        return back()->with('feedback', [
            'status' => 'success',
            'message' => 'Projeto criado com sucesso',
            'type' => 'toast',
            'id' => uniqid(),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        $movements = StockMovement::getStockMovementsPreview($project->id);

        return Inertia::render('dashboard/projects/Show', [
            'project' => $project->load([
                'sectors',
                'users',
                'invoices',
                'applicationAreas',
                'teams' => fn($query) => $query
                    ->withCount([
                        'leaders',
                        'employees',
                    ]),
            ]),
            'users' => User::select('id', 'name', 'email')->get(),
            'sumary' => $project->getStockSummary(),
            'movements' => StockMovementResource::collection($movements)->resolve(),
            'availableTeams' => Team::query()
                ->whereDoesntHave(
                    'projects',
                    fn($query) =>
                    $query->where(
                        'projects.id',
                        $project->id,
                    ),
                )
                ->orderBy('name')
                ->get([
                    'id',
                    'name',
                ]),
            'availableAreas' => ApplicationArea::query()
                ->whereDoesntHave(
                    'projects',
                    fn($query) =>
                    $query->where(
                        'projects.id',
                        $project->id,
                    ),
                )
                ->orderBy('name')
                ->get([
                    'id',
                    'name',
                ]),
            'metrics' => [
                'total_products' => 128,
                'total_stock' => 3480,
                'total_cost' => 29358.48,
                'low_stock' => 7,
            ],

            'stock_summary' => [
                [
                    'id' => 1,
                    'product' => ['name' => 'Cabo 35mm'],
                    'quantity' => 120,
                    'status' => 'ok',
                ],
                [
                    'id' => 2,
                    'product' => ['name' => 'Disjuntor 150A'],
                    'quantity' => 8,
                    'status' => 'low',
                ],
                [
                    'id' => 3,
                    'product' => ['name' => 'Conector Terminal'],
                    'quantity' => 45,
                    'status' => 'ok',
                ],
                [
                    'id' => 4,
                    'product' => ['name' => 'Eletroduto PVC'],
                    'quantity' => 12,
                    'status' => 'warning',
                ],
                [
                    'id' => 5,
                    'product' => ['name' => 'Quadro de Distribuição'],
                    'quantity' => 3,
                    'status' => 'critical',
                ],
            ],

            'recent_activity' => [
                [
                    'id' => 1,
                    'description' => 'Entrada de 50 unidades de Cabo 35mm',
                    'date' => now()->subMinutes(15)->toDateTimeString(),
                ],
                [
                    'id' => 2,
                    'description' => 'Saída de 10 Disjuntores 150A',
                    'date' => now()->subHour()->toDateTimeString(),
                ],
                [
                    'id' => 3,
                    'description' => 'Cadastro de novo produto',
                    'date' => now()->subHours(3)->toDateTimeString(),
                ],
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Project $project)
    {
        $data = $request->validate([
            'name' => [
                'required',
                'string',
                Rule::unique('projects', 'name')->ignore($project),
            ],
            'description' => ['nullable', 'string'],
        ]);

        $project->update($data);

        return back()->with('feedback', [
            'status' => 'success',
            'message' => 'Projeto atualizado com sucesso',
            'type' => 'toast',
            'id' => Str::uuid(),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        $project->delete();

        return redirect()->route('dashboard')->with('feedback', [
            'status' => 'success',
            'message' => 'Projeto excluído com sucesso',
            'type' => 'toast',
            'id' => Str::uuid(),
        ]);
    }

    public function syncUsers(Request $request, Project $project)
    {
        $data = $request->validate([
            'users' => ['array'],
            'users.*' => ['exists:users,id'],
        ]);

        $project->users()->sync($data['users'] ?? []);

        return back()->with('feedback', [
            'status' => 'success',
            'message' => 'Usuários do projeto atualizados',
            'type' => 'toast',
            'id' => uniqid(),
        ]);
    }

    public function createSector(Project $project, Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $project->sectors()->create($data);

        return back()->with('feedback', [
            'status' => 'success',
            'message' => 'Setor criado com sucesso',
            'type' => 'toast',
            'id' => uniqid(),
        ]);
    }

    public function stock(Project $project)
    {
        // Busca stocks individuais do projeto
        $stocks = Stock::query()
            ->where('project_id', $project->id)
            ->where('stock_quantity', '>', 0)
            ->with([
                'invoice',
                'product:id,name,unit',
                'sector:id,name',
                'product.stockMinimals',
                'invoiceItem'
            ])
            ->orderBy('product_id')
            ->orderByDesc('stock_quantity')
            ->get()
            ->map(function ($stock) use ($project) {
                $stockMinimals = $stock->product->stockMinimals;

                $sectorMinimal = $stock->sector_id
                    ? $stockMinimals->firstWhere('sector_id', $stock->sector_id)
                    : null;

                $projectMinimal = $stockMinimals->first(function ($item) use ($project) {
                    return $item->project_id === $project->id
                        && $item->sector_id === null;
                });

                $globalMinimal = $stockMinimals->first(function ($item) {
                    return $item->project_id === null
                        && $item->sector_id === null;
                });

                $minStock = $sectorMinimal
                    ?? $projectMinimal
                    ?? $globalMinimal;

                return [
                    'id' => $stock->id,
                    'uuid' => $stock->uuid,
                    'product_id' => $stock->product_id,
                    'project_name' => $stock->project->name,
                    'invoice' => [
                        'id' => $stock->invoice->id,
                        'number' => $stock->invoice->number,
                        'series' => $stock->invoice->series,
                        'type' => $stock->invoice->type,
                    ],
                    'product' => [
                        'id' => $stock->product->id,
                        'name' => $stock->product->name,
                        'unit' => $stock->product->unit,
                        'min_quantity' => $minStock ? (float) $minStock->min_quantity : null,
                    ],
                    'items' => $stock->InvoiceItem,
                    'stock_quantity' => (float) $stock->stock_quantity,
                    'stock_location' => $stock->stock_location,
                    'sector' => $stock->sector ? [
                        'id' => $stock->sector->id,
                        'name' => $stock->sector->name,
                    ] : null,
                    'expires_at' => $stock->expires_at?->toDateString(),
                    'serial' => $stock->serial,
                ];
            });

        // Agrupa por product_id para resumo
        $summary = $stocks
            ->groupBy('product_id')
            ->map(function ($group) {
                $first = $group->first();

                return [
                    'id' => $first['product_id'],
                    'product_id' => $first['product_id'],
                    'product' => $first['product'],
                    'total_quantity' => $group->sum('stock_quantity'),
                    'stock_ids' => $group->pluck('id')->toArray(),
                ];
            })
            ->values();
        // dd(Stock::with('movements')->find(1));

        return Inertia::render('dashboard/projects/StockIndex', [
            'project' => $project->only(['id', 'name']),
            'stocks' => $stocks,
            'summary' => $summary,
        ]);
    }
}
