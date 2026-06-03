<?php

namespace App\Models;

use Database\Factories\StockMinimalFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class StockMinimal extends Model
{
    /** @use HasFactory<StockMinimalFactory> */
    use HasFactory;

    protected $fillable = [
        'uuid',
        'product_id',
        'project_id',
        'sector_id',
        'min_quantity',
        'meta',
    ];

    protected $casts = [
        'meta' => 'array',
    ];

    protected static function booted(): void
    {
        static::creating(function (Model $model) {
            if (! $model->uuid) {
                $model->uuid = (string) Str::uuid();
            }
        });
    }

    /*
    |--------------------------------------------------------------------------
    | RELAÇÕES
    |--------------------------------------------------------------------------
    */

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function sector(): BelongsTo
    {
        return $this->belongsTo(Sector::class);
    }

    /*
    |--------------------------------------------------------------------------
    | HELPERS
    |--------------------------------------------------------------------------
    */

    public function isGlobal(): bool
    {
        return is_null($this->project_id) && is_null($this->sector_id);
    }

    public function isForProject(): bool
    {
        return ! is_null($this->project_id) && is_null($this->sector_id);
    }

    public function isForSector(): bool
    {
        return ! is_null($this->sector_id);
    }
}
