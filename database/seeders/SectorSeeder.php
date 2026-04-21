<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\Sector;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class SectorSeeder extends Seeder
{
    use WithoutModelEvents;
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $defaultSectors = [
            ['name' => 'Engenharia', 'description' => 'Planejamento e desenvolvimento técnico do projeto'],
            ['name' => 'Elétrica', 'description' => 'Execução de instalações e infraestrutura elétrica'],
            ['name' => 'Civil', 'description' => 'Obras civis, fundações e estrutura'],
            ['name' => 'Comissionamento', 'description' => 'Testes, validação e energização do sistema'],
            ['name' => 'Almoxarifado', 'description' => 'Controle de estoque e materiais do projeto'],
        ];

        $projects = Project::all();

        foreach ($projects as $project) {
            foreach ($defaultSectors as $sector) {
                Sector::firstOrCreate(
                    [
                        'project_id' => $project->id,
                        'name' => $sector['name'],
                    ],
                    [
                        'uuid' => Str::uuid(),
                        'description' => $sector['description'],
                        'slug' => Str::slug($sector['name']),
                    ]
                );
            }
        }
    }
}
