<?php

namespace App\Services;

use App\DTO\StockMovementContext;
use App\Models\ApplicationArea;
use App\Models\Employee;

class StockMovementContextResolver
{
    public function resolve(
        ?Employee $employee = null,
        ?ApplicationArea $applicationArea = null,
    ): StockMovementContext {

        if (!$employee) {
            return new StockMovementContext(
                applicationAreaId: $applicationArea?->id,
            );
        }

        $team = $employee
            ->teams()
            ->with('leaders')
            ->first();

        $leader = $team
            ?->leaders()
            ->first();

        return new StockMovementContext(
            employeeId: $employee->id,

            teamId: $team?->id,

            leaderEmployeeId:
                $leader?->id,

            applicationAreaId:
                $applicationArea?->id,

            meta: [
                'employee_name' =>
                    $employee->name,

                'team_name' =>
                    $team?->name,

                'leader_name' =>
                    $leader?->name,

                'application_area_name' =>
                    $applicationArea?->name,
            ],
        );
    }
}