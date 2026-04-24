<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Stock;
use App\Models\User;
use App\Services\StockMovementService;

class StockOutSeeder extends Seeder
{
    public function run(): void
    {
        $movementService = app(StockMovementService::class);

        $stocks = Stock::where('stock_quantity', '>', 0)->get();
        $users = User::pluck('id');

        foreach ($stocks as $stock) {

            // evita estoque muito pequeno
            if ($stock->stock_quantity <= 0) {
                continue;
            }

            /*
            |--------------------------------------------------------------------------
            | Define cenário
            |--------------------------------------------------------------------------
            */
            $scenario = fake()->randomElement([
                'consume',
                'assign',
                'loss',
            ]);

            // até 70% do estoque
            $max = $stock->stock_quantity * 0.7;

            if ($max <= 0) continue;

            $quantity = round(fake()->randomFloat(3, 1, $max), 3);

            try {

                switch ($scenario) {

                    /*
                    |--------------------------------------------------------------------------
                    | CONSUMO (uso normal)
                    |--------------------------------------------------------------------------
                    */
                    case 'consume':

                        $movementService->consume(
                            $stock,
                            $quantity,
                            $users->random(),
                            ['source' => 'seed']
                        );

                        break;

                    /*
                    |--------------------------------------------------------------------------
                    | ATRIBUIÇÃO (entrega para usuário)
                    |--------------------------------------------------------------------------
                    */
                    case 'assign':

                        $movementService->assignToUser(
                            $stock,
                            $quantity,
                            $users->random(), // destino
                            $users->random()  // executor
                        );

                        break;

                    /*
                    |--------------------------------------------------------------------------
                    | PERDA / DESCARTE
                    |--------------------------------------------------------------------------
                    */
                    case 'loss':

                        $movementService->adjust(
                            $stock,
                            max(0, $stock->stock_quantity - $quantity),
                            $users->random()
                        );

                        break;
                }

            } catch (\Throwable $e) {
                // evita quebrar seed
                logger()->warning('StockOutSeeder error', [
                    'stock_id' => $stock->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }
    }
}