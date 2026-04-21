<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('dashboard/permissions/Index', [
            'permissions' => Permission::with(['users', 'roles'])->get(),
            'users' => User::select('id', 'name', 'email')->get(),
            'roles' => Role::select('id', 'name')->get(),
        ]);
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
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'unique:permissions,name'],
            'description' => ['nullable', 'string'],
        ]);

        Permission::create($data);

        return back()->with('feedback', [
            'status' => 'success',
            'message' => 'Permissão criada com sucesso',
            'type' => 'toast',
            'id' => uniqid(),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */

    public function update(Request $request, Permission $permission)
    {
        $data = $request->validate([
            'name' => [
                'required',
                'string',
                Rule::unique('permissions', 'name')->ignore($permission),
            ],
            'description' => ['nullable', 'string'],
        ]);

        $permission->update($data);

        return back()->with('feedback', [
            'status' => 'success',
            'message' => 'Permissão atualizada com sucesso',
            'type' => 'toast',
            'id' => uniqid(),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Permission $permission)
    {
        if (!$permission->exists) {
            return back()->with('feedback', [
                'status' => 'error',
                'message' => 'Permissão não encontrada',
                'type' => 'toast',
                'id' => uniqid(),
            ]);
        }
        $permission->delete();
        return back()->with('feedback', [
            'status' => 'success',
            'message' => 'Permissão excluida com sucesso',
            'type' => 'toast',
            'id' => uniqid(),
        ]);
    }

    public function syncUsers(Request $request, Permission $permission)
    {
        $data = $request->validate([
            'users' => ['array'],
            'users.*' => ['exists:users,id'],
        ]);

        $permission->users()->sync($data['users'] ?? []);

        return back()->with('feedback', [
            'success' => true,
            'message' => 'Usuários atualizados com sucesso',
            'type' => 'toast',
            'id' => uniqid(),
        ]);
    }

    public function syncRoles(Request $request, Permission $permission)
    {
        $data = $request->validate([
            'roles' => ['array'],
            'roles.*' => ['exists:roles,id'],
        ]);

        $permission->roles()->sync($data['roles'] ?? []);

        return back()->with('feedback', [
            'success' => true,
            'message' => 'Funções atualizadas com sucesso',
            'type' => 'toast',
            'id' => uniqid(),
        ]);
    }
}
