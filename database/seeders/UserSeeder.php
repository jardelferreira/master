<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $name = (string) config('app.user_name', 'Administrador');
        $email = (string) config('app.user_email', 'admin@mail.com');
        $password = (string) config('app.user_password', 'admin123');

        User::withoutEvents(function () use ($email, $name, $password): void {
            User::updateOrCreate(
                ['email' => $email],
                [
                    'name' => $name,
                    'active' => true,
                    'uuid' => (string) Str::uuid(),
                    'email_verified_at' => now(),
                    'password' => Hash::make($password),
                    'remember_token' => Str::random(10),
                ]
            );
        });

        if ((bool) config('app.fake_users', false)) {
            User::factory(10)->create();
        }
    }
}
