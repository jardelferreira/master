<?php

namespace App\Models;

use App\Enum\InvoiceItemDeliveryStatusEnum;
use App\Enum\InvoiceMovementEnum;
use App\Enum\ProductUnitEnum;
use App\Models\InvoiceItemMovement;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;


class InvoiceItem extends Model
{
    use HasFactory;
    /*
$invoice->items()->create([
    'product_id' => $product->id,
    'provider_id' => $provider?->id,

    'product_name' => $product->name,
    'provider_name' => $provider?->name,

    'quantity' => $data['quantity'],
    'unit_price' => $data['unit_price'],
    'unit' => $product->unit,

    'discount' => $data['discount'] ?? 0,
    'tax' => $data['tax'] ?? 0,
]);
*/
    protected $table = 'invoice_items';

    protected $fillable = [
        'uuid',
        'invoice_id',
        'product_id',
        'provider_id',
        'user_id',
        'product_name',
        'provider_name',
        'description',
        'ca_number',
        'quantity',
        'unit_price',
        'total',
        'unit',
        'discount',
        'tax',
        'delivery_status',
        'meta',
        'img_path',
    ];

    protected $casts = [
        'quantity' => 'decimal:3',
        'unit_price' => 'decimal:2',
        'total' => 'decimal:2',
        'discount' => 'decimal:2',
        'tax' => 'decimal:2',
        'meta' => 'array',

        'delivery_status' => InvoiceItemDeliveryStatusEnum::class,
        'unit' => ProductUnitEnum::class
    ];

    protected static function booted()
    {
        static::creating(function ($item) {

            if (empty($item->uuid)) {
                $item->uuid = (string) Str::uuid();
            }

            // cálculo automático do total
            if (empty($item->total)) {
                $item->total = ($item->quantity * $item->unit_price)
                    - $item->discount
                    + $item->tax;
            }

            // snapshot automático (se vier product)
            if ($item->product && empty($item->product_name)) {
                $item->product_name = $item->product->name;
            }

            if ($item->provider && empty($item->provider_name)) {
                $item->provider_name = $item->provider->name;
            }
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function provider()
    {
        return $this->belongsTo(Provider::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function movements()
    {
        return $this->hasMany(InvoiceItemMovement::class);
    }

    public function stock()
    {
        return $this->hasOne(Stock::class);
    }

    /*
    |--------------------------------------------------------------------------
    | Helpers
    |--------------------------------------------------------------------------
    */

    public function isDelivered(): bool
    {
        return $this->delivery_status === InvoiceItemDeliveryStatusEnum::DELIVERED->value;
    }

    public function isPending(): bool
    {
        return $this->delivery_status === InvoiceItemDeliveryStatusEnum::PENDING->value;
    }

    public function isCancelled(): bool
    {
        return $this->delivery_status === InvoiceItemDeliveryStatusEnum::CANCELLED->value;
    }

    public function isPartial(): bool
    {
        return $this->delivery_status === InvoiceItemDeliveryStatusEnum::PARTIAL->value;
    }

    public function calculateTotal(): void
    {
        $this->total = ($this->quantity * $this->unit_price)
            - $this->discount
            + $this->tax;
    }

    /*
    |--------------------------------------------------------------------------
    | Domínio (estoque)
    |--------------------------------------------------------------------------
    */

    public function getApprovedQuantityAttribute()
    {
        return $this->movements()
            ->where('type', InvoiceMovementEnum::APPROVED->value)
            ->sum('quantity');
    }

    public function getReceivedQuantityAttribute()
    {
        return $this->movements()
            ->where('type', InvoiceMovementEnum::RECEIVED->value)
            ->sum('quantity');
    }

    public function getRejectedQuantityAttribute()
    {
        return $this->movements()
            ->where('type', InvoiceMovementEnum::REJECTED->value)
            ->sum('quantity');
            
    }

    public function getReturnedQuantityAttribute()
    {
        return $this->movements()
            ->where('type', InvoiceMovementEnum::RETURNED->value)
            ->sum('quantity');
            
    }

    public function getAjustedQuantityAttribute()
    {
        return $this->movements()
            ->where('type', InvoiceMovementEnum::ADJUSTED->value)
            ->sum('quantity');
            
    }

    public function getInspectedQuantityAttribute()
    {
        return $this->movements()
            ->where('type', InvoiceMovementEnum::INSPECTED->value)
            ->sum('quantity');
            
    }

    public function canEnterStock(): bool
    {
        return $this->approved_quantity > 0;
    }
}
