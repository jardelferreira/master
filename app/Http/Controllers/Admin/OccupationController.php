<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOccupationRequest;
use App\Http\Requests\UpdateOccupationRequest;
use App\Models\Occupation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OccupationController extends Controller
{
    public function index(Request $request): Response
    {

        return Inertia::render(
            'occupations/index',
            [
                'occupations' => Occupation::query()
                    ->latest()
                    ->get(),
            ]
        );
    }

    public function store(
        StoreOccupationRequest $request
    ): RedirectResponse {
        Occupation::create(
            $request->validated()
        );

        return back()->with(
            'success',
            'Ocupação criada com sucesso.'
        );
    }

    public function update(
        UpdateOccupationRequest $request,
        Occupation $occupation
    ): RedirectResponse {
        $occupation->update(
            $request->validated()
        );

        return back()->with(
            'success',
            'Ocupação atualizada com sucesso.'
        );
    }

    public function destroy(
        Occupation $occupation
    ): RedirectResponse {
        $occupation->delete();

        return back()->with(
            'success',
            'Ocupação removida com sucesso.'
        );
    }

    public function toggleStatus(
        Occupation $occupation
    ): RedirectResponse {
        $occupation->update([
            'active' => ! $occupation->active,
        ]);

        return back();
    }
}
