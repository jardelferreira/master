<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProviderRequest;
use App\Http\Requests\UpdateProviderRequest;
use App\Http\Resources\ProviderShowResource;
use App\Models\Provider;
use Inertia\Inertia;

class ProviderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('dashboard/providers/Index', [
            'providers' => Provider::all()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('dashboard/providers/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProviderRequest $request)
    {
        Provider::create($request->all());

        return back()->with('feedback', [
            'status' => 'success',
            'message' => 'Fornecedor cadastrado com sucesso',
            'type' => 'toast',
            'id' => uniqid(),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Provider $provider)
    {
        return Inertia::render(
            'dashboard/providers/Show',
            (new ProviderShowResource($provider))->toArray(request())
        );
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Provider $provider)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProviderRequest $request, Provider $provider)
    {
        $provider->update($request->all());
        return back()->with('feedback', [
            'status' => 'success',
            'message' => 'Fornecedor Atualizado com sucesso.',
            'type' => 'toast',
            'id' => uniqid(),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Provider $provider)
    {
        $provider->delete();
        return back()->with('feedback', [
            'status' => 'success',
            'message' => 'Fornecedor deleteado',
            'type' => 'toast',
            'id' => uniqid(),
        ]);
    }

    public function toggleStatus(Provider $provider)
    {
        $provider->update(['active' => !$provider->active,]);
        return back()->with('feedback', [
            'status' => 'success',
            'message' => 'Atualização bem sucedida!',
            'type' => 'toast',
            'id' => uniqid(),
        ]);
    }
}
