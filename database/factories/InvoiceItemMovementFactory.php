<?php

namespace Database\Factories;

use App\Enum\InvoiceItemMovementReasonEnum;
use App\Enum\InvoiceMovementEnum;
use App\Models\InvoiceItem;
use App\Models\Model;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Model>
 */
class InvoiceItemMovementFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $invoiceItem = InvoiceItem::inRandomOrder()->first();

        return [
            'uuid' => (string) Str::uuid(),

            'invoice_item_id' => $invoiceItem?->id ?? InvoiceItem::factory(),
            'user_id' => User::inRandomOrder()->value('id'),

            'quantity' => $this->faker->randomFloat(3, 1, 50),

            'type' => $this->faker->randomElement([
                InvoiceMovementEnum::RECEIVED->value,
                InvoiceMovementEnum::INSPECTED->value,
            ]),

            'reason' => null,

            'performed_at' => now(),

            'notes' => $this->faker->optional()->sentence(),
        ];
    }

    public function received()
    {
        return $this->state(fn() => [
            'type' => InvoiceMovementEnum::RECEIVED->value,
        ]);
    }

    public function inspected()
    {
        return $this->state(fn() => [
            'type' => InvoiceMovementEnum::INSPECTED->value,
        ]);
    }

    public function rejected()
    {
        return $this->state(fn() => [
            'type' => InvoiceMovementEnum::REJECTED->value,
            'reason' => fake()->randomElement(InvoiceItemMovementReasonEnum::cases())->value,
        ]);
    }

    public function approved()
    {
        return $this->state(fn() => [
            'type' => InvoiceMovementEnum::APPROVED->value,
        ]);
    }
}
