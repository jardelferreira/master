<?php

namespace App\Models;

use App\Enum\ProductUnitEnum;
use Database\Factories\ProductFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Product extends Model
{
    /** @use HasFactory<ProductFactory> */
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
        'unit' => ProductUnitEnum::class,
    ];

    protected static function booted(): void
    {
        static::creating(function (Product $product) {
            $product->uuid = $product->uuid ?? Str::uuid();
            $product->slug = $product->slug ?? Str::slug($product->name . '-' . uniqid());
        });
    }

    // 🔗 RELAÇÕES

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function invoiceItems(): HasMany
    {
        return $this->hasMany(InvoiceItem::class);
    }

    public function stocks(): HasMany
    {
        return $this->hasMany(Stock::class);
    }

    public function stockMovements(): HasMany
    {
        return $this->hasMany(StockMovement::class);
    }

    public function stockMinimals(): HasMany
    {
        return $this->hasMany(StockMinimal::class);
    }

    //  SCOPES

    /**
     * @param  Builder<self>  $query
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('active', true);
    }

    /**
     * @param  Builder<self>  $query
     */
    public function scopeSearch(Builder $query, string $term): Builder
    {
        return $query->where('name', 'ilike', "%{$term}%")
            ->orWhere('sku', 'ilike', "%{$term}%");
    }

    // 🚀 HELPERS

    public function isActive(): bool
    {
        return $this->active === true;
    }

    public function getDisplayNameAttribute(): string
    {
        return $this->name;
    }

    public function getStockQuantityAttribute(): float
    {
        if (array_key_exists('stocks_sum_stock_quantity', $this->attributes)) {
            return (float) $this->attributes['stocks_sum_stock_quantity'];
        }

        return (float) $this->stocks()->sum('stock_quantity');
    }

    public function getSkuFormattedAttribute(): string
    {
        return strtoupper($this->sku);
    }

    // 📦 ESTOQUE MÍNIMO

    /**
     * Retorna o estoque mínimo global (sem projeto/setor).
     */
    public function getGlobalMinStock(): ?float
    {
        return (float) $this->stockMinimals()
            ->whereNull('project_id')
            ->whereNull('sector_id')
            ->value('min_quantity');
    }

    /**
     * Retorna o estoque mínimo para um projeto específico.
     */
    public function getMinStockForProject(int $projectId): ?float
    {
        // Primeiro busca específico do projeto
        $minStock = $this->stockMinimals()
            ->where('project_id', $projectId)
            ->whereNull('sector_id')
            ->value('min_quantity');

        // Se não encontrar, busca global
        if ($minStock === null) {
            $minStock = $this->getGlobalMinStock();
        }

        return $minStock !== null ? (float) $minStock : null;
    }

    /**
     * Retorna o estoque mínimo para um setor específico.
     * Segue ordem: setor > projeto > global
     */
    public function getMinStockForSector(int $sectorId): ?float
    {
        $sector = Sector::find($sectorId);

        if (! $sector) {
            return null;
        }

        // 1. Busca específico do setor
        $minStock = $this->stockMinimals()
            ->where('sector_id', $sectorId)
            ->value('min_quantity');

        // 2. Se não encontrar, busca do projeto
        if ($minStock === null && $sector->project_id) {
            $minStock = $this->getMinStockForProject($sector->project_id);
        }

        return $minStock !== null ? (float) $minStock : null;
    }
}
