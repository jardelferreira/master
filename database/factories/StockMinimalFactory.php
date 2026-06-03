<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Project;
use App\Models\Sector;
use App\Models\StockMinimal;
use Illuminate\Database\Eloquent\Factories\Factory;

class StockMinimalFactory extends Factory
{
    protected $model = StockMinimal::class;

    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'project_id' => null,
            'sector_id' => null,
            'min_quantity' => $this->faker->randomFloat(3, 1, 50),
            'meta' => ['seeded' => true],
        ];
    }

    public function forProject(?Project $project = null): static
    {
        return $this->state(fn (array $attributes) => [
            'project_id' => $project?->id ?? Project::factory(),
            'sector_id' => null,
        ]);
    }

    public function forSector(?Sector $sector = null): static
    {
        return $this->state(fn (array $attributes) => [
            'sector_id' => $sector?->id ?? Sector::factory(),
            'project_id' => $sector?->project_id ?? $attributes['project_id'],
        ]);
    }
}
