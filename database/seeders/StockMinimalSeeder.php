<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Project;
use App\Models\StockMinimal;
use Illuminate\Database\Seeder;

class StockMinimalSeeder extends Seeder
{
    public function run(): void
    {
        $projects = Project::all();

        foreach ($projects as $project) {
            # code...
            $sectors = $project?->sectors ?? collect();
            $products = Product::all();

            foreach ($products as $product) {

                // Regra global (sem projeto, sem setor)
                StockMinimal::factory()->create([
                    'product_id' => $product->id,
                    'project_id' => null,
                    'sector_id' => null,
                ]);

                // Regra por projeto (projeto 1)
                if ($project) {
                    StockMinimal::factory()->forProject($project)->create([
                        'product_id' => $product->id,
                    ]);
                }

                // Regras por setor (setores do projeto 1)
                foreach ($sectors as $sector) {
                    StockMinimal::factory()->forSector($sector)->create([
                        'product_id' => $product->id,
                    ]);
                }
            }
        }
    }
}
