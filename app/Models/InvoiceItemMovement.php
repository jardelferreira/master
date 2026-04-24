<?php

namespace App\Models;

use App\Enum\InvoiceItemMovementReasonEnum;
use App\Enum\InvoiceItemMovementEnum;
use App\Models\InvoiceItem;
use App\Models\Stock;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Str;

class InvoiceItemMovement extends Model
{
    use HasFactory;

    protected $table = 'invoice_item_movements';

    protected $fillable = [
        'uuid',
        'invoice_item_id',
        'user_id',
        'quantity',
        'type',
        'reason',
        'performed_at',
        'stock_id',
        'notes',
        'requires_inspection',
        'is_approved',
    ];

    protected $casts = [
        'quantity' => 'decimal:3',
        'performed_at' => 'datetime',
        'requires_inspection' => 'boolean',
        'is_approved' => 'boolean',
        'reason' => InvoiceItemMovementReasonEnum::class,
        'type' => InvoiceItemMovementEnum::class
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

    public function invoiceItem()
    {
        return $this->belongsTo(InvoiceItem::class);
    }

    public function stock()
    {
        return $this->belongsTo(Stock::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /*
    |--------------------------------------------------------------------------
    | Scopes
    |--------------------------------------------------------------------------
    */

    /**
     * @param Builder<self> $query
     */
    public function scopeApproved($query)
    {
        return $query->where('is_approved', true);
    }
    /**
     * @param Builder<self> $query
     */
    public function scopePending($query)
    {
        return $query->whereNull('is_approved');
    }
    /**
     * @param Builder<self> $query
     * @param InvoiceItemMovementEnum $type
     */
    public function scopeType($query, InvoiceItemMovementEnum $type)
    {
        return $query->where('type', $type);
    }

    /*
    |--------------------------------------------------------------------------
    | Helpers
    |--------------------------------------------------------------------------
    */

    public function isApproved(): bool
    {
        return $this->is_approved === true;
    }

    public function isRejected(): bool
    {
        return $this->is_approved === false;
    }

    public function requiresInspection(): bool
    {
        return $this->requires_inspection === true;
    }

    public function approve()
    {
        $this->update([
            'is_approved' => true,
            'type' => InvoiceItemMovementEnum::APPROVED->value
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Domínio (logística)
    |--------------------------------------------------------------------------
    */

    public function canEnterStock(): bool
    {
        return $this->type === InvoiceItemMovementEnum::APPROVED->value && $this->isApproved();
    }
}
