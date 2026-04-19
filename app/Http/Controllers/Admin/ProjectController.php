<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Models\Project;
use Inertia\Inertia;

class ProjectController extends Controller
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
    public function store(StoreProjectRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $id)
    {
        return Inertia::render('dashboard/projects/Show', [
            'project' => $id,

            'metrics' => [
                'total_products' => 128,
                'total_stock' => 3480,
                'total_cost' => 29358.48,
                'low_stock' => 7,
            ],

            'stock_summary' => [
                [
                    'id' => 1,
                    'product' => ['name' => 'Cabo 35mm'],
                    'quantity' => 120,
                    'status' => 'ok',
                ],
                [
                    'id' => 2,
                    'product' => ['name' => 'Disjuntor 150A'],
                    'quantity' => 8,
                    'status' => 'low',
                ],
                [
                    'id' => 3,
                    'product' => ['name' => 'Conector Terminal'],
                    'quantity' => 45,
                    'status' => 'ok',
                ],
                [
                    'id' => 4,
                    'product' => ['name' => 'Eletroduto PVC'],
                    'quantity' => 12,
                    'status' => 'warning',
                ],
                [
                    'id' => 5,
                    'product' => ['name' => 'Quadro de Distribuição'],
                    'quantity' => 3,
                    'status' => 'critical',
                ],
            ],

            'recent_activity' => [
                [
                    'id' => 1,
                    'description' => 'Entrada de 50 unidades de Cabo 35mm',
                    'date' => now()->subMinutes(15)->toDateTimeString(),
                ],
                [
                    'id' => 2,
                    'description' => 'Saída de 10 Disjuntores 150A',
                    'date' => now()->subHour()->toDateTimeString(),
                ],
                [
                    'id' => 3,
                    'description' => 'Cadastro de novo produto',
                    'date' => now()->subHours(3)->toDateTimeString(),
                ],
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProjectRequest $request, Project $project)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        //
    }
}
