<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         // Categorias principais
        $parents = collect([
            'EPIs',
            'Ferramentas',
            'Materiais Elétricos',
            'Materiais Hidráulicos',
            'Equipamentos',
        ])->map(function ($name) {
            return Category::create([
                'uuid' => Str::uuid(),
                'name' => $name,
                'slug' => Str::slug($name),
                'description' => "Categoria {$name}",
                'active' => true,
            ]);
        });

        // Subcategorias
        $children = [
            'EPIs' => ['Luvas', 'Capacetes', 'Óculos de proteção'],
            'Ferramentas' => ['Manuais', 'Elétricas'],
            'Materiais Elétricos' => ['Cabos', 'Disjuntores'],
            'Materiais Hidráulicos' => ['Tubos', 'Conexões'],
            'Equipamentos' => ['Pesados', 'Leves'],
        ];

        foreach ($parents as $parent) {
            if (!isset($children[$parent->name])) continue;

            foreach ($children[$parent->name] as $childName) {
                Category::create([
                    'uuid' => Str::uuid(),
                    'name' => $childName,
                    'slug' => Str::slug($parent->name . '-' . $childName),
                    'parent_id' => $parent->id,
                    'description' => "{$childName} de {$parent->name}",
                    'active' => true,
                ]);
            }
        }

        // categorias aleatórias extras
        Category::factory()->count(20)->create();
        // algumas inativas
        Category::factory()->count(5)->inactive()->create();
    }
}
