<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\StockMinimal;

class StockMinimalSeeder extends Seeder
{
    public function run(): void
    {
        $products = Product::pluck('id');

        foreach ($products as $productId) {

            // regra global
            StockMinimal::factory()->create([
                'product_id' => $productId,
            ]);

            // regra por projeto (opcional)
            if (rand(0, 1)) {
                StockMinimal::factory()
                    ->forProject()
                    ->create([
                        'product_id' => $productId,
                    ]);
            }

            // regra por setor (opcional)
            if (rand(0, 1)) {
                StockMinimal::factory()
                    ->forSector()
                    ->create([
                        'product_id' => $productId,
                    ]);
            }
        }
    }
}