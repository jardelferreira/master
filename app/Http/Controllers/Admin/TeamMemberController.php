<?php

namespace App\Http\Controllers\Admin;

use App\Enum\TeamRoleEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTeamMemberRequest;
use App\Http\Requests\UpdateTeamMemberRequest;
use App\Models\Employee;
use App\Models\Team;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class TeamMemberController extends Controller
{
    public function index(
        Team $team
    ): Response {
        $team->load('parent');

        return Inertia::render(
            'dashboard/teams/members/Index',
            [
                'team' => [
                    'id' => $team->id,
                    'name' => $team->name,
                    'parent_id' => $team->parent_id,
                    'parent_name' => $team->parent?->name,
                ],

                'members' => $team
                    ->employees()
                    ->with([
                        'company',
                        'occupation',
                    ])
                    ->orderBy('name')
                    ->get()
                    ->map(fn (Employee $employee) => [
                        'id' => $employee->id,
                        'employee_id' => $employee->id,

                        'name' => $employee->name,
                        'cpf' => $employee->cpf,

                        'company_name' => $employee->company?->name,
                        'occupation_name' => $employee->occupation?->name,

                        'role' => $employee->pivot->role,
                        'is_primary' => (bool) $employee->pivot->is_primary,
                        'active' => (bool) $employee->pivot->active,
                    ])
                    ->values(),

                'employees' => Employee::query()
                    ->where('active', true)
                    ->orderBy('name')
                    ->get()
                    ->map(fn (Employee $employee) => [
                        'id' => $employee->id,
                        'name' => $employee->name,
                        'cpf' => $employee->cpf,

                        'label' => trim(
                            sprintf(
                                '%s%s',
                                $employee->name,
                                $employee->cpf
                                    ? ' (' . $employee->cpf . ')'
                                    : ''
                            )
                        ),
                    ])
                    ->values(),
                    'roles' => TeamRoleEnum::options(),
            ]
        );
    }

    public function store(
        StoreTeamMemberRequest $request,
        Team $team
    ): RedirectResponse {
        $employeeId = (int) $request->employee_id;

        $alreadyExists = $team
            ->employees()
            ->where('employees.id', $employeeId)
            ->exists();

        if ($alreadyExists) {
            return back()->with(
                'error',
                'O colaborador já pertence a esta equipe.'
            );
        }

        DB::transaction(function () use (
            $request,
            $team,
            $employeeId
        ) {
            if ($request->boolean('is_primary')) {
                $this->clearPrimaryTeams(
                    $employeeId
                );
            }

            $team->employees()->attach(
                $employeeId,
                [
                    'role' => $request->role,
                    'is_primary' => $request->boolean('is_primary'),
                    'active' => $request->boolean('active', true),
                ]
            );
        });

        return back()->with(
            'success',
            'Membro adicionado à equipe com sucesso.'
        );
    }

    public function update(
        UpdateTeamMemberRequest $request,
        Team $team,
        Employee $employee
    ): RedirectResponse {
        $exists = $team
            ->employees()
            ->where('employees.id', $employee->id)
            ->exists();

        if (! $exists) {
            abort(404);
        }

        DB::transaction(function () use (
            $request,
            $team,
            $employee
        ) {
            if ($request->boolean('is_primary')) {
                $this->clearPrimaryTeams(
                    $employee->id
                );
            }

            $team->employees()->updateExistingPivot(
                $employee->id,
                [
                    'role' => $request->role,
                    'is_primary' => $request->boolean('is_primary'),
                    'active' => $request->boolean('active', true),
                ]
            );
        });

        return back()->with(
            'success',
            'Vínculo atualizado com sucesso.'
        );
    }

    public function destroy(
        Team $team,
        Employee $employee
    ): RedirectResponse {
        $team->employees()->detach(
            $employee->id
        );

        return back()->with(
            'success',
            'Membro removido da equipe com sucesso.'
        );
    }

    private function clearPrimaryTeams(
        int $employeeId
    ): void {
        DB::table('team_employees')
            ->where('employee_id', $employeeId)
            ->update([
                'is_primary' => false,
            ]);
    }
}