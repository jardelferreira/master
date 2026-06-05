<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['name', 'email', 'phone', 'cpf', 'company_id', 'occupation_id', 'active'])]
class Employee extends Model
{
    /** @use HasFactory<\Database\Factories\EmployeeFactory> */
    use HasFactory, SoftDeletes;

    protected $casts = [
        'active' => 'boolean'
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function occupation(): BelongsTo
    {
        return $this->belongsTo(Occupation::class);
    }

    public function teams(): BelongsToMany
    {
        return $this->belongsToMany(
            Team::class,
            'team_employees',
            'employee_id',
            'team_id'
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

    public function clearPrimaryTeams(): void
    {
        $this->teams()
            ->update([
                'team_employee.is_primary' => false,
            ]);
    }
}
