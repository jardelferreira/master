<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $modules = [
            'users' => ['view', 'create', 'update', 'delete', 'manager'],
            'permissions' => ['view', 'manager'],
            'roles' => ['view', 'manager'],
            'dashboard' => ['access'],
        ];

        $permissions = collect();

        foreach ($modules as $module => $actions) {
            foreach ($actions as $action) {
                $name = $module === 'dashboard'
                    ? 'dashboard'
                    : "{$module}.{$action}";

                $permission = Permission::firstOrCreate(
                    ['name' => $name, 'guard_name' => 'web'],
                    [
                        'description' => ucfirst($action) . ' ' . ucfirst($module),
                    ]
                );

                $permissions->push($permission->name);
            }
        }

        $roles = [
            'super.admin' => $permissions, // tudo
            'admin' => $permissions,       // tudo (ou ajuste depois)
            'guest.admin' => [
                'users.view',
                'permissions.view',
                'roles.view',
                'dashboard'
            ],
            'users.manager' => [
                'users.manager',
                'users.view',
                'users.create',
                'users.update',
                'users.delete'
            ],
            'permissions.manager' => [
                'permissions.manager'
            ],
            'roles.manager' => [
                'roles.manager'
            ],
        ];

        foreach ($roles as $roleName => $perms) {
            $role = Role::firstOrCreate(
                ['name' => $roleName, 'guard_name' => 'web'],
            );

            $role->syncPermissions($perms);
        }

        $superUser = User::where('email', 'proaction.adm@mail.com')->first();

        if ($superUser) {
            $superUser->assignRole('super-admin');
        }
    }
}
