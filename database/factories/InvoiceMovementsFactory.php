<?php

namespace Database\Factories;

use App\Enum\InvoiceMovementEnum;
use App\Models\Invoice;
use App\Models\InvoiceMovements;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<InvoiceMovements>
 */
class InvoiceMovementsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'uuid' => (string) Str::uuid(),
            'invoice_id' => Invoice::inRandomOrder()->value('id'),
            'user_id' => User::inRandomOrder()->value('id'),
            'type' => $this->faker->randomElement(InvoiceMovementEnum::cases())->value,
            'is_approved' => false,
            'performed_at' => now(),
            'notes' => $this->faker->optional()->sentence(),
        ];
    }

    public function approved()
    {
        return $this->state(fn() => [
            'type' => InvoiceMovementEnum::APPROVED->value,
            'is_approved' => true,
        ]);
    }
}
