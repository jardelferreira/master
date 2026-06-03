<?php

namespace Database\Seeders;

use App\Models\Provider;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProviderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $providers = [

            [
                'name' => 'Ferreira Costa & Cia Ltda',
                'trade_name' => 'Ferreira Costa',
                'document' => '12345678000101',
                'email' => 'corporativo@ferreiracosta.com',
                'phone' => '8130001000',
                'website' => 'https://www.ferreiracosta.com',
                'contact_name' => 'Departamento Comercial',
                'city' => 'Recife',
                'state' => 'PE',
                'meta' => [
                    'supplier_type' => 'varejo',
                    'lead_time_days' => 2,
                    'payment_terms' => '28 dias',
                    'rating' => 4.8,
                    'supports_b2b' => true,
                    'delivery' => true,
                ],
            ],

            [
                'name' => 'Leroy Merlin Companhia Brasileira',
                'trade_name' => 'Leroy Merlin',
                'document' => '12345678000102',
                'email' => 'empresas@leroymerlin.com',
                'phone' => '1130001001',
                'website' => 'https://www.leroymerlin.com.br',
                'contact_name' => 'Canal Empresas',
                'city' => 'São Paulo',
                'state' => 'SP',
                'meta' => [
                    'supplier_type' => 'varejo',
                    'lead_time_days' => 3,
                    'payment_terms' => '30 dias',
                    'rating' => 4.7,
                    'supports_b2b' => true,
                    'delivery' => true,
                ],
            ],

            [
                'name' => 'Casa do Parafuso Comércio Ltda',
                'trade_name' => 'Casa do Parafuso',
                'document' => '12345678000103',
                'email' => 'vendas@casadoparafuso.com.br',
                'phone' => '8130001002',
                'website' => 'https://www.casadoparafuso.com.br',
                'contact_name' => 'Equipe Comercial',
                'city' => 'Recife',
                'state' => 'PE',
                'meta' => [
                    'supplier_type' => 'distribuidor',
                    'lead_time_days' => 1,
                    'payment_terms' => '21 dias',
                    'rating' => 4.6,
                    'supports_b2b' => true,
                    'delivery' => true,
                ],
            ],

            [
                'name' => 'Kalunga Comércio e Indústria Gráfica Ltda',
                'trade_name' => 'Kalunga',
                'document' => '12345678000104',
                'email' => 'empresas@kalunga.com.br',
                'phone' => '1130001003',
                'website' => 'https://www.kalunga.com.br',
                'contact_name' => 'Kalunga Empresas',
                'city' => 'São Paulo',
                'state' => 'SP',
                'meta' => [
                    'supplier_type' => 'corporativo',
                    'lead_time_days' => 2,
                    'payment_terms' => '28 dias',
                    'rating' => 4.7,
                    'supports_b2b' => true,
                    'delivery' => true,
                ],
            ],

            [
                'name' => 'Comercial Nordeste Materiais Ltda',
                'trade_name' => 'Comercial Nordeste',
                'document' => '12345678000105',
                'email' => 'vendas@comercialnordeste.com.br',
                'phone' => '8130001004',
                'website' => null,
                'contact_name' => 'Carlos Menezes',
                'city' => 'Recife',
                'state' => 'PE',
                'meta' => [
                    'supplier_type' => 'regional',
                    'lead_time_days' => 1,
                    'payment_terms' => '14 dias',
                    'rating' => 4.3,
                    'supports_b2b' => true,
                    'delivery' => true,
                ],
            ],

            [
                'name' => 'Distribuidora Industrial Recife Ltda',
                'trade_name' => 'DIR',
                'document' => '12345678000106',
                'email' => 'compras@dirindustrial.com.br',
                'phone' => '8130001005',
                'website' => null,
                'contact_name' => 'Marcos Silva',
                'city' => 'Recife',
                'state' => 'PE',
                'meta' => [
                    'supplier_type' => 'industrial',
                    'lead_time_days' => 2,
                    'payment_terms' => '21 dias',
                    'rating' => 4.5,
                    'supports_b2b' => true,
                    'delivery' => true,
                ],
            ],

            [
                'name' => 'Central dos EPIs Comércio Ltda',
                'trade_name' => 'Central dos EPIs',
                'document' => '12345678000107',
                'email' => 'vendas@centraldosepis.com.br',
                'phone' => '8130001006',
                'website' => null,
                'contact_name' => 'Fernanda Rocha',
                'city' => 'Jaboatão dos Guararapes',
                'state' => 'PE',
                'meta' => [
                    'supplier_type' => 'especializado',
                    'lead_time_days' => 1,
                    'payment_terms' => '14 dias',
                    'rating' => 4.4,
                    'supports_b2b' => true,
                    'delivery' => true,
                ],
            ],

            [
                'name' => 'Atacadão da Construção Ltda',
                'trade_name' => 'Atacadão da Construção',
                'document' => '12345678000108',
                'email' => 'comercial@atacadaoconstrucao.com.br',
                'phone' => '8130001007',
                'website' => null,
                'contact_name' => 'Ricardo Souza',
                'city' => 'Olinda',
                'state' => 'PE',
                'meta' => [
                    'supplier_type' => 'atacado',
                    'lead_time_days' => 2,
                    'payment_terms' => '21 dias',
                    'rating' => 4.2,
                    'supports_b2b' => true,
                    'delivery' => true,
                ],
            ],

            [
                'name' => 'Mercado Livre Comércio Eletrônico Ltda',
                'trade_name' => 'Mercado Livre',
                'document' => '12345678000109',
                'email' => 'empresas@mercadolivre.com.br',
                'phone' => '1130001008',
                'website' => 'https://www.mercadolivre.com.br',
                'contact_name' => 'Marketplace B2B',
                'city' => 'Osasco',
                'state' => 'SP',
                'meta' => [
                    'supplier_type' => 'marketplace',
                    'lead_time_days' => 4,
                    'payment_terms' => 'à vista',
                    'rating' => 4.5,
                    'supports_b2b' => false,
                    'delivery' => true,
                ],
            ],

            [
                'name' => 'Amazon Serviços de Varejo do Brasil Ltda',
                'trade_name' => 'Amazon Brasil',
                'document' => '12345678000110',
                'email' => 'business@amazon.com.br',
                'phone' => '1130001009',
                'website' => 'https://www.amazon.com.br',
                'contact_name' => 'Amazon Business',
                'city' => 'São Paulo',
                'state' => 'SP',
                'meta' => [
                    'supplier_type' => 'marketplace',
                    'lead_time_days' => 3,
                    'payment_terms' => 'cartão/faturado',
                    'rating' => 4.6,
                    'supports_b2b' => true,
                    'delivery' => true,
                ],
            ],
            [
                'name' => 'Dimensional Engenharia e Suprimentos Industriais Ltda',
                'trade_name' => 'Dimensional',
                'document' => '12345678000111',
                'email' => 'corporativo@dimensional.com.br',
                'phone' => '1130001010',
                'website' => 'https://www.dimensional.com.br',
                'contact_name' => 'Canal Corporativo',
                'city' => 'São Paulo',
                'state' => 'SP',
                'meta' => [
                    'supplier_type' => 'industrial',
                    'lead_time_days' => 5,
                    'payment_terms' => '28 dias',
                    'rating' => 4.8,
                    'supports_b2b' => true,
                    'delivery' => true,
                ],
            ],

            [
                'name' => 'Rexel Brasil Soluções Elétricas Ltda',
                'trade_name' => 'Rexel Brasil',
                'document' => '12345678000112',
                'email' => 'vendas@rexel.com.br',
                'phone' => '1130001011',
                'website' => null,
                'contact_name' => 'Equipe Comercial',
                'city' => 'São Paulo',
                'state' => 'SP',
                'meta' => [
                    'supplier_type' => 'distribuidor',
                    'lead_time_days' => 4,
                    'payment_terms' => '28 dias',
                    'rating' => 4.7,
                    'supports_b2b' => true,
                    'delivery' => true,
                ],
            ],

            [
                'name' => 'Nordeste Ferragens e Ferramentas Ltda',
                'trade_name' => 'Nordeste Ferragens',
                'document' => '12345678000113',
                'email' => 'vendas@nordesteferragens.com.br',
                'phone' => '8130001012',
                'website' => null,
                'contact_name' => 'João Almeida',
                'city' => 'Recife',
                'state' => 'PE',
                'meta' => [
                    'supplier_type' => 'regional',
                    'lead_time_days' => 1,
                    'payment_terms' => '14 dias',
                    'rating' => 4.4,
                    'supports_b2b' => true,
                    'delivery' => true,
                ],
            ],

            [
                'name' => 'Master Suprimentos Corporativos Ltda',
                'trade_name' => 'Master Suprimentos',
                'document' => '12345678000114',
                'email' => 'compras@mastersuprimentos.com.br',
                'phone' => '8130001013',
                'website' => null,
                'contact_name' => 'Juliana Costa',
                'city' => 'Recife',
                'state' => 'PE',
                'meta' => [
                    'supplier_type' => 'corporativo',
                    'lead_time_days' => 2,
                    'payment_terms' => '21 dias',
                    'rating' => 4.3,
                    'supports_b2b' => true,
                    'delivery' => true,
                ],
            ],

            [
                'name' => 'Oficina dos Parafusos Comércio Ltda',
                'trade_name' => 'Oficina dos Parafusos',
                'document' => '12345678000115',
                'email' => 'vendas@oficinadosparafusos.com.br',
                'phone' => '8130001014',
                'website' => null,
                'contact_name' => 'Eduardo Martins',
                'city' => 'Paulista',
                'state' => 'PE',
                'meta' => [
                    'supplier_type' => 'distribuidor',
                    'lead_time_days' => 1,
                    'payment_terms' => '7 dias',
                    'rating' => 4.2,
                    'supports_b2b' => true,
                    'delivery' => false,
                ],
            ],

            [
                'name' => 'Mega Material de Construção Ltda',
                'trade_name' => 'Mega Construção',
                'document' => '12345678000116',
                'email' => 'comercial@megaconstrucao.com.br',
                'phone' => '8130001015',
                'website' => null,
                'contact_name' => 'Patrícia Gomes',
                'city' => 'Cabo de Santo Agostinho',
                'state' => 'PE',
                'meta' => [
                    'supplier_type' => 'atacado',
                    'lead_time_days' => 1,
                    'payment_terms' => '14 dias',
                    'rating' => 4.1,
                    'supports_b2b' => true,
                    'delivery' => true,
                ],
            ],

            [
                'name' => 'Casa Elétrica Pernambuco Ltda',
                'trade_name' => 'Casa Elétrica PE',
                'document' => '12345678000117',
                'email' => 'vendas@casaeletricape.com.br',
                'phone' => '8130001016',
                'website' => null,
                'contact_name' => 'André Melo',
                'city' => 'Recife',
                'state' => 'PE',
                'meta' => [
                    'supplier_type' => 'especializado',
                    'lead_time_days' => 1,
                    'payment_terms' => '14 dias',
                    'rating' => 4.5,
                    'supports_b2b' => true,
                    'delivery' => true,
                ],
            ],

            [
                'name' => 'Hidrotubos Soluções Hidráulicas Ltda',
                'trade_name' => 'Hidrotubos',
                'document' => '12345678000118',
                'email' => 'comercial@hidrotubos.com.br',
                'phone' => '8130001017',
                'website' => null,
                'contact_name' => 'Mariana Farias',
                'city' => 'Recife',
                'state' => 'PE',
                'meta' => [
                    'supplier_type' => 'especializado',
                    'lead_time_days' => 2,
                    'payment_terms' => '21 dias',
                    'rating' => 4.4,
                    'supports_b2b' => true,
                    'delivery' => true,
                ],
            ],

            [
                'name' => 'Central Industrial Nordeste Ltda',
                'trade_name' => 'Central Industrial',
                'document' => '12345678000119',
                'email' => 'vendas@centralindustrial.com.br',
                'phone' => '8130001018',
                'website' => null,
                'contact_name' => 'Roberto Lima',
                'city' => 'Jaboatão dos Guararapes',
                'state' => 'PE',
                'meta' => [
                    'supplier_type' => 'industrial',
                    'lead_time_days' => 3,
                    'payment_terms' => '28 dias',
                    'rating' => 4.6,
                    'supports_b2b' => true,
                    'delivery' => true,
                ],
            ],

            [
                'name' => 'Office Solutions Corporativo Ltda',
                'trade_name' => 'Office Solutions',
                'document' => '12345678000120',
                'email' => 'empresas@officesolutions.com.br',
                'phone' => '1130001019',
                'website' => null,
                'contact_name' => 'Equipe Comercial',
                'city' => 'São Paulo',
                'state' => 'SP',
                'meta' => [
                    'supplier_type' => 'corporativo',
                    'lead_time_days' => 3,
                    'payment_terms' => '30 dias',
                    'rating' => 4.3,
                    'supports_b2b' => true,
                    'delivery' => true,
                ],
            ],
        ];

        foreach ($providers as $providerData) {
            Provider::firstOrCreate(
                [
                    'document' => $providerData['document'],
                ],
                [
                    ...$providerData,
                    'active' => true,
                ]
            );
        }
    }
}
