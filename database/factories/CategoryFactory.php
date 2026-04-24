<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->unique()->words(2, true);

        return [
            'uuid' => (string) Str::uuid(),
            'name' => ucfirst($name),
            'slug' => Str::slug($name),
            'parent_id' => null,
            'description' => $this->faker->optional()->sentence(),
            'active' => $this->faker->boolean(90),
            'meta' => [
                'color' => $this->faker->safeColorName(),
            ],
        ];
    }

    /**
     * Estado para categorias filhas
     */
    public function child(int $parentId)
    {
        return $this->state(fn () => [
            'parent_id' => $parentId,
        ]);
    }

    /**
     * Inativa
     */
    public function inactive()
    {
        return $this->state(fn () => [
            'active' => false,
        ]);
    }
    
}
