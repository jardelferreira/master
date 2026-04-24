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
         // massa de dados
        Provider::factory()
            ->count(10)
            ->create();

        // alguns inativos
        Provider::factory()
            ->count(10)
            ->inactive()
            ->create();

        // fornecedor fixo (útil pra testes)
        Provider::create([
            'uuid' => \Illuminate\Support\Str::uuid(),
            'name' => 'Fornecedor Padrão LTDA',
            'trade_name' => 'Fornecedor Padrão',
            'document' => '00000000000100',
            'email' => 'contato@fornecedor.com',
            'phone' => '(85) 99999-9999',
            'website' => 'https://fornecedor.com',
            'contact_name' => 'João Silva',
            'city' => 'Fortaleza',
            'state' => 'CE',
            'active' => true,
            'meta' => [
                'type' => 'principal'
            ],
        ]);
    }
}
