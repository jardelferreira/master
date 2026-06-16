<?php

namespace App\Http\Controllers\Admin;

use App\Enum\TeamRoleEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTeamRequest;
use App\Http\Requests\UpdateTeamRequest;
use App\Models\Team;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class TeamController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render(
            'dashboard/teams/Index',
            [
                'teams' => Team::query()
                    ->with('parent')
                    ->withCount([
                        'children',
                        'employees',
                        'leaders',
                    ])
                    ->orderBy('sort_order')
                    ->orderBy('name')
                    ->get()
                    ->map(fn(Team $team) => [
                        'id' => $team->id,

                        'parent_id' => $team->parent_id,

                        'code' => $team->code,
                        'name' => $team->name,

                        'description' => $team->description,

                        'parent_name' => $team->parent?->name,

                        'children_count' => $team->children_count,
                        'employees_count' => $team->employees_count,
                        'leaders_count' => $team->leaders_count,

                        'sort_order' => $team->sort_order,

                        'active' => $team->active,

                        'created_at' => $team->created_at,
                        'updated_at' => $team->updated_at,
                    ]),

                'parentTeams' => Team::query()
                    ->where('active', true)
                    ->orderBy('name')
                    ->get()
                    ->map(fn(Team $team) => [
                        'id' => $team->id,
                        'name' => $team->name,
                    ]),
            ]
        );
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
    public function store(
        StoreTeamRequest $request
    ): RedirectResponse {
        Team::create(
            $request->validated()
        );

        return back()->with(
            'success',
            'Equipe cadastrada com sucesso.'
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(Team $team)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Team $team)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(
        UpdateTeamRequest $request,
        Team $team
    ): RedirectResponse {
        $team->update(
            $request->validated()
        );

        return back()->with(
            'success',
            'Equipe atualizada com sucesso.'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Team $team)
    {
        if (
            $team->children()->exists() ||
            $team->employees()->exists()
        ) {
            return back()->with(
                'error',
                'A equipe possui vínculos e não pode ser removida.'
            );
        }

        $team->delete();

        return back()->with('feedback', [
            'Equipe excluída'
        ]);
    }

    public function tree(): Response
    {
        $teams = Team::query()
            ->with([
                'children',
                'employees',
            ])
            ->whereNull('parent_id')
            ->get();

        return Inertia::render(
            'dashboard/teams/tree/Index',
            [
                'tree' => $this->buildTree(
                    $teams
                ),
            ]
        );
    }
    private function buildTree(
        Collection $teams
    ): array {
        return $teams
            ->map(fn(Team $team) => [
                'id' => $team->id,

                'name' => $team->name,

                'members' => $team
                    ->employees
                    ->map(fn($employee) => [
                        'id' => $employee->id,
                        'name' => $employee->name,
                        'role' => $employee->pivot->role,
                    ]),

                'children' => $this->buildTree(
                    $team->children
                ),
            ])
            ->toArray();
    }

    public function orgChart(): Response
    {
        $teams = Team::query()
            ->with([
                'children',
                'employees',
                'leaders',
            ])
            ->whereNull('parent_id')
            ->get();

        // dd($this->buildOrgChart($teams));

        return Inertia::render(
            'dashboard/teams/org-chart/Index',
            [
                'tree' => $this->buildOrgChart(
                    $teams
                ),
            ]
        );
    }

    private function buildOrgChart(
        Collection $teams
    ): array {
        return $teams
            ->map(
                fn(Team $team) => [
                    'id' => $team->id,

                    'name' => $team->name,

                    'leaders' => $team
                        ->leaders
                        ->map(fn($leader) => [
                            'id' => $leader->id,
                            'name' => $leader->name,
                        ])
                        ->values(),

                    'members' => $team
                        ->employees
                        ->reject(
                            fn($employee) =>
                            $employee->pivot->role ===
                                TeamRoleEnum::LEADER->value
                        )
                        ->map(fn($employee) => [
                            'id' => $employee->id,
                            'name' => $employee->name,
                        ])
                        ->values(),

                    'children' => $this->buildOrgChart(
                        $team->children
                    ),
                    'members_count' =>
                    $team->employees->count(),

                    'children_count' =>
                    $team->children->count(),
                ]
            )
            ->values()
            ->toArray();
    }
}
