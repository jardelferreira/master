<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

#[Fillable(['uuid', 'name', 'trade_name', 'document', 'email', 'phone', 'website', 'contact_name', 'city', 'state', 'active', 'meta'])]
class Provider extends Model
{
    /** @use HasFactory<\Database\Factories\ProviderFactory> */
    use HasFactory, SoftDeletes;

    protected $casts = [
        'active' => 'boolean',
        'meta' => 'array',
    ];

    protected static function booted()
    {
        static::creating(function ($provider) {
            $provider->uuid = $provider->uuid ?? Str::uuid();
        });
    }

    //  relações futuras
    public function invoiceItems()
    {
        return $this->hasMany(InvoiceItem::class);
    }

    public function scopeActive($query)
    {
        return $query->where('active', true);
    }

    public function getDisplayNameAttribute()
    {
        return $this->trade_name ?: $this->name;
    }

    public function isActive(): bool
    {
        return $this->active === true;
    }
}
