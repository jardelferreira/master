<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Models\Project;
use App\Models\Sector;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
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
        Project::create($request->all());
        return back()->with('feedback', [
            'status' => 'success',
            'message' => 'Projeto criado com sucesso',
            'type' => 'toast',
            'id' => uniqid(),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        
        return Inertia::render('dashboard/projects/Show', [
            'project' => $project->load(['sectors', 'users']),
            'users' => User::select('id', 'name')->get(),
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
    public function update(Request $request, Project $project)
    {
        $data = $request->validate([
            'name' => [
                'required',
                'string',
                Rule::unique('projects', 'name')->ignore($project),
            ],
            'description' => ['nullable', 'string'],
        ]);

        $project->update($data);

        return back()->with('feedback', [
            'status' => 'success',
            'message' => 'Projeto atualizado com sucesso',
            'type' => 'toast',
            'id' => \Illuminate\Support\Str::uuid(),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        $project->delete();

        return redirect()->route('dashboard')->with('feedback', [
            'status' => 'success',
            'message' => 'Projeto excluído com sucesso',
            'type' => 'toast',
            'id' => \Illuminate\Support\Str::uuid(),
        ]);
    }

    public function syncUsers(Request $request, Project $project)
    {
        $data = $request->validate([
            'users' => ['array'],
            'users.*' => ['exists:users,id'],
        ]);

        $project->users()->sync($data['users'] ?? []);

        return back()->with('feedback', [
            'status' => 'success',
            'message' => 'Usuários do projeto atualizados',
            'type' => 'toast',
            'id' => uniqid(),
        ]);
    }

    public function createSector(Project $project, Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $project->sectors()->create($data);

        return back()->with('feedback', [
            'status' => 'success',
            'message' => 'Setor criado com sucesso',
            'type' => 'toast',
            'id' => uniqid(),
        ]);
    }
}
