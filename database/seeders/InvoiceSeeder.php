<?php

namespace Database\Seeders;

use App\Models\Invoice;
use App\Models\Project;
use App\Models\Provider;
use App\Models\Sector;
use App\Models\User;
use App\Services\InvoiceMovementService;
use Illuminate\Database\Seeder;

class InvoiceSeeder extends Seeder
{
    public function run(): void
    {
        $movementService = app(InvoiceMovementService::class);

        $users = User::pluck('id');
        $providers = Provider::all();
        $projects = Project::with('sectors')->get();

        if (
            $users->isEmpty() ||
            $providers->isEmpty() ||
            $projects->isEmpty()
        ) {
            return;
        }

        foreach (range(1, 60) as $i) {

            $userId = $users->random();

            $provider = $providers->random();

            $project = $projects->random();

            $sector = $project->sectors->isNotEmpty()
                ? $project->sectors->random()
                : Sector::inRandomOrder()->first();

            if (! $sector) {
                continue;
            }

            $subtotal = fake()->randomFloat(2, 150, 15000);
            $taxes = round($subtotal * fake()->randomFloat(2, 0.03, 0.18), 2);
            $discount = fake()->boolean(35)
                ? fake()->randomFloat(2, 0, $subtotal * 0.10)
                : 0;

            $invoice = Invoice::create([
                'project_id' => $project->id,
                'sector_id' => $sector->id,
                'provider_id' => $provider->id,
                'user_id' => $userId,

                'number' => str_pad((string) fake()->unique()->numberBetween(1000, 999999), 6, '0', STR_PAD_LEFT),
                'series' => fake()->numerify('####'),

                'access_key' => fake()->numerify(
                    '##############################'
                ),

                'type' => fake()->randomElement([
                    'nf',
                    'nf',
                    'nf',
                    'nf',
                    'cupom',
                    'fatura',
                ]),

                'status' => 'issued',

                'total' => $subtotal,
                'taxes' => $taxes,
                'discount' => $discount,

                'issued_at' => fake()->dateTimeBetween('-6 months', 'now'),

                'due_at' => fake()->dateTimeBetween('now', '+45 days'),

                'meta' => [
                    'supplier_type' => $provider->meta['supplier_type'] ?? null,
                    'seeded' => true,
                    'source' => 'invoice_seeder',
                ],
            ]);

            $scenario = fake()->randomElement([
                'issued',
                'paid',
                'completed',
                'cancelled',
                'observation',
                'returned',
            ]);

            switch ($scenario) {

                case 'issued':
                    break;

                case 'paid':
                    $movementService->markAsPaid($invoice, $userId);
                    break;

                case 'completed':
                    $invoice = $movementService->markAsPaid($invoice, $userId);
                    $movementService->complete($invoice, $userId);
                    break;

                case 'cancelled':
                    $movementService->cancel($invoice, $userId);
                    break;

                case 'observation':
                    $movementService->markAsObservation(
                        $invoice,
                        $userId,
                        'Divergência fiscal identificada'
                    );
                    break;

                case 'returned':
                    $invoice = $movementService->markAsPaid($invoice, $userId);
                    $movementService->returnToProvider($invoice, $userId);
                    break;
            }
        }
    }
}