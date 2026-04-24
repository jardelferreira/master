<?php

namespace Database\Factories;

use App\Models\Stock;
use App\Models\StockMovement;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<StockMovement>
 */
class StockMovementFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $stock = Stock::inRandomOrder()->first();

        $quantity = $this->faker->randomFloat(3, 1, 50);

        return [
            'uuid' => (string) Str::uuid(),

            'stock_id' => $stock?->id,
            'product_id' => $stock?->product_id,

            'quantity' => $quantity,

            'type' => 'in',
            'direction' => 'in',

            'balance_after' => $quantity,

            'performed_at' => now(),

            'user_id' => User::inRandomOrder()->value('id'),

            'notes' => 'Factory movement',
        ];
    }
}
