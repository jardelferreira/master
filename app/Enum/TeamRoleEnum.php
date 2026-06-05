<?php

namespace App\Enum;

enum TeamRoleEnum: string
{
    case LEADER = 'leader';
    case MEMBER = 'member';

    public function label(): string
    {
        return match ($this) {
            self::LEADER => 'Líder',
            self::MEMBER => 'Membro',
        };
    }

    public static function options(): array
    {
        return collect(self::cases())
            ->map(fn ($role) => [
                'value' => $role->value,
                'label' => $role->label(),
            ])
            ->values()
            ->toArray();
    }
}