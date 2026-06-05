<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class TeamEmployee extends Pivot
{
    protected $table = 'team_employees';
    protected $fillable = [
        'team_id',
        'employee_id',
        'role',
        'is_primary',
        'active',
    ];

    protected $casts = [
        'active' => 'boolean',
        'is_primary' => 'boolean',
    ];
}