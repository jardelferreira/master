<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\StoreSectorRequest;
use App\Http\Requests\UpdateSectorRequest;
use App\Http\Controllers\Controller;
use App\Models\Sector;
use Inertia\Inertia;

class SectorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSectorRequest $request)
    {
        try {
            $sector = Sector::create($request->all());
            return session()->with('feedback',[
                'success' => true,
                'status' => 'success',
                'message' => 'Setor criado com sucesso!',
                'type' => 'toast',
                'id' => uniqid(),
            ]);
        } catch (\Throwable $th) {
            return session()->with('feedback',[
                'success' => false,
                'status' => 'error',
                'message' => "Erro: {$th->getMessage()}",
                'type' => 'toast',
                'id' => uniqid(),
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Sector $sector)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Sector $sector)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSectorRequest $request, Sector $sector)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Sector $sector)
    {
        //
    }
}
