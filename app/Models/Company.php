<?php

namespace App\Models;

use App\Enum\CompanyTypeEnum;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['name','trade_name','document','email','phone','type','active'])]
class Company extends Model
{
    /** @use HasFactory<\Database\Factories\CompanyFactory> */
    use HasFactory,SoftDeletes;

    protected $casts = [
        'active' => 'boolean',
        'type' => CompanyTypeEnum::class
    ];

    public function employees(): HasMany
    {
        return $this->hasMany(Employee::class);
    }
}
