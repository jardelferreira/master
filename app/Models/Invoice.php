<?php

namespace App\Models;

use App\Enum\InvoiceMovementEnum;
use App\Enum\InvoiceStatusEnum;
use App\Enum\InvoiceTypeEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Str;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'slug',
        'project_id',
        'sector_id',
        'provider_id',
        'user_id',

        'xml_path',
        'pdf_path',

        'number',
        'series',
        'access_key',
        'type',
        'status',

        'total',
        'taxes',
        'discount',

        'issued_at',
        'due_at',
        'paid_at',
        'cancelled_at',

        'meta',
    ];

    protected $casts = [
        'total' => 'decimal:2',
        'taxes' => 'decimal:2',
        'discount' => 'decimal:2',

        'issued_at' => 'datetime',
        'due_at' => 'datetime',
        'paid_at' => 'datetime',
        'cancelled_at' => 'datetime',

        'meta' => 'array',

        'type' => InvoiceTypeEnum::class,
        'status' => InvoiceStatusEnum::class,
    ];


    protected static function booted()
    {
        static::creating(function ($invoice) {

            if (empty($invoice->uuid)) {
                $invoice->uuid = (string) Str::uuid();
            }

            if (empty($invoice->slug)) {
                $invoice->slug = Str::upper(Str::slug("{$invoice->type}-{$invoice->number}-{$invoice->provider->trade_name}"));
            }
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function items()
    {
        return $this->hasMany(InvoiceItem::class);
    }

    public function provider()
    {
        return $this->belongsTo(Provider::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function sector()
    {
        return $this->belongsTo(Sector::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function movements()
    {
        return $this->hasMany(InvoiceMovement::class);
    }

    /*
    |--------------------------------------------------------------------------
    | Scopes
    |--------------------------------------------------------------------------
    */

    /**
     * @param Builder<self> $query
     */
    public function scopeApproved(Builder $query)
    {
        return $query->where('status', InvoiceStatusEnum::APPROVED->value);
    }

    public function scopePaid(Builder $query)
    {
        return $query->where('status', InvoiceStatusEnum::PAY->value);
    }

    public function scopeCancelled(Builder $query)
    {
        return $query->where('status', InvoiceStatusEnum::CANCELLED->value);
    }

    public function scopeReturned(Builder $query)
    {
        return $query->where('status', InvoiceStatusEnum::RETURNED->value);
    }


    // public function isApproved(): bool
    // {
    //     return $this->movements()
    //         ->where('type', InvoiceMovementEnum::APPROVED->value)
    //         ->exists();
    // }

    /*
    |--------------------------------------------------------------------------
    | Helpers
    |--------------------------------------------------------------------------
    */

    public function isApproved(): bool
    {
        return $this->status === InvoiceStatusEnum::APPROVED->value;
    }

    public function isPaid(): bool
    {
        return !is_null($this->paid_at) || $this->status === InvoiceStatusEnum::PAY->value;
    }

    public function isCancelled(): bool
    {
        return !is_null($this->cancelled_at) || $this->status === InvoiceStatusEnum::CANCELLED->value;
    }

    public function isReturned(): bool
    {
        return $this->status === InvoiceStatusEnum::RETURNED->value;
    }

    /*
    |--------------------------------------------------------------------------
    | Financeiro
    |--------------------------------------------------------------------------
    */

    public function getNetTotalAttribute()
    {
        return $this->total - $this->discount + $this->taxes;
    }

    /*
    |--------------------------------------------------------------------------
    | Domínio (estoque)
    |--------------------------------------------------------------------------
    */

    public function canEnterStock(): bool
    {
        return $this->isApproved();
    }
}
