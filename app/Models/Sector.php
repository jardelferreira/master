<?php

namespace App\Models;

use App\Observers\SectorObserver;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['uuid','name','description','project_id','slug'])]
#[ObservedBy(SectorObserver::class)]
class Sector extends Model
{
    /** @use HasFactory<\Database\Factories\SectorFactory> */
    use HasFactory;

    public function project():BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

}
