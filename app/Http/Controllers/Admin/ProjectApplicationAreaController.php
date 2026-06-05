<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProjectApplicationAreaRequest;
use App\Models\ApplicationArea;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ProjectApplicationAreaController extends Controller
{
    public function store(
        StoreProjectApplicationAreaRequest $request,
        Project $project,
    ): RedirectResponse {

        $project
            ->applicationAreas()
            ->syncWithoutDetaching([
                $request->application_area_id,
            ]);

        return back();
    }

    public function destroy(
        Project $project,
        ApplicationArea $applicationArea,
    ): RedirectResponse {

        $project
            ->applicationAreas()
            ->detach(
                $applicationArea->id,
            );

        return back();
    }
}
