<?php

namespace App\Observers;

use App\Models\Project;
use Illuminate\Support\Str;

class ProjectObserver
{
    public function creating(Project $project):void
    {
        $project->slug = Str::slug($project->name);
        $project->uuid = Str::uuid();
    }
}
