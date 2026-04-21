<?php

namespace App\Observers;

use App\Models\Sector;
use Illuminate\Support\Str;

class SectorObserver
{
    public function creating(Sector $sector)
    {
        $sector->uuid = Str::uuid();
        $sector->slug = Str::slug($sector->name);
    }
}
