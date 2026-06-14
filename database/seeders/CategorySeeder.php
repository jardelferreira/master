<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [

            [
                'name' => 'Civil',
                'description' => 'Materiais e componentes da construção civil',
                'meta' => [
                    'sector' => 'civil',
                    'icon' => 'building',
                    'color' => '#78716c',
                ],
                'children' => [
                    'Cimento e Argamassas',
                    'Agregados',
                    'Blocos e Tijolos',
                    'Estruturas de Concreto',
                    'Ferragens',
                    'Impermeabilização',
                    'Pré-Moldados',
                    'Coberturas',
                ],
            ],

            [
                'name' => 'Hidráulica',
                'description' => 'Sistemas hidráulicos, saneamento e drenagem',
                'meta' => [
                    'sector' => 'hidraulica',
                    'icon' => 'droplets',
                    'color' => '#0284c7',
                ],
                'children' => [
                    'Tubos',
                    'Conexões',
                    'Registros',
                    'Válvulas',
                    'Reservatórios',
                    'Esgoto',
                    'Drenagem',
                    'Acessórios Hidráulicos',
                ],
            ],

            [
                'name' => 'Elétrica',
                'description' => 'Materiais e equipamentos elétricos',
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
                    'Eletrodutos',
                    'Iluminação',
                    'Transformadores',
                    'Aterramento',
                    'Proteção Elétrica',
                ],
            ],

            [
                'name' => 'Mecânica',
                'description' => 'Componentes e equipamentos mecânicos',
                'meta' => [
                    'sector' => 'mecanica',
                    'icon' => 'cog',
                    'color' => '#475569',
                ],
                'children' => [
                    'Bombas',
                    'Motores',
                    'Rolamentos',
                    'Acoplamentos',
                    'Correias',
                    'Transmissão',
                    'Componentes Mecânicos',
                    'Peças de Reposição',
                ],
            ],

            [
                'name' => 'Automação e Instrumentação',
                'description' => 'Automação industrial e instrumentação',
                'meta' => [
                    'sector' => 'automacao',
                    'icon' => 'cpu',
                    'color' => '#2563eb',
                ],
                'children' => [
                    'Sensores',
                    'Instrumentação',
                    'Controladores',
                    'Automação Industrial',
                    'Equipamentos de Medição',
                ],
            ],

            [
                'name' => 'Esquadrias e Acabamentos',
                'description' => 'Portas, janelas e materiais de acabamento',
                'meta' => [
                    'sector' => 'acabamentos',
                    'icon' => 'door-open',
                    'color' => '#8b5e3c',
                ],
                'children' => [
                    'Portas',
                    'Batentes',
                    'Janelas',
                    'Ferragens para Esquadrias',
                    'Rodapés',
                    'Soleiras',
                    'Revestimentos',
                    'Acabamentos Gerais',
                ],
            ],

            [
                'name' => 'Tintas e Revestimentos',
                'description' => 'Tintas, resinas e revestimentos especiais',
                'meta' => [
                    'sector' => 'pintura',
                    'icon' => 'paintbrush',
                    'color' => '#7c3aed',
                ],
                'children' => [
                    'Tintas',
                    'Primers',
                    'Resinas',
                    'Revestimentos Epóxi',
                    'Selantes',
                    'Aditivos',
                ],
            ],

            [
                'name' => 'Ferramentas',
                'description' => 'Ferramentas manuais e elétricas',
                'meta' => [
                    'sector' => 'ferramentas',
                    'icon' => 'hammer',
                    'color' => '#374151',
                ],
                'children' => [
                    'Ferramentas Manuais',
                    'Ferramentas Elétricas',
                    'Ferramentas Pneumáticas',
                    'Ferramentas de Corte',
                    'Ferramentas de Medição',
                    'Kits de Ferramentas',
                ],
            ],

            [
                'name' => 'Máquinas e Equipamentos',
                'description' => 'Equipamentos de obra e operação',
                'meta' => [
                    'sector' => 'equipamentos',
                    'icon' => 'truck',
                    'color' => '#0f766e',
                ],
                'children' => [
                    'Equipamentos de Obra',
                    'Equipamentos Hidráulicos',
                    'Geradores',
                    'Compressores',
                    'Equipamentos de Protensão',
                    'Equipamentos de Elevação',
                    'Equipamentos de Medição',
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
                    'Proteção Respiratória',
                    'Proteção Auditiva',
                    'Proteção Contra Queda',
                    'Sinalização',
                ],
            ],

            [
                'name' => 'Combate a Incêndio',
                'description' => 'Equipamentos e materiais de combate a incêndio',
                'meta' => [
                    'sector' => 'incendio',
                    'icon' => 'flame',
                    'color' => '#b91c1c',
                ],
                'children' => [
                    'Extintores',
                    'Mangueiras',
                    'Hidrantes',
                    'Abrigos',
                    'Acessórios Contra Incêndio',
                ],
            ],

            [
                'name' => 'Consumíveis',
                'description' => 'Materiais de consumo recorrente',
                'meta' => [
                    'sector' => 'consumiveis',
                    'icon' => 'package',
                    'color' => '#16a34a',
                ],
                'children' => [
                    'Parafusos e Fixadores',
                    'Abraçadeiras',
                    'Fitas',
                    'Adesivos',
                    'Lubrificantes',
                    'Lixas',
                    'Discos de Corte',
                    'Soldagem',
                    'Produtos Químicos',
                ],
            ],

            [
                'name' => 'Paisagismo',
                'description' => 'Itens de jardinagem e paisagismo',
                'meta' => [
                    'sector' => 'paisagismo',
                    'icon' => 'trees',
                    'color' => '#15803d',
                ],
                'children' => [
                    'Plantas',
                    'Gramas',
                    'Jardinagem',
                    'Irrigação',
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
                'name' => 'Serviços e Mão de Obra',
                'description' => 'Profissionais e serviços especializados',
                'meta' => [
                    'sector' => 'servicos',
                    'icon' => 'users',
                    'color' => '#6366f1',
                ],
                'children' => [
                    'Engenharia',
                    'Topografia',
                    'Administrativo',
                    'Operacional',
                    'Técnicos Especializados',
                ],
            ],
        ];

        Category::create([
                'name' => 'Importado SINAPI',
                'description' => 'Produtos importados do SINAPI aguardando categorização',
                'meta' => [
                    'sector' => 'sinapi',
                    'icon' => 'database',
                    'color' => '#64748b',
                ],
            ],);

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
