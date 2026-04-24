<?php

namespace App\Models;

use App\Enum\ProductUnitEnum;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Product extends Model
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'uuid',
        'name',
        'slug',
        'description',
        'category_id',
        'unit',
        'sku',
        'active',
        'meta',
    ];

    protected $casts = [
        'active' => 'boolean',
        'meta' => 'array',
        'unit' => ProductUnitEnum::class
    ];

    protected static function booted()
    {
        static::creating(function ($product) {
            $product->uuid = $product->uuid ?? Str::uuid();
            $product->slug = $product->slug ?? Str::slug($product->name."-".uniqid());
        });
    }

    // 🔗 RELAÇÕES

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function invoiceItems()
    {
        return $this->hasMany(InvoiceItem::class);
    }

    public function stocks()
    {
        return $this->hasMany(Stock::class);
    }

    public function stockMovements()
    {
        return $this->hasMany(StockMovement::class);
    }

    //  SCOPES (IMPORTANTE)
    /**
     * @param Builder<self> $query
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('active', true);
    }

    /**
     * @param Builder<self> $query
     * @param string $term
     */
    public function scopeSearch(Builder $query, string $term)
    {
        return $query->whereRaw('LOWER(name) LIKE ?', ['%' . strtolower($term) . '%']);
        return $query->where('name', 'ilike', "%{$term}%")
        ->orWhere('sku', 'ilike', "%{$term}%");
    }

     public function isActive(): bool
    {
        return $this->active === true;
    }

    public function getDisplayNameAttribute()
    {
        return $this->name;
    }

    public function getStockQuantityAttribute()
    {
        return $this->stocks()->sum('quantity');
    }

    public function getSkuFormattedAttribute()
{
    return strtoupper($this->sku);
}
}
