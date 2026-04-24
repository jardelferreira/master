<?php

namespace Database\Factories;

use App\Models\StockMinimal;
use App\Models\Product;
use App\Models\Project;
use App\Models\Sector;
use Illuminate\Database\Eloquent\Factories\Factory;

class StockMinimalFactory extends Factory
{
    protected $model = StockMinimal::class;

    public function definition(): array
    {
        return [
            'product_id' => Product::inRandomOrder()->value('id'),
            'project_id' => null,
            'sector_id' => null,
            'min_quantity' => $this->faker->randomFloat(3, 1, 50),
            'meta' => ['seeded' => true],
        ];
    }

    public function forProject(): static
    {
        return $this->state(fn () => [
            'project_id' => Project::inRandomOrder()->value('id'),
        ]);
    }

    public function forSector(): static
    {
        return $this->state(fn () => [
            'sector_id' => Sector::inRandomOrder()->value('id'),
        ]);
    }
}