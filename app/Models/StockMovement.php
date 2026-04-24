<?php

namespace App\Models;

use App\Models\InvoiceItem;
use App\Models\Product;
use App\Models\Project;
use App\Models\Sector;
use App\Models\Stock;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class StockMovement extends Model
{
    /** @use HasFactory<\Database\Factories\StockMovementFactory> */
    use HasFactory;

    protected $table = 'stock_movements';

    protected $fillable = [
        'uuid',

        'stock_id',
        'product_id',
        'project_id',
        'sector_id',
        'invoice_item_id',

        'user_id',
        'destination_user_id',

        'quantity',
        'type',
        'direction',

        'source_stock_id',
        'destination_stock_id',

        'balance_after',

        'performed_at',
        'notes',
        'meta',
    ];

    protected $casts = [
        'quantity' => 'decimal:3',
        'balance_after' => 'decimal:3',
        'performed_at' => 'datetime',
        'meta' => 'array',
    ];

    protected static function booted()
    {
        static::creating(function ($movement) {

            if (empty($movement->uuid)) {
                $movement->uuid = (string) Str::uuid();
            }

            if (empty($movement->performed_at)) {
                $movement->performed_at = now();
            }
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function stock()
    {
        return $this->belongsTo(Stock::class);
    }

    public function sourceStock()
    {
        return $this->belongsTo(Stock::class, 'source_stock_id');
    }

    public function destinationStock()
    {
        return $this->belongsTo(Stock::class, 'destination_stock_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function invoiceItem()
    {
        return $this->belongsTo(InvoiceItem::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function destinationUser()
    {
        return $this->belongsTo(User::class, 'destination_user_id');
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
    | Scopes
    |--------------------------------------------------------------------------
    */

    public function scopeIn($query)
    {
        return $query->where('direction', 'in');
    }

    public function scopeOut($query)
    {
        return $query->where('direction', 'out');
    }

    public function scopeByProduct($query, $productId)
    {
        return $query->where('product_id', $productId);
    }

    public function scopeRecent($query)
    {
        return $query->orderByDesc('performed_at');
    }

    /*
    |--------------------------------------------------------------------------
    | Helpers
    |--------------------------------------------------------------------------
    */

    public function isIn(): bool
    {
        return $this->direction === 'in';
    }

    public function isOut(): bool
    {
        return $this->direction === 'out';
    }

    public function isTransfer(): bool
    {
        return !is_null($this->source_stock_id) && !is_null($this->destination_stock_id);
    }

    public function isUserTransfer(): bool
    {
        return !is_null($this->destination_user_id);
    }

    /*
    |--------------------------------------------------------------------------
    | Domínio (auditoria)
    |--------------------------------------------------------------------------
    */

    public function getSummaryAttribute(): string
    {
        return match (true) {
            $this->isTransfer() => "Transferência de estoque",
            $this->isUserTransfer() => "Movimentação para usuário",
            $this->isIn() => "Entrada no estoque",
            $this->isOut() => "Saída do estoque",
            default => "Movimento desconhecido"
        };
    }
}
