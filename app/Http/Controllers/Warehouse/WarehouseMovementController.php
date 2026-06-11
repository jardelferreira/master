<?php

namespace App\Http\Controllers\Warehouse;

use App\DTO\StockMovementContext;
use App\Enum\StockMovementTypeEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreWarehouseMovementRequest;
use App\Models\ApplicationArea;
use App\Models\Employee;
use App\Models\Project;
use App\Models\Sector;
use App\Models\Stock;
use App\Models\StockMovement;
use App\Models\Team;
use App\Services\StockMovementContextResolver;
use App\Services\StockMovementService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class WarehouseMovementController extends Controller
{
    public function __construct(
        private StockMovementService $stockMovementService,
        private StockMovementContextResolver $contextResolver,
    ) {}

    public function index(Project $project): Response
    {
        // $test = StockMovement::latest()->first();
        // dd($test);
        $movements = StockMovement::query()
            ->where('project_id', $project->id)
            ->with([
                'product:id,name,unit',
                'user:id,name',
                'employee:id,name',
                'team:id,name',
                'parent:id,type',
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
                    'employee' => $movement->employee ? [
                        'id' => $movement->employee->id,
                        'name' => $movement->employee->name,
                    ] : null,

                    'team' => $movement->team ? [
                        'id' => $movement->team->id,
                        'name' => $movement->team->name,
                    ] : null,

                    'returned_quantity' =>
                    $movement->getReturnedQuantity(),

                    'net_quantity' =>
                    $movement->getNetQuantity(),

                    'parent_movement_id' =>
                    $movement->parent_movement_id,

                    'parent_type' =>
                    $movement->parent?->type,

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

        $teams = $project
            ->teams()
            ->with([
                'employees:id,name',
            ])
            ->orderBy('teams.name')
            ->get([
                'teams.id',
                'teams.name',
            ]);
        $employees = Employee::query()
            ->whereHas(
                'teams.projects',
                fn($query) =>
                $query->where(
                    'projects.id',
                    $project->id,
                ),
            )
            ->orderBy('name')
            ->get([
                'employees.id',
                'employees.name',
            ]);
        $applicationAreas = $project
            ->applicationAreas()
            ->select([
                'application_areas.id',
                'application_areas.name',
            ])
            ->orderBy('application_areas.name')
            ->get();

        return Inertia::render('warehouse/Movements', [
            'project' => [
                'id' => $project->id,
                'name' => $project->name,
            ],

            'movements' => $movements,
            'teams' => $teams,
            'empolyees' => $employees,
            'applicationAreas' =>
                $applicationAreas,
        ]);
    }

    public function store(
        StoreWarehouseMovementRequest $request,
        Project $project
    ): RedirectResponse {

        $stock = null;

        if (
            $request->type !==
            StockMovementTypeEnum::RETURN->value
        ) {

            $stock = Stock::findOrFail(
                $request->stock_id
            );

            abort_unless(
                $stock->project_id === $project->id,
                404
            );
        }

        $userId = Auth::user()->id;

        $context =
            $this->buildContext(
                request: $request,
                project: $project,
            );

        match ($request->type) {
            StockMovementTypeEnum::CONSUMPTION->value =>

            $this->stockMovementService
                ->consume(
                    stock: $stock,
                    quantity: (float) $request->quantity,
                    context: $context,
                    userId: $userId,
                    notes: $request->notes,
                ),

            StockMovementTypeEnum::LOSS->value =>
            $this->stockMovementService->loss(
                stock: $stock,
                quantity: (float) $request->quantity,
                userId: $userId,
                notes: $request->notes
            ),

            StockMovementTypeEnum::RETURN->value =>


            $this->stockMovementService
                ->returnToStock(
                    movement: StockMovement::query()
                        ->where(
                            'project_id',
                            $project->id
                        )
                        ->findOrFail(
                            $request->movement_id
                        ),

                    quantity: (float) $request->quantity,

                    context: $context,

                    userId: $userId,

                    notes: $request->notes,
                ),

            StockMovementTypeEnum::ADJUST->value =>
            $this->stockMovementService->adjust(
                stock: $stock,
                newQuantity: (float) $request->new_quantity,
                userId: $userId,
                notes: $request->notes
            ),

            StockMovementTypeEnum::ASSIGNMENT->value =>

            $this->stockMovementService
                ->assignToUser(
                    stock: $stock,
                    quantity: (float) $request->quantity,
                    context: $context,
                    userId: $userId,
                    notes: $request->notes,
                ),
            StockMovementTypeEnum::TRANSFER->value =>
            $this->stockMovementService
                ->transfer(
                    source: $stock,

                    sector: Sector::findOrFail(
                        $request->destination_sector_id
                    ),

                    quantity: (float) $request->quantity,

                    context: $context,

                    userId: $userId,

                    notes: $request->notes,
                ),
        };

        return back()->with(
            'success',
            'Movimentação registrada com sucesso.'
        );
    }

    private function buildContext(
        StoreWarehouseMovementRequest $request,
        Project $project,
    ): ?StockMovementContext {

        return match ($request->type) {

            StockMovementTypeEnum::CONSUMPTION->value =>

            $this->contextResolver
                ->buildConsumptionContext(
                    project: $project,

                    employee: Employee::findOrFail(
                        $request->employee_id
                    ),

                    team: Team::findOrFail(
                        $request->team_id
                    ),

                    applicationArea: ApplicationArea::findOrFail(
                        $request->application_area_id
                    ),
                ),

            StockMovementTypeEnum::ASSIGNMENT->value =>

            $this->contextResolver
                ->buildAssignmentContext(
                    project: $project,

                    employee: Employee::findOrFail(
                        $request->employee_id
                    ),

                    team: Team::findOrFail(
                        $request->team_id
                    ),

                    destinationUserId: $request->destination_user_id
                        ? (int) $request->destination_user_id
                        : null
                ),

            StockMovementTypeEnum::TRANSFER->value =>

            new StockMovementContext(
                destinationUserId: $request->destination_user_id
                    ? (int) $request->destination_user_id
                    : null,
            ),

            StockMovementTypeEnum::RETURN->value =>

            $this->contextResolver
                ->buildReturnContext(
                    project: $project,

                    employee: Employee::findOrFail(
                        $request->employee_id
                    ),

                    team: Team::findOrFail(
                        $request->team_id
                    ),

                    destinationUserId: $request->destination_user_id
                        ? (int) $request->destination_user_id
                        : null,
                ),

            default => null,
        };
    }

    public function returnableMovements(
        Project $project
    ): JsonResponse {

        $movements = StockMovement::query()
            ->returnable()
            ->with([
                'stock.product:id,name',
                'employee:id,name',
                'team:id,name',
            ])
            ->where(
                'project_id',
                $project->id,
            )
            ->latest()
            ->get()
            ->filter(
                fn(StockMovement $movement) =>
                $movement->getNetQuantity() > 0
            )
            ->values();

        return response()->json(
            $movements->map(
                fn(StockMovement $movement) => [

                    'id' => $movement->id,

                    'type' => $movement->type,

                    'product' =>
                    $movement->stock?->product?->name,

                    'employee' =>
                    $movement->employee?->name,

                    'team' =>
                    $movement->team?->name,

                    'quantity' =>
                    $movement->quantity,

                    'returned_quantity' =>
                    $movement->getReturnedQuantity(),

                    'available_quantity' =>
                    $movement->getNetQuantity(),

                    'performed_at' =>
                    $movement->performed_at,
                    'stock_id' => $movement->stock_id,

                    'product_id' => $movement->product_id,

                    'employee_id' => $movement->employee_id,

                    'team_id' => $movement->team_id,

                    'label' => sprintf(
                        '#%d | %s | %s | Saldo: %.1f',
                        $movement->id,
                        strtoupper($movement->type->label()),
                        $movement->stock?->product?->name ?? '-',
                        $movement->getNetQuantity(),
                    ),
                ]
            )
        );
    }
}
