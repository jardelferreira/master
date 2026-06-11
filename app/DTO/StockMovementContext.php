<?php

namespace App\DTO;

class StockMovementContext
{
    public function __construct(
        public readonly ?int $employeeId = null,
        public readonly ?int $teamId = null,
        public readonly ?int $leaderEmployeeId = null,
        public readonly ?int $applicationAreaId = null,
        public readonly ?int $destinationUserId = null,
        public readonly array $meta = [],
    ) {}

    public function toArray(): array
    {
        return [
            'employee_id' => $this->employeeId,
            'team_id' => $this->teamId,
            'leader_employee_id' => $this->leaderEmployeeId,
            'application_area_id' => $this->applicationAreaId,
            'destination_user_id' => $this->destinationUserId,
        ];
    }
}
