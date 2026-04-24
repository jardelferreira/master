<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Invoice;
use App\Models\User;
use App\Services\InvoiceMovementService;

class InvoiceSeeder extends Seeder
{
    public function run(): void
    {
        $movementService = app(InvoiceMovementService::class);
        $users = User::pluck('id');

        foreach (range(1, 50) as $i) {
            $userId = $users->random();

            $invoice = Invoice::factory()->issued()->create([
                'user_id' => $userId,
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
                    $invoice = $movementService->complete($invoice, $userId);
                    break;

                case 'cancelled':
                    $movementService->cancel($invoice, $userId);
                    break;

                case 'observation':
                    $movementService->markAsObservation(
                        $invoice,
                        $userId,
                        'Problema no pagamento'
                    );
                    break;

                case 'returned':
                    // ✅ issued → paid → returned
                    $invoice = $movementService->markAsPaid($invoice, $userId);
                    $movementService->returnToProvider($invoice, $userId);
                    break;
            }
        }
    }
}