<?php

namespace Database\Factories;

use App\Enum\ProductUnitEnum;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->unique()->words(3, true);

        return [
            'uuid' => (string) Str::uuid(),
            'name' => ucfirst($name),
            'slug' => Str::slug($name),
            'description' => $this->faker->optional()->sentence(),
            'category_id' => Category::inRandomOrder()->value('id'),
            // pega um valor aleatório do enum
            'unit' => $this->faker->randomElement(ProductUnitEnum::cases())->value,
            'sku' => $this->faker->optional()->bothify('SKU-#####'),
            'active' => $this->faker->boolean(90),
            'meta' => [
                'brand' => $this->faker->company(),
                'origin' => $this->faker->country(),
            ],
        ];
    }
    public function inactive()
    {
        return $this->state(fn () => [
            'active' => false,
        ]);
    }
}
