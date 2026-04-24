<?php

namespace Database\Factories;

use App\Models\Provider;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Provider>
 */
class ProviderFactory extends Factory
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

            'name' => $this->faker->company(),
            'trade_name' => $this->faker->optional()->company(),

            // CPF ou CNPJ fake (formato simples)
            'document' => $this->faker->unique()->numerify('###########'),

            'email' => $this->faker->optional()->companyEmail(),
            'phone' => $this->faker->optional()->phoneNumber(),
            'website' => $this->faker->optional()->url(),
            'contact_name' => $this->faker->optional()->name(),

            'city' => $this->faker->city(),
            'state' => $this->faker->stateAbbr(),

            'active' => $this->faker->boolean(90),

            'meta' => [
                'notes' => $this->faker->optional()->sentence(),
            ],
        ];
    }
    /**
     * Estado para fornecedores inativos
     */
    public function inactive()
    {
        return $this->state(fn () => [
            'active' => false,
        ]);
    }
}
