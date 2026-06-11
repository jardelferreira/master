<?php

namespace App\Services;

use App\DTO\StockMovementContext;
use App\Models\ApplicationArea;
use App\Models\Employee;
use App\Models\Project;
use App\Models\Team;
use DomainException;

class StockMovementContextResolver
{
    public function buildConsumptionContext(
        Project $project,
        Employee $employee,
        Team $team,
        ApplicationArea $applicationArea,
    ): StockMovementContext {

        $this->validateEmployeeTeam(
            $employee,
            $team,
        );

        $this->validateProjectTeam(
            $project,
            $team,
        );

        $this->validateProjectApplicationArea(
            $project,
            $applicationArea,
        );

        return $this->buildContext(
            employee: $employee,
            team: $team,
            applicationArea: $applicationArea,
        );
    }

    public function buildAssignmentContext(
        Project $project,
        Employee $employee,
        Team $team,
        ?int $destinationUserId = null,
    ): StockMovementContext {

        $this->validateEmployeeTeam(
            $employee,
            $team,
        );

        $this->validateProjectTeam(
            $project,
            $team,
        );

        return $this->buildContext(
            employee: $employee,
            team: $team,
            destinationUserId: $destinationUserId,
        );
    }

    public function buildReturnContext(
        Project $project,
        Employee $employee,
        Team $team,
        ?int $destinationUserId = null,
    ): StockMovementContext {

    
        $this->validateEmployeeTeam(
            $employee,
            $team,
        );

        $this->validateProjectTeam(
            $project,
            $team,
        );

        return $this->buildContext(
            employee: $employee,
            team: $team,
            destinationUserId: $destinationUserId,
        );
    }

    private function buildContext(
        Employee $employee,
        Team $team,
        ?ApplicationArea $applicationArea = null,
        ?int $destinationUserId = null,
    ): StockMovementContext {
        $team->loadMissing(
            'leaders'
        );

        $leader =
            $team->leaders
            ->first();
        return new StockMovementContext(
            employeeId: $employee->id,
            teamId: $team->id,
            leaderEmployeeId: $leader?->id,
            applicationAreaId: $applicationArea?->id,
            destinationUserId: $destinationUserId,
            meta: [
                'employee_name' =>
                $employee->name,
                'team_name' =>
                $team->name,

                'leader_name' =>
                $leader?->name,

                'application_area_name' =>
                $applicationArea?->name,
            ],
        );
    }

    private function validateEmployeeTeam(
        Employee $employee,
        Team $team,
    ): void {

    
        $belongsToTeam =
            $employee
            ->teams()
            ->whereKey(
                $team->id,
            )
            ->exists();

        if (!$belongsToTeam) {
            throw new DomainException(
                'O colaborador não pertence à equipe selecionada.'
            );
        }
    }

    private function validateProjectTeam(
        Project $project,
        Team $team,
    ): void {

        $belongsToProject =
            $project
            ->teams()
            ->whereKey(
                $team->id,
            )
            ->exists();

        if (!$belongsToProject) {
            throw new DomainException(
                'A equipe não pertence ao projeto selecionado.'
            );
        }
    }

    private function validateProjectApplicationArea(
        Project $project,
        ApplicationArea $applicationArea,
    ): void {

        $belongsToProject =
            $project
            ->applicationAreas()
            ->whereKey(
                $applicationArea->id,
            )
            ->exists();

        if (!$belongsToProject) {
            throw new DomainException(
                'A área de aplicação não pertence ao projeto selecionado.'
            );
        }
    }
}
