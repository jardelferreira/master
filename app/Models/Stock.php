<?php

namespace App\Models;

use Exception;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Str;

class Stock extends Model
{
    /** @use HasFactory<\Database\Factories\StockFactory> */
    use HasFactory;

    protected $fillable = [
        'uuid',
        'product_id',
        'project_id',
        'sector_id',
        'invoice_id',
        'invoice_item_id',
        'parent_id',
        'expires_at',
        'stock_location',
        'stock_quantity',
        'active',
        'is_patrimony',
        'serial',
        'stock_image_path',
        'meta',
        'performed_at',
    ];

    protected $casts = [
        'stock_quantity' => 'decimal:3',
        'active' => 'boolean',
        'is_patrimony' => 'boolean',

        'expires_at' => 'date',
        'performed_at' => 'datetime',

        'meta' => 'array',
    ];

    protected static function booted()
    {
        static::creating(function ($stock) {

            if (empty($stock->uuid)) {
                $stock->uuid = (string) Str::uuid();
            }

            if (empty($stock->performed_at)) {
                $stock->performed_at = now();
            }
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }

    public function invoiceItem()
    {
        return $this->belongsTo(InvoiceItem::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function sector()
    {
        return $this->belongsTo(Sector::class);
    }

    public function parent()
    {
        return $this->belongsTo(Stock::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Stock::class, 'parent_id');
    }

    public function movements()
    {
        return $this->hasMany(StockMovement::class);
    }

    /*
    |--------------------------------------------------------------------------
    | Scopes
    |--------------------------------------------------------------------------
    */

    /**
     *@param Builder<self> $query
     */
    public function scopeActive($query)
    {
        return $query->where('active', true);
    }
    /**
     *@param Builder<self> $query
     */
    public function scopeAvailable($query)
    {
        return $query->where('stock_quantity', '>', 0);
    }
    /**
     *@param Builder<self> $query
     */
    public function scopeByProduct($query, $productId)
    {
        return $query->where('product_id', $productId);
    }

    /*
    |--------------------------------------------------------------------------
    | Helpers
    |--------------------------------------------------------------------------
    */

    public function isAvailable(): bool
    {
        return $this->stock_quantity > 0 && $this->active;
    }

    public function isExpired(): bool
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    public function isPatrimony(): bool
    {
        return $this->is_patrimony === true;
    }

    /*
    |--------------------------------------------------------------------------
    | Domínio (estoque)
    |--------------------------------------------------------------------------
    */

    public function increase(float $quantity): void
    {
        $this->increment('stock_quantity', $quantity);
    }

    public function decrease(float $quantity): void
    {
        if ($this->stock_quantity < $quantity) {
            throw new \Exception('Estoque insuficiente.');
        }

        $this->decrement('stock_quantity', $quantity);
    }

    public function getBalanceAttribute()
    {
        return $this->stock_quantity;
    }

    // 🔥 MÉTODO CRÍTICO

    public function applyMovement(string $type, float $quantity): void
    {
        if ($type === 'in') {
            $this->quantity += $quantity;
        }

        if ($type === 'out') {
            if ($this->quantity < $quantity) {
                throw new Exception('Estoque insuficiente');
            }

            $this->quantity -= $quantity;
        }

        if ($type === 'return') {
            $this->quantity -= $quantity;
        }

        $this->save();
    }
}
