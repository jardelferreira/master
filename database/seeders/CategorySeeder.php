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
        $categories = [
            [
                'name' => 'Elétrica',
                'description' => 'Materiais e equipamentos para instalações elétricas',
                'meta' => [
                    'sector' => 'eletrica',
                    'icon' => 'zap',
                    'color' => '#f59e0b',
                ],
                'children' => [
                    'Cabos e Fios',
                    'Disjuntores',
                    'Quadros Elétricos',
                    'Tomadas e Interruptores',
                    'Eletrodutos e Conduítes',
                    'Luminárias',
                    'Transformadores',
                    'Ferramentas Elétricas',
                    'Equipamentos de Medição',
                ],
            ],

            [
                'name' => 'Civil',
                'description' => 'Materiais para construção civil e infraestrutura',
                'meta' => [
                    'sector' => 'civil',
                    'icon' => 'building',
                    'color' => '#78716c',
                ],
                'children' => [
                    'Cimento e Argamassa',
                    'Areia e Brita',
                    'Blocos e Tijolos',
                    'Tubulações Hidráulicas',
                    'Conexões',
                    'Impermeabilização',
                    'Ferragens',
                    'Madeiras',
                    'Ferramentas de Obra',
                ],
            ],

            [
                'name' => 'Engenharia',
                'description' => 'Materiais técnicos e operacionais de engenharia',
                'meta' => [
                    'sector' => 'engenharia',
                    'icon' => 'cpu',
                    'color' => '#2563eb',
                ],
                'children' => [
                    'Instrumentação',
                    'Automação',
                    'Sensores',
                    'Válvulas',
                    'Bombas',
                    'Motores',
                    'Rolamentos',
                    'Acoplamentos',
                    'Peças Técnicas',
                ],
            ],

            [
                'name' => 'QSMS',
                'description' => 'Qualidade, Segurança, Meio Ambiente e Saúde',
                'meta' => [
                    'sector' => 'qsms',
                    'icon' => 'shield-check',
                    'color' => '#dc2626',
                ],
                'children' => [
                    'EPIs',
                    'EPCs',
                    'Sinalização de Segurança',
                    'Combate a Incêndio',
                    'Kit Primeiros Socorros',
                    'Proteção Respiratória',
                    'Proteção Auditiva',
                    'Proteção contra Queda',
                ],
            ],

            [
                'name' => 'Ferramentas',
                'description' => 'Ferramentas manuais e operacionais',
                'meta' => [
                    'sector' => 'geral',
                    'icon' => 'hammer',
                    'color' => '#374151',
                ],
                'children' => [
                    'Ferramentas Manuais',
                    'Ferramentas de Corte',
                    'Ferramentas de Medição',
                    'Ferramentas Elétricas',
                    'Ferramentas Pneumáticas',
                    'Kits de Ferramentas',
                ],
            ],

            [
                'name' => 'Consumíveis',
                'description' => 'Itens de consumo recorrente',
                'meta' => [
                    'sector' => 'geral',
                    'icon' => 'package',
                    'color' => '#16a34a',
                ],
                'children' => [
                    'Parafusos e Fixadores',
                    'Abraçadeiras',
                    'Fitas',
                    'Adesivos e Selantes',
                    'Lubrificantes',
                    'Discos de Corte',
                    'Lixas',
                    'Soldagem',
                ],
            ],

            [
                'name' => 'TI e Escritório',
                'description' => 'Materiais administrativos e tecnologia',
                'meta' => [
                    'sector' => 'administrativo',
                    'icon' => 'monitor',
                    'color' => '#7c3aed',
                ],
                'children' => [
                    'Informática',
                    'Periféricos',
                    'Impressão',
                    'Materiais de Escritório',
                    'Mobiliário',
                ],
            ],

            [
                'name' => 'Manutenção',
                'description' => 'Itens voltados para manutenção corretiva e preventiva',
                'meta' => [
                    'sector' => 'manutencao',
                    'icon' => 'wrench',
                    'color' => '#0f766e',
                ],
                'children' => [
                    'Peças de Reposição',
                    'Correias',
                    'Lubrificação',
                    'Fixação',
                    'Vedação',
                    'Componentes Mecânicos',
                ],
            ],
        ];

        foreach ($categories as $categoryData) {
            $parent = Category::create([
                'name' => $categoryData['name'],
                'description' => $categoryData['description'],
                'active' => true,
                'meta' => $categoryData['meta'],
            ]);

            foreach ($categoryData['children'] as $childName) {
                Category::create([
                    'name' => $childName,
                    'parent_id' => $parent->id,
                    'description' => "{$childName} da categoria {$parent->name}",
                    'active' => true,
                    'meta' => [
                        'sector' => $categoryData['meta']['sector'],
                        'parent' => $parent->name,
                    ],
                ]);
            }
        }
    }
}
