<?php

namespace App\Models;

use App\Models\Scopes\ProjectScope;
use App\Observers\ProjectObserver;
use Database\Factories\ProjectFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Attributes\ScopedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'slug', 'description', 'initials', 'uuid'])]
#[ObservedBy([ProjectObserver::class])]
#[ScopedBy([ProjectScope::class])]
class Project extends Model
{
    /** @use HasFactory<ProjectFactory> */
    use HasFactory;

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }

    public function sectors(): HasMany
    {
        return $this->hasMany(Sector::class);
    }

    public function products()
    {
        return $this->hasManyThrough(Stock::class, Product::class, 'id', 'product_id', 'id', 'id');
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    public function stocks(): HasMany
    {
        return $this->hasMany(Stock::class);
    }

    public function getStockList(): HasMany
    {
        return $this->hasMany(Stock::class)
            ->selectRaw('product_id,sector_id,invoice_id, invoice_item_id, project_id, SUM(stock_quantity) as total_quantity')
            ->groupBy('product_id', 'id');
    }

    public function getStockSummary(): object
    {
        return $this->stocks()
            ->join('invoice_items', 'invoice_items.id', '=', 'stocks.invoice_item_id')
            ->selectRaw('
                SUM(stock_quantity) as total_quantity,
                COUNT(DISTINCT stocks.product_id) as total_products,
                SUM(stock_quantity * invoice_items.unit_price) as total_value
            ')
            ->where('active', true)
            ->first();
    }

    public function teams(): BelongsToMany
    {
        return $this->belongsToMany(
            Team::class,
            'project_team',
            'project_id',
            'team_id',
        )
            ->withTimestamps();
    }

    public function applicationAreas(): BelongsToMany
    {
        return $this->belongsToMany(
            ApplicationArea::class,
            'project_application_area',
            'project_id',
            'application_area_id',
        )
            ->withTimestamps();
    }
}
