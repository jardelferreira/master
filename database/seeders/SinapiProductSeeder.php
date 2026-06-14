<?php

namespace Database\Seeders;

use App\Enum\ProductUnitEnum;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class SinapiProductSeeder extends Seeder
{
    private const CHUNK_SIZE = 500;

    public function run(): void
    {
        $file = database_path(
            'seeders/data/sinapi_insumos.json'
        );

        if (! file_exists($file)) {
            throw new \RuntimeException(
                "Arquivo não encontrado: {$file}"
            );
        }

        $category = Category::query()
            ->firstOrCreate(
                [
                    'name' => 'Importado SINAPI',
                ],
                [
                    'description' => 'Produtos importados do SINAPI',
                    'active' => true,
                ]
            );

        $products = json_decode(
            file_get_contents($file),
            true
        );

        if (! is_array($products)) {
            throw new \RuntimeException(
                'JSON inválido.'
            );
        }

        $this->command->info(
            'Total de registros: '
                . count($products)
        );

        collect($products)
            ->chunk(self::CHUNK_SIZE)
            ->each(function ($chunk, $index) use ($category) {

                $this->command->info(
                    'Processando lote '
                        . ($index + 1)
                );

                foreach ($chunk as $item) {

                    $codigo = trim(
                        $item['codigo'] ?? ''
                    );

                    $descricao = trim(
                        $item['descricao'] ?? ''
                    );

                    if (
                        empty($codigo)
                        || empty($descricao)
                    ) {
                        continue;
                    }

                    Product::updateOrCreate(

                        [
                            'sku' => 'SINAPI-' . $codigo,
                        ],

                        [
                            'uuid' => (string) Str::uuid(),

                            'name' => Str::limit($descricao, 255,''),

                            'slug' => $this->generateSlug($descricao, $codigo),

                            'description' =>
                            $item['informacoes'] ?? null,

                            'category_id' =>
                            $category->id,

                            'unit' => $this->resolveUnit(
                                $item['unidade'] ?? 'UN'
                            ),

                            'active' => true,

                            'meta' => [
                                'source' => 'SINAPI',

                                'sinapi_code' =>
                                $codigo,

                                'normas' =>
                                $item['normas'] ?? null,

                                'pagina' =>
                                $item['pagina'] ?? null,

                                'atualizado_em' =>
                                $item['atualizado_em'] ?? null,

                                'original_unit' =>
                                $item['unidade'] ?? null,
                            ],
                        ]
                    );
                }
            });

        $this->command->info(
            'Importação concluída.'
        );
    }

    private function resolveUnit(
        string $unit
    ): string {

        return match (strtoupper(trim($unit))) {

            'UN' => ProductUnitEnum::UNIT->value,

            'CJ' => ProductUnitEnum::SET->value,

            'JG' => ProductUnitEnum::GAME->value,

            'PAR' => ProductUnitEnum::PAIR->value,

            'KG' => ProductUnitEnum::KG->value,

            'T' => ProductUnitEnum::TON->value,

            'M' => ProductUnitEnum::M->value,

            'M2' => ProductUnitEnum::M2->value,

            'M3' => ProductUnitEnum::M3->value,

            'L' => ProductUnitEnum::L->value,

            'H' => ProductUnitEnum::HOUR->value,

            'DIA' => ProductUnitEnum::DAY->value,

            'MES' => ProductUnitEnum::MONTH->value,

            'CENTO' => ProductUnitEnum::HUNDRED->value,

            'MIL' => ProductUnitEnum::THOUSAND->value,

            'KWH' => ProductUnitEnum::KWH->value,

            default => ProductUnitEnum::UNIT->value,
        };
    }
    private function generateSlug(
        string $name,
        string $codigo
    ): string {

        $slug = Str::slug($name);

        $suffix = '-' . $codigo;

        return Str::limit(
            $slug,
            255 - strlen($suffix),
            ''
        ) . $suffix;
    }
}
