<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
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
        $email = config('app.user_email', 'admin@mail.com');
        User::withoutEvents(function () use ($email) {
            User::firstOrCreate([
                'name' => config('app.user_name', 'Administrador'),
                'email' => $email,
                'active' => true,
                'uuid' => Str::uuid(),
                'email_verified_at' => now(),
                'password' => Hash::make(config('app.user_password', 'admin123')),
                'remember_token' => Str::random(10),
            ]);
        });
        // cria 10 usuários para preenchimentos
        if (config('app.fake_users', false))
            User::factory(10);
    }
}
