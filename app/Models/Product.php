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

    protected ?array $minStockIndex = null;

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

    protected function getGlobalMinStock2(): ?float
    {
        $value = $this->stockMinimals()
            ->whereNull('project_id')
            ->whereNull('sector_id')
            ->value('min_quantity');

        return $value !== null ? (float) $value : null;
    }

    protected function getProjectMinStock(int $projectId): ?float
    {
        $value = $this->stockMinimals()
            ->where('project_id', $projectId)
            ->whereNull('sector_id')
            ->value('min_quantity');

        return $value !== null ? (float) $value : null;
    }

    protected function getSectorMinStock(int $sectorId): ?float
    {
        $value = $this->stockMinimals()
            ->where('sector_id', $sectorId)
            ->value('min_quantity');

        return $value !== null ? (float) $value : null;
    }

    public function resolveMinStock(
        ?int $projectId = null,
        ?int $sectorId = null
    ): ?float {
        $query = $this->stockMinimals();

        $query->where(function ($q) use ($projectId, $sectorId) {

            if ($sectorId) {
                $q->orWhere('sector_id', $sectorId);
            }

            if ($projectId) {
                $q->orWhere(function ($q) use ($projectId) {
                    $q->where('project_id', $projectId)
                        ->whereNull('sector_id');
                });
            }

            $q->orWhere(function ($q) {
                $q->whereNull('project_id')
                    ->whereNull('sector_id');
            });
        });

        $result = $query
            ->selectRaw("
            min_quantity,
            CASE
                WHEN sector_id IS NOT NULL THEN 1
                WHEN project_id IS NOT NULL THEN 2
                ELSE 3
            END as priority
        ")
            ->orderBy('priority')
            ->first();

        return $result?->min_quantity !== null
            ? (float) $result->min_quantity
            : null;
    }

    public function resolveLoadedMinStock(
        ?int $projectId = null,
        ?int $sectorId = null
    ): ?float {

        $index = $this->getMinStockIndex();

        if (
            $sectorId &&
            isset($index["sector:$sectorId"])
        ) {
            return (float) $index["sector:$sectorId"];
        }

        if (
            $projectId &&
            isset($index["project:$projectId"])
        ) {
            return (float) $index["project:$projectId"];
        }

        return isset($index['global'])
            ? (float) $index['global']
            : null;
    }

    public function getMinStockIndex(): array
    {
        if ($this->minStockIndex !== null) {
            return $this->minStockIndex;
        }

        return $this->minStockIndex =
            $this->stockMinimals
            ->mapWithKeys(function ($item) {

                $key = match (true) {
                    $item->sector_id !== null =>
                    "sector:{$item->sector_id}",

                    $item->project_id !== null =>
                    "project:{$item->project_id}",

                    default =>
                    "global",
                };

                return [$key => $item->min_quantity];
            })
            ->all();
    }
}
