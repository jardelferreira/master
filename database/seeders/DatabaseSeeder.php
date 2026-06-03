<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        $this->call([
            UserSeeder::class,
            RolePermissionSeeder::class,
            ProjectSeeder::class,
            SectorSeeder::class,
            CategorySeeder::class,
            ProductSeeder::class,
            ProviderSeeder::class,
            InvoiceSeeder::class,
            InvoiceItemSeeder::class,
            StockMinimalSeeder::class
        ]);

    }
}
