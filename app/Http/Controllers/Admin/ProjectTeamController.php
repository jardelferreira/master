<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProjectTeamRequest;
use App\Models\Project;
use App\Models\Team;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProjectTeamController extends Controller
{
    public function index(
        Project $project
    ): Response {
        return Inertia::render(
            'dashboard/projects/teams/Index',
            [
                'project' => [
                    'id' => $project->id,
                    'name' => $project->name,
                ],

                'teams' => $project
                    ->teams()
                    ->withCount([
                        'employees',
                        'leaders',
                    ])
                    ->get(),

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
            ]
        );
    }

    public function store(
        StoreProjectTeamRequest $request,
        Project $project
    ): RedirectResponse {
        $project->teams()
            ->syncWithoutDetaching([
                $request->team_id,
            ]);

        return back();
    }

    public function destroy(
        Project $project,
        Team $team
    ): RedirectResponse {
        $project->teams()
            ->detach(
                $team->id
            );

        return back();
    }
}
