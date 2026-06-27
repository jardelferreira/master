<?php

namespace App\Enum;

enum InventoryStatusEnum: string
{
    case OPEN = 'open';
    case IN_PROGRESS = 'in_progress';
    case FINISHED = 'finished';
    case APPROVED = 'approved';
    case CANCELLED = 'cancelled';

    /*
    |--------------------------------------------------------------------------
    | Regras de domínio
    |--------------------------------------------------------------------------
    */

    public function canAssignUsers(): bool
    {
        return $this === self::OPEN;
    }

    public function canManageItems(): bool
    {
        return $this === self::OPEN;
    }

    public function canManageUsers(): bool
    {
        return $this === self::OPEN;
    }

    public function canDelete(): bool
    {
        return $this === self::OPEN;
    }

    public function canCount(): bool
    {
        return in_array($this, [
            self::OPEN,
            self::IN_PROGRESS,
        ]);
    }

    public function canFinish(): bool
    {
        return in_array($this, [
            self::OPEN,
            self::IN_PROGRESS,
        ], true);
    }

    public function canCancel(): bool
    {
        return in_array($this, [
            self::OPEN,
            self::IN_PROGRESS,
        ]);
    }

    public function canApprove(): bool
    {
        return $this === self::FINISHED;
    }

    public function isFinal(): bool
    {
        return in_array($this, [
            self::APPROVED,
            self::CANCELLED,
        ]);
    }

    public function isLocked(): bool
    {
        return in_array($this, [
            self::APPROVED,
            self::CANCELLED,
        ]);
    }

    public function permissions(): array
    {
        return [
            'can_count' => $this->canCount(),
            'can_finish' => $this->canFinish(),
            'can_cancel' => $this->canCancel(),
            'can_approve' => $this->canApprove(),
            'can_manage_items' => $this->canManageItems(),
            'can_manage_users' => $this->canManageUsers(),
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | UI / Apresentação
    |--------------------------------------------------------------------------
    */

    public function label(): string
    {
        return match ($this) {
            self::OPEN => 'Aberto',
            self::IN_PROGRESS => 'Em Andamento',
            self::FINISHED => 'Finalizado',
            self::APPROVED => 'Aprovado',
            self::CANCELLED => 'Cancelado',
        };
    }

    public function badgeClass(): string
    {
        return match ($this) {
            self::OPEN => 'bg-blue-100 text-blue-600',
            self::IN_PROGRESS => 'bg-amber-100 text-amber-600',
            self::FINISHED => 'bg-blue-100 text-blue-600',
            self::APPROVED => 'bg-emerald-100 text-emerald-600',
            self::CANCELLED => 'bg-red-100 text-red-600',
        };
    }
}
