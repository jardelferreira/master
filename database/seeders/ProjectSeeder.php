<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    use WithoutModelEvents;
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $projects = [
            [
                'name' => 'LT 230kV Complexo Industrial Norte',
                'slug' => 'lt-230kv-complexo-industrial-norte',
                'description' => 'Implantação de linha de transmissão em alta tensão para atendimento ao complexo industrial da região norte.',
                'initials' => 'LT-CIN',
            ],
            [
                'name' => 'SE ENEL Nova Iguaçu',
                'slug' => 'se-enel-nova-iguacu',
                'description' => 'Construção e ampliação da subestação Nova Iguaçu com integração ao sistema de distribuição.',
                'initials' => 'SE-NI',
            ],
            [
                'name' => 'SOT Linha Verde RJ',
                'slug' => 'sot-linha-verde-rj',
                'description' => 'Execução de sistema óptico de telecomunicação ao longo do corredor Linha Verde no Rio de Janeiro.',
                'initials' => 'SOT-LV',
            ],
            [
                'name' => 'Subterrâneo Centro Empresarial SP',
                'slug' => 'subterraneo-centro-empresarial-sp',
                'description' => 'Instalação de rede elétrica subterrânea para alimentação de complexo empresarial.',
                'initials' => 'SUB-SP',
            ],
            [
                'name' => 'UTE Porto Atlântico Interligações',
                'slug' => 'ute-porto-atlantico-interligacoes',
                'description' => 'Execução de interligações elétricas em usina termelétrica Porto Atlântico.',
                'initials' => 'UTE-PA',
            ],
        ];

        foreach ($projects as $project) {
            Project::firstOrCreate(
                ['slug' => $project['slug']],
                $project
            );
        }
    }
}
