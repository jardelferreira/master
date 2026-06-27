<?php

namespace App\Models;

use App\Enum\InventoryStatusEnum;
use App\Models\InventoryItem;
use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    protected $fillable = [
        'name',

        'project_id',

        'status',

        'started_at',
        'due_date',
        'finished_at',
        'approved_at',

        'created_by',
        'approved_by',

        'blind_count',

        'notes',
    ];

    protected $casts = [
        'status' => InventoryStatusEnum::class,

        'started_at' => 'datetime',
        'due_date' => 'datetime',
        'finished_at' => 'datetime',
        'approved_at' => 'datetime',
        'blind_count' => 'boolean',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function creator()
    {
        return $this->belongsTo(
            User::class,
            'created_by'
        );
    }

    public function approver()
    {
        return $this->belongsTo(
            User::class,
            'approved_by'
        );
    }

    public function users()
    {
        return $this->belongsToMany(
            User::class,
            'inventory_users'
        )
            ->withPivot('assigned_at')
            ->withTimestamps();
    }

    public function items()
    {
        return $this->hasMany(
            InventoryItem::class
        );
    }

    public function scopeAssignedToUser(
        $query,
        int $userId
    ) {
        return $query->whereHas(
            'users',
            fn($q) => $q->where(
                'users.id',
                $userId
            )
        );
    }

    public function isOpen(): bool
    {
        return $this->status === InventoryStatusEnum::OPEN;
    }

    public function isFinished(): bool
    {
        return $this->status === InventoryStatusEnum::FINISHED;
    }

    public function isApproved(): bool
    {
        return $this->status === InventoryStatusEnum::APPROVED;
    }
}