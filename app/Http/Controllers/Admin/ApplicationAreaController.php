<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreApplicationAreaRequest;
use App\Http\Requests\UpdateApplicationAreaRequest;
use App\Models\ApplicationArea;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ApplicationAreaController extends Controller
{
    public function index(): Response
    {
        return Inertia::render(
            'dashboard/application-areas/Index',
            [
                'applicationAreas' => ApplicationArea::query()
                    ->with('parent')
                    ->withCount([
                        'children',
                    ])
                    ->orderBy('sort_order')
                    ->orderBy('name')
                    ->get(),

                'parentAreas' => ApplicationArea::query()
                    ->orderBy('name')
                    ->get([
                        'id',
                        'name',
                    ]),
            ]
        );
    }

    public function store(
        StoreApplicationAreaRequest $request
    ): RedirectResponse {
        ApplicationArea::create(
            $request->validated()
        );

        return back()->with(
            'success',
            'Área criada com sucesso.'
        );
    }

    public function update(
        UpdateApplicationAreaRequest $request,
        ApplicationArea $applicationArea
    ): RedirectResponse {
        $applicationArea->update(
            $request->validated()
        );

        return back()->with(
            'success',
            'Área atualizada com sucesso.'
        );
    }

    public function destroy(
        ApplicationArea $applicationArea
    ): RedirectResponse {
        if (
            $applicationArea
                ->children()
                ->exists()
        ) {
            return back()->with(
                'error',
                'Existem subáreas vinculadas.'
            );
        }

        $applicationArea->delete();

        return back()->with(
            'success',
            'Área removida.'
        );
    }
}