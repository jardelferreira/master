<?php

namespace Database\Factories;

use App\Models\InvoiceItem;
use App\Models\Product;
use App\Models\Provider;
use App\Models\User;
use App\Enum\InvoiceItemDeliveryStatusEnum;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class InvoiceItemFactory extends Factory
{
    protected $model = InvoiceItem::class;

    public function definition(): array
    {
        $product = Product::inRandomOrder()->first();
        $provider = Provider::inRandomOrder()->first();
        $user = User::inRandomOrder()->first();

        $quantity = $this->faker->randomFloat(2, 1, 50);
        $unitPrice = $this->faker->randomFloat(2, 10, 500);

        return [
            'uuid' => (string) Str::uuid(),

            // ⚠️ NÃO definir invoice_id aqui (usar ->for())
            'product_id' => $product->id,
            'provider_id' => $provider->id,
            'user_id' => $user->id,

            'product_name' => $product->name,
            'provider_name' => $provider->name,

            'description' => $this->faker->sentence(),
            'ca_number' => $this->faker->optional()->numerify('CA-#####'),

            'quantity' => $quantity,
            'unit_price' => $unitPrice,
            'total' => round($quantity * $unitPrice, 2),

            'unit' => $product->unit,

            'discount' => 0,
            'tax' => 0,

            'delivery_status' => InvoiceItemDeliveryStatusEnum::PENDING->value,

            'meta' => [
                'seeded' => true,
            ],
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | STATES úteis (opcional)
    |--------------------------------------------------------------------------
    */

    public function partialDelivered(): static
    {
        return $this->state(fn () => [
            'delivery_status' => InvoiceItemDeliveryStatusEnum::PARTIALLY_DELIVERED->value,
        ]);
    }

    public function delivered(): static
    {
        return $this->state(fn () => [
            'delivery_status' => InvoiceItemDeliveryStatusEnum::DELIVERED->value,
        ]);
    }
}