<?php

namespace Database\Seeders;

use App\Enum\ProductUnitEnum;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductEletricalSeeder extends Seeder
{
    public function run(): void
    {
        $products = [

            /*
            |--------------------------------------------------------------------------
            | ELÉTRICA
            |--------------------------------------------------------------------------
            */

            [
                'category' => 'Cabos e Fios',
                'name' => 'Cabo Flexível 1,5mm 750V',
                'description' => 'Cabo flexível de cobre para instalações elétricas de baixa tensão.',
                'unit' => ProductUnitEnum::M->value,
                'sku' => 'ELE-CAB-0001',
                'meta' => [
                    'brand' => 'Prysmian',
                    'manufacturer' => 'Prysmian Group',
                    'internal_code' => 'MAT-ELE-0001',
                    'min_stock' => 500,
                    'sector' => 'eletrica',
                ],
            ],

            [
                'category' => 'Cabos e Fios',
                'name' => 'Cabo Flexível 2,5mm 750V',
                'description' => 'Cabo flexível de cobre para circuitos elétricos.',
                'unit' => ProductUnitEnum::M->value,
                'sku' => 'ELE-CAB-0002',
                'meta' => [
                    'brand' => 'Prysmian',
                    'manufacturer' => 'Prysmian Group',
                    'internal_code' => 'MAT-ELE-0002',
                    'min_stock' => 500,
                    'sector' => 'eletrica',
                ],
            ],

            [
                'category' => 'Cabos e Fios',
                'name' => 'Cabo Flexível 4mm 750V',
                'description' => 'Cabo flexível para alimentação elétrica.',
                'unit' => ProductUnitEnum::M->value,
                'sku' => 'ELE-CAB-0003',
                'meta' => [
                    'brand' => 'Prysmian',
                    'manufacturer' => 'Prysmian Group',
                    'internal_code' => 'MAT-ELE-0003',
                    'min_stock' => 300,
                    'sector' => 'eletrica',
                ],
            ],

            [
                'category' => 'Cabos e Fios',
                'name' => 'Cabo PP 3x2,5mm',
                'description' => 'Cabo multipolar para equipamentos elétricos.',
                'unit' => ProductUnitEnum::M->value,
                'sku' => 'ELE-CAB-0004',
                'meta' => [
                    'brand' => 'Sil',
                    'manufacturer' => 'Sil Fios e Cabos',
                    'internal_code' => 'MAT-ELE-0004',
                    'min_stock' => 150,
                    'sector' => 'eletrica',
                ],
            ],

            [
                'category' => 'Disjuntores',
                'name' => 'Disjuntor DIN Monopolar 10A',
                'description' => 'Disjuntor termomagnético para proteção elétrica.',
                'unit' => ProductUnitEnum::UNIT->value,
                'sku' => 'ELE-DIS-0001',
                'meta' => [
                    'brand' => 'Steck',
                    'manufacturer' => 'Steck',
                    'internal_code' => 'MAT-ELE-0005',
                    'min_stock' => 20,
                    'sector' => 'eletrica',
                ],
            ],

            [
                'category' => 'Disjuntores',
                'name' => 'Disjuntor DIN Monopolar 20A',
                'description' => 'Proteção para circuitos elétricos.',
                'unit' => ProductUnitEnum::UNIT->value,
                'sku' => 'ELE-DIS-0002',
                'meta' => [
                    'brand' => 'Schneider',
                    'manufacturer' => 'Schneider Electric',
                    'internal_code' => 'MAT-ELE-0006',
                    'min_stock' => 20,
                    'sector' => 'eletrica',
                ],
            ],

            [
                'category' => 'Disjuntores',
                'name' => 'Disjuntor Bipolar 32A',
                'description' => 'Disjuntor termomagnético bipolar.',
                'unit' => ProductUnitEnum::UNIT->value,
                'sku' => 'ELE-DIS-0003',
                'meta' => [
                    'brand' => 'Steck',
                    'manufacturer' => 'Steck',
                    'internal_code' => 'MAT-ELE-0007',
                    'min_stock' => 15,
                    'sector' => 'eletrica',
                ],
            ],

            [
                'category' => 'Tomadas e Interruptores',
                'name' => 'Tomada 2P+T 10A',
                'description' => 'Tomada padrão brasileiro.',
                'unit' => ProductUnitEnum::UNIT->value,
                'sku' => 'ELE-TOM-0001',
                'meta' => [
                    'brand' => 'Tramontina',
                    'manufacturer' => 'Tramontina',
                    'internal_code' => 'MAT-ELE-0008',
                    'min_stock' => 30,
                    'sector' => 'eletrica',
                ],
            ],

            [
                'category' => 'Tomadas e Interruptores',
                'name' => 'Interruptor Simples',
                'description' => 'Interruptor de acionamento simples.',
                'unit' => ProductUnitEnum::UNIT->value,
                'sku' => 'ELE-TOM-0002',
                'meta' => [
                    'brand' => 'Tramontina',
                    'manufacturer' => 'Tramontina',
                    'internal_code' => 'MAT-ELE-0009',
                    'min_stock' => 30,
                    'sector' => 'eletrica',
                ],
            ],

            [
                'category' => 'Luminárias',
                'name' => 'Luminária LED 18W',
                'description' => 'Luminária LED para ambientes internos.',
                'unit' => ProductUnitEnum::UNIT->value,
                'sku' => 'ELE-LUM-0001',
                'meta' => [
                    'brand' => 'Philips',
                    'manufacturer' => 'Philips',
                    'internal_code' => 'MAT-ELE-0010',
                    'min_stock' => 10,
                    'sector' => 'eletrica',
                ],
            ],

            [
                'category' => 'Equipamentos de Medição',
                'name' => 'Multímetro Digital',
                'description' => 'Instrumento para medição elétrica.',
                'unit' => ProductUnitEnum::UNIT->value,
                'sku' => 'ELE-MED-0001',
                'meta' => [
                    'brand' => 'Minipa',
                    'manufacturer' => 'Minipa',
                    'internal_code' => 'MAT-ELE-0011',
                    'min_stock' => 5,
                    'sector' => 'eletrica',
                ],
            ],

            [
                'category' => 'Ferramentas Elétricas',
                'name' => 'Alicate Amperímetro',
                'description' => 'Instrumento para medição de corrente elétrica.',
                'unit' => ProductUnitEnum::UNIT->value,
                'sku' => 'ELE-FER-0001',
                'meta' => [
                    'brand' => 'Minipa',
                    'manufacturer' => 'Minipa',
                    'internal_code' => 'MAT-ELE-0012',
                    'min_stock' => 3,
                    'sector' => 'eletrica',
                ],
            ],
            /*
            |--------------------------------------------------------------------------
            | CIVIL
            |--------------------------------------------------------------------------
            */

            [
                'category' => 'Cimento e Argamassa',
                'name' => 'Cimento CP II 50kg',
                'description' => 'Cimento Portland para aplicações gerais na construção civil.',
                'unit' => ProductUnitEnum::KG->value,
                'sku' => 'CIV-CIM-0001',
                'meta' => [
                    'brand' => 'Nassau',
                    'manufacturer' => 'Cimentos Nassau',
                    'internal_code' => 'MAT-CIV-0001',
                    'min_stock' => 100,
                    'sector' => 'civil',
                ],
            ],

            [
                'category' => 'Areia e Brita',
                'name' => 'Areia Média Lavada',
                'description' => 'Areia para concreto, reboco e assentamento.',
                'unit' => ProductUnitEnum::M3->value,
                'sku' => 'CIV-AGR-0001',
                'meta' => [
                    'brand' => 'Genérico',
                    'manufacturer' => 'Fornecedor Local',
                    'internal_code' => 'MAT-CIV-0002',
                    'min_stock' => 20,
                    'sector' => 'civil',
                ],
            ],

            [
                'category' => 'Areia e Brita',
                'name' => 'Brita Nº 1',
                'description' => 'Brita para concreto estrutural.',
                'unit' => ProductUnitEnum::M3->value,
                'sku' => 'CIV-AGR-0002',
                'meta' => [
                    'brand' => 'Genérico',
                    'manufacturer' => 'Pedreira Regional',
                    'internal_code' => 'MAT-CIV-0003',
                    'min_stock' => 15,
                    'sector' => 'civil',
                ],
            ],

            [
                'category' => 'Blocos e Tijolos',
                'name' => 'Bloco Cerâmico 9x19x19',
                'description' => 'Bloco cerâmico para vedação.',
                'unit' => ProductUnitEnum::UNIT->value,
                'sku' => 'CIV-BLO-0001',
                'meta' => [
                    'brand' => 'Genérico',
                    'manufacturer' => 'Cerâmica Regional',
                    'internal_code' => 'MAT-CIV-0004',
                    'min_stock' => 1000,
                    'sector' => 'civil',
                ],
            ],

            [
                'category' => 'Tubulações Hidráulicas',
                'name' => 'Tubo PVC Soldável 25mm',
                'description' => 'Tubo para instalações hidráulicas.',
                'unit' => ProductUnitEnum::M->value,
                'sku' => 'CIV-HID-0001',
                'meta' => [
                    'brand' => 'Tigre',
                    'manufacturer' => 'Tigre',
                    'internal_code' => 'MAT-CIV-0005',
                    'min_stock' => 100,
                    'sector' => 'civil',
                ],
            ],

            [
                'category' => 'Conexões',
                'name' => 'Joelho Soldável 25mm',
                'description' => 'Conexão hidráulica PVC 90 graus.',
                'unit' => ProductUnitEnum::UNIT->value,
                'sku' => 'CIV-CON-0001',
                'meta' => [
                    'brand' => 'Tigre',
                    'manufacturer' => 'Tigre',
                    'internal_code' => 'MAT-CIV-0006',
                    'min_stock' => 80,
                    'sector' => 'civil',
                ],
            ],

            [
                'category' => 'Impermeabilização',
                'name' => 'Impermeabilizante Vedacit 18L',
                'description' => 'Impermeabilizante para estruturas de concreto.',
                'unit' => ProductUnitEnum::L->value,
                'sku' => 'CIV-IMP-0001',
                'meta' => [
                    'brand' => 'Vedacit',
                    'manufacturer' => 'Vedacit',
                    'internal_code' => 'MAT-CIV-0007',
                    'min_stock' => 10,
                    'sector' => 'civil',
                ],
            ],

            [
                'category' => 'Ferragens',
                'name' => 'Vergalhão CA-50 10mm',
                'description' => 'Aço para reforço estrutural.',
                'unit' => ProductUnitEnum::M->value,
                'sku' => 'CIV-FER-0001',
                'meta' => [
                    'brand' => 'Gerdau',
                    'manufacturer' => 'Gerdau',
                    'internal_code' => 'MAT-CIV-0008',
                    'min_stock' => 200,
                    'sector' => 'civil',
                ],
            ],

            /*
            |--------------------------------------------------------------------------
            | CONSUMÍVEIS
            |--------------------------------------------------------------------------
            */

            [
                'category' => 'Parafusos e Fixadores',
                'name' => 'Parafuso Sextavado 1/4',
                'description' => 'Parafuso de fixação industrial.',
                'unit' => ProductUnitEnum::UNIT->value,
                'sku' => 'CON-PAR-0001',
                'meta' => [
                    'brand' => 'Ciser',
                    'manufacturer' => 'Ciser',
                    'internal_code' => 'MAT-CON-0001',
                    'min_stock' => 500,
                    'sector' => 'consumiveis',
                ],
            ],

            [
                'category' => 'Abraçadeiras',
                'name' => 'Abraçadeira Nylon 200mm',
                'description' => 'Abraçadeira plástica para organização e fixação.',
                'unit' => ProductUnitEnum::PACK->value,
                'sku' => 'CON-ABR-0001',
                'meta' => [
                    'brand' => 'HellermannTyton',
                    'manufacturer' => 'HellermannTyton',
                    'internal_code' => 'MAT-CON-0002',
                    'min_stock' => 50,
                    'sector' => 'consumiveis',
                ],
            ],

            [
                'category' => 'Fitas',
                'name' => 'Fita Isolante 20m',
                'description' => 'Fita isolante para aplicações elétricas.',
                'unit' => ProductUnitEnum::UNIT->value,
                'sku' => 'CON-FIT-0001',
                'meta' => [
                    'brand' => '3M',
                    'manufacturer' => '3M',
                    'internal_code' => 'MAT-CON-0003',
                    'min_stock' => 100,
                    'sector' => 'consumiveis',
                ],
            ],

            [
                'category' => 'Adesivos e Selantes',
                'name' => 'Silicone Acético Transparente',
                'description' => 'Selante para vedação e acabamento.',
                'unit' => ProductUnitEnum::UNIT->value,
                'sku' => 'CON-SEL-0001',
                'meta' => [
                    'brand' => 'Tekbond',
                    'manufacturer' => 'Tekbond',
                    'internal_code' => 'MAT-CON-0004',
                    'min_stock' => 40,
                    'sector' => 'consumiveis',
                ],
            ],

            [
                'category' => 'Lubrificantes',
                'name' => 'Óleo Lubrificante Industrial 20L',
                'description' => 'Lubrificante para equipamentos industriais.',
                'unit' => ProductUnitEnum::L->value,
                'sku' => 'CON-LUB-0001',
                'meta' => [
                    'brand' => 'Lubrax',
                    'manufacturer' => 'Petrobras',
                    'internal_code' => 'MAT-CON-0005',
                    'min_stock' => 20,
                    'sector' => 'consumiveis',
                ],
            ],

            [
                'category' => 'Discos de Corte',
                'name' => 'Disco de Corte 7"',
                'description' => 'Disco abrasivo para corte de metais.',
                'unit' => ProductUnitEnum::UNIT->value,
                'sku' => 'CON-DIS-0001',
                'meta' => [
                    'brand' => 'Norton',
                    'manufacturer' => 'Norton',
                    'internal_code' => 'MAT-CON-0006',
                    'min_stock' => 80,
                    'sector' => 'consumiveis',
                ],
            ],

            [
                'category' => 'Soldagem',
                'name' => 'Eletrodo AWS E6013 2.5mm',
                'description' => 'Consumível para soldagem elétrica.',
                'unit' => ProductUnitEnum::KG->value,
                'sku' => 'CON-SOL-0001',
                'meta' => [
                    'brand' => 'ESAB',
                    'manufacturer' => 'ESAB',
                    'internal_code' => 'MAT-CON-0007',
                    'min_stock' => 30,
                    'sector' => 'consumiveis',
                ],
            ],
            /*
            |--------------------------------------------------------------------------
            | QSMS
            |--------------------------------------------------------------------------
            */

            [
                'category' => 'EPIs',
                'name' => 'Capacete de Segurança Classe B',
                'description' => 'Capacete para proteção contra impactos e risco elétrico.',
                'unit' => ProductUnitEnum::UNIT->value,
                'sku' => 'QSM-EPI-0001',
                'meta' => [
                    'brand' => '3M',
                    'manufacturer' => '3M',
                    'internal_code' => 'MAT-QSM-0001',
                    'min_stock' => 30,
                    'sector' => 'qsms',
                ],
            ],

            [
                'category' => 'EPIs',
                'name' => 'Óculos de Proteção Incolor',
                'description' => 'Proteção ocular contra partículas volantes.',
                'unit' => ProductUnitEnum::UNIT->value,
                'sku' => 'QSM-EPI-0002',
                'meta' => [
                    'brand' => 'Danny',
                    'manufacturer' => 'Danny',
                    'internal_code' => 'MAT-QSM-0002',
                    'min_stock' => 50,
                    'sector' => 'qsms',
                ],
            ],

            [
                'category' => 'EPIs',
                'name' => 'Luva de Vaqueta',
                'description' => 'Proteção para mãos em atividades mecânicas.',
                'unit' => ProductUnitEnum::PAIR->value,
                'sku' => 'QSM-EPI-0003',
                'meta' => [
                    'brand' => 'Volk',
                    'manufacturer' => 'Volk',
                    'internal_code' => 'MAT-QSM-0003',
                    'min_stock' => 80,
                    'sector' => 'qsms',
                ],
            ],

            [
                'category' => 'EPIs',
                'name' => 'Respirador PFF2',
                'description' => 'Proteção respiratória contra partículas.',
                'unit' => ProductUnitEnum::UNIT->value,
                'sku' => 'QSM-EPI-0004',
                'meta' => [
                    'brand' => '3M',
                    'manufacturer' => '3M',
                    'internal_code' => 'MAT-QSM-0004',
                    'min_stock' => 100,
                    'sector' => 'qsms',
                ],
            ],

            [
                'category' => 'Proteção Auditiva',
                'name' => 'Protetor Auricular Tipo Plug',
                'description' => 'Proteção auditiva reutilizável.',
                'unit' => ProductUnitEnum::PAIR->value,
                'sku' => 'QSM-AUD-0001',
                'meta' => [
                    'brand' => '3M',
                    'manufacturer' => '3M',
                    'internal_code' => 'MAT-QSM-0005',
                    'min_stock' => 100,
                    'sector' => 'qsms',
                ],
            ],

            [
                'category' => 'Proteção contra Queda',
                'name' => 'Cinturão de Segurança Tipo Paraquedista',
                'description' => 'Equipamento para trabalho em altura.',
                'unit' => ProductUnitEnum::UNIT->value,
                'sku' => 'QSM-ALT-0001',
                'meta' => [
                    'brand' => 'MG Cinto',
                    'manufacturer' => 'MG Cinto',
                    'internal_code' => 'MAT-QSM-0006',
                    'min_stock' => 10,
                    'sector' => 'qsms',
                ],
            ],

            [
                'category' => 'Combate a Incêndio',
                'name' => 'Extintor PQS 6kg',
                'description' => 'Extintor de incêndio de pó químico seco.',
                'unit' => ProductUnitEnum::UNIT->value,
                'sku' => 'QSM-INC-0001',
                'meta' => [
                    'brand' => 'Resil',
                    'manufacturer' => 'Resil',
                    'internal_code' => 'MAT-QSM-0007',
                    'min_stock' => 10,
                    'sector' => 'qsms',
                ],
            ],

            [
                'category' => 'Sinalização de Segurança',
                'name' => 'Cone de Sinalização 75cm',
                'description' => 'Sinalização de áreas de risco.',
                'unit' => ProductUnitEnum::UNIT->value,
                'sku' => 'QSM-SIN-0001',
                'meta' => [
                    'brand' => 'Plastcor',
                    'manufacturer' => 'Plastcor',
                    'internal_code' => 'MAT-QSM-0008',
                    'min_stock' => 20,
                    'sector' => 'qsms',
                ],
            ],

            /*
            |--------------------------------------------------------------------------
            | FERRAMENTAS
            |--------------------------------------------------------------------------
            */

            [
                'category' => 'Ferramentas Manuais',
                'name' => 'Alicate Universal 8"',
                'description' => 'Ferramenta manual para corte e aperto.',
                'unit' => ProductUnitEnum::UNIT->value,
                'sku' => 'FER-MAN-0001',
                'meta' => [
                    'brand' => 'Tramontina',
                    'manufacturer' => 'Tramontina',
                    'internal_code' => 'MAT-FER-0001',
                    'min_stock' => 20,
                    'sector' => 'ferramentas',
                ],
            ],

            [
                'category' => 'Ferramentas Manuais',
                'name' => 'Chave Philips Média',
                'description' => 'Chave para parafusos tipo cruz.',
                'unit' => ProductUnitEnum::UNIT->value,
                'sku' => 'FER-MAN-0002',
                'meta' => [
                    'brand' => 'Tramontina',
                    'manufacturer' => 'Tramontina',
                    'internal_code' => 'MAT-FER-0002',
                    'min_stock' => 25,
                    'sector' => 'ferramentas',
                ],
            ],

            [
                'category' => 'Ferramentas Manuais',
                'name' => 'Martelo Unha 27mm',
                'description' => 'Ferramenta para impacto e remoção de pregos.',
                'unit' => ProductUnitEnum::UNIT->value,
                'sku' => 'FER-MAN-0003',
                'meta' => [
                    'brand' => 'Vonder',
                    'manufacturer' => 'Vonder',
                    'internal_code' => 'MAT-FER-0003',
                    'min_stock' => 15,
                    'sector' => 'ferramentas',
                ],
            ],

            [
                'category' => 'Ferramentas Elétricas',
                'name' => 'Furadeira de Impacto 650W',
                'description' => 'Ferramenta elétrica para perfuração.',
                'unit' => ProductUnitEnum::UNIT->value,
                'sku' => 'FER-ELE-0001',
                'meta' => [
                    'brand' => 'Bosch',
                    'manufacturer' => 'Bosch',
                    'internal_code' => 'MAT-FER-0004',
                    'min_stock' => 5,
                    'sector' => 'ferramentas',
                ],
            ],

            [
                'category' => 'Ferramentas Elétricas',
                'name' => 'Martelete Rompedor',
                'description' => 'Equipamento para perfuração pesada.',
                'unit' => ProductUnitEnum::UNIT->value,
                'sku' => 'FER-ELE-0002',
                'meta' => [
                    'brand' => 'Makita',
                    'manufacturer' => 'Makita',
                    'internal_code' => 'MAT-FER-0005',
                    'min_stock' => 3,
                    'sector' => 'ferramentas',
                ],
            ],

            [
                'category' => 'Ferramentas de Medição',
                'name' => 'Trena 5 Metros',
                'description' => 'Instrumento para medição linear.',
                'unit' => ProductUnitEnum::UNIT->value,
                'sku' => 'FER-MED-0001',
                'meta' => [
                    'brand' => 'Stanley',
                    'manufacturer' => 'Stanley',
                    'internal_code' => 'MAT-FER-0006',
                    'min_stock' => 20,
                    'sector' => 'ferramentas',
                ],
            ],

            [
                'category' => 'Ferramentas de Medição',
                'name' => 'Paquímetro Digital',
                'description' => 'Instrumento de medição de precisão.',
                'unit' => ProductUnitEnum::UNIT->value,
                'sku' => 'FER-MED-0002',
                'meta' => [
                    'brand' => 'Mitutoyo',
                    'manufacturer' => 'Mitutoyo',
                    'internal_code' => 'MAT-FER-0007',
                    'min_stock' => 5,
                    'sector' => 'ferramentas',
                ],
            ],
            /*
            |--------------------------------------------------------------------------
            | ENGENHARIA
            |--------------------------------------------------------------------------
            */

            [
                'category' => 'Instrumentação',
                'name' => 'Manômetro Industrial 0-10 Bar',
                'description' => 'Instrumento para medição de pressão em sistemas industriais.',
                'unit' => ProductUnitEnum::UNIT->value,
                'sku' => 'ENG-INS-0001',
                'meta' => [
                    'brand' => 'Wika',
                    'manufacturer' => 'Wika',
                    'internal_code' => 'MAT-ENG-0001',
                    'min_stock' => 10,
                    'sector' => 'engenharia',
                ],
            ],

            [
                'category' => 'Instrumentação',
                'name' => 'Termômetro Industrial Digital',
                'description' => 'Instrumento para monitoramento de temperatura.',
                'unit' => ProductUnitEnum::UNIT->value,
                'sku' => 'ENG-INS-0002',
                'meta' => [
                    'brand' => 'Instrutherm',
                    'manufacturer' => 'Instrutherm',
                    'internal_code' => 'MAT-ENG-0002',
                    'min_stock' => 8,
                    'sector' => 'engenharia',
                ],
            ],

            [
                'category' => 'Sensores',
                'name' => 'Sensor Indutivo M12',
                'description' => 'Sensor de proximidade industrial.',
                'unit' => ProductUnitEnum::UNIT->value,
                'sku' => 'ENG-SEN-0001',
                'meta' => [
                    'brand' => 'Autonics',
                    'manufacturer' => 'Autonics',
                    'internal_code' => 'MAT-ENG-0003',
                    'min_stock' => 15,
                    'sector' => 'engenharia',
                ],
            ],

            [
                'category' => 'Sensores',
                'name' => 'Sensor Fotoelétrico',
                'description' => 'Sensor para detecção óptica industrial.',
                'unit' => ProductUnitEnum::UNIT->value,
                'sku' => 'ENG-SEN-0002',
                'meta' => [
                    'brand' => 'Sick',
                    'manufacturer' => 'Sick',
                    'internal_code' => 'MAT-ENG-0004',
                    'min_stock' => 10,
                    'sector' => 'engenharia',
                ],
            ],

            [
                'category' => 'Automação',
                'name' => 'CLP Compacto 24 I/O',
                'description' => 'Controlador lógico programável industrial.',
                'unit' => ProductUnitEnum::UNIT->value,
                'sku' => 'ENG-AUT-0001',
                'meta' => [
                    'brand' => 'WEG',
                    'manufacturer' => 'WEG',
                    'internal_code' => 'MAT-ENG-0005',
                    'min_stock' => 3,
                    'sector' => 'engenharia',
                ],
            ],

            [
                'category' => 'Automação',
                'name' => 'Inversor de Frequência 2CV',
                'description' => 'Controle eletrônico para motores elétricos.',
                'unit' => ProductUnitEnum::UNIT->value,
                'sku' => 'ENG-AUT-0002',
                'meta' => [
                    'brand' => 'WEG',
                    'manufacturer' => 'WEG',
                    'internal_code' => 'MAT-ENG-0006',
                    'min_stock' => 5,
                    'sector' => 'engenharia',
                ],
            ],

            [
                'category' => 'Bombas',
                'name' => 'Bomba Centrífuga 2CV',
                'description' => 'Bomba para circulação e bombeamento industrial.',
                'unit' => ProductUnitEnum::UNIT->value,
                'sku' => 'ENG-BOM-0001',
                'meta' => [
                    'brand' => 'Schneider',
                    'manufacturer' => 'Schneider Motobombas',
                    'internal_code' => 'MAT-ENG-0007',
                    'min_stock' => 4,
                    'sector' => 'engenharia',
                ],
            ],

            [
                'category' => 'Motores',
                'name' => 'Motor Elétrico Trifásico 5CV',
                'description' => 'Motor elétrico industrial trifásico.',
                'unit' => ProductUnitEnum::UNIT->value,
                'sku' => 'ENG-MOT-0001',
                'meta' => [
                    'brand' => 'WEG',
                    'manufacturer' => 'WEG',
                    'internal_code' => 'MAT-ENG-0008',
                    'min_stock' => 3,
                    'sector' => 'engenharia',
                ],
            ],

            [
                'category' => 'Válvulas',
                'name' => 'Válvula Esfera 1 Polegada',
                'description' => 'Válvula para controle de fluxo.',
                'unit' => ProductUnitEnum::UNIT->value,
                'sku' => 'ENG-VAL-0001',
                'meta' => [
                    'brand' => 'Deca',
                    'manufacturer' => 'Deca',
                    'internal_code' => 'MAT-ENG-0009',
                    'min_stock' => 20,
                    'sector' => 'engenharia',
                ],
            ],

            /*
            |--------------------------------------------------------------------------
            | MANUTENÇÃO
            |--------------------------------------------------------------------------
            */

            [
                'category' => 'Componentes Mecânicos',
                'name' => 'Rolamento 6204',
                'description' => 'Rolamento rígido de esferas para uso industrial.',
                'unit' => ProductUnitEnum::UNIT->value,
                'sku' => 'MAN-ROL-0001',
                'meta' => [
                    'brand' => 'SKF',
                    'manufacturer' => 'SKF',
                    'internal_code' => 'MAT-MAN-0001',
                    'min_stock' => 25,
                    'sector' => 'manutencao',
                ],
            ],

            [
                'category' => 'Componentes Mecânicos',
                'name' => 'Rolamento 6205',
                'description' => 'Rolamento para equipamentos rotativos.',
                'unit' => ProductUnitEnum::UNIT->value,
                'sku' => 'MAN-ROL-0002',
                'meta' => [
                    'brand' => 'SKF',
                    'manufacturer' => 'SKF',
                    'internal_code' => 'MAT-MAN-0002',
                    'min_stock' => 20,
                    'sector' => 'manutencao',
                ],
            ],

            [
                'category' => 'Correias',
                'name' => 'Correia Industrial A-45',
                'description' => 'Correia em V para transmissão mecânica.',
                'unit' => ProductUnitEnum::UNIT->value,
                'sku' => 'MAN-COR-0001',
                'meta' => [
                    'brand' => 'Gates',
                    'manufacturer' => 'Gates',
                    'internal_code' => 'MAT-MAN-0003',
                    'min_stock' => 15,
                    'sector' => 'manutencao',
                ],
            ],

            [
                'category' => 'Correias',
                'name' => 'Correia Industrial B-60',
                'description' => 'Correia para acionamentos industriais.',
                'unit' => ProductUnitEnum::UNIT->value,
                'sku' => 'MAN-COR-0002',
                'meta' => [
                    'brand' => 'Gates',
                    'manufacturer' => 'Gates',
                    'internal_code' => 'MAT-MAN-0004',
                    'min_stock' => 10,
                    'sector' => 'manutencao',
                ],
            ],

            [
                'category' => 'Vedação',
                'name' => 'Retentor Industrial 35x52x7',
                'description' => 'Elemento de vedação mecânica.',
                'unit' => ProductUnitEnum::UNIT->value,
                'sku' => 'MAN-VED-0001',
                'meta' => [
                    'brand' => 'Sabó',
                    'manufacturer' => 'Sabó',
                    'internal_code' => 'MAT-MAN-0005',
                    'min_stock' => 30,
                    'sector' => 'manutencao',
                ],
            ],

            [
                'category' => 'Lubrificação',
                'name' => 'Graxa Industrial EP 2',
                'description' => 'Graxa lubrificante para equipamentos industriais.',
                'unit' => ProductUnitEnum::KG->value,
                'sku' => 'MAN-LUB-0001',
                'meta' => [
                    'brand' => 'Mobil',
                    'manufacturer' => 'Mobil',
                    'internal_code' => 'MAT-MAN-0006',
                    'min_stock' => 20,
                    'sector' => 'manutencao',
                ],
            ],

            [
                'category' => 'Peças de Reposição',
                'name' => 'Acoplamento Elástico Industrial',
                'description' => 'Componente para transmissão de torque.',
                'unit' => ProductUnitEnum::UNIT->value,
                'sku' => 'MAN-PEC-0001',
                'meta' => [
                    'brand' => 'Rexnord',
                    'manufacturer' => 'Rexnord',
                    'internal_code' => 'MAT-MAN-0007',
                    'min_stock' => 10,
                    'sector' => 'manutencao',
                ],
            ],
            /*
            |--------------------------------------------------------------------------
            | TI E ESCRITÓRIO
            |--------------------------------------------------------------------------
            */

            [
                'category' => 'Informática',
                'name' => 'Mouse USB Óptico',
                'description' => 'Mouse óptico para uso administrativo.',
                'unit' => ProductUnitEnum::UNIT->value,
                'sku' => 'TIE-INF-0001',
                'meta' => [
                    'brand' => 'Logitech',
                    'manufacturer' => 'Logitech',
                    'internal_code' => 'MAT-TIE-0001',
                    'min_stock' => 15,
                    'sector' => 'administrativo',
                ],
            ],

            [
                'category' => 'Informática',
                'name' => 'Teclado USB ABNT2',
                'description' => 'Teclado padrão brasileiro para escritório.',
                'unit' => ProductUnitEnum::UNIT->value,
                'sku' => 'TIE-INF-0002',
                'meta' => [
                    'brand' => 'Logitech',
                    'manufacturer' => 'Logitech',
                    'internal_code' => 'MAT-TIE-0002',
                    'min_stock' => 10,
                    'sector' => 'administrativo',
                ],
            ],

            [
                'category' => 'Periféricos',
                'name' => 'Monitor LED 24 Polegadas',
                'description' => 'Monitor para estação de trabalho.',
                'unit' => ProductUnitEnum::UNIT->value,
                'sku' => 'TIE-PER-0001',
                'meta' => [
                    'brand' => 'LG',
                    'manufacturer' => 'LG',
                    'internal_code' => 'MAT-TIE-0003',
                    'min_stock' => 5,
                    'sector' => 'administrativo',
                ],
            ],

            [
                'category' => 'Impressão',
                'name' => 'Toner HP LaserJet',
                'description' => 'Cartucho de toner para impressora laser.',
                'unit' => ProductUnitEnum::UNIT->value,
                'sku' => 'TIE-IMP-0001',
                'meta' => [
                    'brand' => 'HP',
                    'manufacturer' => 'HP',
                    'internal_code' => 'MAT-TIE-0004',
                    'min_stock' => 8,
                    'sector' => 'administrativo',
                ],
            ],

            [
                'category' => 'Materiais de Escritório',
                'name' => 'Resma Papel A4 75g',
                'description' => 'Papel sulfite para impressão.',
                'unit' => ProductUnitEnum::PACK->value,
                'sku' => 'TIE-ESC-0001',
                'meta' => [
                    'brand' => 'Chamex',
                    'manufacturer' => 'Suzano',
                    'internal_code' => 'MAT-TIE-0005',
                    'min_stock' => 50,
                    'sector' => 'administrativo',
                ],
            ],

            [
                'category' => 'Materiais de Escritório',
                'name' => 'Caneta Esferográfica Azul',
                'description' => 'Caneta para uso administrativo.',
                'unit' => ProductUnitEnum::BOX->value,
                'sku' => 'TIE-ESC-0002',
                'meta' => [
                    'brand' => 'Bic',
                    'manufacturer' => 'Bic',
                    'internal_code' => 'MAT-TIE-0006',
                    'min_stock' => 20,
                    'sector' => 'administrativo',
                ],
            ],

            [
                'category' => 'Mobiliário',
                'name' => 'Cadeira Escritório Ergonômica',
                'description' => 'Cadeira para ambiente corporativo.',
                'unit' => ProductUnitEnum::UNIT->value,
                'sku' => 'TIE-MOB-0001',
                'meta' => [
                    'brand' => 'Flexform',
                    'manufacturer' => 'Flexform',
                    'internal_code' => 'MAT-TIE-0007',
                    'min_stock' => 3,
                    'sector' => 'administrativo',
                ],
            ],

        ];

        $categories = Category::pluck('id','name');
        foreach ($products as $productData) {
            $categoryId = $categories[$productData['category']] ?? null;

            if (! $categoryId) {
                continue;
            }

            Product::firstOrCreate(
                [
                    'sku' => $productData['sku'],

                ],
                [
                    'name' => $productData['name'],
                    'description' => $productData['description'],
                    'category_id' => $categoryId,
                    'unit' => $productData['unit'],
                    'active' => true,
                    'meta' => $productData['meta'],
                ]
            );
        }
    }
}
