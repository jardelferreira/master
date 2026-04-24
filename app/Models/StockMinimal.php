<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class StockMinimal extends Model
{
    /** @use HasFactory<\Database\Factories\StockMinimalFactory> */
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

    protected static function booted()
    {
        static::creating(function ($model) {
            if (!$model->uuid) {
                $model->uuid = (string) Str::uuid();
            }
        });
    }

    /*
    |--------------------------------------------------------------------------
    | RELAÇÕES
    |--------------------------------------------------------------------------
    */

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function sector()
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
        return !$this->project_id && !$this->sector_id;
    }
}
