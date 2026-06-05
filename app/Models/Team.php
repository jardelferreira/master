<?php

namespace App\Models;

use App\Enum\TeamRoleEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Team extends Model
{
    use SoftDeletes, HasFactory;

    protected $fillable = [
        'parent_id',
        'name',
        'description',
        'active',
    ];

    protected $casts = [
        'active' => 'boolean',
    ];

    public function parent(): BelongsTo
    {
        return $this->belongsTo(
            Team::class,
            'parent_id'
        );
    }

    public function children(): HasMany
    {
        return $this->hasMany(
            Team::class,
            'parent_id'
        );
    }

    public function employees(): BelongsToMany
    {
        return $this->belongsToMany(
            Employee::class,
            'team_employees',
            'team_id',
            'employee_id'
        )
            ->using(
                TeamEmployee::class
            )
            ->withPivot([
                'role',
                'is_primary',
                'active',
            ])
            ->withTimestamps();
    }

    public function leaders(): BelongsToMany
    {
        return $this->belongsToMany(
            Employee::class,
            'team_employees',
            'team_id',
            'employee_id'
        )
            ->wherePivot(
                'role',
                TeamRoleEnum::LEADER->value
            );
    }

    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(
            Project::class,
            'project_team',
            'team_id',
            'project_id',
        )
            ->withTimestamps();
    }
}
