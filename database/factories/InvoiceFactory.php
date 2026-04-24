<?php

namespace Database\Factories;

use App\Enum\InvoiceStatusEnum;
use App\Enum\InvoiceTypeEnum;
use App\Models\Provider;
use App\Models\Sector;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class InvoiceFactory extends Factory
{
    protected static $sectors;

    public function definition(): array
    {
        $number = $this->faker->unique()->numerify('######');
        $series = $this->faker->numerify('###');

        self::$sectors ??= Sector::select('id', 'project_id')->get();
        $sector = self::$sectors->random();

        $issued = $this->faker->dateTimeBetween('-6 months', '-5 days');
        $due = $this->faker->dateTimeBetween($issued, '+30 days');

        $total = $this->faker->randomFloat(2, 100, 10000);
        $taxes = $this->faker->randomFloat(2, 0, $total * 0.2);
        $discount = $this->faker->randomFloat(2, 0, $total * 0.1);

        return [
            'uuid' => (string) Str::uuid(),
            'slug' => Str::slug("nf-{$number}-{$series}-" . uniqid()),

            'project_id' => $sector->project_id,
            'sector_id' => $sector->id,

            'provider_id' => Provider::inRandomOrder()->value('id'),
            'user_id' => User::inRandomOrder()->value('id'),

            'number' => $number,
            'series' => $series,
            'access_key' => $this->faker->optional()->numerify(str_repeat('#', 44)),

            'type' => InvoiceTypeEnum::NF->value,

            // 🔥 sempre começa como ISSUED
            'status' => InvoiceStatusEnum::ISSUED->value,

            'total' => $total,
            'taxes' => $taxes,
            'discount' => $discount,

            'issued_at' => $issued,
            'due_at' => $due,

            'paid_at' => null,
            'cancelled_at' => null,

            'meta' => [
                'seeded' => true,
            ],
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | STATES (cenários reais)
    |--------------------------------------------------------------------------
    */

    public function issued(): static
    {
        return $this->state(fn () => [
            'status' => InvoiceStatusEnum::ISSUED->value,
            'paid_at' => null,
        ]);
    }

    public function paid(): static
    {
        return $this->state(function () {
            return [
                'status' => InvoiceStatusEnum::PAID->value,
                'paid_at' => now(),
            ];
        });
    }

    public function completed(): static
    {
        return $this->state(function () {
            return [
                'status' => InvoiceStatusEnum::COMPLETED->value,
                'paid_at' => now(),
            ];
        });
    }

    public function cancelled(): static
    {
        return $this->state(fn () => [
            'status' => InvoiceStatusEnum::CANCELLED->value,
            'cancelled_at' => now(),
        ]);
    }

    public function observation(): static
    {
        return $this->state(fn () => [
            'status' => InvoiceStatusEnum::OBSERVATION->value,
        ]);
    }

    public function returned(): static
    {
        return $this->state(fn () => [
            'status' => InvoiceStatusEnum::RETURNED->value,
        ]);
    }
}